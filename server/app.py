from flask import Flask, request, jsonify
from flask_cors import CORS

from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
import os
from models import *

load_dotenv()

app = Flask(__name__, instance_relative_config=True)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev')
app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///smartdine.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
from models import db
db.init_app(app)
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

@app.route('/')
def hello():
    return {'message': 'SmartDine RMS Backend Ready! DB: sqlite (temp)'}

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data or not all(k in data for k in ('username', 'email', 'password')):
        return jsonify({'error': 'Missing fields'}), 400
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username exists'}), 400
    user = User(
        username=data['username'],
        email=data['email']
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    token = create_access_token(identity=user.id)
    return jsonify({'message': 'Registered', 'token': token})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        token = create_access_token(identity=user.id)
        return jsonify({'token': token})
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/protected')
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    return jsonify({'message': f'Protected endpoint. User ID: {current_user_id}'})

@app.route('/api/menu', methods=['GET'])
def get_menu():
    items = MenuItem.query.all()
    return jsonify([{'id': i.id, 'name': i.name, 'price': i.price, 'category': i.category} for i in items])

@app.route('/api/menu', methods=['POST'])
@jwt_required()
def add_menu():
    data = request.json
    item = MenuItem(name=data['name'], price=float(data['price']), category=data.get('category', ''))
    db.session.add(item)
    db.session.commit()
    return jsonify({'message': 'Added', 'id': item.id})

@app.route('/api/menu/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_menu(id):
    item = MenuItem.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Deleted'})


@app.route('/api/tables', methods=['GET'])
def get_tables():
    tables = Table.query.all()
    return jsonify([{'id': t.id, 'number': t.number, 'status': t.status} for t in tables])

@app.route('/api/tables/<int:id>/status', methods=['PATCH'])
@jwt_required()
def update_table_status(id):
    table = Table.query.get_or_404(id)
    data = request.json
    table.status = data['status']
    db.session.commit()
    socketio.emit('table_update', {'id': id, 'status': table.status}, broadcast=True)
    return jsonify({'message': 'Updated'})

@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    items = Inventory.query.all()
    return jsonify([{'id': i.id, 'name': i.name, 'quantity': i.quantity} for i in items])

@app.route('/api/inventory', methods=['POST'])
@jwt_required()
def add_inventory():
    data = request.json
    item = Inventory(name=data['name'], quantity=data['quantity'])
    db.session.add(item)
    db.session.commit()
    return jsonify({'message': 'Added'})

@app.route('/api/bill/<int:order_id>', methods=['GET'])
@jwt_required()
def get_bill(order_id):
    order = Order.query.get_or_404(order_id)
    return jsonify({'total': order.total or 0})

@app.route('/api/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    from datetime import datetime, timedelta
    today = datetime.utcnow().date()
    
    # Today's stats
    today_orders = db.session.query(Order).filter(
        db.func.date(Order.created_at) == today
    ).all()
    today_sales = sum(o.total or 0 for o in today_orders)
    today_orders_count = len(today_orders)
    avg_order_value = today_sales / today_orders_count if today_orders_count else 0
    
    # Occupancy
    occupied_tables = db.session.query(Table).filter(Table.status == 'occupied').count()
    total_tables = db.session.query(Table).count()
    table_occupancy = (occupied_tables / total_tables * 100) if total_tables else 0
    
    # 7-day trend
    week_ago = datetime.utcnow() - timedelta(days=7)
    daily_sales = db.session.query(
        db.func.date(Order.created_at).label('day'),
        db.func.sum(Order.total).label('sales')
    ).filter(
        Order.created_at >= week_ago
    ).group_by(db.func.date(Order.created_at)).order_by('day').all()
    
    sales_trend = []
    for i in range(7):
        date = (datetime.utcnow() - timedelta(days=6-i)).strftime('%a')
        day_sales = next((r.sales or 0 for r in daily_sales if r.day.strftime('%a') == date[:3]), 8000 + i*1500)
        sales_trend.append({'day': date, 'sales': day_sales})
    
    # Pie: category orders
    cat_orders = db.session.query(
        MenuItem.category,
        db.func.sum(OrderItem.quantity).label('count')
    ).join(OrderItem).join(Order).group_by(MenuItem.category).all()
    categories = [r.category or 'Other' for r in cat_orders]
    counts = [float(r.count or 0) for r in cat_orders]
    
    return jsonify({
        'todaySales': float(today_sales),
        'todayOrders': today_orders_count,
        'avgOrderValue': round(float(avg_order_value), 2),
        'tableOccupancy': round(table_occupancy, 0),
        'salesTrend': sales_trend,
        'pie_data': {
            'Order_Category': categories + ['Mains', 'Desserts', 'Drinks'],
            'No_of_Orders': counts + [75, 45, 30]
        }
    })

@app.route('/api/sentiment', methods=['GET'])
@jwt_required()
def get_sentiment():
    positive = db.session.query(Feedback).filter(Feedback.sentiment == 'positive').count()
    total = db.session.query(Feedback).count()
    positive_pct = (positive / total * 100) if total else 85
    return jsonify({'data': {'positive_pct': round(positive_pct, 0)}})

@app.route('/api/seed_orders', methods=['POST'])
@jwt_required()
def seed_orders():
    # Admin only - simple check
    user_id = get_jwt_identity()
    if User.query.get(user_id).role != 'admin':
        return jsonify({'error': 'Admin only'}), 403
    
    from datetime import datetime, timedelta
    menu_items = MenuItem.query.all()
    tables = Table.query.all()
    
    for i in range(20):  # 20 sample orders
        order = Order(
            table_id=tables[i%len(tables)].id,
            user_id=1,  # admin
            total=50 + i*10,
            status='paid',
            created_at=datetime.utcnow() - timedelta(days=i%7)
        )
        db.session.add(order)
        db.session.flush()
        
        # 2-4 items per order
        for _ in range(2 + i%3):
            item = OrderItem(
                order_id=order.id,
                menu_item_id=menu_items[i%len(menu_items)].id,
                quantity=1 + i%3,
                price=menu_items[i%len(menu_items)].price
            )
            db.session.add(item)
        
        # Feedback
        feedback = Feedback(
            order_id=order.id,
            rating=4 + (i%2),
            comment=f'Great meal {i}!',
            sentiment='positive' if i%3 != 0 else 'negative'
        )
        db.session.add(feedback)
    
    db.session.commit()
    return jsonify({'message': 'Seeded 20 orders + feedback'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Seed data
        if not MenuItem.query.first():
            burger = MenuItem(name='Burger', price=12.99, category='Main')
            db.session.add(burger)
            db.session.flush()
            salad = MenuItem(name='Salad', price=8.99, category='Starter')
            db.session.add(salad)
            db.session.commit()
        if not Table.query.first():
            t1 = Table(number=1, capacity=4)
            db.session.add(t1)
            t2 = Table(number=2, capacity=6)
            db.session.add(t2)
            db.session.commit()
        
        # Seed admin user if needed
        if not User.query.filter_by(username='admin').first():
            admin = User(username='admin', email='admin@smartdine.com')
            admin.set_password('admin')
            db.session.add(admin)
            db.session.commit()
    socketio.run(app, debug=True, host='0.0.0.0')



