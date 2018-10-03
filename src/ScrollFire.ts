/**
 * ScrollFire
 *
 * # Sample
 * var fire = new ScrollFire();
 * fire.addTrigger(element, somethingFunction);
 * fire.start();
 */

/**
 * Polyfill of Array.prototype.filter
 */
if (!Array.prototype.filter){
    Array.prototype.filter = function(func, thisArg) {
        'use strict';
        if ( ! ((typeof func === 'Function' || typeof func === 'function') && this) )
            throw new TypeError();

        var len = this.length >>> 0,
            res = new Array(len), // preallocate array
            t = this, c = 0, i = -1;
        if (thisArg === undefined){
            while (++i !== len){
                // checks to see if the key was set
                if (i in this){
                    if (func(t[i], i, t)){
                        res[c++] = t[i];
                    }
                }
            }
        }
        else{
            while (++i !== len){
                // checks to see if the key was set
                if (i in this){
                    if (func.call(thisArg, t[i], i, t)){
                        res[c++] = t[i];
                    }
                }
            }
        }

        res.length = c; // shrink down array to proper size
        return res;
    };
}

/**
 * Polyfill of Array.prototype.includes
 * via: https://tc39.github.io/ecma262/#sec-array.prototype.includes
 */
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            // 1. Let O be ? ToObject(this value).
            var o = Object(this);
            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;
            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }
            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;
            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }
            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                // c. Increase k by 1.
                k++;
            }
            // 8. Return false
            return false;
        }
    });
}

(function() {
    /**
     * PolyFill of requestAnimationFrame
     * If requestAnimationFrame is not available, using setTimeout instead of it
     */
    var animation_frame = window.requestAnimationFrame
                    || window.webkitRequestAnimationFrame
                    || window.mozRequestAnimationFrame
                    || window.setTimeout;

    /**
     * PolyFill of cancelAnimationFrame
     * If cancelAnimationFrame is not available, using clearTimeout instead of it
     */
    var cancel_frame = window.cancelAnimationFrame
                    || window.cancelRequestAnimationFrame
                    || window.webkitCancelAnimationFrame
                    || window.webkitCancelRequestAnimationFrame
                    || window.mozCancelAnimationFrame
                    || window.mozCancelRequestAnimationFrame
                    || window.msCancelAnimationFrame
                    || window.msCancelRequestAnimationFrame
                    || window.oCancelAnimationFrame
                    || window.oCancelRequestAnimationFrame
                    || window.clearTimeout;

    class ScrollFire {
        private trigger: {target: any, callback: Function}[] = []
        private _flag: boolean = false
        private _id: number = 0

        /**
         * Starting scroll fire action
         */
        public start(): void {
            this._flag = true
            this._id = animation_frame(this.handler.bind(this))
        }

        /**
         * Stopping scroll fire action
         */
        public stop(): void {
            if (this._id) {
                this._flag = false;
                cancel_frame(this._id)
                this._id = 0
            }
        }
        /**
         * Adding scroll fire trigger
         *
         * @param jQuery Object $target
         * @param Function callback
         */
        public addTrigger(target: any, callback: Function) {
            this.trigger.push({
                target: target,
                callback: callback
            });
        }

        /**
         * Checking finished trigger and disabling it
         *
         * @param number[] indexes
         */
        private finishTrigger(indexes: number[]) {
            this.trigger =
                this.trigger.filter(function(trigger, index) {
                    return indexes.indexOf(index) < 0
                });
        }

        /**
         * Checking scroll position and firing callback
         */
        private handler(): void {
            if(this.trigger.length > 0) {
                var scrollPos = document.documentElement.scrollTop || document.body.scrollTop;
                var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

                var finishedTriggers = []

                for(var i=0; i<this.trigger.length; i += 1) {
                    var trigger = this.trigger[i];
                    var pos = this.getOffsetTop(trigger.target);

                    if((scrollPos+windowHeight/2) + 100 > pos) {
                        if(typeof trigger.callback === 'function') {
                            trigger.callback(trigger.target);
                            finishedTriggers.push(i);
                        }
                    }
                }

                this.finishTrigger(finishedTriggers);
            }

            if(this._flag) {
                this._id = animation_frame(this.handler.bind(this));
            }
        }

        /**
         * Get Element offset position of the page
         *
         * @param Element | jQuery Object element
         * via: jQuery.offset()
         */
        private getOffsetTop(element: any) {
            if(! element) {
                return 0;
            }

            // For jQuery Object
            if (element.offset && typeof element.offset === 'function') {
                return element.offset().top;
            }

            if(! element.getClientRects().length) {
                return 0;
            }

            var rect = element.getBoundingClientRect();
            var win = element.ownerDocument.defaultView;

            return rect.top + win.pageYOffset;
        }
    }

    window.ScrollFire = ScrollFire
})()
