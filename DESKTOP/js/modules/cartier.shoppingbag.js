/*!
 * cartier.billing.js
 * This file contains functionalities handling the my billing module
 *
 * @project   cartier mobile
 * @date      2014-01-03
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
(function(window, $, shoppingbag, undefined) {
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
	var gaString = "";
	var
	_cache = {},
		clonedBag,
		clonedProduct,
		_objPropertiesPth,
		_objPropertiesMsg,
		_fontActionMap,
		/*
          @private method : caching jquery objects 
          @param : none 
        */
		_cacheObjects = function() {

			_cache = {
				$shoppingbag: $(".js-shoppingbag"),
				accordionObject: $(".js-accordion"),
				datePicker: $(".js-date-picker"),
				$boldclass: "js-bold-class",
				$cursiveclass: "js-cursive-class",
				$composeMessage: $(".js-message"),
				$line1: $(".js-engraving-preview-line1"),
				$line2: $(".js-engraving-preview-line2"),
				$accancel: $('.js-cancel-ac'),
				$acconfirm: $('.js-bracelet-confirm-button'),
				$closebutton: $('.js-close-button'),
				$quantityDropdown: $('.js-quantityselect'),
				$submitButton: $('.js-confirm-button'),
				$cancleButton: $('.js-cancel-ac'),
				$inputFields: $('.js-inputfield'),
				$sizeFields: $('.js-sizefield'),
				$checkout: $('.js-proceed-to-checkout'),
				$sizeDropdown: $('.js-sizerow select'),
				$countryDropDown: $('.js-country-dropdown'),
				$addtomywishlistok: $('.js-addtomywishlist-ok'),
				$createWishlistInput: $('.js-newwishlistname'),
				$messagerow: $('.js-messagerow'),
				$crossButton: $('.js-crossbutton'),
				$msgIcon: $('.js-msg-icon'),
				$checkedIcon: $('.js-checked-icon'),
				$addtomywishlistDropDown: $('.js-select-addtomywishlist'),
				$checkOutAndSignInButton: $('.js-login-checkout-cta'),
				$checkoutAjaxToCheckRes: $('.js-checkout-ajax')
			};

		},

		_bindEvents = function() {

			_cache.$checkoutAjaxToCheckRes.on('click', function(e) {
				e.preventDefault();
				var $that = $(this);
				_ajaxSubmitHandlerForCheckoutButton(_objPropertiesPth.checkoutCallRes, function(data) {
					if (data.reservationSuccess) {
						window.location.href = $that.attr('href');
					} else {
						window.location.reload();
					}
				});
			});



			_cache.$checkOutAndSignInButton.on('click', function(e) {
				e.preventDefault();

				var $that = $(this);
				_ajaxSubmitHandlerForCheckoutButton(_objPropertiesPth.checkoutCallRes, function(data) {
					if (data.reservationSuccess) {
						localStorage.setItem('signinandcheckout', 'true'); // LocalStorage set for GA
						$("#modalWindow").empty();
						$(this).modalWindow();
						_getdata(_cache.$checkOutAndSignInButton.attr('href'), _postAjaxCallForPopSignIn);

					} else {
						window.location.reload();
					}
				});

			});

			_cache.$closebutton.on('click', function() {
				_updatedShoppingBag(_fontActionMap.productRemove, $(this), _objPropertiesPth.deleteTeaser, $(this).closest('form').serialize());

				if (typeof $('.body-wrapper').data('plugin_analytics') !== 'undefined') {
					$('.body-wrapper').data('plugin_analytics').shoppingBagGARules('cartProductRemoval');
				}
			});

			_cache.$quantityDropdown.on('change', function() {
				var messageText = _fontActionMap.productQuantChange;

				if ($(this).closest('.js-product-inbag').find('.js-crossbutton').is(':visible'))
					messageText = _fontActionMap.quantChangeForinfo;

				_updatedShoppingBag(messageText, $(this), _objPropertiesPth.quantityChange, $(this).closest('form').serialize());

				if (typeof $('.body-wrapper').data('plugin_analytics') !== 'undefined') {
					$('.body-wrapper').data('plugin_analytics').shoppingBagGARules('cartNumberOfProducts');
				}

			});

			_cache.$submitButton.on('click', _submitHandler);

			_cache.$acconfirm.on('click', _submitHandlerForBracelet);

			_cache.$cancleButton.on('click', function(e) {

				$(this).closest('li.product-inbag').find('.js-inputfield,.js-sizefield').each(function(index, el) {
					$(el).val($(el).data().backup).trigger('change');
				});


				var $thisNode = $(this).closest('.product-inbag');

				if ($thisNode.find('.js-message').length) {
					updatePreview($thisNode.find('.js-message'));

				}

				if ($thisNode.data().backup) {
					setTimeout(function() {
						$thisNode.find('.slide_switch').find('input:eq(1)').trigger('click');
					}, 10); /// Fix for firefox
				} else {
					setTimeout(function() {
						$thisNode.find('.slide_switch').find('input:eq(0)').trigger('click');
					}, 10); /// Fix for firefox            	
				}



				if ($thisNode.hasClass('messageSection')) {
					//console.log($thisNode.data().backupblankcard);

					if ($thisNode.data().backupblankcard) {
						setTimeout(function() {
							$thisNode.find('.js-radio-change-handler li:eq(1)').find('input').trigger('click').end().trigger('click').trigger('change');
						}, 10); /// Fix for firefox
					} else {
						setTimeout(function() {
							$thisNode.find('.js-radio-change-handler li:eq(0)').find('input').trigger('click').end().trigger('click').trigger('change');
						}, 10); /// Fix for firefox            	
					}
				}


				e.preventDefault();
				_closeHandler($(this));


			});

			_cache.$inputFields.on('change keyup blur', function() {
				$(this).closest('fieldset').find('span.error').remove();
			});

			_cache.$sizeFields.on('change keyup blur', function() {
				$(this).closest('fieldset').find('span.error').remove();
			});

			_cache.$checkout.on('click', function() {
				_updatedShoppingBagCheckout($('.js-dynamic-shopping-bag'), _objPropertiesPth.bagCheckout, "currentPage=" + $("#currentPage").val() + "&successPage=" + $('#successPage').val());
			});

			_cache.$sizeDropdown.on('change', function() {
				var messageText = _fontActionMap.productSizeChange;
				_updatedShoppingBag(messageText, $(this), _objPropertiesPth.sizeUpdateShopping, $(this).closest('form').serialize());
			});

			_cache.$countryDropDown.on('change', function() {
				_updatedShoppingBag("", $(this), _objPropertiesPth.countrydropdown, $(this).closest('form').serialize());
			});

			_cache.$crossButton.on('click', function(e) {
				e.preventDefault();
				_deleteSectionHandler($(this));
				if (typeof $('.body-wrapper').data('plugin_analytics') !== 'undefined') {
					$('.body-wrapper').data('plugin_analytics').shoppingBagGARules(gaString);
				}
			});


			$('.js-login-checkout-cta').on('click', function() {
				_loginBeforeCheckout();
			});

			_cache.$addtomywishlistDropDown.on('change', _onAddWishlistSelectorHandler);

			var loggedIn = cartier.common.isLoggedIn();
			_guestAccount(loggedIn);

		},

		_getdata = function(url, action) {

			var objXHR = cartier.ajaxWrapper.getXhrObj({
				type: 'GET',
				url: url,
				dataType: 'html',
				contentType: "application/x-www-form-urlencoded",
			});
			if (objXHR) {
				objXHR.done(function(data) {

					action(data);
				});
			}
		},
		/*
          @private method : add sign in content in DOM
          @param : none 
        */
		_postAjaxCallForPopSignIn = function(data) {

			if (typeof $('.body-wrapper').data('plugin_analytics') !== 'undefined') {
				$('.body-wrapper').data('plugin_analytics').logininPopinGARules();
			}
			$("#modalWindow").empty();
			$("#modalWindow").html(data);
			$("#modalWindow").addCrossButton();
			setTimeout(function() {
				$(this).modalWindow();
			}, 20);
			$("input:checkbox, input:radio, select").uniform();

			$(".close").on("click", function() {
				$("#modalWindow").empty();
				$("#modalWindow").addAjaxLoader();
				$("#modalOverlay").hide();
			});

		},
		_onAddWishlistSelectorHandler = function() {
			var selectedOption = $(this).closest('.copy-to-wishlist').find('.js-select-addtomywishlist option:selected').html();
			$(this).closest('.copy-to-wishlist').find('.selector span').html(selectedOption);
		},

		_deleteSectionHandler = function($this) {
			var
			sendString = "";

			if ($this.closest('.engraving-show').length) {
				sendString = 'engraving';
				gaString = "cartEngravingDelete";
			} else if ($this.closest('.bracelet-show').length) {
				gaString = "cartAdjustementDelete";
				sendString = 'bracelet';
			} else if ($this.closest('.messagerow-show').length) {
				gaString = "cartMessageCardDelete";
				sendString = 'message';
			}

			_updatedShoppingBag(_fontActionMap.prodInfoDelete, $this, _objPropertiesPth.deleteSectionInBag, $this.closest('form').serialize() + '&deleteSection=' + sendString);

		},

		/*
          @private method : submit handler for Engraving and Message Card
          @param : none
        */
		_submitHandler = function(e) {
			e.preventDefault();
			_messageCardValidation($(this));
			_engravingValidation($(this));

			var isValid = $(this).closest('.product-inbag').find('span.error').remove().end().find('.js-inputfield').valid();
			_updatedShoppingBag(_fontActionMap.prodInfoAdd, $(this), _objPropertiesPth.productUpdate, $(this).closest('form').serialize(), function(jqXHR) {
				if (!isValid) {
					jqXHR.abort();
					return false;
				} else {
					return true;
				}
			});
		},

		/*
          @private method : submit handler for bracelet adjustment
          @param : none
        */
		_submitHandlerForBracelet = function(e) {
			e.preventDefault();

			var braceletInput = $(this).closest('.product-inbag').find("input[name='fn_wristsize']");
			if (braceletInput.length > 0) {
				var min = parseFloat(braceletInput.attr('data-min')),
					max = parseFloat(braceletInput.attr('data-max'));
				if (isNaN(min)) min = 5;
				if (isNaN(max)) max = 10;

				_braceletValidation(max, min, braceletInput);
			}

			var isValid = $(this).closest('.product-inbag').find('span.error').remove().end().find('.js-sizefield').valid();
			_updatedShoppingBag(_fontActionMap.prodInfoAdd, $(this), _objPropertiesPth.productUpdate, $(this).closest('form').serialize(), function(jqXHR) {
				if (!isValid) {
					jqXHR.abort();
					return false;
				} else {
					return true;
				}
			});
		},

		/*  
          @private method :Function to initialize the accordion
          @param : none 
        */
		initializeAccordion = function() {
			_cache.accordionObject.makeAccordion({
				showBehaviour: true
			});

		},


		/*  
          @private method :clones the shopping bag from the HTML. Runs on the page load
          @param : none 
        */

		_cloneShoppingBag = function() {
			clonedBag = $(".js-dynamic-shopping-bag").clone(true, true);
			clonedProduct = clonedBag.find('.js-product-inbag').clone(true, true);
			clonedBag.find('.js-product-inbag').remove();
			_updatedShoppingBag(_fontActionMap.initialUpdate, $('.js-dynamic-shopping-bag'), _objPropertiesPth.getCart, "sw=https&currentPage=" + $("#currentPage").val());
		},
		/*  
          @private method : Updates the whole shopping bag. Makes an AJAX call to get an updated shopping bag
          @param : action that has to be sent in the ajax call
        */
		_updatedShoppingBag = function(frontEndAction, that, pathVariable, dataToSend, _beforesend) {

			if (_beforesend === undefined)
				_beforesend = function() {
					return true;
				};

			dataToSend = dataToSend + "&currentPage=" + $("#currentPage").val() + "&adaptivePath=" + $('.js-adaptiveImage').data('original');

			_ajaxSubmitHandler(frontEndAction, that, pathVariable, dataToSend, function(data) {

				if (data.reservflag !== undefined && data.reservflag === true) {
					$('.js-reservation-div').removeClass('display-none');
				} else {
					$('.js-reservation-div').addClass('display-none');
				}

				$(".js-dynamic-placeholder").children().replaceWith(_fillShoppingBag(data));
				_idFixForRadio();
				cartier.common.checkCookie();
				if (typeof $('.body-wrapper').data('plugin_analytics') !== 'undefined') {
					$('.body-wrapper').data('plugin_analytics').shoppingBagGAEventsQuantity();
				}
			}, _beforesend);
		},


		_updatedShoppingBagCheckout = function(that, pathVariable, dataToSend, _beforesend) {
			if (_beforesend === undefined)
				_beforesend = function() {
					return true;
				};
			_ajaxSubmitHandler("", that, pathVariable, dataToSend, function(data) {


				if (data.isRedirect === undefined)
					data.isRedirect = false;

				if (data.isRedirect) {
					window.location.href = data.redirectUrl;
				}

				$(".js-dynamic-placeholder").children().replaceWith(_fillShoppingBag(data));
				_idFixForRadio();
				cartier.common.checkCookie();
			}, _beforesend);
		},

		/*  
          @private method : fills the shopping bag from the json and returns the filled shpping bag
          @param : data(json)
        */
		_fillShoppingBag = function(data) {
			$('.error-zone, .error-zone-sb').remove();
			var _bag = clonedBag.clone(true, true);
			var teaserSize = data.teaserArray.length;
			var deletedTeaserSize = data.removedTeaserArray.length;
			//Handle Update Failure
			if ((data.isErrorMessageVisible || teaserSize === 0) && data.reservflag !== true) {
				if (data.errorMessage === undefined || data.errorMessage === "") {

					data.errorMessage = _objPropertiesMsg.cartEmpty;
				}

				if (data.noOfProducts === 0) {

					$('.empty_shopping_bag').removeClass("display-none");

				} else if (data.noOfProducts === 5) {

					_cache.$shoppingbag.confirmBox();
					_cache.$shoppingbag.data('plugin_confirmBox').popupInitialize({
							'title': data.errorMessage,
							'buttons': {
								'ok': {
									'buttonName': _objPropertiesMsg.okButton,
									'class': 'cta-button cta-button__inner cta--red'
								},
							}

						},
						_cache.$shoppingbag.data('plugin_confirmBox').confirmHide
					);

					$('.popup-close-button').on('click', function() {
						_cache.$shoppingbag.data('plugin_confirmBox').confirmHide();
					});

				} else {
					var _temp = $("<div class='error-zone-sb'></div>").append(data.errorMessage);
					_temp.prependTo('.main-container').ScrollTo({
						duration: 800,
						offsetTop: 340
					});
				}
			}

			if (teaserSize === 0) {
				cartier.common.minShoppingBag(data);
				cartier.common.unbindMiniShoppingBagShowHide();
			}

			if (deletedTeaserSize > 0) {
				$('.js-reservation-div-withproduct').removeClass('display-none');
				for (var i = 0; i < deletedTeaserSize; i++) {
					$('.js-reservation-div-withproduct').find('.js-removed-product-ul').append(_fillProduct(data.removedTeaserArray[i], data, true));
				}
			} else {
				$('.js-reservation-div-withproduct').addClass('display-none');
			}

			if (teaserSize > 0) {
				cartier.common.minShoppingBag(data);
				cartier.common.bindMiniShoppingBagShowHide();

				_setDataCurrency(_bag, data, "js-subtotal", "subTotal");
				_setDatai18n(_bag, data, "js-subtotal-info", "subTotalInfo");

				if (data.deliveryCharge === "checkout.label.tax.free")
					_setDatai18n(_bag, data, "js-deliverycharge", "deliveryCharge");
				else {
					_setDataCurrency(_bag, data, "js-deliverycharge", "deliveryCharge");
					_bag.find('.js-deliverycharge').removeClass("bold-font").addClass('font32');
				}

				_setDatai18n(_bag, data, "js-deliverycharge-info", "deliveryChargeInfo");
				_setDataCurrency(_bag, data, "js-totalprice", "total");
				_setDatai18n(_bag, data, "js-totalprice-info", "totalInfo");
				if (data.ifSalesTax) {
					_setDataCurrency(_bag, data, "js-saletax", "salesTax");
				} else {
					_bag.find('.js-saletaxrow').addClass('display-none');
				}
				if (data.countryCode !== undefined)
					_bag.find('.js-country-dropdown').val(data.countryCode);

				for (var i = 0; i < teaserSize; i++) {
					data.teaserArray[i].currencySymbol = data.currencySymbol;
					data.teaserArray[i].availableQuantities = data.cartCapacity;
					_bag.find('.js-productlist-inbag').append(_fillProduct(data.teaserArray[i], data, false));
				}
				_bag.removeClass('display-none');
			}
			return _bag;
		},


		/*  
          @private method :Fills a product data and returns a product in turn
          @param : data (json)
        */

		_fillProduct = function(data, rawData, isRemoved) {


			var _product = clonedProduct.clone(true, true);

			if (isRemoved) {
				_product.addClass('js-removed-product');
				_product.find('.js-productDesc').closest('h2').wrap("<a href=" + data.productPagePath + ".html></a>");

				if (data.hasSize) {
					_product.find('.js-productDesc').closest('h2').append('<p class="productSize-info">  Size: ' + data.sizeValue + '</p>');
				}
				/*_product.find('.js-productDesc').closest('h2').append('<p class="refId" style="display:none">' + data.refId + '</p>');
                _product.find('.js-productDesc').closest('h2').append('<p class="pdp_pagepath" style="display:none">' + data.productPagePath + '</p>');
                _product.find('.js-productDesc').closest('h2').append('<p class="isRemoved" style="display:none">' + isRemoved+ '</p>');*/
			}

			var _option = _product.find('.js-quantityselect option:eq(0)').clone(true, true);
			_setProductPagePath(_product, data, "js-pdpUrl_image", "productPagePath");
			_setProductPagePath(_product, data, "js-pdpUrl", "productPagePath");

			//Addition for google analytics
			_product.attr({
				"data-productLine": data.productLineEn,
				"data-productCollection": data.productCollectionEn,
				"data-productName": data.productTitleEn,
				"data-productId": data.variantID,
				"data-sellable": "sellable",
				"data-productprice": data.productPrice,
				"data-productquantity": data.selectedQuantity,
                "data-refId":data.refId,
				"data-pdpPagepath":data.productPagePath,
				"data-avaliablity":isRemoved,


			});
			//End google analytics


			_setData(_product, data, "js-productTitle", "productTitle");
			_setData(_product, data, "js-productDesc", "productDesc");
			_setDataCurrencyRef(_product, data, "js-refId", "variantID");
			_setDatai18n(_product, rawData, "exsale_Tax", "subTotalInfo");
			_product.find('.teaserId').val(data.teaserID);

			_setDataCurrencyProduct(_product, data, "js-productPrice", "productPrice");
			_setDataCurrency(_product, data, "js-teaserTotal", "totalDisplayPrice");
			_product.find('.js-imageURL').attr({
				src: data.imageURL
			});
			_product.find('.js-quantityselect').empty();
			var quantLength = data.availableQuantities;
			for (var i = 0; i < quantLength; i++) {
				var _toAddOption = _option.clone(true, true);
				_toAddOption.html(i + 1).attr({
					value: i + 1
				});
				_product.find('.js-quantityselect').append(_toAddOption);
			}
			_product.find('.js-quantityselect').val(data.selectedQuantity);
			/*shopping bag text field value change after ajax call*/
			_product.find('.js-quantityselect').parent().find("span").text(data.selectedQuantity);


			if (data.hasSize) {
				_product = _fillSizeInfo(_product, data.sizeInfo);
				_product.find('.js-refId').append('<br/><br/> Size: ' + data.sizeValue);
			} else {
				_product.find(".js-sizerow").addClass('display-none');
			}

			if (data.hasEngraving) {
				_product = _fillEngravingInfo(_product, data.engravingInformation);
			} else {
				_product.find(".js-engravingrow").addClass('display-none');
			}

			if (data.hasBracelet) {
				_product = _fillBraceletInfo(_product, data.braceletInfo);
			} else {
				_product.find(".js-braceletrow").addClass('display-none');
			}

			if (data.hasGiftCard) {
				_product = _fillGiftcardInfo(_product, data.giftCardInfo);
			} else {
				_product.find(".js-messagerow").addClass('display-none');
			}

			return _product;
		},

		/*  
          @private method :Fill size info
          @param : product, data(json) 
        */
		_fillSizeInfo = function(_product, data) {
			if (data === undefined) {
				data = {
					sizeInfoOptions: [{
						display: "",
						value: ""
					}]
				};
			}
			var $sizerow = _product.find('.js-sizerow'),
				_optionClone = $sizerow.find('option:eq(0)').clone(true, true),
				maxOptions = data.sizeInfoOptions.length;
			$sizerow.find('select').empty();
			for (var i = 0; i < maxOptions; i++) {
				var toAppendOption = _optionClone.clone(true, true);
				toAppendOption.attr({
					'value': data.sizeInfoOptions[i].value
				});
				toAppendOption.html(data.sizeInfoOptions[i].display);
				$sizerow.find('select').append(toAppendOption);
			}
			$sizerow.find('select').val(data.selectedOption);
			$sizerow.find('.selector span').html($sizerow.find('option:selected').html());

			return _product;
		},

		/*  
          @private method :Fill engraving info
          @param : product, data(json) 
        */
		_fillEngravingInfo = function(_product, data) {
			if (data === undefined) {
				data = {
					lineOne: "",
					lineTwo: "",
					textStyle: true
				};
			}

			if (data.lineOne !== "" || data.lineTwo !== "") {
				_product.find('.engraving-show .js-crossbutton').removeClass('display-none')
					.end()
					.find('.engraving-show .js-checked-icon').removeClass('display-none');
			}


			_product.find('.js-line-1').val(data.lineOne).data('backup', data.lineOne).trigger('change').attr('maxlength', data.lineOneMax).attr('placeholder', data.lineOneMax + " " + _objPropertiesMsg.charactersMax);
			_product.find('.js-line-2').val(data.lineTwo).data('backup', data.lineTwo).trigger('change').attr('maxlength', data.lineTwoMax).attr('placeholder', data.lineTwoMax + " " + _objPropertiesMsg.charactersMax);

			if (data.lineTwoMax === "0" || data.lineTwoMax === 0 || typeof data.lineTwoMax === "undefined") {
				_product.find('.js-line-2').closest('.engraving__line').addClass('display-none');
			} else {
				_product.find('.js-line-2').closest('.engraving__line').removeClass('display-none');
			}

			if (data.textStyle) {
				setTimeout(function() {
					_product
						.find('.engravingSection').data({
							'backup': true
						})
						.find('.slide_switch')
						.find('.js-cursive-switch')
						.trigger('click')
						.end()
						.find('.js-engraving-preview-line1')
						.removeClass('bold-class')
						.addClass('cursive-class')
						.end()
						.find('.js-engraving-preview-line2')
						.removeClass(_cache.$boldclass)
						.addClass(_cache.$cursiveclass)
						.end()
						.find('.js-message-text-saved')
						.removeClass(_cache.$boldclass)
						.addClass(_cache.$cursiveclass);
				}, 10); /// Fix for firefox
			} else {
				setTimeout(function() {
					_product
						.find('.engravingSection').data({
							'backup': false
						})
						.find('.slide_switch')
						.find('.js-bold-switch')
						.trigger('click')
						.end()
						.find('.js-engraving-preview-line1')
						.removeClass(_cache.$boldclass)
						.addClass(_cache.$cursiveclass)
						.end()
						.find('.js-engraving-preview-line2')
						.removeClass(_cache.$boldclass)
						.addClass(_cache.$cursiveclass)
						.end()
						.find('.js-message-text-saved')
						.addClass(_cache.$boldclass)
						.removeClass(_cache.$cursiveclass);
				}, 10); /// Fix for Firefox
			}
			return _product;
		},

		/*  
          @private method :Fill bracelet info
          @param : product, data(json) 
        */
		_fillBraceletInfo = function(_product, data) {

			if (data === undefined) {
				data = {
					lineOne: "",
					min: "5",
					max: "10",
					textStyle: true
				};
			}



			if (data.lineOne !== "" && data.lineOne !== undefined && data.lineOne !== "undefined") {
				var fitting;
				if (data.textStyle) {
					fitting = _objPropertiesMsg.exact;
				} else {
					fitting = _objPropertiesMsg.loose;
				}
				_product.find('.bracelet-show .js-crossbutton').removeClass('display-none')
					.end()
					.find('.bracelet-show .js-checked-icon').removeClass('display-none');

			}



			_product.find('.js-line-3').val(data.lineOne).data('backup', data.lineOne).attr({
				"data-max": data.max,
				"data-min": data.min,
				"placeholder": _objPropertiesMsg.valueInBetween + " " + data.min + " " + _objPropertiesMsg.andString + " " + data.max
			});
			if (data.textStyle) {
				setTimeout(function() {
					_product.find('.adjust_bracelet_sizeSection').data('backup', true).find('.js-exact-size').trigger('click');
				}, 10); /// Fix for Firefox
			} else {
				setTimeout(function() {
					_product.find('.adjust_bracelet_sizeSection').data('backup', false).find('.js-loose').trigger('click');
				}, 10); /// Fix for Firefox
			}
			return _product;
		},

		/*  
          @private method :Fill gift info
          @param : product, data(json) 
        */
		_fillGiftcardInfo = function(_product, data) {
			if (data === undefined) {
				data = {
					receiveBlank: false,
					cardMessage: ""
				};
			}
			if (data.receiveBlank) {
				setTimeout(function() {
					_product.find('.js-radio-change-handler .radio-btn-li:eq(1) input').trigger('click');
					_product.find('.messageSection').data('backupblankcard', true).find('.js-radio-change-handler').trigger('click');

				}, 10); /// Fix for Firefox
				_product.find('.messagerow-show .js-crossbutton').removeClass('display-none')
					.end()
					.find('.messagerow-show .js-msg-icon').addClass('msg-icon-active');

			} else {
				if (data.cardMessage !== "") {
					_product
						.find(".js-messagerow .js-accordion_node__title span")
						.addClass('opacity-none')
						.end()
						.find('.logo_section .preview')
						.removeClass('cursive-class')
						.text(data.cardMessage)
						.end()
						.find('.js-message')
						.text(data.cardMessage);
					updatePreview(_product.find('.js-message'));
				}
				if (data.cardMessage !== "") {
					_product.find('.messagerow-show .js-crossbutton').removeClass('display-none')
						.end()
						.find('.messagerow-show .js-msg-icon').addClass('msg-icon-active');

				}
				setTimeout(function() {
					_product
						.find('.messageSection').data('backupblankcard', false)
						.find('.js-radio-change-handler .radio-btn-li:eq(0) input')
						.trigger('click')
						.end()
						.find('.js-radio-change-handler').trigger('click')
						.end()
						.find('.logo_section .preview').text(data.cardMessage)
						.end()
						.find('.js-message')
						.val(data.cardMessage).data('backup', data.cardMessage);
					updatePreview(_product.find('.js-message'));
				}, 10); /// Fix for Firefox
			}



			if (data.textStyle) {
				setTimeout(function() {
					_product
						.find('.messageSection').data('backup', true)
						.find('.message_section')
						.find('.js-cursive-switch')
						.trigger('click')
						.end()
						.find('.logo_section .preview')
						.removeClass('bold-class')
						.addClass('cursive-class');
				}, 10); /// Fix for Firefox

			} else {
				setTimeout(function() {
					_product
						.find('.messageSection').data('backup', false)
						.find('.message_section')
						.find('.js-bold-switch')
						.trigger('click')
						.end()
						.find('.logo_section .preview')
						.addClass('bold-class')
						.removeClass('cursive-class');
				}, 10); /// Fix for Firefox

			}

			return _product;
		},

		/*  
          @private method :Sets json data to dom
          @param : jquery dom object, json data, class on which the html has to be added, parameter of the json 
        */
		_setData = function(obj, data, className, parameter) {
			obj.find("." + className).html(data[parameter]);
		},

		/*
          @private method : sets Product page path to reference id and image
          @param : jquery dom object, json data, class on which the html has to be added, parameter of the json 
        */
		_setProductPagePath = function(obj, data, className, parameter) {
			obj.find("." + className).attr({
				href: data.productPagePath + '.html'
			});
		},



		/*  
          @private method :Sets json data to dom
          @param : jquery dom object, json data, class on which the html has to be added, parameter of the json 
        */
		_setDataCurrency = function(obj, data, className, parameter) {
			obj.find("." + className).html(data[parameter]);

		},
		_setDataCurrencyProduct = function(obj, data, className, parameter) {
			obj.find("." + className).html(data[parameter] + '   X');

		},
		_setDataCurrencyRef = function(obj, data, className, parameter) {
			obj.find("." + className).html("REF:  " + data[parameter]);

		},
		/*  
          @private method :Sets json data to dom ( For Converting it to i18n)
          @param : jquery dom object, json data, class on which the html has to be added, parameter of the json 
        */
		_setDatai18n = function(obj, data, className, parameter) {
			obj.find("." + className).html(CQ.I18n.getMessage(data[parameter]));
		},
		/*  
          @private method :Ajax call 
          @param : action to be sent as a parameter , callback function
        */
		_ajaxSubmitHandler = function(frontEndActionMessage, that, pathToSend, dataToSend, callback, _beforesend) {
			var objXHR = cartier.ajaxWrapper.getXhrObj({
				type: 'POST',
				url: pathToSend,
				data: dataToSend,
				dataType: 'json',
				contentType: "application/x-www-form-urlencoded",
				beforeSend: function(objXHR) {
					if (_beforesend(objXHR)) {
						var toRemoveDiv = that.closest('.js-product-inbag');
						if (toRemoveDiv.length === 0)
							toRemoveDiv = $('.js-dynamic-shopping-bag');
						var loaderDivBox = toRemoveDiv.parent();
						toRemoveDiv.replaceWith("<div class='loadernode'>" + frontEndActionMessage + "</div>");
						$('.loadernode').each(function(index, el) {
							if ($(el).children().length === 0)
								$(el).addLoader();
						});



					}
				}
			});
			if (objXHR) {
				objXHR.done(function(data) {
					if (typeof data === "undefined") {} else {
						var parsedData = cartier.common.cartierJSONparser({
							json: data,
						});
						if (parsedData !== false) {
                            parsedData=cartier.common.JsonLCUpgrader(parsedData);
							callback(parsedData);

						}
					}
				});
			}
			return false;
		},


		/*	
	      @private method :Ajax call 
	      @param : action to be sent as a parameter , callback function
	    */
		_ajaxSubmitHandlerForCheckoutButton = function(pathToSend, callback) {
			var objXHR = cartier.ajaxWrapper.getXhrObj({
				type: 'POST',
				url: pathToSend,
				data:{
					currentPage: $('input[name="currentPagePath"]').val()
				},
				dataType: 'json',
				contentType: "application/x-www-form-urlencoded"
			});
			if (objXHR) {
				objXHR.done(function(data) {
					if (typeof data === "undefined") {} else {
						callback(data);
					}
				});
			}
			return false;
		},



		/*
      @private method : Function to provide functionality to engraving
      @param : none 
    */
		_engravingPreview = function() {
			$(".js-line-1").on("change paste keyup", function() {
				$(this).closest('.engravingSection').find('.js-engraving-preview-line1').text($(this).val());
			});
			$(".js-line-2").on("change paste keyup", function() {
				$(this).closest('.engravingSection').find('.js-engraving-preview-line2').text($(this).val());
			});

			$(".js-message").on("keyup", function() {
				updatePreview(this);
			});
		},

		strip_tags = function(input, allowed) {
			allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
			var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
				commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
			return input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
				return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
			});
		},

		cartierfoCommerceCartMessageCardBreakLines = function($this, exp) {
			// Find each certain number of chars without line break and add a line break.
			var line_break = '#LINEBREAK#';
			var text_lines_original = $($this).val()
				.replace(/((?:\r)|(?:\n)|(?:\r\n))/g, line_break)
				.split(line_break);
			var text_lines_final = [];
			$(text_lines_original).each(function(index, value) {
				$(value.match(exp)).each(function(index, value) {
					text_lines_final.push(value);
				});
			});
			return text_lines_final.join("\r\n");
		},

		updatePreview = function($this) {
			// Depending on device, enable the line break every 25 or 40 chars.

			var exp = /.{1,40}|^$/g;


			var plainTextBr = cartierfoCommerceCartMessageCardBreakLines($this, exp);
			var htmlBr = plainTextBr.replace(/((?:\r\n)|(?:\r)|(?:\n))/g, '<br />');

			$($this).closest('.personal-card').find('.logo_section .preview').html(strip_tags(htmlBr, '<br>'));
		},


		/*  
          @private method : fixes radio button on the page
          @param : none 
        */
		_idFixForRadio = function() {
			_idFixForEachLoop('js-bold-switch', 'Bold');
			_idFixForEachLoop('js-cursive-switch', 'Cursive');
			_idFixForEachLoop('js-loose', 'Loose');
			_idFixForEachLoop('js-exact-size', 'Exact');
			_idFixForEachLoop('compose-message', 'Compose');
			_idFixForEachLoop('receive-message', 'Receive');
		},


		/*  
          @private method :adds an index value on the id of the radio
          @param : none 
        */
		_idFixForEachLoop = function(className, idName) {
			$('.' + className).each(function(index, el) {
				$(el).attr({
					id: idName + index
				}).parent().parent().next('label').attr('for', idName + index);
			});
		},

		/*
          @private method : Function to provide functionality to engraving
          @param : none 
        */

		_engravingClassToggle = function() {
			$(".engravingSection .slide_switch input").change(function() {
				if ($(this).parent().find(".js-cursive-switch").is(':checked')) {
					$(this).closest('.slide_switch').find(".js-cursive-switch").closest('span').addClass('checked');
					$(this).closest('.slide_switch').find(".js-bold-switch").closest('span').removeClass('checked');
					$(this).closest('.engravingSection').find('.js-engraving-preview-line1').removeClass(_cache.$boldclass).addClass(_cache.$cursiveclass);
					$(this).closest('.engravingSection').find('.js-engraving-preview-line2').removeClass(_cache.$boldclass).addClass(_cache.$cursiveclass);
				} else {
					$(this).closest('.slide_switch').find(".js-bold-switch").closest('span').addClass('checked');
					$(this).closest('.slide_switch').find(".js-cursive-switch").closest('span').removeClass('checked');
					$(this).closest('.engravingSection').find('.js-engraving-preview-line1').removeClass(_cache.$cursiveclass).addClass(_cache.$boldclass);
					$(this).closest('.engravingSection').find('.js-engraving-preview-line2').removeClass(_cache.$cursiveclass).addClass(_cache.$boldclass);
				}
				$.uniform.update();
			});
		},

		/*
          @private method : Function to provide functionality to Bracelet adjustment
          @param : none 
        */

		_adjustmentClassToggle = function() {
			$(".adjust_bracelet_sizeSection .slide_switch input").change(function() {
				if ($(this).parent().find(".js-loose").is(':checked')) {
					$(this).parent().find(".js-loose").parent().addClass('checked');
					$(this).closest(".slide_switch").find(".js-exact-size").parent().removeClass('checked');
				} else {
					$(this).parent().find(".js-exact-size").parent().addClass('checked');
					$(this).closest(".slide_switch").find(".js-loose").parent().removeClass('checked');

				}
			});
		},


		/*  
          @private method : handles the engraving radio 
          @param : none 
        */
		_messageBlankRadioHandler = function() {
			$('.js-radio-change-handler').on('click', function() {
				var messageSection = $(this).closest('.messageSection');
				if (messageSection.find('.compose-message').is(':checked')) {
					messageSection.find('.compose-message').parent().addClass('checked');
					messageSection.find('.receive-message').parent().removeClass('checked');
					messageSection.find('.js-hide-when-blank').removeClass('display-none');
					messageSection.find('.js-blank-message').addClass('display-none');
					messageSection.find('.js-hide-preview-section').removeClass('display-none');
					updatePreview($(this).closest('.messageSection').find('.js-message'));

				} else if (messageSection.find('.receive-message').is(':checked')) {
					messageSection.find('.receive-message').parent().addClass('checked');
					messageSection.find('.compose-message').parent().removeClass('checked');
					messageSection.find('.js-hide-when-blank').addClass('display-none');
					messageSection.find('.js-blank-message').removeClass('display-none');
					messageSection.find('.js-hide-preview-section').addClass('display-none');
					$(this).closest('.personal-card').find('.logo_section .preview').html("");

				}
			});
		},

		/*  
          @private method : Message style changer (bold or cursive)
          @param : none 
        */
		_messageCardClassToggle = function() {
			$(".messageSection .slide_switch input").change(function() {
				if ($(this).parent().find(".js-cursive-switch").is(':checked')) {
					$(this).closest('.slide_switch').find(".js-cursive-switch").closest('span').addClass('checked');
					$(this).closest('.slide_switch').find(".js-bold-switch").closest('span').removeClass('checked');
					$(this).closest('.js-accordion__node').find('.js-message').removeClass(_cache.$boldclass).addClass(_cache.$cursiveclass);
					$(this).closest('.personal-card').find('.logo_section .preview').addClass('cursive-class');
				} else
				if ($(this).parent().find(".js-bold-switch").is(':checked')) {
					$(this).closest('.slide_switch').find(".js-cursive-switch").closest('span').removeClass('checked');
					$(this).closest('.slide_switch').find(".js-bold-switch").closest('span').addClass('checked');
					$(this).closest('.js-accordion__node').find('.js-message').removeClass(_cache.$cursiveclass).addClass(_cache.$boldclass);
					$(this).closest('.personal-card').find('.logo_section .preview').removeClass('cursive-class');
				}
			});
		},

		//--------------------------------------------------------------------------------------------------------
		//          Module level validtion additions
		//--------------------------------------------------------------------------------------------------------

		/*
      @private method : extends jQuery validation for range checking on bracelet 
      @param : none
    */
		_braceletValidation = function(max, min, sizeInputField) {

			$.validator.addMethod("range", function(value, element) {
				var status = false,
					decimalPattern = "[0-9]+(\.[0-9][0-9]?)?",
					patt1 = new RegExp(decimalPattern);
				var validNo = patt1.test(value);
				if (validNo === true && value >= min && value <= max) {
					status = true;
				}
				return status;
			}, "");

			$.validator.addMethod("hasNoSpace", function(value, element) {
				return value.match(/\s/) === null;
			}, "");

			if (sizeInputField.length > 0) {
				sizeInputField.rules("add", {
					required: true,
					hasNoSpace: true,
					range: true,
					messages: {
						required: _objPropertiesMsg.mandatory,
						range: _objPropertiesMsg.notInRange,
						hasNoSpace: _objPropertiesMsg.hasNoSpace
					}
				});
			}
		},



		_messageCardValidation = function($this) {

			$.validator.addMethod("messageRequired", function(value, element) {
				if (!$(element).is(':visible')) {
					return true;
				} else {
					if ($(element).val().trim() === "")
						return false;
					else
						return true;
				}
			}, "");



			var messageBox = $this.closest('fieldset').find('textarea');
			if (messageBox.length > 0 && messageBox.is(':visible')) {
				messageBox.rules('add', {
					messageRequired: true,
					messages: {
						messageRequired: _objPropertiesMsg.messageEmpty
					}
				});
			}
		},
		/*
      @private method : extends jQuery validation for empty field checking on PDP
      @param : none
    */

		_engravingValidation = function($this) {
			$.validator.addMethod("emptyField", function(value, element) {
				var status = true,
					field1 = $(element).closest('fieldset').find("input[name='fn_commsgone']"),
					field2 = $(element);
				if (field1.val().trim() === "" && field2.val().trim() === "") {
					field1.addClass('error');
					field2.addClass('error');
					status = false;
				} else {
					field1.removeClass('error');
					field2.removeClass('error');
				}
				return status;
			}, "Please fill atleast one value");

			var engravingInputField1 = $this.closest('fieldset').find("input[name='fn_commsgone']");
			var engravingInputField2 = $this.closest('fieldset').find("input[name='fn_commsgtwo']");
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



		/*  @private method : Save Comment Popup Box
          @param : none 
        */
		_saveButtonAjaxCallBack = function(parsedData, message, title, clickedEl) {
			if (cartier.common.isLoggedIn()) {
				clickedEl.closest('.js-accordion__node').find('.js-add-selection').trigger('click');

			}
			_cache.$addtomywishlistok.confirmBox();
			_cache.$addtomywishlistok.data('plugin_confirmBox').popupInitialize({

					'title': title,
					'anchormessage': message,
					'src': $('.js-wishlistPath').val(),
					'buttons': {
						'ok': {
							'buttonName': _objPropertiesMsg.okButton,
							'class': 'cta-button cta-button__inner cta--red',
							'action': function() {
								//location.reload();
							},


						},
					}
				},
				_cache.$addtomywishlistok.data('plugin_confirmBox').confirmHide
			);

			$('.popup-close-button').on('click', function() {
				_cache.$addtomywishlistok.data('plugin_confirmBox').confirmHide();
			});
		},

		/*
          @private method : Guest account
          @param : loggedIn :- login in or not 
        */

		_guestAccount = function(loggedIn) {

			if (loggedIn) {
				$('button').removeAttr('disabled');

				$('.js-addtomywishlist-ok').on('click', function(e) {
                    var ClickedEl=$(this);
					e.preventDefault();
                    cartier.common.addSelectionToWishlist("", "addPDPwishlist", _saveButtonAjaxCallBack, _objPropertiesMsg.wishlistParagraph, _objPropertiesMsg.wishlistcopytoWishlist, ClickedEl);
				});

				$('.js-createnewwishlist-ok').on('click', function(e) {
                    var ClickedEl=$(this);
					e.preventDefault();
					$(this).closest('form').find('input[name="fn_newwishlistname"]').on('change keypress keydown', function() {
						$(this).closest('.single-line').find('span.error').remove();
					});



					$(this).closest('form').find('input[name="fn_newwishlistname"]').closest('.single-line').find('span.error').remove();
					if ($(this).closest('form').find('input[name="fn_newwishlistname"]').valid()) {
						cartier.common.addSelectionToWishlist(_createWishlistValidation, "createPDPwishlist", function(data) {

							var $option = $('<option></option>');
							$option.attr('data-wishlistno', data.wishlistNumber)
								.val(data.wishlistName)
								.html(data.wishlistName);
							var that = $(this);
							var addOption = true;
							$('.js-select-addtomywishlist').find('option').each(function(index, el) {
								if ($(el).attr('data-wishlistno') === data.wishlistNumber)
									addOption = false;
							});

							if (addOption)
								$('.js-select-addtomywishlist').append($option);

							_saveButtonAjaxCallBack("", _objPropertiesMsg.wishlistParagraph, _objPropertiesMsg.wishlistcopytoWishlist, ClickedEl);
							setTimeout(function() {
								$('.js-copytowishlist-input').removeClass('display-none');
								$('.js-select-addtomywishlist').trigger('change');
							}, 100);

						}, "", "", ClickedEl);

					}
				});

				$('.js-add-selection').on('click', function() {
					if (typeof $('.body-wrapper').data('plugin_analytics') !== 'undefined') {
						$('.body-wrapper').data('plugin_analytics').shoppingBagGARules('cartSaveSelection');
					}
				});

			} else {
				$('.js-add-selection')
					.closest('.js-accordion__node')
					.find('.js-accordion_node__desc')
					.addClass('display-none')
					.end()
					.find('span')
					.removeClass('off')
					.addClass('on');

				$('.js-add-selection').on('click', function() {
					var that = $(this);
					cartier.common._guestAccountAjaxCallHandler("GuestUserWishList", that);
					_saveButtonAjaxCallBack("", _objPropertiesMsg.wishlistParagraph, _objPropertiesMsg.wishlistcopytoWishlist, that);
					if (typeof $('.body-wrapper').data('plugin_analytics') !== 'undefined') {
						$('.body-wrapper').data('plugin_analytics').shoppingBagGARules('cartSaveSelection');
					}
				});
			}
		},

		/*
          @private method : Validation for Create Wishlist and popup
          @param : loggedIn :- login in or not 
        */

		_createWishlistValidation = function(jqXHR) {

			if ($('.js-newwishlistname').val() === '') {
				$('body').confirmBox();
				$('body').data('plugin_confirmBox').popupInitialize({
						'title': _objPropertiesMsg.createWishlishlistValidation,
						'buttons': {
							'ok': {
								'buttonName': _objPropertiesMsg.okButton,
								'class': 'cta-button cta-button__inner cta--red',
							},

						}
					},
					$('body').data('plugin_confirmBox').confirmHide
				);

				$('.popup-close-button').on('click', function() {
					$('body').data('plugin_confirmBox').confirmHide();
				});
				jqXHR.abort();
			}

		},


		_loginBeforeCheckout = function() {
			$.jStorage.set('loginBeforeCheckout', 'true');
			$.jStorage.setTTL("loginBeforeCheckout", 3600000); ///// Time out for the local strorage = 1 hours
		},

		_showhideShopingBagInfo = function(value, element) {
			$('.engraving-show, .bracelet-show, .messagerow-show').on('click', function(e) {
				e.preventDefault();
			});
			$(".engraving-show .edit-icon").on('click', function(e) {
				e.preventDefault();
				var teservalue = $(this).closest("form").find(".teaserId").val();
				$(".engravingSection").find(".teaserId").val(teservalue);

				$(this).closest("ul").find("li.engravingSection").removeClass('display-none');
				$(this).closest("ul").find("li.productSection").addClass("display-none");

				if (typeof $('.body-wrapper').data('plugin_analytics') !== 'undefined') {
					$('.body-wrapper').data('plugin_analytics').shoppingBagGARules('cartEngravingEdit');
				}
			});

			$(".bracelet-show .edit-icon").on('click', function(e) {
				e.preventDefault();
				var teservalue = $(this).closest("form").find(".teaserId").val();
				$(".adjust_bracelet_sizeSection").find(".teaserId").val(teservalue);

				$(this).closest("ul").find("li.adjust_bracelet_sizeSection").removeClass('display-none');
				$(this).closest("ul").find("li.productSection").addClass("display-none");

				if (typeof $('.body-wrapper').data('plugin_analytics') !== 'undefined') {
					$('.body-wrapper').data('plugin_analytics').shoppingBagGARules('cartAdjustementEdit');
				}
			});

			$(".messagerow-show .edit-icon").on('click', function(e) {
				e.preventDefault();
				var teservalue = $(this).closest("form").find(".teaserId").val();
				$(".messageSection").find(".teaserId").val(teservalue);
				$(this).closest("ul").find("li.messageSection").removeClass('display-none');
				$(this).closest("ul").find("li.productSection").addClass("display-none");

				if (typeof $('.body-wrapper').data('plugin_analytics') !== 'undefined') {
					$('.body-wrapper').data('plugin_analytics').shoppingBagGARules('cartMessageCardEdit');
				}
			});

		},

		_closeHandler = function(value, element) {
			$(value).closest("ul").find("li.product-inbag").addClass("display-none");
			$(value).closest("ul").find("li.productSection").removeClass("display-none");
		};

	/*
        @pubic method : initailize the module
        */
	shoppingbag.init = function() {

		RICHEMONT.AjaxCaller.listOfCallbackFun.CaptchaAction = cartier.login.loginCaptchaCall;

		// caching the jquery objects
		_cacheObjects();
		_showhideShopingBagInfo();
		_objPropertiesPth = cartier.properties.paths;
		_objPropertiesMsg = cartier.properties.messages;
		_fontActionMap = {
			"productRemove": _objPropertiesMsg.sbRemovingProduct,
			"prodInfoAdd": _objPropertiesMsg.sbAddInfo,
			"prodInfoDelete": _objPropertiesMsg.sbRemovingInfo,
			"productQuantChange": _objPropertiesMsg.sbproductQuantChange,
			"productSizeChange": _objPropertiesMsg.sbproductSizeChange,
			"initialUpdate": "",
			"quantChangeForinfo": _objPropertiesMsg.sbquantChangeForinfo
		};
		//console.log('JS-LOG:Shopping Bag Init Called');
		if (_cache.accordionObject.length) {
			// Initializing the accordion
			initializeAccordion();
		}
		_bindEvents();
		_messageCardClassToggle();
		_engravingClassToggle();
		_engravingPreview();
		_messageBlankRadioHandler();
		_adjustmentClassToggle();
		cartier.formValidationWrapper.init($('.js-form-validator form'));
		_cloneShoppingBag();

	};



}(window, jQuery, cartier.shoppingbag));