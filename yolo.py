from ultralytics import YOLO
import sys

# Ruta de la imagen
ruta = sys.argv[1]
ruta_imagen = '' + ruta

#modelo = YOLO("yolo11x-cls.pt")
modelo = YOLO("best.pt")

#results = modelo.train(data="C:/Users/adria/Downloads/CADICA/dataset",epochs=10, save=True)
resultado = modelo(source=ruta_imagen, show=False, conf=0.97, save=False, verbose=False)

probs = resultado[0].probs
class_index = probs.top1
class_name = resultado[0].names[class_index]
score = float(probs.top1conf.cpu().numpy())

print("Modelo: yolo")
if(class_name == "nonlesion"):
    print("Prediccion: No tiene lesion")
else:
    print("Prediccion: Tiene lesion")

print(f"Confianza: {score:.2f}%")
