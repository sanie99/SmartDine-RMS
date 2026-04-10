import pandas as pd
import re
import nltk
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, accuracy_score
import joblib
import os

dataset = pd.read_csv('./database/sentiment_analysis_dataset.csv')

encoder = LabelEncoder()
dataset['Sentiment Label'] = encoder.fit_transform(dataset['Sentiment Label'])

lemmatizer = WordNetLemmatizer()
all_stopwords = stopwords.words('english')
all_stopwords.remove('not')

corpus = []
for i in range(len(dataset)):
    review = re.sub('[^a-zA-Z0-9]',' ', dataset['Review Text'][i])
    review = review.lower()
    review = review.split()
    review = [lemmatizer.lemmatize(word) for word in review if not word in set(all_stopwords)]
    review = ' '.join(review)
    corpus.append(review)

vectorizer = TfidfVectorizer(max_features = 1500)
X = vectorizer.fit_transform(corpus).toarray()
y = dataset['Sentiment Label']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.25, random_state = 0)

classifierLR = LogisticRegression()
classifierLR.fit(X_train, y_train)
y_pred_LR = classifierLR.predict(X_test)

cm_LR = confusion_matrix(y_test, y_pred_LR)
accuracy_LR = accuracy_score(y_test, y_pred_LR)
print("Accuracy:", accuracy_LR)
print("Confusion Matrix:\\n", cm_LR)

os.makedirs('models', exist_ok=True)
joblib.dump(classifierLR, 'models/sentiment_classifier.pkl')
joblib.dump(vectorizer, 'models/sentiment_vectorizer.pkl')
joblib.dump(encoder, 'models/sentiment_encoder.pkl')
print("Models saved!")
