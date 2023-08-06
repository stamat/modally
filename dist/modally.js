/* modally v1.1.0 | undefined | MIT License */
(() => {
  // node_modules/book-of-spells/src/helpers.mjs
  function shallowMerge(target, source) {
    for (const key in source) {
      target[key] = source[key];
    }
  }
  function isEmptyObject(o) {
    for (const i in o) {
      return false;
    }
    return true;
  }
  function isEmptyArray(o) {
    return o.length === 0;
  }
  function isEmpty(o) {
    if (isObject(o)) {
      return isEmptyObject(o);
    } else if (isArray(o)) {
      return isEmptyArray(o);
    } else if (isString(o)) {
      return o === "";
    }
    return false;
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
  function isObject(o) {
    return typeof o === "object" && !Array.isArray(o) && o !== null;
  }
  function isArray(o) {
    return Array.isArray(o);
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

  // ../book-of-spells/src/helpers.mjs
  function isEmptyObject2(o) {
    for (const i in o) {
      return false;
    }
    return true;
  }
  function isEmptyArray2(o) {
    return o.length === 0;
  }
  function isEmpty2(o) {
    if (isObject2(o)) {
      return isEmptyObject2(o);
    } else if (isArray2(o)) {
      return isEmptyArray2(o);
    } else if (isString2(o)) {
      return o === "";
    }
    return false;
  }
  function stringToBoolean2(str) {
    if (/^\s*(true|false)\s*$/i.test(str))
      return str === "true";
  }
  function stringToNumber2(str) {
    if (/^\s*\d+\s*$/.test(str))
      return parseInt(str);
    if (/^\s*[\d.]+\s*$/.test(str))
      return parseFloat(str);
  }
  function stringToArray2(str) {
    if (!/^\s*\[.*\]\s*$/.test(str))
      return;
    try {
      return JSON.parse(str);
    } catch (e) {
    }
  }
  function stringToObject2(str) {
    if (!/^\s*\{.*\}\s*$/.test(str))
      return;
    try {
      return JSON.parse(str);
    } catch (e) {
    }
  }
  function stringToRegex2(str) {
    if (!/^\s*\/.*\/g?i?\s*$/.test(str))
      return;
    try {
      return new RegExp(str);
    } catch (e) {
    }
  }
  function stringToType2(str) {
    if (/^\s*null\s*$/.test(str))
      return null;
    const bool = stringToBoolean2(str);
    if (bool !== void 0)
      return bool;
    return stringToNumber2(str) || stringToArray2(str) || stringToObject2(str) || stringToRegex2(str) || str;
  }
  function isObject2(o) {
    return typeof o === "object" && !Array.isArray(o) && o !== null;
  }
  function isArray2(o) {
    return Array.isArray(o);
  }
  function isString2(o) {
    return typeof o === "string";
  }
  function isFunction2(o) {
    return typeof o === "function";
  }

  // ../book-of-spells/src/dom.mjs
  function cssTimeToMilliseconds(duration) {
    const regExp = new RegExp("([0-9.]+)([a-z]+)", "i");
    const matches = regExp.exec(duration);
    if (!matches)
      return 0;
    const unit = matches[2];
    switch (unit) {
      case "ms":
        return parseFloat(matches[1]);
      case "s":
        return parseFloat(matches[1]) * 1e3;
      default:
        return 0;
    }
  }
  function getTransitionDurations2(element) {
    if (!element) {
    }
    const styles = getComputedStyle(element);
    const transitionProperties = styles.getPropertyValue("transition-property").split(",");
    const transitionDurations = styles.getPropertyValue("transition-duration").split(",");
    const map = {};
    for (let i = 0; i < transitionProperties.length; i++) {
      const property = transitionProperties[i].trim();
      map[property] = transitionDurations.hasOwnProperty(i) ? cssTimeToMilliseconds(transitionDurations[i].trim()) : null;
    }
    return map;
  }

  // ../book-of-spells/src/parsers.mjs
  function parseUrlParameters(paramString, decode = true) {
    const res = {};
    const paramParts = paramString.split("&");
    paramParts.forEach((part) => {
      const m = part.match(/([^\s=&]+)=?([^&\s]+)?/);
      const key = m[1];
      const value = m[2];
      res[key] = value !== void 0 && decode ? stringToType2(decodeURIComponent(value)) : value;
    });
    return res;
  }

  // ../book-of-spells/src/browser.mjs
  function getHashProperties(entryHash) {
    const hash = entryHash ? entryHash : window.location.hash.replace("#", "");
    if (isEmpty2(hash))
      return {};
    return parseUrlParameters(hash);
  }
  function onHashChange(callback) {
    const hash = window.location.hash.replace("#", "");
    if (!isEmpty2(hash))
      callback(hash);
  }
  function hashChange(callback) {
    onHashChange(callback);
    window.addEventListener("hashchange", () => {
      onHashChange(callback);
    });
  }

  // ../book-of-spells/src/animations.mjs
  function clearTransitionTimer(element, property = "all") {
    if (!element)
      return;
    const dataPropName = `${property}TransitionTimer`;
    if (!element.dataset[dataPropName])
      return;
    clearTimeout(parseInt(element.dataset[dataPropName]));
    delete element.dataset[dataPropName];
  }
  function setTransitionTimer(element, property = "all", timeout, callback) {
    if (!element)
      return;
    const dataPropName = `${property}TransitionTimer`;
    const timer = setTimeout(() => {
      clearTransitionTimer(element, property);
      if (isFunction2(callback))
        callback(element);
    }, timeout);
    element.dataset[dataPropName] = timer.toString();
    return timer;
  }
  function setTransitionDuration(element, property = "all") {
    if (!element)
      return;
    const dataPropName = `${property}TransitionDuration`;
    if (element.dataset[dataPropName])
      return parseInt(element.dataset[dataPropName]);
    const transitionDurations = getTransitionDurations2(element);
    if (!transitionDurations.hasOwnProperty(property))
      return;
    element.dataset[dataPropName] = transitionDurations[property].toString();
    return transitionDurations[property];
  }
  function fadeIn(element, callback) {
    if (!element)
      return;
    clearTransitionTimer(element, "opacity");
    const styles = getComputedStyle(element);
    const duration = setTransitionDuration(element, "opacity");
    let oldOpacity = parseInt(styles.opacity);
    if (isNaN(oldOpacity))
      oldOpacity = 0;
    if (element.hasAttribute("hidden"))
      element.removeAttribute("hidden");
    element.style.pointerEvents = "none";
    if (!oldOpacity)
      element.style.visibility = "hidden";
    element.style.display = "block";
    element.style.opacity = oldOpacity ? oldOpacity : 0;
    setTimeout(() => {
      element.style.opacity = 1;
      element.style.visibility = "visible";
      element.style.removeProperty("pointer-events");
    }, 10);
    setTransitionTimer(element, "opacity", duration, (element2) => {
      if (isFunction2(callback))
        callback(element2);
    });
  }
  function fadeOut(element, callback) {
    if (!element)
      return;
    clearTransitionTimer(element, "opacity");
    const styles = getComputedStyle(element);
    const duration = setTransitionDuration(element, "opacity");
    element.style.opacity = styles.opacity;
    setTimeout(() => {
      element.style.opacity = 0;
    }, 10);
    setTransitionTimer(element, "opacity", duration, (element2) => {
      element2.style.display = "none";
      element2.style.opacity = "";
      if (isFunction2(callback))
        callback(element2);
    });
  }

  // modally.mjs
  var Modal = class {
    constructor(id, contentElement, options = {}, modallyInstance) {
      this.id = id;
      this.element = contentElement;
      this.modallyInstance = modallyInstance;
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
      const landing = this.options.hasOwnProperty("landing") && this.options.landing instanceof HTMLElement ? this.options.landing : document.querySelector(this.options.landing);
      if (!landing)
        return;
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
      if (!isEmpty(this.options.classes))
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
      }
      if (this.element) {
        this.element.style.display = "";
        this.element.removeAttribute("hidden");
      }
      this.template.querySelectorAll(".modally-close").forEach((el) => {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          this.modallyInstance.close(this);
        });
      });
      landing.appendChild(this.template);
      this.zIndex = window.getComputedStyle(this.template).zIndex;
    }
    setupVideoLanding() {
      const spacer = parseDOM('<svg aria-hidden="true" style="width: 100%; height: auto; display: block;" width="1920" height="1080"></svg>');
      const ymod = this.options.autoplay ? "autoplay=1&amp;" : "";
      const vmod = this.options.autoplay ? "autoplay=1" : "";
      const vidmod = this.options.autoplay ? " autoplay" : "";
      const embeds = parseDOM(`
      <div hidden>
        <iframe hidden class="youtube embed-template template" data-src="https://www.youtube.com/embed/{ID}?${ymod}autohide=1&amp;fs=1&amp;rel=0&amp;hd=1&amp;wmode=opaque&amp;enablejsapi=1" type="text/html" width="1920" height="1080" allow="autoplay" frameborder="0" vspace="0" hspace="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" scrolling="auto"></iframe>
        <iframe hidden class="vimeo embed-template template" title="vimeo-player" data-src="https://player.vimeo.com/video/{ID}?${vmod}" type="text/html" width="1920" height="1080" allow="autoplay; allowfullscreen" rameborder="0" allowfullscreen=""></iframe>
        <video hidden height="1920" width="1080" class="video embed-template template" data-src="{ID}" controls playsinline${vidmod}></video>
      </div>
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
    getVideoId(link) {
      for (const k in this.videoRegEx) {
        const match = link.match(this.videoRegEx[k]);
        if (match)
          return {
            type: k.toLowerCase(),
            id: match[1]
          };
      }
      return false;
    }
    mountVideo(link) {
      const vidData = this.getVideoId(link);
      let template = this.template.querySelector(`.embed-template.template.${vidData.type}`);
      const landing = this.template.querySelector(".modally-content .iframe-landing");
      if (!template || !landing)
        return;
      template = template.cloneNode(true);
      template.setAttribute("src", template.getAttribute("data-src").replace("{ID}", vidData.id));
      template.style.display = "block";
      template.removeAttribute("hidden");
      landing.appendChild(template);
    }
    unmountVideo() {
      const iframe = this.template.querySelector(".modally-content iframe, .modally-content video");
      if (iframe)
        iframe.remove();
    }
    mountImage(link) {
      const img = this.template.querySelector(".modally-content img");
      if (!img)
        return;
      img.setAttribute("src", link);
      img.style.display = "block";
      img.removeAttribute("hidden");
    }
    open(dataset, callback) {
      if (this.options.video && dataset && dataset.hasOwnProperty("video")) {
        this.mountVideo(dataset.video);
      }
      if (this.options.image && dataset && dataset.hasOwnProperty("image")) {
        this.mountImage(dataset.image);
      }
      fadeIn(this.template, callback);
    }
    close(dataset, callback) {
      fadeOut(this.template, () => {
        if (this.options.video)
          this.unmountVideo();
        if (callback)
          callback();
        css(this.template, {
          "zIndex": this.zIndex
        });
      });
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
              return this.close(modal, target.dataset);
            this.open(modal, target.dataset);
          }
        }
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.close();
        }
      });
    }
    modallyHashCheck(hash) {
      const hashProperties = getHashProperties(hash);
      for (const id in hashProperties) {
        if (hashProperties[id] === void 0 && this.index.hasOwnProperty(id)) {
          this.open(id, hashProperties);
        }
      }
    }
    add(id, options) {
      let element = document.getElementById(id);
      if (!options)
        options = {};
      if (!element && options.selector)
        element = isString(options.selector) ? document.querySelector(options.selector) : options.selector;
      this.index[id] = new Modal(id, element, options, this);
    }
    get(id) {
      return this.index[id];
    }
    open(id, dataset, callback) {
      const modal = id instanceof Modal ? id : this.get(id);
      if (!modal)
        return;
      modal.open(dataset, callback);
      this.opened.push(modal);
      css(modal.template, {
        "zIndex": modal.zIndex + this.opened.length
      });
    }
    close(id, dataset, callback) {
      if (!id && this.opened.length) {
        id = this.opened[this.opened.length - 1];
      }
      const modal = id instanceof Modal ? id : this.get(id);
      if (!modal)
        return;
      modal.close(dataset, callback);
      this.opened.pop();
    }
    // Only after registering all modals
    initHashCheck() {
      hashChange((hash) => {
        this.modallyHashCheck(hash);
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
