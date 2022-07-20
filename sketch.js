var estado = "jogo";
var lua, plataforma, plataformaImg, obstaculo, obstaculoImg;
var nave, naveParada, naveCima, naveBaixo;
var naveEsquerda1, naveEsquerda2, naveDireita1, naveDireita2;
var naveQuebrada;
var velocimetroV, velocimetroH, velocimetroImg;
var gasolina, gasolinaImg, combustivel = 100;

function preload(){

  lua = loadImage("Images/cenario/lua.png");
  gasolinaImg = loadImage("Images/cenario/gasolina.png");
  velocimetroImg = loadImage("Images/cenario/velocimetro.png");

  naveParada = loadAnimation("Images/nave/vertical/nave1.png");

  naveCima = loadAnimation("Images/nave/vertical/nave1.png", "Images/nave/vertical/nave2.png", "Images/nave/vertical/nave3.png");
  naveCima.looping = false;
  naveCima.frameDelay = 2;

  naveBaixo = loadAnimation("Images/nave/vertical/nave3.png", "Images/nave/vertical/nave2.png", "Images/nave/vertical/nave1.png");
  naveBaixo.looping = false;
  naveBaixo.frameDelay = 2;
  
  naveEsquerda1 = loadAnimation("Images/nave/horizontal/naveE1.png", "Images/nave/horizontal/naveE2.png");
  naveEsquerda1.looping = false;
  naveEsquerda1.frameDelay = 3;

  naveEsquerda2 = loadAnimation("Images/nave/horizontal/naveE1.png", "Images/nave/vertical/nave1.png");
  naveEsquerda2.looping = false;
  naveEsquerda2.frameDelay = 3;

  naveDireita1 = loadAnimation("Images/nave/horizontal/naveD1.png", "Images/nave/horizontal/naveD2.png");
  naveDireita1.looping = false;
  naveDireita1.frameDelay = 3;

  naveDireita2 = loadAnimation("Images/nave/horizontal/naveD1.png", "Images/nave/vertical/nave1.png");
  naveDireita2.looping = false;
  naveDireita2.frameDelay = 3;

  naveQuebrada = loadAnimation("Images/nave/quebrada/naveQ1.png", "Images/nave/quebrada/naveQ2.png", "Images/nave/quebrada/sumiu.png");
  naveQuebrada.looping = false;
  naveQuebrada.frameDelay = 10;

  obstaculoImg = loadImage("Images/cenario/obstaculo.png");

  plataformaImg = loadImage("Images/cenario/plataforma.png");
}

function setup(){

    createCanvas(windowWidth, windowHeight-4);

    velocimetroV = createSprite(80, 85);
    velocimetroV.addImage(velocimetroImg);
    velocimetroV.scale = 0.3;

    velocimetroH = createSprite(230, 85);
    velocimetroH.addImage(velocimetroImg);
    velocimetroH.scale = 0.3;

    gasolina = createSprite(50, 205);
    gasolina.addImage(gasolinaImg);
    gasolina.scale = 0.15;

    plataforma = createSprite(200, height-200);
    plataforma.setCollider("rectangle", 0, 200, 580, 130);
    plataforma.addImage(plataformaImg);
    plataforma.scale = 0.5;

    obstaculo = createSprite(width/2, height/2-85);
    obstaculo.addImage(obstaculoImg);
    obstaculo.scale = 0.9;

    nave = createSprite(width-100, 120);
    nave.setCollider("rectangle", 0, -15, 220, 210);
    nave.addAnimation("parada", naveParada);
    nave.scale = 0.8;
}

function draw(){

    background(lua);
    drawSprites();

    if(estado === "jogo"){
        movimento();
        pouso();
    }

    
    mostrarCombustivel();
    velocidade();
    estados();
}

function movimento(){

    nave.velocityY += 0.2;

    if(combustivel > 2){
       
        //cima

        if(keyDown("w") || keyDown("UP_ARROW")){
            nave.velocityY -= 0.5;
            combustivel -= 1;
        }

        if(keyWentDown("w") || keyWentDown("UP_ARROW")){
            nave.addAnimation("cima", naveCima);
            nave.changeAnimation("cima");
        }

        if(keyWentUp("w") || keyWentUp("UP_ARROW")){
            nave.addAnimation("baixo", naveBaixo);
            nave.changeAnimation("baixo");
        }

        //esquerda

        if(keyDown("a") || keyDown("LEFT_ARROW")){
            nave.velocityX -= 0.5;
            combustivel -= 1;
        }

        if(keyWentDown("a") || keyWentDown("LEFT_ARROW")){
            nave.addAnimation("esquerda1", naveEsquerda1);
            nave.changeAnimation("esquerda1");
        }

        if(keyWentUp("a") || keyWentUp("LEFT_ARROW")){
            nave.addAnimation("esquerda2", naveEsquerda2);
            nave.changeAnimation("esquerda2");
        }

        //direita

        if((keyDown("d") || keyDown("RIGHT_ARROW")) && combustivel > 0){
            nave.velocityX += 0.5;
            combustivel -= 1;
        }

        if(keyWentDown("d") || keyWentDown("RIGHT_ARROW")){
            nave.addAnimation("direita1", naveDireita1);
            nave.changeAnimation("direita1");
        }

        if(keyWentUp("d") || keyWentUp("RIGHT_ARROW")){
            nave.addAnimation("direita2", naveDireita2);
            nave.changeAnimation("direita2");
        } 
    }else{
        nave.changeAnimation("parada");
    }  
}

function velocidade(){

    //velocidade vertical

        let velY = nave.velocityY.toFixed(0);

        textSize(30);
        textAlign(CENTER);

        if(velY < 0){
            fill("lightGreen");
        }else{
            fill("gray");
        }

        text(velY*(-1), velocimetroV.x, velocimetroV.y+40);

    //velocidade horizontal

        let velX = nave.velocityX.toFixed(0);

        if(velX != 0){
            fill("lightGreen");
        }else{
            fill("gray");
        }

        if(velX < 0){
            text(velX*(-1), velocimetroH.x, velocimetroH.y+40);
        }else{
            text(velX, velocimetroH.x, velocimetroH.y+40);
        }
}

function mostrarCombustivel(){

    fill("#f06635");
    strokeWeight(3);
    stroke("#c73804");
    rect(99, 199, 182, 22);

    noStroke();
    fill("#e34810");
    rect(100, 200, combustivel*1.8, 20);
}

function pouso(){

    if(nave.isTouching(plataforma)){

        if( nave.y < 460){
            estado = "venceu";
        }else{
            estado = "perdeu";
            nave.addAnimation("quebrada", naveQuebrada);
            nave.changeAnimation("quebrada");
        }
    }

    if(nave.isTouching(obstaculo)){
        estado = "perdeu";
        nave.addAnimation("quebrada", naveQuebrada);
        nave.changeAnimation("quebrada");
    }
}

function estados(){

    textAlign(CENTER);
    textSize(50);
    textFont("Geórgian");
    stroke(0);
    strokeWeight(3);

    if(estado === "venceu"){
        fill("lightGreen");
        text("VOCÊ VENCEU!!", width/2, height/2-100);
        nave.velocityX = 0;
        nave.velocityY = 0;
    }

    if(estado === "perdeu"){
        fill("red");
        text("VOCÊ PERDEU!!", width/2, height/2-100);
        nave.velocityX = 0;
        nave.velocityY = 0;
    }
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}