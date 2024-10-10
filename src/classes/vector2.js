export class Vector2 {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    setCoords(x, y) {
        this.x = x;
        this.y = y;
    }

    setX(x) {
        this.x = x;
    }
    
    setY(y) {
        this.y = y;
    }

    cpy() {
        return new Vector2(this.x, this.y);
    }

    add(vector2) {
        return new Vector2(this.x + vector2.x, this.y + vector2.y);
    }
    
    sub(vector2) {
        return new Vector2(this.x - vector2.x, this.y - vector2.y);
    }

    mul(n) {
        return new Vector2(this.x * n, this.y * n);
    }

    dot(vector2) {
        return this.x * vector2.x + this.y * vector2.y;
    }

    len() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    dist(vector2) {
        let ret = Math.sqrt(Math.pow(this.x - vector2.x, 2) + Math.pow(this.y - vector2.y, 2));
        ret = ret === Infinity ? Number.MAX_VALUE : ret;
        return ret;
    }

    angle(vector2) {
        if (vector2 === undefined)
            vector2 = new Vector2(1, 0);

        let result = Math.acos(this.dot(vector2) / (this.len() * vector2.len()));
        return round2Decimals(result * 180 / Math.PI);
    }

    rotate(degrees) {
        let radians = degrees * (Math.PI / 180);
        return new Vector2(this.x * Math.cos(radians) - this.y * Math.sin(radians), this.x * Math.sin(radians) + this.y * Math.cos(radians))
    }
    
    normalize() {
        let len = this.len();
        this.x /= len;
        this.y /= len;
    }
    
    slope(){
        return this.y/this.x
    }
    /**
     * WIP DO NOT USE
     * traces a ray from this vector's position to an infinite line aligned to the y axis
     * according to dir's direction.
     * returns the x coordinate where the ray intersects the line.
     * @param {vector2} dir 
     * @param {real} lineY coordinate Y of the AA line
     */
    raycastYAA(dir, lineY){
        // we're going with the equation y = mx + p
        // first find m
        let m = dir.slope();
        // let's find p
        let p = this.y - m*this.x;
        let ret = (lineY - p)/m;
        if(ret === Infinity) ret = Number.MAX_VALUE;
        else if(ret === -Infinity) ret = -Number.MAX_VALUE;
        return ret; 

    }
    /**
     * WIP DO NOT USE
     * traces a ray from this vector's position to an infinite line aligned to the x axis
     * according to dir's direction.
     * returns the y coordinate where the ray intersects the line.
     * @param {vector2} dir 
     * @param {real} lineX coordinate Y of the AA line
     */
    raycastXAA(dir, lineX){
        // we're going with the equation y = mx + p
        // first find m
        let m = dir.slope();
        // let's find p
        let p = this.y - m*this.x;
        let ret = m*lineX + p;
        if(ret === Infinity) ret = Number.MAX_VALUE;
        else if(ret === -Infinity) ret = -Number.MAX_VALUE;
        return ret; 
    }
    /**
     * WIP DO NOT USE
     * returns the coordinates of the nearest valid collision with rect in dir direction
     * Might be improved by not checking if the collision is in boundaries
     * @param {Vector2} dir 
     * @param {Rectangle} rect 
     */
    raycastRectAA(dir, rect){
        let crossings = [
            new Vector2(rect.x ,this.raycastYAA(dir, rect.x)), // left Collision
            new Vector2(rect.x + rect.w ,this.raycastYAA(dir, rect.x + rect.w)), // right Collision
            new Vector2(this.raycastXAA(dir, rect.y), rect.y), // top Collision
            new Vector2(this.raycastXAA(dir, rect.y + rect.h), rect.y + rect.h), // bottom Collision
        ]
        let dists = crossings.map((vec) => this.dist(vec));
        console.log(dists)
        let index = 0;
        let min = Number.MAX_VALUE;
        for(let i = 0; i < dists.length; i++){
            if(dists[i] < min){
                min = dists[i];
                index = i;
            }
        }
        console.log(min)
        return crossings[index];

    }

}
