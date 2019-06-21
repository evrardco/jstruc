import {game} from "../script.js"
import {Player} from "./player.js"
import {Entity} from "./entity.js"

export class Bot extends Player {
    constructor(x, y, w, h, name, ball){
        super(x, y, w, h, name);
        this.ball = ball;
    }

    act(delta){
        this.x = this.x + delta * this.vx;
        this.y = this.y + delta * this.vy;
        let center = this.getCenter();
        let dy = Math.pow(Math.abs(this.ball.y - this.center.y), 1);
        let acc = (dy > this.h/2)? 300 : 300/4;
        
        if(this.ball.y  > center.y){
            this.vy = Math.min(this.maxSpeed, this.vy + acc*delta);
        }else if(this.ball.y  < center.y){
            this.vy = Math.max(-this.maxSpeed, this.vy - acc*delta);
        }
    }
}