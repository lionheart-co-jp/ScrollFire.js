var p = Object.defineProperty;
var b = (i, e, t) => e in i ? p(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var a = (i, e, t) => (b(i, typeof e != "symbol" ? e + "" : e, t), t);
function l(i) {
  return i.each !== void 0;
}
function u(i) {
  return i.length !== void 0;
}
const m = {
  root: null,
  ratio: 50,
  debugThresholdView: !1
};
class v {
  constructor() {
    a(this, "trigger", []);
    a(this, "_flag", !1);
  }
  /**
   * Starting scroll fire action
   */
  start() {
    return this._flag ? this : (this._flag = !0, this.observe(), this);
  }
  /**
   * Stopping scroll fire action
   */
  stop() {
    return this._flag ? (this._flag = !1, this.unobserve(), this) : this;
  }
  /**
   * Adding scroll fire trigger
   *
   * @param {HTMLElement | JQuery | NodeList} target
   * @param {(el: HTMLElement | JQuery) => void} enterCallback
   * @param {(el: HTMLElement | JQuery) => void} leaveCallback
   */
  addTrigger(e, t, o, c = {}) {
    const d = l(e), n = { ...m, ...c }, f = {
      threshold: [0, 0.5, 1],
      root: n.root,
      rootMargin: `0px 0px -${100 - n.ratio}% 0px`
    }, g = new IntersectionObserver((s) => {
      const h = this.getThresholdTop(n.ratio);
      s.map((r) => {
        r.isIntersecting || r.boundingClientRect.bottom <= h ? t && t(
          d ? jQuery(r.target) : r.target
        ) : !r.isIntersecting && r.boundingClientRect.bottom > h && o && o(
          d ? jQuery(r.target) : r.target
        );
      });
    }, f);
    if (this.trigger.push({
      target: e,
      observer: g
    }), n.debugThresholdView) {
      const s = document.createElement("span");
      s.style.display = "block", s.style.position = "fixed", s.style.left = "0", s.style.right = "0", s.style.top = `${n.ratio}%`, s.style.borderTop = "1px dashed rgba(255, 0, 0, 0.5)", s.style.pointerEvents = "none", document.body.appendChild(s);
    }
    return this;
  }
  /**
   * Start observe for each trigger
   */
  observe() {
    this.trigger.map(({ target: e, observer: t }) => {
      l(e) ? e.each(function() {
        t.observe(this);
      }) : u(e) ? e.forEach((o) => {
        t.observe(o);
      }) : t.observe(e);
    });
  }
  /**
   * Unobserve for each trigger
   */
  unobserve() {
    this.trigger.map(({ target: e, observer: t }) => {
      l(e) ? e.each(function() {
        t.unobserve(this);
      }) : u(e) ? e.forEach((o) => {
        t.unobserve(o);
      }) : t.unobserve(e);
    });
  }
  getThresholdTop(e) {
    return window.innerHeight * (e / 100);
  }
}
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-scroll-fire]").forEach((i) => {
    new v().addTrigger(
      i,
      (e) => l(e) ? e.attr("data-scroll-fire-animate", "active") : e.dataset.scrollFireAnimate = "active",
      (e) => l(e) ? e.removeAttr("data-scroll-fire-animate") : delete e.dataset.scrollFireAnimate
    ).start();
  });
});
export {
  v as default
};
