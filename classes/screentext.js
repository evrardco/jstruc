import {Drawable} from "./drawable.js"

export class ScreenText extends Drawable {
    constructor(x, y, string, pxlSize, color){
        super(x, y+pxlSize, 0, 0, "text")
        this.size = pxlSize;
        this.txt = string;
        this.color = color;
    }

    draw(ctx){
        let oldFont = ctx.font;
        let oldFill = ctx.fillStyle;
        ctx.fillStyle = "#00FF00";
        ctx.font = this.size + "px Arial";
        ctx.fillText(this.txt, this.x, this.y);
        ctx.fillStyle = oldFill;
        ctx.font = oldFont;
    }
}
