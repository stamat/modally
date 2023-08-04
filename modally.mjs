import { getScrollbarWidth, disableScroll, enableScroll, shallowMerge, parseDOM, stringToType, css, isString, detachElement } from "book-of-spells"

export class Modal {
  constructor(id, contentElement, options = {}, modallyInstance) {
    this.id = id
    this.element = contentElement
    this.modallyInstance = modallyInstance

    const landing = this.options.landing instanceof HTMLElement ? this.options.landing : document.querySelector(this.options.landing)
    if (!landing) return

    // https://www.youtube.com/watch?v=gJ-WmYn_9GE
    this.videoRegEx = {};
    this.videoRegEx.YOUTUBE = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    this.videoRegEx.VIMEO = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;
    this.videoRegEx.VIDEO = /(.*\/[^\/]+\.mp4|ogg|ogv|ogm|webm|avi)\s?$/i;
    //TODO: add support for brightcove and cloudfront
    //TODO: automatic video modal detection

    this.scrollWidth = getScrollbarWidth();

    this.options = {
      'landing': 'body',
      'max-width': 'none',
      'classes': '',
      'vertical-align': 'middle',
      'close-parent': false,
      'close-other': false,
      'image': false,
      'video': false,
      'autoplay': true,
      'template': '<div class="modally-wrap"><div class="modally-table"><div class="modally-cell"><div class="modally-underlay modally-close"></div><div class="modally" role="dialog" aria-modal="true"><button tabindex="1" class="modally-close modally-close-button">&times;</button><div class="modally-content"></div></div></div></div></div>',
      'in-duration': 'normal',
      'in-easing': 'swing',
      'out-duration': 'normal',
      'out-easing': 'swing',
      'in-css': null, //TODO: css animation
      'out-css': null //TODO: css animation
    }

    shallowMerge(this.options, options);

    if (this.element) {
      for (const k in this.options) {
        if (this.element.hasAttribute(`modally-${k}`)) {
          this.options[k] = stringToType(this.element.getAttribute(`modally-${k}`))
        }
      }
    }

    this.template = parseDOM(this.options.template)
    this.template.setAttribute('modally-id', this.id)
    this.element.setAttribute('modally-id', this.id)

    const modallyElement = this.template.querySelector('.modally')
    if (modallyElement) {
      css(modallyElement, {
        'maxWidth': this.options['max-width']
      })
    }

    const modallyCellElement = this.template.querySelector('.modally-cell')
    if (modallyCellElement) {
      css(modallyCellElement, {
        'verticalAlign': this.options['vertical-align']
      })
    }

    this.template.classList.add(this.options.classes)

    // Setup modal types

    // TODO: maybe image lightbox - you have the old code you did for a mexican guy in 2012
    // TODO: responsive triggers (needs deep extend) ???
    // TODO: iframe modal

    if (this.options.video) this.setupVideoLanding()
    else if (this.options.image) this.setupImageLanding()
    else {
      if (this.element) {
        const ghost = detachElement(this.element)
        this.template.querySelector('.modally-content').appendChild(ghost)
      }
    }

    if (this.element && this.element.classList.contains('modally-init')) {
      this.element.classList.remove('modally-init')
      this.modallyInstance.open(this)
    }

    this.template.querySelectorAll('.modally-close').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault()
        this.modallyInstance.close(this)
      })
    })

    this.template.classList.add(id)
    landing.appendChild(this.template)
    
    this.zIndex = window.getComputedStyle(this.template).zIndex
  }

  setupVideoLanding() {
    const spacer = parseDOM('<svg aria-hidden="true" style="width: 100%; height: auto; display: block;" width="1920" height="1080"></svg>')

    const ymod = this.options.autoplay ? 'autoplay=1&amp;' : ''
    const vmod = this.options.autoplay ? 'autoplay=1' : ''
    const vidmod = this.options.autoplay ? ' autoplay' : ''

    const embeds = parseDOM(`
      <iframe hidden class="youtube embed-template template" data-src="https://www.youtube.com/embed/{ID}?${ymod}autohide=1&amp;fs=1&amp;rel=0&amp;hd=1&amp;wmode=opaque&amp;enablejsapi=1" type="text/html" width="1920" height="1080" allow="autoplay" frameborder="0" vspace="0" hspace="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" scrolling="auto"></iframe>
      <iframe hidden class="vimeo embed-template template" title="vimeo-player" data-src="https://player.vimeo.com/video/{ID}?${vmod}" type="text/html" width="1920" height="1080" allow="autoplay; allowfullscreen" rameborder="0" allowfullscreen=""></iframe>
      <video hidden height="1920" width="1080" class="video embed-template template" data-src="{ID}" controls playsinline${vidmod}></video>
    `)

    const landing = parseDOM('<div class="iframe-landing"></div>')
    landing.appendChild(spacer)
    this.template.querySelector('.modally-content').appendChild(landing)
    this.template.appendChild(embeds)
    this.template.classList.add('video-embed')
  }

  setupImageLanding() {
    const spacer = parseDOM('<div class="image-landing"><img style="width: 100%; height: auto;" decoding="async" loading="lazy" alt=""></div>')
    this.template.querySelector('.modally-content').appendChild(spacer)
    this.template.classList.add('image-embed')
  }

  open(callback) {
    
  }
}

