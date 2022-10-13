var Debugger = { };
Debugger.log = function(message) {
	
	try {
		console.log(message);
	}
	catch(exception) {
		return;
	}	
}

var istouch = 'ontouchstart' in window;
    if(istouch) {
        window.addEventListener("touchstart",mouseDown, true);
        window.addEventListener("touchend",mouseUp, true);
        window.addEventListener("touchmove", mouseMove, true);
    }
    else {
        window.addEventListener("mouseup", mouseUp, true);
        window.addEventListener("mousedown", mouseDown, true);
        window.addEventListener("mousemove", mouseMoveB, true);
    }

window.addEventListener("load", Init, false);
window.addEventListener("keydown", keyPressed, true);
window.addEventListener("touchmove", mouseMove, true);

 
var images = new Array();
var can_obj, bdata;
var theCanvas, context;
var current_screen = 0;
var score = 0, lines = 0;
var grid;
var intClear = 0;
var programUpdateVar = 0;

var downX = 0, downY = 0,upX = 0, upY = 0;

function mouseMove(e) {
	var sourceElement = e.target || e.srcElement;	
	if(current_screen ==1  && sourceElement.id=="can1") {
		e.preventDefault();
	}	
	upX = e.touches[0].pageX;
	upY = e.touches[0].pageY;
}

function mouseDown(e) {
	
	var ua = navigator.userAgent.toLowerCase();
	var isandroid = ua.indexOf("android") > -1; 
	if(!isandroid) {
		downX = e.pageX;
		downY = e.pageY;
	} else { 
		var androidversion = parseFloat(ua.slice(ua.indexOf("android")+8)); 
  		if (androidversion < 4.0)
  		{
			downX = downY = 0;
     	}
	 } 
}

function mouseUp(e) {
	
	if(downX == 0 && downY == 0) return;
	
	if(e.type == "touchend") {
		//upX = e.changedTouches[0].pageX;
		//upY = e.changedTouches[0].pageY;	
	} else {
		upX = e.pageX;
		upY = e.pageY;
	}
	var deltaX = downX - upX;
	var deltaY = downY - upY;
	if(Math.abs(deltaX) > 100) {
		if(deltaX < 0) { 
			moveRight();
		}
		if(deltaX > 0) { 
			moveLeft(); 
		}	
	} else if(Math.abs(deltaY) > 100) {
		if(deltaY > 0) { shiftColors(); }
		if(deltaY < 0) { moveDown(); }
	}
}


function updateProgram() {
	moveDown();
}


function startGame() {
	grid.clear();
	document.getElementById("inner_container").style.display= "inline";
	document.getElementById("start_container").style.display= "none";
	current_screen = 1;
	intClear = setInterval(checkClear, 2000);
	programUpdateVar = setInterval(updateProgram, 1700);
	score = lines = 0;
}

function checkClear() {
	for(var i = 0; i < 8; ++i) {
		for(z = 0; z < 17; ++z) {
			if(grid.blocks[i][z].color == -1)
				grid.blocks[i][z].color = 0;	
			
		}
	}
}

function moveLeft() {
	
	if(current_screen == 1)
		grid.moveLeft();
}

function moveRight() {
	if(current_screen == 1)
		grid.moveRight();
}

function moveDown() {
	if(current_screen == 1)
		grid.moveDown();
}

function shiftColors() {
	if(current_screen == 1)
		grid.gameBlock.shiftColors();
}

var downX = 0, downY = 0,upX = 0, upY = 0;
var old_down_X = 0;


var old_pos = 0;
var is_down = false;
var is_moved = false;

function mouseMove(e) {
    var sourceElement = e.target || e.srcElement;
    upX = e.touches[0].pageX;
    upY = e.touches[0].pageY;
    if(is_down === true) {
        var xpos = e.touches[0].pageX;
        var ypos = e.touches[0].pageY;
        
        if(xpos > downX+50) {
            downX = xpos;
            grid.keyRight();
            is_moved = true;
        } else if (xpos < downX-50) {
            downX = xpos;
            grid.keyLeft();
            is_moved = true;
        }
        
    }
    e.stopPropagation();
    e.preventDefault();
}


