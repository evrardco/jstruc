import {game} from "../../script.js"
import {Player} from "../../classes/player.js"
import {ScreenText} from "../../classes/screentext.js"
import { Entity } from "../../classes/entity.js";
export var collisions = {
    populate: function(){

        let ball = new Entity(game.width/2, game.height/2, 20, 20, "ball");
        ball.full = false;
        
        let fpsText = new ScreenText(0, 0, "? fps", 16, "#00FF00");
        fpsText.time = Date.now();
        fpsText.act = function(delta){
            if(Date.now() - this.time >= 100){
                this.time = Date.now();
                let fps = 1/delta;
                this.txt = Math.round(fps)+" fps";
            }
            
        };

        let right = new Player(game.width - 2*25, game.height/2 - 150/2, 25, 150, "player", ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"]);
        right.full = false;

        game.debugCollisions = true;
        game.player = right;
        game.actors.push(right);
        game.actors.push(fpsText);
        game.actors.push(ball);
    },

    synchronize: function(){}        
}