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
