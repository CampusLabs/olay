# Olay

Accessible **O**ver **lay**s that don't suck!

[Demo](http://orgsync.github.com/olay) | [Tests](http://orgsync.github.com/olay/test)

## Install

Olay's one dependency is jQuery, so include that before Olay.

```html
<link rel='stylesheet' href='https://raw.github.com/orgsync/olay/master/olay.css'>
<script src='https://raw.github.com/orgsync/olay/master/olay.js'></script>
```

...or use [bower](https://github.com/twitter/bower)...

```
bower install olay
```

...and get the JavaScript and CSS files from `components/olay/olay.js` and
`components/olay/olay.css` respectively.

## Example

Try running this code on the [demo page](http://orgsync.github.com/olay).

```js
// Show "¡Olé!" for one second and then hide, alerting "Farewell, mí amigo.".
var olay = new Olay('<h1>¡Olé!</h1>', {duration: 1000});
olay.$el.on('hide', function () { alert('Farewell, mí amigo.'); });
olay.show();
```

## API

### Olay(el [, options])

- **el** - a jQuery object, DOM node, jQuery selector or raw HTML.
- **options** - An optional object with any or all of the following...
  - **duration** `0` - The number of milliseconds to display the olay before
    automatically invoking `hide`. A `0` duration means the olay will be
    displayed indefinitely.
  - **transition** `'js-olay-scale-up'` - The transition to use. Since
    this property simply refers to the class that will be added to the `
    $container` element, it is very easy to create your own CSS transitions and
    namespace them with whatever transition class you'd like. Olay comes with:
      - `'js-olay-scale-up'`
      - `'js-olay-scale-down'`
      - `'js-olay-slide'`
      - `'js-olay-flip'`
  - **transitionDuration** `250` - The duration of the transition in
    milliseconds. **IMPORTANT! The `transitionDuration` must match
    `transition-duration` in your CSS to work properly.**
  - **hideOnKeys** `[27]` - An array of keycodes that should hide the olay
    when pressed. Set to `[]` or a falsy value to disable.
  - **hideOnClick** `true` - A boolean specifiying whether the olay should be
    hidden when anything outside the `$content` element is clicked.
  - **ariaLabel** - A label to describe the olay for ARIA compliance.

### $container

The jQuery object that is added to and removed from `<body>`. It contains all of
the elements necessary for the olay. It also keeps a record of its corresponding
olay instance in `$container.data('olay')`. Style the container using the
`.js-olay-container` selector in CSS.

### $table

A `<div>` with `display: table` for reliable centering in those silly IE
browsers.

### $cell

Naturally, a `<div>` with `display: table-cell` to live inside `$table`.

### $content

The wrapper `<div>` for `$el`. Style the content wrapper using the `.js-olay-
content` selector in CSS>

### $el

A jQuery object representing the element that was passed in the constructor. As
mentioned below, `'show'` and `'hide'` events are triggered on this object.

### show()

Show the olay, appending `$container` to the DOM.

### hide()

Hide the olay. **Note:** `$container` is removed from the DOM with jQuery's
`remove` method.

### 'show'/'hide' Events

Olay uses jQuery's event emitter to fire `'show'` and `'hide'` events when
`show` or `hide` are invoked. See the example above for usage.

### 'js-olay-hide' Class

Any element with the 'js-olay-hide' class inside an olay will hide its parent
olay once clicked. This makes adding close/hide buttons as easy as
`<span class='js-olay-hide'>Close</span>`.
