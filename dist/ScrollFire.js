"use strict";
/**
 * ScrollFire
 *
 * # Sample
 * var fire = new ScrollFire();
 * fire.addTrigger(element, entryFunction, leaveFunction);
 * fire.start();
 *
 * @version 0.1.2
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
(function () {
    function isJQuery(arg) {
        return arg.each !== undefined;
    }
    function isNodeList(arg) {
        return arg.length !== undefined;
    }
    var defaultOptions = {
        root: null,
        ratio: 50,
        debugThresholdView: false,
    };
    var ScrollFire = /** @class */ (function () {
        function ScrollFire() {
            this.trigger = [];
            this._flag = false;
        }
        /**
         * Starting scroll fire action
         */
        ScrollFire.prototype.start = function () {
            if (this._flag) {
                return this;
            }
            this._flag = true;
            this.observe();
            return this;
        };
        /**
         * Stopping scroll fire action
         */
        ScrollFire.prototype.stop = function () {
            if (!this._flag) {
                return this;
            }
            this._flag = false;
            this.unobserve();
            return this;
        };
        /**
         * Adding scroll fire trigger
         *
         * @param {HTMLElement | JQuery | NodeList} target
         * @param {(el: HTMLElement | JQuery) => void} enterCallback
         * @param {(el: HTMLElement | JQuery) => void} leaveCallback
         */
        ScrollFire.prototype.addTrigger = function (target, enterCallback, leaveCallback, options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            var isJQueryTarget = isJQuery(target);
            var _options = __assign(__assign({}, defaultOptions), options);
            var intersectionOption = __assign({ threshold: [0, 0.5, 1] }, { root: _options.root, rootMargin: "0px 0px -".concat(100 - _options.ratio, "% 0px") });
            var observer = new IntersectionObserver(function (entries) {
                var threshold = _this.getThresholdTop(_options.ratio);
                entries.map(function (entry) {
                    if (entry.isIntersecting || entry.boundingClientRect.bottom <= threshold) {
                        if (enterCallback) {
                            enterCallback(isJQueryTarget ? jQuery(entry.target) : entry.target);
                        }
                    }
                    else if (!entry.isIntersecting && entry.boundingClientRect.bottom > threshold) {
                        if (leaveCallback) {
                            leaveCallback(isJQueryTarget ? jQuery(entry.target) : entry.target);
                        }
                    }
                });
            }, intersectionOption);
            this.trigger.push({
                target: target,
                observer: observer
            });
            if (_options.debugThresholdView) {
                var debugView = document.createElement('span');
                debugView.style.display = 'block';
                debugView.style.position = 'fixed';
                debugView.style.left = '0';
                debugView.style.right = '0';
                debugView.style.top = "".concat(_options.ratio, "%");
                debugView.style.borderTop = '1px dashed rgba(255, 0, 0, 0.5)';
                debugView.style.pointerEvents = 'none';
                document.body.appendChild(debugView);
            }
            return this;
        };
        /**
         * Start observe for each trigger
         */
        ScrollFire.prototype.observe = function () {
            this.trigger.map(function (_a) {
                var target = _a.target, observer = _a.observer;
                if (isJQuery(target)) {
                    target.each(function () {
                        observer.observe(this);
                    });
                }
                else if (isNodeList(target)) {
                    target.forEach(function (el) {
                        observer.observe(el);
                    });
                }
                else {
                    observer.observe(target);
                }
            });
        };
        /**
         * Unobserve for each trigger
         */
        ScrollFire.prototype.unobserve = function () {
            this.trigger.map(function (_a) {
                var target = _a.target, observer = _a.observer;
                if (isJQuery(target)) {
                    target.each(function () {
                        observer.unobserve(this);
                    });
                }
                else if (isNodeList(target)) {
                    target.forEach(function (el) {
                        observer.unobserve(el);
                    });
                }
                else {
                    observer.unobserve(target);
                }
            });
        };
        ScrollFire.prototype.getThresholdTop = function (ratio) {
            return window.innerHeight * (ratio / 100);
        };
        return ScrollFire;
    }());
    window.ScrollFire = ScrollFire;
})();
