from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import numpy as np

import keras
from keras.models import Sequential
from keras.layers import Embedding, Bidirectional, LSTM, Dropout, Dense
from keras.preprocessing.sequence import pad_sequences

app = FastAPI(title="GlowMinder AI Engine")

@app.get("/")
def root():
    return {"message": "GlowMinder API is running"}

try:
    print("Loading AI Models...")

    model = Sequential([
        Embedding(input_dim=3562, output_dim=100, input_length=50),
        Bidirectional(LSTM(64)),
        Dropout(0.3),
        Dense(4, activation='sigmoid')
    ])
    model.build(input_shape=(None, 50))
    model.load_weights('glowminder_bilstm_weights.weights.h5')

    print("Model loaded successfully!")

    with open('tokenizer.pkl', 'rb') as f:
        tokenizer = pickle.load(f)

    with open('mlb.pkl', 'rb') as f:
        mlb = pickle.load(f)

except Exception as e:
    raise

class SkincareInput(BaseModel):
    ingredients: str
    uv_index: float
    humidity: float

def recommender_engine(predicted_labels, uv_index, humidity):
    recommendation = []

    if uv_index > 5.0 and "Weather Protector" in predicted_labels:
        recommendation.append("UV Index tinggi! Prioritaskan pemakaian produk Weather Protector (Sunscreen) ini.")

    if humidity < 50.0 and "Hydrator" in predicted_labels:
        recommendation.append("Udara sekitar sedang kering. Produk Hydrator ini sangat cocok dipakai sekarang.")

    if uv_index > 5.0 and humidity > 70.0 and "Sebum Controller" in predicted_labels:
        recommendation.append("Cuaca panas & lembap memicu minyak berlebih. Produk Sebum Controller ini wajib dipakai.")

    if not recommendation:
        recommendation.append("Cuaca sedang bersahabat. Silakan gunakan produk Daily Maintenance seperti biasa.")

    return recommendation

@app.post("/get-reminder")
def get_reminder(data: SkincareInput):
    try:
        cleaned_text = ' '.join([i.strip().replace(' ', '_') for i in data.ingredients.split(',')])

        seq = tokenizer.texts_to_sequences([cleaned_text])
        pad = pad_sequences(seq, padding='post', maxlen=50)

        prediction_probs = model.predict(pad)[0]

        predicted_indices = [i for i, prob in enumerate(prediction_probs) if prob > 0.5]
        if not predicted_indices:
            predicted_labels = ["Daily Maintenance"]
        else:
            predicted_labels = mlb.classes_[predicted_indices].tolist()

        final_advice = recommender_engine(predicted_labels, data.uv_index, data.humidity)

        return {
            "status": "success",
            "input_cuaca": {"uv_index": data.uv_index, "humidity": data.humidity},
            "prediksi_fungsi_skincare": predicted_labels,
            "rekomendasi_sistem": final_advice
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
