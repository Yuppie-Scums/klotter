
window.Pubes = (function (o) {

  Pubes.prototype = new Helpers();
  Pubes.prototype.constructor = Pubes;

  function Pubes (o) {

    this.o = o;

    console.log('loading pubes')

    return this;

  }

  Pubes.prototype.createShape = function() {

  }

  return Pubes;

})()
