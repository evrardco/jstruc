function dist(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function arrayRemove(array, item){
    let i = array.indexOf(item);
    if(i === -1) return;
    array.splice(i, 1);
    arrayRemove(array, item);
}

function sign(n){
    if(n >= 0){
        return 1;
    }else{
        return -1;
    }
}