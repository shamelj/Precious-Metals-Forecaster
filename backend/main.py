from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text
import os
#from auth.endpoints import auth
#from auth.middleware import AuthenticateMiddleware
import requests
from datetime import datetime, date
import json
import sqlite3
from Predictor import Predictor

from flask_apscheduler import APScheduler


app = Flask(__name__)

db_name = 'gsg_project_database'
db_user = 'gsg_project_user'
db_pass = 'root'

API_KEY1 = 'eb80225495f4ff80c472d50dea711848&base'
API_KEY2 = '60a4942d19e163dbd2503f533c137936'

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///site.db'
#app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{db_user}:{db_pass}@localhost:5000/{db_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)
app.app_context().push()




#app.register_blueprint(auth, url_prefix='/auth')
#app.wsgi_app = AuthenticateMiddleware(app.wsgi_app, ['/auth/login'])
#Getting data from API on daily basis:


def get_today_value():
    """The function calls the API on daily bases and uploads the most recent data to DB"""

    API_URL = f'https://api.metalpriceapi.com/v1/latest?api_key={API_KEY1}&base=XAU&currencies=USD'
    res = requests.get(API_URL) 
    parsed = res.json()
    timestamp = parsed['timestamp']
    #returns date
    dt_object = datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d")   #Convert Date Format to YYYY-mm-dd

    result = parsed['rates']['USD']   #returns the Price

    #connect to db
    connection = sqlite3.connect("site.db")
    cursor = connection.cursor()

    date_obj = dt_object
    a = result
    p = 0   #Predicted value from model API  ####### NOT AVAILABLE YET

    value_to_check = date_obj
    cursor.execute("SELECT * FROM GoldPrice WHERE date = ?", (value_to_check,))
    result = cursor.fetchone()

    if result:  #Check if the date already exists in the database
        pass     
    else:       #only insert the new value if it does not exists
        insert_query = "INSERT INTO GoldPrice (date, predicted, actual) VALUES (?, ?, ?)"
        data = (date_obj, p, a)
        cursor.execute(insert_query, data)
        connection.commit()
        connection.close()

#scheduler
scheduler = APScheduler()

# Actual values Endpoint

@app.route('/actuals', methods=['GET'])
def api_endpoint():
    # Get query parameters from the URL
    try:
        param1 = request.args.get('start_date')
        
        # Check if required parameters are missing
        if param1 is None:
            return jsonify({'error': 'Missing required query parameters'}), 400

        # Process the parameters

        URL = f'https://api.metalpriceapi.com/v1/{param1}?api_key={API_KEY1}&base=XAU&currencies=USD'
        res = requests.get(URL) 
        parsed = res.json()
        print('parsed', parsed)
        timestamp = parsed['timestamp']
        dt_object = datetime.utcfromtimestamp(timestamp).strftime("%Y-%m-%d")   #Convert Date Format to YYYY-mm-dd
        #print('date: ',dt_object)  #print the result
        result = parsed['rates']['USD']
        return jsonify({'Date:':dt_object, 'Price:': result})

    except Exception as e:
    # Handle the exception and return an error response
        return jsonify({'error': str(e)}), 500


@app.route('/health')
def health_backend():
    return 'Up and running :)'

@app.route('/fetch')
def fetch():
    return get_today_value()

@app.route('/health/database')
def health_database():
    # try:
        db.session.query(text('1')).from_statement(text('SELECT 1')).all()
        return 'It works.'
    # except:
        # return 'Database connection failed'


if __name__ == '__main__':
    scheduler.add_job(
        id='get_today_value',
        func=get_today_value,
        trigger= 'interval',
        days= 1,  # Run the task every day
        start_date= datetime(2023, 9, 28, 18, 0),  # Optional: Specify a start date
        timezone= 'UTC'  # Optional: Specify a timezone
        )
    scheduler.start()
    app.run(debug=True, port=5000, use_reloader=False)

   
