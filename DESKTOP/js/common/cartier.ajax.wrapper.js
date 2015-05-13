/*!
 * cartier.ajax.wrapper.js
 * This file contians ajax wrapper method that handles all ajax calls 
 *
 * @project   cartier mobile
 * @date      2014-01-03
 * @author    YOUR NAME, SapientNitro <YOUREMAIL@sapient.com>
 * @site      cartier mobile
   @dependency none
 * @ NOTE:
    This file has the following sequence of the actions
    1) Declare all the private variables
    2) ajax wrapper method
 
 */
;
(function(window, $, ajaxWrapper, undefined) {

	//this will cause the browser to check for errors more aggressively
	'use strict';

	//check if jquery is defined, else retun
	if ($ === undefined) {
		//console.log("jQuery not found");
		return false;
	}

	/*
		private variables
		*/
	var
	_objPropertiesMsg;


	/*
			@public method : get and call the ajax method 
			@customOptions : custom option to override the default options	
	    */
	ajaxWrapper.getXhrObj = function(customOptions) {

		var
		_defaultOptions = {
			type: 'POST',
			async: true,
			cache: false,
			url: '',
			data: {},
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			errorDiv: $('<div class="error-zone"></div>')
		},
			_objConfig = $.extend({}, _defaultOptions, customOptions),

			_objAjaxParam = {
				type: _objConfig.type, //mandatory field
				url: _objConfig.url, //mandatory
				headers: (_objConfig.headers !== undefined) ? _objConfig.headers : {},
				async: (_objConfig.async !== undefined) ? _objConfig.async : true,
				data: (_objConfig.data !== undefined) ? _objConfig.data : {},
				dataType: (_objConfig.dataType !== undefined) ? _objConfig.dataType : 'json',
				cache: (_objConfig.cache !== undefined) ? _objConfig.cache : true,
				contentType: (_objConfig.contentType !== undefined) ? _objConfig.contentType : 'application/x-www-form-urlencoded',
				errorDiv: (_objConfig.errorDiv !== undefined) ? _objConfig.errorDiv : $('<div class="error-zone"></div>'),
				// Global beforeSend wrapper with user defined function
				beforeSend: function(jqXHR) {
					$('button').attr('disabled', 'disabled');
					// Execute user defined method
					if (typeof _objConfig.beforeSend === 'function') {
						_objConfig.beforeSend(jqXHR);
					}
				}

			},

			/*
					This ajax wrapper function returns the return value from $.ajax, 
					which is a promise object. A promise acts as a proxy for a result of an asynchronous function.
					When $.ajax() is invoked a request is sent to the server, 
					but the function returns immediately without waiting for the response.
					The promise object represents that unknown response.
	     		 */
			_objJqXHR = $.ajax(_objAjaxParam),

			strErrorMsg = "";

		/* handling ajax failure*/
		_objJqXHR.fail(
			function(jqXHR, textStatus) {
				switch (jqXHR.status) {
					case 0:
						strErrorMsg = _objPropertiesMsg.noConnection;
						return;
						break;
					case 404:
						strErrorMsg = _objPropertiesMsg.fileNotFound;
						break;

					case 403:
						strErrorMsg = _objPropertiesMsg.forbidden;
						break;

					case 500:
						strErrorMsg = _objPropertiesMsg.serverError;
						break;

					default:
						strErrorMsg = jqXHR.responseText;
				};

				switch (textStatus) {
					case 'parsererror':
						strErrorMsg = _objPropertiesMsg.parserError;
						break;

					case 'timeout':
						strErrorMsg = _objPropertiesMsg.timeout;
						break;

					case 'abort':
						strErrorMsg = _objPropertiesMsg.ajaxReqAbort;
						break;
				};

				_objAjaxParam.errorDiv
					.html(strErrorMsg)
					.removeClass('display-none');

				if (customOptions.errorDiv === undefined) {
					$(".error-zone").remove();
					$('.main-container').prepend(_objAjaxParam.errorDiv);
					$("html, body").animate({
						scrollTop: 0
					}, "slow");
				}


			});


		_objJqXHR.always(function() {
			$('.loaderDiv').remove();
			$('button').removeAttr('disabled');
		});


		// return deferred ajax request object
		return _objJqXHR;
	};

	/*
	 @pubic method : initailize the module
    */
	ajaxWrapper.init = function() {
		_objPropertiesMsg = cartier.properties.messages;
	};

}(window, jQuery, cartier.ajaxWrapper));