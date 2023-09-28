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

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///site.db'
#app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{db_user}:{db_pass}@localhost:5000/{db_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)
app.app_context().push()

#SQL
connection = sqlite3.connect("site.db")
cursor = connection.cursor()

create_table_query = """
CREATE TABLE IF NOT EXISTS GoldPrice (
    id INTEGER PRIMARY KEY,
    date DaATE,
    predicted REAL,
    actual REAL

);
"""

cursor.execute(create_table_query)
connection.commit()
connection.close()

#app.register_blueprint(auth, url_prefix='/auth')
#app.wsgi_app = AuthenticateMiddleware(app.wsgi_app, ['/auth/login'])


#Getting data from API on daily basis:


def get_today_value():
    """The function calls the API on daily bases and uploads the most recent data to DB"""

    API_URL = 'https://api.metalpriceapi.com/v1/latest?api_key=eb80225495f4ff80c472d50dea711848&base=XAU&currencies=USD'
    #payload =  {'start_date': start_date, 'end_date': end_date}
    res = requests.get(API_URL) 
    parsed = res.json()
    timestamp = parsed['timestamp']
    dt_object = datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d")   #Convert Date Format to YYYY-mm-dd

    print('date: ',dt_object)  #print the result
    result = parsed['rates']['USD']
    print('value: ',result)

    #connect to db
    connection = sqlite3.connect("site.db")
    cursor = connection.cursor()

    date_obj = dt_object
    a = result
    p = 0   #Predicted value from model API  ####### NOT AVAILABLE YET
    d = date_obj
    insert_query = "INSERT INTO GoldPrice (date, predicted, actual) VALUES (?, ?, ?)"
    data = (d, p, a)
    cursor.execute(insert_query, data)
    connection.commit()
    connection.close()
    return "done"

import sqlite3
from flask import Flask, jsonify

app = Flask(__name__)

# Define a route to fetch records from the GoldPrice table based on a start_date parameter
@app.route('/gold_prices', methods=['GET'])
def get_gold_prices():
    try:
        # Connect to the SQLite database
        connection = sqlite3.connect("site.db")

        # Create a cursor object to execute SQL queries
        cursor = connection.cursor()
        print(request.args.get('start_date'))
        # Get the 'start_date' parameter from the query string (e.g., /gold_prices?start_date=2023-09-28)
        start_date = request.args.get('start_date')

        # Define the SQL query with a WHERE clause to filter records by 'date'
        query = "SELECT date, predicted, actual FROM GoldPrice WHERE date >= ?"

        # Execute the query with the 'start_date' parameter
        cursor.execute(query, (start_date,))

        # Fetch all records from the result cursor
        gold_prices = cursor.fetchall()

        # Close the database connection
        connection.close()

        # Convert the records to a list of dictionaries
        gold_prices_list = [{'date': record[0], 'predicted': record[1], 'actual': record[2]} for record in gold_prices]

        # Return the filtered records as JSON data
        return jsonify(gold_prices_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Return an error response if an exception occurs



#scheduler
scheduler = APScheduler()


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
        trigger='interval',
        days=1,  # Run the task every day
        start_date=datetime(2023, 9, 28, 0, 0),  # Optional: Specify a start date
        timezone='UTC'  # Optional: Specify a timezone
    )
    scheduler.start()
    app.run(debug=True, port=5000, use_reloader=False)

   
