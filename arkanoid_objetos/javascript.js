// Variables globales de juego
var vidas = 3;

// Variables globales de tamaños
var anchoContenedor = 1200;
var altoContenedor = 700;

// Variables globales de dirección y movimiento

// Constructor de la barra
function Barra(id) {
  this.anchoBarra = 150;
  this.altoBarra = 25;
  this.posXbarra = (anchoContenedor / 2) - (this.anchoBarra / 2);
  this.posYbarra = altoContenedor - this.altoBarra * 2;
  this.pasoBarra = 25;
  this.colorBarra = 'rgb(253, 109, 253)';
  this.radioBorde = 50;
  this.id = id;
}

// Creación de la barra
Barra.prototype.crearBarra = function() {
  this.divBarra = document.createElement('div');
  this.divBarra.id = this.id;
  this.divBarra.style.top = this.posYbarra + 'px';
  this.divBarra.style.left = this.posXbarra + 'px';
  this.divBarra.style.width = this.anchoBarra + 'px';
  this.divBarra.style.height = this.altoBarra + 'px';
  this.divBarra.style.backgroundColor = this.colorBarra;
  this.divBarra.style.borderRadius = this.radioBorde + 'px';
  this.divBarra.style.position = 'absolute';
  contenedor.appendChild(this.divBarra);
  // Indicador de vidas
  vida = document.createElement('span');
  vida.innerHTML = vidas;
  vida.className = 'textoVidas';
  this.divBarra.appendChild(vida);
}

// Funciones para la barra
Barra.prototype.moverBarraTeclado = function(direccion) {
  switch (direccion.keyCode){
    //flecha izquierda
    case 37:
      this.posXbarra -= this.pasoBarra;
    break;
    //flecha derecha
    case 39:
      this.posXbarra += this.pasoBarra;
    break;
  }
  this.divBarra.style.left = this.posXbarra + 'px';
  if(this.posXbarra <= 0) {
    this.posXbarra = 0;
    this.divBarra.style.left = 0 + 'px';
  }
  else if(this.posXbarra + this.anchoBarra >= anchoContenedor) {
    this.posXbarra = anchoContenedor - this.anchoBarra;
    this.divBarra.style.left = anchoContenedor - this.anchoBarra + 'px';
  }
}

Barra.prototype.moverBarraRaton = function(posRaton) {
  var pelota = pelotaInicial.id;
  var evento = window.event || posRaton;
  this.posXbarra = evento.clientX - (this.anchoBarra / 2);
  this.divBarra.style.left = this.posXbarra + 'px';
  if(this.posXbarra <= 0) {
    this.divBarra.style.left = 0 + 'px';
  }
  else if(this.posXbarra + this.anchoBarra >= anchoContenedor) {
    this.divBarra.style.left = anchoContenedor - this.anchoBarra + 'px';
  }
}

// Constructor de la pelota
function Pelota(id) {
  this.tamanoPelota = 25;
  this.posXpelota = (anchoContenedor / 2) - (this.tamanoPelota / 2);
  this.posYpelota = barra.posYbarra - this.tamanoPelota;
  this.pasoXpelota = -2;
  this.pasoYpelota = -2;
  this.colorPelota = 'rgb(91, 136, 192)';
  this.radioBorde = 50;
  this.id = id;
  this.sube = true;
  this.aLaIzquierda = false;
  this.parado = true;
  this.velocidad = 5;
}

// Creación de la pelota
Pelota.prototype.crearPelota = function() {
  this.divPelota = document.createElement('div');
  this.divPelota.id = this.id;
  this.divPelota.style.top = this.posYpelota + 'px';
  this.divPelota.style.left = this.posXpelota + 'px';
  this.divPelota.style.width = this.tamanoPelota + 'px';
  this.divPelota.style.height = this.tamanoPelota + 'px';
  this.divPelota.style.backgroundColor = this.colorPelota;
  this.divPelota.style.borderRadius = this.radioBorde + '%';
  this.divPelota.style.position = 'absolute';
  contenedor.appendChild(this.divPelota);
}

