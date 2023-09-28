import threading
import numpy as np
from tensorflow.keras.models import load_model
import config
import joblib
class Predictor:
    def __init__(self):
        print(config.Predictor.MODEL_PATH)
        self.model = load_model(config.Predictor.MODEL_PATH)
        self.x_scaler = joblib.load(config.Predictor.X_SCALER_PATH)
        self.y_scaler = joblib.load(config.Predictor.Y_SCALER_PATH)

    def predict(self, price_sequence): # expecting 1d np array
        price_sequence_scaled = self.x_scaler.transform(price_sequence.reshape(-1,1))
        print(f"scaled :{price_sequence_scaled}")
        prediction = self.model.predict(price_sequence_scaled.reshape(-1,5,1), verbose=0)
        print(prediction)
        prediction_unscaled = self.y_scaler.inverse_transform(prediction.reshape(-1, 1))
        return prediction_unscaled
