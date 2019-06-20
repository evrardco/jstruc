var id = 0

export class Drawable {

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
