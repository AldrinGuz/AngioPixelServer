// rest.get(url, callback)
// rest.post(url, body, callback)
// rest.put(url, body, callback)
// rest.delete(url, callback)
// function callback(estado, respuesta) {...}

const res = require("express/lib/response");

/* Funcion acceder: Actua cuando se pulsa el botón Entrar de "access". Envía los datos del usuario y contraseña al
servidor para confirmar los datos. Pasa de la ventana "access" a "start", da un mensaje de bienvenida con el
nombre del medico, guarda la id del medico, dibuja la tabla con los expedientes correspondientes con el medico.
Requiere: null. Devuelve: "null".
*/
function acceder(){
  var user = document.getElementById("user").value;
  var password = document.getElementById("pass1").value;
  var log = {usuario: user, clave: password};
  var id_user;
  console.log("llego a enviar");
  rest.post("/user/login",log,function(estado,resp){
    if (estado == 403){
      alert(resp);
      return;
    }
    id_user=resp;
    mover('sesion.html');
  })
}

function mover(direccion){
  location.href = direccion;
}
/* Funcion guardar_reg: Actua cuando se pulsa el botón Guardar de "medical_data". Envía los datos del registro del
 medico al servidor para que se guarden. Pasa de la ventana "medical_data" a "access", autocompleta el nombre de
 usuario y contraseña que se hubiera colocado en "medical_data". Requiere: null. Devuelve: "null"
*/
function guardar_reg(){
  var usuario = document.getElementById("user");
  var contra = document.getElementById("pass1");
  var name = document.getElementById("name1").value;
  var lastn = document.getElementById("lastname1").value;
  var user = document.getElementById("login").value;
  var pass = document.getElementById("pass2").value;
  var cent = document.getElementById("center").value;

  var usuario = {nombre: name, apellidos: lastn, login:user, password: pass, centro: cent};
  //Se envía los datos

  rest.post("/user/register",usuario,function(estado,mensaje){
    if (estado != 201){
      alert(mensaje);
      return;
    }
    else{
      alert(mensaje);
      mover("index.html");
    }
  })
}

async function aplicar() {//debo añadir una forma de saber con que imagen quiero hacer lo siguiente
  const filtro1 = document.getElementById("check-filtro1");
  const filtro2 = document.getElementById("check-filtro2");
  const filtro3 = document.getElementById("check-filtro3");
  const filtro4 = document.getElementById("check-filtro4");
  const modelo1 = document.getElementById("check-modelo1");
  const modelo2 = document.getElementById("check-modelo2");
  const modelo3 = document.getElementById("check-modelo3");
  const modelo4 = document.getElementById("check-modelo4");
  const modelos = [];
  const filtros = [];
  if(filtro1.checked==true){filtros.push(filtro1.value);}
  if(filtro2.checked==true){filtros.push(filtro2.value);}
  if(filtro3.checked==true){filtros.push(filtro3.value);}
  if(filtro4.checked==true){filtros.push(filtro4.value);}
  if(modelo1.checked==true){modelos.push(modelo1.value);}
  if(modelo2.checked==true){modelos.push(modelo2.value);}
  if(modelo3.checked==true){modelos.push(modelo3.value);}
  if(modelo4.checked==true){modelos.push(modelo4.value);}
  let opciones = {modelos:modelos, filtros:filtros};
  opciones = JSON.stringify(opciones);

  try {
    const response = await fetch("/user/prueba", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: opciones,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Error del servidor:", error);
      return;
    }

    const data = await response.json();
    console.log("Resultado del servidor:", data.result);
    var resultado = data.result;
    var info = resultado.substr(171);
    info = parseFloat(info);//Si me devuelve el valor null que se vuelva a pedir
    document.getElementById("resultado").innerText=info;
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}


function filtrar(){
  var i=0;
  for(var files of archivos){
    if(files.length===undefined){
      localStorage.setItem(i,files.name);
      i++;
      uploadFile(files);
    }else{
      for(const file of files){
        localStorage.setItem(i,file.name);
        i++;
        uploadFile(file);
      }
    }
  }
  mover("filtros.html");

}
//mostrará las img escogidas en filtros
function mostrar_img(){

}