function mouseMoveB(e) {
    if(is_down === true) {
        var xpos = e.pageX;
        var ypos = e.pageY;
        if(xpos > downX+50) {
            downX = xpos;
            moveRight();
            is_moved = true;
        } else if (xpos < downX-50) {
            downX = xpos;
            moveLeft();
            is_moved = true;
        }
    }
    e.preventDefault();
}

function mouseDown(e) {
    
    if(e.type === "touchstart")  {
        downX = e.touches[0].pageX;
        downY = e.touches[0].pageY;
        
        if(e.touches.length > 1) {
            //grid.keyRotateLeft();
        }
        
    } else {
        downX = e.pageX;
        downY = e.pageY;
    }
    is_down = true;
}

function mouseUp(e) {
    
    is_down = false;
    
    if(downX === 0 && downY === 0) return;
    if(e.type === "touchend") {
        upX = e.changedTouches[0].pageX;
        upY = e.changedTouches[0].pageY;
    } else {
        upX = e.pageX;
        upY = e.pageY;
    }
    var deltaX = downX - upX;
    var deltaY = downY - upY;
    if(Math.abs(deltaX) > 100) {
        if(is_moved === false && deltaX < 0) {
            moveRight();
        }
        if(is_moved === false && deltaX > 0) {
             moveLeft();
        }
    } else if(Math.abs(deltaY) > 50) {
        if(deltaY > 0) { shiftColors(); }
        if(deltaY < 0) { moveDown(); }
    }
    
    if(is_moved === true) {
        is_moved = false;
    }
    e.preventDefault();
} 


function Block() {
	this.x = 0;
	this.y = 0;
	this.color = 0;
}

function GameBlock() {
	this.blocks = new Array();
	this.blocks[0] = new Block();
	this.blocks[1] = new Block();
	this.blocks[2] = new Block();
	this.nextblock = new Array();
	this.nextblock[0] = new Block();
	this.nextblock[1] = new Block();
	this.nextblock[2] = new Block();
	this.setNextBlock = function() {
			do {
				for(var q = 0; q < 3; ++q) {
					this.nextblock[q].color = Math.floor(Math.random()*8)+1;	
				}
			} while(this.nextblock[0].color == this.nextblock[1].color && this.nextblock[0].color == this.nextblock[2].color);
	}
	this.setNextBlock();
	this.resetBlock = function(addScore) {
		this.x = 3;
		this.y = 0;
		this.blocks[1].y = 1;
		this.blocks[2].y = 2;
		for(var  q = 0; q < 3; ++q) {
			this.blocks[q].color = this.nextblock[q].color;	
		}
		
		this.setNextBlock();
		if(addScore == 1) {
			score += 10;
			++lines;
		} 
	}
	
	this.shiftColors = function() {
		var c1,c2,c3;
		c1 = this.blocks[0].color;
		c2 = this.blocks[1].color;
		c3 = this.blocks[2].color;
		this.blocks[0].color = c3
		this.blocks[1].color = c1;
		this.blocks[2].color = c2;	
	}
	
	this.resetBlock(0);
}

