

//include a perlin noise class from github
//http://en.wikipedia.org/wiki/Perlin_noise
// include("https://gist.github.com/banksean/304522/raw/f306edfdab80d72795565a5fcdeb4eb86368fee0/perlin-noise-classical.js")

//initialize a perlin noise instance
// var noise = new ClassicalNoise();
// var noiseSeed = Math.random() * 255;

(function() {

  view.viewSize = new Size(500, 500);
  var debug = false;

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
      var selectRandomFaceForm = shapes[type] ? shapes[type].shape : Math.floor((Math.random() * 2) + 1);
      var firstParam = shapes[type] ? shapes[type].firstMove  + Math.floor((Math.random() * 3) + 1) : Math.floor((Math.random() * moveDistance) + 1);
      var secondParam = shapes[type] ? shapes[type].secondMove + Math.floor((Math.random() * 3) + 1) : Math.floor((Math.random() * moveDistance) + 1);

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

      this.o = o;

      this.startPosition = [150, 150]; // apply random startposition later
      this.style = 'left';

      this.group = new Group();

      this.leftBall = null;
      this.rightBal = null;
      this.shaft = null;
      this.tip = null;

      this.init();
      this.events();

    }

    Penis.prototype.init = function() {

      this.leftBall = new Ball({
        position: this.startPosition,
        style: this.style,
        type: 'left',
        size: 50
      });

      this.rightBall = new Ball({
        position: [160, 155],
        style: this.style,
        type: 'right',
        size: 50
      });

      this.shaft = new Shaft({
        position: [],
        style: this.style,
        type: 'normal',
        size: 50
      })

    };

    Penis.prototype.events = function() {

    }

    return Penis;

  })()

  var Ball = (function (o) {

    Ball.prototype = new Helpers();
    Ball.prototype.constructor = Ball;

    function Ball (o) {
      this.o = o;

      this.ball = this.createShape(this.o.position, this.o.size)

      // this.ball = this.alterShape.call(this.ball, 10)
      // this.ball = this.addPoints.call(this.ball, 15)
      // this.ball = this.movePoint.call(this.ball, 3);

      return this.ball

    }

    Ball.prototype.createShape = function(position, size) {

      var alpha = Math.random()
      var ball;

      ball = new Path.Circle({
        center: position,
        radius: size
      });

      ball.strokeColor = new Color(0, 0, 0, alpha + 0.1);
      ball.strokeWidth = 1;
      ball.fillColor = new Color(250, 250, 250);

      ball.selected = debug;

      return ball;
    }

    return Ball;

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

  new CreatePenis()


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
