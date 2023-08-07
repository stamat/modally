![jquery.modally](https://imgur.com/4OAlRoz.png)

If there are many different variations of the same functionality, the rule says it's easy to make. And the same goes for web modal dialogues - they are super easy to make.

I created this web modal dialog library as a repo cause I wrote the same code for every project that required modals, over and over again throughout the years, just because it's trivial and I needed "5 minutes" to make it.

But regardless, **life is short - make reusable code!**

[DEMO HERE ⤻](http://stamat.github.io/jquery.modally/)

![Imgur](https://imgur.com/Zzg3FDx.png)

## Features
* **Simplest one yet** - almost everything is automatic (or at least it should be 😅)
* **HTML auto-wrapped**
* **State classes** = blurred background
* **Vertically centered**
* **Scroll blocking** 
* **Nested** - automatic detection, no need for additional coding
* **Video embeddable** - automatic Vimeo and Youtube embeds with autoplay
* **ESC closable**
* **Infinitely customizable** - go f**king wild 🎉
* **Can be used with any framework** - no dependencies, no jQuery, no nothing, but you can use it with jQuery if you want to, iife file has a jQuery plugin wrapper `$(selector).modally(options)`

## Usage

### Quick Start
```javascript
	const modally = new Modally();

	//turns your content into a modal, wraps it nicely - be sure to set it to display:none in CSS
	modally.add('your-content');
```
```html
	<div id="your-content" style="display:none;"><h1>Hello world!</h1></div>
	<a href="#your-content" target="_modal"></a>
```

### Youtube and Vimeo modals

```javascript
	const modally = new Modally();

	//creates a video modal which looks for data-video and opens a Youtube or Vimeo embed within your modal
	modally.add('your-video-modal', {video: true});
```
```html
	<a href="#your-video-modal" target="_modal" data-video="https://www.youtube.com/watch?v=u9QJo5fBADE"></a>
	<a href="#your-video-modal" target="_modal" data-video="https://vimeo.com/243244233"></a>
```

### Advanced Usage

```javascript
		const modally = new Modally();
		modally.add('advanced-example');

		document.addEventListener('modally:opening:advanced-example', function(e) {
			console.log(e.detail);
			e.detail.template.querySelector('.modally-content').innerHTML = 'Hello world!';
		});
```
```html
	<a href="#advanced-example" target="_modal"></a>
```



## Properties

Property | Default | Accepts | Description
-------- | ------- | ------- | -----------
**max-width** | 'none' | 'none' or number | Defines maximum width of the modal window, just like max-width css property
**vertical-align** | 'middle' | 'middle' or 'top' or 'bottom' | Vertical orientation of the modal window, like vertical-align css property
**close-parent** | false | boolean | Whether to close the parent modal window, parent window is automatically selected if a modal open is triggered within another modal
**close-others** | false | boolean | Wether to close all other opened modals upon opening this modal
**video** | false | boolean | For creating a video modal
**autoplay** | true | boolean | Whether video modal should autoplay
**template** | default modally template :point-down: | HTML string | Template of the modal window

```html
<div class="modally-wrap">
	<div class="modally-table">
		<div class="modally-cell">
			<div class="modally-underlay modally-close"></div>
			<div class="modally" role="dialog" aria-modal="true">
				<button tabindex="1" class="modally-close modally-close-button">&times;</button>
				<div class="modally-content"></div>
			</div>
		</div>
	</div>
</div>
```

## Events

Event | Element/s | Description
----- | --------- | -----------
**modally:init** | |
**modally:open** | |
**modally:opened** | |
**modally:close** | |
**modally:closed** | |

## //TODO:

- [x] ~~Youtube and Vimeo modals~~
- [x] ~~Close on <ESC> key~~
- [x] ~~Scrollbar fix on prevent scroll~~
- [ ] Fix scroll issue on child modal close
- [x] ~~Test events, remove multiple triggers~~
- [x] ~~Target element modal template injection~~
- [ ] CSS animations
- [ ] Accessibility W3 aria #1
- [ ] Image lightbox ability
- [ ] iframe in modal automation
- [ ] responsive properties change - needs deep extend
- [ ] Modal manager class - refactoring bulky code

## Tested with :heart:

[![BrowserStack](https://imgur.com/wfYoxvC.png)](https://www.browserstack.com/)

## License
MIT License

-------

P.S. Here is an oxymoron for you: I'm one of these people who if they have the time to make something they don't use other people's code, not to have to spend time extending it if god forbids it happens to be needed. Life's not so short now, huh?
