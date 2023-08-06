import { getScrollbarWidth, disableScroll, enableScroll, shallowMerge, parseDOM, stringToType, css, isString, detachElement, isEmpty, fadeIn, fadeOut, hashChange, getHashProperties } from "book-of-spells"

export class Modal {
  constructor(id, contentElement, options = {}, modallyInstance) {
    this.id = id
    this.element = contentElement
    this.modallyInstance = modallyInstance

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

    const landing = this.options.hasOwnProperty('landing') && this.options.landing instanceof HTMLElement ? this.options.landing : document.querySelector(this.options.landing)
    if (!landing) return

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

    if (!isEmpty(this.options.classes))
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
    }

    if (this.element) {
      this.element.style.display = ''
      this.element.removeAttribute('hidden')
    }

    this.template.querySelectorAll('.modally-close').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault()
        this.modallyInstance.close(this)
      })
    })

    //this.template.classList.add(id)
    landing.appendChild(this.template)
    
    this.zIndex = window.getComputedStyle(this.template).zIndex
  }

  setupVideoLanding() {
    const spacer = parseDOM('<svg aria-hidden="true" style="width: 100%; height: auto; display: block;" width="1920" height="1080"></svg>')

    const ymod = this.options.autoplay ? 'autoplay=1&amp;' : ''
    const vmod = this.options.autoplay ? 'autoplay=1' : ''
    const vidmod = this.options.autoplay ? ' autoplay' : ''

    const embeds = parseDOM(`
      <div hidden>
        <iframe hidden class="youtube embed-template template" data-src="https://www.youtube.com/embed/{ID}?${ymod}autohide=1&amp;fs=1&amp;rel=0&amp;hd=1&amp;wmode=opaque&amp;enablejsapi=1" type="text/html" width="1920" height="1080" allow="autoplay" frameborder="0" vspace="0" hspace="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" scrolling="auto"></iframe>
        <iframe hidden class="vimeo embed-template template" title="vimeo-player" data-src="https://player.vimeo.com/video/{ID}?${vmod}" type="text/html" width="1920" height="1080" allow="autoplay; allowfullscreen" rameborder="0" allowfullscreen=""></iframe>
        <video hidden height="1920" width="1080" class="video embed-template template" data-src="{ID}" controls playsinline${vidmod}></video>
      </div>
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

  getVideoId(link) {
    for (const k in this.videoRegEx) {
      const match = link.match(this.videoRegEx[k])
      if (match) return {
        type: k.toLowerCase(),
        id: match[1]
      }
    }
    return false
  }

  mountVideo(link) {
    const vidData = this.getVideoId(link)
      
    let template = this.template.querySelector(`.embed-template.template.${vidData.type}`)
    const landing = this.template.querySelector('.modally-content .iframe-landing')

    if (!template || !landing) return
    template = template.cloneNode(true)
    template.setAttribute('src', template.getAttribute('data-src').replace('{ID}', vidData.id))
    template.style.display = 'block'
    template.removeAttribute('hidden')
    
    landing.appendChild(template)
  }

  unmountVideo() {
    const iframe = this.template.querySelector('.modally-content iframe, .modally-content video')
    if (iframe) iframe.remove()
  }

  mountImage(link) {
    const img = this.template.querySelector('.modally-content img')
    if (!img) return
    img.setAttribute('src', link)
    img.style.display = 'block'
    img.removeAttribute('hidden')
  } 

  open(dataset) {
    if (this.options.video && dataset && dataset.hasOwnProperty('video')) {
      this.mountVideo(dataset.video)
    }

    if (this.options.image && dataset && dataset.hasOwnProperty('image')) {
      this.mountImage(dataset.image)
    }
      
    fadeIn(this.template)
  }

  close(dataset) {
    fadeOut(this.template, () => {
      if (this.options.video) this.unmountVideo()

      css(this.template, {
        'zIndex': this.zIndex
      })
    })
  }
}

export class Modally {
  constructor() {
    this.index = {}
    this.opened = []

    document.addEventListener('click', (e) => {
      const target = e.target

      if (!target.matches('[target^="_modal"]:not([disabled])')) return
      const targetQuery = target.getAttribute('target').replace('_modal:', '')
      const targetQueryParts = targetQuery.split(':')
      const href = target.getAttribute('href')
      let id, modal
      
      if (href && href.length && href !== '#') {
        e.preventDefault()
        id = href.replace('#', '')
        modal = this.get(id)
      }
      
      if (targetQueryParts.length > 1) {
        id = targetQueryParts[1]
        modal = this.get(id)
      }


      if (targetQueryParts[0] === 'close') return this.close(modal, target.dataset)
      if (modal) this.open(modal, target.dataset)
    })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close()
      }
    })
  }

  modallyHashCheck(hash) {
    const hashProperties = getHashProperties(hash)

    for (const id in hashProperties) {
      if (hashProperties[id] === undefined && this.index.hasOwnProperty(id)) {
        this.open(id, hashProperties)
      }
    }
  }

  add(id, options) {
    let element = document.getElementById(id)
    if (!options) options = {}
    if (!element && options.selector) element = isString(options.selector) ? document.querySelector(options.selector) : options.selector

    this.index[id] = new Modal(id, element, options, this)
  }

  get(id) {
    return this.index[id]
  }

  open(id, dataset) {
    const modal = id instanceof Modal ? id : this.get(id)
    if (!modal) return
    modal.open(dataset)
    this.opened.push(modal)
    css(modal.template, {
      'zIndex': modal.zIndex + this.opened.length
    })
  }

  close(id, dataset) {
    if (!id && this.opened.length) {
      id = this.opened[this.opened.length - 1]
    }

    const modal = id instanceof Modal ? id : this.get(id)
    if (!modal) return
    modal.close(dataset)
    this.opened.pop()
  }

  // Only after registering all modals
  initHashCheck() {
    hashChange((hash) => {
      this.modallyHashCheck(hash)
    })
  }
}

export default Modally
