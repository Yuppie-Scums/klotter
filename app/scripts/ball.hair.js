
window.BallHair = (function (o) {

  BallHair.prototype = new Helpers();
  BallHair.prototype.constructor = BallHair;

  function BallHair (o) {

    this.o = o;

    this.hairArea = this.createShape();

    return this;

  }

  BallHair.prototype.createShape = function() {

    var left = this.o.left - this.o.size;
    var right = (this.o.right + (this.o.size * 2)) - this.o.left;
    var top = this.o.top - this.o.size;
    var bottom = this.o.size * 2

    console.log(this.o.left)
    console.log(this.o.right)
    console.log(this.o.size)

    var point = new Point(left, top);
    var size = new Size(right, bottom);
    var path = new Path.Rectangle(point, size);
    path.fillColor = 'green';

    return path
  }

  return BallHair;

})()
