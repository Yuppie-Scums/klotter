Penis.prototype.setAnglePosition = function(startingPoint, viewAngle, shaftAngle) {

  var newStartingPoint = startingPoint;

  if (viewAngle === 'left') {
    newStartingPoint[0] = startingPoint[0] + Math.floor(Math.random() * 10) + 10;
  } else {
    newStartingPoint[0] = startingPoint[0] - Math.floor(Math.random() * 10) + 10;
  }

  // if (shaftAngle >= 70) {
  //   newStartingPoint[1] = startingPoint[1] + Math.floor(Math.random() * 10) + 10;
  // } else {
  //   newStartingPoint[1] = startingPoint[1] - Math.floor(Math.random() * 10) + 10;
  // }

  return newStartingPoint;
}

Shaft.prototype.addCurve = function(segments) {

  var i = 0;
  var length = segments.length

  for (; i < length; i++) {

    this.segment[i].handleIn = new Point({
      angle: 90,
      length: 20
    })

  }

  return this;

}
