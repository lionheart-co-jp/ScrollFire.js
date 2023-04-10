/**
 * ScrollFire
 *
 * # Sample
 * var fire = new ScrollFire();
 * fire.addTrigger(element, entryFunction, leaveFunction);
 * fire.start();
 *
 * @version 0.1.1
 */

(function() {
    function isJQuery(arg: HTMLElement | JQuery | NodeList): arg is JQuery  {
        return (arg as JQuery).each !== undefined;
    }

    function isNodeList(arg: HTMLElement | JQuery | NodeList): arg is NodeList {
        return (arg as NodeList).length !== undefined
    }

    const defaultOptions: IntersectionObserverInit = {
        root: null,
        rootMargin: "-50% 0px",
        threshold: 0,
    }

    class ScrollFire {
        private trigger: {target: HTMLElement | JQuery | NodeList, observer: IntersectionObserver}[] = []
        private _flag: boolean = false

        /**
         * Starting scroll fire action
         */
        public start(): ScrollFire {
            if (this._flag) {
                return this;
            }

            this._flag = true
            this.observe();
            return this
        }

        /**
         * Stopping scroll fire action
         */
        public stop(): ScrollFire {
            if (!this._flag) {
                return this;
            }

            this._flag = false;
            this.unobserve();
            return this
        }

        /**
         * Adding scroll fire trigger
         *
         * @param {HTMLElement | JQuery | NodeList} target
         * @param {(el: HTMLElement | JQuery) => void} enterCallback
         * @param {(el: HTMLElement | JQuery) => void} leaveCallback
         */
        public addTrigger(
            target: HTMLElement | JQuery | NodeList,
            enterCallback?: (el: HTMLElement | JQuery) => void,
            leaveCallback?: (el: HTMLElement | JQuery) => void,
            ratio: number = 50
        ): ScrollFire {
            const isJQueryTarget = isJQuery(target);
            const _options = {...defaultOptions, ...{rootMargin: `-${ratio}% 0px -${100-ratio}% 0px`}};
            const observer = new IntersectionObserver((entries) => {
                const threshold = this.getThresholdTop(ratio);
                entries.map(entry => {
                    if (entry.isIntersecting || entry.boundingClientRect.bottom <= threshold) {
                        if (enterCallback) {
                            enterCallback(isJQueryTarget ? jQuery(entry.target as HTMLElement) : entry.target as HTMLElement);
                        }
                    } else if (!entry.isIntersecting && entry.boundingClientRect.bottom > threshold) {
                        if (leaveCallback) {
                            leaveCallback(isJQueryTarget ? jQuery(entry.target as HTMLElement) : entry.target as HTMLElement);
                        }
                    }
                })
            }, _options)

            this.trigger.push({
                target,
                observer
            });

            return this
        }

        /**
         * Start observe for each trigger
         */
        private observe(): void {
            this.trigger.map(({target, observer}) => {
                if(isJQuery(target)) {
                    target.each(function () {
                        observer.observe(this)
                    })
                } else if(isNodeList(target)) {
                    (target as NodeList).forEach((el) => {
                        observer.observe(el as HTMLElement)
                    })
                } else {
                    observer.observe(target);
                }
            })
        }

        /**
         * Unobserve for each trigger
         */
        private unobserve(): void {
            this.trigger.map(({target, observer}) => {
                if(isJQuery(target)) {
                    target.each(function () {
                        observer.unobserve(this)
                    })
                } else if(isNodeList(target)) {
                    (target as NodeList).forEach((el) => {
                        observer.unobserve(el as HTMLElement)
                    })
                } else {
                    observer.unobserve(target);
                }
            })
        }

        private getThresholdTop(ratio: number): number {
            return window.innerHeight * (ratio / 100);
        }
    }

    window.ScrollFire = ScrollFire
})()
