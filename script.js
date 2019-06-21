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
    let goalLeft = new Goal(0, 0, 25, game.height, "goal", 1);
    let goalRight = new Goal(game.width - 25, 0, 25, game.height, "goal", 0);
    let circle = new Circle(game.width/2, game.height/2, game.width/8, "centerCircle", "#787878");
    let line = new Rectangle(game.width/2, 0, 2, game.height, "middleLine", "#787878");    
    let ball = new Ball(game.width/2, 0, 20, 20, "ball", 125, 125);
    let p = new Bot(25, game.height/2 - 150/2, 25, 150, "player", ball);
    let bot = new Bot(game.width - 2*25, game.height/2 - 150/2, 25, 150, "player", ball); 
    let fpsText = new ScreenText(0, 0, "? fps", 16, "#00FF00");
    fpsText.time = Date.now();
    fpsText.act = function(delta){
        if(Date.now() - this.time >= 100){
            this.time = Date.now();
            let fps = 1/delta;
            this.txt = Math.round(fps)+" fps";
        }
        
    };
    let scoreboard = new ScreenText(game.width/2, 0, "? - ?", 40, "#008000");
    scoreboard.setFont("Courier");
    scoreboard.act = function(delta){
        let oldFont = game.context.font;
        game.context.font = this.getFont();
        this.txt = game.score[0]+" - "+game.score[1];
        let width = game.context.measureText(this.txt).width;
        this.setPos(game.width/2 - width/2, this.size);
        game.context.font = oldFont;
    }
    
    
    let w1 = new Rectangle(game.width/2, game.height/2, 50, 50, "wall");

    
    game.actors.push(goalLeft);
    game.actors.push(goalRight);
    game.actors.push(line);
    game.actors.push(circle);
    game.actors.push(scoreboard);
    game.actors.push(p);
    game.actors.push(bot);
    game.actors.push(fpsText);
    //game.actors.push(w1);
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
    for(let i = game.actors.length - 1; i >= 0; i--){
        game.actors[i].collide();
    }

    game.context.clearRect(0, 0, game.width, game.height);
    //drawing
    for(let i = 0; i < game.actors.length; i++){
        game.actors[i].draw(game.context);
    }
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
