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
/*!***************************!*\
  !*** ./admin/src/main.js ***!
  \***************************/
(function($) {
    'use strict';
    $(document).ready(function() {
        $('body').on('click', '.variable-product-swatches-image-field-wrapper .upload-image-button', function() {
            var base = $(this).parents('.variable-product-swatches-image-field-wrapper');
            
            console.log(wp);
            console.log(wp.media);
            console.log(wp.media);

            var frame = void 0;
            if (typeof wp !== 'undefined' && wp.media ) {

                if (frame) {
                    frame.open();
                    return;
                }
                frame = wp.media.frames.select_image = wp.media({
                    title: _VPS.media_title,
                    button: {
                        text: _VPS.button_title
                    },
                    multiple: false
                });
                frame.on('select', function() {
                    var attachment = frame.state().get('selection').first().toJSON();
                    if ($.trim(attachment.id) !== '') {
                        var url = typeof attachment.sizes.thumbnail === 'undefined' ? attachment.sizes.full.url : attachment.sizes.thumbnail.url;
                        $(base).find('.attachment-id').val(attachment.id);
                        $(base).find('.image-preview img').attr('src', url);
                        $(base).find('.remove-image-button').show();
                    }
                });
                frame.on('open', function() {
                    var selection = frame.state().get('selection');
                    var current = $(base).prev().val();
                    var attachment = wp.media.attachment(current);
                    attachment.fetch();
                    selection.add(attachment ? [attachment] : []);
                });
                frame.open();
            }
        });
        $('body').on('click', '.variable-product-swatches-image-field-wrapper .remove-image-button', function() {
            var base = $(this).parents('.variable-product-swatches-image-field-wrapper');
            $(base).find('.attachment-id').val('');
            $(base).find('.image-preview img').attr('src', _VPS.placeholder_img)
        })
    })
})(jQuery);
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************************!*\
  !*** ./admin/src/assets/scss/app.scss ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy1hZG1pbi5qcyIsIm1hcHBpbmdzIjoiO1VBQUE7VUFDQTs7Ozs7V0NEQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMLENBQUMsVTs7Ozs7Ozs7OztBQ2pERCIsInNvdXJjZXMiOlsid2VicGFjazovL3ZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3ZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMvLi9hZG1pbi9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly92YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzLy4vYWRtaW4vc3JjL2Fzc2V0cy9zY3NzL2FwcC5zY3NzP2YyM2YiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIihmdW5jdGlvbigkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy52YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzLWltYWdlLWZpZWxkLXdyYXBwZXIgLnVwbG9hZC1pbWFnZS1idXR0b24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBiYXNlID0gJCh0aGlzKS5wYXJlbnRzKCcudmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy1pbWFnZS1maWVsZC13cmFwcGVyJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHdwKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHdwLm1lZGlhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHdwLm1lZGlhKTtcblxuICAgICAgICAgICAgdmFyIGZyYW1lID0gdm9pZCAwO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB3cCAhPT0gJ3VuZGVmaW5lZCcgJiYgd3AubWVkaWEgKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZnJhbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZnJhbWUub3BlbigpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZyYW1lID0gd3AubWVkaWEuZnJhbWVzLnNlbGVjdF9pbWFnZSA9IHdwLm1lZGlhKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IF9WUFMubWVkaWFfdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogX1ZQUy5idXR0b25fdGl0bGVcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlwbGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZnJhbWUub24oJ3NlbGVjdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0YWNobWVudCA9IGZyYW1lLnN0YXRlKCkuZ2V0KCdzZWxlY3Rpb24nKS5maXJzdCgpLnRvSlNPTigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoJC50cmltKGF0dGFjaG1lbnQuaWQpICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVybCA9IHR5cGVvZiBhdHRhY2htZW50LnNpemVzLnRodW1ibmFpbCA9PT0gJ3VuZGVmaW5lZCcgPyBhdHRhY2htZW50LnNpemVzLmZ1bGwudXJsIDogYXR0YWNobWVudC5zaXplcy50aHVtYm5haWwudXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChiYXNlKS5maW5kKCcuYXR0YWNobWVudC1pZCcpLnZhbChhdHRhY2htZW50LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoYmFzZSkuZmluZCgnLmltYWdlLXByZXZpZXcgaW1nJykuYXR0cignc3JjJywgdXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoYmFzZSkuZmluZCgnLnJlbW92ZS1pbWFnZS1idXR0b24nKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmcmFtZS5vbignb3BlbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0aW9uID0gZnJhbWUuc3RhdGUoKS5nZXQoJ3NlbGVjdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudCA9ICQoYmFzZSkucHJldigpLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0YWNobWVudCA9IHdwLm1lZGlhLmF0dGFjaG1lbnQoY3VycmVudCk7XG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaG1lbnQuZmV0Y2goKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uLmFkZChhdHRhY2htZW50ID8gW2F0dGFjaG1lbnRdIDogW10pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZyYW1lLm9wZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLnZhcmlhYmxlLXByb2R1Y3Qtc3dhdGNoZXMtaW1hZ2UtZmllbGQtd3JhcHBlciAucmVtb3ZlLWltYWdlLWJ1dHRvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGJhc2UgPSAkKHRoaXMpLnBhcmVudHMoJy52YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzLWltYWdlLWZpZWxkLXdyYXBwZXInKTtcbiAgICAgICAgICAgICQoYmFzZSkuZmluZCgnLmF0dGFjaG1lbnQtaWQnKS52YWwoJycpO1xuICAgICAgICAgICAgJChiYXNlKS5maW5kKCcuaW1hZ2UtcHJldmlldyBpbWcnKS5hdHRyKCdzcmMnLCBfVlBTLnBsYWNlaG9sZGVyX2ltZylcbiAgICAgICAgfSlcbiAgICB9KVxufSkoalF1ZXJ5KTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=