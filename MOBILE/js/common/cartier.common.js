/*!
 * cartier.common.js
 * This file contains common methods
 *
 * @project   cartier mobile
 * @date      2014-01-03
 * @author    YOUR NAME, SapientNitro <YOUREMAIL@sapient.com>
 * @site      cartier mobile
   @dependency none
 * @ NOTE:
    This file has the following sequence of the actions
    1) Declare all the private variables
 
 */


;
(function(window, $, common, cartier, console, undefined) {
	//this will cause the browser to check for errors more aggressively
	'use strict';

	//check if jquery is defined, else retun
	if ($ === undefined) {
		//console.log('jQuery not found');
		return false;
	}

	/*
    private variables
    */
	var
	_objPropertiesMsg,
		indexcount,
		_itemPerPage,
		itemListInDom,
		itemListNotInDom = undefined,
		totalItemToShow,
		_objPropertiesPth,
		_cache = {},
		keyboard_shown = false;



	//--------------------------------------------------------------------------------------------------------
	//         Caching jQuery object
	//--------------------------------------------------------------------------------------------------------

	/*
      @private method : caching jquery objects 
      @param : none 
    */
	var _cacheObjects = function() {

		_cache = {
			$bodyObject: $('body'),
			$htmlAndBodyObject: $('html, body'),
			$mainContainer: $('.main-container'),
			$headerObject: $('header'),
			$shareDescClass: $('.js-share-desc'),
			$shareTitleClass: $('.js-share-title'),
			$shareImgclassWithCarousel: $('.js-product-carousel img'),
			$shareImgclassWithoutCarousel: $('.js-share-img img'),
			$socialShareFb: $('.js-social-share__facebook'),
			$socialShareTwitter: $('.js-social-share__twitter'),
			$socialSharePinit: $('.js-social-share__pin-it'),
			$errorZone: $('.error-zone'),
			$wishlistPagepath: $('.js-wishlist_pagepath'),
			$pagePath: $('.js-pagepath'),
			$cartUpdate: $('.js-cart-update'),
			$shareCaptionclass: $('.js-share-caption'),
			$passInput: $(' .j_password, .registration_j_password, .fn_passcon, .piform_password, .piform_new_password'),
			$socialEmailWrapper: $('.js-social-share__email'),
			$socialEmailForm: $('.js-social-share__email-form')
		};
	}, indexcounts = [],

		//--------------------------------------------------------------------------------------------------------
		//          EVENT HANDLERS
		//--------------------------------------------------------------------------------------------------------
		_bindFunction = function() {

			$("img.image").lazyload({
				threshold: 200,
				failure_limit: 20
			});
			$('.js-search-icon').click(function(e) {
				e.preventDefault();
				$(this).closest('form').submit();
			});
		},

		// bind event on iput filed
		_bindFunctionForiphone = function() {

			$("input[type='text'],input[type='email'],input[type='password'],input[type='tel']").bind("focus", function() {
				keyboard_shown = true;
			});

			$("input[type='text'],input[type='email'],input[type='password'],input[type='tel']").bind('blur', function() {
				_virtualKeybordiphone();
			});


		},

		_virtualKeybordiphone = function() {
			if (keyboard_shown) {
				keyboard_shown = false;
				_zoomFix();
			}

		},
		/*
            @private method : change position absolute then fixed on samsung s3 nativ browser when
                            orientation changed
            @param : none
         */
		_reloadWindowForStock = function() {

			if ($.browser.name === 'stock' && $.browser.version === '4.0' && $.browser.platform === 'android') {
				$(window).bind('orientationchange', function() {
					_cache.$headerObject.css({
						position: 'absolute'
					});

					setTimeout(function() {
						_cache.$headerObject.css({
							position: 'fixed'
						});

					}, 500);
				});
			}

		},


		/*
            @private method : Add device specific class to body
            @param : none
        */
		_deviceAndBrowserFix = function() {

			switch ($.browser.device) {

				//device s4
				case 'gt-i9500':

					if ($.browser.name === 'chrome') {
						_inputMaxLengthDeviceCheck();
					}

					break;
					//device s3
				case 'gt-i9300':


					if ($.browser.name === 'chrome' || $.browser.name === 'stock') {
						_inputMaxLengthDeviceCheck();
					}

					break;
			}

		},
		/*
        @private method : Add device specific class to body
        @param : none
        */
		_deviceFix = function() {

			switch ($.browser.device) {
				case 'gt-i9500':
					_cache.$bodyObject.addClass('device-s4');
					if ($.browser.name !== 'ucbrowser') {

						_cache.$bodyObject.addClass('not-uc-browser');
					} else {
						_cache.$bodyObject.addClass('uc-browser');
					};

					break;
				case 'gt-i9300':
					_cache.$bodyObject.addClass('device-s3');
					if ($.browser.name === 'ucbrowser') {
						_cache.$bodyObject.addClass('uc-browser');
					}
					break;
			}
		};

	//--------------------------------------------------------------------------------------------------------
	//          Public functions
	//--------------------------------------------------------------------------------------------------------
	/*
            @public  method : add function to jquery 
            @param : none
        */
	var _extendJQuery = function() {
		$.fn.extend({
			addLoader: function() {
				this.append("<span class='loaderImage'></span>");
				return this;
			},
			//This preloader is added for Storelocator | Do not remove this
			addLoaderPrepend: function() {
				this.prepend("<span class='loaderImage'></span>");
				return this;
			},

			removeLoader: function() {
				this.find('.loaderImage').remove();
				return this;
			}


		});
	},
		_passShowButton = function() {
			_cache.$passInput.find('input')
				.addClass('js-password-input')
				.addClass('password-input')
				.wrap('<div class="form-input" id="no-border"></div>')
				.after('<div class="show-password js-show-password">' + _objPropertiesMsg.showPassword + '</div>');
			_bindShowHide();
		},

		_bindShowHide = function() {
			var intype,
				$showPassword = $('.js-show-password');
			$showPassword.on('click', function() {
				intype = $(this).closest('.form-element').find('input');
				if (intype.attr('type') === 'password') {
					intype.attr({
						type: 'text'
					});
					$(this).html(_objPropertiesMsg.hidePassword);
				} else if (intype.attr('type') === 'text') {
					intype.attr({
						type: 'password'
					});
					$(this).html(_objPropertiesMsg.showPassword);
				}
			});
		},
		/*
          @private  method : max length check
          @param : customOptions :- override default option 
    */
		_inputMaxLengthDeviceCheck = function() {

			var elInput = $('#jstest'),
				maxLength = elInput.attr('maxlength'),

				// remove extra charater from input filed
				checkChars = function(charactersLength) {

					if (charactersLength >= maxLength) {

						// Cut down the string
						$(elInput).val($(elInput).val().substr(0, maxLength));


					}

				};
			$(elInput).bind('keyup', function(e) {
				var charactersLength = $(elInput).val().length;
				checkChars(charactersLength);
			});
		};
	common._CQI18nCreator = function() {

		if (typeof CQ.I18n === 'undefined') {
			CQ.I18n = {
				getMessage: function(key) {
					if (window.I18nJson[key] !== undefined && window.I18nJson[key] !== "")
						key = window.I18nJson[key];
					else {
						if (typeof window.i18ENnxhr === "undefined") {
							$.ajax({
								type: 'GET',
								url: "/libs/cq/i18n/dict." + "en" + ".json",
								dataType: 'json',
								contentType: 'application/x-www-form-urlencoded',
								cache: true,
								async: false
							}).success(function(data) {
								window.i18ENnxhr = data;
							});
						}

						if (window.i18ENnxhr[key] !== undefined && window.i18ENnxhr[key] !== "")
							key = window.i18ENnxhr[key];

					}
					return key;
				}
			};
		}
	};
	/*
          @public  method : check predefine format of json file
          @param : customOptions :- override default option 
    */
	common.cartierJSONparser = function(customOptions) {

		//Sets the custom option against the default options
		var _defaultOptions = {
			json: {
				'success': false,
				'serverMessage': _objPropertiesMsg.noJSONprovided,
				'content': ''
			},
			JSONerrorDiv: $("<div class='error-zone'></div>"),
		},
			_objConfig = $.extend({}, _defaultOptions, customOptions);


		//check if the json is in correct format!
		if (_objConfig.json.success === undefined || _objConfig.json.serverMessage === undefined || _objConfig.json.content === undefined) {
			_objConfig.json = _defaultOptions.json;
			_objConfig.json.serverMessage = _objPropertiesMsg.badJSONProvided;
		}

		//Check if the json is in success state     
		if (_objConfig.json.success) {
			return _objConfig.json.content;
		}

		//Handle the failure state of Json
		else {
			//for Custom Div
			_objConfig
				.JSONerrorDiv
				.html(_objConfig.json.serverMessage)
				.removeClass('display-none');

			//for default div only
			if (customOptions.JSONerrorDiv === undefined) {
				_cache.$errorZone.remove();
				_cache.$mainContainer.prepend(_objConfig.JSONerrorDiv);
				_cache.$htmlAndBodyObject.animate({
					scrollTop: 0
				}, 'slow');
			}
			return false;
		}


	};

	/*
          @public  method : hide or dispaly list of checkbox on checkbox click
          @param :  checkBoxStatus : checkbox status
                    listContainer :  list conatiner
    */
	common.showHideList = function(checkBoxStatus, listContainer) {

		if (checkBoxStatus) {
			listContainer.removeClass('display-none');

		} else {

			listContainer.addClass('display-none');
		}
	};
	/*
          @public  method : test object udefiend or not not if object undefined then repalce with null string
                            other wise return object
          @param : data :  testing object 
    */
	common.jsonData = function(data) {
		return data === undefined ? '' : data;
	};


	//  cartier.log(common.jsonData({'name': 'vaibhav'},'nam1e'));



	/*
          @public method : view more event binding
          @param :  productPerPage -no of product to show 
                    viewMoreButton - dom elemnt on which view more click event binded
                    listOfproducts - list of product
                    newProductList - list of product that  not aaded in dom

    */
	common.viewMoreSelection = function(itemPerPage, viewMoreButton, listOfItemInDom, newItemList) {

		_itemPerPage = itemPerPage;
		itemListInDom = listOfItemInDom;
		indexcount = itemPerPage;
		itemListNotInDom = newItemList;
		totalItemToShow = listOfItemInDom.length + $(newItemList).length;
		viewMoreButton.on('click', _viewSelectionHandler);

	};


	/*
          @private method : add product in DOM for view more if product not exist in dom
          @param : none
    */
	var _addNewProductInDom = function() {


		var itemListToShow,
			startingProduct = itemListInDom.length,
			//endingProduct = itemListInDom.length + _itemPerPage;
			itemListToShow = itemListNotInDom.splice(0, _itemPerPage);
		$(itemListInDom).closest('ul').append(itemListToShow);

		// update product list beacuse dom is updated 
		itemListInDom = $(itemListInDom).closest('ul').find('li');
	};

	/*
        @public method : socialShareHandler to respective Hrefs to the Social share buttons
        @param : none
    */
	var _viewSelectionHandler = function(event) {
		window.scrollBy(0, -1);
		window.scrollBy(0, 1);

		/// productList = $(_listOfproductsContainer).find('li');
		event.preventDefault();
		var i = 0,
			maxCount,
			totalProduct = itemListInDom.length,
			removingClassName = 'js-hide-content';
		// extra condtion in hiding view more for add product run time in dom
		// hideViewMoreAddCondtion = false;

		// check product is exist or not in dom
		if (typeof itemListNotInDom !== 'undefined') {

			if (itemListInDom.length < itemListNotInDom.length) {
				_addNewProductInDom();
			}
			totalProduct = itemListInDom.length;
		}

		maxCount = indexcount + _itemPerPage < totalProduct ? indexcount + _itemPerPage : totalProduct;
		itemListInDom.slice(indexcount, maxCount).removeClass(removingClassName).lazyLoader();
		indexcount = indexcount + _itemPerPage;

		if (indexcount >= totalItemToShow) {
			$(this).css('display', 'none');
		}


	},


		_referralUrlSetter = function() {
			var refUrl = $.jStorage.get('refUrl');
			if (refUrl !== location.href) {
				if (refUrl !== undefined && refUrl !== null) {
					window.referrerUrl = refUrl;
					window.referrerTitle = $.jStorage.get('refTitle');
				} else {
					window.referrerurl = '#';
					window.referrerTitle = 'Home';
				}


				$.jStorage.set('refUrl', location.href);
				$.jStorage.set('refTitle', $('.js-pagetitle').text());
				$.jStorage.set('referrerUrl', window.referrerUrl);
				$.jStorage.set('referrerTitle', window.referrerTitle);

			} else {
				window.referrerUrl = $.jStorage.get('referrerUrl');
				window.referrerTitle = $.jStorage.get('referrerTitle');
			}
		},


		_disablePasteOnFields = function() {
			$("input[name='fn_passcon']").on('paste', function(e) {
				e.preventDefault();
			});
		},
		_zoomFix = function() {
			if ((document.documentElement.clientWidth / window.innerWidth) > 1 && (!$('body').hasClass('body-push')) || keyboard_shown) {
				_headerFix();
			} else {
				$('header').removeClass('position-relative').css({
					'position': 'fixed'
				});
				$('.main-container').css('margin-top', '92px');
			}
		},



		_headerFix = function() {
			$('header').addClass('position-relative').css('position', 'relative');
			$('.main-container').css('margin-top', '0px');
		},

		_zoomFixesForPhone = function() {

			$('body').hammer({}).on('pinch tap', function(ev) {

				setTimeout(function() {
					_zoomFix();
				}, 100);
			});

			$('input').on('focus', function(ev) {

				var inputType = $(this).attr('type');
				if (inputType === 'text' || inputType === 'password' || inputType === 'email' || inputType === 'tel') {

					setTimeout(function() {
						_zoomFix();
					}, 100);
				}
			});
		},

		_errorFieldHighlighter = function() {
			if ($('.js-light-account-form #captchaFailedFlag').val() === "true") {
				$('.captcha__input').addClass('error');
			} else {
				$('.captcha__input').removeClass('error');
			}
		};



	/*
          @public method : social share
          @param : none
    */


	common.socialShareHandler = function() {


		//This selector has been specially added here because of caching issue with this selector. please don't remove it
		var imageSrc, imgLoc = $('.js-product-carousel').find('li.clearfix').not('.lazy-loader').find('img');
		//If the Required image comes from a carousel then imgLoc will be true, Else Use shareImgClassWithoutCarousel ('js-share-img')
		if (imgLoc.attr('data-original')) {
			imageSrc = imgLoc.attr('data-original');
		} else {
			if (_cache.$shareImgclassWithoutCarousel) {
				if (_cache.$shareImgclassWithoutCarousel.attr('data-original'))
					imageSrc = _cache.$shareImgclassWithoutCarousel.attr('data-original');
				else
					imageSrc = _cache.$shareImgclassWithoutCarousel.attr('src');
			} else
			// Default Cartier Logo image should go here. Please put the URL for Cartier Logo here
				imageSrc = 'http://www.cartier.us/sites/all/themes/cartierfotheme/images/Cartier_jeweller-watchmaker-leather-goods.png';
		}
		var winLoc = window.location,
			facebookLink, tweetLink, pinLink,
			currentUrl = winLoc.protocol + '//' + winLoc.host + '' + winLoc.pathname,
			imageUrl = winLoc.protocol + '//' + winLoc.host + '' + imageSrc,
			productDesc = $.trim(_cache.$shareDescClass.html()),
			tweeterStaticText = encodeURIComponent(_objPropertiesMsg.tweeterStaticText),
			title = window.productName,
			caption = encodeURIComponent(_cache.$shareCaptionclass.text());

		if (typeof title !== "undefined")
			title = title.replace(/@/gi, "");

		if (typeof productDesc !== "undefined") {
			productDesc = productDesc.replace(/<span class='lovefont'>A <\/span>/gi, "Love").replace(/<span class="lovefont">A <\/span>/gi, "Love");
		}

		productDesc = encodeURIComponent(productDesc);


		title = encodeURIComponent(title);
		if ($('.js-boutique').length) {

			title = _objPropertiesMsg.boutiqueCartierText + " - " + encodeURIComponent($.trim(_cache.$shareTitleClass.text())); // This text needs to come from i18n
			productDesc = title + _objPropertiesMsg.boutiqueDescText; // This text needs to come from i18n

			if (_cache.$socialEmailForm.length) {

				$('input[name=fn_title]').attr('value', title);
				$('input[name=fn_titleimgsrc]').attr('value', imageUrl);
				$('textarea[name=fn_titledesc]').text(productDesc);
				$('input[name=fn_titleurl]').attr('value', currentUrl);

			}
		}

		if (_cache.$socialEmailForm.length && $('.js-product').length) {

			$('input[name=fn_title]').attr('value', title);
			$('input[name=fn_titleimgsrc]').attr('value', imageUrl);
			$('textarea[name=fn_titledesc]').text(productDesc);
			$('input[name=fn_titleurl]').attr('value', currentUrl);

		}
		var isProductOrBoutique = $('.js-product').length + $('.js-boutique').length; // A variable to check if this is a boutique page or pdp. Else we will share the current URL on FB


		if (isProductOrBoutique) {

			facebookLink =
				'http://www.facebook.com/dialog/feed?app_id=1402782546638078' +
				'&link=' + currentUrl +
				'&name=' + title +
				'&picture=' + imageUrl +
				'&caption=' + caption +
				'&description=' + productDesc +
				'&redirect_uri=http://facebook.com/';
		} else { //Share the Current URL else
			var currentUrlToShare = encodeURIComponent(window.location.href);
			facebookLink = "https://www.facebook.com/sharer/sharer.php?app_id=1402782546638078&u=" + currentUrlToShare + "&display=popup&ref=plugin"
		}


		pinLink =
			'http://www.pinterest.com/pin/create/button/?u=' + currentUrl +
			'&media=' + imageUrl +
			'&description=' + productDesc;


		if (facebookLink) {
			_cache.$socialShareFb.attr('href', facebookLink);
		}

		if (pinLink) {
			_cache.$socialSharePinit.attr('href', pinLink);
		}

		if ($('.js-social-share__twitter').length > 0) {

			$('.js-social-share__twitter').on('click', function(e) {
				e.preventDefault();
				cartier.common.twitterLinkSetter(currentUrl, function(tinyUrl) {

					if (typeof title === "undefined" || title === "undefined" || title === "")
						title = $('title').text();



					tweetLink =
						'https://twitter.com/intent/tweet?original_referer=' + currentUrl +
						'&text=' + title + ' ' + tweeterStaticText +
						'&url=' + tinyUrl;
					if (tweetLink) {
						_cache.$socialShareTwitter.attr('href', tweetLink);
					}
					window.open($('.js-social-share__twitter').attr('href'), '_blank');
				});
			});
		}
	};

	common.twitterLinkSetter = function(currentUrl, callback) {
		var objXHR = cartier.ajaxWrapper.getXhrObj({
			type: 'POST',
			url: _objPropertiesPth.tinyUrlAjaxCall,
			dataType: 'json',
			data: "currentUrl=" + currentUrl + "&pagePath=" + $('.twitterPagePath').val(),
			async: false,
			contentType: "application/x-www-form-urlencoded"
		});



		if (objXHR) {
			objXHR.done(function(data) {
				// handle failure
				if (typeof data.success !== "undefined" && !data.success) {
					// handle redirectURL exist if the session expires
					// data.redirectURL ?  window.location.href = data.redirectURL : $form.find('.server_message').html(data.errorMessage);
				} else {
					if (data !== false) {
						callback(data.tinyurl);
					}
				}
			});
		}
	};
	/*
        @public method : checkForImgChange will check image changes for 
                         Product detail page/Shopping bag changes and apply appropriate href's for social share 
        @param : none
    */
	common.checkForImgChange = function() {
		//This selector has been specially added here because of caching issue with this selector. please don't remove it
		var imgLoc = $('.js-product-carousel .rslides1_on img'),
			winLoc = window.location,
			imageSrc;

		if (imgLoc.attr('data-original')) {
			imageSrc = imgLoc.attr('data-original');
		} else
			imageSrc = _cache.$shareImgclassWithoutCarousel.attr('data-original');

		var imageUrl = winLoc.protocol + '//' + winLoc.host + '' + imageSrc,
			fbText = _cache.$socialShareFb.attr('href'),
			pinText = _cache.$socialSharePinit.attr('href');


		if (fbText) {
			fbText = fbText.replace(/(picture=).*?(&)/, '$1' + imageUrl + '$2');
			_cache.$socialShareFb.attr('href', fbText);

		}
		if (pinText) {
			pinText = pinText.replace(/(media=).*?(&)/, '$1' + imageUrl + '$2');
			_cache.$socialSharePinit.attr('href', pinText);
		}



	};

	/*
        @public view more function for search result page 
        @param : listArray = product list 
        		
    */

	common.viewmoreSearchResult = function(listArray) {
		$.each(listArray, function(k, v) {
			var $oneList = $(v),
				_itemPerPage = $oneList.find('.js-view-wrapper').data('maxlimit'),
				_totalItemsToShow = $oneList.find('.js-view-wrapper li').length;
			indexcounts[k] = $oneList.find(".js-not-in-result").length - $oneList.find(".js-hide-content").length;
			$oneList.find('.js-view-button').on('click', {
				listObj: $oneList,
				itemPerPage: _itemPerPage,
				key: k,
				totalItems: _totalItemsToShow
			}, function(e) {
				window.scrollBy(0, -1);
				window.scrollBy(0, 1);
				var i = 0,
					maxCount,
					totalProduct = e.data.totalItems,
					removingClassName = 'js-hide-content';
				maxCount = indexcounts[e.data.key] + e.data.itemPerPage < totalProduct ? indexcounts[e.data.key] + e.data.itemPerPage : totalProduct;
				e.data.listObj.find(".js-not-in-result").slice(indexcounts[e.data.key], maxCount).removeClass(removingClassName).lazyLoader();
				indexcounts[e.data.key] = indexcounts[e.data.key] + e.data.itemPerPage;

				if (indexcounts[e.data.key] >= totalProduct) {
					$(this).css('display', 'none');
				}

			});

		});
	};

	/*
        @public method : make ajax call
        @param : url -  page path
        		action - call back function
    */
	var _dataLoad = function(url, action) {

		var objXHR = cartier.ajaxWrapper.getXhrObj({
			type: 'GET',
			url: url,
			dataType: 'html',
			contentType: "application/x-www-form-urlencoded",
		});
		if (objXHR) {
			objXHR.done(function(data) {
				var parsed = $($.parseHTML(data, document, true)).find('.overlay-form').addBack('.overlay-form');
				action(parsed);

			});
		}
	},


		_sendAEmailAjaxCallBack = function(data) {

			$('.loaderDiv').removeLoader();
			var emailForm = _cache.$socialEmailForm;
			emailForm.empty();
			emailForm.append(data);
			emailForm.find('input:checkbox, input:radio, select').uniform();

			// setting page path and page name for PDP and boutique page
			$('.overlay-form input[name=pagepathcurrent]').val($('input[name=pagepathcurrent]').val());
			$('.overlay-form input[name=pageName]').val($('input[name=pageName]').val());


		},

		getParameterByName = function(name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(location.search);
			return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		},

		_urlCheckerAndAjax = function() {
			if ((getParameterByName('sw') !== "" && $('.js-shoppingbag').length === 0) || (window.location.protocol === "http:" && typeof $.cookie('rvcheck') !== "undefined")) {
				var objXHR = cartier.ajaxWrapper.getXhrObj({
					type: 'POST',
					url: _objPropertiesPth.getCart,
					data: {
						sw: getParameterByName('sw'),
						currentPage: $('#configPath').val()
					},
					dataType: 'json',
					contentType: "application/x-www-form-urlencoded",
					async: true
				});
				if (objXHR) {
					objXHR.done(function(data) {
						if (typeof data === "undefined") {} else {
							var parsedData = cartier.common.cartierJSONparser({
								json: data,
							});
							if (parsedData !== false) {
								parsedData = cartier.common.JsonLCUpgrader(parsedData);
							}

							common.checkCookie();
							if (window.location.protocol === "http:" && typeof $.cookie('rvcheck') !== "undefined") {
								$.removeCookie('rvcheck', {
									path: '/',
									domain: getDomainName(location.host)
								});
							}
						}
					});
				}
				return false;
			} else {
				common.checkCookie();

			}
		},

		getDomainName = function(hostName) {
			return hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);
		},

		_removeTimeoutCookie = function() {

			var cookiesToRemove = ["swse_cart",
				"carqty",
				"carorder"
			];

			$(document.cookie.split(/; */)).each(function(index, el) {
				var cookie = el.split('=');
				var name = cookie[0];
				var value = cookie[1];

				if (name.match(/^CR.*$/) !== null) {
					cookiesToRemove.push(name);
				}
			});

			if (cartier.common.isLoggedIn()) {
				$.removeCookie('RCHMFrontEndCookie', {
					path: '/',
					domain: getDomainName(location.host)
				});
			}

			$(cookiesToRemove).each(function(index, el) {
				$.removeCookie(el, {
					path: '/',
					domain: getDomainName(location.host)
				});
			});

			$.jStorage.deleteKey('swsecartlc');
		};
	/*
					@private method : To display Popup Box for Website Redirect on selecting country of residence
					@param : redirectUrl will be the Url on which the site will be redirected when OK button is clicked on confirm Popup 
				*/
	common.JsonLCUpgrader = function(xhrData) {

		//CRUD
		var dataobj = xhrData;

		if ($.jStorage.get("swsecartlc")) {

			var getdata = JSON.parse($.jStorage.get('swsecartlc'));

			for (var index = 0; index < dataobj.teaserArray.length; index++) {

				var operation = dataobj.teaserArray[index].operation;

				if (operation === 'ModifyCart') {
					//getdatateaseArray[index]=dataobj.teaseArray[index];
				} else if (operation === 'AddCart') {
					//getdata.teaseArray.push(dataobj.teaseArray[index]);
				} else if (operation === "DeleteCart") {
					dataobj.teaserArray.splice(index, 1);
				} else if (operation === "ReadCart") {

					var currentTeaserId = dataobj.teaserArray[index].teaserID;

					for (var i = 0; i < getdata.teaserArray.length; i++) {
						if (currentTeaserId === getdata.teaserArray[i].teaserID) {

							if (typeof getdata.teaserArray[i].engravingInformation !== "undefined")
								dataobj.teaserArray[index].engravingInformation = getdata.teaserArray[i].engravingInformation;

							if (typeof getdata.teaserArray[i].braceletInfo !== "undefined")
								dataobj.teaserArray[index].braceletInfo = getdata.teaserArray[i].braceletInfo;

							if (typeof getdata.teaserArray[i].giftCardInfo !== "undefined")
								dataobj.teaserArray[index].giftCardInfo = getdata.teaserArray[i].giftCardInfo;

						}
					}
				}
			}
		}

		var xhrstring = JSON.stringify(dataobj);

		$.jStorage.set('swsecartlc', xhrstring);

		return dataobj;
	};
	common.socialEmailAjaxCallBack = function(data) {


		if (typeof data === "object") {

			var loggedIn = cartier.common.isLoggedIn();
			var inputPath = $('input[name=registrationPath]'),
				regPagePath = inputPath.length > 0 ? inputPath.val() : "#";


			if (typeof(data.content.isSubmitSuccess) !== 'undefined' && data.content.isSubmitSuccess) {
				$('.error-div').remove();
				if (loggedIn) {
					$('body').confirmBox();
					$('body').data('plugin_confirmBox').popupInitialize({
							'title': _objPropertiesMsg.sendAFriendHeading,
							'message': _objPropertiesMsg.sendAFriendHeadingText,
							'buttons': {
								'ok': {
									'buttonName': _objPropertiesMsg.okButton,
									'href': '#',
									'class': 'cta-button cta-button__inner cta--red'

								}
							},

						},
						$('body').data('plugin_confirmBox').confirmHide

					);

				} else {
					$('body').confirmBox();
					$('body').data('plugin_confirmBox').popupInitialize({
							'title': _objPropertiesMsg.sendAFriendHeading,
							//'message': _objPropertiesMsg.contactAmbassadorPopupText,
							'buttons': {
								'ok': {
									'buttonName': _objPropertiesMsg.okButton,
									'href': '#',
									'class': 'cta-button cta-button__inner cta--red'

								}
							},
							'anchormessage1': _objPropertiesMsg.createAccount,
							'src1': regPagePath + '.html?Origin=Contact',
							'linkClasses': 'create-account-link'


						},
						$('body').data('plugin_confirmBox').confirmHide

					);
				}

				$($('#confirmButtons button')[0]).on('click', function() {
					location.href = '' + $(this).attr('href') + '';
				});

				$('.body-wrapper').data('plugin_analytics').productShareMail();
				$('.js-social-share').toggleClass('email-deployed');
				$('.js-social-share__email').parent('li').toggleClass('selected');


				$('.js-social-share__email').toggleClass('social-share__email-deployed');
				$('.js-social-share__email-form').toggle();

			} else {
				$('.error-div').remove();
				$('.overlay-form').prepend('<div class="error-div">' + data.errorMessage + '</div>');
				$('.error-div').ScrollTo({
					duration: 800,
					offsetTop: 140
				});
			}

		}


	},
	common.emailDisplayHandler = function() {

		_cache.$socialEmailWrapper.on('click', function(event) {
			event.preventDefault();
			$(this).ScrollTo({
				duration: 800,
				offsetTop: 140
			});
			/* Act on the event */
			$('.js-social-share').toggleClass('email-deployed');
			$(this).parent('li').toggleClass('selected');
			$(this).toggleClass('social-share__email-deployed');

			var formPath = $(this).attr('href');
			$(this).before('<div class="loaderDiv">' + '' + '</div>');
			$('.loaderDiv').addLoader();
			_dataLoad(formPath, _sendAEmailAjaxCallBack);
			_cache.$socialEmailForm.toggle();

		});


	};

	/*
        @public method : To check the validity 
        @param : none
    */
	common.getCardType = function(cc_no) {
		var card, card_type, card_types, accept, get_card_type,
			__indexOf = [].indexOf || function(item) {
				for (var i = 0, l = this.length; i < l; i++) {
					if (i in this && this[i] === item) return i;
				}
				return -1;
			};
		card_types = [{
			name: 'amex',
			pattern: /^3[47]/,
			valid_length: [15],
			cvv_length: 4
		}, {
			name: 'diners_club_international',
			pattern: /^(30[0-5]|3095|36|38|39)/,
			valid_length: [14],
			cvv_length: 3
		}, {
			name: 'jcb',
			pattern: /^35(2[89]|[3-8][0-9])/,
			valid_length: [16],
			cvv_length: 3
		}, {
			name: 'visa',
			pattern: /^4/,
			valid_length: [16],
			cvv_length: 3
		}, {
			name: 'mastercard',
			pattern: /^5[1-5]/,
			valid_length: [16],
			cvv_length: 3
		}, {
			name: 'discover',
			pattern: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
			valid_length: [16],
			cvv_length: 3
		}];
		accept = (function() {
			var _i, _len, _results;
			_results = [];
			for (_i = 0, _len = card_types.length; _i < _len; _i++) {
				card = card_types[_i];
				_results.push(card.name);
			}
			return _results;
		})();

		get_card_type = function(number) {
			var _j, _len1, _ref2;
			_ref2 = (function() {
				var _k, _len1, _ref2, _results;
				_results = [];
				for (_k = 0, _len1 = card_types.length; _k < _len1; _k++) {
					card = card_types[_k];
					if (_ref2 = card.name, __indexOf.call(accept, _ref2) >= 0) {
						_results.push(card);
					}
				}
				return _results;
			})();
			for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
				card_type = _ref2[_j];
				if (number.match(card_type.pattern)) {
					return card_type;
				}
			}
			return null;
		};

		return get_card_type(cc_no);

	};
	/*
        @public method : addApiScript For Adding some scripts on runtime
        @param : none
    */
	common.addApiScript = function(scriptSrc) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = scriptSrc;
		script.async = false;
		_cache.$headerObject.append(script);
	};


	/*
        @public method : addApiScript For Adding some scripts on runtime
        @param : none
    */
	common.addErrorDiv = function(targetDiv, msgTitle, msgDesc) {

		var _errorDiv;
		if (msgTitle) {
			_errorDiv = "<div class='error-div'><span class='bolder'>" + msgTitle + '</span>' + msgDesc + '</div>';
		} else {
			_errorDiv = "<div class='error-div'>" + msgDesc + "</div>";
		}

		targetDiv.after(_errorDiv);

	};

	/*
        @public method : _guestAccountAjaxCallHandler For Handling Ajax calls for NON_LOGGEDIN Users
        @param : none
    */
