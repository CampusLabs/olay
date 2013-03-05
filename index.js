(function () {
  'use strict';

  // Store a local reference to jQuery.
  var $ = window.jQuery;
  var _ = window._;

  // Cache $('body'), it's used a lot.
  var $body;
  $(function () { $body = $('body'); });

  // Listen for keydown events.
  $(document).keydown(function (ev) {
    var $olay = $('.js-olay-container').last();
    var olay = $olay.data('olay');
    if (!olay || !_.contains(olay.hideOnKeys, ev.which)) return;
    olay.hide();
    return false;
  });

  // Create the `Olay` constructor.
  //
  // ```js
  // var olay = new Olay('Howdy!', {duration: 5000});
  // ```js
  var Olay = window.Olay = function (el, options) {
    _.extend(this, options);
    this.$container = $('<div>')
      .addClass('js-olay-container')
      .addClass(this.transition)
      .append(
    this.$table = $('<div>')
      .addClass('js-olay-table')
      .append(
    this.$cell = $('<div>')
      .addClass('js-olay-cell')
      .append(
    this.$content = $('<div>')
      .addClass('js-olay-content')
      .attr('role', 'alertdialog')
      .append(
    this.$el = el instanceof $ ? el : $(el)))));
  };

  // Define `prototype` properties and methods for `Olay`.
  _.extend(Olay.prototype, {

    // How long the olay should be displayed for (in ms)?
    // `0` means indefinitely.
    duration: 0,

    // What transition should be used? This simply refers to a class that will
    // be added to the `$container` when shown. Use this to style different
    // transitions with CSS.
    transition: 'js-olay-scale-up',

    // How long should the olay take to transition in or out?
    // `0` means instantly.
    transitionDuration: 250,

    // What keys hide the olay? Default is just ESC.
    hideOnKeys: [27],

    // Should the olay be hidden when there is a click outside the content box?
    hideOnClick: true,

    // Show the olay.
    show: function () {
      var inDom = $.contains($body, this.$container);
      if (inDom && this.$container.hasClass('js-olay-show')) return this;
      clearTimeout(this._timeout);
      if (!inDom) this._append();

      // Force a redraw before and after adding the transition class. Not doing
      // this will apply the end result of the transition instantly, which is
      // not desirable in a transition...
      this.$container.data('olay', this).height();
      this.$container.addClass('js-olay-show');
      this.$content.on('click', '.js-olay-hide', _.bind(this.hide, this));
      if (this.hideOnClick) {
        this.$container.click(_.bind(this.hide, this));
        this.$content.click(function (ev) { ev.stopPropagation(); });
      }
      this.$el.trigger('show');
      var duration = this.duration;
      if (!duration) return this;
      duration += this.transitionDuration;
      this._timeout = _.delay(_.bind(this.hide, this), duration);
      return this;
    },

    // Hide the olay by removing the `'js-show'` class to the container and then
    // finally removing it from the DOM after `transitionDuration`.
    hide: function () {
      if (!this.$container.hasClass('js-olay-show')) return;
      clearTimeout(this._timeout);
      this.$container.removeClass('js-olay-show');
      this.$el.trigger('hide');
      var duration = this.transitionDuration;
      if (!duration) return this._remove();
      this._timeout = _.delay(_.bind(this._remove, this), duration);
      return this;
    },

    // Append `$container` to the DOM. Used internally.
    _append: function () {
      if (!$body.data('olayStyle')) {
        $body.data('olayStyle', $body.attr('style') || null)
          .css('overflow', 'hidden');
      }
      $(':input').each(function () {
        var $t = $(this);
        if ('olayTabindex' in $t.data()) return;
        $t.data('olayTabindex', $t.attr('tabindex') || null)
          .attr('tabindex', -1);
      });
      $(':input:focus').blur();
      $body.append(this.$container);
      return this;
    },

    // Detach or remove `$container` from the DOM. Used internally.
    _remove: function () {
      var $olays = $('.js-olay-container');
      var length = $olays.length;
      this.$container.remove();
      var $unTabindex = $olays.eq(length - 2);
      if (length === 1) {
        $unTabindex = $body.attr('style', $body.data('olayStyle'))
          .removeData('olayStyle');
      }
      $unTabindex.find(':input').each(function () {
        var $t = $(this);
        $t.attr('tabindex', $t.data('olayTabindex')).removeData('olayTabindex');
      });
      return this;
    }
  });
})();
