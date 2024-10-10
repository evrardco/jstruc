import { Entity } from "./entity.js";
import { game } from "../script.js";


export class Goal extends Entity{
    constructor(x, y, w, h, name, team){
        super(x, y, w, h, name);
        this.team = team
        
    }

    collideWithOther(other){
        if(other.name === "ball"){
            game.score[this.team] += 1;
            other.respawn();
        }
    }

    draw(ctx){
        return;
    }
    
}