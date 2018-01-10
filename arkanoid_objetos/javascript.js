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
  this.barra = document.createElement('div');
  this.barra.id = this.id;
  this.barra.style.top = this.posYbarra + 'px';
  this.barra.style.left = this.posXbarra + 'px';
  this.barra.style.width = this.anchoBarra + 'px';
  this.barra.style.height = this.altoBarra + 'px';
  this.barra.style.backgroundColor = this.colorBarra;
  this.barra.style.borderRadius = this.radioBorde + 'px';
  this.barra.style.position = 'relative';
  contenedor.appendChild(this.barra);
}

// Funciones para la barra
Barra.prototype.moverBarraTeclado = function (direccion) {
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
  this.barra.style.left = this.posXbarra + 'px';
  if(this.posXbarra <= 0) {
    this.posXbarra = 0;
    this.barra.style.left = 0 + 'px';
  }
  else if(this.posXbarra + this.anchoBarra >= anchoContenedor) {
    this.posXbarra = anchoContenedor - this.anchoBarra;
    this.barra.style.left = anchoContenedor - this.anchoBarra + 'px';
  }
}

// Carga de la página
window.onload = function() {
  contenedor = document.getElementById('divContenedor');
  contenedor.style.width = anchoContenedor + 'px';
  contenedor.style.height = altoContenedor + 'px';
  barra = new Barra('barra');
  barra.crearBarra();
  document.onkeydown = barra.moverBarraTeclado;
}