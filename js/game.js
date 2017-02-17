// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var Times_die = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var hero_state = 1;
var jump_start = 0;
var jump = function(){
	hero_state = 0;
	time_jump = (Date.now() - jump_start)/500;
	if(time_jump <= 1){	
		hero.y -= 8 * (time_jump - 1) * (time_jump - 1);
	}
	else if(time_jump <= 2){
		hero.y += 8 * (time_jump - 1) * (time_jump - 1);
	}
	else{
		hero_state = 1;
		hero.y = 168;
	}

}
// Reset the game when the player catches a monster
var reset = function () {
	hero.x = 100;
	hero.y = 168;

	// Throw the monster somewhere on the screen randomly
	monster.x = canvas.width - 32;
	monster.y = 168;
};

// Update game objects
var update = function (modifier) {

	if (38 in keysDown && hero.y<(canvas.height - 32)) { // Player holding down
		if(hero_state == 1){
			jump_start = Date.now();
		}
	}
	jump();
	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
		) 
	{
		var r = confirm("One more try ?");
		if(r==true)
		{
			window.location.reload();
		}
		else{
			window.close();
		}
	}
	if(monster.x > 32)
	{
		monster.x -= modifier * 256;
	}
	else{
		monster.x = canvas.width - 32;
	}
};

// Draw everything
var render = function () {

	// background
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
	ctx.fillStyle="#FFF";
	ctx.fillRect(0,0,800,480);
	ctx.moveTo(0,200);
	ctx.lineTo(800,200);
	ctx.stroke();

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Time: " + time, 32, 32);
	ctx.fillText("Times Tried: " + Times_die, 32, 64);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	time = Math.floor((now - start)/ 1000);
	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};
// Time Check
var time_check =function(){
}


// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var start = then = Date.now();
var time= 0;

reset();
main();