import {Rectangle} from "./rectangle.js"
import {game} from "../script.js"

export class Entity extends Rectangle{
    constructor(x, y, w, h, name){
        super(x, y, w, h, name);
        this.collidedList = [this.id];
    }

    collide(){
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

        for(let i = 0; i < game.actors.length; i++){
            let actor = game.actors[i];
            //excluding any already processed item
            if(this.collidedList.indexOf(actor.id) !== -1) continue;
            //if something is too far, it can't collide with it
            if(this.distance(actor) >= this.length + actor.length){
                actor.collidedList.push(this.id);
                this.collidedList.push(actor.id);
            }
            //if(actor.name === "ground" && this.onGround) continue;
            if(this.intersects(actor)){
                this.collideWithOther(actor);
            }
        }
    }

    collideWithOther(other){

    }
}
