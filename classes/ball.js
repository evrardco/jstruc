import {Entity} from "./entity.js"
import {game} from "../script.js"

export class Ball extends Entity{
    constructor(x, y, w, h, name){
        super(x, y, w, h, name);
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