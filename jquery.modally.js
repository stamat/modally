(function ($) {
    // https://www.youtube.com/watch?v=gJ-WmYn_9GE
    window._modally_video_re = {};
    window._modally_video_re.YOUTUBE = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    window._modally_video_re.VIMEO = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;

    var Modally = function(id, elem, params) {
        var self = this;
        this.id = id;
        this.$element = $(elem);
        this.params = params;
        this.initial_z_index = null;

        if (this.params === undefined || this.params === null) {
            this.params = {};
        }

        this.$template = $('<div class="modally-wrap"><div class="modally-table"><div class="modally-cell"><div class="modally-underlay modally-close"></div><div class="modally"><div class="modally-close modally-close-button">×</div><div class="modally-content"></div></div></div></div></div>');


        var defaults = {
            'max_width': 'none',
            'vertical_align': 'middle',
            'close_parent': false,
            'close_other': false,
            'video': false,
            'autoplay': true
        };

        // TODO: escape key exit
        // TODO: maybe image lightbox - you have the old code you did for a mexican guy in 2012

        // TODO: animation open
        // TODO: animation close
        // TODO: responsive

        function __init__() {
            for (var k in defaults) {
                //load in defaults
    			if (!self.params.hasOwnProperty(k)) {
    				self.params[k] = defaults[k];
    			}

                //check for inline properties
                if (self.$element.length) {
                    var attr = self.$element.attr('modally-'+k)

                    if (attr) {
                        if (k === 'max_width' && attr !== 'none') {
                            attr = parseInt(attr, 10);
                        }

                        if (k === 'close_parent' && attr === 'false') {
                            attr = false;
                        }

                        self.params[k] = attr;
                    }
                }
    		}

            //setup
            self.$template.find('.modally').css({
                'max-width': self.params.max_width
            });

            self.$template.find('.modally-cell').css({
                'vertical-align': self.params.vertical_align
            });

            if (self.$element.length) {
                self.$element.data('modally', self);
            }
            self.$template.data('modally', self);

            if (self.params.video) {
                self.$spacer = $('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAJCAYAAAFMLZykAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAABFJREFUKBVjYBgFoyFA1RAAAAJTAAEABdnJAAAAAElFTkSuQmCC" />');
                var ymod = '';
                var vmod = '';
                if (self.params.autoplay) {
                    ymod = 'autoplay=1&amp;';
                    vmod = 'autoplay=1';
                }
                self.$embeds = $('<iframe class="youtube template" data-src="https://www.youtube.com/embed/{ID}?'+ymod+'autohide=1&amp;fs=1&amp;rel=0&amp;hd=1&amp;wmode=opaque&amp;enablejsapi=1" type="text/html" width="1920" height="1080" allow="autoplay" frameborder="0" vspace="0" hspace="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" scrolling="auto></iframe><iframe class="vimeo template" title="vimeo-player" data-src="https://player.vimeo.com/video/{ID}?'+vmod+'" type="text/html" width="1920" height="1080" allow="autoplay; allowfullscreen" rameborder="0" allowfullscreen=""></iframe>');
                self.$embeds.hide();
                self.$template.find('.modally-content').append('<div class="iframe-landing"></div>');
                self.$template.find('.iframe-landing').append(self.$spacer);
                self.$spacer.css({'width': '100%', 'display': 'block'});
                self.$template.append(self.$embeds);
                self.$template.addClass('video-embed');
            } else {
                if (self.$element.length) {
                    var ghost = self.$element.detach();
                    self.$template.find('.modally-content').append(ghost);
                }
            }

            self.$template.addClass(self.id);
            self.$template.find('.modally-close').on('click', function(){
                self.close();
            });
            $('body').append(self.$template);

            if (self.initial_z_index === null) {
                self.initial_z_index = self.$template.css('z-index');
            }

            var event_elem = self.$element.length ? self.$element : $(document);
            event_elem.trigger('modally:init', self);
            $(document).trigger('modally:init'+self.id, self);
        }
        __init__();
    };

    Modally.prototype.open = function(e, callback) {
        var $parent_modally = $(e.target).closest('.modally-wrap');
        $('body').addClass('modally-open modally-'+this.id);

        $('.modally-wrap.open').removeClass('last');
        this.$template.addClass('open last');

        if ($parent_modally.length) {
            var data = $parent_modally.data('modally');

            if (this.params.close_parent) {
                var self = this;
                data.close(e, function() {
                    self.$template.fadeIn();
                });

                if (callback) {
                    callback(this, e);
                }
                return this;
            } else {
                this.temp_parent = data;
            }
            // TODO: return to previously closed modal (there is a smart way to do it)

            this.$template.css('z-index', data.initial_z_index + 1);
        }

        if (this.params.video) {
            var link = $(e.target).data('video');
            var pts = [];
            var link_type = null;

			for (var k in window._modally_video_re) {
				var reg = window._modally_video_re[k];

				var pts_tmp = link.match(reg);

				if (pts_tmp && pts_tmp.length && pts_tmp[1] !== '') {
				 	pts = pts_tmp;
					link_type = k;
					break;
				}
			}

            if (pts && pts.length) {
                var id = pts[1];
                var $temp = this.$template.find('.template.'+link_type.toLowerCase()).clone();
                $temp.removeClass('template');
                $temp.show();
                var srctemp = $temp.data('src');
                var src = srctemp.replace('{ID}', id);
                $temp.attr('src', src);
                this.$template.find('.iframe-landing').append($temp);
            }
        }

        $('html').addClass('scroll-block');
        if (window.hasOwnProperty('iNoBounce')) {
            iNoBounce.enable();
        }

        var self = this;
        var event_elem = self.$element.length ? self.$element : $(document);
        event_elem.trigger('modally:opening', e, this);
        $(document).trigger('modally:opening:'+this.id, e, this);

        this.$template.fadeIn(function(){
            event_elem.trigger('modally:opened', e, self);
            $(document).trigger('modally:opened:'+self.id, e, self);
        });

        if (callback) {
            callback(this, e);
        }

        return this;
    };

    Modally.prototype.close = function(e, callback) {
        var self = this;
        var event_elem = self.$element.length ? self.$element : $(document);
        event_elem.trigger('modally:closing', e, this);
        $(document).trigger('modally:closing:'+this.id, e, this);

        this.$template.fadeOut(function() {
            event_elem.trigger('modally:closed', e, self);
            $(document).trigger('modally:closed:'+self.id, e, self);
        });

        $('html').removeClass('scroll-block');
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

        if (this.params.close_parent) {
            if (callback) {
                callback(this, e);
            }

            $('body').removeClass('modally-'+this.id);

            return this;
        }

        if (this.initial_z_index !== this.$template.css('z-index')) {
            this.$template.css('z-index', this.initial_z_index);
        }

        if (callback) {
            callback(this, e);
        }

        if (this.params.video) {
            this.$template.find('.iframe-landing iframe').remove();
        }

        $('body').removeClass('modally-'+this.id);

        return this;
    };

    $.fn.modally = function(id, params) {

        if (!window.hasOwnProperty('_modally_storage')) {
            window._modally_storage = {};
        }

        var $this = null;

        if (!(this instanceof Window)) {
            $this = $(this);

            if (id === undefined || id === null) {
                id = $this.attr('id');
            }
        }


        if (id === undefined || id === null || id === '') {
            console.error('jquery.modally >> in order to use this plugin you need to provide a unique ID for each modal manually or automatically throughout target element\'s ID attribute.');
            return $this;
        }

        if (window._modally_storage.hasOwnProperty(id)) {
            console.warn('jquery.modally >> modal with the provided ID: "' + id +'" already exists. Rewriting.');
        }
        window._modally_storage[id] = new Modally(id, $this, params);

		return $this;
    };

    window.modally = $.fn.modally;

    function _modallyTrigger(e, elem, action) {
        var href = $(elem).attr('href');

        if (href === undefined
            || href === null
            || href === ''
            || href === '#') {
            if (action === 'close') {
                var $parent = $(e.target).closest('.modally-wrap');
                if ($parent.length) {
                    var data = $parent.data('modally');
                    data.close();
                    return;
                }
            }

            console.error('jquery.modally >> href attribute needs to contain the existing modal ID');
            return;
        }

        if (/^#/ig.test(href) && href.length > 1) {
            href = href.replace('#', '');
        }

        if (window.hasOwnProperty('_modally_storage') && window._modally_storage.hasOwnProperty(href)) {
            window._modally_storage[href][action](e);
        } else {
            console.error('jquery.modally >> no modal by provided ID: ' + href);
        }
    }

    function _modallyTriggerOpen(e) {
        e.preventDefault();
        _modallyTrigger(e, this, 'open');
    }

    function _modallyTriggerClose(e) {
        e.preventDefault();
        _modallyTrigger(e, this, 'close');
    }

    $(document).on('click', 'a[target="_modal"]', _modallyTriggerOpen);
    $(document).on('click', 'a[target="_modal:open"]', _modallyTriggerOpen);
    $(document).on('click', 'a[target="_modal:close"]', _modallyTriggerClose);
})(jQuery);
