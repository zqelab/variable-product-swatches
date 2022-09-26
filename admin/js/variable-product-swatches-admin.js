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
        $('.variable-product-swatches-image-field-wrapper').each(function() {
            var base = this;
            $(this).find('.upload-image-button').click(function() {
                var frame = void 0;
                if (typeof wp !== 'undefined' && wp.media && wp.media.editor) {
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
            })

            $(this).find('.remove-image-button').click(function() {
                $(base).find('.attachment-id').val('');
                $(base).find('.image-preview img').attr('src', _VPS.placeholder_img)
            })
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