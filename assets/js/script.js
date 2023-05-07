const imgPanel = document.querySelector(".imgEntrada"),
nombreFiltro = document.querySelector(".filtroInformacion .nombre"),
deslizador = document.querySelector(".deslizante input"),
resetearFiltro = document.querySelector(".resetear"),
insertarImg = document.querySelector(".insertar"),
guardarImg = document.querySelector(".guardarImg"),
borrarSesion = document.querySelector(".borrarSesion");
let rotaciones=0, horizontal=1, vertical=1;
let iniX, iniY;

const brilloInput = document.querySelector("#brilloF");
const saturacionInput = document.querySelector("#saturacionF");
const grisesInput = document.querySelector("#grisesF");
const inversionInput = document.querySelector("#inversionF");
const canvas = document.getElementById("#canvas");
const context = canvas.getContext("2d");
const izquierda = document.querySelector("#izquierda");
const derecha = document.querySelector("#derecha");
const cambio = document.querySelector("#horizontal");

var filtrosF = {};
var ajustarX = canvas.width;
var ajustarY = canvas.height;
var imgEditada = new Image();

window.onload = function () {
  if (localStorage.getItem('miImagen')) {
    const lik = localStorage.getItem('miImagen');
    imgEditada.src = lik;
    imgEditada.onload = function () {
      context.drawImage(imgEditada, 0, 0, ajustarX, ajustarY);
    }
    if (localStorage.getItem('filtro')) {
      const guardado = JSON.parse(localStorage.getItem('filtro'));
      filtrosF = guardado;
      generarFiltros();
      cargarFiltro();
      
      if (localStorage.getItem('saturacion')) {
        const saturacion = localStorage.getItem('saturacion');
        saturacionInput.value = saturacion;
      }
      if (localStorage.getItem('inversion')) {
        const inversion = localStorage.getItem('inversion');
        inversionInput.value = inversion;
      }
      if (localStorage.getItem('brillo')) {
        const brillo = localStorage.getItem('brillo');
        brilloInput.value = brillo;
      }
      if (localStorage.getItem('grises')) {
        const grises = localStorage.getItem('grises');
        grisesInput.value = grises;
      }
    }
  }
}

function myFunction2(id) {
  var x = document.getElementById(id);
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
    x.nextElementSibling.className = x.nextElementSibling.className.replace("w3-black", "w3-indigo");
  } else { 
    x.className = x.className.replace(" w3-show", "");
    x.nextElementSibling.className = x.nextElementSibling.className.replace("w3-indigo", "w3-black");
  }
}
function myFunction() {
  var x = document.getElementById("controll");
  if (x.className === "controles") {
    x.className += " responsive";
  } else {
    x.className = "controles";
  }
}

imgEditada.src = "/assets/images/img1.png";
imgEditada.onload = function() {
    context.drawImage(imgEditada,0,0);
}

function resetearFiltros(){
    filtrosF.brilloFoto = "100";
    filtrosF.saturacionFoto = "100";
    filtrosF.inversionFoto = "0";
    filtrosF.grisesFoto = "0";
    if (Object.keys(filtrosF) !== 0) {
      localStorage.removeItem('brillo');
      localStorage.removeItem('saturacion');
      localStorage.removeItem('grises');
      localStorage.removeItem('inversion');
      localStorage.removeItem('filtro');
    }
    brilloInput.value = filtrosF.brilloFoto;
    saturacionInput.value = filtrosF.saturacionFoto;
    inversionInput.value = filtrosF.inversionFoto;
    grisesInput.value = filtrosF.grisesFoto;
    cargarFiltro();
}

function cargarFiltro(key,valor){
    if(!imgEditada) return;                        
    filtrosF[key] = valor;
    cargarImg();
}

function generarFiltros(){
    const {brilloFoto, saturacionFoto , inversionFoto, grisesFoto} = filtrosF;
    return `brightness(${brilloFoto}%) saturate(${saturacionFoto}%) invert(${inversionFoto}%) grayscale(${grisesFoto}%)`
}

function cargarImg() {
  context.clearRect(0, 0, ajustarX, ajustarY);
  context.filter = generarFiltros(); 
  context.translate(canvas.width/2,canvas.height/2); 
  context.rotate(rotaciones * Math.PI / 2);
  context.scale(horizontal,1);
  context.translate(-canvas.width/2,-canvas.height/2);
  context.drawImage(imgEditada, 0, 0,ajustarX,ajustarY);
}

function cargarImg2() {  
  context.filter = generarFiltros(); 
  context.translate(canvas.width/2,canvas.height/2); 
  context.scale(horizontal,1);
  horizontal = 1
  context.translate(-canvas.width/2,-canvas.height/2);
  context.drawImage(imgEditada, 0, 0,ajustarX,ajustarY);
}

brilloInput.addEventListener("change", () => {
  cargarFiltro("brilloFoto", brilloInput.value);
  const fil = JSON.stringify(filtrosF);
  localStorage.setItem('filtro', fil);
  const brillo = brilloInput.value;
  localStorage.setItem('brillo', brillo);
});

saturacionInput.addEventListener("change", () => {
  cargarFiltro("saturacionFoto", saturacionInput.value)
  const fil = JSON.stringify(filtrosF);
  localStorage.setItem('filtro', fil);
  const saturacion = saturacionInput.value;
  localStorage.setItem('saturacion', saturacion);
});

inversionInput.addEventListener("change", () => {
  cargarFiltro("inversionFoto", inversionInput.value);
  const fil = JSON.stringify(filtrosF);
  localStorage.setItem('filtro', fil);
  const inversion = inversionInput.value;
  localStorage.setItem('inversion', inversion);
});

grisesInput.addEventListener("change", () => {
  cargarFiltro("grisesFoto", grisesInput.value);
  const fil = JSON.stringify(filtrosF);
  localStorage.setItem('filtro', fil);
  const grises = grisesInput.value;
  localStorage.setItem('grises', grises);
});

derecha.addEventListener("click",() =>{
  rotaciones = 1;
  cargarImg();
});

izquierda.addEventListener("click",() =>{
  rotaciones = -1;
  cargarImg();
});

cambio.addEventListener("click",() => {
  horizontal = -1;
  cargarImg2();
});

imgPanel.addEventListener("change", () => {
  const fr = new FileReader();
  fr.readAsDataURL(imgPanel.files[0]);

  imgEditada.addEventListener("load", () => {
    const link = fr.result;
    localStorage.setItem('miImagen', link);
    resetearFiltros();
    cargarImg(); 
  });
  imgEditada.src = URL.createObjectURL(imgPanel.files[0]);
});

const guardarImgEditada = () => {
  canvas.toBlob((blob) => {
    context.filter = generarFiltros;
    context.scale(horizontal, vertical);
    context.drawImage(imgEditada, 0, 0,ajustarX,ajustarY);
    const link = document.createElement("a");
    link.download = "imagen-editada.jpg";
    const urll = URL.createObjectURL(blob);
    link.href = urll;
    link.click();
  }); 
}
insertarImg.addEventListener("click", () => imgPanel.click()); 
resetearFiltro.addEventListener("click",resetearFiltros);
guardarImg.addEventListener("click", guardarImgEditada);
borrarSesion.addEventListener("click", () => localStorage.clear());



