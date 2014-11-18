

  var noise = new window.ClassicalNoise();
  var noiseSeed = Math.random() * 255;

  view.viewSize = new Size(2000, 2000);
  var debug = true;
  project.currentStyle = {
    fillColor: 'black'
  };

  var CreatePenis = (function () {

    'use strict';

    Penis.prototype = new Helpers();
    Penis.prototype.constructor = Penis;

    function Penis (o) {

      this.p = 0;

      this.o = o || {};

      this.penisGroup = new Group();
      this.moveCords = [];

      this.startPosition = [200, 300]; // apply random startposition later
      this.viewAngle = Math.floor(Math.random() * 180 ) + 1;


      // each ball(sack) will be created from two circles, one represent the base and one represent the acctual ball.
      // We draw the first circle at the starting position and calvulate the second ball depending on weight, the more wieight,
      // the further down the second circle will be.
      // the we apply the size of the the ball to the second cirlce.
      // finally we attach the the two circles
      this.ballsWeight = Math.floor(Math.random() * 100 ) + 500;
      this.ballsSize = Math.floor(Math.random() * 40 ) + 80;
      this.leftBallPosition = 150
      this.rightBallPosition = 250
      this.sackVelocity = 0.9;
      this.sackHandleLengthRate = 5.4


      this.shaftStyle = Math.round(Math.random()) ? 'european' : 'american';
      this.shaftAngle = (Math.floor(Math.random() * 130 ) + 1) + 25;
      this.shaftCurve = (Math.floor(Math.random() * 130 ) + 1) + 25;
      this.shaftThickness = 110;
      this.shaftLength = 300;
      this.TiptLength = 100;

      this.rootSize = Math.floor(Math.random() * 20 ) + 60

      this.group = new Group();
      this.ballSack = null;
      this.shaft = null;

      this.mainStroke = 2.5;
      this.secondaryStroke = 1.35;

      this.init();
      this.events();

    }

    Penis.prototype.init = function() {

      this.grid = new Grid()

      this.ballSack = new BallSack({
        startPosition: this.startPosition,
        leftPosition: [this.leftBallPosition, this.ballsWeight],
        rightPosition: [this.rightBallPosition, this.ballsWeight],
        size: this.ballsSize,
        sackVelocity: this.sackVelocity,
        sackHandleLengthRate: this.sackHandleLengthRate,
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
      });

      this.hair = new Hair({
        left: this.leftBallPosition,
        right: this.rightBallPosition,
        top: this.ballsWeight,
        size: this.ballsSize,
        stroke: this.mainStroke,
        amount: 120
      });

      this.pubes = new Hair({
        left: this.startPosition[0] - this.rootSize / 3,
        right: this.startPosition[0],
        top: this.startPosition[1] - 50,
        size: this.rootSize + this.rootSize / 3,
        stroke: this.mainStroke,
        amount: 60
      });

    };

    Penis.prototype.events = function() {

    };

    Penis.prototype.drawSingle = function() {

      if (this.penis) this.penis.remove()
      this.update();
      this.penis = this.draw();

      this.hair.removeAll();
      this.pubes.removeAll();
      this.shaft.removeAll();
      this.ballSack.removeAll();

    }
      

    Penis.prototype.drawMany = function() {

      this.update();

      var lastPenis = 0;
      for (var i = 0; i < 10; i++) {

        var penis = this.draw();
        
        
        var scale = Math.random();
        var rotate = this.random(0, 360);

        penis.rotate(rotate);
        penis.scale(scale, scale);
        // console.log(lastPenis)
        var x = lastPenis ? lastPenis + penis.bounds.width : 0 + penis.bounds.width / 2;
        var y = penis.position.y + 0;
        penis.position = new Point(this.grid.gridGroup.children[i].position.x, this.grid.gridGroup.children[i].position.y);
        // console.log(x)
        // lastPenis = lastPenis + x;

        this.penisGroup.addChild(penis);

      }

      this.hair.removeAll();
      this.pubes.removeAll();
      this.shaft.removeAll();
      this.ballSack.removeAll();

    };

    Penis.prototype.draw = function() {

      var self = this;
      var drawGroup = new Group();

      this.penis = this.shaft.shaft;
      this.ballHair = this.hair.hairGroup;
      this.rootHair = this.pubes.hairGroup;

      var array  = [
        this.ballSack.triangle, 
        this.ballSack.connections.children[0], 
        this.ballSack.connections.children[1], 
        this.ballSack.connections.children[2],
        this.ballSack.circlePaths[0],
        this.ballSack.circlePaths[1],
        this.ballSack.circlePaths[2]
      ]

      var united1 = this.ballSack.triangle.unite(this.ballSack.connections.children[0])
      var united2 = united1.unite(this.ballSack.connections.children[1])
      united1.remove();
      var united3 = united2.unite(this.ballSack.connections.children[2])
      united2.remove();
      var united4 = united3.unite(this.ballSack.circlePaths[0])
      united3.remove();
      var united5 = united4.unite(this.ballSack.circlePaths[1])
      united4.remove();
      this.united = united5.unite(this.ballSack.circlePaths[2])
      united5.remove();

      this.united.closed = true;
      this.united.fillColor = null;
      this.united.strokeColor = new Color(0, 0, 0, 0.6);
      this.united.strokeWidth = this.mainStroke;
      // this.united.fullySelected = true;

      // var times = this.getTopSegmentIndex(this.united.segments, this.shaftAngle)
      // this.pushShiftSegments(this.united.segments, times, 1)

      self.applyNoiseToPath(self.united, 6, 80.0, 6.0);

      var ballSack2 = this.copyAndApplyNoise('united', this.secondaryStroke, 6, 10.0, 4.0);
      var ballSack3 = this.copyAndApplyNoise('united', this.secondaryStroke, 5, 16.0, 4.0);

      var shaft1 = this.copyAndApplyNoise('penis', this.mainStroke, 6, 100.0, 6.0);
      var shaft2 = this.copyAndApplyNoise('penis', this.secondaryStroke, 6, 18.0, 4.0);
      var shaft3 = this.copyAndApplyNoise('penis', this.secondaryStroke, 5, 22.0, 4.0);

      var ballHair1 = this.copyAndApplyNoise('ballHair', this.mainStroke, 6, 80.0, 6.0);
      // var ballHair2 = this.copyAndApplyNoise('ballHair', this.secondaryStroke, 5, 16.0, 4.0)

      var rootHair1 = this.copyAndApplyNoise('rootHair', this.mainStroke, 6, 80.0, 6.0);
      // var rootHair2 = this.copyAndApplyNoise('rootHair', this.secondaryStroke, 5, 16.0, 4.0)

      drawGroup.addChildren([this.united , ballSack2, ballSack3, shaft1, shaft2, shaft3, ballHair1, rootHair1]);
      // drawGroup.addChildren([this.united]);
      // drawGroup.position.x = drawGroup.position.x + 500;

      return drawGroup;

    };

    Penis.prototype.setMoveCords = function() {
      return {
        x : 0,
        y: 0
      };
    };

    Penis.prototype.multiUnite = function (array) {

      var newUnite;
      var oldUnite;

      for (var i = 0; i < array.length; i++) {
        console.log(i)
        if (i === 0) {
          newUnite = array[i].unite(array[i+1]);
          continue;
        }

        if (i === 1) continue

        if(i % 2 !== 0) {
          newUnite = oldUnite.unite(array[i+1])
          oldUnite.remove()
        } else {
          // oldUnite = newUnite.unite(array[i+1])
          newUnite.remove()
        }

      }

      if (i % 2 !== 0) {
        return  newUnite;
      } else {
        return oldUnite
      }

    }

    Penis.prototype.pushShiftSegments = function(array, length, times, back, cb) {

      var i = 0;
      var directtion = back;

      for (; i < length; i++) {
        array.push(array.shift());
      }


      // this.united.removeSegment(this.united.segments.length);
      this.united.removeSegment(this.united.segments.length)

      return;

    };

    Penis.prototype.copyAndApplyNoise = function(source, strokWidth, sampleDist, noiseDiv, noiseScale) {
      var path = this[source].clone();
      path.strokeWidth = strokWidth;
      path.fillColor = undefined; //remove fill

      //apply some more noise to the cloned group
      this.applyNoiseToPath(path, sampleDist, noiseDiv, noiseScale);

      return path;
    };

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

        var j = 0;
        var length = path.segments.length;

        for(; j < length; j++) {
            var noiseX = noise.noise(path.segments[j].point.x / noiseDiv,
                path.segments[j].point.y / noiseDiv,
                noiseSeed);
            var noiseY = noise.noise(path.segments[j].point.y / noiseDiv,
                noiseSeed,
                path.segments[j].point.x / noiseDiv);

            path.segments[j].point = path.segments[j].point + new Point(noiseX, noiseY) * noiseScale;
        }
        path.smooth();
      }

    };

    Penis.prototype.update = function(event) {

      var self = this;
      this.shaft.changeSize({
        startPosition: this.startPosition,
        shaftAngle: this.shaftAngle,
        shaftCurve: this.shaftCurve,
        shaftLength: this.shaftLength,
        shaftThickness: this.shaftThickness,
        rootSize: this.rootSize,
      });

      this.ballSack.changeSize({
        startPosition: this.startPosition,
        leftPosition: [this.leftBallPosition, this.ballsWeight],
        rightPosition: [this.rightBallPosition, this.ballsWeight],
        sackVelocity: this.sackVelocity,
        sackHandleLengthRate: this.sackHandleLengthRate,
        size: this.ballsSize,
        rootSize: this.rootSize
      });

      this.ballSack.changeSize({
        startPosition: this.startPosition,
        leftPosition: [this.leftBallPosition, this.ballsWeight],
        rightPosition: [this.rightBallPosition, this.ballsWeight],
        sackVelocity: this.sackVelocity,
        sackHandleLengthRate: this.sackHandleLengthRate,
        size: this.ballsSize,
        rootSize: this.rootSize
      });

      this.hair.changeSize({
        left: this.leftBallPosition,
        right: this.rightBallPosition,
        top: this.ballsWeight,
        size: this.ballsSize,
        stroke: this.mainStroke,
        amount: 120
      });

      this.pubes.changeSize({
        left: this.startPosition[0] - this.rootSize / 3,
        right: this.startPosition[0],
        top: this.startPosition[1] - 50,
        size: this.rootSize + this.rootSize / 3,
        stroke: this.mainStroke,
        amount: 60
      });

    };

    return Penis;

  })();

  var penis = new CreatePenis();

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
  GlobalFolder.add(penis, 'update');
  GlobalFolder.add(penis, 'drawSingle');
  GlobalFolder.add(penis, 'drawMany');

  GlobalFolder.open();

  var shaftFolder = gui.addFolder('Shaft');
  shaftFolder.add(penis, 'shaftThickness', 90, 150);
  shaftFolder.add(penis, 'shaftLength', 0, 1000);
  shaftFolder.add(penis, 'shaftAngle', -100, 200);
  shaftFolder.add(penis, 'shaftCurve');

  shaftFolder.open();

  var ballSackFolder = gui.addFolder('balls');

  ballSackFolder.add(penis, 'leftBallPosition', 100, 300);
  ballSackFolder.add(penis, 'rightBallPosition', 100, 300);
  ballSackFolder.add(penis, 'ballsWeight', 500, 600);
  ballSackFolder.add(penis, 'ballsSize', 80, 120);
  ballSackFolder.add(penis, 'sackVelocity', 0.7, 1.2);
  ballSackFolder.add(penis, 'sackHandleLengthRate', 3.0, 6.0);

  ballSackFolder.open();
