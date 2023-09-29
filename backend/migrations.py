import pandas as pd
import numpy as np
from sqlalchemy import create_engine
import sqlite3
from Predictor import Predictor
import config

# Specify the path to your CSV file
csv_file_path = 'gold_price_seed_2021_2023.csv'

def add_actuals_seed():
    # Create an SQLite database engine
    engine = create_engine('sqlite:///site.db')
    # Read the CSV file into a pandas DataFrame
    df = pd.read_csv(csv_file_path, parse_dates=['Date'])
    df = df[['Date', 'Price']]
    df.columns = ['Date', 'actual']
    df['predicted'] = np.nan
    print(df)
    # Insert the DataFrame into the SQLite database
    df.to_sql('GoldPrice', engine, if_exists='append', index=False)

    # Close the database engine
    engine.dispose()


def update_predicted_record(date, new_predicted):
    try:
        # Connect to the SQLite database
        connection = sqlite3.connect("site.db")
        cursor = connection.cursor()

        # Define the SQL query to update the predicted column of a specific record
        update_query = "UPDATE GoldPrice SET predicted = ? WHERE date = ?"
        
        # Execute the update query
        cursor.execute(update_query, (new_predicted, date))

        # Commit the changes to the database
        connection.commit()

        # Close the database connection
        connection.close()

        return f'Record with date: {date} updated successfully. New predicted value: {new_predicted}', 200
    except Exception as e:
        return f'Error updating record: {str(e)}', 500

def seed_predictions():
    # Connect to the SQLite database
    connection = sqlite3.connect("site.db")

    # Create a cursor object to execute SQL queries
    cursor = connection.cursor()
    # Get the 'start_date' parameter from the query string (e.g., /gold_prices?start_date=2023-09-28)
    start_date = config.Predictor.MAX_TRAIN_DATE

    # Define the SQL query with a WHERE clause to filter records by 'date'
    query = "SELECT date, predicted, actual FROM GoldPrice WHERE date > ?"

    # Execute the query with the 'start_date' parameter
    cursor.execute(query, (start_date,))
    
    # Fetch all records from the result cursor
    gold_prices = cursor.fetchall()

    connection.close()

    for i in range(5, len(gold_prices)):
        curr_day_record = gold_prices[i]
        x = gold_prices[i-5:i]
        x = [record[2] for record in x]
        x = np.array(x)
        pred = Predictor()
        prediction = pred.predict(x)
        update_predicted_record(curr_day_record[0], prediction)

# add_actuals_seed()
# seed_predictions()
