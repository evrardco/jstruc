import {Rectangle} from "./rectangle.js";
export class Circle extends Rectangle{
    constructor(x, y, radius, name, color){
        super(x, y, radius, radius, name, color)
        this.radius = radius;
    }
    
    draw(ctx){
        let oldColor = ctx.fillStyle;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = oldColor;
    }
}