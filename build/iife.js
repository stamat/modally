import Modally, { defineModallyElement } from "../modally.mjs";

if (!window.Modally) {
  window.Modally = Modally;
}

// Register the <modally-dialog> custom element for zero-JS declarative usage.
if (typeof customElements !== "undefined") {
  defineModallyElement();
}

if (window.hasOwnProperty("jQuery") || window.hasOwnProperty("$")) {
  (function ($) {
    $.fn.modally = function (options) {
      if (!window.hasOwnProperty("jQueryModally")) {
        window.jQueryModally = new Modally({
          disableScroll: true,
          selector: ".modally-init",
        });
      }
      
      return this.each(function () {
        options.element = this;
        window.jQueryModally.add(this, options);
      });
    }
  })(jQuery || $);
}
