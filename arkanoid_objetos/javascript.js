// Variables de velocidad
var timerPelota;
var velocidad = 5;
var pasoXpelota = -2;
var pasoYpelota = -2;
var pasoBarra = 25;
var parado = true;

// Variables para posiciones
var posXpelota;
var posYpelota;
var posXbarra;
var posYbarra;
var posXladrillo1 = 100;
var posYladrillos = 50;
var posXladrillo2 = 250;
var posXladrillo3 = 400;

// Variables para tamaños
var anchoCaja = 600;
var altoCaja = 700;
var tamanoPelota = 25;
var anchoBarra = 150;
var altoBarra = 25;
var anchoLadrillo = 100;
var altoLadrillo = 25;

// Variables direccion
var sube;
var aLaIzquierda;

// Variables de colisión
var golpeado1 = false;
var golpeado2 = false;
var golpeado3 = false;

// Otras variables
var texto;
var vidas = 3;

window.onload = function() {
  // Localizamos los div
  pelota = document.getElementById('divPelota');
  caja = document.getElementById('divCaja');
  barra = document.getElementById('divBarra');
  vida = document.getElementById('textoVidas');

  txtEmpezar = document.getElementById('textoEmpezar');
  txtGanado = document.getElementById('textoGanado');
  txtPerdido = document.getElementById('textoPerdido');

  // Visibility para perdido y ganado

  txtGanado.style.visibility = 'hidden';
  txtPerdido.style.visibility = 'hidden';

  ladrillo1 = document.getElementById('divLadrillo1');
  ladrillo2 = document.getElementById('divLadrillo2');
  ladrillo3 = document.getElementById('divLadrillo3');

  // Asignamos tamaños y posiciones iniciales
  caja.style.width = anchoCaja + 'px';
  caja.style.height = altoCaja + 'px';

  posXbarra = (anchoCaja/2) - (anchoBarra/2);
  posYbarra = altoCaja - altoBarra * 2;

  barra.style.left = posXbarra + 'px';
  barra.style.top = posYbarra + 'px';
  barra.style.width = anchoBarra + 'px';
  barra.style.height = altoBarra + 'px';

  posXpelota = (anchoCaja/2) - (tamanoPelota/2);
  posYpelota = posYbarra - tamanoPelota;

  pelota.style.left = posXpelota + 'px';
  pelota.style.top = posYpelota + 'px';
  pelota.style.width = tamanoPelota + 'px';
  pelota.style.height = tamanoPelota + 'px';

  ladrillo1.style.left = posXladrillo1 + 'px';
  ladrillo1.style.top = posYladrillos + 'px';
  ladrillo1.style.width = anchoLadrillo + 'px';
  ladrillo1.style.height = altoLadrillo + 'px';

  ladrillo2.style.left = posXladrillo2 + 'px';
  ladrillo2.style.top = posYladrillos + 'px';
  ladrillo2.style.width = anchoLadrillo + 'px';
  ladrillo2.style.height = altoLadrillo + 'px';

  ladrillo3.style.left = posXladrillo3 + 'px';
  ladrillo3.style.top = posYladrillos + 'px';
  ladrillo3.style.width = anchoLadrillo + 'px';
  ladrillo3.style.height = altoLadrillo + 'px';

  // Vidas

  vida.innerHTML = vidas;
  
  // Llamamos a las funciones para mover la barra y la pelota
  document.onkeypress = lanzarPelota;
  document.onmousemove = moverBarraRaton;
  document.onkeydown = moverBarraTeclado;
  caja.style.cursor = 'none';
}

function lanzarPelota(teclado) {
  var evento = window.event || teclado;
  if(evento.keyCode == 32 && parado) {
    posYpelota = posYbarra - tamanoPelota;
    posXpelota = posXbarra + (anchoBarra / 2);
    timerPelota = setInterval(moverPelota, velocidad);
    parado = false;
    sube = true;
    textoEmpezar.style.visibility = 'hidden';
  }
}

