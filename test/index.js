(function () {
  'use strict';

  var $ = window.jQuery;
  var chai = window.chai;
  var mocha = window.mocha;
  var Olay = window.Olay;

  mocha.setup('bdd');
  chai.should();

  var describe = window.describe;
  var it = window.it;

  var olay = new Olay('hi', {
    transitionDuration: 1
  });

  describe('Constructor', function () {
    it('should create a jQuery container element', function () {
      olay.should.have.property('$container');
      olay.$container.should.be.instanceOf($);
    });

    it('should create a jQuery table element', function () {
      olay.should.have.property('$table');
      olay.$table.should.be.instanceOf($);
    });

    it('should create a jQuery cell element', function () {
      olay.should.have.property('$cell');
      olay.$cell.should.be.instanceOf($);
    });

    it('should create a jQuery content element', function () {
      olay.should.have.property('$content');
      olay.$content.should.be.instanceOf($);
    });

    it('should give the content element the correct ARIA role', function () {
      olay.$content.attr('role').should.equal('alertdialog');
    });

    it('should give the content element the correct...content', function () {
      olay.$content.html().should.equal('hi');
    });

    it('should inherit options', function () {
      olay.transitionDuration.should.equal(1);
    });
  });

  describe('Callbacks', function () {
    it('should fire `onShow` when the olay is shown', function (done) {
      olay.onShow = done;
      olay.show();
    });

    it('should fire `onHide` when the olay is hidden', function (done) {
      olay.onHide = done;
      olay.hide();
    });
  });

  describe('DOM Manipulation', function () {
    it('should append to the DOM on show', function (done) {
      olay.onShow = function () {
        $('.js-olay-container').should.have.length(1);
        done();
      };
      olay.show();
    });

    it('should remove from the DOM on hide', function (done) {
      olay.onHide = function () {
        $('.js-olay-container').should.have.length(0);
        done();
      };
      olay.hide();
    });
  });

  mocha.run();
})();
