(function() {

  view.viewSize = new Size(500, 500);

  var debug = false;






  var CreateFace = (function () {

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

    Face.prototype = {
      init: function() {

        this.head = new Head();
        // console.log(this.head)
        this.nose = new Nose({
          headSegments: this.head.segments
        });

        this.leftEye = new Eye({
          headSegments: this.nose.positions
        });

        this.rightEye = new Eye({
          headSegments: this.nose.positions
        });

      },

      events: function() {
        function onMouseMove(event) {
          console.log(event.point)
        }
      }
    }

    return Face;

  })()

  var Helpers = (function() {
    function Helpers() {
    }

    Helpers.prototype = {

      draw: function() {

      },

      findCenterfromSegments: function(segments) {

        var cornerPoints = {
          left: segments[0].point.x,
          top: segments[segments.length / 4 * 1].point.y,
          right: egments[segments.length / 4 * 2].point.x,
          bottom: segments[segments.length / 4 * 3].point.y,
        };

        return {x: cornerPoints.right - cornerPoints.left, y: cornerPoints.bottom - cornerPoints.top}

      },

      getCenter: function() {



      },

      setWidth: function() {

      },

      setHeight: function() {

      }

    }

  })

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

      return this.head;

    }

    Head.prototype = {
      createShape: function(head, position, size) {

        this[head] = new Path.Circle({
          center: [position, position],
          radius: size
        });

        this[head].strokeColor = 'black';
        this[head].strokeWidth = 1;

        this[head].selected = debug;

        return this;

      },

      alterShape: function(head, moveDistance, original) {

        var i = 0;
        var segments = this[head].segments;
        var length = segments.length;
        var selectRandomFaceForm = this[original] ? this[original].shape : Math.floor((Math.random() * 2));
        var firstParam = this[original] ? this[original].firstMove  + Math.floor((Math.random() * 3) + 1) : Math.floor((Math.random() * moveDistance) + 1);
        var secondParam = this[original] ? this[original].secondMove + Math.floor((Math.random() * 3) + 1) : Math.floor((Math.random() * moveDistance) + 1);

        switch(selectRandomFaceForm) {
          case 0: // wide face aka stewie
            segments[0].point.x = segments[0].point.x - firstParam;
            segments[2].point.x = segments[2].point.x + firstParam;
            segments[3].point.y = segments[3].point.y + secondParam;
            break;
          case 1:
            segments[0].point.x = segments[0].point.x + firstParam;
            segments[2].point.x = segments[2].point.x - firstParam;
            segments[3].point.y = segments[3].point.y + secondParam + secondParam;
          default:
            break;
        }

        // create a new shape from the circle
        // clockwise, starts from left

        this[head].shape = selectRandomFaceForm;
        this[head].firstMove = firstParam;
        this[head].secondMove = secondParam;

        return this;

      },

      addPoints: function(head, numbers) {

        this[head].flatten(numbers);
        this[head].smooth();

        return this;

      },

      movePoint: function(head, moveDistance) {

        var i = 0;
        var segments = this[head].segments;
        var length = segments.length;

        for (; i < length; i++) {

          var points = segments[i].point
          points.x = points.x + Math.floor((Math.random() * moveDistance) + 1);
          points.y = points.y + Math.floor((Math.random() * moveDistance) + 1);

        }

        return this;

      }
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
      this.nose = {};

      this.createShape('nose', this.positions.center, 10)
          .addPoints('nose', 20)
          .movePoint('nose', 5)

      return this;

    }

    Nose.prototype = {
      findCenterfromSegments: function(segments) {

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

      },

      createShape: function(noseName, position, size) {

        this[noseName] = new Path.Circle({
          center: position,
          radius: size
        });

        this[noseName].strokeColor = 'black';
        this[noseName].strokeWidth = 1;

        // this.head.selected = debug;

        return this;

      },

      addPoints: function(head, numbers) {

        this[head].flatten(numbers);
        this[head].smooth();

        return this;

      },

      movePoint: function(head, moveDistance) {

        var i = 0;
        var segments = this[head].segments;
        var length = segments.length;

        for (; i < length; i++) {

          var points = segments[i].point
          points.x = points.x + Math.floor((Math.random() * moveDistance) + 1);
          points.y = points.y + Math.floor((Math.random() * moveDistance) + 1);

        }

        return this;

      }

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
      console.log(this)
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
      // Each time the mouse is moved, set the content of
      // the point text to describe the position of the mouse:
      text.content = 'Your position is: ' + event.point.toString();
  }