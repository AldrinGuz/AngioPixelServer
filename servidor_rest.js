var express = require("express");
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { exec } = require("child_process");
const { spawn } = require("child_process");


var app = express();
// Habilitar CORS
app.use(cors()); // Permite solicitudes desde cualquier origen

app.use("/user", express.static("ANGIOPIXEL"));

app.use(express.json());

var datos=require("./datos.js");
var usuarios=datos.usrs;

/*Obtiene el obj con el usuario y la contraseña, con un condicional comprueba que es igual a alguno que tenga en la
lista de médicos y devuelve el id si es el caso. De lo contrario devuelve el error 403.*/
app.post("/user/login",function(req, res){
    for (i=0;i<usuarios.length;i++){
        if (usuarios[i].login == req.body.usuario && usuarios[i].password == req.body.clave){
            res.status(200).json(usuarios[i].id);
            return;
        }
    }
    res.status(403).json("Usuario o contraseña incorrectos");
})

/* Obtiene el obj médico, junto con la lista de médicos se introduce en la función incluir() y esta devuelve un
código. Si es el usuario ya existe en la base de datos se devuelve un 200, de lo contrario un 201.*/
app.post("/user/register",function(req,res){
    var f = incluir(req.body,usuarios);
    if( f == 200){
        res.status(f).json("El usuario ya existe");
    }
    else if (f == 201){
        res.status(f).json("El usuario ha sido creado");
    }
})
//---Subida de imágenes---//
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './ANGIOPIXEL/Local'); // Carpeta donde se almacenarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

app.post("/user/upload",upload.single('file'),function(req,res){
    if(!req.file){
        return res.status(400).send({error:'No se han subido los archivos'});
    }
    res.status(200).send({ message: 'File uploaded successfully', filePath: `/uploads/${req.file.filename}` });
})

//--Ejecutar modelo en python--//
app.post("user/run-python", (req, res) => {
    // Ruta para ejecutar el archivo Python
    const scriptPath = "CNN.py"; // Ruta al archivo Python
    const args = req.body.args || []; // Argumentos opcionales para el script

    const command = `python ${scriptPath} ${args.join(" ")}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error ejecutando el script: ${error.message}`);
            return res.status(500).send({ error: error.message });
        }
        if (stderr) {
            console.error(`Error en el script: ${stderr}`);
            return res.status(400).send({ error: stderr });
        }

        console.log(`Salida del script: ${stdout}`);
        res.status(200).send({ output: stdout });
    });
});

app.post("/user/prueba",function(req,res){
    const pythonProcess = spawn("python", ["CNN.py", 'ANGIOPIXEL/Local/p1_v1_00038.png']);
    let result = "";
    pythonProcess.stdout.on("data", (data) => {
        result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Error: ${data.toString()}`);
    });

    pythonProcess.on("close", (code) => {
        if (code !== 0) {
            return res.status(500).send("Error procesando la imagen.");
        }
        res.json({ message: "Procesado exitosamente", result: result.trim() });
    });
    
})


//----------FUNCIONES---------//
function asigID(lista){
    var id = 0;
    for (i=0;i<lista.length;i++){
        if (id <= lista[i].id){
            id = lista[i].id + 1;//Problemas si se borra un elemento y se pierde una id en el proceso
        }
    }
    return (id);
}

function incluir(objeto,lista){
    for (i=0;i<lista.length;i++){
        if (lista[i].login == objeto.login){
            return (200);
        }
    }
    var o1 = Object.assign({id: asigID(lista)}, objeto);
    usuarios.push(o1);//problema, si se apaga el servidor todo se pierde
    return (201);
}

app.listen(3000);
console.log("Servidor activado. Esta escuchando en el puerto: 3000");