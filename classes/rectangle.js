import {Drawable} from "./drawable.js"
import {Point} from "./point.js"

export class Rectangle extends Drawable {
    constructor(x, y, w, h, name){
        super(x, y, w, h, name);
        this.center = new Point(this.x + this.w/2, this.y+ this.h/2);
    }
    

    getCenter(){
        return new Point(this.x + this.w/2, this.y+ this.h/2);
    }

    getCorners(){
        return {
            topLeft:        new Point(this.x            , this.y),
            topRight:       new Point(this.x + this.w   , this.y),
            bottomRight:    new Point(this.x + this.w   , this.y + this.h),
            bottomLeft:     new Point(this.x            , this.y + this.h)
        };
    }

    getIntersection(rect){
        let x = Math.max(this.x, rect.x);
        let w = Math.min(this.x + this.w, rect.x + rect.w) - x;
        let y = Math.max(this.y, rect.y);
        let h = Math.min(this.y + this.h, rect.y + rect.h) - y;
        return new Rectangle(x, y, w, h, "intersector");
    }

    whichSide(r2){
        var dx = (this.x + this.w/2) - (r2.x + r2.w/2);
        var dy = (this.y + this.h/2) - (r2.y + r2.h/2);
        var width = (this.w + r2.w)/2;
        var height = (this.h + r2.h)/2;
        var crossWidth = width*dy;
        var crossHeight = height*dx;
        var collision = 'none';
        //
        if(Math.abs(dx)<=width && Math.abs(dy)<=height){
          if(crossWidth>crossHeight){
            collision=(crossWidth > -crossHeight)?'bottom':'left';
          }else{
            collision=(crossWidth > -crossHeight)?'right':'top';
          }
        }
        return(collision);
    }

    intersects(rect){
        if(rect.x + rect.w > this.x)
        return  rect.x + rect.w > this.x && 
                rect.y + rect.h > this.y && 
                this.y + this.h > rect.y && 
                this.x + this.w > rect.x; 
    }

    draw(ctx){
        super.draw(ctx);
        let oldFill = ctx.fillStyle;
        
        ctx.fillStyle = "F44242";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = oldFill;
    }


}
