

(function() {

  view.viewSize = new Size(500, 500);

  var debug = false;

  var Helpers = (function() {

    var headCenter = [];
    var headCornerPoints = {};
    var currentShapeState = {};

    function Helpers() {
      this.test = 'test'
    }

    Helpers.prototype.setCenter = function(center) {

      headCenter = center;
      return headCenter;

    }

    Helpers.prototype.getCenter = function() {

      return headCenter;

    }

    Helpers.prototype.setHeadCornerPoints = function(points) {

      headCornerPoints = points;
      return headCornerPoints;

    }

    Helpers.prototype.getHeadCornerPoints = function() {

      return headCornerPoints;

    }

    Helpers.prototype.setShapeState = function(shape) {

      currentShapeState = shape || {};
      return currentShapeState;

    }

    Helpers.prototype.getShapeState = function() {

      return currentShapeState;

    }

    Helpers.prototype.addPoints = function(name, numbers) {

      this[name].flatten(numbers);
      this[name].smooth();

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

      headCenter = [x, y];
      headCornerPoints = cornerPoints;

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

    Helpers.prototype.alterShape = function(name, moveDistance, original) {

      console.log(currentShapeState.shape)

      var i = 0;
      var segments = this[name].segments;
      var length = segments.length;
      var selectRandomFaceForm = currentShapeState.shape || Math.floor((Math.random() * 2) + 1);
      var firstParam = currentShapeState.firstMove  + Math.floor((Math.random() * 3) + 1) || Math.floor((Math.random() * moveDistance) + 1);
      var secondParam = currentShapeState.secondMove + Math.floor((Math.random() * 3) + 1) || Math.floor((Math.random() * moveDistance) + 1);

      console.log(selectRandomFaceForm)

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

      currentShapeState = {
        shape: selectRandomFaceForm,
        firstMove: firstParam,
        secondMove: secondParam,
        segments: segments
      }

      return this;

    }

    Helpers.prototype.movePoint = function(name, moveDistance) {

      var i = 0;
      var segments = this[name].segments;
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

  var CreateFace = (function () {

    Face.prototype = new Helpers();
    Face.prototype.constructor = Face;

    function Face (o) {
      this.o = o;
      this.head = null;
      this.nose = null;
      this.rightEye = null;
      this.lefteye = null;
      this.head = null;
      this.head = null;

      this.init();
      this.events();

    }

    Face.prototype.init = function() {

      this.head = new Head();
      // console.log(this.head)
      this.nose = new Nose({
        headSegments: this.head.segments
      });

      this.leftEye = new Eye({
        positions: this.nose.positions,
        type: 'left'
      });

      this.rightEye = new Eye({
        positions: this.nose.positions,
        type: 'right'
      });

    };

    Face.prototype.events = function() {

      function onMouseMove(event) {
        console.log('calling2')
        console.log(event.point)
      }
    }

    return Face;

  })()

  var Head = (function () {

    /*

     * 1. Create a random sphere of circle
     * 2. add random amount of points
     * 3. move each point X amount to get a better look
     * 4. use same 1 and 2 settings and but move points
          and repaint

     */

    Head.prototype = new Helpers();
    Head.prototype.constructor = Head;

    function Head (o) {
      this.o = o;

      this.head = null;

      this.createShape('head', 200, 100)
          .alterShape('head', 50)
          .addPoints('head', 20)
          .movePoint('head', 5);

      this.head2 = null;
      this.createShape('head2', 200, 100)
          .alterShape('head2', 50, 'head')
          .addPoints('head2', 20)
          .movePoint('head2', 2);

      this.head3 = null;
      this.createShape('head3', 200, 100)
          .alterShape('head3', 50, 'head')
          .addPoints('head3', 20)
          .movePoint('head3', 2);

      this.setShapeState();

      return this.head;

    }

    Head.prototype.createShape = function(name, position, size) {

      var alpha = Math.random()

      this[name] = new Path.Circle({
        center: [position, position],
        radius: size
      });

      this[name].strokeColor = new Color(0, 0, 0, alpha);

      this[name].strokeWidth = 1;

      this[name].selected = debug;

      return this;

    }

    return Head;

  })()

  var Nose = (function () {

    /*

     * 1. Find center of Head
     * 2. select nose style
     * 3. add random amount of points
     * 4. move each point X amount to get a better look
     * 5. use same 1 and 2 settings and but move points
          and repaint

     */

    Nose.prototype = new Helpers();
    Nose.prototype.constructor = Nose;

    function Nose (o) {

      this.o = o;
      this.positions = this.findCenterfromSegments(this.o.headSegments)

      this.nose = null;
      this.createShape('nose', this.positions.center, 10)
          .addPoints('nose', 20)
          .movePoint('nose', 5)

      this.nose2 = null;
      this.createShape('nose2', this.positions.center, 10)
          .addPoints('nose2', 20)
          .movePoint('nose2', 2);

      this.nose3 = null;
      this.createShape('nose3', this.positions.center, 10)
          .addPoints('nose3', 20)
          .movePoint('nose3', 2);

      this.setShapeState()

      return this;

    }

    Nose.prototype.createShape = function(name, position, size) {

      var alpha = Math.random()



      this[name] = new Path.Circle({
        center: position,
        radius: size
      });

      this[name].strokeColor = new Color(0, 0, 0, alpha);
      this[name].strokeWidth = 1;

      // this.head.selected = debug;

      return this;

    }

    return Nose;

  })()

  var Eye = (function (o) {

    /*

     * 1. Find center between nose and top of head
     * 2. move 50% left (or right)
     * 3. Create a random sphere of circle
     * 4. add random amount of points
     * 5. move each point X amount to get a better look
     * 6. draw pupil

     */

    Eye.prototype = new Helpers();
    Eye.prototype.constructor = Eye;

    function Eye (o) {
      this.o = o;
      this.center = this.findCenterfromPosition(o.positions, o.type)

      this.eye = null;
      this.createShape('eye', this.center, 10)
          .alterShape('eye', 10)
          .addPoints('eye', 20)
          .movePoint('eye', 5);

      this.eye2 = null;
      this.createShape('eye2', this.center, 10)
          .alterShape('eye2', 10, 'eye')
          .addPoints('eye2', 20)
          .movePoint('eye2', 2);

      this.eye3 = null;
      this.createShape('eye3', this.center, 10)
          .alterShape('eye3', 10, 'eye')
          .addPoints('eye3', 20)
          .movePoint('eye3', 2);

      console.log(this.getShapeState())
      this.setShapeState()


      return this.eye

    }

    Eye.prototype.createShape = function(name, position, size) {

      var alpha = Math.random()

      this[name] = new Path.Circle({
        center: position,
        radius: size
      });

      this[name].strokeColor = new Color(0, 0, 0, alpha);
      this[name].strokeWidth = 1;

      this[name].selected = debug;

      return this;
    }

    return Eye;

  })()

  var Mouth = (function () {

    /*

     * 1. Find center between nose and top of head
     * 2. move 50% left (or right)
     * 3. Create a random sphere of circle
     * 4. add random amount of points
     * 5. move each point X amount to get a better look
     * 6. draw pupil

     */

    Mouth.prototype = new Helpers();
    Mouth.prototype.constructor = Mouth;

    function Mouth (o) {
      this.o = o;
    }

    return Mouth;

  })()

  var Hair = (function () {

    Hair.prototype = new Helpers();
    Hair.prototype.constructor = Hair;

    function Hair (o) {
      this.o = o;
    }

    return Hair;

  })()

  new CreateFace()


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
