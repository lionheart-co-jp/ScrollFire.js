# ScrollFire

The class of method fired by scroll position.

## Demo

[Demo is here](https://lionheart-co-jp.github.io/ScrollFire.js/)

## How to use

```js
var elem = document.querySelector('#foo');
var entryFunction = function(el) {
    el.classList.add('scroll-action');
}
var leaveFunction = function(el) {
    el.classList.remove('scroll-action');
}

var fire = new ScrollFire();
fire.addTrigger(elem, entryFunction, leaveFunction);
fire.start();
```

### jQuery Support

You can insert element as jQuery element.

```js
var target = $('.something');
var entryFunction = function($el) {
    $el.addClass('scroll-action');
}
var leaveFunction = function($el) {
    $el.removeClass('scroll-action');
}

var fire = new ScrollFire();
fire.addTrigger(target, entryFunction, leaveFunction);
fire.start();
```

### Vanilla JS Support

You can insert element as Vanilla JS element too.

```js
var target = document.querySelectorAll('.target');

var fire = new ScrollFire();
fire.addTrigger(target, entryFunction, leaveFunction);
fire.start();
```

### Method chaining

You can use method chaining

```js
new ScrollFire()
    .addTrigger(target, entryFunction, leaveFunction)
    .start();
```

## Reference

### addTrigger

Adding scroll fire trigger

```js
ScrollFire.addTrigger(
    target: HTMLElement | NodeList | JQuery,
    entryFunction?: (el: HTMLElement | JQuery) => void,
    leaveFunction?: (el: HTMLElement | JQuery) => void,
    options?: IntersectionObserverInit
) : ScrollFire
```

Entry and Leave callback's first argument is passed `target`.


#### e.g.

```js
fire.addTrigger(target, function(el) {
    // el -> HTMLElement | JQuery
}, function (el) {
    // el -> HTMLElement | JQuery
});
```

#### You can put IntersectionOvserver option to 4th parameter

Default value is like this

```js
fire.addTrigger(target, entryFunction, leaveFunction, {
    root: null,
    rootMargin: "-50% 0px",
    threshold: 0,
});
```

### start

Starting scroll fire action

```js
ScrollFire.start() : ScrollFire
```

### stop

Stopping scroll fire action

```js
ScrollFire.stop() : ScrollFire
```
