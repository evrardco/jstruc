var id = 0
class Drawable {

    constructor(x, y, w, h, name){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = 0.0;
        this.vy = 0.0;
        this.name = name;
        this.id = id;
        id++;
        this.length = this.w*this.w + this.h*this.h;
    }
    setSpeed(vx, vy){
        this.vx = vx;
        this.vy = vy;
    }

    act(delta){
        this.x = this.x + delta * this.vx;
        this.y = this.y + delta * this.vy;
    }

    collide(){

    }

    draw(ctx){

    }
    
    distance(other){
        return dist(this.x, this.y, other.x, other.y);
    }
}

class ScreenText extends Drawable {
    constructor(x, y, string, pxlSize, color){
        super(x, y+pxlSize, pxlSize*string.length, pxlSize, "text")
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
class Rectangle extends Drawable {
    draw(ctx){
        super.draw(ctx);
        let oldFill = ctx.fillStyle;
        
        ctx.fillStyle = "F44242";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = oldFill;
        
        
    }

    intersects(rect){
        return  rect.x + rect.w > this.x && 
                rect.y + rect.h > this.y && 
                this.y + this.h > rect.y && 
                this.x + this.w > rect.x; 
    }

}
class Entity extends Rectangle{
    constructor(x, y, w, h, name){
        super(x, y, w, h, name);
        this.collidedList = [this.id];
    }

    collide(){
        if(this.y < 0) {
            this.vy = 0;
            this.y = 0;
        }
        if(this.y + this.h > Game.height){
            this.vy = 0;
            this.y = Game.height - this.h;
        }
        if(this.x < 0) {
            this.vx = 0;
            this.x = 0;
        }
        if(this.x + this.w > Game.width) {
            this.vx = 0;
            this.x = Game.width - this.w;
        }

        for(let i = 0; i < actors.length; i++){
            let actor = actors[i];
            //excluding any already processed item
            if(this.collidedList.indexOf(actor.id) !== -1) continue;
            //if something is too far, it can't collide with it
            if(this.distance(actor) >= this.length + actor.length){
                actor.collidedList.push(this.id);
                this.collidedList.push(actor.id);
            }
            //if(actor.name === "ground" && this.onGround) continue;
            if(this.intersects(actor)){
                this.collideWithOther(actor);
            }
        }
    }

    collideWithOther(other){

    }
}


class Player extends Entity {
    constructor(x, y, w, h, name){
        super(x, y, w, h, name);
        this.acc = 3000;
        this.maxSpeed = 6000;
    }


    act(delta){
        super.act(delta);

        this.vx = this.vy = 0;
        Game.keyPressed.forEach(elem => {
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

window.Drawable = Drawable;
window.Player = Player;
window.Rectangle = Rectangle;