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
    /**
     * returns the corners of the rectangle in an array
     */
    getCorners(){
        return  [
                    new Vector2(this.x            , this.y), //topLeft
                    new Vector2(this.x + this.w   , this.y), //topRight
                    new Vector2(this.x + this.w   , this.y + this.h), //bottomRight
                    new Vector2(this.x            , this.y + this.h)  //bottomLeft
                ];
    }
    /**
     * WIP DO NOT USE
     * collisionData is an object returned by whichCorner.
     * this method returns the position that resolves the collision.
     * @param {Object} collisionData 
     */
    cornerCollisionResolution(collisionData){
        console.log(collisionData)
        let i = collisionData.index;
        let col = collisionData.collision;
        switch(i){
            case 0:
                return col;
            case 1:
                return new Vector2(col.x - this.w, col.y);
            case 2:
                return new Vector2(col.x - this.w, col.y - this.h);
            case 3:
                return new Vector2(col.x, col.y - this.h);
        }
    }
    
    /**
     * returns the intersection of this rectangle and rect as a Rectangle.
     * @param {Rectangle} rect 
     */
    getIntersection(rect){
        let x = Math.max(this.x, rect.x);
        let w = Math.min(this.x + this.w, rect.x + rect.w) - x;
        let y = Math.max(this.y, rect.y);
        let h = Math.min(this.y + this.h, rect.y + rect.h) - y;
        let ret = new Rectangle(x, y, w, h, "intersector");
        ret.color = 'red';
        
        return ret; 
    }
    /**
     * WIP DO NOT USE
     * returns which corner collides with r2 first in dir direction.
     * as the following object
     * {
     *  index:      Integer(the index of the corner in the corner array),
     *  corner:     Vector2(the coordinates of the corner),
     *  collision:  Vector2(where the corner will intersect with the rectangle)
     * }
     * @param {Rectangle} r2 
     * @param {Vector2} dir 
     */
    whichCorner(r2, dir){
        let corners = this.getCorners();
        let results = corners.map(value => value.raycastRectAA(dir, r2));
        console.log(results);

        let min = Number.MAX_VALUE;
        let index = 0;
        for(let i=0; i<results.length; i++){
            let dist = corners[i].dist(results[i]);
            if(dist < min){
                min = dist;
                index = i;
            }
        }

        return {
            index: index,
            corner: corners[index],
            collision: results[index]
        };
    }
    /**
     * Side collision method, buggy with disproportionate rectangles but faster.
     * returns which side is colliding with r2.
     * @param {*} r2 other rectangles to collide with.
     */
    whichSide(r2){
        //this code is magic and is from so
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
    /**
     * Returns true if this rectangle intersects rect, false otherwise.
     * @param {Rectangle} rect 
     */
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
    /**
     * returns wether or not point is in this rectangle
     * @param {Vector2} pt 
     */
    isInside(pt){
        return pt.x >= this.x && pt.x <= this.x + this.w &&
               pt.y >= this.y && pt.y <= this.y + this.h;
    }


}
