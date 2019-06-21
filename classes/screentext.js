import {Drawable} from "./drawable.js"

export class ScreenText extends Drawable {
    constructor(x, y, string, pxlSize, color){
        super(x, y+pxlSize, 0, 0, "text")
        this.size = pxlSize;
        this.txt = string;
        if(color === undefined){
            this.color = "#00FF00";
        }else{
            this.color = color;
        }
        this.font = "Arial";
    }
    // setPos(x, y){
    //     this.x = x;
    //     this.y = y+this.size;
    // }
    setFont(font){
        this.font = font;
    }
    getFont(){
        return this.size + "px "+ this.font;
    }
    draw(ctx){
        let oldFont = ctx.font;
        let oldFill = ctx.fillStyle;
        ctx.fillStyle = this.color;
        ctx.font = this.getFont();
        ctx.fillText(this.txt, this.x, this.y);
        ctx.fillStyle = oldFill;
        ctx.font = oldFont;
    }
}
