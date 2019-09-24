import { Vector2 } from "./vector2.js";
import { game } from "../script.js";

var id = 0

export class Drawable {

    constructor(x, y, w, h, name, color){
        this.pos = new Vector2(x, y);
        this.w = w;
        this.h = h;
        this.name = name;
        this.id = id;
        id++;
        this.length = this.w * this.w + this.h * this.h;
        this.collidable = false;
        if(color === undefined){
            this.color = "F44242";
        }else{
            this.color = color;
        }
    }

    get x() {
        return this.pos.x;
    }

    set x(n) {
        this.pos.x = n;
    }

    get y() {
        return this.pos.y;
    }

    set y(n) {
        this.pos.y = n;
    }
    
    setPos(x, y){
        this.pos.y = y;
        this.pos.x = x;
    }
    act(delta){

    }

    draw(ctx){

    }

    collide(){

    }
    
    distance(vector2){
        return this.pos.dist(vector2);
    }

    remove(){
        var id = this.id;
        game.actors = game.actors.filter(function(value, index, array){return value.id !== id});
    }
}