export class Modally {
  constructor() {
    this.index = {}
    this.opened = []

    document.addEventListener('click', (e) => {
      const target = e.target
      if (!target.matches('[target="_modal"]:not([disabled]), [target="_modal:open"]:not([disabled]), [target="_modal:close"]:not([disabled])')) return
      const href = target.getAttribute('href')

      if (href && href.length && href !== '#') {
        const modal = this.get(href.replace('#', ''))
        if (modal) {
          e.preventDefault()
          if (target.matches('[target="_modal:close"]')) return this.close(modal)
          this.open(modal)
        }
      }
    })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close()
      }
    })
  }

  modallyHashCheck() {
    if (window.location.hash !== ''
      && window.location.hash !== '#') {
      const href = window.location.hash.replace('#', '')

      if (this.index.hasOwnProperty(href)) {
        this.open(href)
      }
    }
  }

  add(id, selector, options = {}) {
    const element = isString(selector) ? document.querySelector(selector) : selector

    if (!element) {
      console.error(`Modally: Element with selector "${selector}" not found`)
      return
    }

    this.index[id] = new Modal(id, element, options, this)
  }

  get(id) {
    return this.index[id]
  }

  open(id, callback) {
    const modal = id instanceof Modal ? id : this.get(id)
    if (!modal) return
    modal.open(callback)
    this.opened.push(modal)
    css(modal.template, {
      'zIndex': modal.zIndex + this.opened.length
    })
  }

  close(id, callback) {
    if (!id && this.opened.length) {
      id = this.opened[this.opened.length - 1]
    }

    const modal = id instanceof Modal ? id : this.get(id)
    if (!modal) return
    modal.close(callback)
    this.opened.pop()
    css(modal.template, {
      'zIndex': modal.zIndex
    })
  }

  // Only after registering all modals
  initHashCheck() {
    this.modallyHashCheck()

    window.addEventListener('hashchange', () => {
      this.modallyHashCheck()
    })
  }
}

