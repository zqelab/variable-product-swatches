/******/ (() => { // webpackBootstrap
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************!*\
  !*** ./public/src/main.js ***!
  \****************************/
(function($, window, document, undefined) {
    'use strict';
    function VPSPlugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, {}, options);
        this.$element = $(element);
        this.$element.addClass('variable-product-swatches-loaded');
        this.product_variations = this.$element.data('product_variations') || [];
        this.is_ajax_variation = this.product_variations.length > 0;


        this.wrapper = this.$element.closest('.type-product');
        this.attributeFields = this.$element.find('.variations select');
        this.cart_button = this.$element.find('.vps_add_to_cart_button');
        this.cart_button_ajax = this.$element.find('.vps_ajax_add_to_cart');
        this.is_archive = this.$element.hasClass('vps_archive_variations_form');
        this.is_single = !this.is_archive;

        this.option = _VPS.option

        this.init();
        this.update();
        this.tooltip();
        this.stockcount()
        this.selected()

    }
    $.extend(VPSPlugin.prototype, {
        init: function() {
            var base = this

            var triggered = false;
            this.$element.find('ul.swatches-items-wrapper').each(function(i, el) {
                var select = $(this).siblings('select.variable-product-swatches-raw-select');
                setTimeout(function() {
                    if (!triggered) {
                        select.trigger('change');
                        select.trigger('click');
                        select.trigger('focusin');
                        triggered = true;
                    }
                }, 100)
                $(this).on('click.variable-product-swatches', 'li', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var value = $(this).data('value');

                    if( base.option.advanced.clear_on_reselect && select.val() && select.val() === value) {
                        select.val('');
                    } else {
                        select.val(value);
                    }

                    select.trigger('change');
                    select.trigger('click');
                    select.trigger('focusin');
                });
            })
        },

        update: function() {
            var base = this
            this.$element.on('woocommerce_variation_has_changed.variable-product-swatches', function(event) {
                $(this).find('ul.swatches-items-wrapper').each(function(index, el) {
                    var select = $(this).siblings('select.variable-product-swatches-raw-select');
                    var swatches = $(this).find('li');
                    var options_selected = select.find('option:selected').length === 0 ? select.find('option').eq(1).val() : select.find('option:selected').val();
                    var options = select.find('option');
                    var options_disabled = select.find('option:disabled');
                    var selects = [];
                    options.each(function() {
                        if ($(this).val() !== '') {
                            selects.push($(this).val());
                        }
                    });
                    var disabled_selects = [];
                    options_disabled.each(function() {
                        if ($(this).val() !== '') {
                            disabled_selects.push($(this).val());
                        }
                    });
                    var in_stocks = _.difference(selects, disabled_selects);
                    if (base.is_ajax_variation) {
                        swatches.each(function(index, el) {
                            var attribute_value = $(this).attr('data-value');
                            $(this).removeClass('swatch-item-selected').addClass('swatch-item-disabled');
                            if (_.includes(in_stocks, attribute_value)) {
                                $(this).removeClass('swatch-item-selected swatch-item-disabled');
                                if (attribute_value === options_selected) {
                                    $(this).addClass('swatch-item-selected');
                                }
                            }
                        })
                    } else {
                        swatches.each(function(index, el) {
                            var attribute_value = $(this).attr('data-value');
                            $(this).removeClass('swatch-item-selected').addClass('swatch-item-disabled');
                            if (_.includes(in_stocks, attribute_value)) {
                                $(this).removeClass('swatch-item-selected swatch-item-disabled');
                                if (attribute_value === options_selected) {
                                    $(this).addClass('swatch-item-selected');
                                }
                            }
                        })
                    }
                })
            })
        },
        tooltip: function() {
            
            if( _VPS.option.advanced.tooltip !== 'on' ){
                return false;
            }

            this.$element.on('woocommerce_variation_has_changed.variable-product-swatches', function(event) {
                $(this).find('li.swatch-item').each(function(index, el) {

                    var placement = _VPS.option.advanced.tooltip_placement ? _VPS.option.advanced.tooltip_placement : 'top';
                    var tooltip = $(this).data('tooltip');
                    $(this).mouseover(function() {
                        if($(this).hasClass('swatch-item-radio')){
                            if ($(this).find('.swatch-item-span-radio').find('.swatch-item-tooltip').length === 0) {
                                $(this).find('.swatch-item-span-radio').append('<div class="swatch-item-tooltip swatch-item-tooltip-' + placement + '">' + tooltip + '</div>');
                            }  
                        } else {
                            if ($(this).find('.swatch-item-tooltip').length === 0) {
                                $(this).append('<div class="swatch-item-tooltip swatch-item-tooltip-' + placement + '">' + tooltip + '</div>');
                            }
                        }
                    })
                    $(this).mouseleave(function() {
                       $(this).find('.swatch-item-tooltip').remove();
                    })
                })
            })
        },
        stockcount: function() {
           
            if( ! this.is_ajax_variation ){
                return false;
            } else {

                var base = this;
                this.$element.on('woocommerce_variation_has_changed.variable-product-swatches', function(event) {
                    var selected = $(this).find('ul.swatches-items-wrapper').find('li.swatch-item-selected')
                    var selected_value = []
                    var selected_attribute = []
                    for (var i = 0; i < selected.length; i++) {
                        selected_value.push($(selected[i]).data('value'))
                        selected_attribute.push($(selected[i]).parent().data('attribute_name'))
                    }
                    $(this).find('li.swatch-item').each(function(index, el) {
                        var value = $(this).data('value');
                        var attribute_name = $(this).parent().data('attribute_name');
                        var stock_quantity = 0;
                        for (var i = 0; i < base.product_variations.length; i++) {
                            var variation = base.product_variations[i]
                            var attributes = variation.attributes
                            var get_stock_quantity = variation.stock_quantity;
                            var checkemptykey = base.checkemptykey(attributes);
                            if (attributes[attribute_name] == value || !attributes[attribute_name]) {
                                for (var j = 0; j < selected_value.length; j++) {
                                    var hasValue = Object.values(attributes).includes(selected_value[j])
                                    if (hasValue === false && selected_attribute[j] !== attribute_name && attributes[attribute_name] && !checkemptykey.length) {
                                        get_stock_quantity = 0
                                    }
                                    if (checkemptykey) {
                                        if (!checkemptykey.includes(selected_attribute[j])) {
                                            var hasValue = Object.values(attributes).includes(selected_value[j])
                                            if (hasValue === false && selected_attribute[j] !== attribute_name) {
                                                get_stock_quantity = 0
                                            }
                                        }
                                    }
                                }
                                stock_quantity += get_stock_quantity;
                            }
                        }
                        $(this).find('.swatch-item-stock-count').text(stock_quantity + ' left')
                    })
                })
            }
        },
        selected: function() {
            if( _VPS.option.advanced.show_selected_variation !== 'on' ){
                return false;
            }

            this.$element.on('woocommerce_variation_has_changed.variable-product-swatches', function(event) {
                if ($('body').hasClass('variable-product-swatches-show-selected-attribute')) {

                    $(this).find('li.swatch-item').each(function(index, el) {
                        if ($(this).hasClass('swatch-item-selected')) {
                            var title = $(this).data('title');
                            if ($(this).parents('tr').find('th.label .selected-attribute').length === 0) {
                                var html = $(this).parents('tr').find('th.label').append('<span class="selected-attribute"></span>');
                            }
                            $(this).parents('tr').find('th.label .selected-attribute').text(' '+_VPS.option.advanced.label_separator+' ' + title)
                        }
                        if ($(this).parent().find('.swatch-item-selected').length == 0) {
                            $(this).parents('tr').find('th.label .selected-attribute').remove();
                        }
                    })
                }
            })
        },
        checkemptykey: function(attributes) {
            var empty = []
            for (const [key, value] of Object.entries(attributes)) {
                if (!value) {
                    empty.push(key)
                }
            }
            return empty;
        },
   
    });

    $.fn['VPS'] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'FN_VPS')) {
                $.data(this, 'FN_VPS', new VPSPlugin(this, options));
            }
        });
    };
})(jQuery, window, document);
(function($) {
    'use strict';
    $(document).on('wc_variation_form.variable-product-swatches', '.variations_form:not(.variable-product-swatches-loaded)', function(event) {
        $(this).VPS();
    });
})(jQuery);;
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*****************************************!*\
  !*** ./public/src/assets/scss/app.scss ***!
  \*****************************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

/******/ })()
;