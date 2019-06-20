class Vector2 {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    setPos(x, y) {
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

    angle(vector2) {
        return Math.acos(this.dot(vector2) / (this.len() * vector2.len())) * (180 / Math.PI);
    }

    rotate(degrees) {
        return new Vector2(this.x * Math.cos(degrees) - this.y * Math.sin(degrees), this.x * Math.sin(degrees) + this.y * Math.cos(degrees))
    }
    
    normalize() {
        let len = this.len();
        this.x /= len;
        this.y /= len;
    }
}
