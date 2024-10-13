import {game} from "../../script.js"
import {Player} from "../../classes/player.js"
import {ScreenText} from "../../classes/screentext.js"
import {Ball} from "../../classes/ball.js"
import {Rectangle} from "../../classes/rectangle.js"
import {Vector2} from "../../classes/vector2.js"
import { Bot } from "../../classes/bot.js";
import { Drawable } from "../../classes/drawable.js";
import { Circle } from "../../classes/circle.js";
import { Goal } from "../../classes/goal.js";
export var pong = {
    populate: function(){
        let goalLeft = new Goal(0, 0, 25, game.height, "goal", 1);
        let goalRight = new Goal(game.width - 25, 0, 25, game.height, "goal", 0);
        let circle = new Circle(game.width/2, game.height/2, game.width/8, "centerCircle", "#787878");
        let line = new Rectangle(game.width/2, 0, 2, game.height, "middleLine", "#787878");    
        let ball = new Ball(game.width/2, 0, 20, 20, "ball", 250, 250);
        game.ball = ball;
        
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
        
        
        
        let right = new Player(game.width - 2*25, game.height/2 - 150/2, 25, 150, "player", ["", "", "", ""]);
        let left;

        if(game.local){
            //game in local mode
            left = new Bot(25, game.height/2 - 150/2, 25, 150, "bot", ball);
            game.other = left;
            game.player = right;
            right.keyMap = game.defaultKeyMap;

            game.actors.push(left);
            game.actors.push(right);
            game.actors.push(scoreboard);
            game.actors.push(scoreboard);
            game.actors.push(fpsText);
            game.actors.push(ball);
            game.actors.push(line);
            game.actors.push(circle);
            game.actors.push(goalLeft);
            game.actors.push(goalRight);
            
        } else {
            

            left = new Player(25, game.height/2 - 150/2, 25, 150, "player", ["", "", "", ""]);//left, right, up, down
            let other;
            //networking
            game.socket.on("left", function(cb){
                console.log("You are the player on the left");
                game.side = "left";
                game.actors.push(left);
                left.keyMap = game.defaultKeyMap;
                game.other = right;
                game.player = left;
                cb();
            });

            game.socket.on("right", function(cb){
                console.log("You are the player on the right");
                game.side = "right";
                game.actors.push(left);
                
                right.keyMap = game.defaultKeyMap;
                game.other = left;
                game.player = right;
                cb();
            });


            game.actors.push(right);
            game.actors.push(ball);
            game.actors.push(goalLeft);
            game.actors.push(goalRight);
            game.actors.push(line);
            game.actors.push(circle);
            game.actors.push(scoreboard);
            game.actors.push(fpsText);

            game.socket.emit("populated");
        }

    
    },

    synchronize: function() {
        game.socket.emit("update", {
            type: "player",
            side: game.side,
            pos: {
                x: game.player.x,
                y: game.player.y
            },
            vel: {
                x: game.player.vx,
                y: game.player.vy
            },
        });
        if(game.side === "left") {
            game.socket.emit("update", {
                type: "ball", 
                pos: {
                    x: game.ball.x,
                    y: game.ball.y
                },
                vel: {
                    x: game.ball.vx,
                    y: game.ball.vy
                },
            });
        }
    }
}