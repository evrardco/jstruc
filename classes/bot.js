import {game} from "../script.js"
import {Player} from "./player.js"
import {Entity} from "./entity.js"

export class Bot extends Player {
    constructor(x, y, w, h, name, ball){
        super(x, y, w, h, name);
        this.ball = ball;
        this.distracted = 0;
    }

    act(delta){
        this.x = this.x + delta * this.vx;
        this.y = this.y + delta * this.vy;
        if(this.distracted > 0){
            this.distracted -= delta;
            return;
        }else{
            if(Math.random() < 0.001){
                this.distracted = 2.5;
                console.log("uh?");
            }
        }
        let center = this.getCenter();
        if(Math.abs(this.ball.x - this.center.x) > game.width/2) return;
        let dy = Math.pow(Math.abs(this.ball.y - this.center.y), 1);
        let acc = (dy > this.h/2)? 600 : 600/2;
        
        if(this.ball.y  > center.y){
            this.vy = Math.min(this.maxSpeed, this.vy + acc*delta);
        }else if(this.ball.y  < center.y){
            this.vy = Math.max(-this.maxSpeed, this.vy - acc*delta);
        }
    }
}