function moverPelota(elEvento) {
  var evento = window.event || elEvento;
  reboteEnBarra();
  colisionLadrillo1();
  colisionLadrillo2();
  colisionLadrillo3();
  hasGanado();

  // Colision con bordes
  if(posXpelota >= (anchoCaja - tamanoPelota)) {
    pasoXpelota = -pasoXpelota;
  }
  if(posXpelota <= 0) {
    pasoXpelota = -pasoXpelota;
    aLaIzquierda = false;
  }

  // Paramos la pelota si llega abajo del todo y quitamos vidas
  if(posYpelota >= (altoCaja - tamanoPelota)) {
    vidas--;
    if(vidas > 0) {
      posYpelota = posYbarra - tamanoPelota;
      posXpelota = posXbarra + (anchoBarra / 2)
      parado = true;
      pasoYpelota = -pasoYpelota;
      clearInterval(timerPelota);
    }
    else {
      hasPerdido();
    }
    vida.innerHTML = vidas;
  }
  if(posYpelota <= 0) {
    pasoYpelota = -pasoYpelota;
    sube = false;
  }

  posXpelota += pasoXpelota;
  posYpelota += pasoYpelota;
  pelota.style.left = posXpelota + 'px';
  pelota.style.top = posYpelota + 'px';
}

function reboteEnBarra() {
  /*
  for(var i = posXpelota; i < posXpelota + tamanoPelota; i+= 40) {
    pintarColision(i, posYpelota, "#ff0000");
    pintarColision(i + tamanoPelota, posYpelota, "#ff0000");
    
  }
  */
  if(posYpelota + tamanoPelota >= posYbarra && !sube
      && posXpelota + tamanoPelota >= posXbarra 
      && posXpelota <= posXbarra + anchoBarra) {
        
    pasoYpelota = -pasoYpelota;
    sube = true;
  }
}

function moverBarraRaton(elEvento) {
  var evento = window.event || elEvento;
  posXbarra = evento.clientX - (anchoBarra / 2);
  // Posición de pelota al inicio
  if(parado) {
    posXpelota = evento.clientX - (tamanoPelota / 2);
    posYpelota = posYbarra - tamanoPelota;
    pelota.style.left = posXpelota + 'px';
    if(posXpelota <= 0) {
      pelota.style.left =  + 'px';
    }
    else if(posXpelota + tamanoPelota >= anchoCaja) {
      pelota.style.left = anchoCaja - tamanoPelota + 'px';
    }
  }

  barra.style.left = posXbarra + 'px';
  if(posXbarra <= 0) {
    barra.style.left = 0 + 'px';
  }
  else if(posXbarra + anchoBarra >= anchoCaja) {
    barra.style.left = anchoCaja - anchoBarra + 'px';
  }
}
function moverBarraTeclado(direccion){
  switch (direccion.keyCode){
    //flecha izquierda
    case 37:
      posXbarra -= pasoBarra;
    break;
    //flecha derecha
    case 39:
      posXbarra += pasoBarra;
  }
  barra.style.left = posXbarra + 'px';
  if(posXbarra <= 0) {
    posXbarra = 0;
    barra.style.left = 0 + 'px';
  }
  else if(posXbarra + anchoBarra >= anchoCaja) {
    posXbarra = anchoCaja - anchoBarra;
    barra.style.left = anchoCaja - anchoBarra + 'px';
  }
  }
/* function pintarColision(x, y, color) {
  var colision = document.createElement('div');
  colision.style.backgroundColor = color;
  colision.style.width = 1 + 'px';
  colision.style.height = 1 + 'px';
  colision.style.position = 'absolute';
  colision.className = 'colision';
  colision.style.left = x + 'px';
  colision.style.top = y + 'px';
  caja.appendChild(colision);

  setTimeout(function() {
    colision.parentNode.removeChild(colision);
  }
    , 1000);
}
*/

function colisionLadrillo1() {
  if(golpeado1) {
    ladrillo1.style.visibility = 'hidden';
  }
  // Por arriba
  if( !sube
      && !golpeado1
      && posYpelota + tamanoPelota >= posYladrillos
      && posYpelota <= posYladrillos + altoLadrillo
      && posXpelota + tamanoPelota >= posXladrillo1 
      && posXpelota <= posXladrillo1 + anchoLadrillo) {
    golpeado1 = true;
    pasoYpelota = -pasoYpelota;
    sube = true;
  }
  // Por abajo
  else if( sube
      && !golpeado1
      && posYpelota <= posYladrillos + altoLadrillo
      && posXpelota + tamanoPelota >= posXladrillo1 
      && posXpelota <= posXladrillo1 + anchoLadrillo) {
    golpeado1 = true;
    pasoYpelota = -pasoYpelota;
    sube = false;
  }
  // Por la izquierda
  else if( !aLaIzquierda
      && !golpeado1
      && posYpelota + tamanoPelota >= posYladrillos
      && posYpelota <= posYladrillos + altoLadrillo
      && posXpelota + tamanoPelota >= posXladrillo1
      && posXpelota <= posXladrillo1 + anchoLadrillo) {
    golpeado1 = true;
    pasoXpelota = -pasoXpelota;
    aLaIzquierda = true;
  }
  // Por la derecha
  else if( aLaIzquierda
      && !golpeado1
      && posYpelota + tamanoPelota >= posYladrillos
      && posYpelota <= posYladrillos + altoLadrillo
      && posXpelota <= posXladrillo1 + anchoLadrillo
      && posXpelota + tamanoPelota >= posXladrillo1) {
    golpeado1 = true;
    pasoXpelota = -pasoXpelota;
    aLaIzquierda = false;
  }
}

