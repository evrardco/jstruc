import { Entity } from "./entity.js";
import { game } from "../script.js";


export class Goal extends Entity{
    constructor(x, y, w, h, name, team, cb){
        super(x, y, w, h, name);
        this.team = team
        if (cb !== undefined) {
            this.cb = cb;
        } else {
            this.cb = function(){};
        }
        
    }

    collideWithOther(other){
        if(other.name === "ball"){
            game.score[this.team] += 1;
            other.respawn();
            this.cb()
        }
    }

    draw(ctx){
        return;
    }
    
}