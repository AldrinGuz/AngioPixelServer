const dropArea = document.querySelector(".drop-area");
const dragText = dropArea.querySelector("p");
const button = dropArea.querySelector("button");
const input = dropArea.querySelector("#input-img");
let files;

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

function processFile(file) {
    const docType = file.type;
    const validExtensions = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/dicom'];

    if (validExtensions.includes(docType)) {
        const fileReader = new FileReader();
        const id = Math.random().toString(32).substring(7);

        fileReader.addEventListener('load', e => {
            const fileUrl = fileReader.result;

            // Crear el HTML dinámico
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

            // Llamar a uploadFile después de que el elemento exista
            uploadFile(file, id);
        });

        fileReader.readAsDataURL(file);
    } else {
        alert('No es un archivo válido');
    }
}


function uploadFile(file, id) {
    const formData = new FormData();
    formData.append("file",file);
    fetch('/user/upload', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
    .then(data => {
        if (data.error) {
            console.log("Archivo no subido");
            const statusElement = document.getElementById(id).querySelector(".status-text");
            statusElement.textContent = "Archivo no subido";
            statusElement.classList.add("failure");
        } else {
            console.log("Archivo subido");
            console.log(data);
            const statusElement = document.getElementById(id).querySelector(".status-text");
            statusElement.textContent = "Archivo subido";
            statusElement.classList.add("success");
        }
    })
    .catch(error => {
        console.error('Error al subir el archivo:', error);
        const statusElement = document.getElementById(id).querySelector(".status-text");
        statusElement.textContent = "Error al subir";
        statusElement.classList.add("failure");
    });
    /*
    rest.post("/user/upload",formData,function(estado,resp){
        if (estado == 403){
            console.log("Archivo no subido");
            const statusElement = document.getElementById(""+id).childNodes[3].childNodes[3];
            statusElement.innerHTML = "<div class='failure'>Archivo no subido</div>";
            return;
        }
        console.log("Archivo subido");
        console.log(resp);
        const statusElement = document.getElementById(""+id).childNodes[3].childNodes[3];
        statusElement.innerHTML = "<div class='success'>Archivo subido</div>";
    })*/
}

function eliminar(id){
    //Manda un cod de eliminación al server IMPLEMENTAR

    const containerElement = document.getElementById(id);
    containerElement.remove();
}

/*
function uploadFile(file, id) {
    // Simulación de un tiempo de espera para representar la subida de archivos
    setTimeout(() => {
        const statusElement = document.getElementById(""+id).childNodes[3].childNodes[3];//<----------Especifidad: posibles errores a futuro

        if (statusElement) {
            statusElement.innerHTML = "<div class='success'>Archivo subido</div>";
        } else {
            console.error("No se encontró el elemento con ID: " + id);
        }
    }, 1000); // Simulamos un retraso para asegurar que el elemento existe
}
*/