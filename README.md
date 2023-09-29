# Precious-Metals-Forecaster

## Endpoints

### Get Latest Gold Price
- **Endpoint:** `/gold_prices/latest`
- **Method:** GET
- **Description:** Fetches the record with the maximum date from the GoldPrice table.
- **Response:**
  - Success: 200 OK
    - JSON format: `{ "date": "2023-09-28", "predicted": 100.0, "actual": 105.0 }`
  - Error: 404 Not Found or 500 Internal Server Error

### Get Gold Prices
- **Endpoint:** `/gold_prices`
- **Method:** GET
- **Description:** Fetches records from the GoldPrice table based on a start_date parameter.
- **Query Parameter:**
  - `start_date` (e.g., `/gold_prices?start_date=2023-09-28`)
- **Response:**
  - Success: 200 OK
    - JSON format: `[{"date": "2023-09-28", "predicted": 100.0, "actual": 105.0}, ...]`
  - Error: 500 Internal Server Error

### Get Gold Price Prediction
- **Endpoint:** `/prediction`
- **Method:** GET
- **Description:** Fetches the gold price prediction based on the latest 5 gold prices.
- **Response:**
  - Success: 200 OK
    - JSON format: `{ "prediction": 110.0 }`
  - Error: 500 Internal Server Error

### Health Check
- **Endpoint:** `/health`
- **Method:** GET
- **Description:** Checks the health of the backend service.
- **Response:** "Up and running :)"


### Database Health Check
- **Endpoint:** `/health/database`
- **Method:** GET
- **Description:** Checks the health of the database connection.
- **Response:** "It works."


## Getting Started

To set up and run this project, follow these steps:

### Prerequisites

- Python 3.7 or higher
- [pip](https://pip.pypa.io/en/stable/installation/) (Python package manager)

### Installation and run

```shell
# Clone the repository to your local machine
git clone https://github.com/your-username/Precious-Metals-Forecaster.git

# Change your working directory to the 'backend' folder
cd Precious-Metals-Forecaster/backend

# Create a virtual environment
python -m venv ./.venv

# Activate the virtual environment
# On Windows:
.\.venv\Scripts\activate
# On macOS and Linux:
source ./.venv/bin/activate

# Install project dependencies using pip
pip install -r requirements.txt

# Run the application
python main.py
