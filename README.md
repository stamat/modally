![jquery.modally](https://imgur.com/4OAlRoz.png)

If there are many different variations of the same functionality, the rule says it's easy to make. And the same goes for jQuery modal plugins - they are super easy to make.

I created this plugin as a repo cause I wrote the same code for every project that required modals, over and over again throughout the years, just because it's trivial and I needed 5 minutes to make it.

But regardless, **life is short - make reusable code!**

[DEMO HERE ⤻](http://stamat.github.io/jquery.modally/)

![Imgur](https://imgur.com/Zzg3FDx.png)

## Features
* **Simplest one yet** - almost everything is automatic
* **HTML auto-wrapped**
* **State classes** = blurred background
* **Vertically centered**
* **Scroll blocking** - even on iOS
* **Nested** - automatic detection, no need for additional coding
* **Video embeddable** - automatic Vimeo and Youtube embeds with autoplay
* **ESC closable**
* **Infinitely customizable** - go f**king wild 🎉

## Usage

### Quick Start
```javascript
	//turns your content into a modal, wraps it nicely - be sure to set it to display:none in CSS
	$('#your-content').modally();
```
```html
	<div id="your-content" style="display:none;"><h1>Hello world!</h1></div>
	<a href="#your-content" target="_modal"></a>
```

### Youtube and Vimeo modals

```javascript
	//creates a video modal which looks for data-video and opens a Youtube or Vimeo embed within your modal
	modally('your-video-modal', {video: true});
```
```html
	<a href="#your-video-modal" target="_modal" data-video="https://www.youtube.com/watch?v=u9QJo5fBADE"></a>
	<a href="#your-video-modal" target="_modal" data-video="https://vimeo.com/243244233"></a>
```

### Advanced Usage

```javascript
		modally('advanced-example');
		$(document).on('modally:opening:advanced-example', function(ev, e, modally) {
			modally.$template.find('.modally-content').empty();

			/* GENERATE YOUR CONTENT */

			modally.$template.find('.modally-content').append(/* APPEND YOUR CONTENT */);
		});
```
```html
	<a href="#advanced-example" target="_modal"></a>
```

### Third party integration
Modally automatically integrates with [iNoBounce](https://github.com/lazd/iNoBounce), if it is available, to prevent scrolling on Safari iOS



## Properties

Property | Default | Accepts | Description
-------- | ------- | ------- | -----------
**max_width** | 'none' | 'none' or number | Defines maximum width of the modal window, just like max-width css property
**vertical_align** | 'middle' | 'middle' or 'top' or 'bottom' | Vertical orientation of the modal window, like vertical-align css property
**close_parent** | false | boolean | Whether to close the parent modal window, parent window is automatically selected if a modal open is triggered within another modal
**close_other** | false | boolean | Wether to close all other opened modals upon opening this modal
**video** | false | boolean | For creating a video modal
**autoplay** | true | boolean | Whether video modal should autoplay
**in_duration** | 'normal' | 'slow', 'normal', 'fast' or number of milliseconds | Speed of fade in, uses jQuery.fadeIn
**in_easing** | 'swing' | string | Easing of fade in, uses jQuery.fadeIn
**out_duration** | 'normal' | 'slow', 'normal', 'fast' or number of milliseconds | Speed of fade out, uses jQuery.fadeOut
**out_easing** | 'swing' | string | Easing of fade in, uses jQuery.fadeOut

## Events

Event | Element/s | Description
----- | --------- | -----------
**modally:init** | |
**modally:opening** | |
**modally:opened** | |
**modally:closing** | |
**modally:closed** | |

## //TODO:

- [x] --Youtube and Vimeo modals--
- [x] --Close on <ESC> key--
- [x] --Scrollbar fix on prevent scroll--
- [ ] Test events, remove multiple triggers
- [ ] Target element modal template injection
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
