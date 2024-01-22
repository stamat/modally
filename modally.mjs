import { 
  getScrollbarWidth, 
  disableScroll, 
  enableScroll, 
  shallowMerge, 
  parseDOM, 
  stringToType, 
  css, 
  isString, 
  detachElement, 
  isEmpty, 
  fadeIn, 
  fadeOut, 
  hashChange, 
  getHashProperties, 
  isFunction, 
  transformDashToCamelCase,
  transformCamelCaseToDash,
  serializeUrlParameters,
  pick,
  RE_VIDEO, 
  RE_YOUTUBE, 
  RE_VIMEO,
  on,
} from "book-of-spells"

export class Modal {
  constructor(id, contentElement, options = {}, modallyInstance) {
    this.id = id
    this.element = contentElement
    this.modallyInstance = modallyInstance
    this.opened = false

    // https://www.youtube.com/watch?v=gJ-WmYn_9GE
    this.videoRegEx = {};
    this.videoRegEx.YOUTUBE = RE_YOUTUBE
    this.videoRegEx.VIMEO = RE_VIMEO
    this.videoRegEx.VIDEO = RE_VIDEO
    //TODO: add support for brightcove and cloudfront. or not? 

    this.options = {
      disableScroll: true,
      landing: document.body,
      maxWidth: 'none',
      classes: '',
      verticalAlign: 'middle',
      closeParent: false,
      closeOthers: false,
      enableHashChange: true,
      closeOthersOnHashChange: false,
      updateHash: false,
      image: false,
      video: false,
      autoplay: true,
      scrollToTop: true,
      template: `
        <div class="modally-wrap">
          <div class="modally-table">
            <div class="modally-cell">
              <div class="modally-underlay modally-close"></div>
              <div class="modally" role="dialog" aria-modal="true">
                <button tabindex="1" class="modally-close modally-close-button" aria-label="Close">&times;</button>
                <div class="modally-content"></div>
              </div>
            </div>
          </div>
        </div>`,
    }

    const landing = this.options.hasOwnProperty('landing') && this.options.landing instanceof HTMLElement ? this.options.landing : document.querySelector(this.options.landing)
    if (!landing) return

    // transform camelCase to dash-case
    if (options) {
      const tempOptions = {}
      for (const k in options) {
        const key = /^[a-z0-9]+$/i.test(k) ? k : transformDashToCamelCase(k)
        tempOptions[key] = options[k]
      }
      options = tempOptions
    }

    shallowMerge(this.options, options)

    this.template = this.options.template instanceof Element || this.options.template instanceof NodeList ? this.options.template : parseDOM(this.options.template)

    if (this.element) {
      for (const k in this.options) {
        const key = /^[a-z0-9]+$/.test(k) ? k : transformCamelCaseToDash(k)
        if (this.element.hasAttribute(`modally-${key}`)) {
          this.options[k] = stringToType(this.element.getAttribute(`modally-${key}`))
        }
      }

      if (this.element.hasAttribute('id')) this.element.removeAttribute('id')
    }

    this.template.setAttribute('id', this.id)

    const modallyElement = this.template.querySelector('.modally')
    if (modallyElement) {
      css(modallyElement, {
        'maxWidth': `${this.options.maxWidth}px`
      })
    }

    const modallyCellElement = this.template.querySelector('.modally-cell')
    if (modallyCellElement) {
      css(modallyCellElement, {
        'verticalAlign': this.options.verticalAlign
      })
    }

    if (!isEmpty(this.options.classes))
      this.template.classList.add(this.options.classes)

    // Setup modal types. There are 3 types: video, image and default (no type).
    if (this.options.video) this.setupVideoLanding()
    else if (this.options.image) this.setupImageLanding()
    else {
      if (this.element) {
        const ghost = detachElement(this.element)
        this.template.querySelector('.modally-content').appendChild(ghost)
      }
    }

    if (this.element) {
      this.element.style.display = ''
      this.element.removeAttribute('hidden')
    }

    this.template.querySelectorAll('.modally-close').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault()
        this.modallyInstance.close(this, e.target)
      })
    })

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
      if (match) {
        const type = k.toLowerCase()
        return {
          type: type,
          id: type === 'video' ? link : match[1]
        }
      }
      this.videoRegEx[k].lastIndex = 0
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

  mountImage(link, width, height, srcset) {
    const img = this.template.querySelector('.modally-content img')
    if (!img) return
    img.setAttribute('src', link)
    img.style.display = 'block'
    img.removeAttribute('hidden')
    if (srcset) img.setAttribute('srcset', srcset)
    if (width) img.setAttribute('width', width)
    if (height) img.setAttribute('height', height)
  } 

  open(target, callback) {
    if (this.opened) return
    this.opened = true

    const dataset = target instanceof HTMLElement ? target.dataset : target // target can either be an element with a dataset or a dataset object itself. This way an object can be passed from the url hash variables

    if (this.options.video && dataset && dataset.hasOwnProperty('video')) {
      this.mountVideo(dataset.video)
    }

    if (this.options.image && dataset && dataset.hasOwnProperty('image')) {
      this.mountImage(dataset.image, dataset.width, dataset.height, dataset.srcset)
    }

    document.body.classList.add(`modally-${this.id}`)
    
    fadeIn(this.template, () => {
      if (isFunction(callback)) callback(this)
    }, (elem) => {
      if (this.options.scrollToTop) elem.scrollTop = 0
    })
    return true
  }

  close(target, callback) {
    if (!this.opened) return
    this.opened = false

    fadeOut(this.template, () => {
      if (this.options.video) this.unmountVideo()
      document.body.classList.remove(`modally-${this.id}`)

      if (isFunction(callback)) callback(this)

      css(this.template, {
        'zIndex': this.zIndex
      })
    })
    return true
  }

  dispatchEvents(eventName, target) {
    this.target = target

    if (this.element) this.element.dispatchEvent(new CustomEvent(`modally:${eventName}`, { detail: this }))
    this.template.dispatchEvent(new CustomEvent(`modally:${eventName}`, { detail: this }))
    document.dispatchEvent(new CustomEvent(`modally:${eventName}`, { detail: this }))
    document.dispatchEvent(new CustomEvent(`modally:${eventName}:${this.id}`, { detail: this }))
  }
}