function colisionLadrillo2() {
  if(golpeado2) {
    ladrillo2.style.visibility = 'hidden';
  }
  // Por arriba
  if( !sube
      && !golpeado2
      && posYpelota + tamanoPelota >= posYladrillos
      && posYpelota <= posYladrillos + altoLadrillo
      && posXpelota + tamanoPelota >= posXladrillo2
      && posXpelota <= posXladrillo2 + anchoLadrillo) {
    golpeado2 = true;
    pasoYpelota = -pasoYpelota;
    sube = true;
  }
  // Por abajo
  else if( sube
      && !golpeado2
      && posYpelota <= posYladrillos + altoLadrillo
      && posXpelota + tamanoPelota >= posXladrillo2 
      && posXpelota <= posXladrillo2 + anchoLadrillo) {
    golpeado2 = true;
    pasoYpelota = -pasoYpelota;
    sube = false;
  }
  // Por la izquierda
  else if( !aLaIzquierda
      && !golpeado2
      && posYpelota + tamanoPelota >= posYladrillos
      && posYpelota <= posYladrillos + altoLadrillo
      && posXpelota + tamanoPelota >= posXladrillo2
      && posXpelota <= posXladrillo2 + anchoLadrillo) {
    golpeado2 = true;
    pasoXpelota = -pasoXpelota;
    aLaIzquierda = true;
  }
  // Por la derecha
  else if( aLaIzquierda
      && !golpeado2
      && posYpelota + tamanoPelota >= posYladrillos
      && posYpelota <= posYladrillos + altoLadrillo
      && posXpelota <= posXladrillo2 + anchoLadrillo
      && posXpelota + tamanoPelota >= posXladrillo2) {
    golpeado2 = true;
    pasoXpelota = -pasoXpelota;
    aLaIzquierda = false;
  }
}

function colisionLadrillo3() {
  if(golpeado3) {
    ladrillo3.style.visibility = 'hidden';
  }
  // Por arriba
  if( !sube
      && !golpeado3
      && posYpelota + tamanoPelota >= posYladrillos
      && posYpelota <= posYladrillos + altoLadrillo
      && posXpelota + tamanoPelota >= posXladrillo3 
      && posXpelota <= posXladrillo3 + anchoLadrillo) {
    golpeado3 = true;
    pasoYpelota = -pasoYpelota;
    sube = true;
  }
  // Por abajo
  else if( sube
      && !golpeado3
      && posYpelota <= posYladrillos + altoLadrillo
      && posXpelota + tamanoPelota >= posXladrillo3
      && posXpelota <= posXladrillo3 + anchoLadrillo) {
    golpeado3 = true;
    pasoYpelota = -pasoYpelota;
    sube = false;
  }
  // Por la izquierda
  else if( !aLaIzquierda
      && !golpeado3
      && posYpelota + tamanoPelota >= posYladrillos
      && posYpelota <= posYladrillos + altoLadrillo
      && posXpelota + tamanoPelota >= posXladrillo3
      && posXpelota <= posXladrillo3 + anchoLadrillo) {
    golpeado3 = true;
    pasoXpelota = -pasoXpelota;
    aLaIzquierda = true;
  }
  // Por la derecha
  else if( aLaIzquierda
      && !golpeado3
      && posYpelota + tamanoPelota >= posYladrillos
      && posYpelota <= posYladrillos + altoLadrillo
      && posXpelota <= posXladrillo3 + anchoLadrillo
      && posXpelota + tamanoPelota >= posXladrillo3) {
    golpeado3 = true;
    pasoXpelota = -pasoXpelota;
    aLaIzquierda = false;
  }
}

function hasGanado() {
  if(golpeado1 && golpeado2 && golpeado3) {
    clearInterval(timerPelota);
    txtGanado.style.visibility = 'visible';
  }
}
function hasPerdido() {
  clearInterval(timerPelota);
  txtPerdido.style.visibility = 'visible';
}