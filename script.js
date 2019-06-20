//don't add stuff that might throw errors here...
import {Player} from "./classes/player.js"
import {Game} from "./classes/game.js"

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
    let p = new Player(0, 0, 25, 250, "player");
    p.setSpeed(0, 0);
    game.actors.push(p);
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
        game.actors[i].act(1.0*(game.now - game.last)/1000);
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
