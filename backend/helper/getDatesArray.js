// date array
var getDateArray = function (start, end) {
  var arr = new Array(),
    dt = new Date(start);

  while (dt <= end) {
    arr.push({
      date: new Date(dt).toDateString(),
      numberOfFollower: 0,
    });
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
};

module.exports = getDateArray;
