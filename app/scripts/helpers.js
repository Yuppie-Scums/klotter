// Helper object that contains modifaction methods
var debug = true;

window.Helpers = (function() {

    var headCenter = [];
    var headCornerPoints = {};
    var shapes = {};

    function Helpers() {
      this.test = 'test'
    }

    // Helpers.prototype.addPoints = function(numbers) {
    //
    //   this.flatten(numbers);
    //   this.smooth();
    //
    //   return this;
    //
    // }

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

    Helpers.prototype.removeTopSegment = function(segments) {

      var i = 0;
      var length = segments.length
      var topSegment = null;
      var segmentIndex = null

      for (; i < length; i++) {

          if (topSegment === null || segments[i].point.y < topSegment.y) {
            topSegment = segments[i].point
            segmentIndex = i
          }

      }

      this.removeSegment(segmentIndex)

      return topSegment;

    }

    Helpers.prototype.getTopSegmentIndex = function(segments, angle) {

      var i = 0;
      var length = segments.length
      var topSegment = null;
      var segmentIndex = null
      var deduct = angle <= 0 ? 1 : 0

      for (; i < length; i++) {

          if (topSegment === null || segments[i].point.y < topSegment.y) {
            topSegment = segments[i].point
            segmentIndex = i
          }

      }

      return segmentIndex - deduct;

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
