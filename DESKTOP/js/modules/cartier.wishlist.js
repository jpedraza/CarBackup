/*!
* cartier.wishlist.js
* This file contains functionalities handling the others module
*
* @project   cartier desktop
* @date      2014-03-11
* @author    SapientNitro 
 * @licensor  cartier desktop
* @site      cartier desktop
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
		_cookieName,
		cloneObjectLi,
		styleClass = {},
		actionName = {},
		/* “ DATE  08-10-2014 ||  DEFECT- care-4305 | BRANCH 2.0.0”  
        START
        show popup when a prodcut  no more visible
        */

		productVisibility = true,
		/*END */

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
				$sizeSelector: $('.js-size-selector'),
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
				$overlap: $('.overlap'),
				$addWishlistSelector: $('.js-select-addtomywishlist'),
				$requestprice: $('.js-request-price')



			};

		},

		/*
          @private method : caching class name  
          @param : none 
        */

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
				editButton: ".js-edit",
				wishlistDeleteButtonNonLogin: ".js-delete-wishlist"


			};
		},

		/*
          @private method : action names   
          @param : none 
        */
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
				variantChangeAction: 'onVariantChange',
				productReorder: 'productreorder',
				wishlistDeleteActionGuest: 'deleteGuestWishList'

			};

		},
		//--------------------------------------------------------------------------------------------------------
		//          EVENT Bindings
		//--------------------------------------------------------------------------------------------------------

		/*
          @private method : bind events on page load 
          @param : none
        */
		_bindEvents = function() {

			//Onclick bind event for save button
			_cache.$editField.find(styleClass.wishlistsaveButton).on('click', {
				callbackFunction: _saveListHandler,
				hiddenValue: actionName.saveAction
			}, _ajaxCallHandler);

			//Onclick bind event for cancel button
			_cache.$editField.find(styleClass.wishlistCancelButton).on('click', function(e) {
				e.preventDefault();
				_saveListHandler(true);
			});

			//Onclick bind event for delete button
			_cache.$overlap.find(styleClass.wishlistDeleteButton).on('click', {
				callbackFunction: _deleteListHandler,
				hiddenValue: actionName.deleteAction
			}, _ajaxCallHandler);

			//Onclick
			_cache.$wishlistWrapper.find(styleClass.wishlistDeleteButtonNonLogin).on('click', {
				callbackFunction: _deleteWishlistHandler,
				hiddenValue: actionName.wishlistDeleteActionGuest
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

			//Onchnage bind event for size selector
			_cache.$sizeSelector.on('change', _onSizeSelectorHandler);

			//onchange bind event for add to my wishlist dropdown
			_cache.$addWishlistSelector.on('change', _onAddToMyWishlistSelectorHandler);

			//on varinat change ajax call 
			_cache.$productListWrapper.find('.js-variant-box').on('change', _variantOnChangeAjaxCall);
			//Onclick bind event for comment save
			_cache.$commentsave.on('click', function(e) {
				$(this).addLoader("please wait");
				e.preventDefault();
				_ajaxSubmitHandler($(this), actionName.commentsaveAction, _saveButtonAjaxCallBack, _objPropertiesMsg.wishListSavePopup, '');
				$(this).removeLoader();
			});


			_cache.$addToShopping.on('click', _addToShoppingClickHandler);

			/* “ DATE  08-10-2014 ||  DEFECT- care 4503 | BRANCH 2.0.0”  
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

			$('.js-sortable').sortable({
				update: function(event, ui) {
					_onDragAjaxCallHandler();
				}
			});

		},

		/*
          @private method : check for cookie exist or not, if exist then check its value
          @param : cookieName :  cookie name
        */
		_detectCookie = function(cookieName) {
			var userCookieGuestORLogin = $.cookie(cookieName);

			if (userCookieGuestORLogin === undefined || userCookieGuestORLogin === '' || userCookieGuestORLogin === '0') {
				$('.js-my-wishlist a.nav-link').addClass('display-none');
			} else {
				$('.js-my-wishlist a.nav-link').removeClass('display-none');
			}
		},

		/*
             @private method : Click handler for click on the add to shopping bag
             @param : e :  event param
        */
		_addToShoppingClickHandler = function(e) {

			var that = $(this);


			e.preventDefault();
			var addToCartObj = this,
				objXHR = cartier.ajaxWrapper.getXhrObj({
					type: 'POST',
					url: _objPropertiesPth.addToCartLink,
					data: $(this).closest('form').serialize(),
					dataType: 'json',
					contentType: "application/x-www-form-urlencoded",
					beforeSend: function(jqXHR) {

						var sizeDD = that.closest('.js-product-wrapper').find('.js-size-selector').closest('.filter-wrapper');
						sizeDD.find('span.error').remove();

						if (that.closest('.js-product-wrapper').find('.js-size-selector').val() === "default") {
							that.closest('.js-product-wrapper').find('.js-size-selector').addClass('error').closest('.selector').addClass('error');
							jqXHR.abort();
							sizeDD.append('<span class="error">' + _objPropertiesMsg.validOption + '</span>');
						}


						that.attr('disabled', 'disabled').before('<div class="loaderDiv">' + _objPropertiesMsg.addingToCart + '</div>');
						$('.loaderDiv').addLoader();
					}
				});

			if (objXHR) {
				objXHR.done(function(data) {
					// handle failure
					if (typeof data === "undefined") {} else { // handle success

						if (typeof $('.body-wrapper').data('plugin_analytics') !== 'undefined') {
							$('.body-wrapper').data('plugin_analytics').myWishlistAddtoShoppingBag(addToCartObj);
						}

						$('.js-addtoshopping').removeAttr('disabled');
						var parsedData = cartier.common.cartierJSONparser({
							json: data
						});
						//Handle Update Failure
						if (parsedData.isErrorMessageVisible) {
							var _temp = $("<div class='error-zone-pdp'></div>").show().append(parsedData.errorMessage);
							$('.error-zone-pdp').remove();
							$('.main-container').prepend(_temp).ScrollTo({
								duration: 800,
								offsetTop: 340
							});
						} else {
							$('.error-zone-pdp').remove();
							cartier.common.minShoppingBag(cartier.common.JsonLCUpgrader(parsedData));
							$('.js-pop-up-content-wrapper').fadeIn("slow").delay(4000);
							$('.js-pop-up-content-wrapper').fadeOut("slow");
						}
						cartier.common.checkCookie();
					}
				});
			}
			return false;
		},

		/*
          @private method : Save Comment Popup Box call back 
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
			$('.popup-close-button').on('click', function() {
				_cache.$popupWrapper.data('plugin_confirmBox').confirmHide();
			});

		},

		/*
          @private method : Product Delete Handler
          @param : e :- event
        */
		_wishlistProductCloseHandler = function(e) {
			e.preventDefault();
			$('.js-actiontype-variant').val("");

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
					_cache.$wishlistWrapper.find('li.first').removeClass(styleClass.displayBlock)
						.addClass(styleClass.displayNone)
						.end()
						.find('.edit-wishlist-name-anonymous').removeClass(styleClass.displayBlock)
						.addClass(styleClass.displayNone);
				}
				//If there is products then error message disappears
				else {
					_cache.$wishlist.find(styleClass.errorClass).removeClass(styleClass.displayBlock)
						.addClass(styleClass.displayNone);
				}

				// delete msg pop up


				$('.delete-message').remove();

				var errorDiv = _cache.$wishlistWrapper.prepend('<div class="delete-message">' + _objPropertiesMsg.productDeleted + '</div>')
					.end()
					.find('.delete-message');


				setTimeout(function() {
					errorDiv.fadeOut(1000, function() {
						$(this).remove();
					});
				}, 20000);


			});
			//hide wishlist link from header top right corner
			cartier.common.detectCookie();
		},

		/*
          @private method : initialize  Accordion Handler
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

				$('.popup-close-button').on('click', function() {
					_cache.$copyToWishlistBox.data('plugin_confirmBox').confirmHide();
				});

				_cache.$wishlistWrapper.find('.list-name')
					.addClass(styleClass.displayBlock)
					.removeClass(styleClass.displayNone)
					.end()
					.find('.selector')
					.addClass(styleClass.displayBlock)
					.removeClass(styleClass.displayNone)
					.removeAttr('style')
					.end()
					.find('.js-form-select')
					.addClass(styleClass.displayBlock)
					.removeClass(styleClass.displayNone)
					.end()
					.find('.select-label')
					.addClass(styleClass.displayBlock)
					.removeClass(styleClass.displayNone)
					.end()
					.find('.label-name')
					.addClass(styleClass.displayBlock)
					.removeClass(styleClass.displayNone);
				$('.label-name').html($('.js-form-select option:selected').val());


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

					} else {

						var parsedData = cartier.common.cartierJSONparser({
							json: productData
						});

						if (parsedData !== false) {
							//callback function
							_onchangeHandler(parsedData);


						}
					}
				});
			}
			_cache.$wishlistWrapper.removeLoader();
		},
		/*
          @private method : product size selector handler 
          @param : none 
        */

		_onSizeSelectorHandler = function() {
			
			var $selectedOption = $(this).find('option:selected');
			var liSelector = $(this).closest('li.js-product-wrapper');
			var oldVariant = $(this).data("selectedvariant");



			liSelector.find('span.error').remove();
			liSelector.find('.selector').removeClass('error');
			$(this).closest('li').find("#variant").val(oldVariant);
			$(this).closest('li').find("#fn_refid").val(oldVariant);
			//Price Change
			var newPrice = $selectedOption.attr('data-price');
			$(this).closest('span').html($selectedOption.html());

			var pid = liSelector.find('#productId').val(),
				refId = $selectedOption.attr('data-refid'),
				selectedValue = $selectedOption.val();

			if (typeof refId !== "undefined" && refId[0] == "C" && refId[1] == "R")
				refId = refId.slice(2, refId.length + 1);


			liSelector.find('.product-detail__size').html(refId);
			liSelector.find('.price-text').html(newPrice);



			$(this).closest('.selector').find('span').text($selectedOption.html());

			//Avilability
			if (typeof $selectedOption.data('availability') === "boolean") {
				if (!$selectedOption.data('availability')) {
					liSelector.find('.js-addtoshopping').addClass('display-none');
					liSelector.find('.js-request-price')
						.removeClass('display-none')
						.addClass('display-block');
				} else {
					liSelector.find('.js-addtoshopping').removeClass('display-none').addClass('display-block');
					liSelector.find('.js-request-price')
						.addClass('display-none')
						.removeClass('display-block');
				}
			}

			//Change the carousel


			if ($selectedOption.data('carousel') !== null) {
				if (typeof $selectedOption.data('carousel') === "object" || typeof $selectedOption.data('carousel') === "string") {

					var newpathIMG = $selectedOption.data('carousel');

					if (typeof $selectedOption.data('carousel') === "string") {

						if ($selectedOption.data('carousel') !== "" && $selectedOption.data('carousel') !== "undefined")
							liSelector.find('img.image').attr('src', newpathIMG);

					} else {
						var imgLength = newpathIMG.length;

						if (imgLength > 0) {
							liSelector.find('img.image').attr('src', newpathIMG[0]);
						}
					}
				}
			}
		},
		/*
          @private method : add to my wish list selection handler    
          @param : none 
        */
		_onAddToMyWishlistSelectorHandler = function() {
			var $selectedOption = $(this).find('option:selected');
			$(this).closest('span').html($selectedOption.html());
		},

		/*
          @private method : drag product ajax call handler 
          @param : none 
        */
		_onDragAjaxCallHandler = function() {
			var wishlist_name = $('input[name="wishlist_name"]').val();
			var productNames = $(styleClass.productDetail);
			var wishlist_pagepath = $('input[name="wishlist_pagepath"]').val();

			var seqProductID = '';
			for (var idx = 0; idx < productNames.length; idx++) {
				seqProductID += $(productNames[idx]).html();
				if (idx < productNames.length - 1) {
					seqProductID += ',';
				}
			}

			var objXHR = cartier.ajaxWrapper.getXhrObj({
				type: 'POST',
				data: {
					'wishlist_name': wishlist_name,
					'productID': seqProductID,
					'action': actionName.productReorder,
					'wishlist_pagepath': wishlist_pagepath
				},
				url: _objPropertiesPth.sortableAjaxUrl,

				dataType: "json",
				contentType: "application/x-www-form-urlencoded"
			});


			if (objXHR) {
				objXHR.done(function(productData) {
					// handle failure
					if (typeof productData.success !== "undefined" && !productData.success) {
						// handle redirectURL exist if the session expires

					} else {

						var parsedData = cartier.common.cartierJSONparser({
							json: productData
						});

						if (parsedData !== false) {
							//callback function
							//No need for this CAllback on dragging
							//_onchangeHandler(parsedData);

							$('.delete-message').remove();

							var errorDiv = _cache.$wishlistWrapper.prepend('<div class="delete-message">' + _objPropertiesMsg.wishlistReordered + '</div>').end()
								.find('.delete-message');

							setTimeout(function() {
								errorDiv.fadeOut(1000, function() {
									$(this).remove();
								});
							}, 20000);
						}
					}
				});
			}
			_cache.$wishlistWrapper.removeLoader();
		},

		/*
          @private method : variant on change event ajax call 
          @param : data : json responce
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

					} else {

						var parsedData = cartier.common.cartierJSONparser({
							json: productData
						});

						if (parsedData !== false) {
							_variantChangeCallBack(productData.content);
							selectEl.closest('li').find('.js-product-ref').html(productData.content.refId)
								.end()
								.find('.js-product-image img').attr('src', selectEl.find(':selected').data('img'))
								.end()
								.find('.js-price-text').html(selectEl.find(':selected').data('price'));

						}
					}
				});
			}
			_cache.$wishlistWrapper.removeLoader();


		},
		/*
          @private method : create variant list drop down list html
          @param : variantList -  variant list and reference id
                   selectedVariantSize - selected  varient size 
        */
		_crateaVarientslistHtml = function(variantList, selectedVariantSize, prodref, prodprice, prodimage, availability) {

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
			/* “ DATE  08-10-2014 ||  DEFECT- care-4305 | BRANCH 2.0.0”  
                 START
                show popup when a prodcut  no more visible
            */

			productVisibility = true;
			/*END */
			//define variables for product. product length , new product list
			var $products = productData.wishlist.products,
				productnewList = $(".js-form-select option:selected").html(),
				productLength = $products.length;

			// Empty previous products
			_cache.$wishlist.find('.js-productListing').empty();
			// Clone products
			var cloneObjectUl = $('.js-productListing').clone(true, true);
			_cache.$editField.find('.label-name').html(productnewList);
			_cache.$wishlistWrapper.find('.list-name')
				.removeClass(styleClass.displayNone)
				.addClass(styleClass.displayBlock);
			if (!_cache.$editField.hasClass(styleClass.displayBlock)) {
				_cache.$wishlistWrapper.find('.label-name')
					.removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock)
					.html(productnewList);
			}

			// For loop of total number of products
			for (var i = 0; i < productLength; i++) {

				if ($products[i].product_visibility) {

					// create variant drop down list  product_visibility

					var varients = _crateaVarientslistHtml($products[i].variant, $products[i].selectedVariant, $products[i].product_reference, $products[i].product_price, $products[i].product_image, $products[i].availability),
						// define variable to clone an object
						newObject = cloneObjectLi.clone(true, true);

					// Fill the data through JSON data
					newObject
						.find(styleClass.headingArea).html($products[i].product_name)
						.end()
						.find(styleClass.productDetail).html($products[i].product_localReference)
						.end()
						.find('.product-detail a.heading3').attr('href', $products[i].product_shortenedUrl + '.html')
						.end()
						.find('.wishlist-product-image a').attr('href', $products[i].product_shortenedUrl + '.html')
						.end()
						.find('a.product-detail__size').attr('href', $products[i].product_shortenedUrl + '.html')
						.end()
						.find(styleClass.productVariant).html($products[i].product_description)
						.end()
						.find('img.image').attr({
							src: $products[i].product_image,
							alt: $products[i].product_name
						})
						.end()
						.find(styleClass.productPrice).html($products[i].product_price)
						.end()
						.find(styleClass.textBox).html($products[i].product_comment !== undefined ? $products[i].product_comment : '')
						.end()
						.find('#productId').val($products[i].product_reference)
						.end()
						.find('#pagePath').val($products[i].product_node)
						.end()
						.find('input[name=productnode]').val($products[i].product_node)
						.end()
						.find('#fn_refid').val($products[i].product_reference)
						.end()
						.find('#variant').val($products[i].product_reference)
						.end()
						.find('#wishlistId').val($('.js-form-select option:selected').data('wishlistno'))
						.end()
						.find('#wishlistName').val($('.js-form-select option:selected').val())
						.end()
						.find('select').empty()
						.append(varients.dropdown)
						.val(varients.size.toString())
						.attr("data-selectedVariant", varients.selectedRef)
						.end()
						.find("#updated-variant").val(varients.selectedRef);

					newObject.find('.pdpPathFinal').val($products[i].product_node);

					if ($products[i].selectedVariant != "" && $products[i].variant.length !== 0) {
						newObject.find('.filter-wrapper').removeClass('display-none').find('select').trigger('change');


					} else {
						newObject.find('.filter-wrapper').addClass('display-none');
					}


					if ($products[i].product_price === "" || !$products[i].availability) {
						newObject.find('.js-request-price')
							.removeClass('display-none')
							.addClass('display-block');
						newObject.find('.js-addtoshopping').addClass('display-none');
						newObject.find('.product__price').addClass('display-none');
					} else {
						newObject.find('.js-request-price')
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

					// append variant drop down box 

					// Append object in to the cloned UI
					cloneObjectUl.append(newObject);

					// Replace new object with product listing
					_cache.$wishlist.find('.js-productListing').replaceWith(cloneObjectUl);
					$(".js-sortable").sortable({
						axis: 'y',
						connectWith: '.ui-sortable',
						containment: "parent",
						cursorAt: {
							left: 100
						},
						delay: 200,
						update: function(event, ui) {
							_onDragAjaxCallHandler();
						}
					});
					$(".js-addtoshopping").unbind('click');
					$('.js-addtoshopping').on('click', _addToShoppingClickHandler);
					$(".js-copytowishlist").unbind('click');
					$(".js-copytowishlist").on('click', function(e) {
						e.preventDefault();
					});
					$(".js-save").unbind('click');
					$(".js-save").on('click', function(e) {
						e.preventDefault();
						_ajaxSubmitHandler($(this), actionName.commentsaveAction, _saveButtonAjaxCallBack, _objPropertiesMsg.wishListSavePopup, '');
					});

					//Onchnage bind event for size selector
					$(".js-size-selector").unbind('click');
					$('.js-size-selector').on('change', _onSizeSelectorHandler);
					$('.js-select-addtomywishlist').on('change', _onAddToMyWishlistSelectorHandler);
					//call accordion
					$('.js-accordion').makeAccordion({
						showBehaviour: true
					});

					//Onclick bind event for delete product
					$(".js-wishlist-product-close").unbind('click');
					$(".js-wishlist-product-close").on('click', _wishlistProductCloseHandler);

					//Onclick bind event for add to wishlist
					$(".js-addtomywishlist-ok").unbind('click');
					$(".js-addtomywishlist-ok").on('click', function(e) {
						e.preventDefault();
						_ajaxSubmitHandler($(this), actionName.addwishlistAction, _saveButtonAjaxCallBack, _objPropertiesMsg.wishlistcopytoWishlist, _objPropertiesMsg.wishlistParagraph);
					});

					//Onclick bind event for Create Wishlist
					$(".js-createnewwishlist-ok").unbind('click');
					$(".js-createnewwishlist-ok").on('click', _createWishlistHandler);
					$('.js-request-price').unbind('click');
					$('.js-request-price').on('click', function(e) {
						e.preventDefault();
						$("#modalWindow").empty();
						$(this).modalWindow();
						// empty model window

						cartier.common._dataLoad($(this).attr('href'), cartier.common.postAjaxEvents);
					});
				} else {
					productVisibility = false;
				}
				/*END*/
			}
			//If there is no product then error message appears
			if (!$('.js-productListing').children().length) {
				_cache.$wishlist.find(styleClass.errorClass).removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock);
			} else {
				_cache.$wishlist.find(styleClass.errorClass).removeClass(styleClass.displayBlock)
					.addClass(styleClass.displayNone);
			}
			/* “ DATE  08-10-2014 ||  DEFECT- care-4305  | BRANCH 2.0.0”  
                START
                show popup when a prodcut  no more visible
            */

			if (!productVisibility) {
				_saveButtonAjaxCallBack("", "", _objPropertiesMsg.wishlistParagraph, _objPropertiesMsg.wishListProductRemoved);
			}
			/*END */

			//call accordion
			_cache.$accordionBox.makeAccordion({
				showBehaviour: true
			});
			//call wishlist dropdown function
			_wishlistDropdown();


		},

		/*
          @private method : delete wishlist handler for guest login user
          @param : none 
        */
		_deleteWishlistHandler = function() {
			_cache.$wishlistWrapper.find('.account-links li.first')
				.addClass(styleClass.displayNone);

			$('.js-productListing').empty();

			if (!$('.js-productListing').children().length) {
				_cache.$wishlist.find(styleClass.errorClass).removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock);
				_cache.$wishlistWrapper.find('li.first').removeClass(styleClass.displayBlock)
					.addClass(styleClass.displayNone)
					.end()
					.find('.edit-wishlist-name-anonymous').removeClass(styleClass.displayBlock)
					.addClass(styleClass.displayNone);
			}
			//If there is products then error message disappears
			else {
				_cache.$wishlist.find(styleClass.errorClass).removeClass(styleClass.displayBlock)
					.addClass(styleClass.displayNone);
			}

			$('.delete-message').remove();
			var errorDiv = _cache.$wishlistWrapper.prepend('<div class="delete-message">' + _objPropertiesMsg.wishlistDeleteMessage + '</div>')
				.end()
				.find('.delete-message');

			setTimeout(function() {
				errorDiv.fadeOut(1000, function() {
					$(this).remove();
				});
			}, 20000);

			//hide wishlist link from header top right corner
			cartier.common.detectCookie();
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
					.removeClass(styleClass.displayBlock)
					.addClass(styleClass.displayNone)
					.end()
					.find('.overlap')
					.removeClass(styleClass.displayBlock)
					.addClass(styleClass.displayNone)
					.end()
					.find('.form-input')
					.removeClass(styleClass.displayBlock)
					.addClass(styleClass.displayNone)
					.end()
					.find(styleClass.editButton)
					.addClass(styleClass.displayNone)
					.end()
					.find(styleClass.wishlistDeleteButton)
					.addClass(styleClass.displayNone)
					.end()
					.find('.label-name')
					.removeClass(styleClass.displayBlock)
					.addClass(styleClass.displayNone);

				// remove zero product message

				$noItemInWishlistEl.addClass(styleClass.displayBlock).removeClass(styleClass.displayNone);


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
					.find('.selector')
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
					.html(selectList);

			}

			//Remove selected drop down options
			_cache.$wishlistWrapper.find('.form-select option:selected').remove();
			$('.delete-message').remove();
			var errorDiv = _cache.$wishlistWrapper.prepend('<div class="delete-message">' + _objPropertiesMsg.wishlistDeleteMessage + '</div>')
				.end()
				.find('.delete-message');


			setTimeout(function() {
				errorDiv.fadeOut(1000, function() {
					$(this).remove();
				});
			}, 20000);


			_cache.$wishlistWrapper.find('.form-select option:selected').trigger('change');

			_wishlistDropdown();
			cartier.common.detectCookie();

		},

		/*
          @private method : Save wishlist name and update into dropdown options
          @param : isCancle : is cancle event  
        */
		_saveListHandler = function(isCancle) {

			//Add loader
			$(styleClass.wishlistsaveButton).addLoaderPrepend();

			//Define varibales
			var saveList = _cache.$wishlistWrapper.find('.form-input').val();
			if (isCancle) {
				saveList = $('.js-form-select option:selected').val();
			};

			var newList = $('.js-form-select option:selected').val(saveList).html(saveList),
				listName = _cache.$wishlistWrapper.find('.form-label').html(saveList),
				editText = $('.heading-wrapper').children().last().text().replace(_objPropertiesMsg.wishListeditText, "");
			_cache.$wishlistWrapper.find('.selector span').html(saveList);


			$('.heading-wrapper').children().last().text(editText);
			// Save list action
			_cache.$wishlistWrapper.find(styleClass.wishlistsaveButton)
				.removeClass(styleClass.displayBlock)
				.addClass(styleClass.displayNone)
				.end()
				.find(styleClass.wishlistCancelButton)
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
				.removeClass(styleClass.displayNone)
				.removeClass('edit-title')
				.addClass(styleClass.displayBlock)
				.end()
				.find(styleClass.wishlistSelect)
				.removeClass(styleClass.displayNone)
				.end()
				.find(styleClass.wishlistDeleteButton)
				.removeClass(styleClass.displayNone)
				.addClass(styleClass.displayBlock)
				.end()
				.find('.label-name')
				.removeClass(styleClass.displayNone)
				.addClass(styleClass.displayBlock);
			$('.label-name').html(saveList);

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

			//remove loader
			_cache.$wishlistWrapper.removeLoader();

			//populate drop down after save
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

				$(this).addLoaderPrepend();

				// Define variable for selected option and their respective value
				var selectedDataList = $('.form-select option:selected').data('wishlistno'),
					selectList = $('.form-select option:selected').val();

				//Pass hidden values 
				$('.js-hidden').val(selectedDataList);
				_cache.$wishlistWrapper.find('.form-input').attr({
					placeholder: selectList,
					value: selectList
				});


				$('.heading-wrapper').children().last().prepend(_objPropertiesMsg.wishListeditText + " ");
				// Action of edit button
				_cache.$wishlistWrapper.find(styleClass.editButton)
					.addClass(styleClass.displayNone)
					.end()
					.find(styleClass.wishlistsaveButton)
					.removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock)
					.end()
					.find(styleClass.wishlistCancelButton)
					.removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock)
					.end()
					.find('.list-name')
					.removeClass(styleClass.displayNone)
					.addClass('edit-title')
					.end()
					.find('.form-input')
					.removeClass(styleClass.displayNone)
					.end()
					.find(styleClass.wishlistSelect)
					.addClass(styleClass.displayNone)
					.end()
					.find('.label-name')
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

				_cache.$wishlistWrapper.removeLoader();

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
			$('.copy-to-wishlist').find('.selector span').html(options[0].value);
			$('.js-select-addtomywishlist').html(options);
		}

	};

	/*
          @private method : Ajax submit handler
          @param : object-  Object name
                    action - Action name
                    callback - callback function for every ajax call,
                    title - title 
                    message - message
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
			//url: '../json/wishlist.json',
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

		/*
          @private method : wishlist ui user acording to login or guest user 
          @param : none
        */
		_wishlistUIUser = function() {
			var isLoggedIn = cartier.common.isLoggedIn();
			if (!_cache.$productListWrapper.children().length && !isLoggedIn) {
				_cache.$wishlist.find('.js-error')
					.removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock);
				_cache.$wishlistWrapper.find('.item-list')
					.removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock)
					.end()
					.find('li.first')
					.addClass(styleClass.displayNone);
				/* “ DATE 14-10-2014 |  DEFECT- CARE -5441| BRANCH 2.0.0”  
                START
                if condition added 
                 */

				if (!$('.wishlist .wishlist__select .overlap select option').length) {
					return;
				}
				/*END*/
			} else if (!_cache.$productListWrapper.children().length && isLoggedIn) {
				_cache.$wishlist.find('.js-error')
					.removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock);
				_cache.$wishlistWrapper.find('.item-list')
					.removeClass(styleClass.displayBlock)
					.addClass(styleClass.displayNone);
				/* “ DATE 14-10-2014 |  DEFECT- CARE -5441| BRANCH 2.0.0”  
                    START
                    if condition added 
                 */
				if (!$('.wishlist .wishlist__select .overlap select option').length) {
					return;
				}
				/*END*/
			}

			if (isLoggedIn) {
				_cache.$wishlistWrapper.find('.item-list')
					.removeClass(styleClass.displayBlock)
					.addClass(styleClass.displayNone)
					.end()
					.find('.edit-wishlist-name-anonymous')
					.removeClass(styleClass.displayBlock)
					.addClass(styleClass.displayNone)
					.end()
					.find('.edit-field')
					.removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock)
					.end()
					.find('.overlap')
					.removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock)
					.end()
					.find('.list-name')
					.removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock)
					.end()
					.find('.label-name')
					.removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock)
					.html($('.js-form-select option:selected').val());

				var OptionLength = _cache.$wishlistWrapper.find('.js-form-select option').length;
				if (OptionLength === 1) {

					_cache.$wishlistWrapper.find('.js-form-select')
						.addClass(styleClass.displayNone)
						.removeClass(styleClass.displayBlock)
						.end()
						.find('.selector')
						.addClass(styleClass.displayNone)
						.removeClass(styleClass.displayBlock)
						.end()
						.find('.select-label')
						.addClass(styleClass.displayNone)
						.removeClass(styleClass.displayBlock);
				}
			} else {
				_cache.$wishlistWrapper.find('.item-list')
					.removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock)
					.end()
					.find('.edit-wishlist-name-anonymous')
					.removeClass(styleClass.displayNone)
					.addClass(styleClass.displayBlock)
					.end()
					.find('.edit-field')
					.removeClass(styleClass.displayBlock)
					.addClass(styleClass.displayNone)
					.end()
					.find('.overlap')
					.removeClass(styleClass.displayBlock)
					.addClass(styleClass.displayNone);
			}
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
		/*
          @private method : wishlist header fix according logged in user or non-logged user 
          @param : isCancle : is cancle event  
        */
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

		//console.log('JS-LOG:Wishlist Init Called');
		_objPropertiesMsg = cartier.properties.messages;
		_objPropertiesPth = cartier.properties.paths;
		// caching the jquery objects
		_cacheObjects();
		_cacheCssName();
		_cacheActionName();
		initializeAccordion();
		_wishlistUIUser();
		_bindEvents();
		editList();
		_wishlistDropdown();
		_wishlistHeaderFix();

		//on  load product visibility check 
		if (_cache.$productListWrapper.find(".dummy").length > 0) {
			_saveButtonAjaxCallBack("", "", _objPropertiesMsg.wishlistParagraph, _objPropertiesMsg.wishListProductRemoved);
		}



		if ($('.js-wishlist-select').length > 0) {            
			$('input[name=wishlist_name]').val($('select.js-form-select').find('option:Selected').data('wishlistno'));        
		}
		_removeWishlistCookie();
		/* “ DATE  08-10-2014 ||  DEFECT- care-4305  || BRANCH 2.0.0”  
        START
        show popup when a prodcut  no more visible. wish list select box UI issue 
        */


		//if($('.js-wishlist').length > 0) {
		// $('.wishlist .wishlist__select .overlap').css('width', window.innerWidth);
		//}
		/* END */

	};



}(window, jQuery, cartier.wishlist));