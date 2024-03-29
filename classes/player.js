import {Entity} from "./entity.js"
import {game} from "../script.js"

export class Player extends Entity {
    constructor(x, y, w, h, name, keyMap){
        super(x, y, w, h, name);
        this.acc = 3000;
        this.maxSpeed = 6000;
        this.keyMap = keyMap;
        this.lastSide = new Object();// used to keep the result of the last collision
        if(keyMap === undefined){
            this.keyMap = game.defaultKeyMap;
        }else{
            this.keyMap = keyMap;
        }
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
        let side = this.getCollisionSide(other);
        switch(side){
            case "top":
                this.y = other.y - this.h - 2;
            break;

            case "bottom":
                this.y = other.y + other.h + 2;
            break;

            case "left":
                this.x = other.x - this.w - 2;
            break;

            case "right":
                this.x = other.x + other.w + 2;
            break;
        }

    }
    act(delta){
        this.setSpeed(0, 0);
        game.keyPressed.forEach(elem => {
            if(elem === this.keyMap[0]){
                this.vx = -150;
            } 
            if(elem === this.keyMap[1]){
                this.vx = 150;
            } 
            if(elem === this.keyMap[2]){
                this.vy = 150;
            }
            if(elem === this.keyMap[3]){
                this.vy = -150;
            }
            if(elem === "d"){
                game.socket.disconnect();
            }
        });

        super.act(delta);


    }
}
