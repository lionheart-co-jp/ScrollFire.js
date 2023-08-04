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

import "./ScrollFire.scss";

type TriggerOption = {
  root: Element | Document | null;
  ratio: number;
  debugThresholdView: boolean;
};

function isJQuery(arg: HTMLElement | JQuery | NodeList): arg is JQuery {
  return (arg as JQuery).each !== undefined;
}

function isNodeList(arg: HTMLElement | JQuery | NodeList): arg is NodeList {
  return (arg as NodeList).length !== undefined;
}

const defaultOptions: TriggerOption = {
  root: null,
  ratio: 50,
  debugThresholdView: false,
};

export default class ScrollFire {
  private trigger: {
    target: HTMLElement | JQuery | NodeList;
    observer: IntersectionObserver;
  }[] = [];
  private _flag: boolean = false;

  /**
   * Starting scroll fire action
   */
  public start(): ScrollFire {
    if (this._flag) {
      return this;
    }

    this._flag = true;
    this.observe();
    return this;
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
    return this;
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
    options: Partial<TriggerOption> = {}
  ): ScrollFire {
    const isJQueryTarget = isJQuery(target);
    const _options = { ...defaultOptions, ...options };
    const intersectionOption: IntersectionObserverInit = {
      ...{ threshold: [0, 0.5, 1] },
      ...{
        root: _options.root,
        rootMargin: `0px 0px -${100 - _options.ratio}% 0px`,
      },
    };
    const observer = new IntersectionObserver((entries) => {
      const threshold = this.getThresholdTop(_options.ratio);
      entries.map((entry) => {
        if (
          entry.isIntersecting ||
          entry.boundingClientRect.bottom <= threshold
        ) {
          if (enterCallback) {
            enterCallback(
              isJQueryTarget
                ? jQuery(entry.target as HTMLElement)
                : (entry.target as HTMLElement)
            );
          }
        } else if (
          !entry.isIntersecting &&
          entry.boundingClientRect.bottom > threshold
        ) {
          if (leaveCallback) {
            leaveCallback(
              isJQueryTarget
                ? jQuery(entry.target as HTMLElement)
                : (entry.target as HTMLElement)
            );
          }
        }
      });
    }, intersectionOption);

    this.trigger.push({
      target,
      observer,
    });

    if (_options.debugThresholdView) {
      const debugView = document.createElement("span");
      debugView.style.display = "block";
      debugView.style.position = "fixed";
      debugView.style.left = "0";
      debugView.style.right = "0";
      debugView.style.top = `${_options.ratio}%`;
      debugView.style.borderTop = "1px dashed rgba(255, 0, 0, 0.5)";
      debugView.style.pointerEvents = "none";
      document.body.appendChild(debugView);
    }

    return this;
  }

  /**
   * Start observe for each trigger
   */
  private observe(): void {
    this.trigger.map(({ target, observer }) => {
      if (isJQuery(target)) {
        target.each(function () {
          observer.observe(this);
        });
      } else if (isNodeList(target)) {
        (target as NodeList).forEach((el) => {
          observer.observe(el as HTMLElement);
        });
      } else {
        observer.observe(target);
      }
    });
  }

  /**
   * Unobserve for each trigger
   */
  private unobserve(): void {
    this.trigger.map(({ target, observer }) => {
      if (isJQuery(target)) {
        target.each(function () {
          observer.unobserve(this);
        });
      } else if (isNodeList(target)) {
        (target as NodeList).forEach((el) => {
          observer.unobserve(el as HTMLElement);
        });
      } else {
        observer.unobserve(target);
      }
    });
  }

  private getThresholdTop(ratio: number): number {
    return window.innerHeight * (ratio / 100);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll<HTMLElement>("[data-scroll-fire]").forEach((el) => {
    new ScrollFire()
      .addTrigger(
        el,
        (el) => {
          if (isJQuery(el)) {
            return el.attr("data-scroll-fire-animate", "active");
          } else {
            return (el.dataset["scrollFireAnimate"] = "active");
          }
        },
        (el) => {
          if (isJQuery(el)) {
            return el.removeAttr("data-scroll-fire-animate");
          } else {
            return delete el.dataset["scrollFireAnimate"];
          }
        }
      )
      .start();
  });
});
