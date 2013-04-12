(function () {
  'use strict';

  // Store a local reference to jQuery.
  var $ = window.jQuery;

  // Selector for tabbable elements.
  var tabbable =
    ':input, [tabindex], [contenteditable], [href], iframe, object, embed';

  // Convenience method for `off`/`on`ing in jQuery.
  var delegate = function ($el, ev, selector, cb) {
    $el.off.call($el, ev, selector, cb);
    $el.on.call($el, ev, selector, cb);
  };

  // Listen for keydown events.
  $(document).keydown(function (ev) {
    var $olay = $('.js-olay-container').last();
    var olay = $olay.data('olay');
    if (!olay) return;
    var which = ev.which;
    var keys = olay.hideOnKeys || [];
    for (var i = 0, l = keys.length; i < l; ++i) {
      if (which === keys[i]) return olay.hide() && false;
    }
  });

  // Create the `Olay` constructor.
  //
  // ```js
  // var olay = new Olay('Howdy!', {duration: 5000});
  // ```
  var Olay = window.Olay = function (el, options) {

    // Extend the instance with its options.
    for (var name in options) this[name] = options[name];

    // Store bound listeners to be used for callbacks. This is also used to
    // ensure event callbacks can be removed consistently.
    var self = this;
    this._hide = function () { return self.hide(); };
    this._$containerClick = function (ev) {
      var contentClicked = $.contains(self.$cell[0], ev.target);
      if (self.hideOnClick && !contentClicked) self.hide();
    };

    // Create the necessary DOM nodes.
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
      .attr({role: 'alertdialog', 'aria-label': this.ariaLabel}))));

    // Finally, set the element.
    this.setElement(el);
  };

  // Define `prototype` properties and methods for `Olay`.
  var proto = {

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

    // Preserve the DOM data and events for this olay. If this is set to `true`,
    // be sure to either set it to `false` before your final `hide` call, or
    // after your final `hide` call invoke `destroy()` after your transition.
    // Failure to do this will cause memory leaks. When `preserve` is set to
    // `false` this is handled automaticaly.
    preserve: false,

    // Show the olay.
    show: function () {
      var inDom = $.contains($('body')[0], this.$container[0]);
      if (inDom && this.$container.hasClass('js-olay-show')) return this;
      clearTimeout(this._timeout);
      if (!inDom) this._append();

      // Force a redraw before adding the transition class. Not doing this will
      // apply the end result of the transition instantly, which is not
      // desirable in a transition...
      this.$container.data('olay', this).height();
      this.$container.addClass('js-olay-show');

      // Delegate events, ensuring no double-binding.
      delegate(this.$container, 'click', this._$containerClick);
      delegate(this.$content, 'click', '.js-olay-hide', this._hide);

      this.$el.trigger('olay:show');
      var duration = this.duration;
      if (!this.duration) return this;
      duration += this.transitionDuration;
      this._timeout = setTimeout(this._hide, duration);
      return this;
    },

    // Hide the olay by removing the `'js-show'` class to the container and then
    // finally removing it from the DOM after `transitionDuration`.
    hide: function () {
      if (!this.$container.hasClass('js-olay-show')) return;
      clearTimeout(this._timeout);
      this.$container.removeClass('js-olay-show');
      var duration = this.transitionDuration;
      if (!duration) return this._remove();
      var self = this;
      this._timeout = setTimeout(function () { self._remove(); }, duration);
      return this;
    },

    // Use this method to set or update `$el`.
    setElement: function (el) {
      this.$content.empty().append(this.$el = el instanceof $ ? el : $(el));
      return this;
    },

    // Completely remove the `$container` element and its children and all of
    // the associated data and events. This will only ever need to be called if
    // the `preserve` option is `true` to prevent memory leaks.
    destroy: function () {
      this.$container.remove();
      return this;
    },

    // Append `$container` to the DOM. Used internally.
    _append: function () {
      var $body = $('body');
      var $olays = $('.js-olay-container');
      var active = document.activeElement;
      var useLast = $olays.length && active === $body[0];
      this._$active = useLast ? $olays.last() : $(active);
      $(tabbable).each(function () {
        if ('olayTabindex' in this) return;
        var $self = $(this);
        this.olayTabindex = $self.attr('tabindex') || null;
        $self.attr('tabindex', -1);
      });
      $body.addClass('js-olay-visible').append(this.$container);
      this.$content.attr('tabindex', 0).focus().removeAttr('tabindex');
      return this;
    },

    // Detach and optionally remove `$container` from the DOM. Used internally.
    _remove: function () {
      this.$container.detach();
      this._$active.attr('tabindex', 0).focus().removeAttr('tabindex');
      var $olays = $('.js-olay-container');
      ($olays.length ? $olays.last() : $('body').removeClass('js-olay-visible'))
        .find(tabbable).each(function () {
          $(this).attr('tabindex', this.olayTabindex);
          delete this.olayTabindex;
        });
      this.$el.trigger('olay:hide');
      if (!this.preserve) this.destroy();
      return this;
    }
  };

  // Extend `Olay.prototype`.
  for (var name in proto) Olay.prototype[name] = proto[name];
})();
