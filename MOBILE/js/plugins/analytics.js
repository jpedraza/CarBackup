/*!
 * google.analytics.js
 * This file contains a plugin to handle google analytics that generate the several events for tracking.
 *
 * @project   cartier mobile
 * @date      2014-01-21
 * @author    SapientNitro
 * @licensor  cartier mobile
 * @site      cartier mobile
@NOTE   Google Tag Manager functions best when deployed alongside a data layer.
A data layer is an object that contains all of the information that you want to pass
to Google Tag Manager. Information such as events or variables can be passed to Google
Tag Manager via the data layer, and rules can be set up in Google Tag Manager based
on the values of variables (e.g. fire a remarketing tag when purchase_total > $100)
or based on the specific events. Variable values can also be passed through to other
tags (e.g. pass purchase_total into the value field of a tag).
 */

(function($, window, document, undefined) {
	'use strict';
	// @undefined is used here as the undefined global
	// variable in ECMAScript 3 and is mutable (i.e. it can
	// be changed by someone else). undefined isn't really
	// being passed in so we can ensure that its value is
	// truly undefined. In ES5, undefined can no longer be
	// modified.

	// @window and document are passed through as local
	// variables rather than as globals, because this (slightly)
	// quickens the resolution process and can be more
	// efficiently minified (especially when both are
	// regularly referenced in your plugin).

	// Create the defaults once
	var pluginName = 'analytics',

		defaults = {
			propertyName: "value"
		},

		_strClassNames = {
			active: 'active'
		},

		_cache;

	// The actual plugin constructor
	function Plugin(element, options) {
		this.element = element;
		// jQuery has an extend method that merges the
		// contents of two or more objects, storing the
		// result in the first object. The first object
		// is generally empty because we don't want to alter
		// the default options for future instances of the plugin
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
		this.shoppingBagGAEvents();
		this.storelocatorGAEvents();
		this.wishlistGA();
	};
	/*
    @private method : caching jquery objects
    @param : none
     */
	var _cacheObjects = function() {
		_cache = {
			$wrapper: $(".main-container"),
			$billing: $(".billing-page"),
			$footer: $("footer")

		};
	};

	var onPageLoad = true;
	var dataSlideIndexPrevious = 0;
	var dataSlideIndexCurrent = 0;

	var _autoSliderChecker = function(pageType) {

		dataSlideIndexCurrent = $('.bx-pager-item .active').attr('data-slide-index');

		if ((dataSlideIndexCurrent != dataSlideIndexPrevious) && onPageLoad) {
			dataSlideIndexPrevious = dataSlideIndexCurrent;
			dataLayer.push({
				event: pageType + "SlideAuto"
			});
		}
		if (onPageLoad) {
			setTimeout(function() {
				_autoSliderChecker(pageType);
			}, 2000);
		}

	};


	/*@Private  method   :   bind all events
    @param            :   none
     */
	var _bindEvents = function() {

		// Right Header Links events
		$('.top-nav_main-nav__list a').on('click', function(event) { //// Working fine
			event.preventDefault();

			var iconName = $(this).attr("data-gtm");
			//console.log("top nav clicked");

			if (typeof iconName === 'undefined') {
				iconName = "";
			}

			_destinationPagePusher({
				event: iconName
			});

			var qtyString = $.jStorage.get('swsecartlc');


			if (typeof qtyString === "undefined" || qtyString === "" || qtyString === null || typeof $.cookie('swse_cart') === "undefined") {
				qtyString = "{}";
				var cartCookie = 0;
			} else {
				var cartCookie = JSON.parse(qtyString).noOfProducts;
			}

			if ($(this).find('.js-cart-update').length > 0 && (cartCookie === '0' || cartCookie === undefined || cartCookie === 0 || typeof cartCookie === "undefined")) {
				// Do nothing
			} else {
				window.setTimeout(function() {
					window.location.href = event.currentTarget.href;
				}, 500);
			}

		});

		// Footer Social Links events
		$('.footer__social a').on('click', function() { //// working fine || To check
			var socialNetwork = $(this).attr("data-gtm");
			if (socialNetwork == undefined)
				socialNetwork = "mail";
			dataLayer.push({
				event: "social",
				"socialNetwork": socialNetwork,
				"socialAction": "Share"
			});
		});

		// Call Number events
		$('.footer__menu li').on('click', function() { //// Working fine || To check		
			if ($(this).find('.telephone_number').length > 0) {
				var contactNumberClicked = $(this).attr("data-gtm");
				dataLayer.push({
					event: "footerContactNb",
					"contactNumberClicked": contactNumberClicked
				});
			}
		});

		// Go to Desktop events
		$('.footer__menu a').on('click', function() { //// Working fine
			if (!$(this).attr("data-gtm") == "") {
				var iconName = $(this).attr("data-gtm");
				dataLayer.push({
					event: iconName
				});
			}
		});


		$('.js-show-all').on('click', function() {
			dataLayer.push({
				event: "productListShowAll"
			})
		});

		/*		// error Page events  || Datalayer moved to the JSP
		if (_cache.$wrapper.hasClass("js-ga-search-error") && _cache.$wrapper.find('.error-page').length > 0) { //// Working fine
			dataLayer = [{ //// Working fine
				"404": "true"
			}];
		}
*/


		if ($('.js-ga-condition-of-sales').length > 0) {
			$('.js-accordion_node__title').on('click', function(event) { //// Working fine
				if ($(this).hasClass('active')) {
					dataLayer.push({
						event: "conditionSubMenu",
						"conditionSaleSubMenu": $(this).find('.faq-view_node_title__ques p').text().split('.')[1].replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ')
					});
				}
			});
		}

		// Home Page events
		if (_cache.$wrapper.hasClass("js-ga-homepage-navigation")) {

			_autoSliderChecker('home');

			$('.bx-prev').on('click', function() { //// Working fine
				onPageLoad = false;
				dataLayer.push({
					event: "homeSlidePrevious"
				});
			});
			$('.bx-next').on('click', function() { //// Working fine
				onPageLoad = false;
				dataLayer.push({
					event: "homeSlideNext"
				});
			});

			$('.carousel').on('click', '.bx-pager', function(e) {
				onPageLoad = false;
				if ($(e.target).hasClass('active')) {
					dataLayer.push({
						event: "homeSlideDot"
					});
				}
			});

			$('.js-slider li a, .js-slider li .js-video').on('click', function() { //// Working fine
				onPageLoad = false;
				var slideClicked = $(this).closest('li').find('img.image').attr('alt');
				var slidePosition = "" + (($(this).closest('li').index()) + 1);

				dataLayer.push({
					event: "homeSlideClick",
					"slideClicked": slideClicked,
					"slidePosition": slidePosition
				});

				_destinationPagePusher({
					event: "homeSlideClick",
					"slideClicked": slideClicked,
					"slidePosition": slidePosition
				});
			});

			$('.services__block a').on('click', function() { //// Working fine
				var boxClicked = $(this).attr("data-gtm");

				boxClicked = cartier.common.remove_tags(boxClicked);

				if (typeof boxClicked !== 'undefined') {
					boxClicked = boxClicked.replace(/^\s+|\s+$/g, '');
					boxClicked = boxClicked.trim();
				}

				_destinationPagePusher({
					event: "homeBoxClicked",
					"boxClicked": boxClicked
				});
			});
		}


		// Contact Us Page events
		if (_cache.$wrapper.find(".js-ga-contact-us").length > 0) {
			// Select Country events
			$('select.js-country').on('change', function() { //// Working fine
				var countrySelected = $(this).find("option:selected").html().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');

				countrySelected = cartier.common.toTitleCase(countrySelected);

				dataLayer.push({
					event: "contactCountrySelect",
					"countrySelected": countrySelected
				});
			});
			// Call Number events
			$('.contact__service-cont__number').on('click', function() { //// working fine || To check
				var contactNumberClicked = $(this).attr("data-gtm");
				dataLayer.push({
					event: "contactContactNb",
					"contactNumberClicked": contactNumberClicked
				});
			});
			// Find a boutique events
			$('.contact_push-block .cta--red').on('click', function() { //// Working fine
				_destinationPagePusher({
					event: "contactFindBoutique"
				});
			});
		}



		// Product list Page events
		if (_cache.$wrapper.hasClass("js-ga-product-list") && !_cache.$wrapper.hasClass('js-ga-search-error')) {

			// Show all products events
			$('.slide_switch label:eq(0)').on('click', function() { //// Working fine || To check
				dataLayer.push({
					event: "productListShowAll"
				});
			});

			// refine selection events
			$('.js-accordion_node__title.product-filter_node__title').on('click', function() { //// Working fine || To check
				dataLayer.push({
					event: "productListRefine"
				});
			});

			// product List Refine SubMenu events
			$('.filter_detail_node_title__ques').closest('.js-accordion_node__title').on('click', function() { //// Working fine || To check
				var refineSubMenu = $(this).find('.filter_detail_node_title__ques').attr("data-gtm");
				dataLayer.push({
					event: "productListRefineSubMenu",
					"refineSubMenu": refineSubMenu
				});
			});


			//gift Listing More event
			$('.js-view-button').on('click', function() { //// Working fine || To check
				dataLayer.push({
					event: "giftListingtMore"
				});
			});
			// product List Apply Filters events
			$('.product-filter__wrapper .cta-button.cta--red').on('click', function() { //// Working fine || To check
				Array.prototype.insert = function(index, item) {
					this.splice(index, 0, item);
				};
				var filtersSelected = [];
				$('.product-filter__wrapper :checkbox:checked').each(function() {
					filtersSelected.push($(this).closest('.js-accordion__node').find('.filter_detail_node_title__ques p').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' '));
					filtersSelected.push($(this).closest('label').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' '));
				});
				var uniquieFiltersSelected = [];
				$.each(filtersSelected, function(i, el) {
					if ($.inArray(el, uniquieFiltersSelected) === -1)
						uniquieFiltersSelected.push(el);
				});
				if ($('.price-wrapper').length > 0) {
					uniquieFiltersSelected.push("dummy");
					uniquieFiltersSelected.push("price");
					uniquieFiltersSelected.push($('.price-wrapper li:eq(0) select option:selected').html());
					uniquieFiltersSelected.push($('.price-wrapper li:eq(1) select option:selected').html());
				}
				var rootNodes = [];
				$('.filter_detail_node_title__ques p').each(function() {
					rootNodes.push($(this).html());
				});

				$.each(rootNodes, function(index, el) {
					if ($.inArray(el, uniquieFiltersSelected) !== -1) {
						uniquieFiltersSelected.insert($.inArray(el, uniquieFiltersSelected), 'dummy');
					}
				});
				uniquieFiltersSelected.splice(0, 1);
				var pushString = uniquieFiltersSelected.toString().replace(/[\,]/gi, '_').replace(/_dummy_/gi, '-').replace(/dummy_/gi, '').replace(/dummy/gi, '');
				dataLayer.push({
					event: "productListApplyFilters",
					"filtersSelected": pushString
				});
			});
		}

		// Product detail Page events
		if (_cache.$wrapper.hasClass("js-ga-product-page")) {

			// product Page View events
			dataLayer.push({ //// Working fine  || After changing the quotes on var files
				 
				event: "productPageView",
				"productLine": productLine,
				"productCollection": window.GAtextFix(productCollection),
				"sellable": sellable,
				"productId": productID,
				"productName": window.GAtextFix(productName)
			});

			//"product Slide Zoom" events

			/*$('.js-slider .image').on('click', function() { //// Working fine  || After adding productId to the var files
				dataLayer.push({
					event: "productSlideZoom"
				});
			});*/

			$('.zoom-icon').on('click', function() { //// Working fine  || After adding productId to the var files
				dataLayer.push({
					event: "productSlideZoom"
				});
			});

			// product Share events
			$('.social-share a').on('click', function() { //// Working fine
				var socialNetwork = $(this).attr("data-gtm");
				if (socialNetwork == undefined)
					socialNetwork = "mail";
				dataLayer.push({
					event: "social",
					"socialNetwork": socialNetwork,
					"socialAction": "Share"
				});
			});

			// product Slide Dot events In product.js

			// product Pres Slide Next events
			$('.rslides_nav.next').on('click', function() { //// Working fine
				dataLayer.push({
					event: "productPresSlideNext"
				});
			});
			// product Pres Slide Previous events
			$('.rslides_nav.prev').on('click', function() { //// Working fine
				dataLayer.push({
					event: "productPresSlidePrevious"
				});
			});
			// product 360 View events
			$('.degree360-icon').on('click', function() { //// Release two || Out of scope
				dataLayer.push({
					event: "product360View"
				});
			});


			// product Size Selection events
			setTimeout(function() {

				$('select.js-sizeselector').on('change', function() { //// Working fine
					var sizeSelected = $(this).find("option:selected").text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');
					dataLayer.push({
						event: "productSizeSelection",
						sizeSelected: sizeSelected
					});
				});

			}, 500);

			// product Page Sizing Guide events
			$('.attributes-sizing-guide a').on('click', function() { //// Release two || Out of scope
				dataLayer.push({
					event: "productPageSizingGuide",
					"productLine": productLine,
					"productCollection": window.GAtextFix(productCollection),
					"sellable": sellable,
					"productID": productID,
					"productName": window.GAtextFix(productName)
				});
			});

			// product 360 View events
			$('.top-nav_main-nav__list a').on('click', function() { //// Out of scope
				var iconName = $(this).attr("data-gtm");
				dataLayer.push({
					event: iconName
				});
			});

			// product Engraving and product Adjustment Request View events
			$('.js-accordion__node .js-gtmclass').on('click', function() { //// Working fine || To check
				var iconName = $(this).attr("data-gtm");
				if ($(this).hasClass('active')) {
					if (iconName === 'engraving') {
						dataLayer.push({
							event: "productEngraving"
						});
					} else if (iconName === 'bracelet') {
						dataLayer.push({
							event: "productAdjustmentRequest"
						});
					}
				}
			});

			// product Adjustment Validation View events
			$('.adjust-size input.js-confirm-button').on('click', function() { //// Working fine || To check
				var braceletWrist = $('.adjust-size .form-input').val();
				var braceletfit = $('.adjust-size .slide_switch').find("input:checked").attr('id').replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');
				dataLayer.push({
					event: "productAdjustmentValidation",
					"braceletWrist": braceletWrist,
					"braceletfit": braceletfit

				});
			});
			// product Add To Cart events
			/*			$('.ambassador-cont__action-button .js-addtoshopping').on('click', function() { //// Working fine
				dataLayer.push({
					event: "productAddToCart"
				});
			});*/
			// product Wishlist Add events
			$('.js-add-selection').on('click', function() { //// Working fine
				dataLayer.push({
					event: "productWishlistAdd"
				});
			});
			// product Information Request events
			$('.js-accordion__node.js-request-info .js-accordion_node__title').on('click', function() { //// Working fine
				dataLayer.push({
					event: "productInformationRequest"
				});
			});
			// product Contact Ambassador events
			$('.js-accordion__node.js-contact-ambas .js-accordion_node__title').on('click', function() { //// Working fine
				dataLayer.push({
					event: "productContactAmbassador"
				});
			});

			//product Suggestion event
			$('.js-productsuggestion-gtm').on('click', function() { //// Working fine || To check
				dataLayer.push({
					event: "productSug"
				});
			});
			//productContact Ambassador Field Selection event
			$('.suggestion-carousel a.next').on('click', function() { //// Invalid rule
				dataLayer.push({
					event: "productSugSlideNext"
				});
			});
			//productContact Ambassador Field Selection event
			$('.suggestion-carousel a.prev').on('click', function() { //// Invalid rule
				dataLayer.push({
					event: "productSugSlidePrev"
				});
			});

			// Contact number click 
			$('.ambassador-cont__action-button .phone-detail').on('click', function(event) {
				dataLayer.push({ //// Working fine || To check
					event: "productContactNb"
				});
			});

			$('.js-product-info.att-accordion .js-accordion_node__title.att-accordion_node__title').on('click', function(event) {
				dataLayer.push({
					event: "productSubMenu",
					"productSubMenuClicked": $(this).find('.att-accordion_node_title__ques').attr('data-gtm').replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ')
				});
			});

		}



		// Search page events
		if (_cache.$wrapper.hasClass("js-ga-search-error") && _cache.$wrapper.find('.search-result').length > 0) {

			/*dataLayer.push({ //// Working fine || To check
				"siteSearchTerm": siteSearchTerm,
				"siteSearchResults": siteSearchResults
			});*/

			// search All Selections events
			$('.slide_switch input').on('change', function() { //// Working fine || To check
				if ($(this).is(":checked")) { // check if the radio is checked
					var val = $(this).val(); // retrieve the value
					if (val == 'true') {
						_destinationPagePusher({
							event: "searchAllSelections",
							"siteSearchTerm": siteSearchTerm,
							"siteSearchResults": siteSearchResults
						});
					} else {

						_destinationPagePusher({
							event: "searchProductsSoldOnline",
							"siteSearchTerm": siteSearchTerm,
							"siteSearchResults": siteSearchResults
						});
					}
				}
			});

			// search List Refine SubMenu events
			$('.filter_detail_node_title__ques').closest('.js-accordion_node__title').on('click', function() {
				var refineSubMenu = $(this).find('.filter_detail_node_title__ques').attr("data-gtm"); //// Working fine || To check
				dataLayer.push({
					event: "productListRefineSubMenu",
					"refineSubMenu": refineSubMenu
				});
			});

			// search List Apply Filters events
			$('.product-filter__wrapper .cta-button.cta--red').on('click', function() { //// Working fine || To check
				Array.prototype.insert = function(index, item) {
					this.splice(index, 0, item);
				};
				var filtersSelected = [];
				$('.product-filter__wrapper :checkbox:checked').each(function() {
					filtersSelected.push($(this).closest('.js-accordion__node').find('.filter_detail_node_title__ques p').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' '));
					filtersSelected.push($(this).closest('label').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' '));
				});
				var uniquieFiltersSelected = [];
				$.each(filtersSelected, function(i, el) {
					if ($.inArray(el, uniquieFiltersSelected) === -1)
						uniquieFiltersSelected.push(el);
				});
				if ($('.price-wrapper').length > 0) {
					uniquieFiltersSelected.push("dummy");
					uniquieFiltersSelected.push("price");
					uniquieFiltersSelected.push($('.price-wrapper li:eq(0) select option:selected').html().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' '));
					uniquieFiltersSelected.push($('.price-wrapper li:eq(1) select option:selected').html().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' '));
				}
				var rootNodes = [];
				$('.filter_detail_node_title__ques p').each(function() {
					rootNodes.push($(this).html().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' '));
				});

				$.each(rootNodes, function(index, el) {
					if ($.inArray(el, uniquieFiltersSelected) !== -1) {
						uniquieFiltersSelected.insert($.inArray(el, uniquieFiltersSelected), 'dummy');
					}
				});
				uniquieFiltersSelected.splice(0, 1);
				var pushString = uniquieFiltersSelected.toString().replace(/[\,]/gi, '_').replace(/_dummy_/gi, '-').replace(/dummy_/gi, '').replace(/dummy/gi, '');
				_destinationPagePusher({
					event: "productListConfirmFilters",
					"filtersSelected": pushString
				})
			});

			// product List Apply Filters events
			$('.product-filter__node').children('.js-accordion_node__title').on('click', function() { //// Working fine || To check
				dataLayer.push({
					event: "productListApplyFilters",
					"siteSearchTerm": siteSearchTerm,
					"siteSearchResults": siteSearchResults
				});
			});
		}


		//Set For You By Cartier events
		$('.bridal-home__desc__link a').on('click', function() { //// Working fine || To check
			dataLayer.push({
				event: "sfyDiscoverApplication"
			});

		});


		//Exceptional Creations listing
		if (_cache.$wrapper.hasClass("js-ga-exception-page") || _cache.$wrapper.find('.js-ga-exception-page').length > 0) { //// Working fine || To check

			var globaldatafiller = function() {
				var updatedData = $('.rslides1_on').data();
				window.productLine = window.GAtextFix(updatedData.productline);
				window.productId = updatedData.productid;
				window.productCollection = window.GAtextFix(updatedData.productcollection);
				window.sellable = updatedData.sellable;
				window.productName = window.GAtextFix(updatedData.productname);
			};
			globaldatafiller();
			dataLayer.push({
				event: "exeptionalProductPageView",
				"productLine": window.GAtextFix(productLine),
				"productCollection": window.GAtextFix(productCollection),
				"sellable": sellable,
				"productId": productId,
				"productName": window.GAtextFix(productName)
			});
			// product Pres Slide Next events
			$('.rslides_nav.next').on('click', function() { // next not avialable					//// Working fine || To check
				globaldatafiller();
				dataLayer.push({
					event: "exeptionalProductPresSlideNext"
				});
			});
			// product Pres Slide Previous events
			$('.rslides_nav.prev').on('click', function() { // prev not avialable					//// Working fine || To check
				globaldatafiller();
				dataLayer.push({
					event: "exeptionalProductPresSlidePrevious"
				});
			});
			//"product Slide Zoom" events
			$('.zoom-icon').on('click', function() { //// Working fine || To check
				globaldatafiller();
				dataLayer.push({
					event: "exeptionalProductPresSlideZoom"
				});
			});
		}



		if (!$('.expert-collection-list__expert-listing').length > 0) { // Should Work
			// expertise Section Select events
			$('.expert-guide__select select').on('change', function() { // drop down not availble
				var sectionSelected = $(this).find("option:selected").val().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');

				sectionSelected = cartier.common.toTitleCase(sectionSelected);

				_destinationPagePusher({
					event: "expertiseSectionSelect",
					"sectionSelected": sectionSelected
				});
			});
		} else {

			$('.product-push').on('click', function() {
				var expertiseSubMenuClicked = $(this).find('.heading3').html().replace(/<br>/, '').replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');
				_destinationPagePusher({
					event: "expertiseSectionMenu",
					"expertiseSubMenuClicked": expertiseSubMenuClicked
				})
			});

			$('.expert-guide__select .form-select').on('change', function() {
				var sectionSelected = $(this).find("option:selected").val().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');

				sectionSelected = cartier.common.toTitleCase(sectionSelected);

				_destinationPagePusher({
					event: "expertiseGuideTheme",
					themeSelected: sectionSelected
				});
			});
		}

		//My Address events
		if (_cache.$wrapper.hasClass("js-ga-mycartier-addresses")) {
			//account Address Edit event
			$('.addressAction .button.marginR a.edit_add').on('click', function() { ///// Should work	
				dataLayer.push({
					event: "accountAddressEdit"
				});
			});
			//account Address Delete event
			$('.addressAction .button.marginR a.delete_add').on('click', function() { ///// Should work
				dataLayer.push({
					event: "accountAddressDelete"
				});
			});

			// boutique Search More events
			$('.cta-button').on('click', function() { //// working fine
				if ($(".noti-number-cont").length) {
					dataLayer.push({
						event: "accountNbValidate"
					});
				}
			});
			// account Address Field events
			setTimeout(function() {
				$('.js-address-form-jp input,.js-address-form-jp select,.js-address-form-jp textarea').on('click', function() { //// working fine
					var accountAddressField = nameResovler($(this).attr('name')); //.parent().children('label').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');
					dataLayer.push({
						event: "accountAddressField",
						"nameOfTheField": accountAddressField
					});
				});

				$('.js-address-form-jp input,.js-address-form-jp select,.js-address-form-jp textarea').on('blur', function() {

					if ($(this).closest('div').find('label.error').length && $(this).closest('div').find('label.error').css('display') !== 'none') {

						var errorVal = $(this).closest('div').find('label.error').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');

						if (typeof errorVal !== 'undefined' && (errorVal.toLowerCase().match('kanji') || errorVal.toLowerCase().match('katakana'))) {
							dataLayer.push({
								event: "accountCreationError",
								"accountCreationErrorMessage": errorVal
							});
						}
					}
				});

			}, 100);
		}

		//My subscription and interests

		if (_cache.$wrapper.hasClass("js-ga-mycartier-subscription-page")) {


			var onchange_newsletter = false;
			var onchange_catalogue = false;

			var chkfn_newsletter = $('.fn_newsletter input[type=checkbox][name="fn_newsletter"]').prop('checked');
			var chkfn_catalogue = $('.fn_catalogue input[type=checkbox][name="fn_catalogue"]').prop('checked');
			//console.log("chkfn_newsletter" + chkfn_newsletter);
			//console.log("chkfn_catalogue" + chkfn_catalogue);

			$('.button-wrapper input[type=submit]').click(function(e) { //// Should work

				if ($('.fn_newsletter input[type=checkbox][name="fn_newsletter"]').prop('checked') != chkfn_newsletter) {
					onchange_newsletter = true;
				}
				if ($('.fn_catalogue input[type=checkbox][name="fn_catalogue"]').prop('checked') != chkfn_catalogue) {
					onchange_catalogue = true;
				}

				chkfn_newsletter = $('.fn_newsletter input[type=checkbox][name="fn_newsletter"]').prop('checked');
				chkfn_catalogue = $('.fn_catalogue input[type=checkbox][name="fn_catalogue"]').prop('checked');

				if (onchange_newsletter) {

					if (chkfn_newsletter) {
						_destinationPagePusher({
							event: "accountSaveSuscribeNewsletter"
						});
					} else {
						_destinationPagePusher({
							event: "accountSaveWithUnsuscribeNewsletter"
						});

					}
				}

				if (onchange_catalogue) {

					if (chkfn_catalogue) {
						_destinationPagePusher({
							event: "accountSaveSuscribeOthers"
						});
					} else {
						_destinationPagePusher({
							event: "accountSaveWithUnsuscribeOthers"
						});
					}
				}
			});


			//  cartier Product Interest events
			$('.fn_grpinterdin input[type=checkbox][name="fn_grpinterdin"]').on('change', function() { //// Should work
				var productLineTicked;
				var ticked_val;
				if ($(this).is(":checked")) {
					ticked_val = productnNameResovler($(this).val());
					if (ticked_val === undefined)
						ticked_val = $(this).closest('.checkbox-wrapper').find('label').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');

					ticked_val = productnNameResovler($(this).val());

					dataLayer.push({
						event: "cartierProductInterest",
						"productLineTicked": ticked_val
					});
				}
			});

			$('.fn_grpinterdinacc input[type=checkbox][name="fn_grpinterdinacc"]').on('change', function() {
				var productLineTicked;
				var ticked_val;
				if ($(this).is(":checked")) {
					ticked_val = productnNameResovler($(this).val());
					if (ticked_val === undefined)
						ticked_val = $(this).closest('.checkbox-wrapper').find('label').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');

					ticked_val = productnNameResovler($(this).val());

					dataLayer.push({
						event: "cartierProductInterest",
						"productLineTicked": ticked_val
					});
				}
			});

		}



		//My personnel Information events
		if (_cache.$wrapper.hasClass("js-ga-mycartier-mypersonal-info")) {

			$('.js-personal-info-form input,.js-personal-info-form textarea,.mobile-device input').on('click', function() {

				if ($(this).attr('name') !== 'piform_owncreationcheck') {
					var nameOfTheField = nameResovler($(this).attr('name')); //.parent().children('label').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');
					dataLayer.push({
						event: "personalInfoField",
						"nameOfTheField": nameOfTheField
					});
				}
			});

			$('.js-personal-info-form select, .js-radiobox .piform_owncreationcheck input').on('change', function() {
				var nameOfTheField = nameResovler($(this).attr('name'));

				var selectValue = $(this).find("option:selected").text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');

				if (selectValue || $(this).attr('name') == 'piform_owncreationcheck') {
					dataLayer.push({
						event: "personalInfoField",
						"nameOfTheField": nameOfTheField
					});
				}
			});

			/*$('.owned-creations select').on('change', function() {
				var str;

				if ($(this).closest('.js-own-dropone'))
					str = "Product Line";
				else if ($(this).closest('.js-own-droptwo'))
					str = "Product category";
				else if ($(this).closest('.js-own-dropthree'))
					str = "Order location";

				dataLayer.push({
					event: "personalInfoField",
					"nameOfTheField": str
				});
			});/*

			//$('.button-wrapper input[type=submit]').on('click', function() {
			//var visitorYearOfBirth = $('.js-date-picker:eq(0) .js-year select').find("option:selected").text().replace(/[\↵ \ ]*/ //, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');
			//var visitorCountry = $('.form-select.country-selector_select').find("option:selected").text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');
			//var visitorGender = 'none';
			/*if ($('input[name=piform_genderTitle]:checked').val() !== null) {
					visitorGender = $('input[name=piform_genderTitle]:checked').val();
					if (visitorGender === '0001') {
						visitorGender = "M";
					} else {
						visitorGender = "F";
					}
				}

				_destinationPagePusher([{
						"visitorYearOfBirth": visitorYearOfBirth
					},{
						"visitorGender": visitorGender
					},{
						"visitorCountry": visitorCountry*/
			//}]);
			//});
		}


		// purchase funnel  - billing address events
		if (_cache.$billing.hasClass("js-ga-billing-address-page")) {

			$('.billing-header .back-icon a').attr('href', _shippingBackLinkModifier('origin=billing_address_back_link', $('.billing-header .back-icon a').attr('href')));

			//For all fields, when the user select a field
			$('.js-billing-section-one input,.js-billing-section-one select,.js-billing-section-one textarea').on('click', function() { //// Should work
				var nameOfTheField = nameResovler($(this).attr('name')); //.parent().children('label').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');
				if (nameOfTheField == undefined)
					nameOfTheField = "checkbox";
				dataLayer.push({
					event: "billingAddressField",
					"nameOfTheField": nameOfTheField
				});
			});
			//billing Address Edit events
			$('.js-edit-address').on('click', function() { //// Should work
				dataLayer.push({
					event: "billingAddressEdit"
				});
			});
			//billing Address Edit events
			$('.js-addnew-address').on('click', function() { //// Should work
				dataLayer.push({
					event: "billingAddressNew"
				});
			});

		}


		window.billingConfirmationGTM = function() {
			if (window.billingVirtualView) {
				dataLayer.push({
					event: "virtualPageview",
					"page": adaptive + "/" + uri + "/" + type + "/confirm_address/" + visitorStatus
				});
			}
		};


		if (_cache.$billing.hasClass("js-ga-purchase-funnel-shipping-page")) { //// Should work
			$('.billing-header .back-icon a').attr('href', _shippingBackLinkModifier('origin=shipping_back_link', $('.billing-header .back-icon a').attr('href')));

			/*dataLayer.push({
				"type": type,
				"page": uri + "/" + type + "/" + visitorStatus,

			});*/

			$('.radio-btn').unbind('click.GA').bind('click.GA', function() { // bind a function to the change event   		//// Should work

				if ($('#billing').is(":visible")) {
					var b = dataLayer[dataLayer.length - 1];
					var a = {
						event: "virtualPageview",
						"page": adaptive + "/" + uri + "/" + 'deliver_to_my_billing_address' + "/" + type + "/" + visitorStatus
					};
					if (JSON.stringify(a) !== JSON.stringify(b))
						dataLayer.push(a);

				} else if ($('#shipping').is(":visible")) {
					var b = dataLayer[dataLayer.length - 1];
					var a = {
						event: "virtualPageview",
						"page": adaptive + "/" + uri + "/" + 'to_another_address' + "/" + type + "/" + visitorStatus
					};
					if (JSON.stringify(a) !== JSON.stringify(b))
						dataLayer.push(a);
				} else if ($('#boutique').is(":visible")) {
					var b = dataLayer[dataLayer.length - 1];
					var a = {
						event: "virtualPageview",
						"page": adaptive + "/" + uri + "/" + 'boutique_pick_up' + "/" + type + "/" + visitorStatus
					};
					if (JSON.stringify(a) !== JSON.stringify(b))
						dataLayer.push(a);
				}
			});

			$('.js-billing-section-one input,.js-billing-section-one select,.js-billing-section-one textarea').on('click', function() { //// Should work
				var shippingField = nameResovler($(this).attr('name')); //.parent().children('label').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');
				dataLayer.push({
					event: "shippingField",
					"nameOfTheField": shippingField
				});
			});

			$('.edit-address').on('click', function() { //// Should work
				dataLayer.push({
					event: "shippingAddressEdit"
				});
			});

		}

		//Purchase funnel -review order page
		if (_cache.$wrapper.hasClass("js-ga-purchase-funnel-review-Order") || $('.js-ga-purchase-funnel-review-Order').length > 0) { //// Should work
			$('.billing-header .back-icon a').attr('href', _shippingBackLinkModifier('origin=review_order_back_link', $('.billing-header .back-icon a').attr('href')));

			/*dataLayer.push({
				"page": uri + "/" + type + "/" + visitorStatus,
			});*/

			/*dataLayer.push({
				"type": type
			});*/

			$('.product-info-accordion .js-accordion__node:eq(0) .edit-address').on('click', function(event) {
				dataLayer.push({
					event: "reviewBillingAddressEdit"
				});
			});

			$('.product-info-accordion .js-accordion__node:eq(1) .edit-address').on('click', function(event) {
				dataLayer.push({
					event: "reviewShippingAddressEdit"
				});
			});

			$('.product-info-accordion .js-accordion__node:eq(2) .edit-address').on('click', function(event) {
				dataLayer.push({
					event: "reviewDeliveryOptionEdit"
				});
			});
		}

		//Purchase funnel - payment & summary page
		if (_cache.$wrapper.hasClass("js-ga-purchase-funnel-payment-summary") || $('.js-ga-purchase-funnel-payment-summary').length > 0) { //// Should work

			/*dataLayer.push({
				"page": uri + "/" + type + "/" + visitorStatus + "/" + accountCreationStatus
			});

			dataLayer.push({
				"type": type
			});*/


			// virtual Page view events
			$('.billing-wrapper .radio-btn-li input').on('click', function() { // bind a function to the change Event 		//// Should work
				if ($(this).is(":checked")) { // check if the radio is checked
					var val = $(this).val(); // retrieve the value
					if (val === "card")
						val = 'credit_card';
					if (val === "bank")
						val = 'bank_transfer';
					if (val === "cash")
						val = 'cash_on_delivery';
					dataLayer.push({
						event: "virtualPageview",
						"page": adaptive + "/" + uri + "/" + val + "/" + type + "/" + visitorStatus
					});
				}
			});
		}

		/*
Moved to the JSP
*/

		/*		if ($('.order-reconfirm.js-billing').length > 0) { //// Should work
			var val = "confirm_purchase";
			dataLayer.push({
				"page": uri + "/" + val + "/" + type + "/" + visitorStatus
			});
		}
*/

		/*		if ($('.js-products-orderconfirm').length > 0) { //// Should work
			var dataObj = $('.js-products-orderconfirm').data();
			var forLength = $('.js-products-orderconfirm-li').length;
			var myarray = [];
			for (var i = 0; i < forLength; i++) {
				var dataObjProd = $('.js-products-orderconfirm-li:eq(' + i + ')').data();
				myarray.push({
					"id": dataObj.transactionid,
					"sku": dataObjProd.productid,
					"name": window.GAtextFix(dataObjProd.productname),
					"category": dataObjProd.productline + '-' + window.GAtextFix(dataObjProd.productcollection),
					"price": dataObjProd.price,
					"quantity": dataObjProd.quantity
				});
			}

			dataLayer.push({
				"transactionId": dataObj.transactionid,
				"transactionCurrency": dataObj.transactioncurrency,
				"transactionTotal": dataObj.transactiontotal,
				"transactionTax": dataObj.transactiontax,
				"transactionShipping": dataObj.transactionshipping,
				"transactionShippingMethod": dataObj.transactionshippingmethod,
				"transactionPaymentType": dataObj.transactionpaymenttype,
				"transactionProducts": myarray
			});
		}

*/

		if ($('#js-forgotpassword').length > 0) {
			dataLayer.push({ ///// Should work
				"page": adaptive + '/' + uri + "/" + "Pop-in_Forgot_your_password" + "/" + visitorStatus
			});
		}



		/*login Page events capturing*/

		if (_cache.$wrapper.hasClass("js-ga-login-page") || (_cache.$wrapper.find('.login').length > 0)) {


			/*$('input[name=fn_grptitle]').on('click', function() {

				var visitorGender = 'none';

				if ($('input[name=fn_grptitle]:checked').val() !== null) {
	        visitorGender = $('input[name=fn_grptitle]:checked').val();
	        if (visitorGender === '0001') {
	          visitorGender = "M"
	        } else {
	          visitorGender = "F";
	        }
	      }

	      $.jStorage.set('visitorGender', visitorGender);
			
			});*/

			/* setting up of variables on page loadup goes here */
			// Country selector
			/*			if ($('.login-box__desc').length != 0) {
				dataLayer.push({
					"message": "account_already_exists" //working fine
				});
			}*/

			// When the user clicks on the "Connection" CTA
			/*			$('.login-box__list button').on('click', function() { //working fine
				dataLayer.push({
					"user": "logged"
				});
			});*/

			// Country selector
			$('#fn_country').on('change', function() {
				var countrySelected = $(this).find("option:selected").html().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' '); //working fine

				countrySelected = cartier.common.toTitleCase(countrySelected);

				dataLayer.push({
					event: "servicesConnectionCountry",
					countrySelected: countrySelected
				});
			});


			//$('.login .country-selector_select').on('change', function() {
			//var sectionSelected = $(this).find("option:selected").text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' '); //working fine
			//	dataLayer.push({
			//	event: "alreadyRegisteredCountry",
			//countrySelected: sectionSelected
			//});
			//});



			/*Event binding is not done. Sign up page is loading from AJAX */

			// sign up form field fields capturing
			$('.js-reg-step-1 input,.js-jp-reg-step-1 input,.js-reg-step-1 select, .js-jp-reg-step-1 select,.js-reg-step-1 textarea ,.js-jp-reg-step-1 textarea').on('click', function() { //working fine

				if ($(this).attr('type') !== "submit") {
					dataLayer.push({
						event: "servicesConnectionField",
						nameOfTheField: nameResovler($(this).attr('name')) //.closest('div').find('.form-label').html().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ')
					});
				}
			});

			// signup form submit button click register
			$('.mobile-create-btn input').on('click', function() { //working fine
				dataLayer.push({
					event: "virtualPageview",
					"page": adaptive + '/' + uri + '/' + 'createAccount_step1'
				});
			});

		}

		/*Reg step2 page event capturing*/

		if (_cache.$wrapper.hasClass("js-ga-register-step-2-page")) {

			$('.interest-product-line .fn_grpinterdin input[type=checkbox][name="fn_grpinterdin"]').on('click', function() { ///// Should work
				var b = dataLayer[dataLayer.length - 1];
				var ticked_val = productnNameResovler($(this).val());
				if (ticked_val === undefined) {
					ticked_val = $(this).closest('.checkbox-wrapper').find('label').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');
				}

				ticked_val = productnNameResovler($(this).val());

				var a = {
					event: "servicesInterest",
					productLineTicked: ticked_val
				};

				if (JSON.stringify(a) !== JSON.stringify(b))
					dataLayer.push(a);
			});

			$('.interest-product-line .fn_grpinterdinacc input[type=checkbox][name="fn_grpinterdinacc"]').on('click', function() { ///// Should work
				var b = dataLayer[dataLayer.length - 1];
				var ticked_val = productnNameResovler($(this).val());
				if (ticked_val === undefined) {
					ticked_val = $(this).closest('.checkbox-wrapper').find('label').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');
				}

				ticked_val = productnNameResovler($(this).val());

				var a = {
					event: "servicesInterest",
					productLineTicked: ticked_val
				};

				if (JSON.stringify(a) !== JSON.stringify(b))
					dataLayer.push(a);
			});

			$('fieldset .form-element input').on('click', function() {
				var inputType = $(this).attr("type"),
					inputName = $(this).val();

				inputName = productnNameResovler(inputName);

				inputName = cartier.common.toTitleCase(inputName);

				if (inputType != "submit" && inputType != undefined && inputName != undefined) {
					dataLayer.push({
						event: "servicesAdditionalInformation1",
						'nameOfTheField': inputName
					});
				}
			});

			$('.js-reg-step-2 input[type=submit]').on('click', function() { ///// Should work
				/*				dataLayer.push({
					"step": "additionalInformations_step1"
				});
*/
			});


			//When the user clicks on "Skip This Step And Go Directly To My Cartier"
			/*$('.js-reg-step-2 .skip-this-step a').on('click', function() { ///// Should work
				$(this).attr('href', _shippingBackLinkModifier('origin=skipAdditionalInformations_step1', $(this).attr('href')));
			});*/
		}

		/*Reg step3 page event capturing*/
		if (_cache.$wrapper.hasClass("js-ga-register-step-3-page")) { ///// Should work

			$(".js-jp-reg-step-3 input,.js-jp-reg-step-3 textarea").on('click', function() { ///// Should work
				var name = nameResovler($(this).attr('name')); //.closest('div').find('label').html().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');
				dataLayer.push({
					event: "servicesAdditionalInformation2Field",
					nameOfTheField: name
				});
			});

			$('.js-jp-reg-step-3 select').on('change', function() {
				var name = nameResovler($(this).attr('name')); //.closest('div').find('label').html().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');
				dataLayer.push({
					event: "servicesAdditionalInformation2Field",
					nameOfTheField: name
				});
			});

			/*$('.js-jp-reg-step-3 .skip-this-step a').on('click', function() { ///// Should work
				$(this).attr('href', _shippingBackLinkModifier('origin=skipAdditionalInformations_step2', $(this).attr('href')));
			});*/

			$('#fn_country').on('change', function() {
				var countrySelected = $(this).find("option:selected").html().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' '); //working fine

				countrySelected = cartier.common.toTitleCase(countrySelected);

				dataLayer.push({
					event: "servicesAdditionalInformation2Country",
					countrySelected: countrySelected
				});
			});


			//$('.js-jp-reg-step-3 .button-wrapper input[type=submit]').on('click', function() {
			/*var visitorGender;
				
				dataLayer.push({ ///// Should work										
					visitorCity: $("input[name='fn_city']").val()
				});*/

			//dataLayer.push({ ///// Should work
			//visitorYearOfBirth: $('.js-date-picker:eq(0) .js-year select').find("option:selected").text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ')
			//});

			/*dataLayer.push({ ///// Should work
					'visitorGender': $.jStorage.get('visitorGender')
				});*/

			//});
		}

		/*Logged in page events capturing*/
		if (_cache.$wrapper.hasClass("js-ga-myaccount-page")) {
			/*			dataLayer.push({ ///// Should work
				"loggedIn": "true"
			});*/
			//log out button capturing
			$(".logout").on('click', function() { ///// Should work
				_destinationPagePusher({
					event: "cartierLogout"
				});
				cartier.common.removeItemOnLogout();
			});
			//My Account events
			$('.my-account__services .cta-button__inner').on('click', function() { ///// Should work
				dataLayer.push({
					event: "accountNbValidate"
				});
			});
		}

		window.slideTicker = function() {
			if (_cache.$wrapper.hasClass("js-ga-homepage-navigation")) { //  working fine
				dataLayer.push({
					event: "homeSlideAuto"
				});
			}
		};
	};

	Plugin.prototype.searchGArules = function(locationSearched) {
		dataLayer.push({
			event: "boutiqueSearch",
			"locationSearched": locationSearched
		});
	};


	Plugin.prototype.storelocatorGAEvents = function() {
		//Store locator homepage events
		if (_cache.$wrapper.hasClass("js-ga-store-geolocatore-page")) {
			// expertise Section Select events
			$('.js-geolocateButton').unbind('click.GA').bind('click.GA', function() { //  working fine
				dataLayer.push({
					event: "boutiqueGeolocateMe"
				});
			});
		}

		//Result listing page events
		if (_cache.$wrapper.hasClass("js-ga-store-geolocatore-page")) {
			// boutique Search More events
			$('.read-more').unbind('click.GA').bind('click.GA', function() { //// Working fine || To check
				var boutiqueName = $(this).attr("data-gtm");
				_destinationPagePusher({
					event: "boutiqueSearchMore",
					"boutiqueName": boutiqueName
				});

			});
			// boutique SearchNb Click events
			$('.boutique_details__con a').unbind('click.GA').bind('click.GA', function() { //// Working fine || To check
				var boutiqueName = $(this).attr("data-gtm");
				if (boutiqueName == undefined)
					boutiqueName = $(".boutique__title").children().text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');
				var eventName = "boutiqueSearchNbClick";
				if ($('.js-boutique-back-button').length > 0)
					eventName = "boutiqueDetailNbClick";
				dataLayer.push({
					event: eventName,
					"boutiqueName": boutiqueName
				});

			});
			// boutique Search Map events
			$('.show-map').unbind('click.GA').bind('click.GA', function() { //// Working fine || To check
				var boutiqueName = $(this).attr("data-gtm");
				dataLayer.push({
					event: "boutiqueSearchMap",
					"boutiqueName": boutiqueName
				});

			});
		}

		//Boutique details events
		if (_cache.$wrapper.hasClass("js-ga-store-geolocatore-page")) {
			// boutique Search More events
			$('.cta-red').unbind('click.GA').bind('click.GA', function() { //// Working fine || To check
				var boutiqueName = $(this).attr("data-gtm");
				if (boutiqueName == undefined)
					boutiqueName = $.trim($(".boutique__title").children(':last').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' '));
				dataLayer.push({
					event: "boutiqueDetailShowMap",
					"boutiqueName": boutiqueName
				});
			});
			// boutique SearchNb Click events
			$('.send-email').unbind('click.GA').bind('click.GA', function() { //// Working fine || To check
				var boutiqueName = $(this).attr("data-gtm");
				if (boutiqueName == undefined)
					boutiqueName = $.trim($(".boutique__title").children(':last').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' '));
				dataLayer.push({
					event: "boutiqueDetailSendMail",
					"boutiqueName": boutiqueName
				});
			});
		}
	};



	Plugin.prototype.wishlistGA = function() {
		if (_cache.$wrapper.hasClass("js-ga-mywishlist-page") || $('.js-product-wrapper').length > 0) {

			var _productDetails = function($that) {
				var retvar = $that.closest('.js-product-wrapper').data();
				retvar.productcollection = window.GAtextFix(retvar.productcollection);
				retvar.productline = window.GAtextFix(retvar.productline);
				retvar.productname = window.GAtextFix(retvar.productname);

				return retvar;
			}

			// log edit event
			$('.js-edit').on('click', function() { ///// Should work
				dataLayer.push({
					event: "wishlistEdit"
				});
			});

			//log delete event
			$('.js-deletelist').on('click', function() { ///// Should work
				dataLayer.push({
					event: "wishlistDelete"
				});
			});

			//select size event
			$('.filter-wrapper .form-select').on('change', function() { ///// Should work
				var myobj = _productDetails($(this));
				dataLayer.push({
					event: "wishlistSize",
					productLine: myobj.productline,
					productId: myobj.refid,
					productCollection: myobj.productcollection,
					sellable: myobj.sellable,
					productName: myobj.productname
				});
			});

			//more sizing guide link event
			$('.filter-wrapper .more-button').on('click', function() { ///// Should work
				var myobj = _productDetails($(this));
				dataLayer.push({
					event: "wishListSizingClick",
					productLine: myobj.productline,
					productId: myobj.refid,
					productCollection: myobj.productcollection,
					sellable: myobj.sellable,
					productName: myobj.productname
				});
			});

			// add to cart event
			$('.cta--red-pad-30').on('click', function() { ///// Should work
				var myobj = _productDetails($(this));
				dataLayer.push({
					event: "wishlistAddToCart",
					productLine: myobj.productline,
					productId: myobj.refid,
					productCollection: myobj.productcollection,
					sellable: myobj.sellable,
					productName: myobj.productname
				});
			});

			//copy to wishlist
			$('.js-copytowishlist').on('click', function() { ///// Should work
				var myobj = _productDetails($(this));
				dataLayer.push({
					event: "wishlistCopy",
					productLine: myobj.productline,
					productId: myobj.refid,
					productCollection: myobj.productcollection,
					sellable: myobj.sellable,
					productName: myobj.productname
				});
			});
		}
	};


	Plugin.prototype.alreadyRegisteredContinue = function() {

		dataLayer.push({
			'event': "alreadyRegisteredContinue"
		});

	};


	Plugin.prototype.alreadyRegisteredGAPopup = function() {
		dataLayer.push({
			event: "virtualPageview",
			page: adaptive + "/" + uri + "/Pop-in_Arleady_registered/" + visitorStatus
		});
	};

	Plugin.prototype.alreadyRegisteredCountrySelect = function() {

		var countrySelected = $('#js-login-form .js-login-dropdown #fn_country').find('option:selected').val();

		countrySelected = cartier.common.getCountryName(countrySelected);

		dataLayer.push({
			'event': "alreadyRegisteredCountry",
			'countrySelected': countrySelected
		});
	};

	Plugin.prototype.productGAEvents = function() {

		//product Request Info events
		$('#js-request-info-form fieldset').find('input,textarea').unbind('click.GA').bind('click.GA', function() { //// Working fine || To check
			var nameOfTheField = nameResovler($(this).attr('name')); //.parent().children('label').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');
			dataLayer.push({
				event: "productRequestInfo",
				"nameOfTheField": nameOfTheField
			});
		}).end().find('select').unbind('change.GA').bind('change.GA', function(event) {
			var nameOfTheField = nameResovler($(this).attr('name')); //.parent().children('label').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');
			dataLayer.push({
				event: "productRequestInfo",
				"nameOfTheField": nameOfTheField
			});
		});

		//product Request InfoSubmition event
		$('#js-request-info-form input[type=submit]').unbind('click.GA').bind('click.GA', function() { //// Working fine || To check
			var requestCategory = $('.js-request-info select').find("option:selected").val().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');

			requestCategory = cartier.common.toTitleCase(requestCategory);

			dataLayer.push({
				event: "productRequestInfoSubmit",
				"requestCategory": requestCategory
			})
		});

		//product Contact Ambassador events
		$('#js-contact-ambassador-form fieldset').find('input,textarea').unbind('click.GA').bind('click.GA', function() { //// Working fine || To check
			//console.log("hello");
			var nameOfTheField = nameResovler($(this).attr('name')); //.parent().children('label').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');
			dataLayer.push({
				event: "productContactAmbassadorFieldSelection",
				"nameOfTheField": nameOfTheField
			});
		}).end().find('select').unbind('change.GA').bind('change.GA', function() {
			var nameOfTheField = nameResovler($(this).attr('name')); //.parent().children('label').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');
			dataLayer.push({
				event: "productContactAmbassadorFieldSelection",
				"nameOfTheField": nameOfTheField
			});
		});


		//productContact Ambassador Field Selection event
		$('#js-contact-ambassador-form input[type=submit]').unbind('click.GA').bind('click.GA', function() { //// Working fine || To check
			var requestCategory = $('.js-contact-ambas select').find("option:selected").val().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');

			requestCategory = cartier.common.toTitleCase(requestCategory);

			dataLayer.push({
				event: "productContactAmbassadorFieldSubmit",
				"requestCategory": requestCategory
			});
		});
	};


	Plugin.prototype.shoppingBagGAEventsQuantity = function() {
		var myarray = [];
		var inthebag = $('.js-product-inbag');
		for (var i = 0; i < inthebag.length; i++) {
			var productLine = window.GAtextFix($('.js-product-inbag:eq(' + i + ')').attr("data-productLine"));
			var productId = $('.js-product-inbag:eq(' + i + ')').attr("data-productId");
			var productCollection = window.GAtextFix($('.js-product-inbag:eq(' + i + ')').attr("data-productCollection"));
			var price = $('.js-product-inbag:eq(' + i + ')').attr("data-productprice");
			var quantity = $('.js-product-inbag:eq(' + i + ')').find('.js-quantityselect option:selected').html();
			var productName = window.GAtextFix($('.js-product-inbag:eq(' + i + ')').attr("data-productName"));
			myarray.push({
				"category": productLine + "-" + productCollection,
				"sku": productId,
				"price": price,
				"quantity": quantity,
				"name": productName
			});
		}
		dataLayer.push({
			"cartProducts": myarray
		});
	};
	Plugin.prototype.productAddToCart = function() {
		dataLayer.push({
			event: "productAddToCart"
		});
	};

	Plugin.prototype.productShareMail = function() {
		dataLayer.push({
			event: "productShareMail"
		});
	};

	Plugin.prototype.forgotPasswordTrue = function() {
		dataLayer.push({ ///// Should work
			event: "virtualPageview",
			"page": adaptive + "/" + uri + "/" + "Pop-in_Your_password_have_been_sent" + "/" + visitorStatus
		});
	};


	Plugin.prototype.shoppingBagGAEventsSizechange = function($that) {
		var productLine = window.GAtextFix($that.parents(".product-inbag").attr("data-productLine"));
		var productId = $that.parents(".product-inbag").attr("data-productId");
		var productCollection = window.GAtextFix($that.parents(".product-inbag").attr("data-productCollection"));
		var sellable = $that.parents(".product-inbag").attr("data-sellable");
		var productName = window.GAtextFix($that.parents(".product-inbag").attr("data-productName"));
		dataLayer.push({
			event: "cartSizeDropdown",
			"productLine": productLine,
			"productId": productId,
			"productCollection": productCollection,
			"sellable": sellable,
			"productName": productName
		});
	};


	Plugin.prototype.errorPushGA = function(errorVal) {
		dataLayer.push({
			'event': 'funnelErrorMessage',
			"errorMessage": errorVal
		});
	};
	Plugin.prototype.errorInAccountCreation = function(errorVal) {
		dataLayer.push({
			event: "accountCreationError",
			"accountCreationErrorMessage": errorVal
		});
	};

	Plugin.prototype.errorPushGAVirtual = function(errorVal) {
		dataLayer.push({
			event: "virtualPageview",
			page: uri + '/' + type + '/' + visitorStatus
		});
	};

	Plugin.prototype.errorPushGACreate = function(errorVal) {
		dataLayer.push({
			event: "accountCreationError",
			"accountCreationErrorMessage": errorVal
		});
	};

	Plugin.prototype.shoppingBagGAEventsRemoval = function($that) {
		var productLine = window.GAtextFix($that.parents(".product-inbag").attr("data-productLine"));
		var productId = $that.parents(".product-inbag").attr("data-productId");
		var productCollection = window.GAtextFix($that.parents(".product-inbag").attr("data-productCollection"));
		var sellable = $that.parents(".product-inbag").attr("data-sellable");
		var productName = window.GAtextFix($that.parents(".product-inbag").attr("data-productName"));

		dataLayer.push({
			event: "cartProductRemoval",
			"productLine": productLine,
			"productId": productId,
			"productCollection": productCollection,
			"sellable": sellable,
			"productName": productName
		});
	};

	Plugin.prototype.shoppingBagGAEvents = function() {
		// Shopping Bag Page events
		var productGlobalUpdator = function($that) {
			window.productLine = window.GAtextFix($that.parents(".product-inbag").attr("data-productLine"));
			window.productId = $that.parents(".product-inbag").attr("data-productId");
			window.productCollection = window.GAtextFix($that.parents(".product-inbag").attr("data-productCollection"));
			window.sellable = $that.parents(".product-inbag").attr("data-sellable");
			window.productName = window.GAtextFix($that.parents(".product-inbag").attr("data-productName"));
		};

		if (_cache.$wrapper.hasClass("js-ga-shopping-bag")) { //// Working fine || To check

			// Engraving edit events
			$('.js-engravingrow .js-accordion_node__title').on('click', function() { // working fine
				productGlobalUpdator($(this));
				dataLayer.push({
					event: "cartEngravingEdit",
					"productLine": productLine,
					"productId": productId,
					"productCollection": productCollection,
					"sellable": sellable,
					"productName": productName
				});
			});

			// Engraving delete events
			$('.js-engravingrow .js-accordion_node__title').find('.crossbutton').on('click', function() {
				productGlobalUpdator($(this));
				dataLayer.push({
					event: "cartEngravingDelete",
					"productLine": productLine,
					"productId": productId,
					"productCollection": productCollection,
					"sellable": sellable,
					"productName": productName
				});
			});

			// Bracelet adjustement edit events
			$('.js-braceletrow .js-accordion_node__title').on('click', function() { // working fine
				productGlobalUpdator($(this));
				dataLayer.push({
					event: "cartAdjustementEdit",
					"productLine": productLine,
					"productId": productId,
					"productCollection": productCollection,
					"sellable": sellable,
					"productName": productName
				});
			});

			// Bracelet adjustement delete events
			$('.js-braceletrow .js-accordion_node__title').find('.crossbutton').on('click', function() {
				productGlobalUpdator($(this));
				dataLayer.push({
					event: "cartAdjustementDelete",
					"productLine": productLine,
					"productId": productId,
					"productCollection": productCollection,
					"sellable": sellable,
					"productName": productName
				});
			});

			// Number of product dropdown menu edit events
			$('select.js-quantityselect').on('change', function() { // working fine
				productGlobalUpdator($(this));
				dataLayer.push({
					event: "cartNumberOfProducts"
				});
			});

			// Message card edit events
			$('.js-messagerow .js-accordion_node__title').on('click', function() { // working fine
				productGlobalUpdator($(this));
				dataLayer.push({
					event: "cartMessageCardEdit"
				});
			});

			// Message card delete events
			$('.js-messagerow .js-accordion_node__title').find('.crossbutton').on('click', function() {

				var messageCardType = window.messageCardType;
				var messageCardFont = window.messageCardFont;

				/*if ($('.js-radio-change-handler').closest('.js-accordion__node').find('.compose-message').prop('checked'))
					messageCardType = "Electronic message";
				else
					messageCardType = "Blank message card";

				if ($(".js-cursive-switch").is(':checked'))
					messageCardFont = "Cursive";
				else
					messageCardFont = "Block";*/

				dataLayer.push({
					event: "cartMessageCardDelete",
					"messageCardType": messageCardType,
					"messageCardFont": messageCardFont,
					"productLine": productLine,
					"productId": productId,
					"productCollection": window.GAtextFix(productCollection),
					"sellable": sellable,
					"productName": window.GAtextFix(productName)
				});
			});

			// Ok CTA events
			$('.js-messagerow input.js-confirm-button').on('click', function() { // working fine
				productGlobalUpdator($(this));
				var messageCardType = '';
				var messageCardFont = '';
				if ($(this).closest('.js-messagerow').find('.js-radio-change-handler').find('li:first input').is(':checked'))
					messageCardType = "Electronic message";
				else
					messageCardType = "Blank message card";

				if ($(this).closest('.js-messagerow').find('.slide_switch').find('input:first').is(':checked'))
					messageCardFont = "Block";
				else
					messageCardFont = "Cursive";

				window.messageCardType = messageCardType;
				window.messageCardFont = messageCardFont;

				dataLayer.push({
					event: "cartMessageCardValidation",
					"messageCardType": messageCardType,
					"messageCardFont": messageCardFont
				});
			});

			// Save Selection events
			$('.js-add-selection').on('click', function() { // working fine
				productGlobalUpdator($(this));
				dataLayer.push({
					event: "cartSaveSelection"
				});
			});

			// Signin & checkout events
			/*			$('.js-login-checkout-cta').unbind('click.GA').bind('click.GA', function() { // working fine
				_destinationPagePusher({
					"page": adaptive + "/" + uri + "/" + "Pop-in_Login" + "/" + visitorStatus
				});
			});*/
		}

	};

	var _typeChecker = function() {
		var mytype = "";
		if (cartier.common.isLoggedIn()) {
			if (localStorage.getItem('signinandcheckout') === null)
				mytype = "already_logged_in";
			else
				mytype = "after_login";
		} else {
			mytype = "guest";
		}
		return mytype;
	};

	var _destinationPagePusher = function(obj) {
		var _newArr = [];

		if ($.jStorage.get('destinationPagePush') !== null) {
			var existingObj = JSON.parse($.jStorage.get('destinationPagePush'));

			if ($.isArray(existingObj)) {
				$.each(existingObj, function(index, value) {
					_newArr.push(value);
				});
			} else {
				_newArr.push(obj);
			}
		}
		_newArr.push(obj);


		var str = JSON.stringify(_newArr);
		$.jStorage.set('destinationPagePush', str);
	};

	var _onDestinationPage = function() {
		if ($.jStorage.get('destinationPagePush') !== null) {
			var obj = JSON.parse($.jStorage.get('destinationPagePush'));

			if ($.isArray(obj)) {
				$.each(obj, function(index, value) {
					dataLayer.push(value);
				});
			} else {
				dataLayer.push(obj);
			}

			$.jStorage.deleteKey('destinationPagePush');
		}
	};

	var _shippingBackLinkModifier = function(addon, linktomodify) {
		if (linktomodify !== undefined) {
			if (linktomodify.indexOf('?') === -1)
				return linktomodify + "?" + addon;
			else
				return linktomodify + "&" + addon;
		} else return false;
	};

	var _localStorageHandingForForms = function() {
		$('#js-reg-step-1 .button-wrapper, #js-personal-info-form .button-wrapper').on('click', function() {
			var gender;
			if ($('input[name="fn_grptitle"]:checked').val() === '0001' || $('input[name="piform_genderTitle"]:checked').val() === '0001')
				gender = "M";
			else
				gender = "F";
			localStorage.setItem('formGender', gender);
		});

		$('#js-personal-info-form .button-wrapper').on('click', function() {
			var yearOfBirth, countryForm;
			yearOfBirth = $('select[name="fn_bdyear"]').val();
			localStorage.setItem('formYear', yearOfBirth);

			countryForm = $('select[name="piform_countryName"]').val();
			localStorage.setItem('formCountry', countryForm);
		});

		$('#js-reg-step-3 .button-wrapper, #js-jp-reg-step-3 .button-wrapper').on('click', function() {
			var yearOfBirth, cityForm, formZip;

			yearOfBirth = $('select[name="fn_bdyear"]').val();
			localStorage.setItem('formYear', yearOfBirth);

			cityForm = $('input[name="addressform_address7"]').val();
			localStorage.setItem('formCity', cityForm);

			if (cartier.countryHandler.isJP) {
				formZip = $('input[name="addressform_zip1"]').val() + ' ' + $('input[name="addressform_zip2"]').val();
			} else {
				formZip = $('input[name="fn_zip"]').val();
			}

			localStorage.setItem('formZip', formZip);
		});
	};

	/*@Private  method  :   handler for footer click events
    @param            :   none
     */

	Plugin.prototype.init = function() {
		cartier.log('JS-LOG:Analytics Called');
		_localStorageHandingForForms();
		var _notUndefined = function(vari) {
			if (vari === undefined || typeof vari === "undefined")
				vari = "";
			return vari;
		};
		window.type = _typeChecker();
		window.uri = _notUndefined(window.uri);
		window.visitorStatus = _notUndefined(window.visitorStatus);
		window.accountCreationStatus = _notUndefined(window.accountCreationStatus);
		window.productLine = _notUndefined(window.productLine);
		window.productId = _notUndefined(window.productId);
		window.productCollection = _notUndefined(window.productCollection);
		window.sellable = _notUndefined(window.sellable);
		window.productName = _notUndefined(window.productName);
		window.siteSearchTerm = _notUndefined(window.siteSearchTerm);
		window.siteSearchResults = _notUndefined(window.siteSearchResults);
		window.productID = _notUndefined(window.productID);
		window.adaptive = _notUndefined(window.adaptive);
		window.productMap = {
			"0001": "HandBag",
			"0002": "Small leather Goods",
			"0003": "belts",
			"0004": "Bags",
			"0005": "Sunglasses",
			"0006": "Prescription Glasses",
			"0007": "Pen",
			"0008": "Scarf",
			"0009": "Cfflinks",
			"0010": "lighter",
			"0011": "Key Rings",
			"0012": "Card Holder",
			"0013": "Money Clip",
			"0014": "Clock",
			"0000": "Other"
		};

		window.fieldMap = {
			fn_fname: "First name",
			fn_lname: "Last name",
			fn_fname1: "First name1",
			fn_fname2: "First name2",
			fn_lname1: "Last name1",
			fn_lname2: "Last name2",
			fn_grptitle: "Title",
			fn_grptitle1: "Title",
			fn_grptitle2: "Title",
			fn_grptitle3: "Title",
			fn_addrname: "Address name",
			fn_strnum: "Street number",
			fn_strname: "Street name",
			fn_addrinfo: "Additional address info",
			fn_city: "City",
			fn_state: "State",
			fn_zip: "Zip",
			fn_phno: "Phone number",
			j_username: "Email Address",
			j_password: "Password",
			fn_pobox: "PO Box",
			fn_emailcon: "Email confirmation",
			fn_passcon: "Password confirmation",
			fn_wordvef: "word verification",
			fn_grpcontpref: "Contact preference",
			fn_chkprivnotc: "Privacy check",
			fn_mainmsg: "Message",
			fn_chkonlinecom: "Receive online communication",
			fn_country: "Country selector",
			fn_chkinvoice: "Receive invoice",
			fn_bdmonth: "Birthday details month",
			fn_bddate: "Birthday details date",
			fn_bdyear: "Birthday details year",
			fn_mrmonth: "Marriage month",
			fn_mrdate: "Marriage date",
			fn_mryear: "Marriage year",
			fn_msgrelatdto: "Message related to",
			fn_zip2: "Zip 2",
			fn_mobileno: "Phone",
			fn_msgdesc: "Message description",
			fn_grpownsp: "Do you own a smartphone",
			fn_grpdoyouown: "Do you own a creation",
			fn_grpaddr: "Home/PO Box",
			fn_Country: "Country selector",
			fn_prefecture: "Prefecture",
			fn_town: "Town",
			addressform_zip1: "Zip 1",
			addressform_zip2: "Zip 2",
			addressform_address9: "State",
			addressform_address7: "City or Country",
			addressform_address1: "Region",
			piform_genderTitle: "Gender",
			piform_lname2: "Last Name 2",
			piform_lname1: "Last Name 1",
			piform_fname1: "First Name",
			piform_emailaddress: "Email Address",
			piform_confirm_emailaddress: "Confirm Email Address",
			piform_password: "Password",
			piform_phoneDetail: "Phone Detail",
			piform_owncreationcheck: "Due to Own Creation",
			piform_clientOwnFrom: "Client Own From",
			piform_prodline: "Product Line",
			piform_productCategory: "Product Category",
			registration_j_password: 'Registration Password',
			registration_j_username: 'Registration Username',
			requestInformation_title: 'Title',
			requestInformation_firstName: 'First Name',
			requestInformation_lastName: 'Last Name',
			requestInformation_lastName2: 'Last Name 2',
			requestInformation_emailAddress: 'Email Address',
			requestInformation_mainMessage: 'Main Message',
			requestInformation_message: 'Message',
			requestInformation_checkbox_val: 'Wish to receive',
			senderFirstName1: 'Sender First Name',
			senderLastName1: 'Sender Last Name',
			senderLastName2: 'Sender Last Name 2',
			senderEmailAddress: 'Sender Email Address',
			fn_recvmessage: 'Wish to receive message',
			receiverFirstName1: 'Receiver First Name',
			receiverLastName1: 'Receiver Last Name',
			receiverLastName2: 'Receiver Last Name 2',
			receiverEmailAddress: 'Receiver Email Address',
			addressform_firstName1: 'First Name',
			addressform_lastName1: 'Last Name',
			addressform_firstName2: 'First Name',
			addressform_lastName2: 'Last Name',
			addressLabel: 'Address name',
			addressform_address2: 'Street Number',
			addressform_address5: 'Street Name',
			addressform_address6: 'Additional Info',
			addressform_address12: 'PO Box',
			addressform_zip: 'Zip',
			addressform_phone: 'Phone'
		};



		window.GAtextFix = function(str) {
			if (str === undefined)
				str = '';

			return str.replace(/<span class='loveFont'>A <\/span>/gi, "Love").replace(/<span class='lovefont'>A <\/span>/gi, "Love").replace(/#/gi, "@");
		};
		window.nameResovler = function(str) {
			var doMap = true,
				returnVal = str,
				nameFieldObject = window.fieldMap;
			if (doMap) {
				returnVal = nameFieldObject[str];
				if (returnVal === undefined)
					returnVal = str;
			}
			if (returnVal === undefined)
				returnVal = "";
			return returnVal;
		};
		window.productnNameResovler = function(str) {
			var
			returnVal = str,
				nameFieldObject = window.productMap;
			returnVal = nameFieldObject[str.toString()];
			if (returnVal === undefined)
				returnVal = str;
			if (returnVal === undefined)
				returnVal = "";
			return returnVal;
		};
		_onDestinationPage();
		_cacheObjects();
		_bindEvents();

	};

	// A really lightweight plugin wrapper around the constructor
	// preventing against multiple instantiations
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName,
					new Plugin(this, options));
			}
		});
	}

})(jQuery, window, document);