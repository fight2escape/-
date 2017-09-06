// 整星
function convertToStarsArray(stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 1; i <= 5; i++) {
        if (i <= num) {
            array.push(1);
        } else {
            array.push(0);
        }
    }
    return array;
}
// 包含半星
function convertToStarsArray2(stars) {
    var array = [];
    for (var i = 10; i <= 50; i += 10) {
        if (i <= stars) {
            array.push(1);  // 1代表整星
        } else if ((i - 5) == stars) {
            array.push(2);  // 2代表半星
        } else {
            array.push(0);  // 0代表没星
        }
    }
    return array;
}

module.exports = {
    convertToStarsArray: convertToStarsArray,
    convertToStarsArray2: convertToStarsArray2
}