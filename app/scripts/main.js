

  var noise = new window.ClassicalNoise();
  var noiseSeed = Math.random() * 255;

  view.viewSize = new Size(2000, 2000);
  var debug = true;
  project.currentStyle = {
    fillColor: 'black'
  };

  var CreatePenis = (function () {

    Penis.prototype = new Helpers();
    Penis.prototype.constructor = Penis;

    function Penis (o) {

      this.p = 0;

      this.o = o || {};

      this.startPosition = [200, 300]; // apply random startposition later
      this.viewAngle = Math.floor(Math.random() * 180 ) + 1;


      // each ball(sack) will be created from two circles, one represent the base and one represent the acctual ball.
      // We draw the first circle at the starting position and calvulate the second ball depending on weight, the more wieight,
      // the further down the second circle will be.
      // the we apply the size of the the ball to the second cirlce.
      // finally we attach the the two circles
      this.ballsWeight = Math.floor(Math.random() * 100 ) + 500;
      this.ballsSize = Math.floor(Math.random() * 60 ) + 40;
      this.leftBallPosition = 150
      this.rightBallPosition = 250
      this.sackDencity = 0;


      this.shaftStyle = Math.round(Math.random()) ? 'european' : 'american';
      this.shaftAngle = (Math.floor(Math.random() * 130 ) + 1) + 25;
      this.shaftCurve = (Math.floor(Math.random() * 130 ) + 1) + 25;
      this.shaftThickness = 110;
      this.shaftLength = 500;
      this.TiptLength = 100;

      this.rootSize = Math.floor(Math.random() * 60 ) + 40

      this.group = new Group();
      this.ballSack = null;
      this.shaft = null;

      this.init();
      this.events();

    }

    Penis.prototype.init = function() {


      this.ballSack = new BallSack({
        startPosition: this.startPosition,
        leftPosition: [this.leftBallPosition, this.ballsWeight],
        rightPosition: [this.rightBallPosition, this.ballsWeight],
        size: this.ballsSize,
        rootSize: this.rootSize
      });

      this.shaft = new Shaft({
        startPosition: this.startPosition,
        shaftAngle: this.shaftAngle,
        shaftCurve: this.shaftCurve,
        shaftLength: this.shaftLength,
        shaftThickness: this.shaftThickness,
        rootSize: this.rootSize,
        tipLength: this.tipLength
      })

    };

    Penis.prototype.events = function() {

    }

    Penis.prototype.draw = function() {

      this.united = this.ballSack.triangle
                   .unite(this.ballSack.connections.children[0])
                   .unite(this.ballSack.connections.children[1])
                   .unite(this.ballSack.connections.children[2])
                   .unite(this.ballSack.circlePaths[0])
                   .unite(this.ballSack.circlePaths[1])
                   .unite(this.ballSack.circlePaths[2])
                   .unite(this.shaft.shaft)


      this.united.closed = false;
      this.united.position.x = this.united.position.x + 1000;
      this.united.fillColor = null;
      this.united.strokeColor = new Color(0, 0, 0, 0.4);
      this.united.strokeWidth = 1;
      this.united.fullySelected = false;

      var times = this.getTopSegmentIndex(this.united.segments, this.shaftAngle)

      this.pushShiftSegments(this.united.segments, times, 2)

      this.united.removeSegment(0)

      this.applyNoiseToPath(this.united, 6, 40.0, 6.0);

      var shakyOutlinesGroup1 = this.copyAndApplyNoise('united', 0.35, 6, 10.0, 4.0)
      var shakyOutlinesGroup2 = this.copyAndApplyNoise('united', 0.55, 5, 16.0, 4.0)

    }

    Penis.prototype.pushShiftSegments = function(array, length, times, back) {

      var i = 0;
      var directtion = back

      for (; i < length - 1; i++) {
        array.push(array.shift());
      }

      this.united.removeSegment(this.united.segments.length - 1)
      this.united.removeSegment(this.united.segments.length)

    }

    Penis.prototype.copyAndApplyNoise = function(source, strokWidth, sampleDist, noiseDiv, noiseScale) {
      var path = this[source].clone();
      path.strokeWidth = strokWidth;
      path.fillColor = undefined; //remove fill

      //apply some more noise to the cloned group
      this.applyNoiseToPath(path, sampleDist, noiseDiv, noiseScale);

      return path;
    }

    Penis.prototype.applyNoiseToPath = function(path, sampleDist, noiseDiv, noiseScale) {

    var self = this;

    if(path instanceof Group) {

      for(var i = 0; i < path.children.length; i++) {
        self.applyNoiseToPath(path.children[i], sampleDist, noiseDiv, noiseScale);
      }

    } else {

        if(sampleDist < path.length) {
          path.flatten(sampleDist);
        }

        for(var i = 0; i < path.segments.length; i++) {
            var noiseX = noise.noise(path.segments[i].point.x / noiseDiv,
                path.segments[i].point.y / noiseDiv,
                noiseSeed);
            var noiseY = noise.noise(path.segments[i].point.y / noiseDiv,
                noiseSeed,
                path.segments[i].point.x / noiseDiv);

            path.segments[i].point = path.segments[i].point + new Point(noiseX, noiseY) * noiseScale;
        }
        path.smooth();
      }

    }

    Penis.prototype.update = function(event) {

      var self = this;
      this.shaft.changeSize({
        startPosition: this.startPosition,
        shaftAngle: this.shaftAngle,
        shaftCurve: this.shaftCurve,
        shaftLength: this.shaftLength,
        shaftThickness: this.shaftThickness,
        rootSize: this.rootSize,
      })

      this.ballSack.changeSize({
        startPosition: this.startPosition,
        leftPosition: [this.leftBallPosition, this.ballsWeight],
        rightPosition: [this.rightBallPosition, this.ballsWeight],
        size: this.ballsSize,
        rootSize: this.rootSize
      })

    }

    return Penis;

  })()

  var penis = new CreatePenis()

  var text = new PointText(new Point(30, 30));
  text.fillColor = 'black';
  text.content = 'Move your mouse over the view, to see its position';

  function onMouseMove(event) {

        // Each time the mouse is moved, set the content of
        // the point text to describe the position of the mouse:
        text.content = 'Your position is: ' + event.point.toString();
  }

  var gui = new dat.GUI();
  var GlobalFolder = gui.addFolder('Global');
  GlobalFolder.add(penis, 'draw')
  GlobalFolder.add(penis, 'update');

  GlobalFolder.open()

  var shaftFolder = gui.addFolder('Shaft');
  shaftFolder.add(penis, 'shaftThickness', 90, 150)
  shaftFolder.add(penis, 'shaftLength', 0, 1000)
  shaftFolder.add(penis, 'shaftAngle', -100, 200)
  shaftFolder.add(penis, 'shaftCurve')

  shaftFolder.open()

  var ballSackFolder = gui.addFolder('balls');

  ballSackFolder.add(penis, 'leftBallPosition', 100, 300)
  ballSackFolder.add(penis, 'rightBallPosition', 100, 300)
  ballSackFolder.add(penis, 'ballsWeight', 500, 600)
  ballSackFolder.add(penis, 'ballsSize', 40, 100)

  ballSackFolder.open()
