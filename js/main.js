const blockWidth = 300;
const blockHeight = 30;

let currentBlock;
let blockDir;
let blockSpeed;
let placedBlocks = [];

var song;
var lose;

const stateStart = "start"
const statePlaying = "playing";
const stateLose = "lose";
const stateWin = "win";

let menuState = stateStart;

 function preload() {
     song = loadSound('level1.mp3');
     lose = loadSound('Losesound.wav');
     
}

function setup() {
  createCanvas(600, 600);
  textAlign(CENTER, CENTER);
  newGame();
}

function draw() {
  background(220);
  
  if(menuState === statePlaying) { 
    textSize(blockHeight);
    updateBlock();
    drawBlocks();
  } else if(menuState === stateLose) {
    textSize(blockHeight * 2);
    fill(168, 64, 50);
    text("Sorry, you lost", width/2, height/2);
    textSize(blockHeight);
    text("Press space to start a new game!", width/2, height * 3/4);
  } else if(menuState === stateWin) {
    textSize(blockHeight * 2);
    fill(72, 168, 50);
    text("Congrats, you won!", width/2, height/2);
    textSize(blockHeight);
    text("Press space to start a new game!", width/2, height * 3/4);
  } else if(menuState === stateStart) {
    textSize(blockHeight * 2);
    fill(72, 168, 50);
    textSize(blockHeight);
    text("Press space to start a new game!", width/2, height * 3/4);
  }   
}

function keyReleased() {
  if(key === " ") {
    if(menuState === statePlaying) {
      placeBlock(); 
    } else {
      newGame();
      playingSong();
      menuState = statePlaying;
    }
  }
}

function playingSong() {
  if (song.isPlaying()) {
    getAudioContext().resume(); 
    song.pause();
    playingSong();
  } else {
    song.loop();
  }
}

function newGame() {
  currentBlock = createVector(0, height-blockHeight, blockWidth);
  blockDir = 1;
  blockSpeed = 2;
  placedBlocks = [];
}

function updateBlock() {
  currentBlock.x += blockDir * blockSpeed;
  
  if(currentBlock.x < 0) {
    blockDir = 1;
  }
  if(currentBlock.x + currentBlock.z > width) {
    blockDir = -1;
  }  
}

function drawBlocks() {
  fill(245, 132, 66);
  rect(currentBlock.x, currentBlock.y, currentBlock.z, blockHeight);
  
  fill(50);
  for(let block of placedBlocks) {
    rect(block.x, block.y, block.z, blockHeight);
  }
  
  text(placedBlocks.length, blockHeight, blockHeight);
}

function placeBlock() {
  const prevBlock = placedBlocks[placedBlocks.length - 1];
  
  let newWidth = blockWidth;
  
  if(prevBlock) {
    const leftEdge = max(prevBlock.x, currentBlock.x);
    const rightEdge = min(prevBlock.x + prevBlock.z, currentBlock.x + currentBlock.z);

    newWidth = rightEdge - leftEdge;
    
    currentBlock.x = leftEdge;
    currentBlock.z = newWidth;
  }
  
  if(newWidth < 0) {
    menuState = stateLose;
    lose.play();
    return;
  }
  
  placedBlocks.push(currentBlock);
  
  blockSpeed *= 1.1;
  
  newBlock(newWidth);
}

function newBlock(newWidth) {
  const blockStackHeight = (placedBlocks.length + 1) * blockHeight;
  
  if(blockStackHeight > height) {
    menuState = stateWin;
    return;
  }
  
  currentBlock = createVector(0, height - blockStackHeight, newWidth);
}