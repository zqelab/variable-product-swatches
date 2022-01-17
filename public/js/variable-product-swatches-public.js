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
console.log(_VPS);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy1wdWJsaWMuanMiLCJtYXBwaW5ncyI6IjtVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7O0FDTkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUNBQW1DLElBQUk7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxxQkFBcUI7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0Msb0NBQW9DO0FBQzVFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsMkJBQTJCO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMsVzs7Ozs7Ozs7OztBQ3ZPRCIsInNvdXJjZXMiOlsid2VicGFjazovL3ZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3ZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMvLi9wdWJsaWMvc3JjL21haW4uanMiLCJ3ZWJwYWNrOi8vdmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy8uL3B1YmxpYy9zcmMvYXNzZXRzL3Njc3MvYXBwLnNjc3MiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIihmdW5jdGlvbigkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBWUFNQbHVnaW4oZWxlbWVudCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLnNldHRpbmdzID0gJC5leHRlbmQoe30sIHt9LCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudCk7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ3ZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMtbG9hZGVkJyk7XG4gICAgICAgIHRoaXMucHJvZHVjdF92YXJpYXRpb25zID0gdGhpcy4kZWxlbWVudC5kYXRhKCdwcm9kdWN0X3ZhcmlhdGlvbnMnKSB8fCBbXTtcbiAgICAgICAgdGhpcy5pc19hamF4X3ZhcmlhdGlvbiA9IHRoaXMucHJvZHVjdF92YXJpYXRpb25zLmxlbmd0aCA+IDA7XG5cblxuICAgICAgICB0aGlzLndyYXBwZXIgPSB0aGlzLiRlbGVtZW50LmNsb3Nlc3QoJy50eXBlLXByb2R1Y3QnKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVGaWVsZHMgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy52YXJpYXRpb25zIHNlbGVjdCcpO1xuICAgICAgICB0aGlzLmNhcnRfYnV0dG9uID0gdGhpcy4kZWxlbWVudC5maW5kKCcudnBzX2FkZF90b19jYXJ0X2J1dHRvbicpO1xuICAgICAgICB0aGlzLmNhcnRfYnV0dG9uX2FqYXggPSB0aGlzLiRlbGVtZW50LmZpbmQoJy52cHNfYWpheF9hZGRfdG9fY2FydCcpO1xuICAgICAgICB0aGlzLmlzX2FyY2hpdmUgPSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCd2cHNfYXJjaGl2ZV92YXJpYXRpb25zX2Zvcm0nKTtcbiAgICAgICAgdGhpcy5pc19zaW5nbGUgPSAhdGhpcy5pc19hcmNoaXZlO1xuXG4gICAgICAgIHRoaXMub3B0aW9uID0gX1ZQUy5vcHRpb25cbmNvbnNvbGUubG9nKF9WUFMpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgdGhpcy50b29sdGlwKCk7XG4gICAgICAgIHRoaXMuc3RvY2tjb3VudCgpXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQoKVxuXG4gICAgfVxuICAgICQuZXh0ZW5kKFZQU1BsdWdpbi5wcm90b3R5cGUsIHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYmFzZSA9IHRoaXNcblxuICAgICAgICAgICAgdmFyIHRyaWdnZXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCd1bC5zd2F0Y2hlcy1pdGVtcy13cmFwcGVyJykuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3QgPSAkKHRoaXMpLnNpYmxpbmdzKCdzZWxlY3QudmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy1yYXctc2VsZWN0Jyk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0cmlnZ2VyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnRyaWdnZXIoJ2ZvY3VzaW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAxMDApXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5vbignY2xpY2sudmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcycsICdsaScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLmRhdGEoJ3ZhbHVlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIGJhc2Uub3B0aW9uLmFkdmFuY2VkLmNsZWFyX29uX3Jlc2VsZWN0ICYmIHNlbGVjdC52YWwoKSAmJiBzZWxlY3QudmFsKCkgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QudmFsKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC52YWwodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnRyaWdnZXIoJ2ZvY3VzaW4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBiYXNlID0gdGhpc1xuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5vbignd29vY29tbWVyY2VfdmFyaWF0aW9uX2hhc19jaGFuZ2VkLnZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgndWwuc3dhdGNoZXMtaXRlbXMtd3JhcHBlcicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3QgPSAkKHRoaXMpLnNpYmxpbmdzKCdzZWxlY3QudmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy1yYXctc2VsZWN0Jyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzd2F0Y2hlcyA9ICQodGhpcykuZmluZCgnbGknKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbnNfc2VsZWN0ZWQgPSBzZWxlY3QuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykubGVuZ3RoID09PSAwID8gc2VsZWN0LmZpbmQoJ29wdGlvbicpLmVxKDEpLnZhbCgpIDogc2VsZWN0LmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNlbGVjdC5maW5kKCdvcHRpb24nKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbnNfZGlzYWJsZWQgPSBzZWxlY3QuZmluZCgnb3B0aW9uOmRpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RzID0gW107XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdHMucHVzaCgkKHRoaXMpLnZhbCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXNhYmxlZF9zZWxlY3RzID0gW107XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNfZGlzYWJsZWQuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkX3NlbGVjdHMucHVzaCgkKHRoaXMpLnZhbCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbl9zdG9ja3MgPSBfLmRpZmZlcmVuY2Uoc2VsZWN0cywgZGlzYWJsZWRfc2VsZWN0cyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiYXNlLmlzX2FqYXhfdmFyaWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2F0Y2hlcy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVfdmFsdWUgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtdmFsdWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdzd2F0Y2gtaXRlbS1zZWxlY3RlZCcpLmFkZENsYXNzKCdzd2F0Y2gtaXRlbS1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfLmluY2x1ZGVzKGluX3N0b2NrcywgYXR0cmlidXRlX3ZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdzd2F0Y2gtaXRlbS1zZWxlY3RlZCBzd2F0Y2gtaXRlbS1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlX3ZhbHVlID09PSBvcHRpb25zX3NlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdzd2F0Y2gtaXRlbS1zZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3YXRjaGVzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZV92YWx1ZSA9ICQodGhpcykuYXR0cignZGF0YS12YWx1ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3N3YXRjaC1pdGVtLXNlbGVjdGVkJykuYWRkQ2xhc3MoJ3N3YXRjaC1pdGVtLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZXMoaW5fc3RvY2tzLCBhdHRyaWJ1dGVfdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ3N3YXRjaC1pdGVtLXNlbGVjdGVkIHN3YXRjaC1pdGVtLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVfdmFsdWUgPT09IG9wdGlvbnNfc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3N3YXRjaC1pdGVtLXNlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIHRvb2x0aXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiggX1ZQUy5vcHRpb24uYWR2YW5jZWQudG9vbHRpcCAhPT0gJ29uJyApe1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5vbignd29vY29tbWVyY2VfdmFyaWF0aW9uX2hhc19jaGFuZ2VkLnZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnbGkuc3dhdGNoLWl0ZW0nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBwbGFjZW1lbnQgPSBfVlBTLm9wdGlvbi5hZHZhbmNlZC50b29sdGlwX3BsYWNlbWVudCA/IF9WUFMub3B0aW9uLmFkdmFuY2VkLnRvb2x0aXBfcGxhY2VtZW50IDogJ3RvcCc7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0aXRsZSA9ICQodGhpcykuZGF0YSgndGl0bGUnKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5tb3VzZW92ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkKHRoaXMpLmhhc0NsYXNzKCdzd2F0Y2gtaXRlbS1yYWRpbycpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5maW5kKCcuc3dhdGNoLWl0ZW0tc3Bhbi1yYWRpbycpLmZpbmQoJy5zd2F0Y2gtaXRlbS10b29sdGlwJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnN3YXRjaC1pdGVtLXNwYW4tcmFkaW8nKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJzd2F0Y2gtaXRlbS10b29sdGlwIHN3YXRjaC1pdGVtLXRvb2x0aXAtJyArIHBsYWNlbWVudCArICdcIj4nICsgdGl0bGUgKyAnPC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmZpbmQoJy5zd2F0Y2gtaXRlbS10b29sdGlwJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYXBwZW5kKCc8ZGl2IGNsYXNzPVwic3dhdGNoLWl0ZW0tdG9vbHRpcCBzd2F0Y2gtaXRlbS10b29sdGlwLScgKyBwbGFjZW1lbnQgKyAnXCI+JyArIHRpdGxlICsgJzwvZGl2PicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5tb3VzZWxlYXZlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5zd2F0Y2gtaXRlbS10b29sdGlwJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIHN0b2NrY291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKCAhIHRoaXMuaXNfYWpheF92YXJpYXRpb24gKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgdmFyIGJhc2UgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQub24oJ3dvb2NvbW1lcmNlX3ZhcmlhdGlvbl9oYXNfY2hhbmdlZC52YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkID0gJCh0aGlzKS5maW5kKCd1bC5zd2F0Y2hlcy1pdGVtcy13cmFwcGVyJykuZmluZCgnbGkuc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKVxuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWRfdmFsdWUgPSBbXVxuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWRfYXR0cmlidXRlID0gW11cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxlY3RlZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRfdmFsdWUucHVzaCgkKHNlbGVjdGVkW2ldKS5kYXRhKCd2YWx1ZScpKVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRfYXR0cmlidXRlLnB1c2goJChzZWxlY3RlZFtpXSkucGFyZW50KCkuZGF0YSgnYXR0cmlidXRlX25hbWUnKSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ2xpLnN3YXRjaC1pdGVtJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9ICQodGhpcykuZGF0YSgndmFsdWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVfbmFtZSA9ICQodGhpcykucGFyZW50KCkuZGF0YSgnYXR0cmlidXRlX25hbWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdG9ja19xdWFudGl0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJhc2UucHJvZHVjdF92YXJpYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhcmlhdGlvbiA9IGJhc2UucHJvZHVjdF92YXJpYXRpb25zW2ldXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSB2YXJpYXRpb24uYXR0cmlidXRlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBnZXRfc3RvY2tfcXVhbnRpdHkgPSB2YXJpYXRpb24uc3RvY2tfcXVhbnRpdHk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoZWNrZW1wdHlrZXkgPSBiYXNlLmNoZWNrZW1wdHlrZXkoYXR0cmlidXRlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXNbYXR0cmlidXRlX25hbWVdID09IHZhbHVlIHx8ICFhdHRyaWJ1dGVzW2F0dHJpYnV0ZV9uYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNlbGVjdGVkX3ZhbHVlLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGFzVmFsdWUgPSBPYmplY3QudmFsdWVzKGF0dHJpYnV0ZXMpLmluY2x1ZGVzKHNlbGVjdGVkX3ZhbHVlW2pdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc1ZhbHVlID09PSBmYWxzZSAmJiBzZWxlY3RlZF9hdHRyaWJ1dGVbal0gIT09IGF0dHJpYnV0ZV9uYW1lICYmIGF0dHJpYnV0ZXNbYXR0cmlidXRlX25hbWVdICYmICFjaGVja2VtcHR5a2V5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldF9zdG9ja19xdWFudGl0eSA9IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGVja2VtcHR5a2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjaGVja2VtcHR5a2V5LmluY2x1ZGVzKHNlbGVjdGVkX2F0dHJpYnV0ZVtqXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhhc1ZhbHVlID0gT2JqZWN0LnZhbHVlcyhhdHRyaWJ1dGVzKS5pbmNsdWRlcyhzZWxlY3RlZF92YWx1ZVtqXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc1ZhbHVlID09PSBmYWxzZSAmJiBzZWxlY3RlZF9hdHRyaWJ1dGVbal0gIT09IGF0dHJpYnV0ZV9uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRfc3RvY2tfcXVhbnRpdHkgPSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvY2tfcXVhbnRpdHkgKz0gZ2V0X3N0b2NrX3F1YW50aXR5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnN3YXRjaC1pdGVtLXN0b2NrLWNvdW50JykudGV4dChzdG9ja19xdWFudGl0eSArICcgbGVmdCcpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc2VsZWN0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoIF9WUFMub3B0aW9uLmFkdmFuY2VkLnNob3dfc2VsZWN0ZWRfdmFyaWF0aW9uICE9PSAnb24nICl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCd3b29jb21tZXJjZV92YXJpYXRpb25faGFzX2NoYW5nZWQudmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoJ2JvZHknKS5oYXNDbGFzcygndmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy1zaG93LXNlbGVjdGVkLWF0dHJpYnV0ZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnbGkuc3dhdGNoLWl0ZW0nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ3N3YXRjaC1pdGVtLXNlbGVjdGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGl0bGUgPSAkKHRoaXMpLmRhdGEoJ3RpdGxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykucGFyZW50cygndHInKS5maW5kKCd0ZC5sYWJlbCAuc2VsZWN0ZWQtYXR0cmlidXRlJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodG1sID0gJCh0aGlzKS5wYXJlbnRzKCd0cicpLmZpbmQoJ3RkLmxhYmVsJykuYXBwZW5kKCc8c3BhbiBjbGFzcz1cInNlbGVjdGVkLWF0dHJpYnV0ZVwiPjwvc3Bhbj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLmZpbmQoJ3RkLmxhYmVsIC5zZWxlY3RlZC1hdHRyaWJ1dGUnKS50ZXh0KCcgJytfVlBTLm9wdGlvbi5hZHZhbmNlZC5sYWJlbF9zZXBhcmF0b3IrJyAnICsgdGl0bGUpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnQoKS5maW5kKCcuc3dhdGNoLWl0ZW0tc2VsZWN0ZWQnKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5maW5kKCd0ZC5sYWJlbCAuc2VsZWN0ZWQtYXR0cmlidXRlJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgY2hlY2tlbXB0eWtleTogZnVuY3Rpb24oYXR0cmlidXRlcykge1xuICAgICAgICAgICAgdmFyIGVtcHR5ID0gW11cbiAgICAgICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBlbXB0eS5wdXNoKGtleSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZW1wdHk7XG4gICAgICAgIH0sXG4gICBcbiAgICB9KTtcblxuICAgICQuZm5bJ1ZQUyddID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCEkLmRhdGEodGhpcywgJ0ZOX1ZQUycpKSB7XG4gICAgICAgICAgICAgICAgJC5kYXRhKHRoaXMsICdGTl9WUFMnLCBuZXcgVlBTUGx1Z2luKHRoaXMsIG9wdGlvbnMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbn0pKGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XG4oZnVuY3Rpb24oJCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAkKGRvY3VtZW50KS5vbignd2NfdmFyaWF0aW9uX2Zvcm0udmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcycsICcudmFyaWF0aW9uc19mb3JtOm5vdCgudmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy1sb2FkZWQpJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgJCh0aGlzKS5WUFMoKTtcbiAgICB9KTtcbn0pKGpRdWVyeSk7OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==