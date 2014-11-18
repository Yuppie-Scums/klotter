
window.Hair = (function (o) {

  Hair.prototype = new Helpers();
  Hair.prototype.constructor = Hair;

  // BallHair.prototype.createBounds = function(left, right, size) {
  //
  //   var left = this.o.left - this.o.size;
  //   var right = (this.o.right + (this.o.size * 2)) - this.o.left;
  //   var top = this.o.top - this.o.size;
  //   var bottom = this.o.size * 2
  //
  //   console.log(this.o.left)
  //   console.log(this.o.right)
  //   console.log(this.o.size)
  //
  //   var point = new Point(left, top);
  //   var size = new Size(right, bottom);
  //   var path = new Path.Rectangle(point, size);
  //   path.fillColor = 'green';
  //
  //   return path
  // }

  function Hair (o) {

    this.o = o;

    this.hairArea = this.createBounds(this.o.left, this.o.right, this.o.top, this.o.size);
    this.hairCircles = this.createCircles(this.o.left, this.o.right, this.o.top, this.o.size);
    this.hairGroup = new Group();

    for (var i = 0; i < this.o.amount; i++) {

      var position = this.getRandomPlacement(this.hairArea);
      var hairPeice = this.straw(position, this.hairCircles);
      this.hairGroup.addChild(hairPeice)
    }

    this.hairGroup.strokeColor = new Color(0, 0, 0, 0.6);

    return this;

  }

  Hair.prototype.createBounds = function(left, right, top, size) {

    var leftPoint = left - size;
    var rightPoint = (right + (size * 2)) - left;
    var topPoint = top - size;
    var bottomPoint = size * 2

    var point = new Point(leftPoint, topPoint);
    var size = new Size(rightPoint, bottomPoint);
    var path = new Path.Rectangle(point, size);
    path.fillColor = null;

    return path

  }

  Hair.prototype.createCircles = function(left, right, top, size) {

    var group = new Group;

    var ballRight = new Path.Circle({
      center: [left, top],
      radius: size
    });

    var ballLeft = new Path.Circle({
      center: [right, top],
      radius: size
    });


    group.addChildren([ballLeft, ballRight])
    group.fillColor = null;

    return group

  }

  Hair.prototype.spiral = function() {

    for (i=0; i< 720; i++) {
      angle = 0.1 * i;
      x=(1+angle)*Math.cos(angle);
      y=(1+angle)*Math.sin(angle);
      context.lineTo(x, y);
    }

  }

  Hair.prototype.changeSize = function(o) {

    this.o = o;

    this.hairArea.remove()
    this.hairCircles.remove()
    this.hairGroup.remove()

    this.hairArea = this.createBounds(this.o.left, this.o.right, this.o.top, this.o.size);
    this.hairCircles = this.createCircles(this.o.left, this.o.right, this.o.top, this.o.size);
    this.hairGroup = new Group();

    for (var i = 0; i < this.o.amount; i++) {

      var position = this.getRandomPlacement(this.hairArea);
      var hairPeice = this.straw(position, this.hairCircles);
      this.hairGroup.addChild(hairPeice)
    }

    this.hairGroup.strokeColor = new Color(0, 0, 0, 0.6);

  }

  Hair.prototype.straw = function(position, circles) {

    var startPoint = new Point(position.x, position.y)
    var random = this.random(0, 360)
    var randomLength = this.random(10, 30)
    var randomAngle = this.random(0, 40)

    var path = new Path();

    if (circles.contains(startPoint)) {

      path.add(startPoint);
      path.add(new Point(position.x, position.y + randomLength)); // sice needs to reflect size or something

      path.segments[1].handleIn = new Point({
        angle: randomAngle,
        length: randomLength
      })

      path.closed = false;
      path.fillColor = null;
      path.rotate(random)

    }

    return path;

  }

  Hair.prototype.getRandomPlacement = function(box) {

    var bounds = box.bounds;

    var minX = bounds.x;
    var minY = bounds.y;
    var maxX = bounds.x + bounds.width;
    var maxY = bounds.y + bounds.height;

    var x = this.random(minX, maxX)
    var y = this.random(minY, maxY)

    return {
      x: x,
      y: y
    }

  }

  Hair.prototype.removeAll = function() {
    this.hairArea.remove()
    this.hairCircles.remove()
    this.hairGroup.remove()
  }


  return Hair;

})()