//Funciones de la pelota
Pelota.prototype.lanzarPelota = function(teclado) {
  var evento = window.event || teclado;
  if(evento.keyCode == 32 && this.parado) {
    this.posYpelota = barra.posYbarra - this.tamanoPelota;
    this.posXpelota = barra.posXbarra + (barra.anchoBarra / 2);
    this.timerPelota = setInterval(this.moverPelota.bind(this), this.velocidad);
    this.parado = false;
    this.sube = true;
    
  }
}

Pelota.prototype.moverPelota = function(elEvento) {
  var evento = window.event || elEvento;
  this.reboteEnBarra();
  //console.log(this.posYpelota);
  

  // Colision con bordes
  if(this.posXpelota >= (anchoContenedor - this.tamanoPelota)) {
    this.pasoXpelota = -this.pasoXpelota;
  }
  if(this.posXpelota <= 0) {
    this.pasoXpelota = -this.pasoXpelota;
    this.aLaIzquierda = false;
  }

  // Paramos la pelota si llega abajo del todo y quitamos vidas
  if(this.posYpelota >= (altoContenedor - this.tamanoPelota)) {
    vidas--;
    if(vidas > 0) {
      this.posYpelota = barra.posYbarra - this.tamanoPelota;
      this.posXpelota = barra.posXbarra + (barra.anchoBarra / 2)
      this.parado = true;
      this.pasoYpelota = -this.pasoYpelota;
      clearInterval(this.timerPelota);
    }
    else {
      hasPerdido();
    }
    vida.innerHTML = vidas;
  }
  if(this.posYpelota <= 0) {
    this.pasoYpelota = -this.pasoYpelota;
    this.sube = false;
  }

  this.posXpelota += this.pasoXpelota;
  this.posYpelota += this.pasoYpelota;
  this.divPelota.style.left = this.posXpelota + 'px';
  this.divPelota.style.top = this.posYpelota + 'px';
}

Pelota.prototype.posicionPelotaParadaRaton = function(evento) {
  // Posición de pelota al inicio
  if(this.parado) {
    this.posXpelota = evento.clientX - (this.tamanoPelota / 2);
    this.posYpelota = barra.posYbarra - this.tamanoPelota;
    this.divPelota.style.left = this.posXpelota + 'px';
    if(this.posXpelota <= 0) {
      this.divPelota.style.left =  + 'px';
    }
    else if(this.posXpelota + this.tamanoPelota >= anchoContenedor) {
      this.divPelota.style.left = anchoContenedor - this.tamanoPelota + 'px';
    }
  }
}

Pelota.prototype.reboteEnBarra = function() {
  /*
  for(var i = posXpelota; i < posXpelota + tamanoPelota; i+= 40) {
    pintarColision(i, posYpelota, "#ff0000");
    pintarColision(i + tamanoPelota, posYpelota, "#ff0000");
    
  }
  */
  if(this.posYpelota + this.tamanoPelota >= barra.posYbarra && !this.sube
      && this.posXpelota + this.tamanoPelota >= barra.posXbarra 
      && this.posXpelota <= barra.posXbarra + barra.anchoBarra) {
        
    this.pasoYpelota = -this.pasoYpelota;
    this.sube = true;
  }
}

// Carga de la página
window.onload = function() {
  contenedor = document.getElementById('divContenedor');
  contenedor.style.width = anchoContenedor + 'px';
  contenedor.style.height = altoContenedor + 'px';
  barra = new Barra('barra');
  barra.crearBarra();
  pelotaInicial = new Pelota('pelotaInicial');
  pelotaInicial.crearPelota();
  // Llamamos a las funciones
  document.onkeypress = function(teclado) {
    pelotaInicial.lanzarPelota(teclado);
  }

  document.onkeydown = function(direccion) {
    barra.moverBarraTeclado(direccion);
  }
  document.onmousemove = function(posRaton) {
    barra.moverBarraRaton(posRaton);
    pelotaInicial.posicionPelotaParada(posRaton);
  }

  
  
  contenedor.style.cursor = 'none';
}