import {Rectangle} from "./rectangle.js"
import {game} from "../script.js"
import {Vector2} from "./vector2.js"

export class Entity extends Rectangle{
    constructor(x, y, w, h, name){
        super(x, y, w, h, name);
        this.collidedList = [this.id];
        this.vel = new Vector2(0, 0);
    }

    get vx() {
        return this.vel.x;
    }

    set vx(n) {
        this.vel.x = n;
    }

    get vy() {
        return this.vel.y;
    }

    set vy(n) {
        this.vel.y = n;
    }

    act(delta) {
        this.pos.setCoords(this.pos.x + delta * this.vel.x, this.pos.y + delta * this.vel.y);
    }

    setSpeed(vx, vy){
        this.vel.setCoords(vx, vy);
    }

    collide(){
        this.collidedList = [this.id] 

        for(let i = 0; i < game.actors.length; i++){
            let actor = game.actors[i];
            //excluding any already processed item
            if(this.collidedList.indexOf(actor.id) !== -1) continue;
            //if something is too far, it can't collide with it
            if(this.distance(actor) >= this.length + actor.length){
                //actor.collidedList.push(this.id);
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
