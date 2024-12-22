from skimage.transform import resize
import sys
import cv2
import numpy as np

# Ruta del archivo SVM guardado
MODEL_PATH = "svm.pkl"

from joblib import load

def load_model(model_path):
    """Carga el modelo SVM desde un archivo joblib."""
    return load(model_path)

def preprocess_image(image_path):
    """Carga y preprocesa la imagen para el modelo SVM."""
    # Carga la imagen en escala de grises
    image = cv2.imread(image_path, cv2.IMREAD_COLOR)
    if image is None:
        raise FileNotFoundError(f"No se pudo cargar la imagen en la ruta: {image_path}")
    
    # Redimensionar la imagen a 150x150x3 (como en el entrenamiento)
    image_resized = resize(image, (150, 150, 3), anti_aliasing=True)
    
    # Aplanar la imagen para convertirla en un vector unidimensional
    image_flattened = image_resized.flatten().reshape(1, -1)
    
    return image_flattened

def predict(model, image_data):
    """Realiza la predicción con el modelo SVM."""
    probabilities = model.decision_function(image_data)  # Obtiene los puntajes (distancias)
    prediction = model.predict(image_data)  # Obtiene la etiqueta (0 o 1)
    
    # Convierte los puntajes a un rango de probabilidad usando una función sigmoide (opcional)
    probabilities = 1 / (1 + np.exp(-probabilities))
    confidence = probabilities[0] * 100  # Escala a porcentaje
    
    return prediction, confidence

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Uso: python script.py <ruta_imagen>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    try:
        # Carga el modelo
        model = load_model(MODEL_PATH)
        
        # Preprocesa la imagen
        image_data = preprocess_image(image_path)
        
        # Realiza la predicción
        label, confidence = predict(model, image_data)
        
        # Muestra el resultado
        print("Modelo: SVM")
        print("Prediccion: ",label)
        print(f"Confianza: {confidence:.2f}%")
    
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
