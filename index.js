(function () {
  'use strict';

  // Store a local reference to jQuery.
  var $ = window.jQuery;
  var _ = window._;

  // Listen for keydown events.
  $(document).keydown(function (ev) {
    var $olay = $('.js-olay-container').last();
    var olay = $olay.data('olay');
    if (!olay || !_.contains(olay.hideKeys, ev.which)) return;
    olay.hide();
    return false;
  });

  // Create the `Olay` constructor.
  //
  // ```js
  // var olay = new Olay('Howdy!', {duration: 5000});
  // ```js
  var Olay = window.Olay = function (html, options) {
    (this.$container = $('<div>')
      .addClass('js-olay-container')
      .addClass(this.transition)
      .append(this.$table = $('<div>')
        .addClass('js-olay-table')
        .append(this.$cell = $('<div>')
          .addClass('js-olay-cell')
          .append(this.$content = $('<div>')
            .addClass('js-olay-content')
            .attr('role', 'alertdialog')
            .append(html)
          )
        )
      )
    );
    _.extend(this, options);
  };

  // Define `prototype` properties and methods for `Olay`.
  _.extend(Olay.prototype, {

    // How long the olay should be displayed for (in ms)?
    // `0` means indefinitely.
    duration: 0,

    // What transition should be used? This simply refers to a class that will
    // be added to the `$container` when shown.
    transition: 'js-fade',

    // How long should the olay take to transition in or out?
    // `0` means instantly.
    transitionDuration: 250,

    // What keys hide the olay? Default escape, enter, and space.
    hideKeys: [27, 13, 32],

    // Preserve the DOM data and events for this olay. If this is set to `true`,
    // be sure to either set it to `false` before your final `hide` call, or
    // after your final `hide` call invoke `destroy()` after your transition.
    // Failure to do this will cause memory leaks. When `preserve` is set to
    // `false` this is handled automaticaly.
    preserve: false,

    // Callbacks for `show` and `hide`.
    onShow: function () {},
    onHide: function () {},

    // Show the olay.
    show: function () {
      var inDom = this._bodyStyle !== void 0;
      if (inDom && this.$container.hasClass('js-show')) return this;
      clearTimeout(this.interval);
      if (!inDom) this._append();

      // Force a redraw before and after adding the transition class. Not doing
      // this will apply the end result of the transition instantly, which is
      // not desirable in a transition...
      this.$container.data('olay', this).height();
      this.$container.addClass('js-show').height();
      if (this.duration) {
        var duration = this.transitionDuration + this.duration;
        this.interval = _.delay(_.bind(this.hide, this), duration);
      }
      _.delay(_.bind(this.onShow, this), this.transitionDuration);
      return this;
    },

    // Hide the olay by removing the `'js-show'` class to the container and then
    // finally removing it from the DOM after `transitionDuration`.
    hide: function () {
      if (!this.$container.hasClass('js-show')) return;
      clearTimeout(this.interval);
      this.$container.removeClass('js-show').height();
      var duration = this.transitionDuration;
      if (!duration) return this._remove();
      this.interval = _.delay(_.bind(this._remove, this), duration);
      return this;
    },

    // Completely remove the `$container` element and its children and all of
    // the associated data and events.
    destroy: function () {
      this.$container.remove();
    },

    // Append `$container` to the DOM. Used internally.
    _append: function () {
      var $body = $('body');
      $body.append(this.$container);
      this._bodyStyle = $body.attr('style') || null;
      $body.css('overflow', 'hidden').find(':focus').blur();
      return this;
    },

    // Detach or remove `$container` from the DOM. Used internally.
    _remove: function () {
      var last = $('.js-olay-container').length === 1;
      this.preserve ? this.$container.detach() : this.destroy();
      if (last) $('body').attr('style', this._bodyStyle);
      this._bodyStyle = void 0;
      this.onHide.call(this);
      return this;
    }
  });
})();
