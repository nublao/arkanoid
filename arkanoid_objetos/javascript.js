// Variables globales de jugabilidad
var vidas = 3;
var cantLadrillos = 39;
var contDestruidos = 0;

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
function Pelota(id, barra) {
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
Pelota.prototype.lanzarPelota = function(teclado, barra) {
  var evento = window.event || teclado;
  if(evento.keyCode == 32 && this.parado) {
    this.posYpelota = barra.posYbarra - this.tamanoPelota;
    this.posXpelota = barra.posXbarra + (barra.anchoBarra / 2);
    this.timerPelota = setInterval(this.moverPelota.bind(this), this.velocidad);
    this.parado = false;
    this.sube = true;
  }
}

Pelota.prototype.moverPelota = function(elEvento, barra, ladrillo) {
  var evento = window.event || elEvento;
  this.reboteEnBarra();
  this.reboteEnParedes();
  this.perderVidas();
  ladrillo.colisionLadrillo(this);

  this.posXpelota += this.pasoXpelota;
  this.posYpelota += this.pasoYpelota;
  this.divPelota.style.left = this.posXpelota + 'px';
  this.divPelota.style.top = this.posYpelota + 'px';
}

Pelota.prototype.reboteEnParedes = function() {
  // Colision con bordes
  if(this.posXpelota >= (anchoContenedor - this.tamanoPelota)) {
    this.pasoXpelota = -this.pasoXpelota;
  }
  if(this.posXpelota <= 0) {
    this.pasoXpelota = -this.pasoXpelota;
    this.aLaIzquierda = false;
  }
}

Pelota.prototype.perderVidas = function(barra) {
  // Paramos la pelota si llega abajo del todo y quitamos vidas
  if(this.posYpelota >= (altoContenedor - this.tamanoPelota)) {
    vidas--;
    if(vidas > 0) {
      this.posYpelota = barra.posYbarra - this.tamanoPelota;
      this.posXpelota = barra.posXbarra + (barra.anchoBarra / 2) - (this.tamanoPelota / 2);
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
}

Pelota.prototype.posicionPelotaParada = function(barra) {
  // Posición de pelota al inicio
  if(this.parado) {
    this.posXpelota = barra.posXbarra + (barra.anchoBarra / 2) - (this.tamanoPelota / 2);
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

Pelota.prototype.reboteEnBarra = function(barra) {
  
  if(this.posYpelota + this.tamanoPelota >= barra.posYbarra && !this.sube
      && this.posXpelota + this.tamanoPelota >= barra.posXbarra 
      && this.posXpelota <= barra.posXbarra + barra.anchoBarra) {        
    this.pasoYpelota = -this.pasoYpelota;
    this.sube = true;
  }
}

function Ladrillo(id, posXladrillo, posYladrillo) {
  this.id = id;
  this.posXladrillo = posXladrillo;
  this.posYladrillo = posYladrillo;
  this.anchoLadrillo = 75;
  this.altoLadrillo = 25;
  this.colorLadrillo = 'rgb(25, 255, 255)';
  this.golpeado = false;
  this.crearLadrillo();
}

Ladrillo.prototype.crearLadrillo = function() {
  this.divLadrillo = document.createElement('div');
  this.divLadrillo.id = this.id;
  this.divLadrillo.style.top = this.posYladrillo + 'px';
  this.divLadrillo.style.left = this.posXladrillo + 'px';
  this.divLadrillo.style.width = this.anchoLadrillo + 'px';
  this.divLadrillo.style.height = this.altoLadrillo + 'px';
  this.divLadrillo.style.backgroundColor = this.colorLadrillo;
  this.divLadrillo.style.position = 'absolute';
  contenedor.appendChild(this.divLadrillo);
}

Ladrillo.prototype.colisionLadrillo = function(pelota) {
  if(this.golpeado) {
    this.divLadrillo.style.visibility = 'hidden';
  }
  // Por arriba
  if( !pelota.sube
      && !this.golpeado
      && pelota.posYpelota + pelota.tamanoPelota >= this.posYladrillo
      && pelota.posYpelota <= this.posYladrillo + this.altoLadrillo
      && pelota.posXpelota + pelota.tamanoPelota >= this.posXladrillo
      && pelota.posXpelota <= this.posXladrillo + this.anchoLadrillo) {
        this.golpeado = true;
    pelota.pasoYpelota = -pelota.pasoYpelota;
    pelota.sube = true;
  }
  // Por abajo
  else if(pelota.sube
      && !this.golpeado
      && pelota.posYpelota <= this.posYladrillo + this.altoLadrillo
      && pelota.posXpelota + pelota.tamanoPelota >= this.posXladrillo 
      && pelota.posXpelota <= this.posXladrillo + this.anchoLadrillo) {
    this.golpeado = true;
    pelota.pasoYpelota = -pelota.pasoYpelota;
    pelota.sube = false;
  }
  // Por la izquierda
  else if(!pelota.aLaIzquierda
      && !this.golpeado
      && pelota.posYpelota + pelota.tamanoPelota >= this.posYladrillo
      && pelota.posYpelota <= this.posYladrillo + this.altoLadrillo
      && pelota.posXpelota + pelota.tamanoPelota >= this.posXladrillo
      && pelota.posXpelota <= this.posXladrillo + this.anchoLadrillo) {
    this.golpeado = true;
    pelota.pasoXpelota = -pelota.pasoXpelota;
    pelota.aLaIzquierda = true;
  }
  // Por la derecha
  else if(pelota.aLaIzquierda
      && !this.golpeado
      && pelota.posYpelota + pelota.tamanoPelota >= this.posYladrillo
      && pelota.posYpelota <= this.posYladrillo + this.altoLadrillo
      && pelota.posXpelota <= this.posXladrillo + this.anchoLadrillo
      && pelota.posXpelota + pelota.tamanoPelota >= this.posXladrillo) {
    this.golpeado = true;
    pelota.pasoXpelota = -pasoXpelota;
    pelota.aLaIzquierda = false;
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


// Carga de la página
window.onload = function() {
  contenedor = document.getElementById('divContenedor');
  contenedor.style.width = anchoContenedor + 'px';
  contenedor.style.height = altoContenedor + 'px';
  // Instanciamos los objetos
  barraInicial = new Barra('barra');
  barraInicial.crearBarra();
  pelotaInicial = new Pelota('pelotaInicial', barraInicial);
  pelotaInicial.crearPelota();

  // Pintamos todos los ladrillos
  ladrillos = new Array(cantLadrillos);
  ladrillos[0] = new Ladrillo(i, 50, 50);
  for(var i = 1; i < cantLadrillos; i++ ) {
    if(i % 13 == 0) {
      ladrillos[i] = new Ladrillo(i, ladrillos[i - 13].posXladrillo, ladrillos[i - 13].posYladrillo + ladrillos[i - 13].altoLadrillo + 10);
    }
    else {
      ladrillos[i] = new Ladrillo(i, ladrillos[i - 1].posXladrillo + ladrillos[i - 1].anchoLadrillo + 10, ladrillos[i - 1].posYladrillo);
    }
  }

  // Llamamos a las funciones
  document.onkeypress = function(teclado) {
    pelotaInicial.lanzarPelota(teclado, barraInicial);
  }
  document.onkeydown = function(direccion) {
    barraInicial.moverBarraTeclado(direccion);
    pelotaInicial.posicionPelotaParada(barraInicial);
  }
  document.onmousemove = function(posRaton) {
    barraInicial.moverBarraRaton(posRaton);
    pelotaInicial.posicionPelotaParada(barraInicial);
  }
  // Ocultamos el cursor
  contenedor.style.cursor = 'none';
}