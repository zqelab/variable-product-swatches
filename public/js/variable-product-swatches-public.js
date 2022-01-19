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
        this.cart_button = this.$element.find('.variable_product_swatches_add_to_cart_button');
        this.cart_button_ajax = this.$element.find('.variable_product_swatches_ajax_add_to_cart');
        this.is_archive = this.$element.hasClass('variable_product_swatches_archive_variations_form');
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
                
                $(this).parent().addClass('variable-product-swatches-items-wrapper');

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

            console.log( this.is_ajax_variation )
           
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

                        console.log(stock_quantity)
                        
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy1wdWJsaWMuanMiLCJtYXBwaW5ncyI6IjtVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7O0FDTkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUNBQW1DLElBQUk7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxxQkFBcUI7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBLHdDQUF3QyxvQ0FBb0M7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCwyQkFBMkI7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLGlCQUFpQjtBQUNqQjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLFc7Ozs7Ozs7Ozs7QUNsUEQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3ZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzLy4vcHVibGljL3NyYy9tYWluLmpzIiwid2VicGFjazovL3ZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMvLi9wdWJsaWMvc3JjL2Fzc2V0cy9zY3NzL2FwcC5zY3NzPzQyYzkiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIihmdW5jdGlvbigkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBWUFNQbHVnaW4oZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLnNldHRpbmdzID0gJC5leHRlbmQoe30sIHt9LCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudCk7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ3ZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMtbG9hZGVkJyk7XG4gICAgICAgIHRoaXMucHJvZHVjdF92YXJpYXRpb25zID0gdGhpcy4kZWxlbWVudC5kYXRhKCdwcm9kdWN0X3ZhcmlhdGlvbnMnKSB8fCBbXTtcbiAgICAgICAgdGhpcy5pc19hamF4X3ZhcmlhdGlvbiA9IHRoaXMucHJvZHVjdF92YXJpYXRpb25zLmxlbmd0aCA+IDA7XG5cblxuICAgICAgICB0aGlzLndyYXBwZXIgPSB0aGlzLiRlbGVtZW50LmNsb3Nlc3QoJy50eXBlLXByb2R1Y3QnKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVGaWVsZHMgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy52YXJpYXRpb25zIHNlbGVjdCcpO1xuICAgICAgICB0aGlzLmNhcnRfYnV0dG9uID0gdGhpcy4kZWxlbWVudC5maW5kKCcudmFyaWFibGVfcHJvZHVjdF9zd2F0Y2hlc19hZGRfdG9fY2FydF9idXR0b24nKTtcbiAgICAgICAgdGhpcy5jYXJ0X2J1dHRvbl9hamF4ID0gdGhpcy4kZWxlbWVudC5maW5kKCcudmFyaWFibGVfcHJvZHVjdF9zd2F0Y2hlc19hamF4X2FkZF90b19jYXJ0Jyk7XG4gICAgICAgIHRoaXMuaXNfYXJjaGl2ZSA9IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ3ZhcmlhYmxlX3Byb2R1Y3Rfc3dhdGNoZXNfYXJjaGl2ZV92YXJpYXRpb25zX2Zvcm0nKTtcbiAgICAgICAgdGhpcy5pc19zaW5nbGUgPSAhdGhpcy5pc19hcmNoaXZlO1xuXG4gICAgICAgIHRoaXMub3B0aW9uID0gX1ZQUy5vcHRpb25cblxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgdGhpcy50b29sdGlwKCk7XG4gICAgICAgIHRoaXMuc3RvY2tjb3VudCgpXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQoKVxuXG4gICAgfVxuICAgIFxuICAgICQuZXh0ZW5kKFZQU1BsdWdpbi5wcm90b3R5cGUsIHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYmFzZSA9IHRoaXNcblxuICAgICAgICAgICAgdmFyIHRyaWdnZXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCd1bC5zd2F0Y2hlcy1pdGVtcy13cmFwcGVyJykuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuYWRkQ2xhc3MoJ3ZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMtaXRlbXMtd3JhcHBlcicpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdCA9ICQodGhpcykuc2libGluZ3MoJ3NlbGVjdC52YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzLXJhdy1zZWxlY3QnKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRyaWdnZXJlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignZm9jdXNpbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIDEwMClcbiAgICAgICAgICAgICAgICAkKHRoaXMpLm9uKCdjbGljay52YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzJywgJ2xpJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9ICQodGhpcykuZGF0YSgndmFsdWUnKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiggYmFzZS5vcHRpb24uYWR2YW5jZWQuY2xlYXJfb25fcmVzZWxlY3QgJiYgc2VsZWN0LnZhbCgpICYmIHNlbGVjdC52YWwoKSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC52YWwoJycpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnZhbCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignZm9jdXNpbicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGJhc2UgPSB0aGlzXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCd3b29jb21tZXJjZV92YXJpYXRpb25faGFzX2NoYW5nZWQudmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCd1bC5zd2F0Y2hlcy1pdGVtcy13cmFwcGVyJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdCA9ICQodGhpcykuc2libGluZ3MoJ3NlbGVjdC52YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzLXJhdy1zZWxlY3QnKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN3YXRjaGVzID0gJCh0aGlzKS5maW5kKCdsaScpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9uc19zZWxlY3RlZCA9IHNlbGVjdC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5sZW5ndGggPT09IDAgPyBzZWxlY3QuZmluZCgnb3B0aW9uJykuZXEoMSkudmFsKCkgOiBzZWxlY3QuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gc2VsZWN0LmZpbmQoJ29wdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9uc19kaXNhYmxlZCA9IHNlbGVjdC5maW5kKCdvcHRpb246ZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0cy5wdXNoKCQodGhpcykudmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpc2FibGVkX3NlbGVjdHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc19kaXNhYmxlZC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWRfc2VsZWN0cy5wdXNoKCQodGhpcykudmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluX3N0b2NrcyA9IF8uZGlmZmVyZW5jZShzZWxlY3RzLCBkaXNhYmxlZF9zZWxlY3RzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhc2UuaXNfYWpheF92YXJpYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3YXRjaGVzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZV92YWx1ZSA9ICQodGhpcykuYXR0cignZGF0YS12YWx1ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3N3YXRjaC1pdGVtLXNlbGVjdGVkJykuYWRkQ2xhc3MoJ3N3YXRjaC1pdGVtLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZXMoaW5fc3RvY2tzLCBhdHRyaWJ1dGVfdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3N3YXRjaC1pdGVtLXNlbGVjdGVkIHN3YXRjaC1pdGVtLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVfdmFsdWUgPT09IG9wdGlvbnNfc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3N3YXRjaC1pdGVtLXNlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dhdGNoZXMuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlX3ZhbHVlID0gJCh0aGlzKS5hdHRyKCdkYXRhLXZhbHVlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKS5hZGRDbGFzcygnc3dhdGNoLWl0ZW0tZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlcyhpbl9zdG9ja3MsIGF0dHJpYnV0ZV92YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnc3dhdGNoLWl0ZW0tc2VsZWN0ZWQgc3dhdGNoLWl0ZW0tZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZV92YWx1ZSA9PT0gb3B0aW9uc19zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgdG9vbHRpcDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKCBfVlBTLm9wdGlvbi5hZHZhbmNlZC50b29sdGlwICE9PSAnb24nICl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCd3b29jb21tZXJjZV92YXJpYXRpb25faGFzX2NoYW5nZWQudmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdsaS5zd2F0Y2gtaXRlbScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHBsYWNlbWVudCA9IF9WUFMub3B0aW9uLmFkdmFuY2VkLnRvb2x0aXBfcGxhY2VtZW50ID8gX1ZQUy5vcHRpb24uYWR2YW5jZWQudG9vbHRpcF9wbGFjZW1lbnQgOiAndG9wJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpdGxlID0gJCh0aGlzKS5kYXRhKCd0aXRsZScpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLm1vdXNlb3ZlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCQodGhpcykuaGFzQ2xhc3MoJ3N3YXRjaC1pdGVtLXJhZGlvJykpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmZpbmQoJy5zd2F0Y2gtaXRlbS1zcGFuLXJhZGlvJykuZmluZCgnLnN3YXRjaC1pdGVtLXRvb2x0aXAnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcuc3dhdGNoLWl0ZW0tc3Bhbi1yYWRpbycpLmFwcGVuZCgnPGRpdiBjbGFzcz1cInN3YXRjaC1pdGVtLXRvb2x0aXAgc3dhdGNoLWl0ZW0tdG9vbHRpcC0nICsgcGxhY2VtZW50ICsgJ1wiPicgKyB0aXRsZSArICc8L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuZmluZCgnLnN3YXRjaC1pdGVtLXRvb2x0aXAnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJzd2F0Y2gtaXRlbS10b29sdGlwIHN3YXRjaC1pdGVtLXRvb2x0aXAtJyArIHBsYWNlbWVudCArICdcIj4nICsgdGl0bGUgKyAnPC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLm1vdXNlbGVhdmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnN3YXRjaC1pdGVtLXRvb2x0aXAnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgc3RvY2tjb3VudDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCB0aGlzLmlzX2FqYXhfdmFyaWF0aW9uIClcbiAgICAgICAgICAgXG4gICAgICAgICAgICBpZiggISB0aGlzLmlzX2FqYXhfdmFyaWF0aW9uICl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIHZhciBiYXNlID0gdGhpcztcbiAgICAgICAgICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCd3b29jb21tZXJjZV92YXJpYXRpb25faGFzX2NoYW5nZWQudmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9ICQodGhpcykuZmluZCgndWwuc3dhdGNoZXMtaXRlbXMtd3JhcHBlcicpLmZpbmQoJ2xpLnN3YXRjaC1pdGVtLXNlbGVjdGVkJylcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkX3ZhbHVlID0gW11cbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkX2F0dHJpYnV0ZSA9IFtdXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZWN0ZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkX3ZhbHVlLnB1c2goJChzZWxlY3RlZFtpXSkuZGF0YSgndmFsdWUnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkX2F0dHJpYnV0ZS5wdXNoKCQoc2VsZWN0ZWRbaV0pLnBhcmVudCgpLmRhdGEoJ2F0dHJpYnV0ZV9uYW1lJykpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdsaS5zd2F0Y2gtaXRlbScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLmRhdGEoJ3ZhbHVlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlX25hbWUgPSAkKHRoaXMpLnBhcmVudCgpLmRhdGEoJ2F0dHJpYnV0ZV9uYW1lJyk7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0b2NrX3F1YW50aXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmFzZS5wcm9kdWN0X3ZhcmlhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFyaWF0aW9uID0gYmFzZS5wcm9kdWN0X3ZhcmlhdGlvbnNbaV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHZhcmlhdGlvbi5hdHRyaWJ1dGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdldF9zdG9ja19xdWFudGl0eSA9IHZhcmlhdGlvbi5zdG9ja19xdWFudGl0eTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hlY2tlbXB0eWtleSA9IGJhc2UuY2hlY2tlbXB0eWtleShhdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVfbmFtZV0gPT0gdmFsdWUgfHwgIWF0dHJpYnV0ZXNbYXR0cmlidXRlX25hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2VsZWN0ZWRfdmFsdWUubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoYXNWYWx1ZSA9IE9iamVjdC52YWx1ZXMoYXR0cmlidXRlcykuaW5jbHVkZXMoc2VsZWN0ZWRfdmFsdWVbal0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzVmFsdWUgPT09IGZhbHNlICYmIHNlbGVjdGVkX2F0dHJpYnV0ZVtqXSAhPT0gYXR0cmlidXRlX25hbWUgJiYgYXR0cmlidXRlc1thdHRyaWJ1dGVfbmFtZV0gJiYgIWNoZWNrZW1wdHlrZXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0X3N0b2NrX3F1YW50aXR5ID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrZW1wdHlrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNoZWNrZW1wdHlrZXkuaW5jbHVkZXMoc2VsZWN0ZWRfYXR0cmlidXRlW2pdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGFzVmFsdWUgPSBPYmplY3QudmFsdWVzKGF0dHJpYnV0ZXMpLmluY2x1ZGVzKHNlbGVjdGVkX3ZhbHVlW2pdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzVmFsdWUgPT09IGZhbHNlICYmIHNlbGVjdGVkX2F0dHJpYnV0ZVtqXSAhPT0gYXR0cmlidXRlX25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldF9zdG9ja19xdWFudGl0eSA9IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9ja19xdWFudGl0eSArPSBnZXRfc3RvY2tfcXVhbnRpdHk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzdG9ja19xdWFudGl0eSlcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcuc3dhdGNoLWl0ZW0tc3RvY2stY291bnQnKS50ZXh0KHN0b2NrX3F1YW50aXR5ICsgJyBsZWZ0JylcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzZWxlY3RlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiggX1ZQUy5vcHRpb24uYWR2YW5jZWQuc2hvd19zZWxlY3RlZF92YXJpYXRpb24gIT09ICdvbicgKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQub24oJ3dvb2NvbW1lcmNlX3ZhcmlhdGlvbl9oYXNfY2hhbmdlZC52YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCgnYm9keScpLmhhc0NsYXNzKCd2YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzLXNob3ctc2VsZWN0ZWQtYXR0cmlidXRlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdsaS5zd2F0Y2gtaXRlbScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aXRsZSA9ICQodGhpcykuZGF0YSgndGl0bGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnRzKCd0cicpLmZpbmQoJ3RkLmxhYmVsIC5zZWxlY3RlZC1hdHRyaWJ1dGUnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGh0bWwgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZmluZCgndGQubGFiZWwnKS5hcHBlbmQoJzxzcGFuIGNsYXNzPVwic2VsZWN0ZWQtYXR0cmlidXRlXCI+PC9zcGFuPicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZmluZCgndGQubGFiZWwgLnNlbGVjdGVkLWF0dHJpYnV0ZScpLnRleHQoJyAnK19WUFMub3B0aW9uLmFkdmFuY2VkLmxhYmVsX3NlcGFyYXRvcisnICcgKyB0aXRsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnBhcmVudCgpLmZpbmQoJy5zd2F0Y2gtaXRlbS1zZWxlY3RlZCcpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLmZpbmQoJ3RkLmxhYmVsIC5zZWxlY3RlZC1hdHRyaWJ1dGUnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBjaGVja2VtcHR5a2V5OiBmdW5jdGlvbihhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICB2YXIgZW1wdHkgPSBbXVxuICAgICAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVtcHR5LnB1c2goa2V5KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlbXB0eTtcbiAgICAgICAgfSxcbiAgIFxuICAgIH0pO1xuXG4gICAgJC5mblsnVlBTJ10gPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoISQuZGF0YSh0aGlzLCAnRk5fVlBTJykpIHtcbiAgICAgICAgICAgICAgICAkLmRhdGEodGhpcywgJ0ZOX1ZQUycsIG5ldyBWUFNQbHVnaW4odGhpcywgb3B0aW9ucykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xufSkoalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcbihmdW5jdGlvbigkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgICQoZG9jdW1lbnQpLm9uKCd3Y192YXJpYXRpb25fZm9ybS52YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzJywgJy52YXJpYXRpb25zX2Zvcm06bm90KC52YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzLWxvYWRlZCknLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAkKHRoaXMpLlZQUygpO1xuICAgIH0pO1xufSkoalF1ZXJ5KTs7IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9