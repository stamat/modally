import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'

// Set up a DOM before importing the library (book-of-spells touches globals).
let Modally, getFocusableElements, defineModallyElement

before(async () => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' })
  const g = globalThis
  g.window = dom.window
  g.document = dom.window.document
  g.HTMLElement = dom.window.HTMLElement
  g.Element = dom.window.Element
  g.Node = dom.window.Node
  g.NodeList = dom.window.NodeList
  g.CustomEvent = dom.window.CustomEvent
  g.DOMParser = dom.window.DOMParser
  g.customElements = dom.window.customElements
  g.getComputedStyle = dom.window.getComputedStyle.bind(dom.window)

  const mod = await import('../modally.mjs')
  Modally = mod.default
  getFocusableElements = mod.getFocusableElements
  defineModallyElement = mod.defineModallyElement
})

test('getFocusableElements returns tabbable elements, skips disabled and [hidden]', () => {
  const box = document.createElement('div')
  box.innerHTML = `
    <button>ok</button>
    <button disabled>no</button>
    <a href="#">link</a>
    <div hidden><input value="hidden"></div>
    <span tabindex="-1">no</span>
    <input>`
  const els = getFocusableElements(box)
  const tags = els.map((e) => e.tagName.toLowerCase())
  assert.deepEqual(tags, ['button', 'a', 'input'])
})

test('trapFocus wraps Tab at the last element and Shift+Tab at the first', () => {
  const el = document.createElement('div')
  el.id = 'trap'
  el.setAttribute('hidden', '')
  el.innerHTML = '<h1>Trap</h1><a href="#">one</a><a href="#">two</a>'
  document.body.appendChild(el)

  const modally = new Modally()
  const modal = modally.add('trap')
  modal.opened = true // trapFocus is a no-op unless the modal is open

  const focusable = getFocusableElements(modal.dialog)
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  last.focus()
  let prevented = false
  modal.trapFocus({ key: 'Tab', shiftKey: false, preventDefault: () => { prevented = true } })
  assert.ok(prevented, 'Tab on the last element is prevented')
  assert.equal(document.activeElement, first, 'Tab wraps to the first element')

  first.focus()
  prevented = false
  modal.trapFocus({ key: 'Tab', shiftKey: true, preventDefault: () => { prevented = true } })
  assert.ok(prevented, 'Shift+Tab on the first element is prevented')
  assert.equal(document.activeElement, last, 'Shift+Tab wraps to the last element')
})

test('modal wires role, aria-modal and aria-labelledby to its heading', () => {
  const el = document.createElement('div')
  el.id = 'about'
  el.setAttribute('hidden', '')
  el.innerHTML = '<h1>About us</h1><p>Some description.</p>'
  document.body.appendChild(el)

  const modally = new Modally()
  const modal = modally.add('about')
  const dialog = modal.template.querySelector('.modally')

  assert.equal(dialog.getAttribute('role'), 'dialog')
  assert.equal(dialog.getAttribute('aria-modal'), 'true')
  assert.equal(dialog.getAttribute('tabindex'), '-1')

  const labelId = dialog.getAttribute('aria-labelledby')
  assert.ok(labelId, 'aria-labelledby is set')
  assert.equal(modal.template.querySelector('#' + labelId).textContent, 'About us')
  assert.ok(dialog.getAttribute('aria-describedby'), 'aria-describedby is set')
})

test('close button uses type=button and no positive tabindex', () => {
  const el = document.createElement('div')
  el.id = 'contact'
  el.setAttribute('hidden', '')
  el.innerHTML = '<h1>Contact</h1>'
  document.body.appendChild(el)

  const modally = new Modally()
  const btn = modally.add('contact').template.querySelector('.modally-close-button')
  assert.equal(btn.getAttribute('type'), 'button')
  assert.equal(btn.getAttribute('tabindex'), null)
})

test('<modally-dialog> maps attributes to options and registers the modal', () => {
  const modally = new Modally()
  defineModallyElement('modally-dialog', modally)

  const el = document.createElement('modally-dialog')
  el.id = 'promo'
  el.setAttribute('max-width', '500')
  el.innerHTML = '<h1>Promo</h1>'
  document.body.appendChild(el)
  el.register() // DOMContentLoaded already fired in jsdom; call directly

  const modal = modally.get('promo')
  assert.ok(modal, 'modal registered by the custom element')
  assert.equal(modal.options.maxWidth, 500)
})