common._guestAccountAjaxCallHandler = function(action, clickedEl) {
         var clickedEl=clickedEl;
		
		if (clickedEl.closest("li.js-product-inbag")) {
			var clickedEl = clickedEl;
			var pathWishlist = clickedEl.closest("li.js-product-inbag").find("#wishlist_varient_refrence").val();
			var currentPage = window.location.pathname + window.location.search;
			var teaserId = clickedEl.closest("li.js-product-inbag").find(".teaserId").val();
			var refId = clickedEl.closest("li.js-product-inbag").data('refid');
			var pdp_pagepath = clickedEl.closest("li.js-product-inbag").data('pdppagepath');
			var isProductUnavailable = clickedEl.closest("li.js-product-inbag").data('avaliablity');

		} else {

			var pathWishlist = $('#wishlist_varient_refrence').val();
			var isProductUnavailable = false;
			var pdp_pagepath = $('#pagePath').val();
			if (pathWishlist === undefined)
				pathWishlist = '';
			var teaserId = "";
			var refId = "";
			var pdp_pagepath = "";
			var currentPage = "";
		}



		if (teaserId === undefined || teaserId === "undefined" || teaserId === "")
			teaserId = "";
		if (pathWishlist === undefined)
			pathWishlist = '';
		if (refId === undefined)
			refId = '';
		if (pdp_pagepath === undefined)
			pdp_pagepath = '';

		var objXHR = cartier.ajaxWrapper.getXhrObj({
			type: 'POST',
			data: {
				'action': action,
				'wishlist_pagepath': _cache.$wishlistPagepath.val(),
				'pagepath': _cache.$pagePath.val(),
				'fn_teaserid': teaserId,
				'wishlist_varient_refrence': pathWishlist,
				'isProductUnavailable': isProductUnavailable,
				'pdp_pagepath': pdp_pagepath,
				'refId': refId,
				'currentPage': currentPage
			},
			url: _objPropertiesPth.saveWishlist,
			dataType: 'json',
			contentType: 'application/x-www-form-urlencoded',

		});


		if (objXHR) {
			objXHR.done(function(productData) {
				// handle failure
				if (typeof productData.success !== 'undefined' && !productData.success) {
					// handle redirectURL exist if the session expires
					// data.redirectURL ?  window.location.href = data.redirectURL : $form.find('.server_message').html(data.errorMessage);
				} else {

					var parsedData = cartier.common.cartierJSONparser({
						json: productData,
					});

					if (parsedData !== false) {

						$('body').confirmBox();
						$('body').data('plugin_confirmBox').popupInitialize({
								'title': _objPropertiesMsg.wishlistcopytoWishlist,
								'anchormessage': _objPropertiesMsg.wishlistParagraph,
								'src': $('.js-wishlist_link_nonSecure').val() + ".html",
								'buttons': {
									'ok': {
										'buttonName': _objPropertiesMsg.okButton,
										'class': 'cta-button cta-button__inner cta--red',
										'action': function() {
											//location.reload();
										}
									},
								}
							},
							$('body').data('plugin_confirmBox').confirmHide
						);
					}
				}
			});
		}
	};

	/*
        @public method : wish list
        @param : none
    */
	common.addSelectionToWishlist = function(action, callback, title, message, clickedEl) {
         var clickedEl=clickedEl;
		if (clickedEl.closest("li.js-product-inbag")) {
			var clickedEl = clickedEl;
			var pathWishlist = clickedEl.closest("li.js-product-inbag").find("#wishlist_varient_refrence").val();
			var currentPage = window.location.pathname + window.location.search;
			var teaserId = clickedEl.closest("li.js-product-inbag").find(".teaserId").val();
			var refId = clickedEl.closest("li.js-product-inbag").data('refid');
			var pdp_pagepath = clickedEl.closest("li.js-product-inbag").data('pdppagepath');
			var isProductUnavailable = clickedEl.closest("li.js-product-inbag").data('avaliablity');

		} else {

			var pathWishlist = $('#wishlist_varient_refrence').val();
			var isProductUnavailable = false;
			var pdp_pagepath = $('#pagePath').val();
			if (pathWishlist === undefined)
				pathWishlist = '';
			var teaserId = "";
			var refId = "";
			var pdp_pagepath = "";
			var currentPage = "";
		}



		if (teaserId === undefined || teaserId === "undefined" || teaserId === "")
			teaserId = "";
		if (pathWishlist === undefined)
			pathWishlist = '';
		if (refId === undefined)
			refId = '';
		if (pdp_pagepath === undefined)
			pdp_pagepath = '';


		var _validationFunction = function(jqXHR) {
			if (action === "createPDPwishlist" && $('.createwishlistform') !== undefined && $('.createwishlistform').length !== 0 && !$('.createwishlistform').valid()) {
				jqXHR.abort();
			}
		};

		var objXHR = cartier.ajaxWrapper.getXhrObj({
			type: 'POST',
			data: {
				'action': action,
				'wishlist_pagepath': $('.js-wishlist_pagepath').val(),
				'pagepath': $('.js-pagepath').val(),
				'productId': $('.js-pagepath').val(),
				'wishlistnumber': $('.js-select-addtomywishlist option:selected').data('wishlistno'),
				'wishlist-field': $('.js-select-addtomywishlist option:selected').val(),
				'fn_newwishlistname': $('.js-newwishlistname').val(),
				'fn_teaserid': teaserId,
				'wishlist_varient_refrence': pathWishlist,
				'is': true,
				'isProductUnavailable': isProductUnavailable,
				'pdp_pagepath': pdp_pagepath,
				'refId': refId,
				'currentPage': currentPage

			},
			url: _objPropertiesPth.saveWishlist,
			beforeSend: function(jqXHR) {
				_validationFunction(jqXHR);
			},
			dataType: 'json',
			contentType: 'application/x-www-form-urlencoded',
		});


		if (objXHR) {
			objXHR.done(function(productData) {
				// handle failure
				if (typeof productData.success !== 'undefined' && !productData.success) {
					// handle redirectURL exist if the session expires
					// data.redirectURL ?  window.location.href = data.redirectURL : $form.find('.server_message').html(data.errorMessage);
				} else {

					var parsedData = cartier.common.cartierJSONparser({
						json: productData,
					});

					if (parsedData !== false) {
						callback(parsedData, title, message, clickedEl);
					}
				}
			});
		}
	};

	common.checkCookie = function() {


		var qtyString = $.jStorage.get('swsecartlc');

		if (typeof qtyString === "undefined" || qtyString === "" || qtyString === null || typeof $.cookie('swse_cart') === "undefined") {
			qtyString = "{}";
			cartCookie = 0;
		} else {
			var cartCookie = JSON.parse(qtyString).noOfProducts;
		}

		if (cartCookie === undefined || cartCookie === '' || cartCookie === '0' || cartCookie === 0 || typeof cartCookie === "undefined") {
			$('.js-cart-update').addClass('display-none');
		} else {
			$('.js-cart-update').removeClass('display-none');
			_cache.$cartUpdate.find('span').html(cartCookie);
		}


		$('.js-cart-update').closest('a').off('click').on('click', function(e) {
			e.preventDefault();
			if (cartCookie === undefined || cartCookie === '' || cartCookie === '0' || cartCookie === 0 || typeof cartCookie === "undefined") {
				$('.toggleMenu').trigger('click');
			} else {
				var url = $(this).attr('href');
				location.href = url;
			}
		});
	};

	/*
          @public method : remove duplicate element in array
          @param : none 
    */
	Array.prototype.removeDuplicates = function() {
		var temp = new Array();
		this.sort();
		for (var i = 0; i < this.length; i++) {
			if (this[i] === this[i + 1]) {
				continue;
			}
			temp[temp.length] = this[i];
		}

		return temp;
	};


	/*
        @public method : To initialize common.js
        @param : none
    */

	common.isLoggedIn = function() {
		var loggedIn = $.cookie('RCHMFrontEndCookie');
		if (typeof loggedIn === 'undefined') {
			return false;
		} else {
			return true;
		}
	},

	common.removeRadioClass = function() {
		$('.radio-wrapper').find('label').removeClass('radio');
	},

	common.createToggleButton = function() {
		$('.mobile-create-btn').click(function() {
			$('.js-reg-step-1').toggle();
			if (!$('.error_message_js-reg-step-1').is(':empty') && $('.js-reg-step-1').is(':visible')) {
				$('.error_message_js-reg-step-1').show();
			} else {
				$('.error_message_js-reg-step-1').hide();
			}
		});
	},

	common.redirection = function() {
		// check the cookie exists and mode is publish
		if ($('.redirection').length > 0 && $.cookie('redirection-status') !== undefined && mode === "publish") {
			$('.redirection').css('display', 'block');
			$('.top-nav').css('position', 'static');
			$('.main-container').css('margin-top', '0px');

			setTimeout(function() {
				$.removeCookie("redirection-status");
				$('.redirection').slideUp();
				$('.main-container').css('margin-top', '92px');
				$('.top-nav').css({
					'position': "fixed"
				});

			}, 20000);

		}

		$('.redirection').find('.js-redirection-close').on('click', function() {
			$.removeCookie("redirection-status");
			$('.redirection').slideUp();
			setTimeout(function() {
				$('.main-container').css('margin-top', '92px');
				$('.top-nav').css({
					'position': "fixed"
				});
			}, 500);

		});

	},
	common.radioCheckedClass = function() {

		$('input[name="piform_owncreationcheck"][value="No"] , input[name="piform_owncreationcheck"][value="no"]').closest('.piform_owncreationcheck').addClass('slide-button');

		$('.js-reg-step-2.cq-colctrl-lt0-c0,.piform_owncreationcheck ').find('input[name="piform_owncreationcheck"]:radio').on('change click', function() {

			if ($('input[value="yes"]').is(':checked')) {
				$('input[value="yes"]').closest('.radio-wrapper').addClass('slide-button');
				$('input[value="no"] , input[value="No"]').closest('.radio-wrapper').removeClass('slide-button');
			} else {
				$('input[value="no"] , input[value="No"]').closest('.radio-wrapper').addClass('slide-button');
				$('input[value="yes"]').closest('.radio-wrapper').removeClass('slide-button');
			}

		});

	},

	common.myaddressTab = function() {

		$('.js-first-radio').find('#homeaddress').attr('checked', true);
		$('.js-first-radio').find('span').addClass('checked');
		$('.addressform_address12').addClass('display-none');
		$("input[name='addressform_address2']").removeClass('error').rules('add', 'required');
		$("input[name='addressform_address5']").removeClass('error').rules('add', 'required');
		//$("input[name='addressform_address6']").removeClass('error').rules('add', 'required');

		$('.js-form-address-selector').find('.js-first-radio').on('click', function() {
			$('.addressform_address12').addClass('display-none');
			$('.addressform_address2').removeClass('display-none');
			$('.addressform_address5').removeClass('display-none');
			$('.addressform_address6').removeClass('display-none');
			$("input[name='addressform_address12']").removeClass('error').rules('remove', 'required');
			$("input[name='addressform_address2']").removeClass('error').rules('add', 'required');
			$("input[name='addressform_address5']").removeClass('error').rules('add', 'required');
			//$("input[name='addressform_address6']").removeClass('error').rules('add', 'required');
			$("input[name='addressform_address12']").siblings('.errormessage').find('label').hide();
			$('.addressform_address12').find('input#addressform_address12').prop('disabled', true);
			$.uniform.update();
		});

		$('.js-form-address-selector').find('.js-second-radio').on('click', function() {
			$('.addressform_address2').find('input#addressform_address2').prop('disabled', true);
			$('.addressform_address5').find('input#addressform_address5').prop('disabled', true);
			$('.addressform_address6').find('input#addressform_address6').prop('disabled', true);
			$('.addressform_address2').addClass('display-none');
			$('.addressform_address5').addClass('display-none');
			$('.addressform_address6').addClass('display-none');
			$('.addressform_address12').removeClass('display-none');
			$("input[name='addressform_address12']").removeClass('error').rules('add', 'required');
			$("input[name='addressform_address2']").siblings('.errormessage').find('label').hide();
			$("input[name='addressform_address5']").siblings('.errormessage').find('label').hide();
			//$("input[name='addressform_address6']").siblings('.errormessage').find('label').hide();
			$('.addressform_address12').find('input#addressform_address12').prop('disabled', false);
			$.uniform.update();
		})

	},

	common.regstep3Tab = function() {
		$('.js-first-radio').find('#homeaddress').attr('checked', true);
		$('.js-first-radio').find('span').addClass('checked');
		$('.fn_pobox').addClass('display-none');

		$('.js-form-address-selector').find('.js-first-radio').on('click', function() {
			$('.fn_pobox').addClass('display-none');
			$('.fn_pobox').find('input#addressform_address12').prop('disabled', true);
			$('.fn_strnum').find('input#addressform_address2').prop('disabled', false);
			$('.fn_strname').find('input#addressform_address5').prop('disabled', false);
			$('.fn_addrinfo').find('input#addressform_address6').prop('disabled', false);
			$('.fn_strnum').removeClass('display-none');
			$('.fn_strname').removeClass('display-none');
			$('.fn_addrinfo').removeClass('display-none');
		});

		$('.js-form-address-selector').find('.js-second-radio').on('click', function() {
			$('.fn_pobox').find('input#addressform_address12').prop('disabled', false);
			$('.fn_strnum').find('input#addressform_address2').prop('disabled', true);
			$('.fn_strname').find('input#addressform_address5').prop('disabled', true);
			$('.fn_addrinfo').find('input#addressform_address6').prop('disabled', true);
			$('.fn_strnum').addClass('display-none');
			$('.fn_strname').addClass('display-none');
			$('.fn_addrinfo').addClass('display-none');
			$('.fn_pobox').removeClass('display-none');
		})

	},


	common.errorMessageForReg1 = function() {
		var headingHeight = $('.heading-wrapper').eq(0).outerHeight(),
			totalHeight = headingHeight + 50;
		$('.error_message_js-reg-step-1').css('top', totalHeight);
	};

	common.removeItemOnLogout = function() {
		localStorage.removeItem('formGender');
		localStorage.removeItem('formCountry');
		localStorage.removeItem('formCity');
		localStorage.removeItem('formYear');
	};

	common.remove_tags = function(html) {
		if (typeof html !== 'undefined') {
			return html.replace(/<(?:.|\n)*?>/gm, '');
		}
	};

	common.toTitleCase = function(input) {
		if (typeof input !== 'undefined') {
			return (input || '').toLowerCase().replace(/(\b|-)\w/g, function(m) {
				return m.toUpperCase().replace(/-/, '');
			});
		}
		return null;
	};

	common.getCountryName = function(countryCode) {
		if (typeof countryCode !== 'undefined' && typeof countryCode === 'string') {
			var str = countryCode.toLowerCase();
			switch (str) {
				case 'us':
					countryCode = 'United States';
					break;
				case 'uk':
					countryCode = 'United Kingdom';
					break;
				case 'fr':
					countryCode = 'France';
					break;
				case 'jp':
					countryCode = 'Japan';
					break;
			}
		}
		return countryCode;
	};


	common.init = function() {
		_objPropertiesPth = cartier.properties.paths;
		_objPropertiesMsg = cartier.properties.messages;

		if (window.isSessionTimeout) {
			_removeTimeoutCookie();
		}
		RICHEMONT.AjaxCaller.listOfCallbackFun.CartierEmailToFriendAction = common.socialEmailAjaxCallBack;


		_referralUrlSetter();
		_bindFunction();
		// caching the jquery objects
		_cacheObjects();

		//implentation going here
		_extendJQuery();

		_urlCheckerAndAjax();

		_reloadWindowForStock();

		_deviceFix();
		common.removeRadioClass();

		if ($.browser.platform === 'iphone')
			_bindFunctionForiphone();

		_deviceAndBrowserFix();
		common.isLoggedIn();

		if (!($.browser.platform === "win" || $.browser.platform === "mac" || $.browser.platform === "linux")) {
			_zoomFixesForPhone();
		}

		if ($('.country-switcher').length > 0) {
			$('.js-backtotext').html(window.referrerTitle).closest('a').attr('href', window.referrerUrl);
		}

		_disablePasteOnFields();
		common.createToggleButton();
		common.redirection();
		common.radioCheckedClass();
		_passShowButton();

		if ($('#js-login-form').length) {

			$('.cq-colctrl-lt0').addClass('cq-colctrl-lt0-forlogin');
			common.errorMessageForReg1();
		}

		if (($('.js-address-form').length || $('.js-address-form-jp').length) && cartier.countryHandler.isUS) {
			common.myaddressTab();
		}

		if (($('.js-reg-step-3').length || $('.js-jp-reg-step-3').length) && cartier.countryHandler.isUS) {
			common.regstep3Tab();
		}

		if ($('.js-browser-back').length) {
			$('.js-browser-back').on('click', function(e) {
				e.preventDefault();
				window.history.back();
			});
		}

		$('a.disabled').removeClass('disabled');
		_errorFieldHighlighter();



		if ($('.js-lsdata-getter').length && $.jStorage.get('swsecartlc') !== null) {
			$('.js-lsdata-getter').val($.jStorage.get('swsecartlc'));
		}

		if ($('.js-payment-interm-form').length) {
			$('.js-payment-interm-form').submit();
		}
	};

}(window, jQuery, window.cartier.common, window.cartier, window.console));