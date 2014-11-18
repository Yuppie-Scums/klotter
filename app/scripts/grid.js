var debug = false;

window.Grid = (function (o) {

  Grid.prototype = new Helpers();
  Grid.prototype.constructor = Grid;

  function Grid (o) {
    this.o = o || {};
    this.o.outerWidth = 1500;

    this.gridData = this.gridSetup(10)

    this.gridGroup = new paper.Group();
    this.createSquares(this.gridGroup, this.gridData)

    return this;

  }

  Grid.prototype.gridSetup = function(tweet) {
      
    if (!tweet) {
      return false;
    }

    var tweetLength = tweet;
    var horizontal;
    var vertical;
    var boxSize;
    var fontSize;
    var minProcent;
    var boxSizeProcent;

    // calculate how many grids we need;
    if (tweetLength <= 12) {
        horizontal = 3;
        vertical = 4;
        boxSizeProcent = 0.26;
        boxSize = this.o.outerWidth * boxSizeProcent;
        fontSize = 0.44;

    } else if (tweetLength <= 24) {
        horizontal = 4;
        vertical = 6;
        fontSize = 66;
        boxSize = 103;
        fontSize = 0.44;

    } else if (tweetLength <= 54) {
        horizontal = 6;
        vertical = 9;
        boxSize = 69;
        fontSize = 0.44;

    } else if (tweetLength <= 88) {
        horizontal = 8;
        vertical = 11;
        boxSize = 56;
        fontSize = 0.44;

    } else {
        horizontal = 10;
        vertical = 14;
        boxSize = 44;
        fontSize = 0.44;
    }

    return {
      vertical: vertical,
      horizontal: horizontal,
      boxSize: boxSize,
      fontSize: fontSize,
      minProcent: minProcent,
    }

  }

  Grid.prototype.createSquares = function(group, gridSpace) {

    var startX = 0;
    var startY = 0;
    var squareSize = gridSpace.boxSize;
    var y = 0;
    var i = 0;


    for (; y < gridSpace.vertical; y++) {

        var x = 0;

        for (; x < gridSpace.horizontal; x++) {

            var layer = new paper.Layer();
            var shape = new paper.Shape.Rectangle({
                point: [x * squareSize,  y * squareSize],
                size: [squareSize, squareSize],
                strokeColor: 'black',
                fillColor: null,
            });

            shape.strokeColor = null;
            layer.appendTop(shape)
            // layer.pivot = new paper.Point(x * squareSize, y * squareSize);

            group.addChild(layer)

        }

    }

    return group;

  }

  return Grid;

})()