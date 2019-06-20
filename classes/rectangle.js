import {Drawable} from "./drawable.js"

export class Rectangle extends Drawable {
    draw(ctx){
        super.draw(ctx);
        let oldFill = ctx.fillStyle;
        ctx.fillStyle = "F44242";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = oldFill;
        this.length = this.w*this.w + this.h*this.h;
    }

    intersects(rect){
        return  rect.x + rect.w > this.x && 
                rect.y + rect.h > this.y && 
                this.y + this.h > rect.y && 
                this.x + this.w > rect.x; 
    }

}
