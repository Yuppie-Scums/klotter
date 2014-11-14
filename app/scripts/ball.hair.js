
window.BallHair = (function (o) {

  BallHair.prototype = new Helpers();
  BallHair.prototype.constructor = BallHair;

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

  function BallHair (o) {

    this.o = o;

    this.hairArea = this.createBounds(this.o.left, this.o.right, this.o.top, this.o.size);
    this.hairCircles = this.createCircles(this.o.left, this.o.right, this.o.top, this.o.size);
    this.ballHairGroup = new Group();

    for (var i = 0; i < 50; i++) {

      var position = this.getRandomPlacement(this.hairArea);
      var hairPeice = this.straw(position, this.hairCircles);
      this.ballHairGroup.addChild(hairPeice)
    }

    this.ballHairGroup.strokeColor = new Color(0, 0, 0, 0.6);

    return this;

  }

  BallHair.prototype.createBounds = function(left, right, top, size) {

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

  BallHair.prototype.createCircles = function(left, right, top, size) {

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

  BallHair.prototype.spiral = function() {

  }

  BallHair.prototype.straw = function(position, circles) {

    var startPoint = new Point(position.x, position.y)
    var random = this.random(0, 360)

    var path = new Path();

    if (circles.contains(startPoint)) {

      path.add(startPoint);
      path.add(new Point(position.x, position.y + 20)); // sice needs to reflect size or something
      path.rotate(random)

    }

    return path;

  }

  BallHair.prototype.getRandomPlacement = function(box) {

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

  BallHair.prototype.random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }



  return BallHair;

})()
