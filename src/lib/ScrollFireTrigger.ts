import { TriggerOption } from "../types/TriggerOption";
import { isJQuery } from "../util/isJQuery";
import { isNodeList } from "../util/isNodeList";
import { getDataAttributeAsNumber } from "../util/getDataAttributeAsNumber";
import { v4 as uuidv4 } from "uuid";

/**
 * ScrollFireTrigger default option value
 * some options can be set by data attribute
 */
const defaultOptions: TriggerOption = {
  root: null,
  ratio: getDataAttributeAsNumber(
    document.body,
    "scrollFireRatio",
    50
  ) as number,
  debugThresholdView:
    document.body.dataset["scrollFireDebugThresholdView"] !== undefined,
  debugThresholdViewColor: "rgba(255, 0, 0, 0.5)",
  debugDummyElementView:
    document.body.dataset["scrollFireDebugDummyElementView"] !== undefined,
  debugDummyElementViewColor: "rgba(0, 0, 255, 0.5)",
};

export class ScrollFireTrigger<T extends HTMLElement | JQuery> {
  /** @var {HTMLElement | JQuery | NodeList} target Animation target Element */
  private target: HTMLElement | JQuery | NodeList;

  /** @var {HTMLElement} htmlElementList Animation target Element as HTMLElement array */
  private htmlElementList: HTMLElement[];

  /** @var {HTMLElement} rootElement Root element */
  private rootElement: HTMLElement;

  /** @var {(el: T) => void | undefined} enterCallback Callback function when the target element is inside the screen */
  private enterCallback?: (el: T) => void;

  /** @var {(el: T) => void | undefined} leaveCallback Callback function when the target element is outside the screen */
  private leaveCallback?: (el: T) => void;

  /** @var {TriggerOption} options Trigger class option */
  private options: TriggerOption;

  /** @var {IntersectionObserverInit} intersectionOption IntersectionObserver option */
  private intersectionOption: IntersectionObserverInit;

  /** @var {IntersectionObserver} intersectionObserver */
  private intersectionObserver: IntersectionObserver;

  /** @var {ResizeObserver} resizeObserver */
  private resizeObserver: ResizeObserver;

  /**
   * @param {HTMLElement | JQuery | NodeList} target
   * @param {(el: T) => void} enterCallback
   * @param {(el: T) => void} leaveCallback
   * @param {Partial<TriggerOption>} options
   */
  constructor(
    target: HTMLElement | JQuery | NodeList,
    enterCallback?: (el: T) => void,
    leaveCallback?: (el: T) => void,
    options: Partial<TriggerOption> = {}
  ) {
    this.target = target;
    this.enterCallback = enterCallback;
    this.leaveCallback = leaveCallback;
    this.options = { ...defaultOptions, ...options };
    this.rootElement = (this.options.root || document.body) as HTMLElement;
    this.intersectionOption = {
      ...{ threshold: [0, 0.5, 1] },
      ...{
        root: this.options.root,
        rootMargin: `0px 0px -${100 - this.options.ratio}% 0px`,
      },
    };

    // Get HTMLElement List
    this.htmlElementList = (() => {
      if (isJQuery(this.target)) {
        return this.target.toArray();
      } else if (isNodeList(this.target)) {
        return Array.from(this.target) as HTMLElement[];
      } else {
        return [this.target];
      }
    })();

    // Prepare dummy element for intersection observer
    this.prepareDummyElement();

    this.intersectionObserver = this.prepareIntersectionObserverInstance();
    this.resizeObserver = this.prepareResizeOvserverInstance();
    this.prepareDebugView();
  }

  /**
   * Prepare dummy element for intersection observer
   *
   * @private
   * @returns {void}
   */
  private prepareDummyElement() {
    this.htmlElementList.forEach((el) => {
      const dummyElement = this.createDummyElement(el as HTMLElement);
      this.rootElement.appendChild(dummyElement);
    });
  }

  /**
   * Create dummy element of target element
   *
   * @param {HTMLElement} target Target element
   * @returns {HTMLElement}
   */
  private createDummyElement(target: HTMLElement): HTMLElement {
    const uuid = uuidv4();
    const dummyElement = document.createElement("span");
    dummyElement.dataset.scrollFireDummy = uuid;
    target.dataset.scrollFireTarget = uuid;

    if (this.options.debugDummyElementView) {
      dummyElement.dataset.scrollFireDummyView = "is-acitve";
      dummyElement.style.borderTopColor =
        this.options.debugDummyElementViewColor;
    }

    return dummyElement;
  }

  /**
   * Reset dummy element position
   * Dummy element should be same position with target element
   * This method is called when window resize also
   *
   * @returns {void}
   */
  public resetDummyElementPosition() {
    this.htmlElementList.forEach((el) => {
      const dummyElement = this.rootElement.querySelector<HTMLElement>(
        `[data-scroll-fire-dummy="${el.dataset.scrollFireTarget}"]`
      );
      if (!dummyElement) {
        return;
      }

      dummyElement.style.top = "0px";
      const dummyPosition = this.adjustedBoundingRect(dummyElement);
      const elementPosition = this.adjustedBoundingRect(el);

      dummyElement.style.top = `${elementPosition.top - dummyPosition.top}px`;
    });
  }

