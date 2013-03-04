(function () {
  'use strict';

  var $ = window.jQuery;
  var _ = window._;
  var chai = window.chai;
  var mocha = window.mocha;
  var Olay = window.Olay;

  mocha.setup('bdd');
  chai.should();

  var describe = window.describe;
  var it = window.it;

  var $el = $('<div>hi</div>');
  var olay = new Olay($el, {
    transitionDuration: 0
  });

  describe('Constructor', function () {
    it('should create a jQuery $container element', function () {
      olay.should.have.property('$container');
      olay.$container.should.be.instanceOf($);
    });

    it('should create a jQuery $table element', function () {
      olay.should.have.property('$table');
      olay.$table.should.be.instanceOf($);
    });

    it('should create a jQuery $cell element', function () {
      olay.should.have.property('$cell');
      olay.$cell.should.be.instanceOf($);
    });

    it('should create a jQuery $content element', function () {
      olay.should.have.property('$content');
      olay.$content.should.be.instanceOf($);
    });

    it('should give the $content element the correct ARIA role', function () {
      olay.$content.attr('role').should.equal('alertdialog');
    });

    it('should create a jQuery $el element', function () {
      olay.should.have.property('$el');
      olay.$el.should.be.instanceOf($);
    });

    it('should give the $el element the passed in $el', function () {
      olay.$el.html().should.equal('hi');
      olay.$el.should.equal($el);
    });

    it('should inherit options', function () {
      olay.transitionDuration.should.equal(0);
    });
  });

  describe('Callbacks', function () {
    it('should trigger `show` when `show` is invoked', function (done) {
      olay.$el.one('show', function () { done(); });
      olay.show();
    });

    it('should trigger `hide` when `hide` is invoked', function (done) {
      olay.$el.one('hide', function () { done(); });
      olay.hide();
    });
  });

  describe('DOM Manipulation', function () {
    it('should append to the DOM on show', function () {
      olay.show();
      $('.js-olay-container').should.have.length(1);
    });

    it('should remove from the DOM on hide', function () {
      olay.hide();
      $('.js-olay-container').should.have.length(0);
    });
  });

  describe('Hide Options', function () {
    it('should hide when ESC is pressed', function () {
      olay.show();
      $(document).trigger({type: 'keydown', which: 27});
      $('.js-olay-container').should.have.length(0);
    });

    it('should hide when $container is clicked, but not $content', function () {
      olay.show().$content.click();
      $('.js-olay-container').should.have.length(1);
      olay.$cell.click();
      $('.js-olay-container').should.have.length(0);
    });

    it('should hide after a defined duration', function (done) {
      olay.duration = 1;
      olay.show();
      _.delay(function () {
        $('.js-olay-container').should.have.length(0);
        done();
      }, 1);
      olay.duration = 0;
    });
  });

  describe('Tabindex', function () {
    var $input = $('<input>')
      .addClass('js-test-input')
      .attr('tabindex', 1)
      .appendTo('body');

    it('should be locked when an olay is shown', function () {
      olay.show();
      $input.attr('tabindex').should.equal('-1');
    });

    it('should be restored when an olay is hidden', function () {
      olay.hide();
      $input.attr('tabindex').should.equal('1');
      $input.remove();
    });
  });

  mocha.run();
})();
