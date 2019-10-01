import {Rectangle} from "./rectangle.js"
import {game} from "../script.js"
import {Vector2} from "./vector2.js"

export class Entity extends Rectangle{
    constructor(x, y, w, h, name){
        super(x, y, w, h, name);
        this.collidedList = [this.id];
        this.vel = new Vector2(0, 0);
        this.collidable = true;
        this.previousPos = new Vector2(0, 0);
        this.lastDelta = 0;

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
        this.previousPos.setCoords(this.pos.x, this.pos.y);
        this.pos.setCoords(this.pos.x + delta * this.vel.x, this.pos.y + delta * this.vel.y);
        this.lastDelta = delta;
    }

    setSpeed(vx, vy){
        this.vel.setCoords(vx, vy);
    }

    collide(){
        this.collidedList = [this.id] 

        for(let i = 0; i < game.actors.length; i++){
            let actor = game.actors[i];
            if(!actor.collidable) continue;
            //excluding any already processed item
            if(this.collidedList.indexOf(actor.id) !== -1) continue;
            //if something is too far, it can't collide with it
            if(this.distance(actor) >= this.length + actor.length){
                //actor.collidedList.push(this.id);
                this.collidedList.push(actor.id);
            }
            //if(actor.name === "ground" && this.onGround) continue;
            if(this.intersects(actor)){
                actor.collidedList.push(this.id);
                this.collideWithOther(actor);
            }
        }
    }

    collideWithOther(other){

        this.getCollisionSide(other)
    }
    /**
     * the actor with which the entity just collided
     * returns which side collided first.
     * @param {Actor} other 
     */
    getCollisionSide(other){

        let velx = this.vel.x;
        let vely = this.vel.y;
        
        //checking along x axis
        let xRect = new Rectangle(this.previousPos.x + this.lastDelta * velx, this.previousPos.y, this.w, this.h);
        let yRect = new Rectangle(this.previousPos.x, this.previousPos.y + this.lastDelta * vely, this.w, this.h);
        if(xRect.intersects(other)){
            //collision alongside x detected
            if(this.previousPos.x < other.x){
                return 'left';
            }else{
                return 'right';
            }
        }
        if(yRect.intersects(other)){
            //collision alongside y detected
            if(this.previousPos.y < other.y){
                return 'top';
            }else{
                return 'bottom';
            }
        }
        

    }
}
