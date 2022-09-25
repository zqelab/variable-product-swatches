/*! For license information please see variable-product-swatches-admin.js.LICENSE.txt */
(()=>{var e={r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};!function(e){"use strict";e(document).ready((function(){e(".variable-product-swatches-image-field-wrapper").each((function(){var t=this;e(this).find(".upload-image-button").click((function(){var i=void 0;if("undefined"!=typeof wp&&wp.media&&wp.media.editor){if(i)return void i.open();(i=wp.media.frames.select_image=wp.media({title:_VPS.media_title,button:{text:_VPS.button_title},multiple:!1})).on("select",(function(){var a=i.state().get("selection").first().toJSON();if(""!==e.trim(a.id)){var n=void 0===a.sizes.thumbnail?a.sizes.full.url:a.sizes.thumbnail.url;e(t).find(".attachment-id").val(a.id),e(t).find(".image-preview img").attr("src",n),e(t).find(".remove-image-button").show()}})),i.on("open",(function(){var a=i.state().get("selection"),n=e(t).prev().val(),o=wp.media.attachment(n);o.fetch(),a.add(o?[o]:[])})),i.open()}})),e(this).find(".remove-image-button").click((function(){e(t).find(".attachment-id").val(""),e(t).find(".image-preview img").attr("src",_VPS.placeholder_img)}))}))}))}(jQuery),(()=>{"use strict";e.r(t)})()})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy1hZG1pbi5qcyIsIm1hcHBpbmdzIjoiO01BQ0EsSUFBSUEsRUFBc0IsQ0NBMUJBLEVBQXlCQyxJQUNILG9CQUFYQyxRQUEwQkEsT0FBT0MsYUFDMUNDLE9BQU9DLGVBQWVKLEVBQVNDLE9BQU9DLFlBQWEsQ0FBRUcsTUFBTyxXQUU3REYsT0FBT0MsZUFBZUosRUFBUyxhQUFjLENBQUVLLE9BQU8sWUNMdkQsU0FBVUMsR0FDTixhQUVBQSxFQUFFQyxVQUFVQyxPQUFNLFdBQ2RGLEVBQUUsa0RBQWtERyxNQUFLLFdBQ3JELElBQUlDLEVBQU9DLEtBQ1hMLEVBQUVLLE1BQU1DLEtBQUssd0JBQXdCQyxPQUFNLFdBQ3ZDLElBQUlDLE9BQVEsRUFDWixHQUFrQixvQkFBUEMsSUFBc0JBLEdBQUdDLE9BQVNELEdBQUdDLE1BQU1DLE9BQVEsQ0FDMUQsR0FBSUgsRUFFQSxZQURBQSxFQUFNSSxRQUdWSixFQUFRQyxHQUFHQyxNQUFNRyxPQUFPQyxhQUFlTCxHQUFHQyxNQUFNLENBQzVDSyxNQUFPQyxLQUFLQyxZQUNaQyxPQUFRLENBQ0pDLEtBQU1ILEtBQUtJLGNBRWZDLFVBQVUsS0FFUkMsR0FBRyxVQUFVLFdBQ2YsSUFBSUMsRUFBYWYsRUFBTWdCLFFBQVFDLElBQUksYUFBYUMsUUFBUUMsU0FDeEQsR0FBOEIsS0FBMUIzQixFQUFFNEIsS0FBS0wsRUFBV00sSUFBWSxDQUM5QixJQUFJQyxPQUE0QyxJQUEvQlAsRUFBV1EsTUFBTUMsVUFBNEJULEVBQVdRLE1BQU1FLEtBQUtILElBQU1QLEVBQVdRLE1BQU1DLFVBQVVGLElBQ3JIOUIsRUFBRUksR0FBTUUsS0FBSyxrQkFBa0I0QixJQUFJWCxFQUFXTSxJQUM5QzdCLEVBQUVJLEdBQU1FLEtBQUssc0JBQXNCNkIsS0FBSyxNQUFPTCxHQUMvQzlCLEVBQUVJLEdBQU1FLEtBQUssd0JBQXdCOEIsV0FHN0M1QixFQUFNYyxHQUFHLFFBQVEsV0FDYixJQUFJZSxFQUFZN0IsRUFBTWdCLFFBQVFDLElBQUksYUFDOUJhLEVBQVV0QyxFQUFFSSxHQUFNbUMsT0FBT0wsTUFDekJYLEVBQWFkLEdBQUdDLE1BQU1hLFdBQVdlLEdBQ3JDZixFQUFXaUIsUUFDWEgsRUFBVUksSUFBSWxCLEVBQWEsQ0FBQ0EsR0FBYyxPQUU5Q2YsRUFBTUksV0FJZFosRUFBRUssTUFBTUMsS0FBSyx3QkFBd0JDLE9BQU0sV0FDdkNQLEVBQUVJLEdBQU1FLEtBQUssa0JBQWtCNEIsSUFBSSxJQUNuQ2xDLEVBQUVJLEdBQU1FLEtBQUssc0JBQXNCNkIsS0FBSyxNQUFPbkIsS0FBSzBCLDBCQTFDcEUsQ0E4Q0dDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92YXJpYWJsZS1wcm9kdWN0LXN3YXRjaGVzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy8uL2FkbWluL3NyYy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIoZnVuY3Rpb24oJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcudmFyaWFibGUtcHJvZHVjdC1zd2F0Y2hlcy1pbWFnZS1maWVsZC13cmFwcGVyJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBiYXNlID0gdGhpcztcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnLnVwbG9hZC1pbWFnZS1idXR0b24nKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgZnJhbWUgPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB3cCAhPT0gJ3VuZGVmaW5lZCcgJiYgd3AubWVkaWEgJiYgd3AubWVkaWEuZWRpdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmcmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJhbWUub3BlbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZyYW1lID0gd3AubWVkaWEuZnJhbWVzLnNlbGVjdF9pbWFnZSA9IHdwLm1lZGlhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBfVlBTLm1lZGlhX3RpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogX1ZQUy5idXR0b25fdGl0bGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtdWx0aXBsZTogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGZyYW1lLm9uKCdzZWxlY3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRhY2htZW50ID0gZnJhbWUuc3RhdGUoKS5nZXQoJ3NlbGVjdGlvbicpLmZpcnN0KCkudG9KU09OKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJC50cmltKGF0dGFjaG1lbnQuaWQpICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1cmwgPSB0eXBlb2YgYXR0YWNobWVudC5zaXplcy50aHVtYm5haWwgPT09ICd1bmRlZmluZWQnID8gYXR0YWNobWVudC5zaXplcy5mdWxsLnVybCA6IGF0dGFjaG1lbnQuc2l6ZXMudGh1bWJuYWlsLnVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGJhc2UpLmZpbmQoJy5hdHRhY2htZW50LWlkJykudmFsKGF0dGFjaG1lbnQuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoYmFzZSkuZmluZCgnLmltYWdlLXByZXZpZXcgaW1nJykuYXR0cignc3JjJywgdXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGJhc2UpLmZpbmQoJy5yZW1vdmUtaW1hZ2UtYnV0dG9uJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgZnJhbWUub24oJ29wZW4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rpb24gPSBmcmFtZS5zdGF0ZSgpLmdldCgnc2VsZWN0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudCA9ICQoYmFzZSkucHJldigpLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dGFjaG1lbnQgPSB3cC5tZWRpYS5hdHRhY2htZW50KGN1cnJlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNobWVudC5mZXRjaCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uLmFkZChhdHRhY2htZW50ID8gW2F0dGFjaG1lbnRdIDogW10pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgZnJhbWUub3BlbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICQodGhpcykuZmluZCgnLnJlbW92ZS1pbWFnZS1idXR0b24nKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKGJhc2UpLmZpbmQoJy5hdHRhY2htZW50LWlkJykudmFsKCcnKTtcbiAgICAgICAgICAgICAgICAkKGJhc2UpLmZpbmQoJy5pbWFnZS1wcmV2aWV3IGltZycpLmF0dHIoJ3NyYycsIF9WUFMucGxhY2Vob2xkZXJfaW1nKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9KVxufSkoalF1ZXJ5KTsiXSwibmFtZXMiOlsiX193ZWJwYWNrX3JlcXVpcmVfXyIsImV4cG9ydHMiLCJTeW1ib2wiLCJ0b1N0cmluZ1RhZyIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCIkIiwiZG9jdW1lbnQiLCJyZWFkeSIsImVhY2giLCJiYXNlIiwidGhpcyIsImZpbmQiLCJjbGljayIsImZyYW1lIiwid3AiLCJtZWRpYSIsImVkaXRvciIsIm9wZW4iLCJmcmFtZXMiLCJzZWxlY3RfaW1hZ2UiLCJ0aXRsZSIsIl9WUFMiLCJtZWRpYV90aXRsZSIsImJ1dHRvbiIsInRleHQiLCJidXR0b25fdGl0bGUiLCJtdWx0aXBsZSIsIm9uIiwiYXR0YWNobWVudCIsInN0YXRlIiwiZ2V0IiwiZmlyc3QiLCJ0b0pTT04iLCJ0cmltIiwiaWQiLCJ1cmwiLCJzaXplcyIsInRodW1ibmFpbCIsImZ1bGwiLCJ2YWwiLCJhdHRyIiwic2hvdyIsInNlbGVjdGlvbiIsImN1cnJlbnQiLCJwcmV2IiwiZmV0Y2giLCJhZGQiLCJwbGFjZWhvbGRlcl9pbWciLCJqUXVlcnkiXSwic291cmNlUm9vdCI6IiJ9