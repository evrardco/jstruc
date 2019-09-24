import {Drawable} from "./drawable.js"
import { Vector2 } from "./vector2.js";



export class Rectangle extends Drawable {
    constructor(x, y, w, h, name, color){
        super(x, y, w, h, name, color);
        this.center = new Vector2(this.x + this.w/2, this.y+ this.h/2);
        this.full = true;
        this.singleFrame = false; 

    }
    

    getCenter(){
        return new Vector2(this.x + this.w/2, this.y+ this.h/2);
    }

    getCorners(){
        return {
            topLeft:        new Vector2(this.x            , this.y),
            topRight:       new Vector2(this.x + this.w   , this.y),
            bottomRight:    new Vector2(this.x + this.w   , this.y + this.h),
            bottomLeft:     new Vector2(this.x            , this.y + this.h)
        };
    }

    getIntersection(rect){
        let x = Math.max(this.x, rect.x);
        let w = Math.min(this.x + this.w, rect.x + rect.w) - x;
        let y = Math.max(this.y, rect.y);
        let h = Math.min(this.y + this.h, rect.y + rect.h) - y;
        let ret = new Rectangle(x, y, w, h, "intersector");
        ret.color = 'red';
        
        return ret; 
    }

    whichCorner(r2){
        

    }
    /**
     * Side collision method, buggy with disproportionate rectangles but faster.
     * returns which side is colliding with r2.
     * @param {*} r2 other rectangles to collide with.
     */
    whichSide(r2){
        var dx = (this.x + this.w/2) - (r2.x + r2.w/2);
        var dy = (this.y + this.h/2) - (r2.y + r2.h/2);
        var width = (this.w + r2.w)/2;
        var height = (this.h + r2.h)/2;
        var crossWidth = width*dy;
        var crossHeight = height*dx;
        var collision = 'none';
        //
        if(Math.abs(dx)<width && Math.abs(dy)<height){
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
        if(this.full){
            let oldFill = ctx.fillStyle;
            ctx.fillStyle =this.color;
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = oldFill;
        }else {
            let oldStroke = ctx.strokeStyle;
            ctx.strokeStyle =this.color;
            ctx.strokeRect(this.x, this.y, this.w, this.h);
            ctx.strokestyle = oldStroke;
        }

        if(this.singleFrame){
            this.remove();
        }

    }


}