export class Modally {
  constructor(options) {
    this.index = {}
    this.opened = []
    this.options = {
      selector: null
    }

    this.scrollbarWidth = getScrollbarWidth()

    if (options) shallowMerge(this.options, options)

    if (this.options.selector) {
      const elements = document.querySelectorAll(this.options.selector)
      elements.forEach((el) => {
        if (el.hasAttribute('id')) {
          // TODO: what if the selector is not only one class, but an attribute? Maybe we don't need to remove anything?
          const className = this.options.selector.replace('.', '')
          el.classList.remove(className)
          
          const options = { ...this.options, element: el }
          delete options.selector // TODO: use book of spells reject to remove the selector property and hash settings
          this.add(el.getAttribute('id'), options)
        }
      })
    }

    on('[target^="_modal"]', 'click', (e, target) => {
      if (!target || target.matches('[disabled]')) return
      const targetQuery = target.getAttribute('target').replace('_modal:', '')
      const targetQueryParts = targetQuery.split(':')
      const href = target.getAttribute('href')
      let id, modal
      
      if (href && href.length && href !== '#') {
        e.preventDefault()
        id = href.replace('#', '')
        modal = this.get(id)

        if (modal.options.updateHash) {
          const getAttributes = pick(target.dataset, ['image', 'video', 'width', 'height', 'srcset']) // TODO: these should be defined in the modal option, one can pass the data attributes and do simple templating in the modal
          const hash = serializeUrlParameters(getAttributes)
          window.location.hash = `#${id}${hash.length ? `&${hash}` : ''}`
        }
      }
      
      if (targetQueryParts.length > 1) {
        id = targetQueryParts[1]
        modal = this.get(id)
      }


      if (targetQueryParts[0] === 'close') return this.close(modal, target)
      if (modal) this.open(modal, target)
    })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close()
      }
    })

    // TODO: This should be a setting also for the modally instance, and there should be a setting to close all modals on hash change regardless if the modal exists or not, clear the hash on modal close. If there is a parent update the hash to the has of the parent... etc...
    this.initHashCheck()
  }

  modallyHashCheck(hash) {
    const hashProperties = getHashProperties(hash)
    
    for (const id in hashProperties) {
      if (hashProperties[id] !== undefined) continue // skip empty value hash properties
      const modal = this.get(id)
      if (!modal) continue
      if (modal.options.closeOthersOnHashChange) this.closeAll()
      if (modal.options.enableHashChange) this.open(id, hashProperties)
    }
  }

  modallyInitialHashCheck(id) {
    if (this.options.closeOthersOnHashChange) this.closeAll()
    const hashProperties = getHashProperties()
  
    if (!hashProperties.hasOwnProperty(id)) return
    const modal = this.get(id)
    if (!modal) return
    if (modal.options.closeOthersOnHashChange) this.closeAll()
    if (modal.options.enableHashChange) this.open(id, hashProperties)
  }

  add(id, options) {
    if (!id) return
    if (!options) options = {}
    const optionsClone = {...this.options}
    delete optionsClone.selector
    shallowMerge(optionsClone, options)
    options = optionsClone

    let element
    if (!options.element) {
      if (id instanceof HTMLElement) {
        element = id
        id = id.getAttribute('id')
      } else {
        element = document.getElementById(id)
      }
    } else {
      element = options.element
      delete options.element
    }
    
    if (!element && options.selector) {
      element = isString(options.selector) ? document.querySelector(options.selector) : options.selector
      delete options.selector
    }

    const modal = new Modal(id, element, options, this)
    this.index[id] = modal
    modal.dispatchEvents('added')

    if (modal.options.enableHashChange) this.modallyInitialHashCheck(id)
  }

  get(id) {
    return this.index[id]
  }

  isOpen(id) {
    return this.get(id).opened
  }

  open(id, target) {
    const modal = id instanceof Modal ? id : this.get(id)
    if (!modal) return

    if (modal.options.closeParent) this.close()
    if (modal.options.closeOthers) this.closeAll()

    if (modal.opened) return
    modal.dispatchEvents('open', target)

    if (!this.opened.length && modal.options.disableScroll) disableScroll(this.scrollbarWidth)
    if (!this.opened.length) document.body.classList.add('modally-open')

    css(modal.template, {
      'zIndex': modal.zIndex + this.opened.length
    })

    const isOpened = modal.open(target, () => {
      modal.dispatchEvents('opened', target)
    })

    if (!isOpened) return

    this.opened.push(modal)
  }

  close(id, target) {
    if (!id && this.opened.length) {
      id = this.opened[this.opened.length - 1]
    }

    const modal = id instanceof Modal ? id : this.get(id)
    if (!modal) return

    const isClosed = modal.close(target, () => {
      if (!this.opened.length && modal.options.disableScroll) enableScroll(this.scrollbarWidth)
      if (!this.opened.length) document.body.classList.remove('modally-open')

      modal.dispatchEvents('closed', target)
    })
    if (!isClosed) return

    this.opened.pop()

    modal.dispatchEvents('close', target)
  }

  closeAll() {
    [...this.opened].forEach((modal) => this.close(modal))
  }

  initHashCheck() {
    hashChange((hash) => {
      this.modallyHashCheck(hash)
    }, 'modallyHashCheckListenerInitialized')
  }
}

export default Modally
