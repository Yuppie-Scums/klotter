var debug = true;

window.BallSack = (function (o) {

  var handle_len_rate = 2.4;
  var radius = 50;

  function getVector(radians, length) {
      return new Point({
          // Convert radians to degrees:
          angle: radians * 180 / Math.PI,
          length: length
      });
  }

  function returnPoint() {



  }

  BallSack.prototype = new Helpers();
  BallSack.prototype.constructor = BallSack;

  function BallSack (o) {
    this.o = o;

    // we need to add root position and left and right position
    this.triangle;

    this.connections = new Group();
    this.circlePaths = [];

    this.topPosition = this.createShape(this.o.startPosition, this.o.rootSize, 'root', 1, 1)
    this.circlePaths.push(this.topPosition);

    this.leftBall = this.createShape(this.o.leftPosition, this.o.size, 'left')
    this.circlePaths.push(this.leftBall);

    this.rightBall = this.createShape(this.o.rightPosition, this.o.size, 'right')
    this.circlePaths.push(this.rightBall);

    this.generateConnections(this.circlePaths);
    // this.removeTopSegment.call(this.topPosition, this.topPosition.segments)

    // this.ball = this.alterShape.call(this.ball, 10)
    // this.ball = this.addPoints.call(this.ball, 15)
    // this.ball = this.movePoint.call(this.ball, 3);



    return this.ballSack

  }

   BallSack.prototype.removeAll = function() {
      this.triangle.remove();
      this.connections.remove()
      this.topPosition.remove()
      this.leftBall.remove();
      this.rightBall.remove();
      this.connections.removeChildren()

      console.log()

      console.log(this.centers)

   }

  BallSack.prototype.createShape = function(position, size, name, xScale, yScale) {

    var alpha = Math.random()
    var ball;

    ball = new Path.Circle({
      center: position,
      radius: size
    });

    ball.strokeColor = new Color(0, 0, 0);
    ball.strokeWidth = 1;
    ball.name = name

    ball.scale(xScale || 1, yScale || 1)
    ball.data.isAlter = xScale ? true : false;
    // ball.fillColor = new Color(250, 250, 250);

    ball.selected = debug;

    return ball;
  }

  BallSack.prototype.walk = function(event) {


    var sinus = Math.sin(event.time * 3 + 0);


      // Change the y position of the segment point:
      this.leftBall.position.x = sinus * 60 + this.o.leftPosition[0];
      this.rightBall.position.x = sinus * 60 + this.o.rightPosition[0];


    if(this.united) this.united.remove();

    // this.united = this.triangle
    //              .unite(this.connections.children[0])
    //              .unite(this.connections.children[1])
    //              .unite(this.connections.children[2])
    //              .unite(this.circlePaths[0])
    //              .unite(this.circlePaths[1])
    //              .unite(this.circlePaths[2])



  }

  BallSack.prototype.generateConnections = function(paths) {
    // Remove the last connection paths:
    this.connections.children = [];
    this.centers = []

    // this.testConnect(paths[1], paths[2], paths[0], 0.5, handle_len_rate, 600)

      for (var i = 0, l = paths.length; i < l; i++) {

      this.centers.push(paths[i].position)

        for (var j = i - 1; j >= 0; j--) {
            var path = this.connect(paths[i], paths[j], 0.9, handle_len_rate, 600);
            if (path) {
                this.connections.appendTop(path);

            }
        }
      }

    if(this.triangle) this.triangle.remove()
    this.triangle = new Path({
      segments: this.centers,
      closed: true
    });

    this.triangle.selected = debug

    // this.united = this.triangle
    //              .unite(this.connections.children[0])
    //              .unite(this.connections.children[1])
    //              .unite(this.connections.children[2])
    //              .unite(this.circlePaths[0])
    //              .unite(this.circlePaths[1])
    //              .unite(this.circlePaths[2])
    //
    // this.united.position.x = this.united.position.x + 400;
    // this.united.fillColor = null;
    // this.united.strokeColor = new Color(0, 0, 0, 0.4);
    // this.united.strokeWidth = 1;



    // this.united = this.alterShape.call(this.united, 10)
    // this.united = this.addPoints.call(this.united, 15);
    // this.united = this.movePoint.call(this.united, 3);

    // this.unitedFirst = this.united.clone();
    // this.unitedSecond = this.united.clone();
    //
    // this.unitedFirst = this.addPoints.call(this.united, 15);
    // this.unitedFirst = this.movePoint.call(this.united, 3);
    //
    // this.unitedSecond = this.addPoints.call(this.united, 15);
    // this.unitedSecond = this.movePoint.call(this.united, 3);


  }

  BallSack.prototype.connect = function(ball1, ball2, v, handle_len_rate, maxDistance) {
      var center1 = ball1.position;
      var center2 = ball2.position;
      var radius1 = ball1.bounds.width / 2;
      var radius2 = ball2.bounds.width / 2;
      var pi2 = Math.PI / 2;
      var d = center1.getDistance(center2);
      var u1, u2;


      if (radius1 == 0 || radius2 == 0)
          return;

      if (d > maxDistance || d <= Math.abs(radius1 - radius2)) {
          return;
      } else if (d < radius1 + radius2) { // case circles are overlapping
          u1 = Math.acos((radius1 * radius1 + d * d - radius2 * radius2) /
                  (2 * radius1 * d));
          u2 = Math.acos((radius2 * radius2 + d * d - radius1 * radius1) /
                  (2 * radius2 * d));
      } else {
          u1 = 0;
          u2 = 0;
      }

      var angle1 = (center2 - center1).getAngleInRadians();
      var angle2 = Math.acos((radius1 - radius2) / d);
      var angle1a = angle1 + u1 + (angle2 - u1) * v;
      var angle1b = angle1 - u1 - (angle2 - u1) * v;
      var angle2a = angle1 + Math.PI - u2 - (Math.PI - u2 - angle2) * v;
      var angle2b = angle1 - Math.PI + u2 + (Math.PI - u2 - angle2) * v;
      var p1a = center1 + getVector(angle1a, radius1);
      var p1b = center1 + getVector(angle1b, radius1);
      var p2a = center2 + getVector(angle2a, radius2);
      var p2b = center2 + getVector(angle2b, radius2);

      // define handle length by the distance between
      // both ends of the curve to draw
      var totalRadius = (radius1 + radius2);
      var d2 = Math.min(v * handle_len_rate, (p1a - p2a).length / totalRadius);

      // case circles are overlapping:
      d2 *= Math.min(1, d * 2 / (radius1 + radius2));

      radius1 *= d2;
      radius2 *= d2;

    if (ball2.data.isAlter) {
        console.log(getVector(angle2b, radius2))
        console.log(angle2b)
        console.log(radius2)
        console.log(p2b)
        console.log(center2)
        console.log(radius2)
        console.log('>>>>>')
    }


    // draw a patch between point one and point two
      var path = new Path({
          segments: [p1a, p2a, p2b, p1b],
          style: ball1.style,
          closed: true
      });

    path.fullyselected = debug

    // lets create the arc-form for each path;
      var segments = path.segments;
      segments[0].handleOut = getVector(angle1a - pi2, radius1);
      segments[1].handleIn = getVector(angle2a + pi2, radius2);
      segments[2].handleOut = getVector(angle2b - pi2, radius2);
      segments[3].handleIn = getVector(angle1b + pi2, radius1);

      return path;
  }

  return BallSack;

})()
