import {Rectangle} from "./rectangle.js"
import {game} from "../script.js"

export class Entity extends Rectangle{
    constructor(x, y, w, h, name){
        super(x, y, w, h, name);
        this.collidedList = [this.id];
    }

    collide(){
        this.collidedList = [this.id] 

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
