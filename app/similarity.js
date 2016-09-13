var math = require('mathjs');

var Prepare = function(text) {
    return text.replace('.','').toLowerCase();
};

var TextToVector = function(text, bagofwords) {
    return bagofwords.map(function(word) {
        return text.split(' ').filter(function(x) {
            return x == word;
        }).length;
    });
};


module.exports = function(text1, text2) {
    if (!(text1.length && text2.length)) {
        return 0;
    }
    text1 += ' ';
    text1 = Prepare(text1);
    text2 = Prepare(text2);
    var total = text1.concat(text2).split(' ');
    var allwords = total.filter(function(word, pos) {
        return total.indexOf(word) == pos;
    });
    var arr1 = TextToVector(text1, allwords);
    var arr2 = TextToVector(text2, allwords);
    return math.dot(arr1, arr2) / (math.norm(arr1) * math.norm(arr2));
};
