from flask import Flask, jsonify, request
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text
import os
import numpy as np
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


def get_latest_gold_prices(days):
    # Connect to the SQLite database
    connection = sqlite3.connect("site.db")

    # Create a cursor object to execute SQL queries
    cursor = connection.cursor()

    # Define the SQL query to fetch the latest 4 gold prices
    query = f"SELECT date, predicted, actual FROM GoldPrice ORDER BY date DESC LIMIT {days}"

    # Execute the query
    cursor.execute(query)

    # Fetch the latest 4 gold prices from the result cursor
    latest_gold_prices = cursor.fetchall()

    # Close the database connection
    connection.close()
    latest_gold_prices_list = [record[2] for record in latest_gold_prices]

    return np.array(latest_gold_prices_list)


def get_prediction():
    x = get_latest_gold_prices(5)
    pred = Predictor()
    pridiction = pred.predict(x)
    return pridiction

@app.route('/prediction', methods=['GET'])
def get_gold_price_prediction():
    try:
        prediction = get_prediction()
        return jsonify({'prediction': prediction})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# print(get_latest_gold_prices(5), get_prediction())

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
    p = get_prediction()   #Predicted value from model API  ####### NOT AVAILABLE YET

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


def migrate():
    max_train_date = get_max_date()
    if max_train_date != date_obj:
        insert_missing_prices_after()

# Define a route to fetch the record with the maximum date from the GoldPrice table
@app.route('/gold_prices/latest', methods=['GET'])
def get_latest_gold_price():
    try:
        # Connect to the SQLite database
        connection = sqlite3.connect("site.db")

        # Create a cursor object to execute SQL queries
        cursor = connection.cursor()

        # Define the SQL query to fetch the record with the maximum date
        query = "SELECT date, predicted, actual FROM GoldPrice WHERE date = (SELECT MAX(date) FROM GoldPrice)"

        # Execute the query
        cursor.execute(query)

        # Fetch the record with the maximum date from the result cursor
        max_gold_price = cursor.fetchone()

        # Close the database connection
        connection.close()

        # Convert the record to a dictionary
        if max_gold_price:
            max_gold_price_dict = {'date': max_gold_price[0], 'predicted': max_gold_price[1], 'actual': max_gold_price[2]}
            return jsonify(max_gold_price_dict)
        else:
            return jsonify({'message': 'No records found in GoldPrice table'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Return an error response if an exception occurs


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
        trigger= 'interval',
        days= 1,  # Run the task every day
        start_date= datetime(2023, 9, 28, 18, 0),  # Optional: Specify a start date
        timezone= 'UTC'  # Optional: Specify a timezone
        )
    scheduler.start()
    app.run(debug=True, port=5000, use_reloader=False)

   
