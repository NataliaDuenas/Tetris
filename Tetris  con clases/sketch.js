var playfield
const row = 18
const cols = 10
let length = 25
class Tetromino{
    constructor(){
  this._indice =  Math.floor(Math.random()*5)
  this._color = 'white'
  this._alto = undefined
  this._ancho = undefined 
  }
  molde(){
    switch(this._indice){
        //figura I
      case 0:
        this._color = color('purple')
        this._alto = 1
        this._ancho = 4
        return [color(' purple'),color('purple'),color('purple'),color('purple') ]
        //figura O
      case 1:
        this._color = color('blue')
        this._alto = 2
        this._ancho = 2
        return [[color('blue '),color(' blue')],[color('blue'), color('blue')]]
        //figura L
      case 2:
        this._color = color('red')
        this._alto = 3
        this._ancho = 2
        return [[color('red')],[color('red')],[color('red'), color('red')]]
        //figura T
      case 3:
        this._color = color('cyan')
        this._alto = 2
        this._ancho = 3
        return [[0,color('cyan')],[color('cyan'), color('cyan'), color(' cyan')]]
        //figura S
      case 4:
        this._color = color('yellow')
        this._alto = 2
        this._ancho = 3
        return [[0, color('yellow'), color('yellow')],[color('yellow'), color('yellow')]]
    } 
  }
  newMolde(){
    this._indice = Math.floor(Math.random()*5)
    return this.molde()
  }
  get ancho(){
    return this._ancho
  }
  set ancho(ancho){
    this._ancho = ancho
  }
  get alto(){
    return this._alto
  }
  set alto(alto){
    this._alto = alto
  }
  get color(){
    return this._color
  }
  set color(color){
    this._color = color
  }
  get indice(){
    return this._indice
  }
  set indice(indice){
    this._indice = indice
  }
}
class figure extends Tetromino{
  constructor(){
    super()
    this._fichaActual = this.create()
    this._x = 4
    this._y = 0
    this._score = 0
  }
  get score(){
    return this._score
  }
  set score(score){
    this._score = score
  }
  get x(){
    return this._x
  }
  set x(x){
    this._x = x
  }
  get y(){
    return this._y
  }
  set y(y){
    this._y = y
  }
  create(){
    return createQuadrille(super.molde())
  }
  outdown(){
    if(this._y >= (18-this._alto)){
      return true
    }
    return false
  }
  outright(){
    if( this._x >= (10 - this._ancho)){
       return true
       }
    return false
  }
  outleft(){
    if(this._x < 1 ){
      return true
    }
    return false
  }
  new(){
    this._x = 0
    this._y = 0
    this._fichaActual = this.create(super.newMolde())
  }
  abajo(){
    frameRate(3)
    if(!this.outdown() || !this.asegurar()){
    this._y = this._y + 1
    }
  }
  derecha(){
    frameRate(5)
    if(!this.outright()){
    this._x = this._x + 1
    }
  }
  izquierda(){
    frameRate(5)
    if(!this.outleft()){
    this._x = this._x - 1
    }
  }
  rotate(){
    frameRate(5)
    this._fichaActual.rotate()
  }
  collision(){
    return board.comparacion(this._fichaActual, this._y +1,this._x )
  }
  perder(){
    return playfield.magnitude(1)
  }
  dropPlayfield(row){
    let inicio = row
    playfield = board.clon()
    let array = playfield.memory2D
    for(let i= inicio; i>0;i--){
      array[i] = array[i-1]
    }
    board.newQuadri(array)
  }
  asegurar(){
    for (let fila of this.collision()) {
			for (let valor of fila) {
				if (valor != 0) {
					return true;
				}}}
		return false;
  }
  savePiece(){
    board.guardar(this._fichaActual, this._y, this._x)
  }
  dibujar(){
    drawQuadrille(this._fichaActual,{col:this._x, row:this._y, cellLength:25,outline:'white'})
  }
  start(){
    if(board.fullFila()){
      this.dropPlayfield(board.fullFila())
      this._score = this._score +1
    }
    if(this.perder() == 0){
    if(this._x < 12){
      this.abajo()
      this.dibujar()
    if(this.outdown()  || this.asegurar() ){
      this.savePiece()
      this.new()
      this._x = 4
      this._y = 0   
    }
    }}}}
let board ={
  guardar(piece, y , x){
    let clonar = piece.clone()
    playfield = Quadrille.OR(playfield, clonar, y , x)
  },
  comparacion(piece,y,x){
     const compara = Quadrille.AND(playfield, piece.clone() ,y,x)
    return compara.memory2D
  },
  fullFila(){
    for(let i=0; i<18;i++){
      if(playfield.magnitude(i) == 10){
        return i
        playfield.fill(i,0)
      }
    }},
  clon(){
    return playfield.clone()
  },
  newQuadri(array){
    playfield = createQuadrille(array)
  }
}
let flag = false
function keyPressed(){
  if(keyCode == RIGHT_ARROW){
    figura.derecha()
  }
  if(keyCode == LEFT_ARROW){
    figura.izquierda()
  }
  if(keyCode == UP_ARROW){
    figura.rotate()
    auxalto = figura._alto
    figura._alto = figura._ancho
    figura._ancho = auxalto
  }
}

function setup() {
  figura = new figure()
  createCanvas(350,450);
  playfield = createQuadrille(cols,row)
}
function draw() {
  background(0);
  drawQuadrille(playfield,{cellLength:25, outline: 'white', board: true})
  textSize(25)
  textStyle(BOLDITALIC)
  text('Lines',265,60)
  text(figura._score,285,90)
  text('Score',260,130)
  text(figura._score*210,280,160)
  fill(color('white'))
  figura.start()
}