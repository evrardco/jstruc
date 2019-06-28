
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
        this.score = [0, 0];
        this.playerId = undefined;
        this.side = undefined // "left" | "right", used in multiplayer.
        this.socket = undefined;
        this.defaultKeyMap = ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"];
        this.other = undefined;
        this.player = undefined;
        this.ready = false;
        this.ball = undefined;
    }

}