  /**
   * Prepare intersection observer instance
   *
   * @private
   * @returns {IntersectionObserver}
   */
  private prepareIntersectionObserverInstance(): IntersectionObserver {
    const isJQueryTarget = isJQuery(this.target);
    return new IntersectionObserver((entries) => {
      const threshold = this.getThresholdTop(this.options.ratio);
      entries.map((entry) => {
        const dummyElement = entry.target as HTMLElement;
        const targetElement = this.rootElement.querySelector<HTMLElement>(
          `[data-scroll-fire-target="${dummyElement.dataset.scrollFireDummy}"]`
        );
        if (!targetElement) {
          return;
        }

        if (
          entry.isIntersecting ||
          entry.boundingClientRect.bottom <= threshold
        ) {
          if (typeof this.enterCallback === "function") {
            this.enterCallback(
              (isJQueryTarget ? jQuery(targetElement) : targetElement) as T
            );
          }
        } else if (
          !entry.isIntersecting &&
          entry.boundingClientRect.bottom > threshold
        ) {
          if (typeof this.leaveCallback === "function") {
            this.leaveCallback(
              (isJQueryTarget ? jQuery(targetElement) : targetElement) as T
            );
          }
        }
      });
    }, this.intersectionOption);
  }

  /**
   * Prepare resize observer instance
   *
   * @private
   * @returns {ResizeObserver}
   */
  private prepareResizeOvserverInstance(): ResizeObserver {
    return new ResizeObserver(() => {
      this.resetDummyElementPosition();
    });
  }

  /**
   * Prepare debug threshold line
   * If `debugThresholdView` option is true, debug threshold line will be shown
   *
   * @private
   * @returns {void}
   */
  private prepareDebugView(): void {
    if (!this.options.debugThresholdView) {
      return;
    }

    const debugView = document.createElement("span");
    debugView.dataset.scrollFireThresholdDemo = "is-acitve";
    debugView.style.top = `${this.options.ratio}%`;
    debugView.style.borderTopColor = this.options.debugThresholdViewColor;
    document.body.appendChild(debugView);
  }

  /**
   * Observe this trigger
   *
   * @returns {void}
   */
  public observe(): void {
    this.htmlElementList.forEach((el) => {
      const dummyElement = this.rootElement.querySelector<HTMLElement>(
        `[data-scroll-fire-dummy="${el.dataset.scrollFireTarget}"]`
      );
      if (dummyElement) {
        this.intersectionObserver.observe(dummyElement);
        this.resizeObserver.observe(dummyElement);
      }
    });
  }

  /**
   * Unobserve this trigger
   *
   * @returns {void}
   */
  public unobserve(): void {
    this.htmlElementList.forEach((el) => {
      const dummyElement = this.rootElement.querySelector<HTMLElement>(
        `[data-scroll-fire-dummy="${el.dataset.scrollFireTarget}"]`
      );
      if (dummyElement) {
        this.intersectionObserver.unobserve(el);
        this.resizeObserver.unobserve(el);
      }
    });
  }

  /**
   * Get threshold top value
   *
   * @param ratio
   * @returns {number} Threshold top
   */
  private getThresholdTop(ratio: number): number {
    return window.innerHeight * (ratio / 100);
  }

  /**
   * Get adjusted bounding rect without transform style
   * via: https://stackoverflow.com/a/57876601
   *
   * @param {HTMLElement} el
   * @returns {DOMRect}
   */
  private adjustedBoundingRect(el: HTMLElement) {
    var rect = el.getBoundingClientRect();
    var style = getComputedStyle(el);
    var tx = style.transform;

    if (tx) {
      var sx, sy, dx, dy;
      if (tx.startsWith("matrix3d(")) {
        var ta = tx.slice(9, -1).split(/, /);
        sx = +ta[0];
        sy = +ta[5];
        dx = +ta[12];
        dy = +ta[13];
      } else if (tx.startsWith("matrix(")) {
        var ta = tx.slice(7, -1).split(/, /);
        sx = +ta[0];
        sy = +ta[3];
        dx = +ta[4];
        dy = +ta[5];
      } else {
        return rect;
      }

      var to = style.transformOrigin;
      var x = rect.x - dx - (1 - sx) * parseFloat(to);
      var y =
        rect.y - dy - (1 - sy) * parseFloat(to.slice(to.indexOf(" ") + 1));
      var w = sx ? rect.width / sx : el.offsetWidth;
      var h = sy ? rect.height / sy : el.offsetHeight;
      return {
        x: x,
        y: y,
        width: w,
        height: h,
        top: y,
        right: x + w,
        bottom: y + h,
        left: x,
      };
    } else {
      return rect;
    }
  }
}
