import threading
import numpy as np
from tensorflow.keras.models import load_model
import config

class Predictor:
    def __init__(self):
        self.model = load_model(config.Predictor.MODEL_PATH)
        self.x_scaler = load_model(config.Predictor.X_SCALER_PATH)
        self.y_scaler = load_model(config.Predictor.Y_SCALER_PATH)

    def predict(self, price_sequence):
        price_sequence_scaled = self.x_scaler.transform(price_sequence)
        prediction = self.model.predict(array(test), verbose=0)
        prediction_unscaled = self.y_scaler.inverse_transform(prediction.reshape(-1, 1))
        return prediction_unscaled