const dropArea = document.querySelector(".drop-area");
const dragText = dropArea.querySelector("p");
const button = dropArea.querySelector("button");
const input = dropArea.querySelector("#input-img");
let files;
let archivos = [];
let mensajes = [];

button.addEventListener("click", (e) => {input.click();});

input.addEventListener("change", (e)=>{
    files = e.target.files;
    dropArea.classList.add("active");
    showFiles(files);
    dropArea.classList.remove("active");
});
dropArea.addEventListener("dragover", (e)=>{
    e.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Suelta para subir los archivos";
});
dropArea.addEventListener("dragleave", (e)=>{
    e.preventDefault();
    dropArea.classList.remove("active");
    dragText.textContent = "Arrastra y suelta tus imágenes";
});
dropArea.addEventListener("drop", (e)=>{
    e.preventDefault();
    files = e.dataTransfer.files;
    showFiles(files);
    dropArea.classList.remove("active");
    dragText.textContent = "Arrastra y suelta tus imágenes";
});
/*Distinge entre un archivo o entre varios y los pasa por parametro UNO a UNO y no por lista*/
function showFiles(files){
    console.log(files);
    if(files.length===undefined){
        processFile(files);
    }else{
        for(const file of files){
            processFile(file);
        }
    }
}
/* Muestra por pantalla los archivos subidos*/
function processFile(file) {
    const docType = file.type;
    const validExtensions = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/dicom'];//Impide archivos con extensiones no validas

    if (validExtensions.includes(docType)) {
        const fileReader = new FileReader();
        const id = Math.random().toString(32).substring(7);//Les asigna un id unico y aleatorio

        fileReader.addEventListener('load', e => {
            const fileUrl = fileReader.result;
            archivos.push({nombre:file.name,url:fileUrl});
            // Crear el HTML dinámico donde se muestra las img
            const image = `
                <div id="${id}" class="file-container">
                    <img src="${fileUrl}" alt="${file.name}" width="50px">
                    <div class="status">
                        <span>${file.name}</span>
                        <span class="status-text">Loading...</span>
                    </div>
                    <div class="remove">
                        <input type="button" value="X" id="btn-eliminar" onclick="eliminar('${id}')">
                    </div>
                </div>
            `;

            // Agregar el contenido al DOM
            const html = document.querySelector("#preview").innerHTML;
            document.querySelector("#preview").innerHTML = image + html;
        });

        fileReader.readAsDataURL(file);
    } else {
        alert('No es un archivo válido');
    }
}

/* Sube el archivo al servidor en la carpeta /ANGIOPIXEL/Local/*/
function uploadFile(file) {
    const formData = new FormData();
    formData.append("file",file);
    fetch('/user/upload', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
    .then(data => {
        if (data.error) {
            console.log("Archivo no subido");
        } else {
            console.log("Archivo subido");
            console.log(data);
        }
    })
    .catch(error => {
        console.error('Error al subir el archivo:', error);
    });

}

function eliminar(id){
    const containerElement = document.getElementById(id);
    const img_name = containerElement.children[0].getAttribute("alt");
    for(var i = (archivos.length-1); i > -1;i--){
        if(archivos[i].nombre == img_name){
            archivos.splice(i,1);
        }
    }
    containerElement.remove();
}
