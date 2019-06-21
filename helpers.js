function arrayRemove(array, item){
    let i = array.indexOf(item);
    if(i === -1) return;
    array.splice(i, 1);
    arrayRemove(array, item);
}

function round2Decimals(n) {
    return Math.round(n * 100 + Number.EPSILON ) / 100;
}
