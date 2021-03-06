var debug = true;

window.Shaft = (function (o) {

  Shaft.prototype = new Helpers();
  Shaft.prototype.constructor = Shaft;

  function Shaft (o) {
    this.o = o;

    this.shaftGroup = new Group();
    this.shaft = this.createShape(this.o.startPosition, this.o.rootSize, this.o.shaftLength, this.o.shaftThickness)
    this.shaftGroup.addChild(this.shaft)
    this.shaft.fillColor = 'black'
    this.shaft.type = o.type;
    // this.applyCurves(o.shaftCurve, o.shaftLength);
    this.tip = this.applytip(o)
    this.shaftGroup.addChild(this.tip)

    return this

  }

  Shaft.prototype.createShape = function(position, size, length, thickness) {

    var alpha = Math.random()
    var self = this;

    var createPoint = function(x, y) {
      return new Point({
        x: x - 20,
        y: y
      });
    }

    var shaft = new Path();

    shaft.add(createPoint(position[0] + size, position[1]))
    shaft.add(createPoint(position[0] + size + length, position[1] + this.o.shaftAngle))
    shaft.add(createPoint(position[0] + size + length, position[1] + this.o.shaftAngle - thickness))
    shaft.add(createPoint(position[0] + size, position[1] - thickness))

    shaft.strokeColor = new Color(0, 0, 0, 0.6);
    shaft.strokeWidth = 1;
    shaft.fillColor = null;
    shaft.closed = false;

    return shaft;

  }

  Shaft.prototype.getVector = function(radians, length) {
    return new Point({
      // Convert radians to degrees:
      angle: radians * 180 / Math.PI,
      length: length
    });
  }

  Shaft.prototype.changeSize = function(o) {

    var angles = this.getAngle(o);

    this.shaft.segments[0].point.y = o.startPosition[1]
    this.shaft.segments[1].point.y = o.startPosition[1] + o.shaftAngle
    this.shaft.segments[2].point.y = o.startPosition[1] + o.shaftAngle - o.shaftThickness
    this.shaft.segments[3].point.y = o.startPosition[1] - o.shaftThickness

    this.shaft.segments[1].point.x = o.startPosition[0] + o.shaftLength + o.rootSize + angles.angle1
    this.shaft.segments[2].point.x = o.startPosition[0] + o.shaftLength + o.rootSize + angles.angle2

    var top = new Point(this.shaft.segments[2].point.x + angles.angle1, this.shaft.segments[2].point.y) ;
    var bottom = new Point(this.shaft.segments[1].point.x + angles.angle1, this.shaft.segments[1].point.y);
    
    var vector = top - bottom;
    var angle = vector.angle;
    var middleVector = vector / 2;
    var middle = new Point(top.x - middleVector.x, bottom.y - middleVector.y - o.shaftThickness);

    this.tip.position = new Point(top.x - middleVector.x, bottom.y - middleVector.y - o.shaftThickness)
    this.tip.rotate(angle + 90)

    // this.applyCurves(o.shaftCurve, o.shaftLength);

  }

  Shaft.prototype.applytip = function(o) {

    var angles = this.getAngle(o);

    var top = new Point(this.shaft.segments[2].point.x + angles.angle1, this.shaft.segments[2].point.y) ;
    var bottom = new Point(this.shaft.segments[1].point.x + angles.angle1, this.shaft.segments[1].point.y);
    
    var vector = top - bottom;
    var angle = vector.angle;
    var middleVector = vector / 2;
    var middle = new Point(top.x - middleVector.x, bottom.y - middleVector.y - o.shaftThickness);
   
    var path = new Path.Circle(middle, o.shaftThickness / 2);
    path.rotate(angle + 180)
    path.strokeColor = new Color(0, 0, 0, 0.6);

    path.fillColor = null;
    path.scale(0.9, 0.9)
    path.segments[3].remove()
    path.closed = false;

    return path

  }

  Shaft.prototype.getAngle = function(o) {
    var updatedpoints1 = this.shaft.segments[1].point;
    updatedpoints1.x = o.startPosition[0] + o.shaftLength + o.rootSize;
    updatedpoints1.y = o.startPosition[1] + o.shaftAngle

    var vector = updatedpoints1 - this.shaft.segments[0].point
    var angle1;
    var angle2;

    if (vector.angle <= 0 ) {
      angle1 = Math.abs(vector.angle * Math.PI)
      angle2 = 0
    } else {
      angle1 = 0
      angle2 = Math.abs(vector.angle * Math.PI)
    }

    return {
      angle1: angle1,
      angle2: angle2,
    }
  }

  Shaft.prototype.applyCurves = function(curve, shaftLength) {

    var vector = this.shaft.segments[1].point - this.shaft.segments[0].point
    var angle;
    curve = 0;

    if (vector.angle <= 0 ) {
      angle = -Math.abs(vector.angle * 2)
    } else {
      angle = Math.abs(vector.angle * 2)
    }

    // this.shaft.segments[1].handleIn = new Point({
    //   angle: angle + 180 + curve,
    //   length: shaftLength / 2
    // })

    this.shaft.segments[1].handleOut = new Point({
      angle: angle + curve,
      length: 50
    })

    // this.shaft.segments[2].handleOut = new Point({
    //   angle: angle + 180 + curve,
    //   length: shaftLength / 2
    // })

    this.shaft.segments[2].handleIn = new Point({
      angle: angle + curve,
      length: 50
    })

  }

  Shaft.prototype.tip = function () {

  }

  Shaft.prototype.removeAll = function () {
    this.shaft.remove();
  }

  return Shaft;

})()
