class AABBSegment {
    
    constructor(p1, p2, xOriented){
        this.a = p1;
        this.b = p1;
        this.xOriented = xOriented;
    }

    hitDistance(point, m){
        let p = point.y - m*point.x;
    }
}