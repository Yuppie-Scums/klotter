var debug = true;

window.Shaft = (function (o) {

  Shaft.prototype = new Helpers();
  Shaft.prototype.constructor = Shaft;

  function Shaft (o) {
    this.o = o;

    this.shaft = this.createShape(this.o.startPosition, this.o.rootSize, this.o.shaftLength, this.o.shaftThickness)

    // this.ball = this.alterShape.call(this.ball, 10)
    // this.ball = this.addPoints.call(this.ball, 15)
    // this.ball = this.movePoint.call(this.ball, 3);
    this.shaft.fillColor = 'black'
    this.shaft.type = o.type;
    // this.bend.call(this.shaft, this.shaft.segments)
    // this.addTip.call(this.shaft, this.shaft.segments)
    // this.addCurve.call(this.shaft, this.shaft.segments)

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

    shaft.strokeColor = new Color(0, 0, 0, alpha + 0.1);
    shaft.strokeWidth = 1;
    shaft.fillColor = new Color(50, 50, 50);
    shaft.closed = true;

    // shaft.fullySelected = true;

    return shaft;

  }

  Shaft.prototype.removeAll = function() {
    console.log(this)
    this.shaft.remove()
    this.shaft.removeChildren()
  }

  Shaft.prototype.getVector = function(radians, length) {
    return new Point({
      // Convert radians to degrees:
      angle: radians * 180 / Math.PI,
      length: length
    });
  }

  Shaft.prototype.changeSize = function(o) {
    // {
    //   startPosition: this.startPosition,
    //   style: this.style,
    //   type: 'normal',
    //   shaftAngle: this.shaftAngle,
    //   shaftLength: this.shaftLength,
    //   shaftThickness: this.shaftThickness,
    //   rootSize: this.rootSize,
    //   tipLength: this.tipLength
    // }

    this.shaft.segments[0].point.y = o.startPosition[1]
    this.shaft.segments[1].point.y = o.startPosition[1] + o.shaftAngle
    this.shaft.segments[2].point.y = o.startPosition[1] + o.shaftAngle - o.shaftThickness
    this.shaft.segments[3].point.y = o.startPosition[1] - o.shaftThickness

    this.shaft.segments[1].point.x = o.startPosition[0] + o.shaftLength + o.rootSize
    this.shaft.segments[2].point.x = o.startPosition[0] + o.shaftLength + o.rootSize

    this.shaft.segments[1].handleIn = new Point({
      angle: this.shaft.segments[1].point.angle + 180,
      length: 150
    })

    this.shaft.segments[1].handleOut = new Point({
      angle: this.shaft.segments[1].point.angle,
      length: 50
    })

    this.shaft.segments[2].handleOut = new Point({
      angle: this.shaft.segments[1].point.angle + 180,
      length: 150
    })

    this.shaft.segments[2].handleIn = new Point({
      angle: this.shaft.segments[1].point.angle,
      length: 50
    })

    // this.shaft.segments[3]

    // position[0] + size, position[1])
    // position[0] + size + length, position[1] + this.o.shaftAngle)
    // position[0] + size + length, position[1] + this.o.shaftAngle - thickness)
    // position[0] + size, position[1] - thickness)

  }

  Shaft.prototype.bend = function(segments) {

    var i = 0;
    var length = segments.length

    this.segments[1].point.y += 100
    this.segments[2].point.y += 100

    this.segments[1].handleIn = new Point({
      angle: 230,
      length: 150
    })

    this.segments[1].handleOut = new Point({
      angle: 50,
      length: 50
    })

    this.segments[2].handleOut = new Point({
      angle: 230,
      length: 150
    })

    this.segments[2].handleIn = new Point({
      angle: 50,
      length: 50
    })

    return this;

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

  return Shaft;

})()
