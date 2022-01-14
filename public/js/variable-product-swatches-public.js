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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy1wdWJsaWMuanMiLCJtYXBwaW5ncyI6IjtVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7O0FDTkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUNBQW1DLElBQUk7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7QUFFZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLHFCQUFxQjtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxvQ0FBb0M7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCwyQkFBMkI7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakI7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxXOzs7Ozs7Ozs7O0FDdk9EIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy8uL3B1YmxpYy9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly92YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzLy4vcHVibGljL3NyYy9hc3NldHMvc2Nzcy9hcHAuc2Nzcz80MmM5Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIoZnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgZnVuY3Rpb24gVlBTUGx1Z2luKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCB7fSwgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuICAgICAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKCd2YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzLWxvYWRlZCcpO1xuICAgICAgICB0aGlzLnByb2R1Y3RfdmFyaWF0aW9ucyA9IHRoaXMuJGVsZW1lbnQuZGF0YSgncHJvZHVjdF92YXJpYXRpb25zJykgfHwgW107XG4gICAgICAgIHRoaXMuaXNfYWpheF92YXJpYXRpb24gPSB0aGlzLnByb2R1Y3RfdmFyaWF0aW9ucy5sZW5ndGggPiAwO1xuXG5cbiAgICAgICAgdGhpcy53cmFwcGVyID0gdGhpcy4kZWxlbWVudC5jbG9zZXN0KCcudHlwZS1wcm9kdWN0Jyk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlRmllbGRzID0gdGhpcy4kZWxlbWVudC5maW5kKCcudmFyaWF0aW9ucyBzZWxlY3QnKTtcbiAgICAgICAgdGhpcy5jYXJ0X2J1dHRvbiA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLnZwc19hZGRfdG9fY2FydF9idXR0b24nKTtcbiAgICAgICAgdGhpcy5jYXJ0X2J1dHRvbl9hamF4ID0gdGhpcy4kZWxlbWVudC5maW5kKCcudnBzX2FqYXhfYWRkX3RvX2NhcnQnKTtcbiAgICAgICAgdGhpcy5pc19hcmNoaXZlID0gdGhpcy4kZWxlbWVudC5oYXNDbGFzcygndnBzX2FyY2hpdmVfdmFyaWF0aW9uc19mb3JtJyk7XG4gICAgICAgIHRoaXMuaXNfc2luZ2xlID0gIXRoaXMuaXNfYXJjaGl2ZTtcblxuICAgICAgICB0aGlzLm9wdGlvbiA9IF9WUFMub3B0aW9uXG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIHRoaXMudG9vbHRpcCgpO1xuICAgICAgICB0aGlzLnN0b2NrY291bnQoKVxuICAgICAgICB0aGlzLnNlbGVjdGVkKClcblxuICAgIH1cbiAgICAkLmV4dGVuZChWUFNQbHVnaW4ucHJvdG90eXBlLCB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGJhc2UgPSB0aGlzXG5cbiAgICAgICAgICAgIHZhciB0cmlnZ2VyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuZmluZCgndWwuc3dhdGNoZXMtaXRlbXMtd3JhcHBlcicpLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ID0gJCh0aGlzKS5zaWJsaW5ncygnc2VsZWN0LnZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMtcmF3LXNlbGVjdCcpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdHJpZ2dlcmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCdmb2N1c2luJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgMTAwKVxuICAgICAgICAgICAgICAgICQodGhpcykub24oJ2NsaWNrLnZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMnLCAnbGknLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gJCh0aGlzKS5kYXRhKCd2YWx1ZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKCBiYXNlLm9wdGlvbi5hZHZhbmNlZC5jbGVhcl9vbl9yZXNlbGVjdCAmJiBzZWxlY3QudmFsKCkgJiYgc2VsZWN0LnZhbCgpID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QudmFsKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCdmb2N1c2luJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYmFzZSA9IHRoaXNcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQub24oJ3dvb2NvbW1lcmNlX3ZhcmlhdGlvbl9oYXNfY2hhbmdlZC52YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ3VsLnN3YXRjaGVzLWl0ZW1zLXdyYXBwZXInKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ID0gJCh0aGlzKS5zaWJsaW5ncygnc2VsZWN0LnZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMtcmF3LXNlbGVjdCcpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3dhdGNoZXMgPSAkKHRoaXMpLmZpbmQoJ2xpJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zX3NlbGVjdGVkID0gc2VsZWN0LmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLmxlbmd0aCA9PT0gMCA/IHNlbGVjdC5maW5kKCdvcHRpb24nKS5lcSgxKS52YWwoKSA6IHNlbGVjdC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS52YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBzZWxlY3QuZmluZCgnb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zX2Rpc2FibGVkID0gc2VsZWN0LmZpbmQoJ29wdGlvbjpkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RzLnB1c2goJCh0aGlzKS52YWwoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGlzYWJsZWRfc2VsZWN0cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zX2Rpc2FibGVkLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZF9zZWxlY3RzLnB1c2goJCh0aGlzKS52YWwoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5fc3RvY2tzID0gXy5kaWZmZXJlbmNlKHNlbGVjdHMsIGRpc2FibGVkX3NlbGVjdHMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmFzZS5pc19hamF4X3ZhcmlhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dhdGNoZXMuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlX3ZhbHVlID0gJCh0aGlzKS5hdHRyKCdkYXRhLXZhbHVlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKS5hZGRDbGFzcygnc3dhdGNoLWl0ZW0tZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXy5pbmNsdWRlcyhpbl9zdG9ja3MsIGF0dHJpYnV0ZV92YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnc3dhdGNoLWl0ZW0tc2VsZWN0ZWQgc3dhdGNoLWl0ZW0tZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZV92YWx1ZSA9PT0gb3B0aW9uc19zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2F0Y2hlcy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVfdmFsdWUgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtdmFsdWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdzd2F0Y2gtaXRlbS1zZWxlY3RlZCcpLmFkZENsYXNzKCdzd2F0Y2gtaXRlbS1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGVzKGluX3N0b2NrcywgYXR0cmlidXRlX3ZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdzd2F0Y2gtaXRlbS1zZWxlY3RlZCBzd2F0Y2gtaXRlbS1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlX3ZhbHVlID09PSBvcHRpb25zX3NlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdzd2F0Y2gtaXRlbS1zZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICB0b29sdGlwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoIF9WUFMub3B0aW9uLmFkdmFuY2VkLnRvb2x0aXAgIT09ICdvbicgKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQub24oJ3dvb2NvbW1lcmNlX3ZhcmlhdGlvbl9oYXNfY2hhbmdlZC52YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ2xpLnN3YXRjaC1pdGVtJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcGxhY2VtZW50ID0gX1ZQUy5vcHRpb24uYWR2YW5jZWQudG9vbHRpcF9wbGFjZW1lbnQgPyBfVlBTLm9wdGlvbi5hZHZhbmNlZC50b29sdGlwX3BsYWNlbWVudCA6ICd0b3AnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGl0bGUgPSAkKHRoaXMpLmRhdGEoJ3RpdGxlJyk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykubW91c2VvdmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoJCh0aGlzKS5oYXNDbGFzcygnc3dhdGNoLWl0ZW0tcmFkaW8nKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuZmluZCgnLnN3YXRjaC1pdGVtLXNwYW4tcmFkaW8nKS5maW5kKCcuc3dhdGNoLWl0ZW0tdG9vbHRpcCcpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5zd2F0Y2gtaXRlbS1zcGFuLXJhZGlvJykuYXBwZW5kKCc8ZGl2IGNsYXNzPVwic3dhdGNoLWl0ZW0tdG9vbHRpcCBzd2F0Y2gtaXRlbS10b29sdGlwLScgKyBwbGFjZW1lbnQgKyAnXCI+JyArIHRpdGxlICsgJzwvZGl2PicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5maW5kKCcuc3dhdGNoLWl0ZW0tdG9vbHRpcCcpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmFwcGVuZCgnPGRpdiBjbGFzcz1cInN3YXRjaC1pdGVtLXRvb2x0aXAgc3dhdGNoLWl0ZW0tdG9vbHRpcC0nICsgcGxhY2VtZW50ICsgJ1wiPicgKyB0aXRsZSArICc8L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykubW91c2VsZWF2ZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcuc3dhdGNoLWl0ZW0tdG9vbHRpcCcpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBzdG9ja2NvdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgXG4gICAgICAgICAgICBpZiggISB0aGlzLmlzX2FqYXhfdmFyaWF0aW9uICl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIHZhciBiYXNlID0gdGhpcztcbiAgICAgICAgICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCd3b29jb21tZXJjZV92YXJpYXRpb25faGFzX2NoYW5nZWQudmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9ICQodGhpcykuZmluZCgndWwuc3dhdGNoZXMtaXRlbXMtd3JhcHBlcicpLmZpbmQoJ2xpLnN3YXRjaC1pdGVtLXNlbGVjdGVkJylcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkX3ZhbHVlID0gW11cbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkX2F0dHJpYnV0ZSA9IFtdXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZWN0ZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkX3ZhbHVlLnB1c2goJChzZWxlY3RlZFtpXSkuZGF0YSgndmFsdWUnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkX2F0dHJpYnV0ZS5wdXNoKCQoc2VsZWN0ZWRbaV0pLnBhcmVudCgpLmRhdGEoJ2F0dHJpYnV0ZV9uYW1lJykpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdsaS5zd2F0Y2gtaXRlbScpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLmRhdGEoJ3ZhbHVlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlX25hbWUgPSAkKHRoaXMpLnBhcmVudCgpLmRhdGEoJ2F0dHJpYnV0ZV9uYW1lJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RvY2tfcXVhbnRpdHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBiYXNlLnByb2R1Y3RfdmFyaWF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YXJpYXRpb24gPSBiYXNlLnByb2R1Y3RfdmFyaWF0aW9uc1tpXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gdmFyaWF0aW9uLmF0dHJpYnV0ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ2V0X3N0b2NrX3F1YW50aXR5ID0gdmFyaWF0aW9uLnN0b2NrX3F1YW50aXR5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjaGVja2VtcHR5a2V5ID0gYmFzZS5jaGVja2VtcHR5a2V5KGF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzW2F0dHJpYnV0ZV9uYW1lXSA9PSB2YWx1ZSB8fCAhYXR0cmlidXRlc1thdHRyaWJ1dGVfbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzZWxlY3RlZF92YWx1ZS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhhc1ZhbHVlID0gT2JqZWN0LnZhbHVlcyhhdHRyaWJ1dGVzKS5pbmNsdWRlcyhzZWxlY3RlZF92YWx1ZVtqXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNWYWx1ZSA9PT0gZmFsc2UgJiYgc2VsZWN0ZWRfYXR0cmlidXRlW2pdICE9PSBhdHRyaWJ1dGVfbmFtZSAmJiBhdHRyaWJ1dGVzW2F0dHJpYnV0ZV9uYW1lXSAmJiAhY2hlY2tlbXB0eWtleS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRfc3RvY2tfcXVhbnRpdHkgPSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tlbXB0eWtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY2hlY2tlbXB0eWtleS5pbmNsdWRlcyhzZWxlY3RlZF9hdHRyaWJ1dGVbal0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoYXNWYWx1ZSA9IE9iamVjdC52YWx1ZXMoYXR0cmlidXRlcykuaW5jbHVkZXMoc2VsZWN0ZWRfdmFsdWVbal0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNWYWx1ZSA9PT0gZmFsc2UgJiYgc2VsZWN0ZWRfYXR0cmlidXRlW2pdICE9PSBhdHRyaWJ1dGVfbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0X3N0b2NrX3F1YW50aXR5ID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b2NrX3F1YW50aXR5ICs9IGdldF9zdG9ja19xdWFudGl0eTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5zd2F0Y2gtaXRlbS1zdG9jay1jb3VudCcpLnRleHQoc3RvY2tfcXVhbnRpdHkgKyAnIGxlZnQnKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNlbGVjdGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKCBfVlBTLm9wdGlvbi5hZHZhbmNlZC5zaG93X3NlbGVjdGVkX3ZhcmlhdGlvbiAhPT0gJ29uJyApe1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5vbignd29vY29tbWVyY2VfdmFyaWF0aW9uX2hhc19jaGFuZ2VkLnZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIGlmICgkKCdib2R5JykuaGFzQ2xhc3MoJ3ZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMtc2hvdy1zZWxlY3RlZC1hdHRyaWJ1dGUnKSkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ2xpLnN3YXRjaC1pdGVtJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdzd2F0Y2gtaXRlbS1zZWxlY3RlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRpdGxlID0gJCh0aGlzKS5kYXRhKCd0aXRsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnBhcmVudHMoJ3RyJykuZmluZCgndGQubGFiZWwgLnNlbGVjdGVkLWF0dHJpYnV0ZScpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHRtbCA9ICQodGhpcykucGFyZW50cygndHInKS5maW5kKCd0ZC5sYWJlbCcpLmFwcGVuZCgnPHNwYW4gY2xhc3M9XCJzZWxlY3RlZC1hdHRyaWJ1dGVcIj48L3NwYW4+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5maW5kKCd0ZC5sYWJlbCAuc2VsZWN0ZWQtYXR0cmlidXRlJykudGV4dCgnICcrX1ZQUy5vcHRpb24uYWR2YW5jZWQubGFiZWxfc2VwYXJhdG9yKycgJyArIHRpdGxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykucGFyZW50KCkuZmluZCgnLnN3YXRjaC1pdGVtLXNlbGVjdGVkJykubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZmluZCgndGQubGFiZWwgLnNlbGVjdGVkLWF0dHJpYnV0ZScpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGNoZWNrZW1wdHlrZXk6IGZ1bmN0aW9uKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIHZhciBlbXB0eSA9IFtdXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhhdHRyaWJ1dGVzKSkge1xuICAgICAgICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZW1wdHkucHVzaChrZXkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVtcHR5O1xuICAgICAgICB9LFxuICAgXG4gICAgfSk7XG5cbiAgICAkLmZuWydWUFMnXSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghJC5kYXRhKHRoaXMsICdGTl9WUFMnKSkge1xuICAgICAgICAgICAgICAgICQuZGF0YSh0aGlzLCAnRk5fVlBTJywgbmV3IFZQU1BsdWdpbih0aGlzLCBvcHRpb25zKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG59KShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuKGZ1bmN0aW9uKCQpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgJChkb2N1bWVudCkub24oJ3djX3ZhcmlhdGlvbl9mb3JtLnZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMnLCAnLnZhcmlhdGlvbnNfZm9ybTpub3QoLnZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMtbG9hZGVkKScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICQodGhpcykuVlBTKCk7XG4gICAgfSk7XG59KShqUXVlcnkpOzsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=