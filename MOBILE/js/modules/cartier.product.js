 /*!cartier.product.js 
 * This file contains functionalities handling the PDP module
 * * @project cartier mobile
 * @date 2014 - 01 - 03
 * @author Sapient * @licensor cartier mobile
 * @site cartier mobile@ dependency cartier.core.js
 * @NOTE: This file has the following sequence of the actions
 *1) Declare all the private variables
 *2) caching jquery wrapper objects and messages
 *$last) call to init() method
 
 */

 ;
 (function(win, $, product, undefined) {
 	//this will cause the browser to check for errors more aggressively
 	'use strict';

 	//check if jquery is defined, else retun
 	if (typeof $ === "undefined") {
 		//cartier.log("jQuery not found");
 		return false;
 	}

 	/*
        private variables
        */
 	var
 	_cache = {},
 		_objPropertiesMsg,
 		_objPropertiesPth,
 		_successDiv,
 		_failureDiv,
 		_carouselCloned,
 		_initialProductRef,
 		_scaleImage = "",
 		scale,
 		$newthumbli = $('.thumbnail-list').find('li:eq(0)').on('click', function() {
 			dataLayer.push({
 				event: "productSlideDot"
 			});
 		}).clone(true, true),

 		//--------------------------------------------------------------------------------------------------------
 		//         Caching jQuery object
 		//--------------------------------------------------------------------------------------------------------


 		/*
            @private method : cache jQuery objects
            @param : none
        */
 		_cacheObjects = function() {
 			_cache = {
 				$product: $('.js-product'),
 				$reqinfo: $('.js-request-info'),
 				$contam: $('.js-contact-ambas'),
 				$overlayObject: $('.js-zoom'),
 				$line1: $('.js-engraving-preview-line1'),
 				$line2: $('.js-engraving-preview-line2'),
 				$boldclass: 'js-bold-class',
 				$cursiveclass: 'js-cursive-class',
 				$accordionObject: $('.js-accordion'),
 				$accordionObjectX: $('.js-accordion-x'),
 				carouselSlider: $('.js-product-carousel .js-slider'),
 				$suggestionCarouselSlider: $('.suggestion-carousel .carousel .js-slider'),
 				$engrvingSubmit: $('.js-confirm-button'),
 				$accancel: $('.js-cancel-ac'),
 				$addToShopping: $('.js-addtoshopping'),
 				$sizeSelector: $('.js-sizeselector'),
 				$socialShareObject: $('.social-share'),
 				$fbButton: $('.js-social-share__facebook'),
 				$twitterButton: $('.js-social-share__twitter'),
 				$pinterestButton: $('.js-social-share__pin-it'),
 				$addtomywishlistok: $('.js-addtomywishlist-ok'),
 				$createnewwishlistok: $('.js-createnewwishlist-ok'),
 				$productRef: $('.js-product-detail__size'),
 				$socialEmailForm: $('.js-social-share__email-form'),
 				$reqPriceForm: $('.js-req-price'),
 				$searchProductDesc: $('.js-heading4'),
 				$contactusIcon: $('.js-contactus'),
 				$historyVideoCarousel: $('.js-slider-history'),
 				$famousDiamonds: $('.js-slider-framous'),
 				$slide: $('.js-slider').children(),
 				$pdpCarouselThumbAnchor: $('.thumbnail-list .thumbnail a')
 			};
 		},

 		/*
            @private method : HTML Template init
            @param : none
        */

 		_htmlTemplateInit = function() {
 			_successDiv = '<div class="message-area">' +
 				'<span class="bolder">' +
 				_objPropertiesMsg.messageSentSuccess1 +
 				'</span>' +
 				_objPropertiesMsg.messageSentSuccess2 +
 				'</div>';


 			_failureDiv = '<div class="message-area">' +
 				_objPropertiesMsg.messageSentFailure +
 				'</div>';
 		},
 		//--------------------------------------------------------------------------------------------------------
 		//          EVENT Bindings
 		//--------------------------------------------------------------------------------------------------------

 		/*
            @private method : bind events
            @param : none
        */
 		_bindEvents = function() {

 			// Click event for request info
 			_cache.$reqinfo.find('.js-accordion_node__title').on('click', _bindEventsReqHandler);

 			// Click event for contact ambassador
 			_cache.$contam.find('.js-accordion_node__title').on('click', _bindEventsConHandler);

 			// Click event for request price
 			_cache.$reqPriceForm.find('.js-accordion_node__title').on('click', _bindEventsReqPriceHandler);

 			// Click event for submit button on engraving form
 			_cache.$engrvingSubmit.on('click', _engrvingButtonsSubmitHandler);

 			// Click event for cancel button on engraving form
 			_cache.$accancel.on('click', _engrvingButtonsCancleHandler);

 			// Change event for size selector drop down
 			_cache.$sizeSelector.on('change', _bindEventOnSizeSelectorHandler);

 			// Click event for add to shopping bag
 			_cache.$addToShopping.on('click', _addToShoppingClickHandler);

 			// Click event for facebook button
 			_cache.$fbButton.on('click', function(event) {
 				event.preventDefault();
 				//cartier.common.checkForImgChange();
 				win.open(_cache.$fbButton.attr('href'));

 			});

 			// Click event for contact us icon
 			_cache.$contactusIcon.on('click', function(e) {
 				e.preventDefault();
 				$('.js-accordion_node__title').trigger('click');
 			});

 			// Click event for carousel thumbnail
 			_cache.$pdpCarouselThumbAnchor.on('click', _thumbnailClickHandler);

 		},

 		_thumbnailClickHandler = function(e) {
 			e.preventDefault();

 			var idx = $('.thumbnail-list .thumbnail a').index(this);

 			var namespace = 'rslides',
 				fadeTime = parseFloat(500),
 				index;

 			var activeClass = namespace + '_here',
 				visibleClass = 'rslides1_on',
 				visible = {
 					'float': 'left',
 					'position': 'relative',
 					'opacity': 1,
 					'zIndex': 2
 				},
 				hidden = {
 					'float': 'none',
 					'position': 'absolute',
 					'opacity': 0,
 					'zIndex': 1
 				};


 			$('.js-slider').children()
 				.removeClass(visibleClass)
 				.css(hidden)
 				.eq(idx)
 				.addClass(visibleClass)
 				.css(visible);
 			index = idx;
 			setTimeout(function() {}, fadeTime);
 		},

 		/*
            @private method :event binding on the submit
            @param : form name and from path
        */
 		_bindEventOnSubmit = function(formName, formPath) {
 			formName.find('button[type="submit"]').on('click', {
 				fname: formName,
 				fpath: formPath
 			}, _bindEventOnSubmitHandler);
 		},


 		//--------------------------------------------------------------------------------------------------------
 		//          EVENT HANDLERS
 		//--------------------------------------------------------------------------------------------------------

 		/*
            @private method : Click handler for click on the submit button of the form
            @param : none
        */
 		_bindEventOnSubmitHandler = function(e) {

 			var formName = e.data.fname,
 				formPath = e.data.fpath,
 				_$node,
 				newform;
 			e.preventDefault();
 			$(this).before('<div class="loaderDiv">' + '' + '</div>');
 			$('.loaderDiv').addLoader();
 			_sendPostRequest('json', $(this).closest('form'), formPath, function(data) {
 				var parsedData = cartier.common.cartierJSONparser({
 					json: data
 				});
 				//Handle Success from the server side
 				if (parsedData.isSubmitSuccess) {
 					$('.error-div').remove();
 					formName.find('.js-accordion_node__title').trigger('click');
 					formName.find(".js-accordion_node__desc")
 						.find("form")
 						.remove();

 					if (cartier.common.isLoggedIn()) {
 						$('.main-container').confirmBox();
 						$('.main-container').data('plugin_confirmBox').popupInitialize({
 								'title': _objPropertiesMsg.messageSentSuccess1,
 								'message': _objPropertiesMsg.messageSentSuccess2,
 								'buttons': {
 									'ok': {
 										'buttonName': _objPropertiesMsg.okButton,
 										'class': 'cta-button cta-button__inner cta--red'
 									}
 								}
 							},
 							$('.main-container').data('plugin_confirmBox').confirmHide
 						);
 					} else {

 						var accountPath = $('.createAccountPath').val();
 						$('.main-container').confirmBox();
 						$('.main-container').data('plugin_confirmBox').popupInitialize({
 								'title': _objPropertiesMsg.messageSentSuccess1,
 								'message': _objPropertiesMsg.messageSentSuccess2,
 								'buttons': {
 									'ok': {
 										'buttonName': _objPropertiesMsg.okButton,
 										'class': 'cta-button cta-button__inner cta--red'
 									}
 								},
 								'anchormessage1': _objPropertiesMsg.createAccount,
 								'src1': accountPath + "?viewcreate=true",
 								'linkClasses': 'create-account-link'
 							},
 							$('.main-container').data('plugin_confirmBox').confirmHide
 						);
 					}
 				} else {
 					if (parsedData.errorMessage !== undefined && parsedData.errorMessage !== "") {
 						$('.error-div').remove();
 						formName.find('form').find('.ambassador-form,.request_info').prepend('<div class="error-div">' + parsedData.errorMessage + '</div>');
 						$('.error-div:eq(0)').ScrollTo({
 							duration: 800,
 							offsetTop: 140
 						});
 					}
 					if (parsedData.inlineErrorMessages !== undefined) {
 						for (var i = 0; i < parsedData.inlineErrorMessages.length; i++) {
 							formName.find('input[name=' + parsedData.inlineErrorMessages[i] + ']').addClass('error').after("<span for=" + parsedData.inlineErrorMessages[i] + " class='error'>" + _objPropertiesMsg.fieldErrorMessage + "</span>");
 						}
 					}

 					if (parsedData.showCaptcha && parsedData.showCaptcha !== undefined) {
 						$('.captchaDiv').removeClass('display-none');
 					} else if (!parsedData.showCaptcha) {
 						$('.captchaDiv').addClass('display-none');
 					}
 				}
 			});
 		},
 		_autoCountryFiller = function() {
 			if ($('#js-contact-ambassador-form').length) {

 				var autoVal = $('.js-country').val();

 				//console.log(autoVal);

 				$('#js-contact-ambassador-form #fn_country option').each(function(index, el) {
 					if ($(el).attr('value') === autoVal) {
 						$('#js-contact-ambassador-form #fn_country').val(autoVal);
 						$.uniform.update();
 					}
 				});
 			}

 			if ($('#js-contact-ambassador-form').length || $('#js-request-price-form').length) {
 				if ($('#fn_country').length) {
 					$('#fn_country').rules("add", {
 						required: true,
 						messages: {
 							required: _objPropertiesMsg.mandatory
 						}
 					});

 				}
 			}
 		},
 		/*
            @private method : Click handler for click on the contact ambssador link
            @param : none
        */
 		_bindEventsConHandler = function(e) {
 			//$("input:checkbox, input:radio, select").not('.no-uniform').uniform();
 			setTimeout(function() {
 				$('.js-contact-ambas').find('input:checkbox, input:radio, select').not('.no-uniform').uniform();
 				$('.radio-wrapper').find('label').removeClass('radio');

 			}, 200);
 			var $this = $(this);
 			$('.message-area').remove();
 			// checking form exsit or not



 			if (!(_cache.$contam.find("form").length > 0)) {
 				_cache.$contam.find(".js-accordion_node__title").unbind('click', _bindEventsConHandler);
 				_cache.$contam.find(".js-accordion_node__desc").addLoader();

 				if (_cache.$contam.find(".js-accordion_node__desc").length > 0) {
 					_cache.$contam.find(".js-accordion_node__desc").empty();
 					_cache.$contam.find('.js-accordion_node__title.active').not(this).trigger('click');

 				}
 				_getAndAppendForm($(this).closest('.js-contact-ambas'), _objPropertiesPth.ambassadorAjaxForm, function() {
 					if ($('.js-boutique').length) { // case for contact us
 						$(".js-accordion_node__desc").removeLoader();
 						_cache.$contam.find('form').append('<input type="hidden" name="pdp_pagepath" value="' + $('#pagePath').val() + '">');
 						_cache.$contam.find(".js-accordion_node__title").on('click', _bindEventsConHandler);
 						_contactUsAmbassadorFix();
 						$('.js-contact-ambas').find('input:checkbox, input:radio, select').not('.no-uniform').uniform();

 						$this.ScrollTo({
 							duration: 800,
 							offsetTop: 340
 						});
 						_autoCountryFiller();
 					} else {
 						_cache.$contam.find(".js-accordion_node__desc").removeLoader();
 						_cache.$contam.find('form').append('<input type="hidden" name="pdp_pagepath" value="' + $('#pagePath').val() + '">');
 						_cache.$contam.find(".js-accordion_node__title").on('click', _bindEventsConHandler);
 						$('.js-contact-ambas').find('input:checkbox, input:radio, select').not('.no-uniform').uniform();
 						$('.body-wrapper')
 							.data('plugin_analytics')
 							.productGAEvents();
 					}
 				});

 			}
 		},

 		/*
            @private method : Contact Ambassador fix
            @param : none
        */
 		_contactUsAmbassadorFix = function() {
 			_idFixForEachLoop('radio-input', 'radiogroup');
 		},

 		/*
            @private method : Id fix for each loop
            @param : none
        */
 		_idFixForEachLoop = function(className, idName) {
 			$('.' + className).each(function(index, el) {
 				$(el).attr({
 					id: idName + index
 				}).next('label').attr('for', idName + index);
 			});
 		},

 		/*
            @private method :handler for chnge event for price dropdown
            @param : none
        */
 		_bindEventOnSizeSelectorHandler = function() {
 			var $selectedOption = $(this).find('option:selected');
 			//Price Change
 			var newPrice = $selectedOption.attr('data-price');
 			var numericPrice = $selectedOption.attr('data-numericprice');
 			var showReqPrice = $selectedOption.data('showreqprice');
 			var pid = $('#productid').val(),
 				refId = $selectedOption.attr('data-refid'),
 				selectedValue = $selectedOption.val();

 			// change ref id of product
 			if (selectedValue !== 'default') {
 				_cache.$productRef.html(refId);
 				$('#wishlist_varient_refrence').val("CR" + refId);
 			} else {
 				_cache.$productRef.html(_initialProductRef);
 				$('#wishlist_varient_refrence').val("CR" + _initialProductRef);
 			}

 			//On change save the size on localStorge
 			$.jStorage.set(pid + "size", $selectedOption.val());
 			$('.js-product-price').html(newPrice);

 			if (numericPrice > 0) {
 				$('.ambassador-cont__price-detail').removeClass('display-none');
 			} else {
 				$('.ambassador-cont__price-detail').addClass('display-none');
 			}

 			//Avilability
 			if (typeof $selectedOption.data('availability') === "boolean") {
 				if (numericPrice <= 0) {
 					$('.js-addtoshopping').addClass('display-none');
 					$('.js-addtoshopping-call').addClass('display-none');
 				} else {
 					if ($selectedOption.data('availability')) {
 						$('.js-addtoshopping').removeClass('display-none');
 						$('.js-addtoshopping-call').removeClass('display-none');
 					} else {
 						$('.js-addtoshopping').addClass('display-none');

 						if ($selectedOption.data('sellable')) {
 							$('.js-addtoshopping-call').removeClass('display-none');
 						} else {
 							$('.js-addtoshopping-call').addClass('display-none');
 						}
 					}
 				}
 			}

 			if (!showReqPrice) {
 				$('.ambassador-cont__action-button').find('.js-accordion ').addClass('display-none').removeClass('display-block');
 			} else {
 				$('.ambassador-cont__action-button').find('.js-accordion ').addClass('display-block').removeClass('display-none');
 				$('.js-addtoshopping').addClass('display-none');
 				$('.js-addtoshopping-call').addClass('display-none');
 				$('.ambassador-cont__price-detail').addClass('display-none');
 			}

 			//Change the carousel
 			if ((typeof $selectedOption.data('carousel') === "object") && $selectedOption.data('carousel').length !== 0) {
 				var newCarousel = _carouselCloned.clone(),
 					$newul = newCarousel.find('.js-slider'),
 					$newli = $newul.find('li:eq(0)').clone(true, true),
 					$newthumb = newCarousel.find('.thumbnail-list');

 				$newul.empty();
 				$newthumb.empty();

 				var newpathJSON = $selectedOption.data('carousel'),
 					jsonlength = newpathJSON.length;


 				for (var i = 0; i < jsonlength; i++) {
 					var _nodeli = $newli.clone();
 					_nodeli.find('img').attr({
 						src: newpathJSON[i],
 						"data-original": newpathJSON[i]
 					}).removeClass('just-preloader');

 					var _thumbli = $newthumbli.clone(true, true).removeClass('display-none');
 					_thumbli.find('img').attr({
 						src: newpathJSON[i]
 					});

 					$newthumb.append(_thumbli);
 					$newul.append(_nodeli);
 				}


 				if ($newthumb.find('li').length <= 1)
 					$newthumb.find('li').addClass('display-none');

 				$('.js-product-carousel').replaceWith(newCarousel);
 				initializeCarousel($(".js-product-carousel .js-slider"));

 				initializeOverlay();

 				$('.thumbnail-list .thumbnail a').on('click', _thumbnailClickHandler);

 			}

 		},


 		/*
            @private method : Click handler for click on the add to shopping bag
            @param : none
        */
 		_addToShoppingClickHandler = function(e) {
 			e.preventDefault();
 			$('fieldset').each(function() {
 				if ($(this).data('confirmFlag') === 'false') {
 					$(this).find('.js-inputfield').val('').trigger('change');
 				}
 			});

 			var objXHR = cartier.ajaxWrapper.getXhrObj({
 				type: 'POST',
 				url: _objPropertiesPth.addToCartLink,
 				data: $(this).closest('.js-form-validator').find('form').serialize(),
 				dataType: 'json',
 				contentType: "application/x-www-form-urlencoded",
 				beforeSend: function(jqXHR) {
 					if (!$('.js-form-validator-fieldset').find('.js-inputfield').valid()) {
 						jqXHR.abort();
 					} else {

 						$('.js-addtoshopping').attr('disabled', 'disabled').before('<div class="loaderDiv">' + _objPropertiesMsg.addingToCart + '</div>');
 						$('.loaderDiv').addLoader();
 						// return false to cancel submit
 						_flushTheLocalStorage($('#productid').val());
 					}
 				}
 			});
 			if (objXHR) {
 				objXHR.done(function(data) {
 					// handle failure
 					if (typeof data === "undefined") {} else { // handle success
 						$('.js-addtoshopping').removeAttr('disabled');
 						_flushTheLocalStorage($('#productid').val());
 						var parsedData = cartier.common.cartierJSONparser({
 							json: data
 						});
 						//Handle Update Failure
 						if (parsedData.isErrorMessageVisible) {
 							var _temp = $("<div class='error-zone'></div>").append(parsedData.errorMessage);
 							$('.error-zone').remove();
 							$('.main-container').prepend(_temp).ScrollTo({
 								duration: 800,
 								offsetTop: 340
 							});
 						}

 						cartier.common.JsonLCUpgrader(parsedData);

 						$('.body-wrapper').data('plugin_analytics').productAddToCart();
 						_addToShoppingInputFlusher();
 						cartier.common.checkCookie();
 					}
 				});
 			}
 			return false;
 		},


 		/*
            @private method : Click handler for click on the request info link
            @param : none
        */

 		_bindEventsReqHandler = function(e) {

 			$('.message-area').remove();
 			var reqinfoForm = (_cache.$reqinfo.find("form").length > 0);

 			if (!reqinfoForm) {
 				_cache.$reqinfo.find(".js-accordion_node__title").unbind('click', _bindEventsReqHandler);
 				_cache.$reqinfo.find(".js-accordion_node__desc").addLoader();

 				if (_cache.$reqinfo.find(".js-accordion_node__desc").length > 0) {
 					_cache.$reqinfo.find(".js-accordion_node__desc").empty();
 					_cache.$reqinfo.find('.js-accordion_node__title.active').not(this).trigger('click');

 				}


 				_getAndAppendForm(_cache.$reqinfo, _objPropertiesPth.requestInfoAjaxForm, function() {

 					setTimeout(function() {
 						$('.js-request-info').find('input:checkbox, input:radio, select').not('.no-uniform').uniform();
 						$('.radio-wrapper').find('label').removeClass('radio');

 					}, 200);

 					if ($('.js-sizeselector').is(':visible')) {

 						$('#js-request-info-form').append($('<input>').attr({
 							type: 'hidden',
 							id: 'pdp_variantId',
 							name: 'pdp_variantId',
 							value: $('.js-sizeselector').val(),
 						}));
 					}
 					$('input[name=pdp_pagepath]').val($('#pagePath').val());
 					_cache.$reqinfo.find(".js-accordion_node__desc").removeLoader(); //Removes the loader
 					_displayEmailOrPhone(); //gives the functionality of chosing email or phone
 					$("input[name=requestInformation_contactPreference][value=email]").trigger('click');
 					//_cache.$reqinfo.find('form').append('<input type="hidden" name="pdp_pagepath" value="' + $('#pagePath').val() + '">');
 					_cache.$reqinfo.find(".js-accordion_node__title").on('click', _bindEventsReqHandler);
 					// check email
 					$(_cache.$reqinfo.find("form input[name='fn_grpcontpref']")[0]).prop("checked", "checked");
 					$('.body-wrapper')
 						.data('plugin_analytics')
 						.productGAEvents();
 				});
 			}
 		};

 	/*
            @private method : requestInfo Call back fuction
            @param : data : json data
        */
 	cartier.product.RequestInfoCallback = function(data) {
 		//console.log(data);
 		var formContainer = $('.js-request-info-form'),
 			titleEl = formContainer.closest('.js-accordion__node').find('.js-accordion_node__title'),
 			formName = formContainer.closest('.overlay-form');
 		_showPopOnFormSubmit(data, formName, titleEl);

 	};

 	/*
            @private method : requestInfo Call back fuction
            @param : data : json data
        */

 	var ContactInfoCallback = function(data) {
 		var formContainer = $('.js-contact-ambassador-form'),
 			titleEl = formContainer.closest('.js-accordion__node').find('.js-accordion_node__title'),
 			formName = formContainer.closest('.overlay-form');
 		_showPopOnFormSubmit(data, formName, titleEl);

 	},

 		/*
            @private method : show pop up on form submit
            @param : data : jsonj data
                    formName : form container
                    titleEl : form Title dom el
        */
 		_showPopOnFormSubmit = function(data, formName, titleEl) {
 			_objPropertiesMsg = cartier.properties.messages;
 			if (typeof data === "object") {
 				var inputPath = $('input[name=registrationPath]'),
 					regPagePath = inputPath.length > 0 ? inputPath.val() : "#";
 				var parsedData = cartier.common.cartierJSONparser({
 					json: data
 				});
 				//Handle Success from the server side
 				if (parsedData.isSubmitSuccess) {
 					$('.error-div').remove();
 					titleEl.trigger('click');

 					//cartier.common.addErrorDiv($('.info-icon'), _objPropertiesMsg.messageSentSuccess1, _objPropertiesMsg.messageSentSuccess2);
 					formName.remove();

 					if (cartier.common.isLoggedIn()) {
 						$('.main-container').confirmBox();
 						$('.main-container').data('plugin_confirmBox').popupInitialize({
 								'title': _objPropertiesMsg.messageSentSuccess1,
 								'message': _objPropertiesMsg.messageSentSuccess2,
 								'buttons': {
 									'ok': {
 										'buttonName': _objPropertiesMsg.okButton,
 										'class': 'cta-button cta-button__inner cta--red'
 									}
 								}
 							},
 							$('.main-container').data('plugin_confirmBox').confirmHide
 						);
 					} else {

 						$('.main-container').confirmBox();
 						$('.main-container').data('plugin_confirmBox').popupInitialize({
 								'title': _objPropertiesMsg.messageSentSuccess1,
 								'message': _objPropertiesMsg.messageSentSuccess2,
 								'buttons': {
 									'ok': {
 										'buttonName': _objPropertiesMsg.okButton,
 										'class': 'cta-button cta-button__inner cta--red'
 									}
 								},
 								'anchormessage1': _objPropertiesMsg.createAccount,
 								'src1': regPagePath + '.html' + "?viewcreate=true",
 								'linkClasses': 'create-account-link'
 							},
 							$('.main-container').data('plugin_confirmBox').confirmHide
 						);
 					}
 				} else {
 					if (parsedData.errorMessage !== undefined && parsedData.errorMessage !== "") {
 						$('.error-div').remove();
 						formName.find('form').find('.ambassador-form,.request_info').prepend('<div class="error-div">' + parsedData.errorMessage + '</div>');
 						$('.error-div:eq(0)').ScrollTo({
 							duration: 800,
 							offsetTop: 140
 						});
 					}
 					if (parsedData.inlineErrorMessages !== undefined) {
 						for (var i = 0; i < parsedData.inlineErrorMessages.length; i++) {
 							formName.find('input[name=' + parsedData.inlineErrorMessages[i] + ']').addClass('error').after("<span for=" + parsedData.inlineErrorMessages[i] + " class='error'>" + _objPropertiesMsg.fieldErrorMessage + "</span>");
 						}
 					}

 					if (parsedData.showCaptcha && parsedData.showCaptcha !== undefined) {
 						$('.captchaDiv').removeClass('display-none');
 					} else if (!parsedData.showCaptcha) {
 						$('.captchaDiv').addClass('display-none');
 					}
 				}
 			}
 		},

 		/*
            @private method : Request price add message functionality
            @param : none
        */
 		_getPriceRules = function() {

 			var $addMessage = $('.requestPrice_checkbox_askForPrice');
 			var $conPref = $('.radio-conpref');
 			$('.requestPrice_message').css('display', 'none');
 			$addMessage.on('click', function() {
 				if ($('.requestPrice_checkbox_askForPrice .checker').find('span').hasClass('checked')) {
 					$('.requestPrice_message').css('display', 'block');
 				} else {
 					$('.requestPrice_message').css('display', 'none');
 				}
 			});

 			$conPref.on('click', function() {
 				if ($('.radio-conpref').find(".radio-btn-li:eq(0) input").is(':checked')) {
 					$('.js-emaildiv').find('.mandatory').removeClass('display-none').end().find('input').removeClass('js-validation-ignore');
 					$('.js-phonediv').find('.mandatory').addClass('display-none').end().find('input').addClass('js-validation-ignore');
 				} else {
 					$('.js-emaildiv').find('.mandatory').addClass('display-none').end().find('input').addClass('js-validation-ignore');
 					$('.js-phonediv').find('.mandatory').removeClass('display-none').end().find('input').removeClass('js-validation-ignore');
 				}
 			});
 		},

 		/*
            @private method :change mandatory filed acording selected radio button
            @param : none;
        */
 		_changeMandatoryEmailorPhone = function() {
 			//clone variables to save the email and phone html
 			var $ph = $('.requestPrice_emailAddress'),
 				$em = $('.requestPrice_phoneNumber');
 			$em.addClass('display-none');
 			$("input[name=requestPrice_contactPreference]").on('click', function() {

 				if ($(this).val() === "email") {
 					$em.find('input').rules('remove', 'required');

 					$ph.find("input").rules("add", {
 						required: true,
 						messages: {
 							required: _objPropertiesMsg.mandatory
 						}
 					});
 					$em.addClass('display-none');

 					$ph.removeClass('display-none');


 				} else {
 					$ph.find('input').rules('remove', 'required');

 					$em.find("input").rules("add", {
 						required: true,
 						messages: {
 							required: _objPropertiesMsg.mandatory
 						}
 					});
 					$ph.addClass('display-none');

 					$em.removeClass('display-none');
 				}

 			});
 		},

 		/*
            @private method : Request price handler
            @param : event
        */
 		_bindEventsReqPriceHandler = function(e) {
 			$('.message-area').remove();

 			var reqPriceFormLength = (_cache.$reqPriceForm.find("form").length > 0);
 			if (!reqPriceFormLength) {
 				_cache.$reqPriceForm.find(".js-accordion_node__title").unbind('click', _bindEventsReqPriceHandler);
 				_cache.$reqPriceForm.find(".js-accordion_node__desc").addLoader();

 				_getAndAppendForm(_cache.$reqPriceForm, _objPropertiesPth.requestPriceAjaxForm, function() {


 					setTimeout(function() {
 						$('.js-req-price').find('input:checkbox, input:radio, select').uniform();
 						$('.radio-wrapper').find('label').removeClass('radio');
 						$('input[name=pdp_pagepath]').val($('#pagePath').val());
 						_getPriceRules();
 					}, 200);

 					if ($('.js-sizeselector').is(':visible')) {

 						$('#js-request-price-form').append($('<input>').attr({
 							type: 'hidden',
 							id: 'pdp_variantId',
 							name: 'pdp_variantId',
 							value: $('.js-sizeselector').val(),
 						}));
 					}
 					/*END*/
 					$(_cache.$reqPriceForm.find('form input[name=fn_grpcontpref3]')[0]).prop('checked', true);
 					_cache.$reqPriceForm.find(".js-accordion_node__desc").removeLoader(); //Removes the loader
 					_cache.$reqPriceForm.find(".js-accordion_node__title").on('click', _bindEventsReqPriceHandler);
 					_changeMandatoryEmailorPhone();
 					$("input[name=requestPrice_contactPreference][value=email]").trigger('click');

 					if ($('#js-request-price-form').length) {
 						if ($('#fn_country').length) {
 							$('#fn_country').rules("add", {
 								required: true,
 								messages: {
 									required: _objPropertiesMsg.mandatory
 								}
 							});

 						}
 					}
 					$('.body-wrapper')
 						.data('plugin_analytics')
 						.productGAEvents();
 				});
 			}
 		},


 		/*
            @private method :event binding on the submit
            @param : form name and from path
        */
 		_socialEmailSubmit = function(formName, formPath) {

 			formName.find('input[type="submit"]').on('click', {
 				fname: formName,
 				fpath: formPath
 			}, _socialEmailSubmitHandler);

 		},


 		/*
            @private method : Click handler for click on the submit button of the form
            @param : none
        */

 		_socialEmailSubmitHandler = function(e) {

 			var formName = _cache.$socialEmailForm,
 				formPath = _objPropertiesPth.socialEmailForm;

 			e.preventDefault();

 			$(this).before('<div class="loaderDiv">' + '' + '</div>');
 			$('.loaderDiv').addLoader();

 			_sendPostRequest('json', $(this).closest('form'), formPath, function(data) {
 				$('.body-wrapper').data('plugin_analytics').productShareMail();

 				var parsedData = cartier.common.cartierJSONparser({
 					json: data
 				});

 				if (parsedData.submitSuccess === true) {
 					$('.js-social-share').toggleClass('email-deployed');
 					$('.js-social-share__email').parent('li').toggleClass('selected');


 					$('.js-social-share__email').toggleClass('social-share__email-deployed');
 					$('.js-social-share__email-form').toggle();
 				}

 			});

 			$('.loaderDiv').removeLoader();

 		},

 		/*
            @private method : ok event handler on pdp (engraving)
            @param : none
        */
 		_engrvingButtonsSubmitHandler = function(e) {
 			e.preventDefault();
 			if ($(this).closest('fieldset').find('.js-inputfield').valid()) {
 				_cache
 					.$accordionObject
 					.data('plugin_makeAccordion')
 					._closeHandler($(this));
 				$(this).closest('fieldset').data('confirmFlag', 'true');
 			}
 		},

 		/*
            @private method : ok event handler on pdp (engraving)
            @param : none
        */
 		_addToShoppingInputFlusher = function() {

 			// e.preventDefault();
 			_cache.$accordionObject.find("input[name='fn_commsgone']").val('').trigger('change');
 			_cache.$accordionObject.find("input[name='fn_commsgtwo']").val('').trigger('change');
 			_cache.$accordionObject.find("input[name='fn_wristsize']").val('').trigger('change');
 			setTimeout(function() {
 				_cache.$accordionObject.find('.slide_switch').find('input:eq(0)').trigger('click');
 			}, 10); /// Fix for firefox
 		},



 		/*
            @private method : cancle event handler on pdp (engraving)
            @param : none
        */
 		_engrvingButtonsCancleHandler = function(e) {
 			e.preventDefault();
 			var $this = $(this)
 				.closest('fieldset');
 			$this
 				.find('.js-inputfield')
 				.val("")
 				.trigger('change');

 			setTimeout(function() {
 				$this.find('.slide_switch').find('input:eq(0)').trigger('click');
 			}, 10); /// Fix for firefox
 			_cache.$accordionObject.data('plugin_makeAccordion')._closeHandler($(this));
 			_cache.$accordionObject.find("input[name='fn_wristsize'] ~ span.error").remove();
 			_cache.$accordionObject.find("input[name='fn_wristsize']").removeClass('error');
 			_cache.$accordionObject.find("input[name='fn_commsgtwo'] ~ span.error").remove();
 			_cache.$accordionObject.find("input[name='fn_commsgtwo']").removeClass('error');

 		},



 		//--------------------------------------------------------------------------------------------------------
 		//          Initialize Plugins
 		//--------------------------------------------------------------------------------------------------------
 		/*
            @private method : initialize acordian of produc page
            @param : none
        */
 		initializeAccordion = function() {
 			_cache.$accordionObject.makeAccordion({
 				showBehaviour: true
 			});
 		},
 		/*
            @private method : initialize acordian of produc page
            @param : none
        */
 		initializeAccordionX = function() {
 			_cache.$accordionObjectX.makeAccordion({
 				showBehaviour: true
 			});
 		},

 		/*
            @private method : Function to initialize the Overlay
            @param : none
        */
 		initializeOverlay = function() {
 			$(".js-zoom").openOverlay({
 				callback: initializingImageInOverLay
 			});

 		},

 		initializingImageInOverLay = function() {
 			var winHeight = $(win).height(),
 				docHeight = $(document).height(),
 				winWidth = $(win).width();

 			var imgPath = $('.js-product-carousel .js-slider').find('li').not('.lazy-loader').find('img').attr('data-original');

 			if (typeof imgPath === "undefined")
 				imgPath = $('.js-product-carousel .js-slider').find('li').not('.lazy-loader').find('img').attr('src');


 			imgPath = imgPath.replace(/\.scale\.(.*?)\./, ".scale.640.");


 			winHeight = (winHeight < winWidth) ? winHeight : winWidth;

 			$(".js-overlay .img-container").find('img').attr('src', imgPath).css('opacity', '0');

 			$(".js-overlay .img-container").find('img').load(function() {

 				var marginTop = (winHeight / 2 - $(".js-overlay .img-container").find('img').height() / 2);
 				if (marginTop < 0)
 					marginTop = 50;

 				$(".js-overlay .img-container").find('img')
 					.css({
 						'max-height': winHeight,
 						"max-width": winHeight - 30,
 						"margin-top": marginTop
 					}).css('opacity', '1');
 			});

 			$(".js-overlay .img-container").find('img').ready(function() {
 				$(".js-overlay .img-container").find('img').css('opacity', '1');
 			});

 		},
 		/*
            @private method : Function to initialize the Crousel
            @param : The ul on which carouel has to be initialized
        */
 		initializeCarousel = function(carouselObject) {

 			//Cloning for further use
 			_carouselCloned = $('.js-product-carousel').clone();

 			carouselObject.responsiveSlides({
 				auto: true,
 				pager: false,
 				touch: true,
 				nav: true,
 				speed: 300

 			});
 		},
 		initializeSuggestionCarousel = function(carouselObject) {

 			carouselObject.responsiveSlides({
 				auto: true,
 				pager: true,
 				touch: true,
 				nav: true,
 				speed: 300
 			});
 		},

 		/*
            @private method : Function to push image in 360 pass as callback function in ovelay.container function
            @param : none
        */
 		initializingImagesInView = function() {
 			// var product360 = { files360 : [] };
 			// if ($('.js-product-carousel .js-slider li img').attr('src'))
 			//       var imgPath = ($('.js-product-carousel .js-slider li img').attr('src')).substring(0, 82);
 			//       for (var i = 0; i != 72; i++) {
 			//         product360.files360.push(imgPath + 'cartier_images/W1556242_360_' + i + '_9459.png');
 			//       }

 			var winHeight = ($(win).height()) < ($(win).width()) ? $(win).height() : $(win).width();
 			$(".image-tab, .image-tab img")
 				.width(winHeight * 0.5)
 				.height(winHeight * 0.5);

 			$('#my-image-360').reel({
 				frames: product360.files360.length,
 				frame: 10,
 				images: product360.files360,
 				brake: 0.2,
 				wheelable: false
 			});

 		},


 		/*
            @private method : Function to initialize the 360
            @param : none
        */
 		initialize360 = function() {
 			$(".js-degree360").openOverlay({
 				ovelayInitializeClass: 'js-degree360',
 				hiddenOvelayClass: 'js-overlay-zoom',
 				callback: initializingImagesInView
 			});
 		},

 		//--------------------------------------------------------------------------------------------------------
 		//         Other Business Logic Functions
 		//--------------------------------------------------------------------------------------------------------
 		/*
            @private method : Function to decide if to display email or password in the req info form
            @param : none
        */
 		_displayEmailOrPhone = function() {
 			//clone variables to save the email and phone html
 			var $ph = $(".requestInformation_emailAddress"),
 				$em = $(".requestInformation_phoneNumber");

 			//remove phone number on load
 			$em.addClass('display-none');
 			$("input[name=requestInformation_contactPreference]").on('click', function() {

 				if ($(this).val() === "email") {
 					$em.find('input').rules('remove', 'required');

 					$ph.find("input").rules("add", {
 						required: true,
 						messages: {
 							required: _objPropertiesMsg.mandatory
 						}
 					});
 					$em.addClass('display-none');

 					$ph.removeClass('display-none');


 				} else {
 					$ph.find('input').rules('remove', 'required');

 					$em.find("input").rules("add", {
 						required: true,
 						messages: {
 							required: _objPropertiesMsg.mandatory
 						}
 					});
 					$ph.addClass('display-none');

 					$em.removeClass('display-none');
 				}

 			});
 		},

 		/*
            @private method : On changr for fieldset
            @param : none
        */
 		_addToShoppingHandler = function() {
 			$('.js-line-1, .js-line-2, .js-line-3').on('change paste keyup', function() {
 				$(this).closest('fieldset').data('confirmFlag', 'false');
 			});
 		},


 		/*
            @private method : Function to provide functionality to engraving
            @param : none
        */
 		_engravingPreview = function() {
 			$(".js-line-1").on("change paste keyup", function() {
 				_cache.$line1.text($(this).val());
 			});
 			$(".js-line-2").on("change paste keyup", function() {
 				_cache.$line2.text($(this).val());
 			});
 		},


 		/*
            @private method : Function to provide functionality to engraving
            @param : none
        */

 		_engravingClassToggle = function() {

 			$(".slide_switch input").change(function() {
 				if ($(".js-cursive-switch").is(':checked')) {
 					_cache.$line1.removeClass(_cache.$boldclass).addClass(_cache.$cursiveclass);
 					_cache.$line2.removeClass(_cache.$boldclass).addClass(_cache.$cursiveclass);
 				} else
 				if ($(".js-bold-switch").is(':checked')) {
 					_cache.$line1.removeClass(_cache.$cursiveclass).addClass(_cache.$boldclass);
 					_cache.$line2.removeClass(_cache.$cursiveclass).addClass(_cache.$boldclass);
 				}
 			});
 		},



 		/*
                @private method : send ajax call, appends the data to the description
                @param : none
        */

 		_sendPostRequest = function(datatype, $form, link, callback) {

 			var objXHR = cartier.ajaxWrapper.getXhrObj({
 				type: 'POST',
 				url: link,
 				data: $form.serialize(),
 				dataType: datatype,
 				contentType: "application/x-www-form-urlencoded",
 				beforeSend: function(jqXHR) {
 					if (!$form.valid()) {
 						jqXHR.abort();
 					}
 					// return false to cancel submit
 				}
 			});
 			if (objXHR) {
 				objXHR.done(function(data) {
 					// handle failure
 					if (typeof data.success !== "undefined" && !data.success) {

 					} else { // handle success
 						callback(data);
 					}
 				});
 			}
 			return false;
 		},



 		/*
            @private method : Function to get and append the form from the AJAX cll
            @param : none
        */
 		_getAndAppendForm = function($node, link, callback) {
 			var objXHR = cartier.ajaxWrapper.getXhrObj({
 				type: 'GET',
 				url: link,
 				dataType: "html"
 			});

 			if (objXHR) {
 				objXHR.done(function(data) {
 					// handle failure
 					if (typeof data === "undefined") {
 						// handle redirectURL exist if the session expires
 					} else { // handle success
 						var parsedData = $($.parseHTML(data, document, true)).find('.overlay-form').addBack('.overlay-form');
 						$node.find(".js-accordion_node__desc").append(parsedData);
 						callback();
 						cartier.formValidationWrapper.applyValidation($node.find('form'));
 					}
 				});
 			}
 			return false;
 		},


 		/*
                @private method : Add Module level validations
                @param : none
        */
 		_addValidation = function() {
 			var sizeInputField = $("input[name='fn_wristsize']");

 			if (sizeInputField.length > 0) {
 				sizeInputField.rules("add", {
 					required: true,
 					hasNoSpace: true,
 					range: true,
 					messages: {
 						range: _objPropertiesMsg.notInRange,
 						required: _objPropertiesMsg.mandatory,
 						hasNoSpace: _objPropertiesMsg.hasNoSpace
 					}
 				});
 			}


 			var engravingInputField1 = $("input[name='fn_commsgone']");
 			var engravingInputField2 = $("input[name='fn_commsgtwo']");
 			if (engravingInputField2.length > 0) {
 				engravingInputField2.rules("add", {
 					emptyField: true,
 					messages: {
 						emptyField: _objPropertiesMsg.engravingErrorMessage
 					}
 				});
 			}

 			if (engravingInputField1.length > 0) {
 				engravingInputField1.on('change paste keyup', function() {
 					engravingInputField2.trigger('blur');
 				});
 			}

 		},


 		/*
            @private method : product details flush
            @param : product id
        */
 		_flushTheLocalStorage = function(pid) {
 			var
 			localstorge = $.jStorage;
 			localstorge.deleteKey(pid + 'js-line-1');
 			localstorge.deleteKey(pid + 'js-line-2');
 			localstorge.deleteKey(pid + 'js-line-3');
 			localstorge.deleteKey(pid + 'js-font-style');
 			localstorge.deleteKey(pid + 'js-fit-switch');
 			localstorge.deleteKey(pid + 'size');
 		},

 		/*
            @private method : On page load for update varient info
            @param : none
        */
 		_onPageLoadCalls = function() {
 			var objXHR = cartier.ajaxWrapper.getXhrObj({
 				type: 'GET',
 				//data: 'path=' + $('#pagePath').val(),
 				url: _objPropertiesPth.availabilityJson,
 				dataType: 'json',
 				contentType: "application/x-www-form-urlencoded"
 			});


 			if (objXHR) {
 				objXHR.done(function(data) {
 					// handle failure
 					if (typeof data.success !== "undefined" && !data.success) {
 						// handle redirectURL exist if the session expires
 						// data.redirectURL ?  window.location.href = data.redirectURL : $form.find('.server_message').html(data.errorMessage);
 					} else {
 						var parsedData = cartier.common.cartierJSONparser({
 							json: data
 						});

 						if (parsedData !== false) {
 							if (parsedData.hasVariants) {
 								$.each(parsedData.variants, function(index, val) {
 									$.each(val.images, function(indexy, valy) {
 										parsedData.variants[index].images[indexy] = _adaptImage(valy);
 									});
 								});
 							}

 							var pageCarouselImage = [];
 							$('.js-product-carousel .rslides li img').each(function(index, el) {
 								var pushUrl = "";
 								if (typeof $(el).attr('data-original') !== "undefined")
 									pushUrl = $(el).attr('data-original');
 								else
 									pushUrl = $(el).attr('src');
 								pageCarouselImage.push(pushUrl);
 							});

 							_updateThumb(pageCarouselImage);

 							_updateVarientInfo(parsedData);
 						}
 					}
 				});
 			}
 		},

 		_updateThumb = function(argument) {

 			var $newthumb = $('.thumbnail-list');

 			$newthumb.find('li').remove();
 			var jsonlength = argument.length;
 			for (var i = 0; i < jsonlength; i++) {
 				var _thumbli = $newthumbli.clone(true, true).removeClass('display-none');
 				_thumbli.find('img').attr({
 					src: argument[i]
 				});
 				$newthumb.append(_thumbli);
 			}


 			if ($newthumb.find('li').length <= 1)
 				$newthumb.find('li').addClass('display-none');

 			$('.thumbnail-list .thumbnail a').on('click', _thumbnailClickHandler);

 		},


 		_adaptImage = function(arg) {

 			var _scaleImageArr;
 			if (_scaleImage === "") {
 				_scaleImage = $('.js-adaptiveImage:eq(0)').attr('data-original');
 				_scaleImageArr = _scaleImage.split('.');
 				_scaleImageArr.pop();
 				var res = _scaleImageArr.pop();
 				var scaleW = _scaleImageArr.pop();
 				scale = ".scale." + scaleW + "." + res + ".";
 			}
 			var ext = arg.split('.').pop();

 			if (scale === "")
 				return arg;
 			else
 				return arg + scale + ext;
 		},



 		/*
            @private method : On page load for update wishlist dropdown
            @param : none
        */

 		_onPageLoadCalls2 = function() {
 			var objXHR = cartier.ajaxWrapper.getXhrObj({
 				type: 'POST',
 				data: 'action=getwishlists&wishlist_pagepath=' + $('.js-wishlist_pagepath').val() + '',
 				url: _objPropertiesPth.saveWishlist,
 				dataType: 'json',
 				contentType: "application/x-www-form-urlencoded"
 			});


 			if (objXHR) {
 				objXHR.done(function(data) {
 					// handle failure
 					if (typeof data.success !== "undefined" && !data.success) {
 						// handle redirectURL exist if the session expires
 						// data.redirectURL ?  window.location.href = data.redirectURL : $form.find('.server_message').html(data.errorMessage);
 					} else {
 						var parsedData = cartier.common.cartierJSONparser({
 							json: data
 						});

 						if (parsedData !== false) {
 							_updateWishlistDropdown(parsedData);
 						}
 					}
 				});
 			}
 		},

 		/*
            @private method : Wishlist dropdpwn callback function
            @param : data
        */

 		_updateWishlistDropdown = function(data) {

 			if (data.wishlistDropDown !== undefined) {
 				var dropDown = $('.js-select-addtomywishlist').empty().clone(true, true);
 				if (data.wishlistDropDown.length === 0)
 					$('.copy-to-wishlist .input-field:eq(0)').addClass('display-none');

 				for (var i = 0; i < data.wishlistDropDown.length; i++) {
 					dropDown.append('<option value="' + data.wishlistDropDown[i].display + '"data-wishlistno="' + data.wishlistDropDown[i].value + '">' + data.wishlistDropDown[i].display + '</option>');
 				}
 				$('.js-select-addtomywishlist').replaceWith(dropDown);
 			} else {
 				$('.copy-to-wishlist .input-field:eq(0)').addClass('display-none');
 			}

 		},

 		/*
            @private method : Update varient info callback function
            @param : data
        */
 		_updateVarientInfo = function(data) {

 			if (data.multiplePrices)
 				data.productprice = CQ.I18n.getMessage('PDP.price.from') + ' ' + data.productprice;

 			if (typeof data.showReqPrice === "undefined")
 				data.showReqPrice = false;

 			if (typeof data.availability === "undefined")
 				data.availability = true;

 			var firstOptionField = _cache.$sizeSelector
 				.find("option[value='default']")
 				.attr({
 					"data-price": data.productprice,
 					"data-numericprice": data.numericPrice,
 					"data-showreqprice": data.showReqPrice,
 					"data-availability": data.availability,
 					"data-sellable": data.sellable

 				}),

 				lengthOfarray = data.variants.length,
 				optionFiledStructure = $(_cache.$sizeSelector.children()[2]).clone(true, true),
 				dropdownOptions = $('<div></div>');

 			// add first option in dropdown option
 			dropdownOptions.append(firstOptionField);

 			if (data.numericPrice <= 0) {
 				$('.js-addtoshopping').addClass('display-none');
 				$('.js-addtoshopping-call').addClass('display-none');
 			} else {
 				if (data.availability === true) {
 					$('.js-addtoshopping').removeClass('display-none');
 					$('.js-addtoshopping-call').removeClass('display-none');
 				} else {
 					$('.js-addtoshopping').addClass('display-none');

 					if (data.sellable) {
 						$('.js-addtoshopping-call').removeClass('display-none');
 					} else {
 						$('.js-addtoshopping-call').addClass('display-none');
 					}
 				}
 			}

 			if (!data.showReqPrice) {
 				$('.ambassador-cont__action-button').find('.js-accordion ').addClass('display-none').removeClass('display-block');
 			} else {
 				$('.ambassador-cont__action-button').find('.js-accordion ').addClass('display-block').removeClass('display-none');
 				$('.js-addtoshopping').addClass('display-none');
 				$('.js-addtoshopping-call').addClass('display-none');
 				$('.ambassador-cont__price-detail').addClass('display-none');

 			}


 			if (!data.hasVariants) {
 				dropdownOptions.find("option[value='default']").attr({
 					"value": 'false'
 				});
 				_cache.$sizeSelector.empty();
 				_cache.$sizeSelector.append($(dropdownOptions).children());
 				_cache.$sizeSelector.addClass('display-none').val('false');
 				$('.attributes-sizing-guide').addClass('display-none');
 				$('.js-product-price').html(data.productprice);

 			} else {
 				var images;
 				for (var i = 0; i < lengthOfarray; i++) {
 					var optionFiledStructure1 = optionFiledStructure.clone(true, true);
 					images = _pushImagesInArray(data.variants[i].images);

 					if (data.variants[i].price === undefined || data.variants[i].price === "" || data.variants[i].price === "undefined")
 						data.variants[i].price = data.productprice;

 					else if (data.variants[i].multiplePrices)
 						data.variants[i].price = CQ.I18n.getMessage('PDP.price.from') + ' ' + data.variants[i].price;

 					optionFiledStructure1.attr({
 						"data-price": data.variants[i].price,
 						"data-numericprice": data.variants[i].numericPrice,
 						"data-availability": data.variants[i].availability,
 						"data-carousel": images,
 						"data-refid": data.variants[i].refid,
 						"data-showreqprice": data.variants[i].showReqPrice,
 						"value": data.variants[i].refid,
 						"data-sellable": data.variants[i].sellable

 					}).html(data.variants[i].size);

 					dropdownOptions.append(optionFiledStructure1);
 				}
 				_cache.$sizeSelector.empty();
 				_cache.$sizeSelector.append($(dropdownOptions).children());
 				_cache.$sizeSelector.removeClass('display-none');
 				$('.attributes-sizing-guide').removeClass('display-none');
 				var pid = $('#productid').val(),
 					localstorge = $.jStorage,
 					localStorageSize = localstorge.get(pid + 'size');

 				if (localStorageSize !== null)
 					$('.js-sizeselector').val(localStorageSize).trigger('change');
 				else
 					$('.js-sizeselector').val("default").trigger('change');

 			}

 		},

 		/*
            @private method : push iamges in array
            @param : images
        */
 		_pushImagesInArray = function(images) {
 			var imageArray = '[';
 			for (var i = 0; i < images.length; i++) {
 				imageArray += '"' + images[i] + '"';
 				if (i < (images.length - 1)) {
 					imageArray += ",";
 				}
 			}
 			imageArray += ']';
 			return imageArray;
 		},

 		/*
            @private method : sets the fields from the local storage
            @param : none
        */
 		_textFieldGetterSetter = function() {
 			var
 			pid = $('#productid').val(),
 				localstorge = $.jStorage,
 				localStorageLine1 = localstorge.get(pid + 'js-line-1'),
 				localStorageLine2 = localstorge.get(pid + 'js-line-2'),
 				localStorageLine3 = localstorge.get(pid + 'js-line-3'),
 				localStorageFont = localstorge.get(pid + 'js-font-style'),
 				localStorageFit = localstorge.get(pid + 'js-fit-switch');

 			if (localStorageLine1 !== null)
 				_fieldSetterFromLocalStorage('js-line-1', localStorageLine1);

 			if (localStorageLine2 !== null)
 				_fieldSetterFromLocalStorage('js-line-2', localStorageLine2);

 			if (localStorageLine3 !== null)
 				_fieldSetterFromLocalStorage('js-line-3', localStorageLine3);

 			if (localStorageFont !== null) {
 				$('.' + localStorageFont).trigger('click');
 			}

 			if (localStorageFit !== null) {
 				$('.' + localStorageFit).trigger('click');
 			}

 			$('.engraving .js-confirm-button').on('click', function() {
 				localstorge.set(pid + 'js-line-1', $('.js-line-1').val());
 				localstorge.set(pid + 'js-line-2', $('.js-line-2').val());
 				localstorge.set(pid + 'js-font-style', $('input[name=fn_grpchoosefont]:checked').attr('class'));
 			});

 			$('.engraving .js-cancel-ac').on('click', function() {
 				localstorge.deleteKey(pid + 'js-line-1');
 				localstorge.deleteKey(pid + 'js-line-2');
 				localstorge.deleteKey(pid + 'js-font-style');
 			});

 			$('.adjust-size .js-confirm-button').on('click', function() {
 				localstorge.set(pid + 'js-line-3', $('.js-line-3').val());
 				localstorge.set(pid + 'js-fit-switch', $('input[name=fn_grptypefit]:checked').attr('class'));
 			});

 			$('.adjust-size .js-cancel-ac').on('click', function() {
 				localstorge.deleteKey(pid + 'js-line-3');
 				localstorge.deleteKey(pid + 'js-fit-switch');
 			});
 		},

 		/*
            @private method : sets the fields from the local storage
            @param : field class, localstorage
        */

 		_fieldSetterFromLocalStorage = function(fieldClass, localStorge) {
 			$('.' + fieldClass)
 				.val(localStorge)
 				.trigger('change')
 				.closest('fieldset')
 				.data('confirmFlag', 'true');
 		},
 		/*
            @private method : Save Comment Popup Box
            @param : none
        */
 		_saveButtonAjaxCallBack = function(parsedData, message, title, clickedEl) {
 			clickedEl.confirmBox();
 			clickedEl.data('plugin_confirmBox').popupInitialize({

 					'title': title,
 					'anchormessage': message,
 					'src': $('.js-wishlist_link_secure').val() + ".html",
 					'buttons': {
 						'ok': {
 							'buttonName': _objPropertiesMsg.okButton,
 							'class': 'cta-button cta-button__inner cta--red',
 							'action': function() {
 								location.reload();
 							}

 						}
 					}
 				},
 				clickedEl.data('plugin_confirmBox').confirmHide
 			);
 		},


 		/*
            @private method : Guest account
            @param : loggedIn :- login in or not
        */

 		_guestAccount = function(loggedIn) {
 			var ClickedEl = $(this);
 			if (loggedIn) {

 				$('.js-addtomywishlist-ok').on('click', function(e) {

 					e.preventDefault();
 					cartier.common.addSelectionToWishlist("addPDPwishlist", _saveButtonAjaxCallBack, _objPropertiesMsg.wishlistParagraph, _objPropertiesMsg.wishlistcopytoWishlist, ClickedEl);
 				});

 				$('.js-createnewwishlist-ok').on('click', function(e) {
 					var ClickedEl = $(this);
 					e.preventDefault();
 					cartier.common.addSelectionToWishlist("createPDPwishlist", function(data) {
 						var $option = $('.js-select-addtomywishlist option:first').clone();
 						$option.attr('data-wishlistno', data.wishlistNumber)
 							.val(data.wishlistName)
 							.html(data.wishlistName);


 						var addOption = true;
 						$('.js-select-addtomywishlist').find('option').each(function(index, el) {
 							if ($(el).attr('data-wishlistno') === data.wishlistNumber)
 								addOption = false;
 						});
 						if (addOption)
 							$('.js-select-addtomywishlist').append($option);

 						_saveButtonAjaxCallBack("", _objPropertiesMsg.wishlistParagraph, _objPropertiesMsg.wishlistcopytoWishlist, $('.js-createnewwishlist-ok'));
 					}, "", "", ClickedEl);
 				});

 			} else {

 				$('.js-add-selection').on('click', function() {
 					var ClickedEl = $(this);
 					cartier.common._guestAccountAjaxCallHandler("GuestUserWishList", ClickedEl);

 				});
 			}


 		},

 		/*
            @private method : initialize famous diamond carousel
            @param : none
        */

 		_initializeFamousDiamondSlider = function() {
 			_cache.$famousDiamonds.bxSlider({
 				mode: 'fade',
 				speed: 100,
 				auto: false,
 				autoHover: true,
 				pager: false
 			});
 		},

 		/*
            @private method : initialize history carousel
            @param : none
        */
 		_initializeHistorySlider = function() {

 			_cache.$historyVideoCarousel.bxSlider({
 				speed: 100,
 				auto: false,
 				autoHover: true,
 				pager: false,
 				onSliderLoad: function() {
 					setTimeout(function() {
 						var h = $('.history-carousel').find('.bx-viewport').height();
 						$('.history-carousel').find("iframe").css("height", h + "px");
 					}, 3000);

 				}

 			});
 		};



 	//--------------------------------------------------------------------------------------------------------
 	//          Module level validtion additions
 	//--------------------------------------------------------------------------------------------------------

 	/*
            @private method : extends jQuery validation for range checking on PDP
            @param : none
        */
 	$.validator.addMethod("range", function(value, element) {
 		var min,
 			max,
 			status = false,
 			decimalPattern = "[0-9]+(\\.[0-9][0-9]?)?",
 			sizeInputField = $("input[name='fn_wristsize']");
 		min = parseFloat(sizeInputField.data('min'));
 		max = parseFloat(sizeInputField.data('max'));

 		if (isNaN(min)) min = 5;
 		if (isNaN(max)) max = 10;

 		var patt1 = new RegExp(decimalPattern);
 		var validNo = patt1.test(value);
 		if (validNo === true && value >= min && value <= max && value.match(/\s/g) === null) {

 			status = true;
 		}

 		return status;
 	}, "Value filled is not in the range or has wrong format");


 	$.validator.addMethod("hasNoSpace", function(value, element) {
 		return value.match(/\s/) === null;
 	}, "");
 	/*
            @private method : extends jQuery validation for empty field checking on PDP
            @param : none
        */
 	$.validator.addMethod("emptyField", function(value, element) {

 		var status = true,
 			field1 = $("input[name='fn_commsgone']"),
 			field2 = $("input[name='fn_commsgtwo']");
 		if (field1.val() === "" && field2.val() === "") {
 			field1.addClass('error');
 			field2.addClass('error');
 			status = false;
 		} else {
 			field1.removeClass('error');
 			field2.removeClass('error');
 		}

 		return status;
 	}, "Please fill atleast one value");

 	/*
            @private method : multi line ellipsis fix
            @param : none
        */
 	var _setEllipses = function() {
 		var element = _cache.$searchProductDesc;
 		element.each(function() {


 		});
 	},
 		/*
        @private method : Request price call back function show pop function 
        @param : none
    */
 		_RquestPriceCallBack = function(data) {
 			if (typeof data === "object") {

 				var loggedIn = cartier.common.isLoggedIn();


 				var inputPath = $('input[name=registrationPath]'),
 					regPagePath = inputPath.length > 0 ? inputPath.val() : "#";

 				if (typeof(data.content.isSubmitSuccess) !== 'undefined' && data.content.isSubmitSuccess) {
 					$('.error-div').remove();

 					$('.js-req-price').find('.overlay-form').remove();
 					$('.js-req-price').find('.js-accordion_node__title').trigger('click');

 					if (loggedIn) {
 						$('body').confirmBox();
 						$('body').data('plugin_confirmBox').popupInitialize({
 								'title': _objPropertiesMsg.contactAmbassadorPopupHeading,
 								'message': _objPropertiesMsg.contactAmbassadorPopupText,
 								'buttons': {
 									'ok': {
 										'buttonName': _objPropertiesMsg.okButton,
 										'href': '#',
 										'class': 'cta-button cta-button__inner cta--red'

 									}

 								}
 							},
 							$('body').data('plugin_confirmBox').confirmHide

 						);
 					} else {
 						$('body').confirmBox();
 						$('body').data('plugin_confirmBox').popupInitialize({
 								'title': _objPropertiesMsg.contactAmbassadorPopupHeading,
 								'message': _objPropertiesMsg.contactAmbassadorPopupText,
 								'buttons': {
 									'ok': {
 										'buttonName': _objPropertiesMsg.okButton,
 										'href': '#',
 										'class': 'cta-button cta-button__inner cta--red'

 									}
 								},
 								'anchormessage1': _objPropertiesMsg.createAccount,
 								'src1': regPagePath + '.html' + "?viewcreate=true",
 								'linkClasses': 'create-account-link'
 							},
 							$('body').data('plugin_confirmBox').confirmHide

 						);

 					}

 					$($('#confirmButtons button')[0]).on('click', function() {
 						location.href = '' + $(this).attr('href') + '';
 					});

 				} else {
 					$('.error-div').remove();
 					$('.overlay-form').prepend('<div class="error-div">' + data.errorMessage + '</div>');
 					$('.error-div').ScrollTo({
 						duration: 800,
 						offsetTop: 140
 					});
 				}

 			}
 		};

 	//--------------------------------------------------------------------------------------------------------
 	//          Public functions
 	//--------------------------------------------------------------------------------------------------------



 	/*
            @public method :Init function for initializing the module
            @param : none
        */
 	product.init = function() {
 		RICHEMONT.AjaxCaller.listOfCallbackFun.RequestInformationAction = cartier.product.RequestInfoCallback;
 		RICHEMONT.AjaxCaller.listOfCallbackFun.ContactAmbassadorAction = ContactInfoCallback;
 		RICHEMONT.AjaxCaller.listOfCallbackFun.RequestPriceAction = _RquestPriceCallBack;
 		var loggedIn = cartier.common.isLoggedIn();
 		_objPropertiesPth = cartier.properties.paths;
 		_objPropertiesMsg = cartier.properties.messages;


 		_htmlTemplateInit();
 		// caching the jquery objects
 		_cacheObjects();

 		// store intial product ref no
 		_initialProductRef = _cache.$productRef.html();
 		_bindEvents();
 		_setEllipses();
 		if ($('.js-product-pdp').length > 0)
 			_onPageLoadCalls(); // Must be called as soon as the page loades

 		_engravingPreview();

 		_engravingClassToggle();

 		initializeOverlay();

 		if (loggedIn && $('.js-product-pdp').length > 0) {
 			initializeAccordionX();
 			_onPageLoadCalls2();
 		}

 		initializeSuggestionCarousel(_cache.$suggestionCarouselSlider);
 		initializeCarousel(_cache.carouselSlider);



 		initialize360();
 		cartier.formValidationWrapper.init();
 		_addValidation();

 		_addToShoppingHandler();
 		_guestAccount(loggedIn);
 		_initializeHistorySlider();
 		_initializeFamousDiamondSlider();
 		_textFieldGetterSetter();

 		if (_cache.$socialEmailForm.length) {
 			_socialEmailSubmit(_cache.$socialEmailForm, _objPropertiesPth.addressSubmit);
 		}
 		initializeAccordion();
 	};

 }(window, jQuery, cartier.product));


 /*product page ajax call ends here============================================================================= */