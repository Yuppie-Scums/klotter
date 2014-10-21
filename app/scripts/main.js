

//include a perlin noise class from github
//http://en.wikipedia.org/wiki/Perlin_noise
// include("https://gist.github.com/banksean/304522/raw/f306edfdab80d72795565a5fcdeb4eb86368fee0/perlin-noise-classical.js")

//initialize a perlin noise instance
// var noise = new ClassicalNoise();
// var noiseSeed = Math.random() * 255;

(function() {

  view.viewSize = new Size(500, 500);
  var debug = false;

  // Helper object that contains modifaction methods

  var Helpers = (function() {

    var headCenter = [];
    var headCornerPoints = {};
    var shapes = {};

    function Helpers() {
      this.test = 'test'
    }

    Helpers.prototype.addPoints = function(numbers) {

      this.flatten(numbers);
      this.smooth();

      return this;

    }

    Helpers.prototype.findCenterfromSegments = function(segments) {

      var i = 0;
      var length;

      if (segments) {
        length = segments.length;
      } else {
        return;
      }

      var cornerPoints = {
        left: segments[0].point.x,
        top: segments[0].point.y,
        right: segments[0].point.x,
        bottom: segments[0].point.y
      };

      for (; i < length; i++) {

        cornerPoints.left = segments[i].point.x < cornerPoints.left ? segments[i].point.x : cornerPoints.left;
        cornerPoints.top = segments[i].point.y < cornerPoints.top ? segments[i].point.y : cornerPoints.top;
        cornerPoints.right = segments[i].point.x > cornerPoints.right ? segments[i].point.x : cornerPoints.right;
        cornerPoints.bottom = segments[i].point.y > cornerPoints.bottom ? segments[i].point.y : cornerPoints.bottom;

      }

      var x = cornerPoints.left + ((cornerPoints.right - cornerPoints.left) / 2)
      var y = cornerPoints.top + ((cornerPoints.bottom - cornerPoints.top) / 2)

      return {
        positions: cornerPoints,
        center: [x, y]
      }

    }

    Helpers.prototype.findCenterfromPosition = function(position, type) {
      var yPosition = (((position.center[1] - position.positions.top) / 2) + position.positions.top)
      var xPosition;

      if (type === 'left') {
        xPosition = (((position.center[0] - position.positions.left) / 2) + position.positions.left)
      } else {
        xPosition = (position.positions.right - ((position.center[0] - position.positions.left) / 2));
      }

      return [xPosition, yPosition]
    }

    Helpers.prototype.alterShape = function(moveDistance, type) {

      var i = 0;
      var segments = this.segments;
      var length = segments.length;
      var selectRandomFaceForm = this.shape ? this.shape : Math.floor((Math.random() * 2) + 1);
      var firstParam = this.firstMove ? this.firstMove  + Math.floor((Math.random() * 3) + 1) : Math.floor((Math.random() * moveDistance) + 1);
      var secondParam = this.secondMove ? this.secondMove+ Math.floor((Math.random() * 3) + 1) : Math.floor((Math.random() * moveDistance) + 1);

      switch(selectRandomFaceForm) {
        case 1: // wide face aka stewie
          segments[0].point.x = segments[0].point.x - firstParam;
          segments[2].point.x = segments[2].point.x + firstParam;
          segments[3].point.y = segments[3].point.y + secondParam;
          break;
        case 2:
          segments[0].point.x = segments[0].point.x + firstParam;
          segments[2].point.x = segments[2].point.x - firstParam;
          segments[3].point.y = segments[3].point.y + secondParam + secondParam;
        default:
          break;
      }

      // create a new shape from the circle
      // clockwise, starts from left
      this.shape = selectRandomFaceForm;
      this.firstMove = firstParam;
      this.secondMove = secondParam;

      return this;

    }

    Helpers.prototype.movePoint = function(moveDistance) {

      var i = 0;
      var segments = this.segments;
      var length = segments.length;

      for (; i < length; i++) {

        var points = segments[i].point
        points.x = points.x + Math.floor((Math.random() * moveDistance) + 1);
        points.y = points.y + Math.floor((Math.random() * moveDistance) + 1);

      }

      return this;

    }

    return Helpers;

  })();

  var CreatePenis = (function () {

    Penis.prototype = new Helpers();
    Penis.prototype.constructor = Penis;

    function Penis (o) {

      this.o = {};

      this.o.startPosition = [150, 150]; // apply random startposition later
      this.o.viewAngle = Math.floor(Math.random() * 180 ) + 1;


      // each ball(sack) will be created from two circles, one represent the base and one represent the acctual ball.
      // We draw the first circle at the starting position and calvulate the second ball depending on weight, the more wieight,
      // the further down the second circle will be.
      // the we apply the size of the the ball to the second cirlce.
      // finally we attach the the two circles
      this.o.ballsWeight = Math.floor(Math.random() * 100 ) + 1;
      this.o.ballsSize = this.o.ballStyle === 'firm' && Math.round(Math.random()) ? Math.floor(Math.random() * 20 ) + 10 : Math.floor(Math.random() * 10 ) + 1;


      this.o.shaftStyle = Math.round(Math.random()) ? 'european' : 'american';
      this.o.shaftAngle = (Math.floor(Math.random() * 130 ) + 1) + 25;

      this.o = _.extend(this.o, o)


      this.group = new Group();

      this.leftBall = null;
      this.rightBal = null;
      this.shaft = null;
      this.tip = null;

      this.init();
      this.events();

    }

    Penis.prototype.init = function() {


      BallSack

      this.ballSack = new BallSack({
        position: this.o.startPosition,
        style: this.style,
        type: 'left',
        size: 50
      });

      // this.leftBall = new Ball({
      //   position: this.o.startPosition,
      //   style: this.style,
      //   type: 'left',
      //   size: 50
      // });
      //
      // this.rightBall = new Ball({
      //   position: this.setAnglePosition(this.o.startPosition, this.o.viewAngle, this.o.shaftAngle),
      //   style: this.style,
      //   type: 'right',
      //   size: 50
      // });

      this.shaft = new Shaft({
        position: [],
        style: this.style,
        type: 'normal',
        size: 50
      })

    };

    Penis.prototype.events = function() {

    }

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

    return Penis;

  })()

  var BallSack = (function (o) {

    var handle_len_rate = 2.4;
    var radius = 50;

    function getVector(radians, length) {
    	return new Point({
    		// Convert radians to degrees:
    		angle: radians * 180 / Math.PI,
    		length: length
    	});
    }

    BallSack.prototype = new Helpers();
    BallSack.prototype.constructor = BallSack;

    function BallSack (o) {
      this.o = o;

      // we need to add root position and left and right position

      this.connections = new Group();
      this.circlePaths = [];

      this.topPosition = this.createShape(this.o.position, this.o.size)
      this.circlePaths.push(this.topPosition);

      this.leftBall = this.createShape(this.o.position, this.o.size)
      this.circlePaths.push(this.leftBall);

      this.rightBall = this.createShape(this.o.position, this.o.size)
      this.circlePaths.push(this.rightBall);

      this.generateConnections(this.circlePaths);
      // this.ball = this.alterShape.call(this.ball, 10)
      // this.ball = this.addPoints.call(this.ball, 15)
      // this.ball = this.movePoint.call(this.ball, 3);

      return this.ballSack

    }

    BallSack.prototype.createShape = function(position, size) {

      var alpha = Math.random()
      var ball;

      ball = new Path.Circle({
        center: position,
        radius: size
      });

      ball.strokeColor = new Color(0, 0, 0);
      ball.strokeWidth = 1;
      ball.fillColor = new Color(250, 250, 250);

      ball.selected = debug;

      return ball;
    }

    BallSack.prototype.generateConnections = function(paths) {
      // Remove the last connection paths:
    	this.connections.children = [];

    	for (var i = 0, l = paths.length; i < l; i++) {
    		for (var j = i - 1; j >= 0; j--) {
    			var path = this.connect(paths[i], paths[j], 0.5, handle_len_rate, 300);
    			if (path) {
    				this.connections.appendTop(path);
    			}
    		}
    	}
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

    	var path = new Path({
    		segments: [p1a, p2a, p2b, p1b],
    		style: ball1.style,
    		closed: true
    	});
    	var segments = path.segments;
    	segments[0].handleOut = getVector(angle1a - pi2, radius1);
    	segments[1].handleIn = getVector(angle2a + pi2, radius2);
    	segments[2].handleOut = getVector(angle2b - pi2, radius2);
    	segments[3].handleIn = getVector(angle1b + pi2, radius1);
    	return path;
    }

    return BallSack;

  })()


  var Shaft = (function (o) {

    Shaft.prototype = new Helpers();
    Shaft.prototype.constructor = Shaft;

    function Shaft (o) {
      this.o = o;

      this.shaft = this.createShape(this.o.position, this.o.size)

      // this.ball = this.alterShape.call(this.ball, 10)
      // this.ball = this.addPoints.call(this.ball, 15)
      // this.ball = this.movePoint.call(this.ball, 3);

      this.shaft.type = o.type;

      return this.shaft

    }

    Shaft.prototype.createShape = function(position, size) {

      var alpha = Math.random()
      var shaft;

      shaft = new Path.Circle({
        center: position,
        radius: size
      });

      shaft.strokeColor = new Color(0, 0, 0, alpha + 0.1);
      shaft.strokeWidth = 1;
      shaft.fillColor = new Color(250, 250, 250);

      shaft.selected = debug;

      return shaft;
    }

    return Shaft;

  })()

  new CreatePenis({})


})()

var text = new PointText(new Point(30, 30));
text.fillColor = 'black';

text.content = 'Move your mouse over the view, to see its position';

function onMouseMove(event) {
  console.log('calling')
      // Each time the mouse is moved, set the content of
      // the point text to describe the position of the mouse:
      text.content = 'Your position is: ' + event.point.toString();
  }
