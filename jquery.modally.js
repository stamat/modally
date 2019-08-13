(function ($) {
    // https://www.youtube.com/watch?v=gJ-WmYn_9GE

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
        };

        // TODO: events pre open, post open, pre close, post close

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

            //setup
            self.$template.find('.modally').css({
                'max-width': self.params.max_width
            });

            self.$template.find('.modally-cell').css({
                'vertical-align': self.params.vertical_align
            });

            self.$element.data('modally', self);
            self.$template.data('modally', self);

            var ghost = self.$element.detach();
            self.$template.find('.modally-content').append(ghost);
            self.$template.addClass(self.id);
            self.$template.find('.modally-close').on('click', function(){
                self.close();
            });
            $('body').append(self.$template);

            if (self.initial_z_index === null) {
                self.initial_z_index = self.$template.css('z-index');
            }
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

        this.$template.fadeIn();

        if (callback) {
            callback(this, e);
        }

        return this;
    };

    Modally.prototype.close = function(e, callback) {
        this.$template.fadeOut();
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

        $('body').removeClass('modally-'+this.id);

        return this;
    };

    $.fn.modally = function(id, params) {

        if (!window.hasOwnProperty('_modally_storage')) {
            window._modally_storage = {};
        }

		var $this = $(this);

        if (id === undefined || id === null) {
            id = $this.attr('id');
        }

        if (id === undefined || id === null || id === '') {
            console.error('jquery.modally >> in order to use this plugin you need to provide a unique ID for each modal manually or automatically throughout target element\'s ID attribute.');
            return $this;
        }

        if (!window._modally_storage.hasOwnProperty(id)) {
            window._modally_storage[id] = new Modally(id, $this, params);
        } else {
            console.warn('jquery.modally >> modal with the provided ID: "' + id +'" already exists. Rewriting.');
        }

		return $this;
    };

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
