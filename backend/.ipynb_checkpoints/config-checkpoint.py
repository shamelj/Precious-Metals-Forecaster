from os import environ

CORS_ALLOWED_ORIGINS = '*'

class Predictor:
    MODEL_PATH = './models/lstm-forecaster.h5'
    X_SCALER_PATH = './models/x_scaler.pkl'
    Y_SCALER_PATH = './models/y_scaler.pkl'