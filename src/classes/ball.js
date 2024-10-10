import {Entity} from "./entity.js"
import {game} from "../script.js"
import { Point } from "./point.js";

export class Ball extends Entity{
    constructor(x, y, w, h, name, vx, vy){
        super(x, y, w, h, name);
        this.spawn = {
            pos: new Point(x, y),
            vel: new Point(vx, vy)
        }
        this.setSpeed(vx, vy);
    }

    respawn(){
        this.setPos(this.spawn.pos.x, this.spawn.pos.y);
        this.setSpeed(this.spawn.vel.x, this.spawn.vel.y);
        if(Math.random() <= 0.5){
            this.setSpeed(this.spawn.vel.x, this.spawn.vel.y);
        }else{
            this.setSpeed(-this.spawn.vel.x, this.spawn.vel.y);
        }
        
    }
    collide(){
        super.collide();
        if(this.y < 0) {
            this.y = 0;
            this.vy *= -1;
        }
        if(this.y + this.h > game.height){
            this.y = game.height - this.h;
            this.vy *= -1;
        }
        if(this.x < 0) {
            this.x = 0;
            this.vx *= -1;
        }
        if(this.x + this.w > game.width) {
            this.x = game.width - this.w;
            this.vx *= -1;
        }
    }
    collideWithOther(other){
        if(other.name === "goal"){
            game.score[other.team]++;
            this.respawn();
            return;
        }
        let side = this.whichSide(other);
        // this.vy += other.vy;
        // this.vx += other.vx;
        switch(side){
            
            case "top":
                this.vy *=-1;
                this.y = other.y - this.h;
            break;

            case "bottom":
                this.vy *=-1;
                this.y = other.y + other.h;
            break;

            case "left":
                this.vx *=-1;
                this.x = other.x - this.w;
            break;

            case "right":
                this.vx *=-1;
                this.x = other.x + other.w;
            break;
        }
    }
}