/**

    var Modally = function(id, elem, params) {

    };

    //XXX: This code sucks - REFACTOR
    Modally.prototype.open = function(e, callback) {
        var $parent_modally = null;

    if (e && !e.hasOwnProperty('currentTarget')) {
      e  = $(e);
    }

    if (e && e.hasOwnProperty('currentTarget')) {
      $parent_modally = $(e.currentTarget).closest('.modally-wrap');
    } else {
      $parent_modally = $(e).closest('.modally-wrap'); //XXX: ???
    }

        var self = this;
        $('body').addClass('modally-open modally-'+this.id);

        $('.modally-wrap.open').removeClass('last');
        this.$template.addClass('open last');

        function run_open(e, self) {
            if (self.params.video) {
                var link = null;

        if (e && e.hasOwnProperty('currentTarget')) {
          link = $(e.currentTarget).data('video');
        } else {
          var url_pts = /video=([^&]+)/gi.exec(window.location.hash);
          if (url_pts && url_pts.length && url_pts[1] !== '') {
            link = url_pts[1];
          }
        }

                var pts = [];
                var link_type = null;

          for (var k in window._modally_video_re) {
            var reg = window._modally_video_re[k];

            var pts_tmp = reg.exec(link);

            if (pts_tmp && pts_tmp.length && pts_tmp[1] !== '') {
               pts = pts_tmp;
              link_type = k;
              break;
            }

          reg.lastIndex = 0;
          }

                if (pts && pts.length) {
                    var id = pts[1];
                    var $temp = self.$template.find('.embed-template.template.'+link_type.toLowerCase()).clone();
                    $temp.removeClass('template');
                    $temp.show();
                    var srctemp = $temp.data('src');
                    var src = srctemp.replace('{ID}', id);
                    $temp.attr('src', src);
                    self.$template.find('.iframe-landing').append($temp);
                }
            }

            if (self.params.image) {
              link = $(e.currentTarget).data('image');
              self.$template.find('.image-landing img').attr('src', link);
            }

            $('html, .modally-wrap').disableScroll();

            if (window.hasOwnProperty('iNoBounce')) {
                iNoBounce.enable();
            }

            if (self.$element.length) {
                self.$element.trigger('modally:opening', e, self);
            }
            self.$template.trigger('modally:opening', e, self);
            $(document).trigger('modally:opening:'+self.id, [e, self]);

            self.$template.stop(true).fadeIn(self.params['in-duration'], self.params['in-easing'], function(){
                if (self.$element.length) {
                    self.$element.trigger('modally:opened', e, self);
                }
                self.$template.trigger('modally:opened', e, self);
                $(document).trigger('modally:opened:'+self.id, [e, self]);

                if (callback && typeof callback === 'function') {
                    callback();
                }
            });
        }

        if ($parent_modally.length) {
            var data = $parent_modally.data('modally');

            if (this.params.close_parent) {
                data.close(e, function() {
                    run_open(e, self);
                });
                return this;
            }

            this.temp_parent = data;
            this.$template.css('z-index', data.initial_z_index + 1);
        }

        run_open(e, this);

        return this;
    };

    Modally.prototype.close = function(e, callback) {
        var self = this;

        if (this.$element.length) {
            this.$element.trigger('modally:closing', e, this);
        }
        this.$template.trigger('modally:closing', e, this);
        $(document).trigger('modally:closing:'+this.id, [e, this]);

        this.$template.stop(true).fadeOut(self.params['out-duration'], self.params['out-easing'], function() {
            if (self.$element.length) {
                self.$element.trigger('modally:closed', e, self);
            }
            self.$template.trigger('modally:closed', e, self);
            $(document).trigger('modally:closed:'+self.id, [e, self]);

            if (callback && typeof callback === 'function') {
                callback();
            }
        });

        $('html, .modally-wrap').enableScroll();

        if (window.hasOwnProperty('iNoBounce')) {
            iNoBounce.disable();
        }
        this.$template.removeClass('open');

        if (this.$template.hasClass('last') && this.temp_parent) {
            this.temp_parent.$template.addClass('last');
            this.$template.removeClass('last');
            delete this.temp_parent;
        }

        if (!$('.modally-wrap.open').length) {
            $('.modally-wrap').removeClass('last');
            $('body').removeClass('modally-open');
        }

        if (this.params.video) {
            this.$template.find('.iframe-landing iframe, .iframe-landing video').remove();
        }

        
        //if (this.params.image) {
        //  this.$template.find('.image-landing img').removeAttr('src');
        //}

        if (this.initial_z_index !== this.$template.css('z-index')) {
            this.$template.css('z-index', this.initial_z_index);
        }


        $('body').removeClass('modally-'+this.id);

        return this;
    };
    */

    export default Modally
