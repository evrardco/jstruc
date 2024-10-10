export class Point {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    isIn(rect){
        return this.x > rect.x && this.x < rect.x + rect.w &&  
        this.y > rect.y && this.y < rect.y + rect.h;
    }
}