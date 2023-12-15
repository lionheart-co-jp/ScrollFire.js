import type { TriggerOption } from "../types/TriggerOption";
import { ScrollFireTrigger } from "./ScrollFireTrigger";

import { customResizeEvent } from "../util/event";

export class ScrollFire {
  /** @var {ScrollFireTrigger<any>[]} trigger Added Trigger list */
  private trigger: ScrollFireTrigger<any>[] = [];

  /** @var {boolean} _flag Enabled/Disabled trigger flag */
  private _flag: boolean = false;

  /** @var {() => void} _listner Resize event listner for add/remove event listner */
  private _listner = this.onResize.bind(this);

  /**
   * Starting scroll fire action
   *
   * @returns {ScrollFire}
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
   *
   * @returns {ScrollFire}
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
   * @param {(el: T) => void} enterCallback
   * @param {(el: T) => void} leaveCallback
   * @param {Partial<TriggerOption>} options
   * @returns {ScrollFire}
   */
  public addTrigger<T extends HTMLElement | JQuery>(
    target: HTMLElement | JQuery | NodeList,
    enterCallback?: (el: T) => void,
    leaveCallback?: (el: T) => void,
    options: Partial<TriggerOption> = {}
  ): ScrollFire {
    this.trigger.push(
      new ScrollFireTrigger<T>(target, enterCallback, leaveCallback, options)
    );

    return this;
  }

  /**
   * Start observe for each trigger
   *
   * @private
   * @returns {void}
   */
  private observe(): void {
    this.trigger.forEach((trigger) => trigger.observe());

    window.addEventListener("resize", this._listner);
    window.addEventListener("load", this._listner);
    window.addEventListener("scrollFireResizeEvent", this._listner);
    this._listner();
  }

  /**
   * Unobserve for each trigger
   *
   * @private
   * @returns {void}
   */
  private unobserve(): void {
    this.trigger.forEach((trigger) => trigger.unobserve());

    window.removeEventListener("resize", this._listner);
    window.removeEventListener("load", this._listner);
    window.removeEventListener("scrollFireResizeEvent", this._listner);
  }

  /**
   * Resize event listner
   * Reset dummy element position of each trigger
   *
   * @returns {void}
   */
  public onResize() {
    this.trigger.forEach((trigger) => trigger.resetDummyElementPosition());
  }

  /**
   * Force dispatch resize event
   * This method is used for when trigger element is added dynamically
   *
   * @returns {void}
   */
  static forceResize(): void {
    window.dispatchEvent(customResizeEvent);
  }
}
