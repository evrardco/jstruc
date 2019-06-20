//don't add stuff that might throw errors here...

var actors = undefined;
var t0 = undefined;
var last = undefined;
var now = undefined;
var targetDelta = undefined;
var Game = {
    width: undefined,
    height: undefined,
    tickLength: 16,
    keyPressed: new Array(),
    context: undefined
}

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
        p = new Player(0, 0, 25, 250, "player");
        p.setSpeed(0, 0);
        actors.push(p);
}
function init(){
       canvas = document.getElementById("mainScreen");
        window.addEventListener("keydown", keyDispatch);
        window.addEventListener("keyup", keyRemove);
        Game.width = canvas.getAttribute("width");
        Game.height = canvas.getAttribute("height");
        Game.context = canvas.getContext("2d");
        actors = new Array();
        t0 = now = Date.now();
        targetDelta = 16;
}
function mainLoop(){
    last = now;
    now = Date.now();

    //acting
    for(let i = 0; i<actors.length; i++){
        actors[i].act(1.0*(now-last)/1000);
    }

    //colliding
    for(let i = 0; i<actors.length; i++){
        actors[i].collide();
    }

    Game.context.clearRect(0, 0, Game.width, Game.height);
    //drawing
    for(let i = 0; i<actors.length; i++){
        actors[i].draw(Game.context);
    }

    lastKey = undefined;
    setTimeout(mainLoop, targetDelta);
}

function keyDispatch(event){
    if(Game.keyPressed.indexOf(event.key) !== -1) return;
    Game.keyPressed.push(event.key);
    console.log(Game.keyPressed);
}

function keyRemove(event){
    let i = Game.keyPressed.indexOf(event.key);
    if(i !== -1){
        Game.keyPressed.splice(i, 1);
    }
    console.log(Game.keyPressed);
}



