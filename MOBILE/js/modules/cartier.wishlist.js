/*!
* cartier.wishlist.js
* This file contains functionality handling the others module
*
* @project   cartier mobile
* @date      2014-03-11
* @author    SapientNitro 
* @licensor  cartier mobile
* @site      cartier mobile
   @dependency cartier.core.js
* @ NOTE:
    This file has the following sequence of the actions
    1) Declare all the private variables
    2) caching jquery wrapper objects and messages
               $last) call to init() method
*/
;
(function(win, $, wishlist, undefined) {
	//this will cause the browser to check for errors more aggressively
	'use strict';

	//check if jquery is defined, else retun
	if (typeof $ === "undefined") {
		//console.log("jQuery not found");
		return false;
	}

	/*
    private variables
    */

	var
	_cache = {},
		_objPropertiesMsg,
		_objPropertiesPth,
		cloneObjectLi,
		styleClass = {},
		actionName = {},
		/* “ DATE  08-10-2014 ||  DEFECT- care-4305 | BRANCH 2.0.0”  
        START
        show popup when a prodcut  no more visible
        */
		productVisibility = true,
		/*END*/

		//--------------------------------------------------------------------------------------------------------
		//         Caching jQuery object
		//--------------------------------------------------------------------------------------------------------
		/*
          @private method : caching jquery objects 
          @param : none 
        */

		_cacheObjects = function() {

			_cache = {
				$wishlist: $(".js-wishlistCont"),
				$commentBox: $(".js-message"),
				$buttonWrapper: $(".button-wrapper"),
				$accordionObject: $(".js-accordion"),
				$wishlistWrapper: $(".js-wishlist-select"),
				$listbuttonWrapper: $(".address-button"),
				$productListWrapper: $(".js-productListing"),
				$createwishlist: $('.js-createnewwishlist-ok'),
				$productclose: $(".js-wishlist-product-close"),
				$copyWishlist: $(".js-copytowishlist"),
				$addToWishlist: $(".js-addtomywishlist-ok"),
				$commentsave: $(".js-save"),
				$hiddenField: $(".js-hidden"),
				$hiddenAction: $(".js-hidden-action"),
				$editField: $(".edit-field"),
				$accordionBox: $(".js-accordion"),
				$selectBox: $('.js-form-select'),
				$copyToWishlistBox: $('.copy-to-wishlist'),
				$loaderWrapper: $('.js-accordion_node__desc'),
				$popupWrapper: $('.product-wrapper'),
				$addToShopping: $('.js-addtoshopping'),
				$reqPriceForm: $('.js-req-price')


			};

		},

		_cacheCssName = function() {

			styleClass = {
				wishlistsaveButton: ".js-savelist",
				wishlistCancelButton: ".js-cancellist",
				wishlistDeleteButton: ".js-deletelist",
				wishlistSelect: ".js-form-select",
				productListWrapper: ".js-product-wrapper",
				errorClass: ".js-error",
				displayNone: "display-none",
				displayBlock: "display-block",
				inputField: ".js-inputfield",
				formLabel: ".form-label",
				headingArea: ".heading3",
				productDetail: ".product-detail__size",
				productVariant: ".product-detail__variant",
				productPrice: ".price-text",
				textBox: ".form-textarea",
				editButton: ".js-edit"



			};
		},

		_cacheActionName = function() {
			actionName = {
				saveAction: 'save',
				deleteAction: 'delete',
				changeAction: 'onchange',
				addwishlistAction: 'addwishlist',
				commentsaveAction: 'commentsave',
				productdeleteAction: 'productdelete',
				productdeleteActionGuest: 'guestProductDelete',
				createAction: 'createwishlist',
				variantChangeAction: 'onVariantChange'

			};

		},
		//--------------------------------------------------------------------------------------------------------
		//          EVENT Bindings
		//--------------------------------------------------------------------------------------------------------

		/*
          @private method : bind events
          @param : none
        */
		_bindEvents = function() {
			_cache.$reqPriceForm.find('.js-accordion_node__title').on('click', _bindEventsReqPriceHandler);
			//Onclick bind event for save button
			_cache.$listbuttonWrapper.find(styleClass.wishlistsaveButton).on('click', {
				callbackFunction: _saveListHandler,
				hiddenValue: actionName.saveAction
			}, _ajaxCallHandler);

			//Onclick bind event for cancel button
			_cache.$listbuttonWrapper.find(styleClass.wishlistCancelButton).on('click', function(e) {
				e.preventDefault();
				_saveListHandler(true);
			});

			//Onclick bind event for delete button
			_cache.$listbuttonWrapper.find(styleClass.wishlistDeleteButton).on('click', {
				callbackFunction: _deleteListHandler,
				hiddenValue: actionName.deleteAction
			}, _ajaxCallHandler);

			//Change bind event for drop down
			_cache.$wishlistWrapper.find(styleClass.wishlistSelect).on('change', _onChangeAjaxCallHandler);

			//Onclick bind event for Create Wishlist
			_cache.$createwishlist.on('click', _createWishlistHandler);

			//Onclick bind event for delete product
			_cache.$productclose.on('click', _wishlistProductCloseHandler);

			//Onclick bind event for copy to another wishlist
			_cache.$copyWishlist.on('click', function(e) {
				e.preventDefault();
			});

			//Onclick bind event for add to wishlist
			_cache.$addToWishlist.on('click', function(e) {
				e.preventDefault();
				_ajaxSubmitHandler($(this), actionName.addwishlistAction, _saveButtonAjaxCallBack, _objPropertiesMsg.wishlistcopytoWishlist, _objPropertiesMsg.wishlistParagraph);
			});

			//on varinat change ajax call 
			_cache.$productListWrapper.find('.js-variant-box').on('change', _variantOnChangeAjaxCall);
			//Onclick bind event for comment save
			_cache.$commentsave.on('click', function(e) {
				e.preventDefault();
				_ajaxSubmitHandler($(this), actionName.commentsaveAction, _saveButtonAjaxCallBack, _objPropertiesMsg.wishListSavePopup, '');
			});


			_cache.$addToShopping.on('click', _addToShoppingClickHandler);

			/* “ DATE  08-10-2014 ||  DEFECT- care 4305 | BRANCH 2.0.0”  
                    START
                    show popup when a prodcut  no more visible.if initialy zero product in wish list then change cloning object
         	*/

			//clone li of products
			if (false) {
				cloneObjectLi = _cache.$productListWrapper.find('li:first').clone(true, true);
			} else {
				cloneObjectLi = $('.dummy-clone-Object').clone(true, true);
				cloneObjectLi = cloneObjectLi.removeClass('display-none');
			}
			/*END*/

		},
		/*
      @private method : Click handler for click on the add to shopping bag
      @param : none
    */
		_addToShoppingClickHandler = function(e) {
			var that = $(this);
			var objXHR = cartier.ajaxWrapper.getXhrObj({
				type: 'POST',
				url: _objPropertiesPth.addToCartLink,
				data: $(this).closest('form').serialize(),
				dataType: 'json',
				contentType: "application/x-www-form-urlencoded",
				beforeSend: function(jqXHR) {
					
					var sizeDD = that.closest('.js-product-wrapper').find('.js-variant-box').closest('.filter-wrapper');
					sizeDD.find('span.error').remove();

					if (that.closest('.js-product-wrapper').find('.js-variant-box').val() === "default") {
						that.closest('.js-product-wrapper').find('.js-variant-box').addClass('error');
						jqXHR.abort();
						sizeDD.append('<span class="error">'+ _objPropertiesMsg.validOption +'</span>');
					}

					$('.js-addtoshopping').attr('disabled', 'disabled').before('<div class="loaderDiv">' + _objPropertiesMsg.addingToCart + '</div>');
					$('.loaderDiv').addLoader();
				}
			});
			if (objXHR) {
				objXHR.done(function(data) {
					// handle failure
					if (typeof data === "undefined") {} else { // handle success
						$('.js-addtoshopping').removeAttr('disabled');
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
						cartier.common.checkCookie();
					}
				});
			}
			return false;
		},
		_getPriceRules = function() {
			var $addMessage = $('.requestPrice_checkbox_askForPrice');
			var $conPref = $('.radio-conpref');
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
		_bindEventsReqPriceHandler = function(e) {
			$('.message-area').remove();
			_getPriceRules();
			e.preventDefault();
			if (!(_cache.$reqPriceForm.find("form").length > 0)) {
				_cache.$reqPriceForm.find(".js-accordion_node__title").unbind('click', _bindEventsReqPriceHandler);
				_cache.$reqPriceForm.find(".js-accordion_node__desc").addLoader();
				_getAndAppendForm(_cache.$reqPriceForm, _objPropertiesPth.requestPriceAjaxForm, function(parsedData) {

					_cache.$reqPriceForm.find(".js-accordion_node__desc").append(parsedData);

					$('.loaderImage').remove();
					setTimeout(function() {
						$('.js-req-price').find('input:checkbox, input:radio, select').uniform();
						$('.js-request-info').find('input:checkbox, input:radio, select').not('.no-uniform').uniform();
						$('.radio-wrapper').find('label').removeClass('radio');

					}, 200);

					$(_cache.$reqPriceForm.find('form input[name=fn_grpcontpref3]')[0]).prop('checked', true);
					_cache.$reqPriceForm.find(".js-accordion_node__desc").removeLoader(); //Removes the loader
					//_cache.$reqPriceForm.find('form').append('<input type="hidden" name="pdp_pagepath" value="' + $('#pagePath').val() + '">');
					$('input[name=pdp_pagepath]').val($('#pagePath').val());
					_cache.$reqPriceForm.find(".js-accordion_node__title").on('click', _bindEventsReqPriceHandler);

					_changeMandatoryEmailorPhone();
					_displayEmailOrPhone(); //gives the functionality of chosing email or phone

					 if ($('#fn_country').length) {
                        $('#fn_country').rules("add", {
                            required: true,
                            messages: {
                                required: _objPropertiesMsg.mandatory
                            }
                        });

                    }
                    
					setTimeout(function() {
						$('.requestPrice_contactPreference').find(".radio-btn-li:eq(0) input").trigger('click');
						$("input[name=requestInformation_contactPreference][value=email]").trigger('click');

					}, 10); /// Fix for firefox
					$('.body-wrapper')
						.data('plugin_analytics')
						.productGAEvents();
				});
			}
		},

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

		_getAndAppendForm = function($node, link, callback) {
			var objXHR = cartier.ajaxWrapper.getXhrObj({
				type: 'GET',
				url: link,
				dataType: "html"
			});

			if (objXHR) {
				objXHR.done(function(data) {
					// handle failure
					if (typeof data == "undefined") {
						// handle redirectURL exist if the session expires                    
					} else { // handle success
						var parsedData = $($.parseHTML(data, document, true)).find('.overlay-form').addBack('.overlay-form');
						callback(parsedData);
						cartier.formValidationWrapper.applyValidation($node.find('form'));
					}
				});
			}
			return false;
		},
		/*
          @private method : Save Comment Popup Box
          @param : none 
        */
		_saveButtonAjaxCallBack = function(parsedData, object, title, message) {
			_cache.$popupWrapper.confirmBox();
			_cache.$popupWrapper.data('plugin_confirmBox').popupInitialize({
					'title': title,
					'message': message,
					'buttons': {
						'ok': {
							'buttonName': _objPropertiesMsg.okButton,
							'class': 'cta-button cta-button__inner cta--red'
						}
					}
				},
				_cache.$popupWrapper.data('plugin_confirmBox').confirmHide

			);


		},

		/*
          @private method : Product Delete Handler
          @param : e :- event
        */
		_wishlistProductCloseHandler = function(e) {
			e.preventDefault();
			$('.js-actiontype-variant').val("");

			$(this).before('<div class="loaderDiv">' + '' + '</div>');
			$('.loaderDiv').addLoader();

			var actionNameSend = "";
			if (cartier.common.isLoggedIn()) {
				actionNameSend = actionName.productdeleteAction;
			} else {
				actionNameSend = actionName.productdeleteActionGuest;
			}
			_ajaxSubmitHandler($(this), actionNameSend, function(data, object) {


				object.closest(styleClass.productListWrapper).remove();

				//If there is no product then error message appears
				if (!$('.js-productListing').children().length) {
					_cache.$wishlist.find(styleClass.errorClass).removeClass(styleClass.displayNone)
						.addClass(styleClass.displayBlock);
				}
				//If there is products then error message disappears
				else {
					_cache.$wishlist.find(styleClass.errorClass).removeClass(styleClass.displayBlock)
						.addClass(styleClass.displayNone);
				}

				// delete msg pop up

				$('.main-container').confirmBox();
				$('.main-container').data('plugin_confirmBox').popupInitialize({
						'title': _objPropertiesMsg.productDeleted,
						'buttons': {
							'ok': {
								'buttonName': _objPropertiesMsg.okButton,
								'class': 'cta-button cta-button__inner cta--red'
							}
						}

					},
					$('.main-container').data('plugin_confirmBox').confirmHide
				);

			});
		},

		/*
          @private method : Accordion Handler
          @param : none 
        */
		initializeAccordion = function() {
			_cache.$accordionObject.makeAccordion({
				showBehaviour: true
			});
		},

		/*
              @private method : Create wishlist button handler
              @param : event :- e 
        */

		_createWishlistHandler = function(e) {
			e.preventDefault();

			$(this).before('<div class="loaderDiv">' + '' + '</div>');
			$('.loaderDiv').addLoader();
			_ajaxSubmitHandler($(this), actionName.createAction, function(data) {
				//clone first option element in drop down
				var $option = $('.js-form-select option:first').clone();

				//pass attributes and html of new wishlist and then append it in drop down
				$option.attr('data-wishlistno', data.wishlistNumber)
					.val(data.wishlistName)
					.html(data.wishlistName);



				var addOption = true;
				_cache.$selectBox.find('option').each(function(index, el) {
					if ($(el).attr('data-wishlistno') === data.wishlistNumber)
						addOption = false;
				});
				if (addOption)
					_cache.$selectBox.append($option);


				_wishlistDropdown();


				_cache.$copyToWishlistBox.confirmBox();
				_cache.$copyToWishlistBox.data('plugin_confirmBox').popupInitialize({
						'title': _objPropertiesMsg.wishlistcopytoWishlist,
						'message': _objPropertiesMsg.wishlistParagraph,
						'buttons': {
							'ok': {
								'buttonName': _objPropertiesMsg.okButton,
								'class': 'cta-button cta-button__inner cta--red'

							}

						}
					},
					_cache.$copyToWishlistBox.data('plugin_confirmBox').confirmHide
				);


				_cache.$wishlistWrapper.find('.list-name')
					.addClass(styleClass.displayNone)
					.removeClass(styleClass.displayBlock)
					.end()
					.find('.form-select')
					.addClass(styleClass.displayBlock)
					.removeClass(styleClass.displayNone)
					.end()
					.find('.select-label')
					.addClass(styleClass.displayBlock)
					.removeClass(styleClass.displayNone)
					.end()
					.find('.label-name')
					.addClass(styleClass.displayNone)
					.removeClass(styleClass.displayBlock);



			});
		},


		/*
              @private method : ajax call handler
              @param : event :- event
        */

		_ajaxCallHandler = function(event) {

			$('.js-actiontype-variant').val("");

			// pass values for hidden text fields
			_cache.$hiddenField.val($('.form-select option:selected').data('wishlistno'));
			event.preventDefault();

			var _ajaxCallBack = event.data.callbackFunction;
			// pass values for hidden text fields
			_cache.$hiddenAction.val(event.data.hiddenValue);
			_cache.$wishlistWrapper.addLoader();
			var objXHR = cartier.ajaxWrapper.getXhrObj({
				type: 'POST',
				url: _objPropertiesPth.saveWishlist,
				data: $(this).closest('form').serialize(),
				dataType: 'html',
				contentType: "application/x-www-form-urlencoded",
				beforeSend: function(jqXHR) {
					if (!_cache.$wishlistWrapper.find('.js-inputfield').hasClass('display-none') && !_cache.$wishlistWrapper.find('.js-inputfield').valid()) {
						jqXHR.abort();
					}
					return false; //to cancel submit 
				}

			});
			if (objXHR) {
				objXHR.done(function(data) {
					// handle failure
					if (typeof data.success !== "undefined" && !data.success) {

					} else { // handle success
						//callback function
						_ajaxCallBack();
					}
				});
			}
			_cache.$wishlistWrapper.removeLoader();
			return false;
		},

		/*
          @private method : Ajax call for onchange event on dropdown menu
          @param : none 
        */
		_onChangeAjaxCallHandler = function() {



			$('.js-actiontype-variant').val("");

			// pass values for hidden text fields
			_cache.$hiddenField.val($('.form-select option:selected').data('wishlistno'));
			_cache.$hiddenAction.val(actionName.changeAction);

			_cache.$wishlistWrapper.addLoader();
			var objXHR = cartier.ajaxWrapper.getXhrObj({
				type: 'POST',
				data: $('.js-wishlist-select form').serialize(),
				url: _objPropertiesPth.saveWishlist,
				dataType: "json",
				contentType: "application/x-www-form-urlencoded"
			});


			if (objXHR) {
				objXHR.done(function(productData) {
					// handle failure
					if (typeof productData.success !== "undefined" && !productData.success) {
						// handle redirectURL exist if the session expires
						// data.redirectURL ?  win.location.href = data.redirectURL : $form.find('.server_message').html(data.errorMessage);
					} else {

						var parsedData = cartier.common.cartierJSONparser({
							json: productData
						});

						if (parsedData !== false) {
							//callback function
							_onchangeHandler(parsedData);
							$('.body-wrapper').data('plugin_analytics').wishlistGA();

						}
					}
				});
			}
			_cache.$wishlistWrapper.removeLoader();
		},

		/*
          @private method : variant on change event ajax call 
          @param : event : default event element
        */
		_variantChangeCallBack = function(data) {

			if (data.productUpdatedInfo !== "keep") {

				// can not cache this variable change on ajax call
				var existingDomListEl = $('.js-productListing').find('li');

				//delete other product
				existingDomListEl.each(function(key, val) {
					if ($(this).data("refid") === data.refId) {

						if (!($(this).hasClass('js-update'))) {
							$(this).closest('li').remove();
						}
					}
				});
				existingDomListEl.removeClass('js-update');



			}



		},

		/*
          @private method : variant on change event ajax call 
          @param : event : default event element
        */
		_variantOnChangeAjaxCall = function(event) {



			$(this).removeClass('error').closest('.filter-wrapper').find('span.error').remove();

			var optionData = $(this).find(':selected').data();



			var displayRef = optionData.refid;

			if (typeof displayRef !== "undefined" && displayRef[0] == "C" && displayRef[1] == "R")
				displayRef = displayRef.slice(2, displayRef.length + 1);

			$(this).closest('li').find('.js-product-ref').html(displayRef)

			.end()

			.find('.js-price-text').html(optionData.price);

			if (optionData.availability) {
				$(this).closest('li').find('.js-req-price').closest('.js-accordion')
					.addClass('display-none')
					.removeClass('display-block');
				$(this).closest('li').find('.js-addtoshopping').removeClass('display-none')
					.addClass('display-block');

				$(this).closest('li').find('.product__price').removeClass('display-none');

			} else {
				$(this).closest('li').find('.js-req-price').closest('.js-accordion')
					.removeClass('display-none')
					.addClass('display-block');
				$(this).closest('li').find('.js-addtoshopping').addClass('display-none');
				$(this).closest('li').find('.product__price').addClass('display-none');
			}


			if (typeof optionData.carousel === "string" && optionData.carousel !== "" && optionData.carousel !== "undefined") {
				if (optionData.carousel[0] === '[') {
					$(this).closest('li').find('.js-product-image img').attr('src', optionData.carousel.split(',')[1]);
				} else {
					$(this).closest('li').find('.js-product-image img').attr('src', optionData.carousel);
				}
			}
			// pass values for hidden text fields
			var oldVariant = $(this).data("selectedvariant"),
				updatedVariant,
				selectEl = $(this);


			// click on option set ref id on select
			updatedVariant = $(this).find(':selected').data('refid');

			$(this).attr("data-selectedvariant", updatedVariant);
			// set new update mark for this product 
			$(this).closest('li').addClass('js-update')
				.attr("data-refid", updatedVariant);

			$(this).closest('li').find("#variant").val(oldVariant);
			$(this).closest('li').find("#updated-variant").val(updatedVariant);
			$(this).closest('li').find("#wishlistIdVariant").val($(this).closest('li').find('#wishlistId').val());
			$(this).closest('li').find("#wishlistNameVariant").val($('.js-form-select option:selected').val());
			$(this).closest('li').find("#fn_refid").val(updatedVariant);
			_cache.$hiddenField.val($('.form-select option:selected').data('wishlistno'));



			event.preventDefault();
			// pass values for hidden text fields
			$('.js-actiontype-variant').val("onVariantChange");
			_cache.$wishlistWrapper.addLoader();
			var objXHR = cartier.ajaxWrapper.getXhrObj({
				type: 'POST',
				url: _objPropertiesPth.saveWishlist,

				data: $(this).closest('form').serialize(),
				dataType: 'json',
				contentType: "application/x-www-form-urlencoded"


			});
			if (objXHR) {
				objXHR.done(function(productData) {
					// handle failure
					if (typeof productData.success !== 'undefined' && !productData.success) {
						// handle redirectURL exist if the session expires
						// data.redirectURL ?  win.location.href = data.redirectURL : $form.find('.server_message').html(data.errorMessage);
					} else {

						var parsedData = cartier.common.cartierJSONparser({
							json: productData
						});

						if (parsedData !== false) {
							_variantChangeCallBack(productData.content);
						}
					}
				});
			}
			_cache.$wishlistWrapper.removeLoader();


		},
		/*
          @private method : create variant list drop down list html
          @param : variantList :  variant list and reference id
        */
		_crateaVarientslistHtml = function(variantList, selectedVariantSize, prodref, prodprice, prodimage, availability) {
			// console.log(prodimage);

			var dropDownOptionHtml = '<option data-availability="' + availability + '" data-carousel= ' + prodimage + '  data-price="' + prodprice + '"  data-refid = "' + prodref + '" value="default">Size</option>',
				variantListLength = variantList.length,
				selectVariantRef = "";

			for (var i = 0; i < variantListLength; i++) {
				if (variantList[i].value === selectedVariantSize) {
					selectVariantRef = variantList[i].refId;
				}
				if (selectVariantRef === "") {
					selectVariantRef = prodref;
				}
				dropDownOptionHtml += '<option value=' + variantList[i].value + ' data-refid =' + variantList[i].refId + ' data-price= ' + variantList[i].variantPrice +
					'  data-carousel=  ' + variantList[i].variantImage[0] + '  data-availability= ' + variantList[i].availability + ' > ' + variantList[i].displaySize + '</option>';



			};

			return {
				"dropdown": dropDownOptionHtml,
				"selectedRef": selectVariantRef,
				"size": selectedVariantSize
			};
		},


		/*
          @private method : Filter products according to the selected wishlist
          @param : productData - default event parameter
        */


		_onchangeHandler = function(productData) {

			$('.js-actiontype-variant').val("");

			productVisibility = true;

			//define variables for product. product length , new product list
			var $products = productData.wishlist.products,
				productnewList = $(".js-form-select option:selected").html(),
				productLength = $products.length;

			// Empty previous products
			_cache.$wishlist.find('.js-productListing').empty();
			// Clone products
			var cloneObjectUl = $('.js-productListing').clone(true, true);
			_cache.$editField.find(styleClass.formLabel).html(productnewList);
			// For loop of total number of products
			for (var i = 0; i < productLength; i++) {
				/* “ DATE  08-10-2014 ||  DEFECT- care 4503 | BRANCH 2.0.0”  
                    START
                    show popup when a prodcut  no more visible.add if condition
                */

				if ($products[i].product_visibility) {

					// create variant drop down list 
					var varients = _crateaVarientslistHtml($products[i].variant, $products[i].selectedVariant, $products[i].product_reference, $products[i].product_price, $products[i].product_image, $products[i].availability),
						// define variable to clone an object
						newObject = cloneObjectLi.clone(true, true);

					// Fill the data through JSON data
					newObject
						.find(styleClass.headingArea).html($products[i].product_name)
						.end()
						.find(styleClass.productDetail).html($products[i].product_localReference)
						.end()
						.find(styleClass.productVariant).html($products[i].product_description)
						.end()
						.find('img').attr({
							src: $products[i].product_image,
							alt: $products[i].product_name
						})
						.end()
						.find('.product-detail .heading3').closest('a').attr('href', $products[i].product_node + '.html')
						.end()
						.find(styleClass.productPrice).html($products[i].product_price)
						.end()
						.find(styleClass.textBox).html($products[i].product_comment !== undefined ? $products[i].product_comment : '')
						.end()
						.find('#productId').val($products[i].product_node)
						.end()
						.find('#wishlistId').val($('.js-form-select option:selected').data('wishlistno'))
						.end()
						.find('#wishlistName').val($('.js-form-select option:selected').val());


					newObject.find('.pdpPathFinal').val($products[i].product_node);


					/*.end()
						.find('select').empty()
				   		.append(varients.dropdown)
						.val(varients.size.toString())
						.attr("data-selectedVariant", varients.selectedRef)
						.end()
						.find("#updated-variant").val(varients.selectedRef);*/


					newObject.find('.filter-wrapper select').empty().append(varients.dropdown)
						.val(varients.size.toString())
						.attr("data-selectedVariant", varients.selectedRef)
						.end()
						.find("#updated-variant").val(varients.selectedRef);

					if ($products[i].product_price === "" || !$products[i].availability) {
						newObject.find('.js-req-price').closest('.js-accordion')
							.removeClass('display-none')
							.addClass('display-block');
						newObject.find('.js-addtoshopping').addClass('display-none');
						newObject.find('.product__price').addClass('display-none');

					} else {
						newObject.find('.js-req-price').closest('.js-accordion')
							.addClass('display-none')
							.removeClass('display-block');
						newObject.find('.js-addtoshopping').removeClass('display-none')
							.addClass('display-block');

					}
					newObject.attr('data-refid', varients.selectedRef);

					newObject.attr('data-productid', $products[i].product_reference);
					newObject.attr('data-productName', $products[i].product_name_ga);
					newObject.attr('data-productLine', $products[i].product_productLine_ga);
					newObject.attr('data-productCollection', $products[i].product_productCollection_ga);
					newObject.attr('data-sellable', $products[i].product_sellable);

					newObject.find(styleClass.textBox).html($products[i].product_comment !== undefined ? $products[i].product_comment : '');

					// append variant drop down box 
					newObject.find('.product .filter-wrapper select').on('change', _variantOnChangeAjaxCall);
					// Append object in to the cloned UI

					var selected = $products[i].selectedVariant;
					var variantsDash = $products[i].variant.length;

					if (selected != "" && variantsDash !== 0) {

						newObject.find('.product .filter-wrapper').removeClass('display-none');
					} else {

						newObject.find('.product .filter-wrapper').addClass('display-none');
					}

					setTimeout(function() {
						if (selected != "" && variantsDash !== 0) {
							newObject.find('.product .filter-wrapper').find('.js-variant-box').trigger('change');
						}
					}, 100);

					cloneObjectUl.append(newObject);

				} else {
					productVisibility = false;
				}
				/*END*/
			}


			/* “ DATE  08-10-2014 ||  DEFECT- care 4503 | BRANCH 2.0.0”  
                    START
                    show popup when a prodcut  no more visible.if initialy zero product in wish list then change cloning object
         	*/
			//show popup if any one product visibilty is false in given wish list 	
			if (!productVisibility) {
				_saveButtonAjaxCallBack("", "", _objPropertiesMsg.wishlistParagraph, _objPropertiesMsg.wishListProductRemoved);
			}
			/*END*/
			// Replace new object with product listing
			_cache.$wishlist.find('.js-productListing').replaceWith(cloneObjectUl);

			//If there is no product then error message appears
			if (!$('.js-productListing').children().length) {
				_cache.$wishlist.find(styleClass.errorClass).removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock);
			}

			//If there is no product then error message disppears
			else {
				_cache.$wishlist.find(styleClass.errorClass).removeClass(styleClass.displayBlock)
					.addClass(styleClass.displayNone);
			}



			//call accordion
			_cache.$accordionBox.makeAccordion({
				showBehaviour: true
			});
			//call wishlist dropdown function
			_wishlistDropdown();
		},

		/*
          @private method : Delete wishlist handler
          @param : none 
        */

		_deleteListHandler = function() {
			//check the length of drop down listing
			var OptionLength = _cache.$wishlistWrapper.find('.form-select option').length,
				$noItemInWishlistEl = $('.js-error');

			//check the length of options in drop down
			if (OptionLength === 1) {
				_cache.$wishlistWrapper.find('.edit-field')
					.addClass(styleClass.displayNone)
					.end()
					.find('.select-label')
					.removeClass(styleClass.displayNone)
					.html(_objPropertiesMsg.wishlistNoItems)
					.end()
					.find('.form-input')
					.removeClass(styleClass.displayBlock)
					.addClass(styleClass.displayNone)
					.end()
					.find(styleClass.editButton)
					.addClass(styleClass.displayNone)
					.end()
					.find('.js-deletelist')
					.addClass(styleClass.displayNone)
					.end()
					.find('.label-name')
					.removeClass(styleClass.displayBlock)
					.addClass(styleClass.displayNone);

				_cache.$wishlistWrapper.find('.select-label').html("<div class='zero-result-msg'>" + _objPropertiesMsg.wishlistNoItems + "</div>");
				_cache.$wishlistWrapper.find('.address-button').addClass(styleClass.displayNone);

				// remove zero product message
				if ($noItemInWishlistEl.length > 0) {
					$noItemInWishlistEl.addClass('display-none');


				}

				$('.js-productListing').empty();

			} else if (OptionLength === 2) {

				var selectList = $('.form-select option:not(:selected)').val();
				_cache.$wishlistWrapper.find('.list-name')
					.removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock)
					.end()
					.find('.form-select')
					.addClass(styleClass.displayNone)
					.removeClass(styleClass.displayBlock)
					.end()
					.find('.select-label')
					.addClass(styleClass.displayNone)
					.removeClass(styleClass.displayBlock)
					.end()
					.find('.label-name')
					.removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock)
					.text(selectList);

			}

			//Remove selected drop down options
			_cache.$wishlistWrapper.find('.form-select option:selected').remove();

			_cache.$wishlistWrapper.confirmBox();
			_cache.$wishlistWrapper.data('plugin_confirmBox').popupInitialize({
					'title': _objPropertiesMsg.wishlistDeleted,
					'message': "",
					'buttons': {
						'ok': {
							'buttonName': _objPropertiesMsg.okButton,
							'class': 'cta-button cta-button__inner cta--red'
						}
					}
				},
				_cache.$wishlistWrapper.data('plugin_confirmBox').confirmHide
			);


			_cache.$wishlistWrapper.find('.form-select option:selected').trigger('change');
			_wishlistDropdown();


		},
		/*
          @private method : Save wishlist name and update into dropdown options
          @param : none 
        */
		_saveListHandler = function(isCancle) {
			//Define varibales
			var saveList = _cache.$wishlistWrapper.find('.form-input').val();
			if (isCancle) {
				saveList = $('.js-form-select option:selected').val();
			};

			var
			newList = $('.js-form-select option:selected').val(saveList).html(saveList),
				listName = _cache.$wishlistWrapper.find('.form-label').html(saveList),
				editText = $('.heading-wrapper').children().last().text().replace(_objPropertiesMsg.wishListeditText, "");


			$('.heading-wrapper').children().last().text(editText);
			// Save list action
			_cache.$wishlistWrapper.find('button')
				.removeClass(styleClass.displayBlock)
				.addClass(styleClass.displayNone)
				.end()
				.find(styleClass.editButton)
				.removeClass(styleClass.displayNone)
				.addClass(styleClass.displayBlock)
				.end()
				.find('.form-input')
				.addClass(styleClass.displayNone)
				.end()
				.find('.select-label')
				.removeClass(styleClass.displayNone)
				.addClass(styleClass.displayBlock)
				.end()
				.find('.list-name')
				.addClass(styleClass.displayNone)
				.end()
				.find(styleClass.wishlistSelect)
				.removeClass(styleClass.displayNone)
				.addClass(styleClass.displayBlock)
				.end()
				.find('.js-deletelist')
				.removeClass(styleClass.displayNone)
				.addClass(styleClass.displayBlock);

			var OptionLength = _cache.$wishlistWrapper.find('.form-select option').length;
			if (OptionLength === 1) {

				_cache.$wishlistWrapper.find('.list-name')
					.removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock)
					.end()
					.find('.form-select')
					.addClass(styleClass.displayNone)
					.removeClass(styleClass.displayBlock)
					.end()
					.find('.select-label')
					.addClass(styleClass.displayNone)
					.removeClass(styleClass.displayBlock)
					.end()
					.find('.label-name')
					.removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock);
				$('.label-name').html(saveList);
			}

			_wishlistDropdown();
		},

		/*
          @private method : Edit wishlist name handler
          @param : none 
        */
		editList = function() {
			//On click event for edit button
			_cache.$wishlistWrapper.find('.js-edit').on('click', function(e) {
				e.preventDefault();
				// Define variable for selected option and their respective value
				var selectedDataList = $('.form-select option:selected').data('wishlistno'),
					selectList = $('.form-select option:selected').val();

				//Pass hidden values 
				$('.js-hidden').val(selectedDataList);

				_cache.$wishlistWrapper.find('.form-input').attr({
					placeholder: selectList,
					value: selectList
				}).val(selectList);

				$('.heading-wrapper').children().last().prepend(_objPropertiesMsg.wishListeditText + " ");
				// Action of edit button
				_cache.$wishlistWrapper.find('.js-edit')
					.addClass(styleClass.displayNone)
					.end()
					.find('button')
					.removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock)
					.end()
					.find('.list-name')
					.removeClass(styleClass.displayNone)
					.end()
					.find('.form-input')
					.removeClass(styleClass.displayNone)
					.end()
					.find('.select-label')
					.addClass(styleClass.displayNone)
					.end()
					.find(styleClass.wishlistSelect)
					.addClass(styleClass.displayNone)
					.end()
					.find('.label-name')
					.removeClass(styleClass.displayBlock)
					.addClass(styleClass.displayNone)
					.end()
					.find('.js-deletelist')
					.removeClass(styleClass.displayBlock)
					.addClass(styleClass.displayNone);

				var OptionLength = _cache.$wishlistWrapper.find('.form-select option').length;

				if (OptionLength === 1) {
					_cache.$wishlistWrapper.find('.list-name')
						.removeClass(styleClass.displayNone)
						.addClass(styleClass.displayBlock)
						.end()
						.find('.form-select')
						.addClass(styleClass.displayNone)
						.removeClass(styleClass.displayBlock)
						.end()
						.find('.select-label')
						.addClass(styleClass.displayNone)
						.removeClass(styleClass.displayBlock)
						.end()
						.find('.label-name')
						.removeClass(styleClass.displayBlock)
						.addClass(styleClass.displayNone);

				}

			});
		};

	/*
        @private method : Wishlist dropdown options
        @param : none 
    */

	var _wishlistDropdown = function() {
		var options = $('.js-form-select option').not(':selected').clone(true, true);
		if (options.length === 0) {
			$('.copy-to-wishlist').find('.input-field:eq(0)').addClass('display-none');
		} else {
			$('.copy-to-wishlist').find('.input-field:eq(0)').removeClass('display-none');
		}
		$('.js-select-addtomywishlist').html(options);
	};

	/*
          @private method : Ajax submit handler
          @param : object-  Object name
                    action - Action name
                    callback - callback function for every ajax call
    */

	var _ajaxSubmitHandler = function(object, action, callback, title, message) {
		$('.js-actiontype-variant').val("");
		//pass some hidden fields
		$('.js-hidden').val($('.form-select option:selected').data('wishlistno'));
		$('#wishlistId').val($('.js-form-select option:selected').data('wishlistno'));
		$('.js-add-number').val($('.js-select-addtomywishlist option:selected').data('wishlistno'));
		$('.js-save-name').val($('.form-select option:selected').val());


		_cache.$loaderWrapper.addLoaderPrepend();

		var objXHR = cartier.ajaxWrapper.getXhrObj({
			type: 'POST',
			url: _objPropertiesPth.saveWishlist,
			data: object.closest('form').serialize() + "&action=" + action,
			dataType: 'json',
			contentType: "application/x-www-form-urlencoded",
			beforeSend: function(jqXHR) {
				if (action === "createwishlist") {
					cartier.formValidationWrapper.applyValidation(object.closest('form'));
					if (!object.closest('.input-field').find('input').valid()) {
						jqXHR.abort();
					}
				}
			}
		});
		if (objXHR) {
			objXHR.done(function(data) {
				// handle failure
				if (typeof data.success !== "undefined" && !data.success) {

				} else { // handle success


					var parsedData = cartier.common.cartierJSONparser({
						json: data
					});


					if (parsedData !== false) {

						//callback function
						callback(parsedData, object, title, message);
					}

				}
			});
		}
		_cache.$loaderWrapper.removeLoader();

		return false;
	},
		_removeWishlistCookie = function() {
			function getDomainName(hostName) {
				return hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);
			}
			if (cartier.common.isLoggedIn()) {
				$.removeCookie('guest_wishlist', {
					path: '/',
					domain: getDomainName(location.host)
				});
			}
		},
		_wishlistHeaderFix = function() {
			$('.heading-wrapper').addClass('display-none');
			if (!cartier.common.isLoggedIn())
				$('.back-button').addClass('display-none');
		};


	/*
        @public method : To initialize wishlist.js
        @param : none
    */
	wishlist.init = function() {
		_objPropertiesMsg = cartier.properties.messages;
		_objPropertiesPth = cartier.properties.paths;
		// caching the jquery objects
		RICHEMONT.AjaxCaller.listOfCallbackFun.RequestInformationAction = cartier.product.RequestInfoCallback;

		_cacheObjects();
		_cacheCssName();
		_cacheActionName();
		initializeAccordion();
		_bindEvents();
		editList();
		_wishlistDropdown();
		_wishlistHeaderFix();
		/* “ DATE  08-10-2014 ||  DEFECT- wish list invalid product | BRANCH 2.0.0”  
     		START
        	show popup when a prodcut  no more visible
   		 */
		//on  load product visibility check 
		if (_cache.$productListWrapper.find(".dummy").length > 0) {
			_saveButtonAjaxCallBack("", "", _objPropertiesMsg.wishlistParagraph, _objPropertiesMsg.wishListProductRemoved);
		}
		/*END*/
		_removeWishlistCookie();

	};



}(window, jQuery, cartier.wishlist));