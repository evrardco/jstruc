import {Entity} from "./entity.js"
import {game} from "../script.js"

export class Player extends Entity {
    constructor(x, y, w, h, name){
        super(x, y, w, h, name);
        this.acc = 3000;
        this.maxSpeed = 6000;
    }

    act(delta){
        super.act(delta);

        this.vx = this.vy = 0;
        game.keyPressed.forEach(elem => {
            if(elem === "ArrowLeft"){
                this.vx = -300;
            } 
            if(elem === "ArrowRight"){
                this.vx = 300;
            } 
            if(elem === "ArrowDown"){
                this.vy = 300;
            }
            if(elem === "ArrowUp"){
                this.vy = -300;
            }
        });

    }
}
