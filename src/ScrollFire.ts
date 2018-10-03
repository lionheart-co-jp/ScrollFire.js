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
    Array.prototype.filter = function(func: Function, thisArg: any) {
        'use strict';
        if ( ! ((typeof func === 'function') && this) )
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
        private padding: number = 100

        /**
         * Starting scroll fire action
         */
        public start(): ScrollFire {
            this._flag = true
            this._id = animation_frame(this.handler.bind(this))
            return this
        }

        /**
         * Stopping scroll fire action
         */
        public stop(): ScrollFire {
            if (this._id) {
                this._flag = false;
                cancel_frame(this._id)
                this._id = 0
            }
            return this
        }
        /**
         * Adding scroll fire trigger
         *
         * @param jQuery Object $target
         * @param Function callback
         */
        public addTrigger(target: HTMLElement | JQuery, callback: Function): ScrollFire {
            this.trigger.push({
                target: target,
                callback: callback
            });

            return this
        }

        /**
         * Checking finished trigger and disabling it
         *
         * @param number[] indexes
         */
        private finishTrigger(indexes: number[]): ScrollFire {
            this.trigger =
                this.trigger.filter(function(trigger, index) {
                    return indexes.indexOf(index) < 0
                });

            return this
        }

        /**
         * Change trigger position's padding
         *
         * @param number padding
         */
        public changePadding(padding: number): ScrollFire {
            this.padding = padding

            return this
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

                    if((scrollPos+windowHeight/2) + this.padding > pos) {
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
        private getOffsetTop(element: HTMLElement | JQuery) {
            if(! element) {
                return 0;
            }

            // For jQuery Object
            if ((element as JQuery).offset && typeof (element as JQuery).offset === 'function') {
                const pos = (element as JQuery).offset()
                if(! pos) {
                    return 0
                }
                return pos.top
            }

            if(! (element as HTMLElement).getClientRects().length) {
                return 0;
            }

            var rect = (element as HTMLElement).getBoundingClientRect();
            var win = (element as HTMLElement).ownerDocument.defaultView;

            return rect.top + win.pageYOffset;
        }
    }

    window.ScrollFire = ScrollFire
})()