function Grid() {
	this.blocks = new Array();
	this.clear = function() {
	for(var i = 0; i < 30; ++i) {
			this.blocks[i] = new Array();
			for(var z = 0; z < 30; ++z) {
				this.blocks[i][z] = new Block();
				this.blocks[i][z].x = i;
				this.blocks[i][z].y = z;
				this.blocks[i][z].color = 0;	
			}
		}
	}
	
	this.clear();
	this.gameBlock = new GameBlock();
	
	this.procBlocks = function() {
		for(var i = 0; i < 8; ++i) {
			for(var z = 0; z < 15; ++z) {
				if(this.blocks[i][z].color > 0 && this.blocks[i][z+1].color == 0) {
					this.blocks[i][z+1].color = this.blocks[i][z].color;
					this.blocks[i][z].color = 0;	
				}
			}
		}
	}
	
	this.checkBlocks = function() {
		for(var i = 0; i < 8; ++i) {
			for(var z = 0; z < 17; ++z) {
				var col = this.blocks[i][z].color;
				
				if(col > 0 && this.blocks[i+1][z].color == col && this.blocks[i+2][z].color == col) {
					if(this.blocks[i+3][z].color == col) {
						this.blocks[i+3][z].color = -1;
						score += 5; 	
						if(this.blocks[i+4][z].color == col) {
							this.blocks[i+4][z].color = -1;
							score += 5;
						}	
					}
					this.blocks[i][z].color = -1;
					this.blocks[i+1][z].color = -1;
					this.blocks[i+2][z].color = -1;
					
					score += 10;
					++lines;
				}		
			}
		}
		for(var i = 0; i < 8; ++i) {
			for(var	z = 0; z < 17; ++z) {
					var col = this.blocks[i][z].color;
					if(col > 0 && this.blocks[i][z+1].color == col && this.blocks[i][z+2].color == col) {
						if(this.blocks[i][z+3].color == col) {
							this.blocks[i][z+3].color = -1;
							score += 5; 	
						}
						this.blocks[i][z].color = -1;
						this.blocks[i][z+1].color = -1;
						this.blocks[i][z+2].color = -1;
						score += 10;
						++lines;
				}
			}
		}
		
		for(var i = 0; i < 8; ++i) {
			for(var z = 0; z < 17; ++z) {
				
				var col = this.blocks[i][z].color;
						
				if(col > 0 && this.blocks[i+1][z+1].color == col && this.blocks[i+2][z+2].color == col) {
					
					if(this.blocks[i+3][z+3].color == col) {
						this.blocks[i+3][z+3].color = -1;
						score += 10;	
						if(this.blocks[i+4][z+4].color == col) {
							this.blocks[i+4][z+4].color = -1;
							score += 10;
						}
		
					}	
					this.blocks[i][z].color = -1;
					this.blocks[i+1][z+1].color = -1;
					this.blocks[i+2][z+2].color = -1;
					score += 10;
					++lines;
				}
				
				if(col > 0 && i-2 >= 0 && z-2 >= 0 && this.blocks[i-1][z-1].color == col && this.blocks[i-2][z-2].color == col) {
					
					if(i-3 >= 0 && z-3 >= 0 && this.blocks[i-3][z-3].color == col) {
						this.blocks[i-3][z-3].color = -1;
						score += 10;	
						if(i-4 >= 0 && z-4 >= 0 && this.blocks[i-4][z-4].color == col) {
							this.blocks[i-4][z-4].color == -1;
							score += 10;
						}
					
					}
					this.blocks[i][z].color = -1;
					this.blocks[i-1][z-1].color = -1;
					this.blocks[i-2][z-2].color = -1;
					score += 10;
					++lines;
				}
				
				if(col > 0 && i-2 >= 0 && this.blocks[i-1][z+1].color == col && this.blocks[i-2][z+2].color == col) {
					
					if(i-3 >= 0 && this.blocks[i-3][z+3].color == col) {
						this.blocks[i-3][z+3].color = -1;
						score += 10;
						if(i-4 >= 0 && this.blocks[i-4][z+4].color == col) {
							this.blocks[i-4][z-4].color = -1;
							score += 10;
						}
					
					}
					
					this.blocks[i][z].color = -1;
					this.blocks[i-1][z+1].color = -1;
					this.blocks[i-2][z+2].color = -1;
					score += 10;
					++lines;
				
				}
				
				if(col > 0 && z-2 >= 0 && this.blocks[i+1][z-1].color == col && this.blocks[i+2][z-2].color == col) {
					
					if(z-3 >= 0 && this.blocks[i+3][z-3].color == col) {
						this.blocks[i+3][z-3].color = -1;
						score += 10;	
						
						if(z-4 >= 0 && this.blocks[i+4][z-4].color == col) {
							this.blocks[i+4][z-4].color = -1;
							score += 10;	
						}
					}
					
					
					this.blocks[i][z].color = -1;
					this.blocks[i+1][z-1].color = -1;
					this.blocks[i+2][z-2].color = -1;
					score += 10;
					++lines;	
				}
				
			}
		}
		
	}
	
	this.setBlock = function() {
		
		if(this.gameBlock.y == 0) {
			// stop timers
			current_screen = 2;	
			clearInterval(intClear);
			clearInterval(programUpdateVar);
			document.getElementById("inner_container").style.display= "none";
			document.getElementById("start_container").style.display= "inline";
		}
		
		for(var q = 0; q < 3; ++q) {
			this.blocks[this.gameBlock.x][this.gameBlock.y+this.gameBlock.blocks[q].y].color = this.gameBlock.blocks[q].color;	
		}
		
		this.gameBlock.resetBlock(0);
	}
	
	this.moveDown = function() {
		var x_pos = this.blocks[this.gameBlock.x][this.gameBlock.y+3].color;
		if((x_pos == 0) && this.gameBlock.y < 13)
			this.gameBlock.y++;
		else
			this.setBlock();
	}
	
	this.moveLeft = function() {
		if(this.gameBlock.x > 0) {
			var x_pos = this.blocks[this.gameBlock.x-1][this.gameBlock.y+2].color;
			if(x_pos == 0) --this.gameBlock.x;
		}
	}
	
	this.moveRight = function() {
		if(this.gameBlock.x < 7) {
				var x_pos = this.blocks[this.gameBlock.x+1][this.gameBlock.y+2].color;
				if(x_pos == 0) ++this.gameBlock.x;
		}
	}

}

