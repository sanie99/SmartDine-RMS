from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Sentiment Analysis")

import os
import re
import pandas as pd
import nltk
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from pydantic import BaseModel
from fastapi import FastAPI
import joblib
import numpy as np

app = FastAPI(title="Sentiment Analysis")

class Feedback(BaseModel):
    text: str

models_dir = 'models'
os.makedirs(models_dir, exist_ok=True)

# Global model vars
classifierLR = None
vectorizer = None
encoder = None

def preprocess_text(text):
    lemmatizer = WordNetLemmatizer()
    all_stopwords = stopwords.words('english')
    all_stopwords.remove('not')
    review = re.sub('[^a-zA-Z0-9]',' ', text)
    review = review.lower()
    review = review.split()
    review = [lemmatizer.lemmatize(word) for word in review if word not in set(all_stopwords)]
    return ' '.join(review)

def train_model():
    global classifierLR, vectorizer, encoder
    dataset = pd.read_csv('./database/sentiment_analysis_dataset.csv')
    encoder_loc = LabelEncoder()
    dataset['Sentiment Label'] = encoder_loc.fit_transform(dataset['Sentiment Label'])

    corpus = []
    lemmatizer = WordNetLemmatizer()
    all_stopwords = stopwords.words('english')
    all_stopwords.remove('not')

    for i in range(len(dataset)):
        review = re.sub('[^a-zA-Z0-9]',' ', dataset['Review Text'][i])
        review = review.lower()
        review = review.split()
        review = [lemmatizer.lemmatize(word) for word in review if not word in set(all_stopwords)]
        review = ' '.join(review)
        corpus.append(review)

    vectorizer_loc = TfidfVectorizer(max_features = 1500)
    X = vectorizer_loc.fit_transform(corpus).toarray()
    y = dataset['Sentiment Label']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.25, random_state = 0)

    classifier_loc = LogisticRegression()
    classifier_loc.fit(X_train, y_train)

    joblib.dump(classifier_loc, f'{models_dir}/sentiment_classifier.pkl')
    joblib.dump(vectorizer_loc, f'{models_dir}/sentiment_vectorizer.pkl')
    joblib.dump(encoder_loc, f'{models_dir}/sentiment_encoder.pkl')

    print("Models trained and saved!")
    print("Accuracy:", (classifier_loc.score(X_test, y_test)))

    classifierLR = classifier_loc
    vectorizer = vectorizer_loc
    encoder = encoder_loc

@app.on_event("startup")
async def load_or_train_models():
    global classifierLR, vectorizer, encoder
    classifier_path = f'{models_dir}/sentiment_classifier.pkl'
    if os.path.exists(classifier_path):
        classifierLR = joblib.load(classifier_path)
        vectorizer = joblib.load(f'{models_dir}/sentiment_vectorizer.pkl')
        encoder = joblib.load(f'{models_dir}/sentiment_encoder.pkl')
        print("Models loaded!")
    else:
        print("No models found, training...")
        train_model()

@app.get("/")
def read_root():
    return {"msg": "Sentiment Analysis Ready", "models_loaded": classifierLR is not None}

@app.post("/analyze")
def analyze(feedback: Feedback):
    if classifierLR is None:
        return {"error": "Models not loaded"}
    processed = preprocess_text(feedback.text)
    X = vectorizer.transform([processed]).toarray()
    pred = classifierLR.predict(X)[0]
    prob = classifierLR.predict_proba(X)[0]
    sentiment = encoder.inverse_transform([pred])[0]
    confidence = max(prob) * 100
    return {"sentiment": sentiment, "confidence": round(confidence, 2)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)

