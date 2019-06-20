export class Game {

    constructor(){
        let canvas = document.getElementById("mainScreen");
        this.width = canvas.getAttribute("width");
        this.height = canvas.getAttribute("height");
        this.tickLength = 16;
        this.keyPressed = new Array();
        this.context = canvas.getContext("2d");
        this.actors = new Array();
        this.t0 = this.now = Date.now();
        this.targetDelta = 16;
        this.timeScale = 1.0;
    }

}
