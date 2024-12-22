import sys
import tensorflow as tf
from PIL import Image
import numpy as np

def cnn():
    # Ruta de la imagen
    ruta = sys.argv[1]
    ruta_imagen = '' + ruta


    # Tamaño esperado por el modelo (ajusta según corresponda, por ejemplo: 224x224 para modelos como MobileNet)
    tamaño_imagen = (224, 224)

    # Cargar y preprocesar la imagen

    # Abrir la imagen con Pillow
    imagen = Image.open(ruta_imagen).convert('RGB')  # Convertir a RGB si es necesario
    # Redimensionar la imagen al tamaño esperado por el modelo
    imagen = imagen.resize(tamaño_imagen)
    # Convertir a un arreglo NumPy
    imagen_array = np.array(imagen)
    # Escalar los valores de píxeles al rango [0, 1] (opcional, según el modelo)
    imagen_array = imagen_array / 255.0
    # Agregar una dimensión para representar un lote de tamaño 1
    imagen_array = np.expand_dims(imagen_array, axis=0)
    # Procesar la imagen
    datos_entrada = imagen_array

    # Verifica la forma de los datos procesados
    #print("Forma de los datos de entrada:", datos_entrada.shape)

    # Cargar el modelo guardado en archivo.h5
    modelo = tf.keras.models.load_model('modelo_cnn.h5')

    # Mostrar un resumen del modelo (opcional)
    # modelo.summary()

    # Realizar predicción
    prediccion = modelo.predict(datos_entrada)
    redondeo_prediccion = round(prediccion[0][0],2)


    # Mostrar el resultado de la predicción
    print("Modelo: CNN")
    
    if(redondeo_prediccion>=0.5):
        print("Prediccion: Tiene lesión")
    else:
        print("Prediccion: No tiene lesión")
    print("Confianza:", redondeo_prediccion)
    return redondeo_prediccion

cnn()