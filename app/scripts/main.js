

//include a perlin noise class from github
//http://en.wikipedia.org/wiki/Perlin_noise
// include("https://gist.github.com/banksean/304522/raw/f306edfdab80d72795565a5fcdeb4eb86368fee0/perlin-noise-classical.js")

//initialize a perlin noise instance
// var noise = new ClassicalNoise();
// var noiseSeed = Math.random() * 255;

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

      this.startPosition = [200, 150]; // apply random startposition later
      this.viewAngle = Math.floor(Math.random() * 180 ) + 1;


      // each ball(sack) will be created from two circles, one represent the base and one represent the acctual ball.
      // We draw the first circle at the starting position and calvulate the second ball depending on weight, the more wieight,
      // the further down the second circle will be.
      // the we apply the size of the the ball to the second cirlce.
      // finally we attach the the two circles
      this.ballsWeight = Math.floor(Math.random() * 100 ) + 1;
      this.ballsSize = this.o.ballStyle === 'firm' && Math.round(Math.random()) ? Math.floor(Math.random() * 20 ) + 10 : Math.floor(Math.random() * 10 ) + 1;


      this.shaftStyle = Math.round(Math.random()) ? 'european' : 'american';
      this.shaftAngle = (Math.floor(Math.random() * 130 ) + 1) + 25;
      this.shaftThickness = 110;
      this.shaftLength = 500;
      this.TiptLength = 100;

      this.rootSize = Math.floor(Math.random() * 60 ) + 40

      this.group = new Group();

      this.leftBall = null;
      this.rightBal = null;
      this.shaft = null;
      this.tip = null;

      this.init();
      this.events();

    }

    Penis.prototype.init = function() {


      this.ballSack = new BallSack({
        position: [150, 150],
        startPosition: this.startPosition,
        leftPosition: [150, 400],
        rightPosition: [250, 400],
        style: this.style,
        type: 'left',
        size: Math.floor(Math.random() * 60 ) + 40,
        rootSize: this.rootSize
      });

      this.shaft = new Shaft({
        startPosition: this.startPosition,
        style: this.style,
        type: 'normal',
        shaftAngle: this.shaftAngle,
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

      var index = this.getTopSegmentIndex(this.united.segments)
      var i = 0;

      for (; i < index - 1; i++) {
        this.pushShift(this.united.segments)
      }

      this.united.removeSegment(0)
      this.united.removeSegment(this.united.segments.length - 1)


      this.applyNoiseToPath(this.united, 6, 40.0, 6.0);

      var shakyOutlinesGroup = this.united.clone();
      shakyOutlinesGroup.strokeWidth = 0.35;
      shakyOutlinesGroup.fillColor = undefined; //remove fill

      //apply some more noise to the cloned group
      this.applyNoiseToPath(shakyOutlinesGroup, 6, 10.0, 4.0);

      var shakyOutlinesGroup2 = this.united.clone();
      shakyOutlinesGroup2.strokeWidth = 0.55;
      shakyOutlinesGroup2.fillColor = undefined; //remove fill

      //apply some more noise to the cloned group
      this.applyNoiseToPath(shakyOutlinesGroup2, 5, 16.0, 4.0);

    }

    Penis.prototype.pushShift = function(array) {
      array.push(array.shift());
    }

    Penis.prototype.applyNoiseToPath = function(_path, _sampleDist, _noiseDiv, _noiseScale) {

    var self = this;

    if(_path instanceof Group) {
      for(var i = 0; i < _path.children.length; i++) {
        self.applyNoiseToPath(_path.children[i], _sampleDist, _noiseDiv, _noiseScale);
      }
    } else {
        if(_sampleDist < _path.length) {
          _path.flatten(_sampleDist);
        }

        for(var i = 0; i < _path.segments.length; i++) {
            var noiseX = noise.noise(_path.segments[i].point.x / _noiseDiv,
                _path.segments[i].point.y / _noiseDiv,
                noiseSeed);
            var noiseY = noise.noise(_path.segments[i].point.y / _noiseDiv,
                noiseSeed,
                _path.segments[i].point.x / _noiseDiv);

            _path.segments[i].point = _path.segments[i].point + new Point(noiseX, noiseY) * _noiseScale;
        }
        _path.smooth();
      }

    }

    Penis.prototype.onFrame = function(event) {

      var self = this;
      this.shaft.changeSize({
        startPosition: this.startPosition,
        style: this.style,
        type: 'normal',
        shaftAngle: this.shaftAngle,
        shaftLength: this.shaftLength,
        shaftThickness: this.shaftThickness,
        rootSize: this.rootSize,
        tipLength: this.tipLength
      })



      // Change the y position of the segment point:
      // this.ballSack.leftBall.position.x = sinus * self.p + this.ballSack.o.leftPosition[0];
      // this.ballSack.rightBall.position.x = sinus * self.p + this.ballSack.o.rightPosition[0];
      // this.ballSack.generateConnections(this.ballSack.circlePaths);
      //

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

  var penis = new CreatePenis()

  var text = new PointText(new Point(30, 30));
  text.fillColor = 'black';

  text.content = 'Move your mouse over the view, to see its position';

  function onMouseMove(event) {

        // Each time the mouse is moved, set the content of
        // the point text to describe the position of the mouse:
        text.content = 'Your position is: ' + event.point.toString();
  }

  function onFrame(event) {
    // Each frame, rotate the path by 3 degrees:

    // penis.ballSack.generateConnections(penis.ballSack.circlePaths);
  }

  // this.o.startPosition = [150, 150]; // apply random startposition later
  // this.o.viewAngle = Math.floor(Math.random() * 180 ) + 1;
  // this.o.ballsWeight = Math.floor(Math.random() * 100 ) + 1;
  // this.o.ballsSize = this.o.ballStyle === 'firm' && Math.round(Math.random()) ? Math.floor(Math.random() * 20 ) + 10 : Math.floor(Math.random() * 10 ) + 1;
  // this.o.shaftStyle = Math.round(Math.random()) ? 'european' : 'american';
  // this.o.shaftAngle = (Math.floor(Math.random() * 130 ) + 1) + 25;
  // this.o.shaftThickness = 110;
  // this.o.shaftLength = 500;
  // this.o.TiptLength = 100;
  // this.o.rootSize = Math.floor(Math.random() * 60 ) + 40
  // this.o = _.extend(this.o, o)
  // this.group = new Group();
  // this.leftBall = null;
  // this.rightBal = null;
  // this.shaft = null;
  // this.tip = null;


  var gui = new dat.GUI();
  var GlobalFolder = gui.addFolder('Global');
  GlobalFolder.add(penis, 'draw')

  GlobalFolder.open()

  var shaftFolder = gui.addFolder('Shaft');
  shaftFolder.add(penis, 'shaftThickness', 90, 150)
  shaftFolder.add(penis, 'shaftAngle', -100, 200)
  shaftFolder.add(penis, 'shaftLength', 0, 1000)
  shaftFolder.add(penis, 'TiptLength')
  shaftFolder.add(penis, 'p', 0, 50)
  shaftFolder.add(penis, 'onFrame');

  shaftFolder.open()

  var ballSackFolder = gui.addFolder('Sack');

