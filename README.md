# ScrollFire

The class of method fired by scroll position.

## How to use

```js
var elem = document.querySelector('#foo');
var someFunction = function(el) {
    el.classList.add('scroll-action');
}

var fire = new ScrollFire();
fire.addTrigger(elem, someFunction);
fire.start();
```

### jQuery Support

You can insert element as jQuery element.

```js
var target = $('.something');

var fire = new ScrollFire();
fire.addTrigger(target, someFunction);
fire.start();
```

### Vanila JS Support

You can insert element as vanila js element too.

```js
var target = document.getElementById('target');

var fire = new ScrollFire();
fire.addTrigger(target, someFunction);
fire.start();
```

### Method chaining

You can use method chaining

```js
var fire = new ScrollFire();
fire.changePadding(100)
    .addTrigger(target, someFunction)
    .start()
```

## Reference

### addTrigger

Adding scroll fire trigger

```js
ScrollFire.addTrigger(target: HTMLElement | JQuery, callback: Function) : ScrollFire
```

Callback's first argument is passed `target`.


#### e.g.

```js
fire.addTrigger(target, function(el) {
    console.log(target === el) // -> true
});
```

### changePadding

Change trigger position's padding

```js
ScrollFire.changePadding(padding: number) : ScrollFire
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