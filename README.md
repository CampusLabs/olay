# Olay

**O**ver **lay**s that don't suck!

[Demo](http://orgsync.github.com/olay) | [Tests](http://orgsync.github.com/olay/test)

## Install

```html
<link rel='stylesheet' href='https://raw.github.com/orgsync/olay/master/index.css'>
<script src='https://raw.github.com/orgsync/olay/master/index.js'></script>
```

...or...

```
npm install olay
```

...and get the JavaScript and CSS files from `node_modules/olay/index.js` and
`node_modules/olay/index.css` respectively.

## Example

```js
// Show "¡Olé!" for one second and then hide, alerting "Farewell, mí amigo.".
var olay = new Olay('<h1>¡Olé!</h1>' {duration: 1000});
olay.$el.on('hide', function () { alert('Farewell, mí amigo.'); });
olay.show();
```

## API

### Olay(el [, options])

- **el** - a jQuery object, DOM node, or raw HTML.
- **options** - An optional object with any or all of the following.
  - **duration** _default_ `0` - The number of milliseconds to display the olay
    before automatically invoking `hide`. A `0` duration means the olay will be
    displayed indefinitely.
  - **transition** _default_ `'js-olay-flip'` - The transition to use. Since
    this property simply refers to the class that will be added to the `
    $container` element, it is very easy to create your own CSS transitions and
    namespace them with whatever transition class you'd like. Olay comes with:
      - `'js-olay-flip'`
      - `'js-olay-slide'`
      - `'js-olay-scale-up'`
      - `'js-olay-scale-down'`
  - **transitionDuration** _default_ `250` - The duration of the transition.
    **IMPORTANT! The `transitionDuration` must match `transition-duration` in your CSS to work properly.**
