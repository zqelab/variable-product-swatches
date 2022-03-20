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
        this.element = element; // .variations_form:not(.variable-product-swatches-loaded)
        this.settings = $.extend({}, {}, options);
        this.$element = $(element);
        this.$element.addClass('variable-product-swatches-loaded');
        this.product_variations = this.$element.data('product_variations') || [];
        this.is_ajax_variation = this.product_variations.length > 0;
        console.log(_VPS.option)

        this.init();
        this.update();
        this.tooltip();
        this.stockcount()
        this.selected()

    }
    $.extend(VPSPlugin.prototype, {
        init: function() {
            var base = this
            this.$element.find('ul.swatches-items-wrapper').each(function(i, el) {
                var select = $(this).siblings('select.variable-product-swatches-raw-select');
                $(this).on('click.variable-product-swatches', 'li', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var value = $(this).data('value');
                    if (_VPS.option.advanced.clear_on_reselect && select.val() && select.val() === value) {
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
                })
            })
        },
        tooltip: function() {
            if (_VPS.option.advanced.tooltip == 'on') {
                this.$element.find('ul.swatches-items-wrapper').each(function(index, el) {
                    $(this).find('li.swatch-item').each(function(index, el) {
                        $(this).mouseover(function() {
                            $(this).find('.swatch-item-tooltip').show();
                        })
                        $(this).mouseleave(function() {
                            $(this).find('.swatch-item-tooltip').hide();
                        })
                    })
                })
            }
        },
        stockcount: function() {
            if (this.is_ajax_variation) {
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
            if (_VPS.option.advanced.show_selected_variation == 'on') {
                this.$element.on('woocommerce_variation_has_changed.variable-product-swatches', function(event) {
                    if ($('body').hasClass('variable-product-swatches-show-selected-attribute')) {
                        $(this).find('li.swatch-item').each(function(index, el) {
                            console.log(_VPS.option);
                            if ($(this).hasClass('swatch-item-selected')) {
                                var title = $(this).data('title');
                                if ($(this).parents('tr').find('td.label > .selected-attribute, th.label > .selected-attribute').length === 0) {
                                    var html = $(this).parents('tr').find('td.label, th.label').append('<span class="selected-attribute"></span>');
                                }
                                $(this).parents('tr').find('td.label > .selected-attribute, th.label > .selected-attribute').text(' ' + _VPS.option.advanced.label_separator + ' ' + title)
                            }
                            if ($(this).parent().find('.swatch-item-selected').length == 0) {
                                $(this).parents('tr').find('td.label > .selected-attribute, th.label > .selected-attribute').remove();
                            }
                        })
                    }
                })
            }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy1wdWJsaWMuanMiLCJtYXBwaW5ncyI6IjtVQUFBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7O0FDTkE7QUFDQTs7QUFFQTtBQUNBLGdDQUFnQztBQUNoQyxtQ0FBbUMsSUFBSTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIscUJBQXFCO0FBQ3JCLGlCQUFpQjtBQUNqQjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxxQkFBcUI7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0Msb0NBQW9DO0FBQzVFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsMkJBQTJCO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxXOzs7Ozs7Ozs7O0FDL0tEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy8uL3B1YmxpYy9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly92YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzLy4vcHVibGljL3NyYy9hc3NldHMvc2Nzcy9hcHAuc2Nzcz80MmM5Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIoZnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgZnVuY3Rpb24gVlBTUGx1Z2luKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDsgLy8gLnZhcmlhdGlvbnNfZm9ybTpub3QoLnZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMtbG9hZGVkKVxuICAgICAgICB0aGlzLnNldHRpbmdzID0gJC5leHRlbmQoe30sIHt9LCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudCk7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ3ZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMtbG9hZGVkJyk7XG4gICAgICAgIHRoaXMucHJvZHVjdF92YXJpYXRpb25zID0gdGhpcy4kZWxlbWVudC5kYXRhKCdwcm9kdWN0X3ZhcmlhdGlvbnMnKSB8fCBbXTtcbiAgICAgICAgdGhpcy5pc19hamF4X3ZhcmlhdGlvbiA9IHRoaXMucHJvZHVjdF92YXJpYXRpb25zLmxlbmd0aCA+IDA7XG4gICAgICAgIGNvbnNvbGUubG9nKF9WUFMub3B0aW9uKVxuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICB0aGlzLnRvb2x0aXAoKTtcbiAgICAgICAgdGhpcy5zdG9ja2NvdW50KClcbiAgICAgICAgdGhpcy5zZWxlY3RlZCgpXG5cbiAgICB9XG4gICAgJC5leHRlbmQoVlBTUGx1Z2luLnByb3RvdHlwZSwge1xuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBiYXNlID0gdGhpc1xuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5maW5kKCd1bC5zd2F0Y2hlcy1pdGVtcy13cmFwcGVyJykuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3QgPSAkKHRoaXMpLnNpYmxpbmdzKCdzZWxlY3QudmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy1yYXctc2VsZWN0Jyk7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5vbignY2xpY2sudmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcycsICdsaScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLmRhdGEoJ3ZhbHVlJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfVlBTLm9wdGlvbi5hZHZhbmNlZC5jbGVhcl9vbl9yZXNlbGVjdCAmJiBzZWxlY3QudmFsKCkgJiYgc2VsZWN0LnZhbCgpID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3QudmFsKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdC50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3QudHJpZ2dlcignZm9jdXNpbicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBiYXNlID0gdGhpc1xuICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5vbignd29vY29tbWVyY2VfdmFyaWF0aW9uX2hhc19jaGFuZ2VkLnZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgndWwuc3dhdGNoZXMtaXRlbXMtd3JhcHBlcicpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3QgPSAkKHRoaXMpLnNpYmxpbmdzKCdzZWxlY3QudmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy1yYXctc2VsZWN0Jyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzd2F0Y2hlcyA9ICQodGhpcykuZmluZCgnbGknKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbnNfc2VsZWN0ZWQgPSBzZWxlY3QuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykubGVuZ3RoID09PSAwID8gc2VsZWN0LmZpbmQoJ29wdGlvbicpLmVxKDEpLnZhbCgpIDogc2VsZWN0LmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHNlbGVjdC5maW5kKCdvcHRpb24nKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbnNfZGlzYWJsZWQgPSBzZWxlY3QuZmluZCgnb3B0aW9uOmRpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RzID0gW107XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdHMucHVzaCgkKHRoaXMpLnZhbCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXNhYmxlZF9zZWxlY3RzID0gW107XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNfZGlzYWJsZWQuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkX3NlbGVjdHMucHVzaCgkKHRoaXMpLnZhbCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbl9zdG9ja3MgPSBfLmRpZmZlcmVuY2Uoc2VsZWN0cywgZGlzYWJsZWRfc2VsZWN0cyk7XG4gICAgICAgICAgICAgICAgICAgIHN3YXRjaGVzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlX3ZhbHVlID0gJCh0aGlzKS5hdHRyKCdkYXRhLXZhbHVlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdzd2F0Y2gtaXRlbS1zZWxlY3RlZCcpLmFkZENsYXNzKCdzd2F0Y2gtaXRlbS1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8uaW5jbHVkZXMoaW5fc3RvY2tzLCBhdHRyaWJ1dGVfdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnc3dhdGNoLWl0ZW0tc2VsZWN0ZWQgc3dhdGNoLWl0ZW0tZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlX3ZhbHVlID09PSBvcHRpb25zX3NlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3N3YXRjaC1pdGVtLXNlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICB0b29sdGlwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChfVlBTLm9wdGlvbi5hZHZhbmNlZC50b29sdGlwID09ICdvbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRlbGVtZW50LmZpbmQoJ3VsLnN3YXRjaGVzLWl0ZW1zLXdyYXBwZXInKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ2xpLnN3YXRjaC1pdGVtJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykubW91c2VvdmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnN3YXRjaC1pdGVtLXRvb2x0aXAnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5tb3VzZWxlYXZlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLnN3YXRjaC1pdGVtLXRvb2x0aXAnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHN0b2NrY291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNfYWpheF92YXJpYXRpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgYmFzZSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5vbignd29vY29tbWVyY2VfdmFyaWF0aW9uX2hhc19jaGFuZ2VkLnZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSAkKHRoaXMpLmZpbmQoJ3VsLnN3YXRjaGVzLWl0ZW1zLXdyYXBwZXInKS5maW5kKCdsaS5zd2F0Y2gtaXRlbS1zZWxlY3RlZCcpXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZF92YWx1ZSA9IFtdXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZF9hdHRyaWJ1dGUgPSBbXVxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZF92YWx1ZS5wdXNoKCQoc2VsZWN0ZWRbaV0pLmRhdGEoJ3ZhbHVlJykpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZF9hdHRyaWJ1dGUucHVzaCgkKHNlbGVjdGVkW2ldKS5wYXJlbnQoKS5kYXRhKCdhdHRyaWJ1dGVfbmFtZScpKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnbGkuc3dhdGNoLWl0ZW0nKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gJCh0aGlzKS5kYXRhKCd2YWx1ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZV9uYW1lID0gJCh0aGlzKS5wYXJlbnQoKS5kYXRhKCdhdHRyaWJ1dGVfbmFtZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0b2NrX3F1YW50aXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmFzZS5wcm9kdWN0X3ZhcmlhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFyaWF0aW9uID0gYmFzZS5wcm9kdWN0X3ZhcmlhdGlvbnNbaV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHZhcmlhdGlvbi5hdHRyaWJ1dGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdldF9zdG9ja19xdWFudGl0eSA9IHZhcmlhdGlvbi5zdG9ja19xdWFudGl0eTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hlY2tlbXB0eWtleSA9IGJhc2UuY2hlY2tlbXB0eWtleShhdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVfbmFtZV0gPT0gdmFsdWUgfHwgIWF0dHJpYnV0ZXNbYXR0cmlidXRlX25hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2VsZWN0ZWRfdmFsdWUubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoYXNWYWx1ZSA9IE9iamVjdC52YWx1ZXMoYXR0cmlidXRlcykuaW5jbHVkZXMoc2VsZWN0ZWRfdmFsdWVbal0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzVmFsdWUgPT09IGZhbHNlICYmIHNlbGVjdGVkX2F0dHJpYnV0ZVtqXSAhPT0gYXR0cmlidXRlX25hbWUgJiYgYXR0cmlidXRlc1thdHRyaWJ1dGVfbmFtZV0gJiYgIWNoZWNrZW1wdHlrZXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0X3N0b2NrX3F1YW50aXR5ID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrZW1wdHlrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNoZWNrZW1wdHlrZXkuaW5jbHVkZXMoc2VsZWN0ZWRfYXR0cmlidXRlW2pdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGFzVmFsdWUgPSBPYmplY3QudmFsdWVzKGF0dHJpYnV0ZXMpLmluY2x1ZGVzKHNlbGVjdGVkX3ZhbHVlW2pdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzVmFsdWUgPT09IGZhbHNlICYmIHNlbGVjdGVkX2F0dHJpYnV0ZVtqXSAhPT0gYXR0cmlidXRlX25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldF9zdG9ja19xdWFudGl0eSA9IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9ja19xdWFudGl0eSArPSBnZXRfc3RvY2tfcXVhbnRpdHk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcuc3dhdGNoLWl0ZW0tc3RvY2stY291bnQnKS50ZXh0KHN0b2NrX3F1YW50aXR5ICsgJyBsZWZ0JylcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzZWxlY3RlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoX1ZQUy5vcHRpb24uYWR2YW5jZWQuc2hvd19zZWxlY3RlZF92YXJpYXRpb24gPT0gJ29uJykge1xuICAgICAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQub24oJ3dvb2NvbW1lcmNlX3ZhcmlhdGlvbl9oYXNfY2hhbmdlZC52YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoJ2JvZHknKS5oYXNDbGFzcygndmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy1zaG93LXNlbGVjdGVkLWF0dHJpYnV0ZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ2xpLnN3YXRjaC1pdGVtJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhfVlBTLm9wdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ3N3YXRjaC1pdGVtLXNlbGVjdGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRpdGxlID0gJCh0aGlzKS5kYXRhKCd0aXRsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnRzKCd0cicpLmZpbmQoJ3RkLmxhYmVsID4gLnNlbGVjdGVkLWF0dHJpYnV0ZSwgdGgubGFiZWwgPiAuc2VsZWN0ZWQtYXR0cmlidXRlJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHRtbCA9ICQodGhpcykucGFyZW50cygndHInKS5maW5kKCd0ZC5sYWJlbCwgdGgubGFiZWwnKS5hcHBlbmQoJzxzcGFuIGNsYXNzPVwic2VsZWN0ZWQtYXR0cmlidXRlXCI+PC9zcGFuPicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5maW5kKCd0ZC5sYWJlbCA+IC5zZWxlY3RlZC1hdHRyaWJ1dGUsIHRoLmxhYmVsID4gLnNlbGVjdGVkLWF0dHJpYnV0ZScpLnRleHQoJyAnICsgX1ZQUy5vcHRpb24uYWR2YW5jZWQubGFiZWxfc2VwYXJhdG9yICsgJyAnICsgdGl0bGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnBhcmVudCgpLmZpbmQoJy5zd2F0Y2gtaXRlbS1zZWxlY3RlZCcpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndHInKS5maW5kKCd0ZC5sYWJlbCA+IC5zZWxlY3RlZC1hdHRyaWJ1dGUsIHRoLmxhYmVsID4gLnNlbGVjdGVkLWF0dHJpYnV0ZScpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjaGVja2VtcHR5a2V5OiBmdW5jdGlvbihhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICB2YXIgZW1wdHkgPSBbXVxuICAgICAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVtcHR5LnB1c2goa2V5KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlbXB0eTtcbiAgICAgICAgfSxcbiAgICB9KTtcbiAgICAkLmZuWydWUFMnXSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghJC5kYXRhKHRoaXMsICdGTl9WUFMnKSkge1xuICAgICAgICAgICAgICAgICQuZGF0YSh0aGlzLCAnRk5fVlBTJywgbmV3IFZQU1BsdWdpbih0aGlzLCBvcHRpb25zKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG59KShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuKGZ1bmN0aW9uKCQpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgJChkb2N1bWVudCkub24oJ3djX3ZhcmlhdGlvbl9mb3JtLnZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMnLCAnLnZhcmlhdGlvbnNfZm9ybTpub3QoLnZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMtbG9hZGVkKScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICQodGhpcykuVlBTKCk7XG4gICAgfSk7XG59KShqUXVlcnkpOzsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=