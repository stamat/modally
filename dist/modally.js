/* modally v1.1.0 | undefined | MIT License */
(() => {
  // node_modules/book-of-spells/src/helpers.mjs
  function shallowMerge(target, source) {
    for (const key in source) {
      target[key] = source[key];
    }
  }
  function stringToBoolean(str) {
    if (/^\s*(true|false)\s*$/i.test(str))
      return str === "true";
  }
  function stringToNumber(str) {
    if (/^\s*\d+\s*$/.test(str))
      return parseInt(str);
    if (/^\s*[\d.]+\s*$/.test(str))
      return parseFloat(str);
  }
  function stringToArray(str) {
    if (!/^\s*\[.*\]\s*$/.test(str))
      return;
    try {
      return JSON.parse(str);
    } catch (e) {
    }
  }
  function stringToObject(str) {
    if (!/^\s*\{.*\}\s*$/.test(str))
      return;
    try {
      return JSON.parse(str);
    } catch (e) {
    }
  }
  function stringToRegex(str) {
    if (!/^\s*\/.*\/g?i?\s*$/.test(str))
      return;
    try {
      return new RegExp(str);
    } catch (e) {
    }
  }
  function stringToType(str) {
    if (/^\s*null\s*$/.test(str))
      return null;
    const bool = stringToBoolean(str);
    if (bool !== void 0)
      return bool;
    return stringToNumber(str) || stringToArray(str) || stringToObject(str) || stringToRegex(str) || str;
  }
  function isString(o) {
    return typeof o === "string";
  }
  function transformDashToCamelCase(str) {
    return str.replace(/-([a-z])/g, function(g) {
      return g[1].toUpperCase();
    });
  }

  // node_modules/book-of-spells/src/dom.mjs
  function css(element, styles, transform = false) {
    if (!element || !styles)
      return;
    for (let property in styles) {
      if (transform)
        property = transformDashToCamelCase(property);
      element.style[property] = styles[property];
    }
  }
  function detachElement(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
    return element;
  }
  function parseDOM(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.firstChild;
  }

  // node_modules/book-of-spells/src/browser.mjs
  function getScrollbarWidth() {
    const scrollDiv = document.createElement("div");
    css(scrollDiv, {
      width: "100px",
      height: "100px",
      position: "absolute",
      left: "-9999px",
      zIndex: "0",
      overflowX: "hidden",
      overflowY: "scroll"
    });
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  }

  // modally.mjs
  var Modal = class {
    constructor(id, contentElement, options = {}, modallyInstance) {
      this.id = id;
      this.element = contentElement;
      this.modallyInstance = modallyInstance;
      const landing = this.options.landing instanceof HTMLElement ? this.options.landing : document.querySelector(this.options.landing);
      if (!landing)
        return;
      this.videoRegEx = {};
      this.videoRegEx.YOUTUBE = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
      this.videoRegEx.VIMEO = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;
      this.videoRegEx.VIDEO = /(.*\/[^\/]+\.mp4|ogg|ogv|ogm|webm|avi)\s?$/i;
      this.scrollWidth = getScrollbarWidth();
      this.options = {
        "landing": "body",
        "max-width": "none",
        "classes": "",
        "vertical-align": "middle",
        "close-parent": false,
        "close-other": false,
        "image": false,
        "video": false,
        "autoplay": true,
        "template": '<div class="modally-wrap"><div class="modally-table"><div class="modally-cell"><div class="modally-underlay modally-close"></div><div class="modally" role="dialog" aria-modal="true"><button tabindex="1" class="modally-close modally-close-button">&times;</button><div class="modally-content"></div></div></div></div></div>',
        "in-duration": "normal",
        "in-easing": "swing",
        "out-duration": "normal",
        "out-easing": "swing",
        "in-css": null,
        //TODO: css animation
        "out-css": null
        //TODO: css animation
      };
      shallowMerge(this.options, options);
      if (this.element) {
        for (const k in this.options) {
          if (this.element.hasAttribute(`modally-${k}`)) {
            this.options[k] = stringToType(this.element.getAttribute(`modally-${k}`));
          }
        }
      }
      this.template = parseDOM(this.options.template);
      this.template.setAttribute("modally-id", this.id);
      this.element.setAttribute("modally-id", this.id);
      const modallyElement = this.template.querySelector(".modally");
      if (modallyElement) {
        css(modallyElement, {
          "maxWidth": this.options["max-width"]
        });
      }
      const modallyCellElement = this.template.querySelector(".modally-cell");
      if (modallyCellElement) {
        css(modallyCellElement, {
          "verticalAlign": this.options["vertical-align"]
        });
      }
      this.template.classList.add(this.options.classes);
      if (this.options.video)
        this.setupVideoLanding();
      else if (this.options.image)
        this.setupImageLanding();
      else {
        if (this.element) {
          const ghost = detachElement(this.element);
          this.template.querySelector(".modally-content").appendChild(ghost);
        }
      }
      if (this.element && this.element.classList.contains("modally-init")) {
        this.element.classList.remove("modally-init");
        this.modallyInstance.open(this);
      }
      this.template.querySelectorAll(".modally-close").forEach((el) => {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          this.modallyInstance.close(this);
        });
      });
      this.template.classList.add(id);
      landing.appendChild(this.template);
      this.zIndex = window.getComputedStyle(this.template).zIndex;
    }
    setupVideoLanding() {
      const spacer = parseDOM('<svg aria-hidden="true" style="width: 100%; height: auto; display: block;" width="1920" height="1080"></svg>');
      const ymod = this.options.autoplay ? "autoplay=1&amp;" : "";
      const vmod = this.options.autoplay ? "autoplay=1" : "";
      const vidmod = this.options.autoplay ? " autoplay" : "";
      const embeds = parseDOM(`
      <iframe hidden class="youtube embed-template template" data-src="https://www.youtube.com/embed/{ID}?${ymod}autohide=1&amp;fs=1&amp;rel=0&amp;hd=1&amp;wmode=opaque&amp;enablejsapi=1" type="text/html" width="1920" height="1080" allow="autoplay" frameborder="0" vspace="0" hspace="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" scrolling="auto"></iframe>
      <iframe hidden class="vimeo embed-template template" title="vimeo-player" data-src="https://player.vimeo.com/video/{ID}?${vmod}" type="text/html" width="1920" height="1080" allow="autoplay; allowfullscreen" rameborder="0" allowfullscreen=""></iframe>
      <video hidden height="1920" width="1080" class="video embed-template template" data-src="{ID}" controls playsinline${vidmod}></video>
    `);
      const landing = parseDOM('<div class="iframe-landing"></div>');
      landing.appendChild(spacer);
      this.template.querySelector(".modally-content").appendChild(landing);
      this.template.appendChild(embeds);
      this.template.classList.add("video-embed");
    }
    setupImageLanding() {
      const spacer = parseDOM('<div class="image-landing"><img style="width: 100%; height: auto;" decoding="async" loading="lazy" alt=""></div>');
      this.template.querySelector(".modally-content").appendChild(spacer);
      this.template.classList.add("image-embed");
    }
    open(callback) {
    }
  };
  var Modally = class {
    constructor() {
      this.index = {};
      this.opened = [];
      document.addEventListener("click", (e) => {
        const target = e.target;
        if (!target.matches('[target="_modal"]:not([disabled]), [target="_modal:open"]:not([disabled]), [target="_modal:close"]:not([disabled])'))
          return;
        const href = target.getAttribute("href");
        if (href && href.length && href !== "#") {
          const modal = this.get(href.replace("#", ""));
          if (modal) {
            e.preventDefault();
            if (target.matches('[target="_modal:close"]'))
              return this.close(modal);
            this.open(modal);
          }
        }
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.close();
        }
      });
    }
    modallyHashCheck() {
      if (window.location.hash !== "" && window.location.hash !== "#") {
        const href = window.location.hash.replace("#", "");
        if (this.index.hasOwnProperty(href)) {
          this.open(href);
        }
      }
    }
    add(id, selector, options = {}) {
      const element = isString(selector) ? document.querySelector(selector) : selector;
      if (!element) {
        console.error(`Modally: Element with selector "${selector}" not found`);
        return;
      }
      this.index[id] = new Modal(id, element, options, this);
    }
    get(id) {
      return this.index[id];
    }
    open(id, callback) {
      const modal = id instanceof Modal ? id : this.get(id);
      if (!modal)
        return;
      modal.open(callback);
      this.opened.push(modal);
      css(modal.template, {
        "zIndex": modal.zIndex + this.opened.length
      });
    }
    close(id, callback) {
      if (!id && this.opened.length) {
        id = this.opened[this.opened.length - 1];
      }
      const modal = id instanceof Modal ? id : this.get(id);
      if (!modal)
        return;
      modal.close(callback);
      this.opened.pop();
      css(modal.template, {
        "zIndex": modal.zIndex
      });
    }
    // Only after registering all modals
    initHashCheck() {
      this.modallyHashCheck();
      window.addEventListener("hashchange", () => {
        this.modallyHashCheck();
      });
    }
  };
  var modally_default = Modally;

  // build/iife.js
  if (!window.Modally) {
    window.Modally = modally_default;
  }
})();
//# sourceMappingURL=modally.js.map
