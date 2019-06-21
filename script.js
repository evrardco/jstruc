//don't add stuff that might throw errors here...
import {Player} from "./classes/player.js"
import {Game} from "./classes/game.js"
import {ScreenText} from "./classes/screentext.js"
import {Ball} from "./classes/ball.js"
import {Rectangle} from "./classes/rectangle.js"
import {Vector2} from "./classes/vector2.js"

export let game;

document.addEventListener('readystatechange', event => {

    if (event.target.readyState === "interactive") {      //same as:  document.addEventListener("DOMContentLoaded"...   // same as  jQuery.ready
        //All HTML DOM elements are accessible
    }

    if (event.target.readyState === "complete") {
        //Now external resources are loaded too, like css,src etc... 
        init();
        populate();
        mainLoop();
        //document.getElementById('game').addEventListener('keypress', handleKeyPress);
        
    }

});
function populate(){
    let p = new Player(0, 0, 25, 150, "player");
    p.setSpeed(0, 0);
    game.actors.push(p);
    let fpsText = new ScreenText(0, 0, "? fps", 16);
    fpsText.time = Date.now();
    fpsText.act = function(delta){
        if(Date.now() - this.time >= 100){
            this.time = Date.now();
            let fps = 1/delta;
            this.txt = Math.round(fps)+" fps";
        }
        
    };
    game.actors.push(fpsText);
    let w1 = new Rectangle(game.width/2, game.height/2, 50, 50, "wall");
    game.actors.push(w1);

    let ball = new Ball(game.width/2, 0, 20, 20, "ball");
    ball.setSpeed(125, 125);
    game.actors.push(ball);
}
function init(){
    game = new Game();
    window.addEventListener("keydown", keyDispatch);
    window.addEventListener("keyup", keyRemove);
}
function mainLoop(){
    game.last = game.now;
    game.now = Date.now();

    //acting
    for(let i = 0; i < game.actors.length; i++){
        game.actors[i].act(game.timeScale * (game.now - game.last) / 1000);
    }

    //colliding
    for(let i = 0; i < game.actors.length; i++){
        game.actors[i].collide();
    }

    game.context.clearRect(0, 0, game.width, game.height);
    //drawing
    for(let i = 0; i < game.actors.length; i++){
        game.actors[i].draw(game.context);
    }

    let lastKey = undefined;
    setTimeout(mainLoop, game.targetDelta);
}

function keyDispatch(event){
    if(game.keyPressed.indexOf(event.key) !== -1) return;
    game.keyPressed.push(event.key);
    console.log(game.keyPressed);
}

function keyRemove(event){
    let i = game.keyPressed.indexOf(event.key);
    if(i !== -1){
        game.keyPressed.splice(i, 1);
    }
    console.log(game.keyPressed);
}
