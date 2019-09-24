//don't add stuff that might throw errors here...
import {Player} from "./classes/player.js"
import {Game} from "./classes/game.js"
import {ScreenText} from "./classes/screentext.js"
import {Ball} from "./classes/ball.js"
import {Rectangle} from "./classes/rectangle.js"
import {Vector2} from "./classes/vector2.js"
import { Bot } from "./classes/bot.js";
import { Drawable } from "./classes/drawable.js";
import { Circle } from "./classes/circle.js";
import { Goal } from "./classes/goal.js";
import { pong } from "./scenarios/tests/pong.js"
import { collisions } from "./scenarios/tests/collision_test.js"


export let game;

document.addEventListener('readystatechange', event => {

    if (event.target.readyState === "interactive") {      //same as:  document.addEventListener("DOMContentLoaded"...   // same as  jQuery.ready
        //All HTML DOM elements are accessible
    }

    if (event.target.readyState === "complete") {
        //Now external resources are loaded too, like css,src etc... 

        startup();
        //document.getElementById('game').addEventListener('keypress', handleKeyPress);
        
    }

});

export function startup(){
    init();
    game.scenario.populate();
    launch();
}

function init(){
    
    game = new Game();
    game.scenario = collisions;
    game.local = true;
    window.addEventListener("keydown", keyDispatch);
    window.addEventListener("keyup", keyRemove);

    if(!game.local){
        game.socket = io("http://192.168.1.28:8080");
        //Now we can listen for that event
        game.socket.on('onconnected', function( data ) {
                //Note that the data is the object we sent from the server, as is. So we can assume its id exists. 
            console.log( 'Connected successfully to the socket.io server. My server side ID is ' + data.id );
        });
        game.socket.on("update", updateHandler);
    }



}

function updateHandler(data){
    let toUpdate = (data.type === "player") ? game.other : game.ball;
    toUpdate.x = data.pos.x;
    toUpdate.y = data.pos.y;

    toUpdate.vx = data.vel.x;
    toUpdate.vy = data.vel.y;
}


function launch(){
    if(!game.local){
        game.socket.on("ready", function(){
            console.log("The game is ready."); 
            mainLoop();
        });
    }else{
        mainLoop();
    }
}

function mainLoop(){

    game.last = game.now;
    game.now = Date.now();

    //acting
    for(let i = 0; i < game.actors.length; i++){
        // console.log("iterating through: " + game.actors[i].name);
        game.actors[i].act(game.timeScale * (game.now - game.last) / 1000);
    }

    //colliding
    for(let i = game.actors.length - 1; i >= 0; i--){
        game.actors[i].collide();
    }

    game.context.clearRect(0, 0, game.width, game.height);
    //drawing
    for(let i = 0; i < game.actors.length; i++){
        game.actors[i].draw(game.context);
    }
    
    if(!game.local){
       game.scenario.synchronize();
    }
    
    game.tickNumber++;
    window.requestAnimationFrame(mainLoop);

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
