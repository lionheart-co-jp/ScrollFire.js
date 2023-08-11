# ScrollFire

The class of method fired by scroll position.

## Demo

[Demo is here](https://lionheart-co-jp.github.io/ScrollFire.js/)

## How to use

```html
<link rel="stylesheet" href="./path/to/ScrollFire/ScrollFire.css" />
<script src="./path/to/ScrollFire/ScrollFire.min.js"></script>
```

- You can download from `docs/ScrollFire` directory

https://github.com/lionheart-co-jp/ScrollFire.js/tree/master/docs/ScrollFire

```js
var elem = document.querySelector("#foo");
var entryFunction = function (el) {
  el.classList.add("scroll-action");
};
var leaveFunction = function (el) {
  el.classList.remove("scroll-action");
};

var fire = new ScrollFire();
fire.addTrigger(elem, entryFunction, leaveFunction);
fire.start();
```

### jQuery Support

You can insert element as jQuery element.

```js
var target = $(".something");
var entryFunction = function ($el) {
  $el.addClass("scroll-action");
};
var leaveFunction = function ($el) {
  $el.removeClass("scroll-action");
};

var fire = new ScrollFire();
fire.addTrigger(target, entryFunction, leaveFunction);
fire.start();
```

### Vanilla JS Support

You can insert element as Vanilla JS element too.

```js
var target = document.querySelectorAll(".target");

var fire = new ScrollFire();
fire.addTrigger(target, entryFunction, leaveFunction);
fire.start();
```

### Method chaining

You can use method chaining

```js
new ScrollFire().addTrigger(target, entryFunction, leaveFunction).start();
```

## Reference

### addTrigger

Adding scroll fire trigger

```js
ScrollFire.addTrigger(
    target: HTMLElement | NodeList | JQuery,
    entryFunction?: (el: HTMLElement | JQuery) => void,
    leaveFunction?: (el: HTMLElement | JQuery) => void,
    options?: {
        root?: Element | Document | null,
        ratio?: number,
        debugThresholdView?: boolean,
        debugThresholdViewColor?: string,
        debugDummyElementView?: boolean,
        debugDummyElementViewColor?: string,
    } = {
        root: null,
        ratio: 50,
        debugThresholdView: false,
        debugThresholdViewColor: rgba(255, 0, 0, 0.5),
        debugDummyElementView: false,
        debugDummyElementViewColor: rgba(0, 0, 255, 0.5),
    }
) : ScrollFire
```

Entry and Leave callback's first argument is passed `target`.

#### e.g.

```js
fire.addTrigger(
  target,
  function (el) {
    // el -> HTMLElement | JQuery
  },
  function (el) {
    // el -> HTMLElement | JQuery
  }
);
```

#### Options

`root` : Intersection testing element, if you put `null`, the top-level document's viewport is used

`ratio` : Threshold percentage from top of testing element, must be `0-100`

`debugThresholdView` : If you put `true`, threshold line will be drawn

`debugThresholdViewColor`: Threshold line color

`debugDummyElementView` : If you put `true`, dummy intersection elements line will be drawn

`debugDummyElementViewColor`: Dummy intersection elements line color

```js
// Example
fire.addTrigger(target, entryFunction, leaveFunction, {
  root: document.getElementById("#target"),
  ratio: 20,
  debugThresholdView: true,
  debugThresholdViewColor: "#f00",
  debugDummyElementView: true,
  debugDummyElementViewColor: "#00f",
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

# Initial animations

If you put `data-scroll-fire` attribute to the elements that you want to put the animations, it will be animated automatically by depends on the following attributes settings.

[Please try to chec `Initial animations` section of Demo](https://lionheart-co-jp.github.io/ScrollFire.js/#initial-animations)

## Animation type

```html
<element data-scroll-fire="{ animation type }"></element>

<!-- Example -->
<div data-scroll-fire="fade-up"></div>
```

<details>
<summary>Suppoprting animation type</summary>

- fade
  - fade
  - fade-up
  - fade-down
  - fade-left
  - fade-right
  - fade-up-left
  - fade-up-right
  - fade-down-left
  - fade-down-right
- zoom
  - zoom-in
  - zoom-in-up
  - zoom-in-down
  - zoom-in-left
  - zoom-in-right
  - zoom-in-up-left
  - zoom-in-up-right
  - zoom-in-down-left
  - zoom-in-down-right
  - zoom-out
  - zoom-out-up
  - zoom-out-down
  - zoom-out-left
  - zoom-out-right
  - zoom-out-up-left
  - zoom-out-up-right
  - zoom-out-down-left
  - zoom-out-down-right
- slide
  - slide-up
  - slide-down
  - slide-left
  - slide-right
  - slide-up-left
  - slide-up-right
  - slide-down-left
  - slide-down-right

</details>

## Animation duration

```html
<element data-scroll-fire-duration="{ milliseconds }"></element>

<!-- Example -->
<div data-scroll-fire="fade-up" data-scroll-fire-duration="1000"></div>
```

## Animation delay

```html
<element data-scroll-fire-delay="{ milliseconds }"></element>

<!-- Example -->
<div data-scroll-fire="fade-up" data-scroll-fire-delay="1000"></div>
```

## Animation distance

Animation distance is allowed `px`, `rem` and `em`.

```html
<element data-scroll-fire-distance="{ distance }"></element>

<!-- Example -->
<div data-scroll-fire="fade-up" data-scroll-fire-distance="10rem"></div>
```

## Animation scale

Animation scale affects `zoom` animation type only.

- scale should be `0 - 1` (`0` is not scaling, `1` is 100% scaling zoom in/out)

```html
<element data-scroll-fire-scale="{ scale }"></element>

<!-- Example -->
<div data-scroll-fire="zoom-in" data-scroll-fire-scale="1"></div>
```

## Not reversing

If you don't need to reverse animation when scroll to top.

```html
<element data-scroll-fire-not-reverse></element>

<!-- Example -->
<div data-scroll-fire="fade-up" data-scroll-fire-not-reverse></div>
```

## Global settings

If you put `data-scroll-fire-***` attribute to `<body>` tag, it will affect all the page.

```html
<!-- Example -->
<body
  data-scroll-fire-delay="1000"
  data-scroll-fire-duration="1000"
  data-scroll-fire-scale="1"
  data-scroll-fire-not-reverse
>
  <div data-scroll-fire="fade-up">
    <!-- This element animation is 1000ms delay, 1000ms duration and not reverse -->
  </div>
</body>
```

and, there are some global setting attributes,

```html
<body
  data-scroll-fire-ratio="80"
  data-scroll-fire-debug-threshold-view
  data-scroll-fire-debug-dummy-element-view
></body>
```

`data-scroll-fire-ratio` : you can update `options.ratio` default value.

`data-scroll-fire-debug-threshold-view` : you can update `options.debugThresholdView` defaut value.

`data-scroll-fire-debug-dummy-element-view` : you can update `options.debugDummyElementView` default value.
