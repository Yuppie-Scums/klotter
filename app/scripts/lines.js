var debug = true;

window.Lines = (function (o) {

  Lines.prototype = new Helpers();
  Lines.prototype.constructor = Lines;

  function Lines (o) {
    this.o = o;

    return this

  }

  return Lines;

})()
