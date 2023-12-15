import { ScrollFire } from "./ScrollFire";
import { getDataAttributeAsNumber } from "../util/getDataAttributeAsNumber";

/**
 * Init animations
 * [data-scroll-fire] attribute is required
 */
window.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll<HTMLElement>("[data-scroll-fire]");
  if (!targets.length) {
    return;
  }

  // Get initial options
  const defaultDelay = getDataAttributeAsNumber(
    document.body,
    "scrollFireDelay"
  );
  const defaultDuration = getDataAttributeAsNumber(
    document.body,
    "scrollFireDuration"
  );
  const defaultScale = getDataAttributeAsNumber(
    document.body,
    "scrollFireScale"
  );
  const defaultDistance = document.body.dataset["scrollFireDistance"] || null;

  // Update styles
  targets.forEach((el) => {
    const delay = getDataAttributeAsNumber(el, "scrollFireDelay", defaultDelay);
    if (delay) {
      el.style.setProperty("--scroll-fire-delay", `${delay}ms`);
    }

    const duration = getDataAttributeAsNumber(
      el,
      "scrollFireDuration",
      defaultDuration
    );
    if (duration) {
      el.style.setProperty("--scroll-fire-duration", `${duration}ms`);
    }

    const distance = el.dataset["scrollFireDistance"] || defaultDistance;
    if (distance) {
      el.style.setProperty("--scroll-fire-distance", distance);
    }

    const scale = getDataAttributeAsNumber(el, "scrollFireScale", defaultScale);
    if (scale) {
      el.style.setProperty("--scroll-fire-scale", scale.toString());
    }
  });

  // Trigger ScrollFire
  new ScrollFire()
    .addTrigger<HTMLElement>(
      targets,
      (el) => {
        if (!el) {
          return;
        }
        return (el.dataset["scrollFireAnimate"] = "active");
      },
      (el) => {
        if (
          (document.body.dataset &&
            "scrollFireNotReverse" in document.body.dataset) ||
          (!!el && "scrollFireNotReverse" in el.dataset)
        ) {
          return;
        }

        return delete el.dataset["scrollFireAnimate"];
      },
      {}
    )
    .start();
});
