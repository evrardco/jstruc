import {Entity} from "./entity.js"
import {game} from "../script.js"

export class Player extends Entity {
    constructor(x, y, w, h, name){
        super(x, y, w, h, name);
        this.acc = 3000;
        this.maxSpeed = 6000;
    }

    collide(){
        super.collide();
        if(this.y < 0) {
            this.vy = 0;
            this.y = 0;
        }
        if(this.y + this.h > game.height){
            this.vy = 0;
            this.y = game.height - this.h;
        }
        if(this.x < 0) {
            this.vx = 0;
            this.x = 0;
        }
        if(this.x + this.w > game.width) {
            this.vx = 0;
            this.x = game.width - this.w;
        }

    }

    collideWithOther(other){
        if(other.name === "wall"){
            let side = this.whichSide(other);
            switch(side){
                case "top":
                    this.y = other.y - this.h;
                break;

                case "bottom":
                    this.y = other.y + other.h;
                break;

                case "left":
                    this.x = other.x - this.w;
                break;

                case "right":
                    this.x = other.x + other.w;
                break;
            }
        }
    }
    act(delta){
        super.act(delta);

        this.vx = this.vy = 0;
        game.keyPressed.forEach(elem => {
            if(elem === "ArrowLeft"){
                this.vx = -150;
            } 
            if(elem === "ArrowRight"){
                this.vx = 150;
            } 
            if(elem === "ArrowDown"){
                this.vy = 150;
            }
            if(elem === "ArrowUp"){
                this.vy = -150;
            }
        });

    }
}
