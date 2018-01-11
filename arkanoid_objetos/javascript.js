// Variables globales de tamaños
var anchoContenedor = 1200;
var altoContenedor = 700;

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
  var evento = window.event || posRaton;
  this.posXbarra = evento.clientX - (this.anchoBarra / 2);
  // Posición de pelota al inicio
  this.divBarra.style.left = this.posXbarra + 'px';
  if(this.posXbarra <= 0) {
    this.divBarra.style.left = 0 + 'px';
  }
  else if(this.posXbarra + this.anchoBarra >= anchoContenedor) {
    this.divBarra.style.left = anchoContenedor - this.anchoBarra + 'px';
  }
}

// Carga de la página
window.onload = function() {
  contenedor = document.getElementById('divContenedor');
  contenedor.style.width = anchoContenedor + 'px';
  contenedor.style.height = altoContenedor + 'px';
  barra = new Barra('barra');
  barra.crearBarra();
  // Llamamos a las funciones
  document.onkeydown = function(direccion) {
    barra.moverBarraTeclado(direccion);
  }
  document.onmousemove = function(posRaton) {
    barra.moverBarraRaton(posRaton);
  }
}