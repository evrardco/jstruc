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
        return Math.sqrt(Math.pow(this.x - vector2.x, 2) + Math.pow(this.y - vector2.y, 2));
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

}
