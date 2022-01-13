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
                    var title = $(this).data('title');
                    $(this).mouseover(function() {
                        if($(this).hasClass('swatch-item-radio')){
                            if ($(this).find('.swatch-item-span-radio').find('.swatch-item-tooltip').length === 0) {
                                $(this).find('.swatch-item-span-radio').append('<div class="swatch-item-tooltip swatch-item-tooltip-' + placement + '">' + title + '</div>');
                            }  
                        } else {
                            if ($(this).find('.swatch-item-tooltip').length === 0) {
                                $(this).append('<div class="swatch-item-tooltip swatch-item-tooltip-' + placement + '">' + title + '</div>');
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
                            if ($(this).parents('tr').find('td.label .selected-attribute').length === 0) {
                                var html = $(this).parents('tr').find('td.label').append('<span class="selected-attribute"></span>');
                            }
                            $(this).parents('tr').find('td.label .selected-attribute').text(' '+_VPS.option.advanced.label_separator+' ' + title)
                        }
                        if ($(this).parent().find('.swatch-item-selected').length == 0) {
                            $(this).parents('tr').find('td.label .selected-attribute').remove();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy1wdWJsaWMuanMiLCJtYXBwaW5ncyI6IjtVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7O0FDTkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUNBQW1DLElBQUk7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLHFCQUFxQjtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxvQ0FBb0M7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCwyQkFBMkI7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakI7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxXOzs7Ozs7Ozs7O0FDdk9EIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy8uL3B1YmxpYy9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly92YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzLy4vcHVibGljL3NyYy9hc3NldHMvc2Nzcy9hcHAuc2NzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiKGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIFZQU1BsdWdpbihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwge30sIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KTtcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcygndmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy1sb2FkZWQnKTtcbiAgICAgICAgdGhpcy5wcm9kdWN0X3ZhcmlhdGlvbnMgPSB0aGlzLiRlbGVtZW50LmRhdGEoJ3Byb2R1Y3RfdmFyaWF0aW9ucycpIHx8IFtdO1xuICAgICAgICB0aGlzLmlzX2FqYXhfdmFyaWF0aW9uID0gdGhpcy5wcm9kdWN0X3ZhcmlhdGlvbnMubGVuZ3RoID4gMDtcblxuXG4gICAgICAgIHRoaXMud3JhcHBlciA9IHRoaXMuJGVsZW1lbnQuY2xvc2VzdCgnLnR5cGUtcHJvZHVjdCcpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZUZpZWxkcyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLnZhcmlhdGlvbnMgc2VsZWN0Jyk7XG4gICAgICAgIHRoaXMuY2FydF9idXR0b24gPSB0aGlzLiRlbGVtZW50LmZpbmQoJy52cHNfYWRkX3RvX2NhcnRfYnV0dG9uJyk7XG4gICAgICAgIHRoaXMuY2FydF9idXR0b25fYWpheCA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLnZwc19hamF4X2FkZF90b19jYXJ0Jyk7XG4gICAgICAgIHRoaXMuaXNfYXJjaGl2ZSA9IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ3Zwc19hcmNoaXZlX3ZhcmlhdGlvbnNfZm9ybScpO1xuICAgICAgICB0aGlzLmlzX3NpbmdsZSA9ICF0aGlzLmlzX2FyY2hpdmU7XG5cbiAgICAgICAgdGhpcy5vcHRpb24gPSBfVlBTLm9wdGlvblxuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICB0aGlzLnRvb2x0aXAoKTtcbiAgICAgICAgdGhpcy5zdG9ja2NvdW50KClcbiAgICAgICAgdGhpcy5zZWxlY3RlZCgpXG5cbiAgICB9XG4gICAgJC5leHRlbmQoVlBTUGx1Z2luLnByb3RvdHlwZSwge1xuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBiYXNlID0gdGhpc1xuXG4gICAgICAgICAgICB2YXIgdHJpZ2dlcmVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50LmZpbmQoJ3VsLnN3YXRjaGVzLWl0ZW1zLXdyYXBwZXInKS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdCA9ICQodGhpcykuc2libGluZ3MoJ3NlbGVjdC52YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzLXJhdy1zZWxlY3QnKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRyaWdnZXJlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignZm9jdXNpbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIDEwMClcbiAgICAgICAgICAgICAgICAkKHRoaXMpLm9uKCdjbGljay52YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzJywgJ2xpJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9ICQodGhpcykuZGF0YSgndmFsdWUnKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiggYmFzZS5vcHRpb24uYWR2YW5jZWQuY2xlYXJfb25fcmVzZWxlY3QgJiYgc2VsZWN0LnZhbCgpICYmIHNlbGVjdC52YWwoKSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC52YWwoJycpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnZhbCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignZm9jdXNpbicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGJhc2UgPSB0aGlzXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCd3b29jb21tZXJjZV92YXJpYXRpb25faGFzX2NoYW5nZWQudmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCd1bC5zd2F0Y2hlcy1pdGVtcy13cmFwcGVyJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdCA9ICQodGhpcykuc2libGluZ3MoJ3NlbGVjdC52YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzLXJhdy1zZWxlY3QnKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN3YXRjaGVzID0gJCh0aGlzKS5maW5kKCdsaScpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9uc19zZWxlY3RlZCA9IHNlbGVjdC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5sZW5ndGggPT09IDAgPyBzZWxlY3QuZmluZCgnb3B0aW9uJykuZXEoMSkudmFsKCkgOiBzZWxlY3QuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gc2VsZWN0LmZpbmQoJ29wdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9uc19kaXNhYmxlZCA9IHNlbGVjdC5maW5kKCdvcHRpb246ZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0cy5wdXNoKCQodGhpcykudmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpc2FibGVkX3NlbGVjdHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc19kaXNhYmxlZC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWRfc2VsZWN0cy5wdXNoKCQodGhpcykudmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluX3N0b2NrcyA9IF8uZGlmZmVyZW5jZShzZWxlY3RzLCBkaXNhYmxlZF9zZWxlY3RzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhc2UuaXNfYWpheF92YXJpYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3YXRjaGVzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZV92YWx1ZSA9ICQodGhpcykuYXR0cignZGF0YS12YWx1ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3N3YXRjaC1pdGVtLXNlbGVjdGVkJykuYWRkQ2xhc3MoJ3N3YXRjaC1pdGVtLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZXMoaW5fc3RvY2tzLCBhdHRyaWJ1dGVfdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3N3YXRjaC1pdGVtLXNlbGVjdGVkIHN3YXRjaC1pdGVtLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVfdmFsdWUgPT09IG9wdGlvbnNfc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3N3YXRjaC1pdGVtLXNlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dhdGNoZXMuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlX3ZhbHVlID0gJCh0aGlzKS5hdHRyKCdkYXRhLXZhbHVlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKS5hZGRDbGFzcygnc3dhdGNoLWl0ZW0tZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlcyhpbl9zdG9ja3MsIGF0dHJpYnV0ZV92YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnc3dhdGNoLWl0ZW0tc2VsZWN0ZWQgc3dhdGNoLWl0ZW0tZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZV92YWx1ZSA9PT0gb3B0aW9uc19zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgdG9vbHRpcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKCBfVlBTLm9wdGlvbi5hZHZhbmNlZC50b29sdGlwICE9PSAnb24nICl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCd3b29jb21tZXJjZV92YXJpYXRpb25faGFzX2NoYW5nZWQudmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdsaS5zd2F0Y2gtaXRlbScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHBsYWNlbWVudCA9IF9WUFMub3B0aW9uLmFkdmFuY2VkLnRvb2x0aXBfcGxhY2VtZW50ID8gX1ZQUy5vcHRpb24uYWR2YW5jZWQudG9vbHRpcF9wbGFjZW1lbnQgOiAndG9wJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpdGxlID0gJCh0aGlzKS5kYXRhKCd0aXRsZScpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLm1vdXNlb3ZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCQodGhpcykuaGFzQ2xhc3MoJ3N3YXRjaC1pdGVtLXJhZGlvJykpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmZpbmQoJy5zd2F0Y2gtaXRlbS1zcGFuLXJhZGlvJykuZmluZCgnLnN3YXRjaC1pdGVtLXRvb2x0aXAnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcuc3dhdGNoLWl0ZW0tc3Bhbi1yYWRpbycpLmFwcGVuZCgnPGRpdiBjbGFzcz1cInN3YXRjaC1pdGVtLXRvb2x0aXAgc3dhdGNoLWl0ZW0tdG9vbHRpcC0nICsgcGxhY2VtZW50ICsgJ1wiPicgKyB0aXRsZSArICc8L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuZmluZCgnLnN3YXRjaC1pdGVtLXRvb2x0aXAnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJzd2F0Y2gtaXRlbS10b29sdGlwIHN3YXRjaC1pdGVtLXRvb2x0aXAtJyArIHBsYWNlbWVudCArICdcIj4nICsgdGl0bGUgKyAnPC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLm1vdXNlbGVhdmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnN3YXRjaC1pdGVtLXRvb2x0aXAnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgc3RvY2tjb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgaWYoICEgdGhpcy5pc19hamF4X3ZhcmlhdGlvbiApe1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgYmFzZSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5vbignd29vY29tbWVyY2VfdmFyaWF0aW9uX2hhc19jaGFuZ2VkLnZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSAkKHRoaXMpLmZpbmQoJ3VsLnN3YXRjaGVzLWl0ZW1zLXdyYXBwZXInKS5maW5kKCdsaS5zd2F0Y2gtaXRlbS1zZWxlY3RlZCcpXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZF92YWx1ZSA9IFtdXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZF9hdHRyaWJ1dGUgPSBbXVxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZF92YWx1ZS5wdXNoKCQoc2VsZWN0ZWRbaV0pLmRhdGEoJ3ZhbHVlJykpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZF9hdHRyaWJ1dGUucHVzaCgkKHNlbGVjdGVkW2ldKS5wYXJlbnQoKS5kYXRhKCdhdHRyaWJ1dGVfbmFtZScpKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnbGkuc3dhdGNoLWl0ZW0nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gJCh0aGlzKS5kYXRhKCd2YWx1ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZV9uYW1lID0gJCh0aGlzKS5wYXJlbnQoKS5kYXRhKCdhdHRyaWJ1dGVfbmFtZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0b2NrX3F1YW50aXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmFzZS5wcm9kdWN0X3ZhcmlhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFyaWF0aW9uID0gYmFzZS5wcm9kdWN0X3ZhcmlhdGlvbnNbaV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHZhcmlhdGlvbi5hdHRyaWJ1dGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdldF9zdG9ja19xdWFudGl0eSA9IHZhcmlhdGlvbi5zdG9ja19xdWFudGl0eTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hlY2tlbXB0eWtleSA9IGJhc2UuY2hlY2tlbXB0eWtleShhdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVfbmFtZV0gPT0gdmFsdWUgfHwgIWF0dHJpYnV0ZXNbYXR0cmlidXRlX25hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2VsZWN0ZWRfdmFsdWUubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoYXNWYWx1ZSA9IE9iamVjdC52YWx1ZXMoYXR0cmlidXRlcykuaW5jbHVkZXMoc2VsZWN0ZWRfdmFsdWVbal0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzVmFsdWUgPT09IGZhbHNlICYmIHNlbGVjdGVkX2F0dHJpYnV0ZVtqXSAhPT0gYXR0cmlidXRlX25hbWUgJiYgYXR0cmlidXRlc1thdHRyaWJ1dGVfbmFtZV0gJiYgIWNoZWNrZW1wdHlrZXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0X3N0b2NrX3F1YW50aXR5ID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrZW1wdHlrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNoZWNrZW1wdHlrZXkuaW5jbHVkZXMoc2VsZWN0ZWRfYXR0cmlidXRlW2pdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGFzVmFsdWUgPSBPYmplY3QudmFsdWVzKGF0dHJpYnV0ZXMpLmluY2x1ZGVzKHNlbGVjdGVkX3ZhbHVlW2pdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzVmFsdWUgPT09IGZhbHNlICYmIHNlbGVjdGVkX2F0dHJpYnV0ZVtqXSAhPT0gYXR0cmlidXRlX25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldF9zdG9ja19xdWFudGl0eSA9IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9ja19xdWFudGl0eSArPSBnZXRfc3RvY2tfcXVhbnRpdHk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcuc3dhdGNoLWl0ZW0tc3RvY2stY291bnQnKS50ZXh0KHN0b2NrX3F1YW50aXR5ICsgJyBsZWZ0JylcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzZWxlY3RlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiggX1ZQUy5vcHRpb24uYWR2YW5jZWQuc2hvd19zZWxlY3RlZF92YXJpYXRpb24gIT09ICdvbicgKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQub24oJ3dvb2NvbW1lcmNlX3ZhcmlhdGlvbl9oYXNfY2hhbmdlZC52YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCgnYm9keScpLmhhc0NsYXNzKCd2YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzLXNob3ctc2VsZWN0ZWQtYXR0cmlidXRlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdsaS5zd2F0Y2gtaXRlbScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aXRsZSA9ICQodGhpcykuZGF0YSgndGl0bGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnRzKCd0cicpLmZpbmQoJ3RkLmxhYmVsIC5zZWxlY3RlZC1hdHRyaWJ1dGUnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0bWwgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZmluZCgndGQubGFiZWwnKS5hcHBlbmQoJzxzcGFuIGNsYXNzPVwic2VsZWN0ZWQtYXR0cmlidXRlXCI+PC9zcGFuPicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZmluZCgndGQubGFiZWwgLnNlbGVjdGVkLWF0dHJpYnV0ZScpLnRleHQoJyAnK19WUFMub3B0aW9uLmFkdmFuY2VkLmxhYmVsX3NlcGFyYXRvcisnICcgKyB0aXRsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnBhcmVudCgpLmZpbmQoJy5zd2F0Y2gtaXRlbS1zZWxlY3RlZCcpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLmZpbmQoJ3RkLmxhYmVsIC5zZWxlY3RlZC1hdHRyaWJ1dGUnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBjaGVja2VtcHR5a2V5OiBmdW5jdGlvbihhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICB2YXIgZW1wdHkgPSBbXVxuICAgICAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVtcHR5LnB1c2goa2V5KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlbXB0eTtcbiAgICAgICAgfSxcbiAgIFxuICAgIH0pO1xuXG4gICAgJC5mblsnVlBTJ10gPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoISQuZGF0YSh0aGlzLCAnRk5fVlBTJykpIHtcbiAgICAgICAgICAgICAgICAkLmRhdGEodGhpcywgJ0ZOX1ZQUycsIG5ldyBWUFNQbHVnaW4odGhpcywgb3B0aW9ucykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xufSkoalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcbihmdW5jdGlvbigkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgICQoZG9jdW1lbnQpLm9uKCd3Y192YXJpYXRpb25fZm9ybS52YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzJywgJy52YXJpYXRpb25zX2Zvcm06bm90KC52YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzLWxvYWRlZCknLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAkKHRoaXMpLlZQUygpO1xuICAgIH0pO1xufSkoalF1ZXJ5KTs7IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9