function canvasMain() {
	can_obj = new canvasObject(320, 240);
}

function Init() {
	loadGraphics();
	canvasMain();
}

function loadGraphics() {
	for(var i = 0; i < 10; ++i) {
		images[i] = new Image();
		images[i].onload = function() {}
		images[i].src = "img/block" + i + ".jpg";	
	}
	images[10] = new Image();
	images[11] = new Image();	
	images[12] = new Image();
	images[10].onload = function() {}
	images[10].src="img/gamebg.jpg";
	images[11].onload = function () {}
	images[11].src="img/intro.jpg";
	images[12].onload = function () {}
	images[12].src="img/gameover.jpg";
	grid = new Grid();
}


function canvasSupport() {
	
}

function canvasObject(w, h) {
	this.width_ = w;
	this.height_ = h;
	this.offset_x = 0;
	this.offset_y = 0;
	var theCanvas = document.getElementById("can1");
	var context = theCanvas.getContext("2d");	
 	function drawScreen() {
		switch(current_screen) {
			case 0:
			drawIntro();
			break;
			case 1: 
			grid.checkBlocks();
			grid.procBlocks();		
			drawGame();
			break;
			case 2:
			drawGameOver();
			break;
		}
	}
	
	function drawIntro() {
		context.drawImage(images[11], 0, 0);
	}
	
	function drawGameOver() {
		context.drawImage(images[12], 0, 0);	
		context.font="18px Verdana";
		context.fillStyle="#FFFFFF";
		context.fillText("Great game, your score was: " + score + " You cleared: " + lines, 15, 45);
		context.font="60px Verdana";
		context.fillText("GAME OVER", 150, 240);
	}
	
	function drawGame() {
		context.drawImage(images[10], 0, 0);
		context.font="12px Verdana";
		context.fillStyle="#FFFFFF";
		context.fillText("Score: " + score + " Lines: " + lines, 200, 70);
		
		for(var i = 0; i < 8; ++i) {
			for(var z = 0; z < 17; ++z) {
				
				if(grid.blocks[i][z].color == -1)
				context.drawImage(images[Math.floor(Math.random()*8)+1], 182+(i*32), 100+(z*16));
				else if(grid.blocks[i][z].color != 0) 
				context.drawImage(images[grid.blocks[i][z].color], 182+(i*32), 100+(z*16));
				
			}
		}
		
		for(var q = 0; q < 3; ++q) {
			var xpos = ((grid.gameBlock.x + grid.gameBlock.blocks[q].x)*32)+182;
			var ypos = ((grid.gameBlock.y + grid.gameBlock.blocks[q].y)*16)+100;
			context.drawImage(images[grid.gameBlock.blocks[q].color], xpos, ypos);	
		}
		
		for(var p = 0; p < 3; ++p) {
			var xpos = 510;
			var ypos = 190+(p*16);
			context.drawImage(images[grid.gameBlock.nextblock[p].color], xpos, ypos);	
		}	
	}
	
	this.keyUp = function (key) {
		Debugger.log("Keypressed: " + key);
		drawScreen();
		
	}
	setInterval(drawScreen, 25);
	drawScreen();
}


function keyPressed(key) {
	switch(key.keyCode) {
		case 37:
		moveLeft();
		key.preventDefault();
		break;
		case 38:
		shiftColors();
		key.preventDefault();
		break;
		case 39:
		moveRight();
		key.preventDefault();
		break;
		case 40:
		moveDown();
		key.preventDefault();
		break;
	}
}

