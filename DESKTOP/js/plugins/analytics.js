/*!
 * google.analytics.js
 * This file contains a plugin to handle google analytics that generate the several events for tracking.
 *
 * @project   Cartier Desktop
 * @date      2014-01-21
 * @author    SapientNitro
 * @licensor  Cartier Desktop
 * @site      Cartier Desktop
@NOTE   Google Tag Manager functions best when deployed alongside a data layer.
A data layer is an object that contains all of the information that you want to pass
to Google Tag Manager. Information such as events or variables can be passed to Google
Tag Manager via the data b layer, and rules can be set up in Google Tag Manager based
on the values of variables (e.g. fire a remarketing tag when purchase_total > $100)
or based on the specific events. Variable values can also be passed through to other
tags (e.g. pass purchase_total into the value field of a tag).
 */
;
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
	};
	/*
    @private method : caching jquery objects
    @param : none
     */
	var _cacheObjects = function() {
		_cache = {
			$wrapper: $(".main-container"),
			$billing: $(".billing-page"),
			$footer: $("footer"),
			$carousel: $(".carousel-wrapper")
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
				'event': pageType + "SlideAuto",
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
		// ---------------------------- START OF JS OF GA FOR DESKTOP ----------------------------------//

		//------------------  Start Dispatch Page----------------//

		// --------Start of Rule 7 -------------//

		if ($('.main-dispatch').hasClass("js-ga-dispatch-page")) {
			$('.continent ul li a').on('click', function() {
				$(this).attr('href', _shippingBackLinkModifier('utm_source=Cartier.com&utm_medium=Global_website&utm_campaign=Branding', $(this).attr('href')));
			});

		}
		//---------- End of Rule 7-------------------- //

		//------------------  End Dispatch Page----------------//



		//-------------------Start Header----------------//

		// Start of Rule 8 and Rule 9 //

		$('header a').on('click', function() {
			if (!($(this).closest('.js-back-to-shopping-bag').length)) {
				$(this).attr('href', _shippingBackLinkModifier('origin=Header', $(this).attr('href')));
			}
		});

		// End of Rule 8 and Rule 9 //

		//--------------------End Header---------------//


		//-------------------Start Footer----------------//

		// --------Start of Rule 10 , Rule 14 , Rule 15-------------//

		$('footer .footer-left a,footer .footer-menu a').on('click', function() {
			$(this).attr('href', _shippingBackLinkModifier('origin=Footer', $(this).attr('href')));
		});

		//---------- End of Rule 10 , Rule 14 , Rule 15-------------------- //

		//----------- Start of Rule 11 and Rule 12 --------------//

		$('footer .footer-right .social-icons a ').on('click', function() {

			var socialNetwork = $(this).attr("data-gtm");
			if (socialNetwork != undefined) {
				dataLayer.push({
					'event': "social",
					"socialNetwork": socialNetwork,
					"socialAction": "Follow Us"
				});
			}
		});

		//--------- End of Rule 11 and Rule 12--------- //

		//--------------------End Footer---------------//


		//------------Start Homepage Navigation------------- //

		if (_cache.$wrapper.hasClass("js-ga-homepage-navigation")) {

			//----------- Start of Rule 16 , Rule 17 , Rule 18 and Rule19 --------------//

			// add js-ga-carousel in carousel-wrapper class in the page.

			_carouselGARules('home');

			//----------- autoslider --------------//

			_autoSliderChecker('home');

			//----------- autoslider --------------//

			//----------- End of Rule 16 , Rule 17 , Rule 18 and Rule19 --------------//


			//----------- Start of Rule 20 --------------//

			$('.collection-menu a').on('click', function() {
				$(this).attr('href', _shippingBackLinkModifier('origin=Home_Footer', $(this).attr('href')));
			});

			//----------- End of Rule 20 --------------//

			//----------- End of Rule 300 --------------//

			$('.carousel li a').on('click', function() { //// Working fine
				onPageLoad = false;
				var hpPushId = "Central Push " + (($(this).closest('li').index()));
				var hpPushContent = $(this).closest('li').find('img.image').attr('alt');

				dataLayer.push({
					'event': "clickOnHomepagePush",
					'homepageVersion': homepageVersion,
					"hpPushId": hpPushId,
					"hpPushContent": hpPushContent
				});

				_destinationPagePusher({
					'event': "clickOnHomepagePush",
					'homepageVersion': homepageVersion,
					"hpPushId": hpPushId,
					"hpPushContent": hpPushContent
				});
			});

			//----------- End of Rule 300 --------------//
		}

		//------------End Homepage Navigation------------- //


		//------------Start Collections  Homepage------------- //

		if (_cache.$wrapper.hasClass("js-ga-collections-homepage")) {

			//----------- Start of Rule 21 , Rule 22 , Rule 23 and Rule 24 --------------//

			// add js-ga-carousel in carousel-wrapper class in the page.

			_carouselGARules('collection');

			//----------- autoslider --------------//

			_autoSliderChecker('collection');

			//----------- autoslider --------------//

			//----------- End of Rule 21 , Rule 22 , Rule 23 and Rule 24 --------------//

		}

		//------------End Collections Homepage------------- //


		//------------Start Collections product line homepage------------- //


		if (_cache.$wrapper.hasClass("js-ga-collections-product-line-homepage")) {
			var dropDownName;

			//----------- Start of Rule 25--------------// 

			$('.line_links_node_title__ques').on('click', function() {
				dropDownName = $(this).find('h2').attr('data-gtm');

				if (window.productLine != undefined && dropDownName != undefined) {
					dataLayer.push({
						'event': "homeCollectionFilter",
						'productLine': window.productLine,
						'dropDownName': dropDownName
					});
				}
			});

			//----------- End of Rule 25-------------// 
		}


		//------------End Collections product line homepage------------- //


		//------------Start Collections & categories listing pages - Browse and Refine selection------------- //


		if (_cache.$wrapper.hasClass("js-ga-collection-listing-page")) {

			var filterCategory,
				filterName,
				eventName,
				eventType = $('.tabs__nav li div.js-ga-tabtype').attr('data-tabtype'),
				productLine = window.productLine,
				categoryOrCollection = window.categoryOrCollection;

			//----------- Start of Rule 26 , Rule 27 , Rule 32 and Rule 33--------------// 

			$('.tabs__nav li').eq(0).on('click', function() {

				if (productLine != undefined && categoryOrCollection != undefined) {

					var tabType = 'page' + eventType + 'Filter';

					dataLayer.push({
						'event': tabType,
						'productLine': productLine,
						'categoryOrCollection': categoryOrCollection
					});
					if ($(this).hasClass('tabs__title tab-active') != true) {


						dataLayer.push({
							'event': "virtualPageview",
							'page': adaptive + '/' + uri + "/browseSelection"
						});
					}
				}
			});

			//----------- End of Rule 26 , Rule 27 , Rule 32 and Rule 33-------------// 

			//----------- Start of Rule 28 , Rule 29 and Rule 34--------------// 

			$('.tabs__nav li').eq(1).on('click', function() {

				if (productLine != undefined && categoryOrCollection != undefined) {
					dataLayer.push({
						'event': "pageRefineFilter",
						'productLine': productLine,
						'categoryOrCollection': categoryOrCollection
					});
					if ($(this).hasClass('tabs__title tab-active') != true) {
						dataLayer.push({
							'event': "virtualPageview",
							'page': adaptive + '/' + uri + "/refineSelection"
						});
					}
				}
			});

			//----------- End of Rule 28 , Rule 29 and Rule 34-------------// 


			//----------- Start of Rule 30 and Rule 41--------------// 


			$('.view-more').on('click', function() {
				if (productLine != undefined && categoryOrCollection != undefined) {
					dataLayer.push({
						'event': "pageCollectionCategoryViewMore",
						'productLine': productLine,
						'categoryOrCollection': categoryOrCollection
					});
				}
			});

			//----------- End of Rule 30 and Rule 41--------------// 


			//----------- Start of Rule 31 and Rule 40--------------// 

			$('.link-to-top').on('click', function() {
				if (productLine != undefined && categoryOrCollection != undefined) {
					dataLayer.push({
						'event': "pageCollectionCategoryClickTop",
						'productLine': productLine,
						'categoryOrCollection': categoryOrCollection
					});
				}
			});


			//----------- End of Rule 31 and Rule 40--------------// 


			//----------- Start of Rule 35--------------//  


			$('.radio-buttons__list li').eq(0).on('click', function() {
				if (productLine != undefined && categoryOrCollection != undefined) {
					dataLayer.push({
						'event': "pageRefineAllFilter",
						'productLine': productLine,
						'categoryOrCollection': categoryOrCollection
					});
				}
			});

			//----------- End of Rule 35--------------// 


			//----------- Start of Rule 36--------------//   


			$('.radio-buttons__list li').eq(1).on('click', function() {

				if (productLine != undefined && categoryOrCollection != undefined) {
					dataLayer.push({
						'event': "pageRefineSoldOnlineFilter",
						'productLine': productLine,
						'categoryOrCollection': categoryOrCollection
					});
				}
			});

			//----------- End of Rule 36--------------// 


			//----------- Start of Rule 37 and Rule 38 --------------//  


			$('.refine-selector__content  label').on('click', function() {
				filterCategory = $('.refine-selector__title').attr('data-gtm');
				filterName = $(this).attr('data-gtm');

				if ($(this).find('.js-refine-checkbox span').hasClass('checked')) {
					eventName = "pageRefineAddFilter";
				} else {
					eventName = "pageRefineRemoveFilter";
				}

				if (filterCategory != undefined && filterName != undefined && productLine != undefined && categoryOrCollection != undefined) {
					dataLayer.push({
						'event': eventName,
						'filterCategory': filterCategory,
						'filterName': filterName,
						'productLine': productLine,
						'categoryOrCollection': categoryOrCollection
					});
				}
			});


			//----------- End of Rule 37 and Rule 38--------------// 


			//----------- Start of Rule 39--------------// 

			$('.remove-criteria').on('click', function() {
				if (productLine != undefined && categoryOrCollection != undefined) {
					dataLayer.push({
						'event': "pageRefineRemoveFilters",
						'productLine': productLine,
						'categoryOrCollection': categoryOrCollection
					});
				}
			});

			//----------- End of Rule 39--------------//
		}


		//------------End Collections & categories listing pages - Browse and Refine selection------------- //


		//------------Start Collections Model listing pages------------- //


		if (_cache.$wrapper.hasClass("js-ga-collection-model-listing-page")) {

			var productLine = window.productLine,
				categoryOrCollection = window.categoryOrCollection,
				filterCategory,
				filterName;


			//----------- Start of Rule 42--------------// 

			$('.link-to-top').on('click', function() {
				if (productLine != undefined && categoryOrCollection != undefined) {
					dataLayer.push({
						'event': "pageCollectionModelListClickTop",
						'productLine': productLine,
						'categoryOrCollection': categoryOrCollection
					});
				}
			});


			//----------- End of Rule 42--------------// 



			//----------- Start of 43--------------// 


			$('.view-more').on('click', function() {
				if (productLine != undefined && categoryOrCollection != undefined) {
					dataLayer.push({
						'event': "pageCollectionModelListViewMore",
						'productLine': productLine,
						'categoryOrCollection': categoryOrCollection
					});
				}
			});

			//----------- End of Rule 43--------------// 



			//----------- Start of Rule 44--------------//  


			$('.radio-buttons__list li').eq(0).on('click', function() {
				if (productLine != undefined && categoryOrCollection != undefined) {
					dataLayer.push({
						'event': "pageCollectionModelListAllFilter",
						'productLine': productLine,
						'categoryOrCollection': categoryOrCollection
					});
				}
			});

			//----------- End of Rule 44--------------// 


			//----------- Start of Rule 45--------------//   


			$('.radio-buttons__list li').eq(1).on('click', function() {

				if (productLine != undefined && categoryOrCollection != undefined) {
					dataLayer.push({
						'event': "pageCollectionModelListSoldOnlineFilter",
						'productLine': productLine,
						'categoryOrCollection': categoryOrCollection
					});
				}
			});

			//----------- End of Rule 45--------------// 


			//----------- Start of Rule 46 and Rule 47 --------------//  


			$('.refine-selector__content  label').on('click', function() {
				filterCategory = $('.refine-selector__title').attr('data-gtm');
				filterName = $(this).attr('data-gtm');

				if ($(this).find('.js-refine-checkbox span').hasClass('checked')) {
					eventName = "pageCollectionModelListAddFilter";
				} else {
					eventName = "pageCollectionModelListRemoveFilter";
				}

				if (filterCategory != undefined && filterName != undefined && productLine != undefined && categoryOrCollection != undefined) {
					dataLayer.push({
						'event': eventName,
						'filterCategory': filterCategory,
						'filterName': filterName,
						'productLine': productLine,
						'categoryOrCollection': categoryOrCollection
					});
				}
			});


			//----------- End of Rule 46 and Rule 47--------------// 


			//----------- Start of Rule 48--------------// 

			$('.remove-criteria').on('click', function() {
				if (productLine != undefined && categoryOrCollection != undefined) {
					dataLayer.push({
						'event': "pageCollectionModelListRemoveFilters",
						'productLine': productLine,
						'categoryOrCollection': categoryOrCollection
					});
				}
			});

			//----------- End of Rule 48--------------//
		}


		//------------End Collections Model listing pages------------- //


		//------------Start Collection selection Pages ------------ //


		if (_cache.$wrapper.hasClass("js-ga-collection-selection-page")) {

			var slideWidth = parseInt($('.js-nested-slider').find('li').css('width')),
				slideStylePosition = parseInt($('.js-nested-slider').attr('style').split("(")[1].split("p")[0]) * (-1),
				slideTranslateIndex = parseInt(slideStylePosition / slideWidth),
				slideProductSelection = $('.js-nested-slider').find('li .info__desc').eq(slideTranslateIndex).attr('data-gtm').replace(/#/gi, "@"),
				slideProductDescription = $('.js-nested-slider').find('li .info__pic').eq(slideTranslateIndex).attr('data-gtm').replace(/#/gi, "@");


			//----------- Start of Rule 49--------------// 

			$('.bx-controls-direction-left').on('click', function() {
				dataLayer.push({
					'event': "pageCollectionSelectionSlidePrevious",
					'slideProductSelection': slideProductDescription.replace(/#/gi, "@"),
					'slideProductDescription': slideProductSelection.replace(/#/gi, "@")
				});
				slideWidth = parseInt($('.js-nested-slider').find('li').css('width'));
				slideStylePosition = parseInt($('.js-nested-slider').attr('style').split("(")[1].split("p")[0]) * (-1);
				slideTranslateIndex = parseInt(slideStylePosition / slideWidth);
				slideProductSelection = $('.js-nested-slider').find('li .info__desc').eq(slideTranslateIndex).attr('data-gtm').replace(/#/gi, "@");
				slideProductDescription = $('.js-nested-slider').find('li .info__pic').eq(slideTranslateIndex).attr('data-gtm').replace(/#/gi, "@");
			});

			//----------- End of Rule 49--------------//


			//----------- Start of Rule 50--------------// 

			$('.bx-controls-direction-right').on('click', function() {
				dataLayer.push({
					'event': "pageCollectionSelectionSlideNext",
					'slideProductSelection': slideProductDescription.replace(/#/gi, "@"),
					'slideProductDescription': slideProductSelection.replace(/#/gi, "@")
				});
				slideWidth = parseInt($('.js-nested-slider').find('li').css('width'));
				slideStylePosition = parseInt($('.js-nested-slider').attr('style').split("(")[1].split("p")[0]) * (-1);
				slideTranslateIndex = parseInt(slideStylePosition / slideWidth);
				slideProductSelection = $('.js-nested-slider').find('li .info__desc').eq(slideTranslateIndex).attr('data-gtm').replace(/#/gi, "@");
				slideProductDescription = $('.js-nested-slider').find('li .info__pic').eq(slideTranslateIndex).attr('data-gtm').replace(/#/gi, "@");
			});

			//----------- End of Rule 50--------------// 


			//----------- Start of Rule 51--------------//

			$('.product-carousel__wrapper,.zoom-icon').on('click', function() {
				dataLayer.push({
					'event': "pageCollectionSelectionSlideZoom",
					'slideProductSelection': slideProductDescription.replace(/#/gi, "@"),
					'slideProductDescription': slideProductSelection.replace(/#/gi, "@")
				});
			});

			//----------- End of Rule 51--------------//
		}


		//------------End Collection selection Pages ------------ //


		//------------Start Collection Product Pages----------- //


		if (_cache.$wrapper.hasClass("js-ga-collection-product-page")) {
			var productLine = window.productLine,
				productCollection = window.productCollection,
				sellable = window.sellable,
				productId = window.productId,
				productName = window.productName;


			//----------- Start of Rule 53--------------//

			$('.zoom-cursor , .zoom-icon').on('click', function() {
				dataLayer.push({
					'event': "productSlideZoom"
				});
			});

			//----------- End of Rule 53--------------//


			//----------- Start of Rule 54--------------//

			//In product.js

			//----------- End of Rule 54--------------//


			//----------- Start of Rule 55--------------//

			$('.js-add-selection').on('click', function() {
				dataLayer.push({
					'event': "productWishlistAdd"
				});
			});

			//----------- End of Rule 55--------------//


			//----------- Start of Rule 56--------------//

			$('.js-request-popup').on('click', function() {
				dataLayer.push({
					'event': "productInformationRequest"
				});
			});

			//----------- End of Rule 56--------------//


			//----------- Start of Rule 57--------------//

			$('.js-contam-popup').on('click', function() {
				dataLayer.push({
					'event': "productContactAmbassador"
				});
			});

			//----------- End of Rule 57--------------//


			//----------- Start of Rule 58--------------//

			$('.js-internal-link').on('click', function() {
				dataLayer.push({
					'event': "productDetail"
				});
			});

			//----------- End of Rule 58--------------//


			//----------- Start of Rule 59--------------//

			$('.tooltip-engraving').on('click', function() {
				dataLayer.push({
					'event': "productEngraving"
				});
			});

			//----------- End of Rule 59--------------//


			//----------- Start of Rule 60--------------//

			$('.tooltip-adjustment').on('click', function() {
				dataLayer.push({
					'event': "productAdjustment"
				});
			});

			//----------- End of Rule 60--------------//


			//----------- Start of Rule 61 --------------//

			$('.share-tabs__social').on('click', function() {
				dataLayer.push({
					'event': "productShare",
					'productLine': productLine
				});
			});

			//----------- End of Rule 61 --------------//

			//----------- Start of Rule 62--------------//

			$('.social-share a').on("click", function() {
				var socialNetwork = $(this).attr("data-gtm");
				if (socialNetwork != undefined) {
					dataLayer.push({
						'event': "social",
						"socialNetwork": socialNetwork,
						"socialAction": "Share"
					});
				}

			});

			//----------- End of Rule 62--------------//

			//----------- Start of Rule 63--------------//

			$('.link-to-top').on('click', function() {
				dataLayer.push({
					'event': "productClickTop"
				});
			});

			//----------- End of Rule 63--------------//


			//----------- Start of Rule 64--------------// 
			setTimeout(function() {
				$('select.js-sizeselector').on('change', function() {
					dataLayer.push({
						'event': "productSizeDropdown"
					});
				});
			}, 500);


			//----------- End of Rule 64--------------//


			//----------- Start of Rule 65--------------//

			$('.js-request-price').on('click', function() {
				dataLayer.push({
					'event': "productRequestPrice"
				});
			});

			$('.js-addtoshopping').on('click', function() {
				dataLayer.push({
					'event': "productAddToCart"
				});
			});


			//----------- End of Rule 65--------------//



			//----------- Start of Rule 66--------------//

			$('.degree360-icon').on('click', function() {
				dataLayer.push({
					'event': "product360View"
				});
			});

			//----------- End of Rule 66--------------//



			//----------- Start of Rule 67 and Rule 69--------------//

			$('.gallery .bx-next').on('click', function() {

				if ($('.tabs__title').eq(0).hasClass('tab-active')) {
					dataLayer.push({
						'event': "productSimSlideNext"
					});
				} else {
					dataLayer.push({
						'event': "productSugSlideNext"
					});
				}
			});

			//----------- End of Rule 67 and Rule 69--------------//


			//----------- Start of Rule 68 and Rule 70--------------//

			$('.gallery .bx-prev').on('click', function() {
				if ($('.tabs__title').eq(0).hasClass('tab-active')) {
					dataLayer.push({
						'event': "productSimSlidePrevious"
					});
				} else {
					dataLayer.push({
						'event': "productSugSlidePrevious"
					});
				}
			});

			//----------- End of Rule 68 and Rule 70--------------//


			//----------- Start of Rule 71 --------------//

			$('.bridal-pdp-carousel, .history-stories').find('.bx-controls-direction-left').on('click', function() {
				dataLayer.push({
					'event': "productPresSlidePrevious"
				});
			});

			//----------- End of Rule 71 --------------//

			//----------- Start of Rule 72 --------------//

			$('.bridal-pdp-carousel, .history-stories').find('.bx-controls-direction-right').on('click', function() {
				dataLayer.push({
					'event': "productPresSlideNext"
				});
			});

			//----------- End of Rule 72 --------------//

			//----------- Start of Rule 73 and Rule 74--------------//

			$('.tabs__title').on('click', function() {
				if ($('.tabs__title').eq(0).hasClass('tab-active')) {
					dataLayer.push({
						'event': "productSug"
					});
				} else {
					dataLayer.push({
						'event': "productSim"
					});
				}
			});

			//----------- End of Rule 73 and Rule 74--------------//


			//----------- Start of Rule 76--------------//

			$('.pushes-wrapper_push .product_listing a').on('click', function(e) {

				var productId = $(this).closest('li.one-product').data('productid'),
					productLine = $(this).closest('li.one-product').data('productline'),
					productCollection = $(this).closest('li.one-product').data('productcollection'),
					productName = $(this).closest('li.one-product').data('productname'),
					sellable = $(this).closest('li.one-product').data('sellable');

				$(this).attr('href', _shippingBackLinkModifier('origin=' + productLine + '_' + productCollection + '_' + sellable + '_' + productId + '_' + productName, $(this).attr('href')));

			});

			//----------- End of Rule 76--------------//


		}


		//----------------- End Collection Product Pages------------------- //


		//--------------------------------Start SFY Home Page--------------------------//

		if (_cache.$wrapper.hasClass("js-ga-sfy-home-page")) {

			//----------- Start of Rule 79 --------------//

			$('.services-pushes a.push-link , .quick-links li a').on("click", function() {
				$(this).attr('href', _shippingBackLinkModifier('origin=SFY_Home', $('a.push-link').attr('href')));
			});

			//----------- End of Rule 79 --------------//
		}

		//----------------------  End SFY Home Page-----------------------//


		//----------------------  Start SFY Step 1 -----------------------//

		if (_cache.$wrapper.hasClass("js-ga-sfy-step-1")) {

			var title, creationName, productMaterial;

			//----------- Start of Rule 81 --------------//

			$('.collection-push').on('click', function() {

				title = $(this).find('.collection-title').data('creation-name');
				creationName = cartier.common.toTitleCase(title);

				dataLayer.push({
					'event': 'pageCollectionSFYSelect',
					'creationName': creationName
				});

			});

			//----------- End of Rule 81 --------------//  

			//----------- Start of Rule 84 , Rule 85, Rule 86 and Rule 88 --------------//

			// add js-ga-carousel in carousel-wrapper class in the page.

			// nestedCarouselSliderGARules('pageCollectionSFY');

			//----------- End of Rule 84 , Rule 85, Rule 86 and Rule 88 --------------//

			//----------- Start of Rule 87 --------------//  

			$('.sfy-backtoTop').on('click', function() {

				dataLayer.push({
					'event': 'pageCollectionSFYClickTop',
					'creationName': creationName
				});

			});

			//----------- End of Rule 87 --------------//  

		}

		//----------------------  End SFY Step 1 -----------------------//

		//----------------------  Start SFY step 2 -----------------------//

		if (_cache.$wrapper.hasClass("js-ga-sfy-step-2")) {

			var budgetRange, creationSelected;


			creationSelected = $('.previewSlider h2.product-name').html();
			creationSelected = cartier.common.toTitleCase(creationSelected);

			//----------- Start of Rule 89 --------------//  

			dataLayer.push({
				'page': adaptive + '/' + uri + '?SFY_Step= 2',
				'creationSelected': creationSelected
			});

			//----------- End of Rule 89 --------------//

			//----------- Start of Rule 90 --------------//

			$('.js-find-select-diamond').on('click', function() {
				dataLayer.push({
					'event': 'pageCollectionSFY2More'
				});
			});

			//----------- End of Rule 90 --------------//

			$('.selection-list li.selection-criteria').on('mouseup', function() {
				var selection = $(this).find('.sfy-heading4').html().toLowerCase(),
					range1,
					range2;

				if (typeof selection !== 'undefined') {
					switch (selection) {
						case 'price range':

							//----------- Start of Rule 91 --------------//

							range1 = $(this).find('.ui-slider-handle span').eq(0).html();
							range2 = $(this).find('.ui-slider-handle span').eq(1).html();

							range1 = range1.replace('$', '');
							range1 = parseFloat(range1).toFixed(2);

							range2 = range2.replace('$', '');
							range2 = parseFloat(range2).toFixed(2);

							dataLayer.push({
								'event': 'pageCollectionSFY2Budget',
								'budgetRange': '$' + range1 + '- $' + range2
							});

							//----------- End of Rule 91 --------------//

							break;

						case 'carat':

							//----------- Start of Rule 92 --------------//

							range1 = $(this).find('.ui-slider-handle span').eq(0).html();
							range2 = $(this).find('.ui-slider-handle span').eq(1).html();

							range1 = range1.replace('$', '');
							range1 = parseFloat(range1).toFixed(2);

							range2 = range2.replace('$', '');
							range2 = parseFloat(range2).toFixed(2);

							dataLayer.push({
								'event': 'pageCollectionSFY2Carat',
								'caratRange': range1 + ' - ' + range2
							});

							//----------- End of Rule 92 --------------//

							break;
					}
				}

			});

			$('.selection-list li.selection-criteria').on('click', function() {
				var selection = $(this).find('.sfy-heading4').html().toLowerCase(),
					checkboxes = [];

				if (typeof selection !== 'undefined') {
					switch (selection) {
						case 'color':

							//----------- Start of Rule 93 --------------//

							$(this).find('.checkbox-wrpper span.checked input[type="checkbox"]').each(function(index, element) {
								checkboxes.push($(element).val());
							});

							dataLayer.push({
								'event': 'pageCollectionSFY2Color',
								'colorsSelected': checkboxes.join('-')
							});

							//----------- End of Rule 93 --------------//

							break;

						case 'clarity':

							//----------- Start of Rule 94 --------------//

							$(this).find('.checkbox-wrpper span.checked input[type="checkbox"]').each(function(index, element) {
								checkboxes.push($(element).val());
							});

							dataLayer.push({
								'event': 'pageCollectionSFY2Clarity',
								'claritySelected': checkboxes.join('-')
							});

							//----------- End of Rule 94 --------------//

							break;
					}
				}

			});

			//----------- Start of Rule 95 --------------//

			$('.sfy-help-carousel .bx-controls-direction-left').on('click', function() {
				onPageLoad = false;
				dataLayer.push({
					'event': "pageCollectionSFY2SlidePrevious"
				});
			});
			//----------- End of Rule 95 --------------//

			//----------- Start of Rule 96 --------------//

			$('.sfy-help-carousel .bx-controls-direction-right').on('click', function() {
				onPageLoad = false;
				dataLayer.push({
					'event': "pageCollectionSFY2SlideNext"
				});
			});

			//----------- End of Rule 96 --------------//

			//----------- Start of Rule 97 --------------//

			$('.bridal-sfy-preview .bx-pager').on('click', function(e) {
				if ($(e.target).hasClass('active')) {
					onPageLoad = false;
					dataLayer.push({
						'event': "pageCollectionSFY2SlideDot"
					});
				}
			});

			//----------- Start of Rule 97 --------------//

			//----------- Start of Rule 98 --------------//  

			$('.sfy-backtoTop').on('click', function() {
				dataLayer.push({
					'event': "pageCollectionSFY2ClickTop"
				});
			});

			//----------- End of Rule 98 --------------// 

			//----------- Start of Rule 99 --------------// 

			$('.term-of-use-link a').on('click', function() {
				_destinationPagePusher({
					'event': "pageCollectionSFY2Terms"
				});
			});

			//----------- End of Rule 99 --------------// 
		}

		//----------------------  End SFY step 2 -----------------------//

		//-------------------- Start SFY step 3 --------------------//

		if (_cache.$wrapper.hasClass("js-ga-sfy-step-3")) {
			var previous_Object = {},
				productName,
				productId;

			//----------- Start of Rule 100 --------------//

			productName = $('.sfy-result__infos h1 .model__name').data('product-name');
			productName = cartier.common.toTitleCase(productName);
			productId = $('.sfy-result__infos h1 .model__reference').data('product-id');

			dataLayer.push({
				'page': adaptive + '/' + uri + "?SFY_Step= 3",
				'productId': productName,
				'productName': productId
			});

			//----------- End of Rule 100 --------------//

			//----------- Start of Rule 101--------------//

			$('.zoom-cursor').on('click', function() {
				dataLayer.push({
					'event': "pageCollectionSFY3SlideZoom"
				});
			});

			//----------- End of Rule 101 --------------//


			//----------- Start of Rule 102 --------------//


			$('.stepOneBlockOne .sfy-result__infos .more').on('click', function() {
				dataLayer.push({
					'event': "pageCollectionSFY3Diamonds"
				});
			});

			//----------- End of Rule 102--------------//

			//----------- Start of Rule 103--------------//

			$('.more-price').on('click', function() {
				dataLayer.push({
					'event': "pageCollectionSFY3Price"
				});
			});

			//----------- End of Rule 103--------------//

			//----------- Start of Rule 104--------------//

			$('.sfy-result__contact a').on('click', function() {
				dataLayer.push({
					'event': "pageCollectionSFY3Ambassador"
				});
			});

			//----------- End of Rule 104--------------//


			//----------- Start of Rule 105--------------//

			$('.bx-prev').on('click', function() {
				dataLayer.push({
					'event': "pageCollectionSFY3SlidePrevious"
				});
			});

			//----------- End of Rule 105--------------//


			//----------- Start of Rule 106--------------//

			$('.bx-next').on('click', function() {
				dataLayer.push({
					'event': "pageCollectionSFY3SlideNext"
				});
			});

			//----------- End of Rule 106--------------//

			//----------- Start of Rule 107--------------//

			$('.sfy-result__table .checkbox').on('click', function() {
				var current_Object = $(this);
				if (!current_Object.is(previous_Object)) {
					previous_Object = current_Object;
					var TD = $(this).parent().find("td"),
						creationCarat = $(TD[1]).attr("data-gtm"),
						creationColor = $(TD[2]).attr("data-gtm"),
						creationClarity = $(TD[3]).attr("data-gtm"),
						creationPrice = $(TD[4]).attr("data-gtm");
					dataLayer.push({
						'event': "pageCollectionSFY3Selection",
						'creationCarat': creationCarat,
						'creationColor': creationColor,
						'creationClarity': creationClarity,
						'creationPrice': creationPrice
					});
				}
			});

			//----------- End of Rule 107--------------//


			//----------- Start of Rule 108--------------//

			$('.red-button.js-request-popup').on('click', function() {
				dataLayer.push({
					'event': "pageCollectionSFY3Information"
				});
			});

			//----------- End of Rule 108--------------//



		}

		//------------------------  End SFY step 3 ---------------------------------//


		// ------------------- Start SFY article Page---------------------------------//


		if (_cache.$wrapper.hasClass("js-ga-sfy-article-page")) {

			//----------- Start of Rule 109 and Rule 110--------------//

			$('.social-icons a').on("click", function() {
				var socialNetwork = $(this).attr("data-gtm");
				if (socialNetwork != undefined) {
					dataLayer.push({
						'event': "social",
						"socialNetwork": socialNetwork,
						"socialAction": "Share"
					});
				}

			});

			//----------- End of Rule 109 and Rule 110--------------//
		}

		//----------------------------  End  SFY article Page----------------------------//


		//--------------------- Start  Contact Pages--------------------------------- //

		if (_cache.$wrapper.hasClass("js-ga-contact-page")) {

			var requestCategory = "Sales policy";

			//----------- Start of Rule 113--------------//

			$('.js-country-detail .js-contact-cont-amb-but').on('click', function() {
				dataLayer.push({
					'event': "contactEmail"
				});
			});

			//----------- End of Rule 113--------------//


			//----------- Start of Rule 114 and Rule 115--------------//

			$('.contact-joining-cartier a').on('click', function() {
				$(this).attr('href', _shippingBackLinkModifier('origin=Contact', $(this).attr('href')));
			});


			//----------- End of Rule 114 and Rule 15--------------//


			//----------- Start of Rule 116--------------//

			$('select.js-country').on('change', function() {

				var countrySelected = $(this).find("option:selected").val().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');

				countrySelected = cartier.common.toTitleCase(countrySelected);

				dataLayer.push({
					'event': "contactCountrySelect",
					"contactCountrySelected": countrySelected
				});
			});


			//----------- End of Rule 116--------------//

			//------------------- Start Contact form pop-in----------------------------//


			//----------- Start of Rule 117, Rule 118, Rule 119, Rule 293 --------------//

			//call function contactFormPopup() in plugin object after popup comes in the backend


			//----------- End of Rule 117, Rule 118, Rule 119, Rule 293 --------------//


			//------------------- End Contact form pop-in----------------------------//


			//------------------- Start Contact confirmation pop-in----------------------------//


			//----------- Start of Rule 120, Rule 121, Rule 122 and Rule 294--------------//

			//call function contactConfirmationFormPopup() in plugin object after popup comes in the backend


			//----------- End of Rule 120, Rule 121, Rule 122 and Rule 294--------------//


			//------------------- End Contact confirmation pop-in----------------------------//


		}


		//---------------------------- End Contact Pages ----------------------------------//


		//---------------------------- Start The Maison homepage ----------------------------------//

		if (_cache.$wrapper.hasClass("js-ga-maison-home-page")) {


			//----------- Start of Rule 123 , Rule 124 , Rule 125 and Rule 126 --------------//

			// add js-ga-carousel in carousel-wrapper class in the page.

			_carouselGARules('maison');

			//----------- autoslider --------------//

			_autoSliderChecker('maison');

			//----------- autoslider --------------//

			//----------- End of Rule 123 , Rule 124 , Rule 125 and Rule 126 --------------//


			//----------- Start of Rule 127  --------------//

			$('.carousel__pic-desc a').attr('href', _shippingBackLinkModifier('origin=SliderHome', $('.carousel__pic-desc a').attr('href')));

			//----------- End of Rule 127  --------------//

			//----------- Start of Rule 128  --------------//

			$('a.push-link').attr('href', _shippingBackLinkModifier('origin=TheMaison_Homepage', $('a.push-link').attr('href')));

			//----------- End of Rule 128  --------------//


		}


		//---------------------------- End The Maison homepage ----------------------------------//


		//-------------------------- Start The Maison history & stories homepage -------------------------//

		if (_cache.$wrapper.hasClass("js-ga-maison-history-stories-page")) {


			//----------- Start of Rule 129 , Rule 130 --------------//

			// add js-ga-carousel in carousel-wrapper class in the page.

			_carouselGARules('maisonHistory');

			//----------- End of Rule 129 , Rule 130  --------------//

			//----------- Start of Rule 131  --------------//

			$('.carousel__pic-desc a').attr('href', _shippingBackLinkModifier('origin=Slider', $('.carousel__pic-desc a').attr('href')));

			//----------- End of Rule 131  --------------//


			//----------- Start of Rule 132  --------------//

			$('a.push-link').attr('href', _shippingBackLinkModifier('origin=TheMaison_History_Stories_Home', $('a.push-link').attr('href')));

			//----------- End of Rule 132  --------------//

		}


		//----------------------- End The Maison  history & stories  homepage ----------------------------//



		//------------------------- Start The Maison Living heritage page --------------------------------//

		if (_cache.$wrapper.hasClass("js-ga-living-heritage-page")) {


			//----------- Start of Rule 133  --------------//

			$('a.push-link').attr('href', _shippingBackLinkModifier('origin=TheMaison_Living Heritage', $('a.push-link').attr('href')));

			//----------- End of Rule 133  --------------//

			//----------- Start of Rule 134  --------------//

			$('a.mosaic-image').on('click', function(e) {
				var elementcategory = $(this).data('element-category');
				$(this).attr('href', _shippingBackLinkModifier('origin=TheMaison_Living Heritage_' + elementcategory, $(this).attr('href')));
			});

			//----------- End of Rule 134  --------------//

		}


		//-------------------------- End The Maison Living heritage page-------------------------------//



		//--------------- Start The Maison The Cartier Collection Product selection page ------------------//

		if (_cache.$wrapper.hasClass("js-ga-maison-collection-product-selection-page")) {


			//----------- Start of Rule 135  --------------//

			$('a.mosaic-image').on('click', function(e) {
				var element_category = $(this).data('element-category');
				var maison_product = $(this).data('maison-product');

				if (typeof element_category !== 'undefined' && typeof maison_product !== 'undefined') {
					$(this).attr('href', _shippingBackLinkModifier('origin=TheMaison_The Cartier Collection_Product selection_' + element_category + '_' + maison_product, $(this).attr('href')));
				} else if (typeof element_category !== 'undefined') {
					$(this).attr('href', _shippingBackLinkModifier('origin=TheMaison_The Cartier Collection_Product selection_' + element_category, $(this).attr('href')));
				}
			});

			//----------- End of Rule 135  --------------//


			//----------- Start of Rule 136  --------------//

			$('a.link-title').on('click', function(e) {
				var element_category = $(this).data('element-category');
				$(this).attr('href', _shippingBackLinkModifier('origin=TheMaison_The Cartier Collection_Product selection_' + element_category, $(this).attr('href')));
			});

			//----------- End of Rule 136  --------------//

		}


		//----------------- End The Maison The Cartier Collection Product selection page ----------------//



		//------------------------- Start The Maison Events home page --------------------------------//

		if (_cache.$wrapper.hasClass("js-ga-maison-events-homepage")) {


			//----------- Start of Rule 137  --------------//

			$('.carousel__pic-desc a').attr('href', _shippingBackLinkModifier('origin=Slider', $('.carousel__pic-desc a').attr('href')));

			//----------- End of Rule 137  --------------//


			//----------- Start of Rule 138 , Rule 139 , Rule 140 --------------//

			// add js-ga-carousel in carousel-wrapper class in the page.

			_carouselGARules('maisonEvents');

			//----------- End of Rule 138 , Rule 139 , Rule 140  --------------//

		}


		//-------------------------- End The Maison  Events home page --------------------------------//


		//---------------------------- Start The Maison  Know How page -------------------------------//

		if (_cache.$wrapper.hasClass("js-ga-maison-know-how-page")) {


			//----------- Start of Rule 141  --------------//

			$('.carousel__pic-desc a').attr('href', _shippingBackLinkModifier('origin=Slider', $('.carousel__pic-desc a').attr('href')));

			//----------- End of Rule 141  --------------//


			//----------- Start of Rule 142 , Rule 143 , Rule 144 --------------//

			// add js-ga-carousel in carousel-wrapper class in the page.

			_carouselGARules('maisonKnowHow');

			//----------- End of Rule 142 , Rule 143 , Rule 144  --------------//

		}


		//---------------------------- End The Maison  Know How page -------------------------------//



		//---------------------------- Start The Maison Commitments page ------------------------------//

		if (_cache.$wrapper.hasClass("js-ga-maison-commitments-page")) {


			//----------- Start of Rule 145  --------------//

			$('.carousel__pic-desc a').attr('href', _shippingBackLinkModifier('origin=Slider', $('.carousel__pic-desc a').attr('href')));

			//----------- End of Rule 145  --------------//


			//----------- Start of Rule 146 , Rule 147 , Rule 148 --------------//

			// add js-ga-carousel in carousel-wrapper class in the page. 

			_carouselGARules('maisonCommitments');

			//----------- End of Rule 146 , Rule 147 , Rule 148  --------------//


			//----------- Start of Rule 149  --------------//

			$('a.push-link').attr('href', _shippingBackLinkModifier('origin=TheMaison_Commitments', $('a.push-link').attr('href')));

			//----------- End of Rule 149  --------------//

		}


		//---------------------------- End The Maison Commitments page -------------------------------//



		//---------------------------- Start The Maison Editorial Template ------------------------------//

		if (_cache.$wrapper.hasClass("js-ga-maison-editorial-template-page")) {

			//----------- Start of Rule 150 , Rule 151 --------------//

			$('.social-share li a').on("click", function() {
				var socialNetwork = $(this).attr("data-gtm");
				if (socialNetwork != undefined) {
					dataLayer.push({
						'event': "social",
						"socialNetwork": socialNetwork,
						"socialAction": "Share"
					});
				}
			});


			//----------- End of Rule 150 , Rule 151 --------------//

		}


		//---------------------------- End The Maison Editorial Template ------------------------------//


		//---------------------------- Start The Maison Cartier Connected ------------------------------//

		if (_cache.$wrapper.hasClass("js-ga-maison-cartier-connected-page")) {


			//----------- Start of Rule 152  --------------//

			$('.carousel__pic-desc a').attr('href', _shippingBackLinkModifier('origin=Slider', $('.carousel__pic-desc a').attr('href')));

			//----------- End of Rule 152  --------------//


			//----------- Start of Rule 153 , Rule 154 , Rule 155 --------------//

			// add js-ga-carousel in carousel-wrapper class in the page.

			_carouselGARules('maisonCartier');

			//----------- End of Rule 153 , Rule 154 , Rule 155  --------------//


			//----------- Start of Rule 156  --------------//

			$('a.push-link').attr('href', _shippingBackLinkModifier('origin=TheMaison_CartierConnected', $('a.push-link').attr('href')));

			//----------- End of Rule 156  --------------//

		}


		//---------------------------- End The Maison Cartier Connected -------------------------------//



		//---------------------------- Start Services - Homepage --------------------------------//

		if (_cache.$wrapper.hasClass("js-ga-services-homepage")) {


			//----------- Start of Rule 159  --------------//

			$('.carousel__pic-desc a').attr('href', _shippingBackLinkModifier('origin=Slider', $('.carousel__pic-desc a').attr('href')));

			//----------- End of Rule 159  --------------//

			//----------- Start of Rule 160  --------------//

			$('a.push-link , .more-button , .text-link').each(function(index, el) {
				$(el).attr('href', _shippingBackLinkModifier('origin=services_Homepage', $(el).attr('href')));
			});

			//----------- End of Rule 160  --------------//


			//----------- Start of Rule 161 , Rule 162 , Rule 163 --------------//

			// add js-ga-carousel in carousel-wrapper class in the page.

			_carouselGARules('services');

			//----------- End of Rule 161 , Rule 162 , Rule 163  --------------//

		}


		//---------------------------- End Services - Homepage --------------------------------//



		//---------------------------- Start Services Editorial - FAQ pages -------------------------------//

		if (_cache.$wrapper.hasClass("js-ga-services-editorial-faq-page")) {


			//----------- Start of Rule 164  --------------//

			$('.js-accordion_node__title').on('click', function(event) {
				dataLayer.push({
					'event': "servicesGuideQuestion",
					"faqQuestion": $(this).find('.faq-view_node_title__ques').text().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ')
				})
			});

			//----------- End of Rule 164  --------------//

		}


		//---------------------------- End Services Editorial - FAQ pages --------------------------------//



		//----------------------- Start Services Editorial - Article pages ------------------------------//

		if (_cache.$wrapper.hasClass("js-ga-services-article-page") || _cache.$wrapper.hasClass("js-ga-search-error")) {


			//----------- Start of Rule 165  --------------//

			$('.js-social-share a').on("click", function() {
				var socialNetwork = $(this).attr("data-gtm");
				if (socialNetwork != undefined) {
					dataLayer.push({
						'event': "social",
						"socialNetwork": socialNetwork,
						"socialAction": "Share"
					});
				}
			});

			//----------- End of Rule 165  --------------//

		}


		//------------------------ End Services Editorial - Article pages ------------------------------//



		//-------------- Start Services - My Cartier / Login  Create An Account -----------------------//

		if (_cache.$wrapper.hasClass("js-ga-login-page")) {

			//----------- Start of Rule 169  --------------//

			$('.js-reg-step-1 .form-element input').on('click blur', function() {
				var inputType = $(this).attr("type"),
					inputName = $(this).attr("name");
				if (inputType != "submit" && inputType != undefined && inputName != undefined) {
					_pushUniqueDataObjectOnBlur({
						'event': "servicesConnectionField",
						'nameOfTheField': nameResovler(inputName)
					}, 'nameOfTheField', inputName);
				}
			});


			//----------- End of Rule 169  --------------//

		}


		//---------------- End Services My Cartier / Login  Create An Account -----------------------//



		//---------------------------- Start Services - Services - My Cartier  Registration - confirmation : additional informations 1----------------------------------//


		if (_cache.$wrapper.hasClass("js-ga-register-step-2-page")) {

			//var createAccount_step2 = adaptive + '/' + uri + "/createAccount_step2";

			//----------- Start of Rule 172  --------------//

			/*dataLayer.push({
				'page': createAccount_step2
			});*/

			//----------- End of Rule 172  --------------//


			//----------- Start of Rule 178  --------------//

			$('fieldset .form-element input').on('click blur', function() {
				var inputType = $(this).attr("type"),
					inputName = $(this).val();

				inputName = productnNameResovler(inputName);

				inputName = cartier.common.toTitleCase(inputName);

				if (inputType != "submit" && inputType != undefined && inputName != undefined) {
					_pushUniqueDataObjectOnBlur({
						'event': "servicesAdditionalInformation1",
						'nameOfTheField': inputName
					}, 'nameOfTheField', inputName);
				}
			});

			//----------- End of Rule 178  --------------//

			//----------- Start of Rule 180  --------------//

			$('fieldset a').on('click', function() {
				$(this).attr('href', _shippingBackLinkModifier('origin=skipAdditionalInformations_step1', $(this).attr('href')));
			});

			//----------- End of Rule 180  --------------//

		}


		//---------------------------- End Services - My Cartier  Registration - confirmation : additional informations 1---------------------------------//


		//---------------------------- Start Services - Services - My Cartier  Registration - confirmation : additional informations 2----------------------------------//


		if (_cache.$wrapper.hasClass("js-ga-register-step-3-page")) {

			//var createAccount_step2 = adaptive + '/' + uri + "/createAccount_step3";

			//----------- Start of Rule 181  --------------//

			/*dataLayer.push({
				'page': createAccount_step2
			});*/

			//----------- End of Rule 181  --------------//


			//----------- Start of Rule 183  --------------//

			$('fieldset .form-element select').on('change', function() {
				var inputName = $(this).attr("name");

				if (inputName != undefined) {
					_pushUniqueDataObjectOnBlur({
						'event': "servicesAdditionalInformation2Field",
						'nameOfTheField': nameResovler(inputName)
					}, 'nameOfTheField', inputName);
				}
			});

			$('fieldset .form-element input').on('click blur', function() {
				var inputType = $(this).attr("type"),
					inputName = $(this).attr("name");
				if (inputType != "submit" && inputType != undefined && inputName != undefined) {
					_pushUniqueDataObjectOnBlur({
						'event': "servicesAdditionalInformation2Field",
						'nameOfTheField': nameResovler(inputName)
					}, 'nameOfTheField', inputName);
				}
			});

			//----------- End of Rule 183  --------------//


			//----------- Start of Rule 184  --------------//

			$('fieldset a').on('click', function() {
				$(this).attr('href', _shippingBackLinkModifier('origin=skipAdditionalInformations_step2', $(this).attr('href')));
			});

			//----------- End of Rule 184  --------------//

		}


		//---------------------------- End Services - My Cartier  Registration - confirmation : additional informations 2---------------------------------//


		//---------------------------- Start Services  - My Cartier Logged-in----------------------------------//


		if (_cache.$wrapper.hasClass("js-ga-mycartier-login-page")) {


			//----------- Start of Rule 188  --------------//

			$('.pushes-wrapper-service-push a').on('click', function() {
				$(this).attr('href', _shippingBackLinkModifier('origin=myCartier', $(this).attr('href')));
			});

			//----------- End of Rule 188  --------------//


			//----------- Start of Rule 189  --------------//

			$('.logout').on('click', function() {
				_destinationPagePusher({
					'event': "cartierLogout"
				});

				cartier.common.removeItemOnLogout();
			});

			//----------- End of Rule 189  --------------//

		}


		//---------------------------- End Services  - My Cartier Logged-in---------------------------------//


		//---------------------------- Start Services  - My Cartier Subscriptions & interests----------------------------------//



		if (_cache.$wrapper.hasClass("js-ga-mycartier-subscription-page")) {

			var onchange_newsletter = false;
			var onchange_catalogue = false;

			var chkfn_newsletter = $('.fn_newsletter input[type=checkbox][name="fn_newsletter"]').prop('checked');
			var chkfn_catalogue = $('.fn_catalogue input[type=checkbox][name="fn_catalogue"]').prop('checked');

			$('.button-wrapper input[type=submit]').on('click', function() {

				if ($('.fn_newsletter input[type=checkbox][name="fn_newsletter"]').prop('checked') != chkfn_newsletter) {
					onchange_newsletter = true;
				}

				if ($('.fn_catalogue input[type=checkbox][name="fn_catalogue"]').prop('checked') != chkfn_catalogue) {
					onchange_catalogue = true;
				}

				chkfn_newsletter = $('.fn_newsletter input[type=checkbox][name="fn_newsletter"]').prop('checked');
				chkfn_catalogue = $('.fn_catalogue input[type=checkbox][name="fn_catalogue"]').prop('checked');

				var subscriptionStatus = [];

				if (onchange_newsletter) {

					if (chkfn_newsletter) {
						//----------- Start of Rule 190  --------------//
						_destinationPagePusher({
							'event': "cartierNewsletterSubscription"
						});
						//----------- End of Rule 190  --------------// 
					} else {
						//----------- Start of Rule 192  --------------//
						_destinationPagePusher({
							'event': "cartierNewsletterUnsubscription"
						});
						//----------- End of Rule 192  --------------//
					}
				}

				if (onchange_catalogue) {

					if (chkfn_catalogue) {
						//----------- Start of Rule 193  --------------//
						_destinationPagePusher({
							'event': "cartierOtherNewsletterSubscription"
						});
						//----------- End of Rule 193  --------------//
					} else {
						//----------- Start of Rule 195  --------------//
						_destinationPagePusher({
							'event': "cartierOtherNewsletterUnsubscription"
						});
						//----------- End of Rule 195  --------------//
					}
				}

				//_destinationPagePusher(subscriptionStatus);

			});

			//----------- Start of Rule 194 --------------//
			$('.fn_grpinterdin input[type=checkbox][name="fn_grpinterdin"]').on('change', function() {
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

			//----------- End of Rule 194 --------------//
		}

		//---------------------------- End Services  - My Cartier Subscriptions & interests---------------------------------//

		//---------------------------- Start MY CARTIER - MY ADDRESSES ---------------------------------//

		if (_cache.$wrapper.hasClass("js-ga-mycartier-addresses")) {

			//----------- Start of Rule 213 --------------//

			$('.js-address-form-jp input, .js-address-form input, .js-address-form-jp textarea , .js-address-form textarea').on('click blur', function() {
				var inputType = $(this).attr("type"),
					inputName = $(this).attr("name");

				if (inputType != "submit" && inputType != undefined && inputName != undefined) {
					_pushUniqueDataObjectOnBlur({
						'event': "addressesField",
						'nameOfTheField': nameResovler(inputName)
					}, 'nameOfTheField', inputName);
				}
			});

			$('.js-address-form-jp select, .js-address-form select').on('change', function() {
				var inputName = $(this).attr("name");

				if (inputName != undefined) {
					_pushUniqueDataObjectOnBlur({
						'event': "addressesField",
						'nameOfTheField': nameResovler(inputName)
					}, 'nameOfTheField', inputName);
				}
			});


			//----------- End of Rule 213 --------------//

			//----------- Start of Rule 215 --------------//

			$('.addressAction .button.marginR a.edit_add').on('click', function() {
				dataLayer.push({
					'event': "addressesEdit"
				});
			});

			//----------- Start of Rule 215 --------------//

		}

		//---------------------------- End MY CARTIER - MY ADDRESSES ---------------------------------//


		//-------------------- Start MY CARTIER - MY PERSONAL INFORMATION ---------------------------//

		if (_cache.$wrapper.hasClass("js-ga-mycartier-mypersonal-info")) {

			//----------- Start of Rule 218 --------------//

			$('#js-personal-info-form input, #personalinformation_form textarea').on('click blur', function() {
				var inputType = $(this).attr("type"),
					inputName = $(this).attr("name");

				if (inputType != "submit" && inputType != undefined && inputName != undefined) {
					_pushUniqueDataObjectOnBlur({
						'event': "personalInformationField",
						'nameOfTheField': nameResovler(inputName)
					}, 'nameOfTheField', inputName);
				}
			});

			$('#js-personal-info-form select').on('change', function() {
				var inputName = $(this).attr("name");

				if (inputName != undefined) {
					_pushUniqueDataObjectOnBlur({
						'event': "personalInformationField",
						'nameOfTheField': nameResovler(inputName)
					}, 'nameOfTheField', inputName);
				}
			});

			//----------- End of Rule 218 --------------//
		}

		//-------------------- End MY CARTIER - MY PERSONAL INFORMATION ---------------------------//


		//-------------------- Start BOUTIQUE - SEARCH RESULTS ---------------------------//

		if (_cache.$wrapper.hasClass("js-ga-cartier-boutiques")) {

			var boutiqueFilter,
				boutiqueSearchLocation = $.jStorage.get('boutiqueSearchLocation'),
				boutiqueCountrySelected = $.jStorage.get('boutiqueCountrySelected'),
				boutiqueSearchCity = $.jStorage.get('boutiqueCitySelected');


			// -------- Start of Rule 222 -------------//

			if (typeof boutiqueCountrySelected !== 'undefined') {
				dataLayer.push(boutiqueCountrySelected);
			}


			// -------- End of Rule 222 -------------//

			// -------- Start of Rule 223 -------------//

			if (typeof boutiqueSearchCity !== 'undefined') {
				dataLayer.push(boutiqueSearchCity);
			}


			// -------- Start of Rule 223 -------------//

			if (typeof boutiqueSearchLocation !== 'undefined') {

				//----------- Start of Rule 224 and Rule 225 --------------//

				$('.boutique-single-filter').on('click', function() {
					if ($('.boutique-single-filter.active').length) {

						dataLayer.push({
							'event': "boutiqueSearchTickCartier",
							'boutiqueSearchTerm': $('.js-location').find('input').val()
						});

					} else {

						dataLayer.push({
							'event': "boutiqueSearchUntickCartier",
							'boutiqueSearchTerm': $('.js-location').find('input').val()
						});

					}

					//----------- End of Rule 224 and Rule 225 --------------//

				});

			}

			//----------- Start of Rule 226 and Rule 227 --------------//

			$('.boutique_filter_detail li').on('click', function() {

				boutiqueFilter = $(this).attr('data-filter-id');
				boutiqueFilter = cartier.common.toTitleCase(boutiqueFilter);

				if ($(this).hasClass('selected')) {
					dataLayer.push({
						'event': "boutiqueSearchAddFilter",
						'boutiqueFilter': boutiqueFilter
					});
				} else {
					dataLayer.push({
						'event': "boutiqueSearchRemoveFilter",
						'boutiqueFilter': boutiqueFilter
					});
				}

			});

			//----------- End of Rule 226 and Rule 227 --------------//

		}

		//-------------------- End BOUTIQUE - SEARCH RESULTS ---------------------------//


		//-------------------- Start BOUTIQUE - DETAIL PAGE ---------------------------//

		if (_cache.$wrapper.hasClass("js-ga-boutique-detail-page")) {

			//----------- Start of Rule 229 and Rule 230 --------------//

			$('.social-share li a').on('click', function() {

				var socialNetwork = $(this).attr("data-gtm");

				if (socialNetwork != undefined) {
					dataLayer.push({
						'event': "social",
						"socialNetwork": socialNetwork,
						"socialAction": "Share"
					});
				}
			});

			//----------- End of Rule 229 and Rule 230 --------------//
		}

		//-------------------- Start BOUTIQUE - DETAIL PAGE ---------------------------//


		//---------------------------- Start PURCHASE FUNNEL - SHOPPING BAG ---------------------------------//

		if (_cache.$wrapper.hasClass("js-ga-shopping-bag")) {

			//----------- Start of Rule 249 --------------//
			$('.back-button a').on('click', function() {
				$(this).attr('href', _shippingBackLinkModifier('origin=shoppingBag', $(this).attr('href')));
			});
			//----------- End of Rule 249 --------------//

		}

		//---------------------------- End PURCHASE FUNNEL - SHOPPING BAG ---------------------------------//


		// ---------------------------- Start FORGOT YOUR PASSWORD POPIN ---------------------------//

		// -------- Start of Rule 253 -------------//

		if ($('#js-forgotpassword').length) {
			dataLayer.push({
				'page': adaptive + "/" + uri + "/" + "Pop-in_Forgot_your_password" + "/" + visitorStatus
			});
		}

		// -------- End of Rule 253 -------------//

		// ---------------------------- End FORGOT YOUR PASSWORD POPIN ---------------------------//

		//---------------------------- Start PURCHASE FUNNEL - BILLING ADDRESS PAGE -------------------------//

		if (_cache.$wrapper.hasClass("js-ga-billing-address-page")) {

			/*dataLayer.push({ //// Should work
                "type": type,
                "page": uri + "/" + type + "/" + visitorStatus
            });*/

			// --------Start of Rule 261 -------------//

			// Need to implement this rule directly online.

			//console.log($('#commerce-checkout-form-checkout'));

			// --------End of Rule 261 -------------//

			// --------Start of Rule 263 -------------//

			$('.js-billing-section-one input, .js-billing-section-one textarea').on('click blur', function() {
				var inputType = $(this).attr("type"),
					inputName = $(this).attr("name");
				if (inputType != "submit" && inputType != undefined && inputName != undefined) {
					_pushUniqueDataObjectOnBlur({
						'event': "billingAddressField",
						'nameOfTheField': nameResovler(inputName)
					}, 'nameOfTheField', inputName);
				}
			});

			$('.js-billing-section-one select').on('change', function() {
				var inputName = $(this).attr("name");

				if (inputName != undefined) {
					_pushUniqueDataObjectOnBlur({
						'event': "billingAddressField",
						'nameOfTheField': nameResovler(inputName)
					}, 'nameOfTheField', inputName);
				}
			});

			// --------End of Rule 263 -------------//

			// --------Start of Rule 264 -------------//

			$('.js-back-to-shopping-bag a').on('click', function() {
				$(this).attr('href', _shippingBackLinkModifier('origin=billing_address_back_link', $(this).attr('href')));
			});

			//---------- End of Rule 264 -------------------- //

			// --------Start of Rule 265 -------------//

			$('.price-details-bg .price-detail a.more-button').on('click', function() {
				$(this).attr('href', _shippingBackLinkModifier('origin=billing_address_modify_link', $(this).attr('href')));
			});

			//---------- End of Rule 265-------------------- //

			// --------Start of Rule 266 -------------//
			$('.js-edit-address').on('click', function() {
				dataLayer.push({
					'event': "billingAddressEdit"
				});
			});
			// --------End of Rule 266 -------------//

			// --------Start of Rule 267 -------------//
			$('.js-addnew-address').on('click', function() {
				dataLayer.push({
					'event': "billingAddressNew"
				});
			});
			// --------End of Rule 267 -------------//


		}

		//---------------------------- End PURCHASE FUNNEL - BILLING ADDRESS PAGE ---------------------------//


		//---------------------------- Start PURCHASE FUNNEL - SHIPPING PAGE --------------------------------//

		if (_cache.$wrapper.hasClass("js-ga-purchase-funnel-shipping-page")) {

			//----------- Start of Rule 270  ------ Also coded in Billing js--------//

			if ($('.js-ga-purchase-funnel-shipping-page').length) {

				$('.choose-tab .tabs__nav li').eq(0).on('click', function() {
					dataLayer.push({
						'event': "virtualPageview",
						"page": adaptive + '/' + uri + "/" + 'deliver_to_my_billing_address' + "/" + type + "/" + visitorStatus
					});
				});

				//----------- End of Rule 270 --------------//

				//----------- Start of Rule 271  --------------//

				$('.choose-tab .tabs__nav li').eq(1).on('click', function() {
					dataLayer.push({
						'event': "virtualPageview",
						"page": adaptive + '/' + uri + "/" + 'to_another_address' + "/" + type + "/" + visitorStatus
					});
				});

				//----------- End of Rule 271 --------------//
				//
				//
				//
				//----------- Start of Rule 272  --------------//

				$('.choose-tab .tabs__nav li').eq(2).on('click', function() {
					dataLayer.push({
						'event': "virtualPageview",
						"page": adaptive + '/' + uri + "/" + 'boutique_pick_up' + "/" + type + "/" + visitorStatus
					});
				});
			}

			//----------- End of Rule 272 --------------//

			//----------- Start of Rule 273 --------------//

			$('.js-billing-section-one input, .js-billing-section-one textarea').on('click blur', function() {
				var inputType = $(this).attr("type"),
					inputName = $(this).attr("name");
				if (inputType != "submit" && inputType != undefined && inputName != undefined) {
					_pushUniqueDataObjectOnBlur({
						'event': "shippingField",
						'nameOfTheField': nameResovler(inputName)
					}, 'nameOfTheField', inputName);
				}
			});

			$('.js-billing-section-one select').on('change', function() {
				var inputName = $(this).attr("name");

				if (inputName != undefined) {
					_pushUniqueDataObjectOnBlur({
						'event': "shippingField",
						'nameOfTheField': nameResovler(inputName)
					}, 'nameOfTheField', inputName);
				}
			});

			//----------- End of Rule 273 --------------//


			// --------Start of Rule 274 -------------//

			$('.js-back-to-shopping-bag a').on('click', function() {
				$(this).attr('href', _shippingBackLinkModifier('origin=shipping_back_link', $(this).attr('href')));
			});

			//---------- End of Rule 274 -------------------- //

			// --------Start of Rule 275 -------------//

			$('.price-details-bg .price-detail a.more-button').on('click', function() {
				$(this).attr('href', _shippingBackLinkModifier('origin=shipping_modify_link', $(this).attr('href')));
			});

			//---------- End of Rule 275-------------------- //

			// --------Start of Rule 276 -------------//

			$('.edit-footer__edit .edit-link').on('click', function() {
				_destinationPagePusher({
					'event': "shippingAddressEdit"
				});
			});

			// --------End of Rule 276 -------------//

		}

		//---------------------------- End PURCHASE FUNNEL - SHIPPING PAGE ----------------------------------//


		//---------------------------- Start PURCHASE FUNNEL - REVIEW ORDER PAGE -----------------------------//

		if (_cache.$wrapper.hasClass("js-ga-review-order")) {

			// -------- Start of Rule 280 -------------//

			$('.billing-address .edit-link ').on("click", function() {
				_destinationPagePusher({
					'event': "reviewBillingAddressEdit"
				});

			});

			// -------- End of Rule 280 -------------//

			// -------- Start of Rule 281 -------------//

			$('.shipping-address .edit-link ').on("click", function() {
				_destinationPagePusher({
					'event': "reviewShippingAddressEdit"
				});

			});

			// -------- End of Rule 281 -------------//

			// -------- End of Rule 282 -------------//

			$('.delivery-method .edit-link ').on("click", function() {
				_destinationPagePusher({
					'event': "reviewDeliveryOptionEdit"
				});

			});

			// -------- End of Rule 282 -------------//


			// --------Start of Rule 283 -------------//

			$('.js-back-to-shopping-bag a').on('click', function() {
				$(this).attr('href', _shippingBackLinkModifier('origin=review_order_back_link', $(this).attr('href')));
			});

			//---------- End of Rule 283 --------------------//

		}


		//---------------------------- End PURCHASE FUNNEL - REVIEW ORDER PAGE -----------------------------//


		//------------------------ Start PURCHASE FUNNEL - PAYMENT & SUMMARY PAGE ---------------------------//

		if (_cache.$wrapper.hasClass("js-ga-payment-summary")) {
			var page;

			// -------- Start of Rule 286 -------------//

			$('#uniform-js-card ').on("click", function() {
				page = adaptive + '/' + uri + "/credit_card/" + type + "/" + visitorStatus;
				dataLayer.push({
					'event': "virtualPageview",
					'page': page
				});

			});
			$('#uniform-js-bank ').on("click", function() {
				page = adaptive + '/' + uri + "/bank_transfer/" + type + "/" + visitorStatus;
				dataLayer.push({
					'event': "virtualPageview",
					'page': page
				});

			});
			$('#uniform-js-cash ').on("click", function() {
				page = adaptive + '/' + uri + "/cash_on_delivery/" + type + "/" + visitorStatus;
				dataLayer.push({
					'event': "virtualPageview",
					'page': page
				});

			});

			// -------- End of Rule 286 -------------//
		}

		//------------------------ End PURCHASE FUNNEL - PAYMENT & SUMMARY PAGE ---------------------------//


		//-------- Start NEWSLETTER SUBSCRIPTION - LIGHT ACCOUNT PAGE -STEP 1 ------------------//

		if (_cache.$wrapper.hasClass("js-ga-newsletter-subscription-step1")) {

			// -------- Start of Rule 295 -------------//

			$('.js-light-account-form .form-element input').on('click blur', function() {
				var inputType = $(this).attr("type"),
					inputName = $(this).attr("name");
				if (inputType != "submit" && inputType != undefined && inputName != undefined) {
					_pushUniqueDataObjectOnBlur({
						'event': "newsletterFormFieldSelection",
						'fieldName': nameResovler(inputName)
					}, 'fieldName', inputName);
				}
			});

			// -------- End of Rule 295 -------------//
		}

		//-------- End NEWSLETTER SUBSCRIPTION - LIGHT ACCOUNT PAGE -STEP 1 ------------------//

		if (_cache.$wrapper.hasClass("js-ga-boutique-detail-page")) {

			//----------- Start of Rule 207 --------------//

			$('.js-social-share__email').on('click', function() {
				dataLayer.push({
					'event': "boutiqueSendMailDesktop",
					'boutiqueName': $('.js-share-title span').text()
				});
			});
			//----------- End of Rule 207 --------------//
		}


		// ---------------------------- End OF JS OF GA FOR DESKTOP ----------------------------------//

	};

	Plugin.prototype.shoppingBagGARules = function(eventName) {

		//-------------------- Start PURCHASE FUNNEL - SHOPPING BAG --------------------------//

		// ------- Start of Rule 240, 241, 242, 243, 244, 245, 246, 248 and 250 -------------//

		if (_cache.$wrapper.hasClass("js-ga-shopping-bag")) {

			dataLayer.push({
				'event': eventName
			});
		}

		// ------- End of Rule 240, 241, 242, 243, 244, 245, 246, 248 and 250 -------------//

		//---------------------- End PURCHASE FUNNEL - SHOPPING BAG -------------------------//

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

	Plugin.prototype.billingAddressErrorMessage = function(errorMessage) {
		dataLayer.push({
			event: "billingAddressSubmitError",
			'errorMessage': errorMessage
		});
	};

	Plugin.prototype.billingAddressConfirmation = function(errorMessage) {

		if (_cache.$wrapper.hasClass("js-ga-billing-address-page")) {
			//----------- Start of Rule 260 --------------//
			if (window.billingVirtualView) {
				dataLayer.push({
					"event": "virtualPageview",
					'page': adaptive + '/' + uri + '/' + type + "/confirm_address/" + visitorStatus
				});
			}
			//----------- End of Rule 260 --------------//
		}
	};

	Plugin.prototype.contactConfirmationFormPopup = function() {

		if ($('#confirmBox').length) {

			var newsletterSubOrigin;

			if ($('.main-container.js-ga-contact-page').length) {
				newsletterSubOrigin = 'Contact us form';
			} else {
				newsletterSubOrigin = 'Product page';
			}

			//----------- Start of Rule 120 --------------//

			dataLayer.push({
				"event": "virtualPageview",
				'page': adaptive + '/' + uri + "/Pop-In_Contact_Confirmation"
			});

			//----------- End of Rule 120 --------------//

			//----------- Start of Rule 121 --------------//

			$('#confirmButtons button').eq(0).on('click', function() {
				dataLayer.push({
					'event': "contactConfirmation"
				});
			});

			//----------- End of Rule 121 --------------//


			//----------- Start of Rule 122 --------------//

			$('#confirmButtons button').eq(1).on('click', function() {
				$(this).attr('href', _shippingBackLinkModifier('origin=Contact', $(this).attr('href')));
			});

			//----------- End of Rule 122 --------------//

			//----------- Start of Rule 294 --------------//

			dataLayer.push({
				'event': "subscribeNewsletter",
				'newsletterSubOrigin': newsletterSubOrigin
			});

			//----------- End of Rule 294 --------------//
		}
	};

	Plugin.prototype.contactFormPopup = function() {


		if ($('#js-contact-ambassador-form').length) {

			//----------- Start of Rule 117 --------------//

			dataLayer.push({
				'event': 'virtualPageview',
				'page': adaptive + '/' + uri + "/Pop-In_Contact_Form"
			});

			//----------- Start of Rule 117 --------------//

			//----------- Start of Rule 118 --------------//

			dataLayer.push({
				'event': "contactPopinDisplayed"
			});
			//----------- End of Rule 118 --------------//

			//----------- Start of Rule 119 and Rule 293--------------//

			$('.overlay-form input[type=submit]').on('click', function() {

				var requestCategory = $('.overlay-form select#ambassador_category').find("option:selected").val().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');

				requestCategory = cartier.common.toTitleCase(requestCategory);

				dataLayer.push({
					'event': "contactSubmit",
					'requestCategory': requestCategory
				});

				if ($('.checkbox-wrapper input[type="checkbox"][name="ambassador_checkbox_val"]').is(':checked') && adaptive !== "") {
					dataLayer.push({
						'event': "virtualPageview",
						'page': adaptive + '/' + uri + "/Pop-In_Contact_Form_Submit?newsletterSubscription=ok"
					});
				}
			});

			//----------- End of Rule 119 and Rule 293--------------//
		}
	};


	Plugin.prototype.boutiqueSearchGA = function(locationSelected) {

		//------ Start BOUTIQUE - SEARCH ------//

		if (_cache.$wrapper.hasClass("js-ga-store-geolocatore-page")) {

			// -------- Start of Rule 222 -------------//

			$.jStorage.set('boutiqueCountrySelected', {
				'event': "boutiqueSearchCountry",
				'countrySelected': locationSelected.country
			});

			// -------- End of Rule 222 -------------//

			// -------- Start of Rule 223 -------------//

			if (typeof locationSelected.city !== 'undefined') {
				$.jStorage.set('boutiqueCitySelected', {
					'event': "boutiqueSearchCity",
					'countrySelected': locationSelected.city
				});
			}

			// -------- Start of Rule 223 -------------//

			$.jStorage.set('boutiqueSearchLocation', locationSelected);

		}

		//------ End BOUTIQUE - SEARCH ------//
	};

	Plugin.prototype.boutiqueDetailGA = function() {

		//-------------------- Start BOUTIQUE - DETAIL PAGE ---------------------------//

		if (_cache.$wrapper.hasClass("js-ga-boutique-detail-page")) {

			//----------- Start of Rule 228 --------------//

			dataLayer.push({
				'event': 'virtualPageview',
				'page': adaptive + "/" + uri + "/" + 'Pop-in_MailBoutique'
			});

			//----------- End of Rule 228 --------------//


			//----------- Start of Rule 232 --------------//

			$('.overlay-form .SUBMIT input[type=submit]').on('click', function() {
				dataLayer.push({
					'event': 'boutiqueSendMail'
				});
			});

			//----------- Start of Rule 232 --------------//

		}

		//-------------------- Start BOUTIQUE - DETAIL PAGE ---------------------------//

	};

	Plugin.prototype.youtubeVideoInteractionGARules = function(videoObject) {

		//------------Start Collection Product Pages----------- //

		if (_cache.$wrapper.hasClass("js-ga-collection-product-page")) {

			// -------- Start of Rule 75 -------------//

			dataLayer.push({
				'event': "productVideo",
				'videoInteractions': videoObject.videoInteractions
			});

			// -------- End of Rule 75 -------------//
		}

		//------------End Collection Product Pages----------- //


		//------------ Start SFY [Set For You by Cartier] - Step1 ----------- //

		if (_cache.$wrapper.hasClass("js-ga-sfy-step-1")) {

			var title, creationName;

			//----------- Start of Rule 81 --------------//

			title = $('.collection-push').find('.collection-title').data('creation-name');
			creationName = cartier.common.toTitleCase(title);

			// -------- Start of Rule 82 -------------//

			dataLayer.push({
				'event': "pageCollectionSFYVideoInteraction",
				'creationName': creationName,
				'videoInteractions': videoObject.videoInteractions
			});

			// -------- End of Rule 82 -------------//
		}

		//------------ End SFY [Set For You by Cartier] - Step1 ----------- //

		//------------ Start For all videos ----------- //

		// -------- Start of Rule 234 -------------//

		dataLayer.push({
			'event': "videoInteraction",
			'videoInteractions': videoObject.videoInteractions,
			'nameOfTheVideo': videoObject.nameOfTheVideo
		});

		// -------- End of Rule 234 -------------//

		//------------ End For all video ----------- //
	};

	Plugin.prototype.youtubeVideoStatusGARules = function(videoObject) {

		//------------Start Collection Product Pages----------- //

		if (_cache.$wrapper.hasClass("js-ga-collection-product-page")) {

			// -------- Start of Rule 77 -------------//

			dataLayer.push({
				'event': "productVideoStatus",
				'videoStatus': videoObject.videoStatus
			});

			// -------- End of Rule 77 -------------//
		}

		//------------End Collection Product Pages----------- //


		//------------ Start SFY [Set For You by Cartier] - Step1 ----------- //

		if (_cache.$wrapper.hasClass("js-ga-sfy-step-1")) {

			var title, creationName;

			//----------- Start of Rule 81 --------------//

			title = $('.collection-push').find('.collection-title').data('creation-name');
			creationName = cartier.common.toTitleCase(title);

			// -------- Start of Rule 83 -------------//

			if (videoObject.playerState === 1) {
				dataLayer.push({
					'event': "pageCollectionSFYVideoStatus",
					'creationName': creationName,
					'videoStatus': videoObject.videoStatus
				});
			}

			// -------- End of Rule 83 -------------//

		}

		//------------ End SFY [Set For You by Cartier] - Step1 ----------- //

		//------------ Start For all videos ----------- //

		// -------- Start of Rule 235 -------------//

		if (videoObject.playerState === 1 || videoObject.playerState === 0) {
			dataLayer.push({
				'event': "videoStatus",
				'videoStatus': videoObject.videoStatus,
				'nameOfTheVideo': videoObject.nameOfTheVideo
			});
		}

		// -------- End of Rule 235 -------------//

		//------------ End For all video ----------- //
	};

	Plugin.prototype.nestedCarouselSliderGARules = function(pageType) {

		//----------------Start Carousel Pages-----------------//

		if ($('.nested-carousel-wrapper').hasClass("js-ga-carousel")) {

			var creationName, productMaterial;

			creationName = $('.collection-push').find('.collection-title').data('creation-name');
			creationName = cartier.common.toTitleCase(creationName);

			//----------- previous --------------//

			$('.bx-controls-direction-left').on('click', function() {
				dataLayer.push({
					'event': pageType + "SlidePrevious",
					'creationName': creationName
				});
			});

			//----------- previous --------------//

			//----------- Next --------------//

			$('.bx-controls-direction-right').on('click', function() {
				dataLayer.push({
					'event': pageType + "SlideNext",
					'creationName': creationName
				});
			});

			//-----------Next --------------//

			//----------- Dot --------------//

			$('.nested-carousel-wrapper').on('click', '.bx-pager', function(e) {
				if ($(e.target).hasClass('active')) {
					dataLayer.push({
						'event': pageType + "SlideDot",
						'creationName': creationName
					});
				}

			});

			//----------- Dot --------------//


			//----------- Start of Rule 88 --------------//  

			$('.button-wrapper .js-sfy-select').one('click', function() {

				if ($('.js-ga-carousel .sfy_check input[type="radio"]').is(':checked')) {

					productMaterial = $('.js-ga-carousel .sfy_check input[type="radio"]').val();
					productMaterial = cartier.common.toTitleCase(productMaterial);

					_destinationPagePusher({
						'event': 'pageCollectionSFYMaterial',
						'creationName': creationName,
						'productMaterial': productMaterial
					});

				}

			});

			//----------- End of Rule 88 --------------//  

		}

		//----------------End Carousel Pages-----------------//
	};

	//---------------- Start MY CARTIER - MY WISHLISTS -----------------//  

	Plugin.prototype.myWishlistSendEmail = function() {

		if (_cache.$wrapper.hasClass("js-ga-mycartier-wishlists")) {

			//----------- Start of Rule 196 --------------//

			dataLayer.push({
				'page': adaptive + '/services/my-cartier/my-preferences/my-wishlists/send-to-a-friend'
			});

			//----------- End of Rule 196 --------------// 


			//----------- Start of Rule 197 --------------// 

			$('.overlay-form .form-element input').on('click blur', function() {
				var inputType = $(this).attr("type"),
					inputName = $(this).attr("name");
				if (inputType != "submit" && inputType != undefined && inputName != undefined) {
					_pushUniqueDataObjectOnBlur({
						'event': "wishlistField",
						'nameOfTheField': nameResovler(inputName)
					}, 'nameOfTheField', inputName);
				}
			});

			//----------- End of Rule 197 --------------// 
		}
	};


	Plugin.prototype.myWishlistSendEmailConfirm = function() {

		if (_cache.$wrapper.hasClass("js-ga-mycartier-wishlists")) {

			//----------- Start of Rule 198 --------------//

			dataLayer.push({
				'page': adaptive + '/services/my-cartier/my-preferences/my-wishlists/send-to-a-friend/confirmation'
			});

			//----------- End of Rule 198 --------------//

			//----------- Start of Rule 199 --------------//

			dataLayer.push({
				'event': 'wishlistSendToFriend'
			});

			//----------- End of Rule 199 --------------// 
		}
	};

	Plugin.prototype.myWishlistRequestInfo = function() {

		if (_cache.$wrapper.hasClass("js-ga-mycartier-wishlists")) {

			//----------- Start of Rule 200 --------------//

			dataLayer.push({
				'event': 'virtualPageview',
				'page': adaptive + '/services/my-cartier/my-preferences/my-wishlists/request-information'
			});

			//----------- End of Rule 200 --------------//

			//----------- End of Rule 204 --------------//

			$('.overlay-form .SUBMIT input[type=submit]').on('click', function() {

				var requestCategory = $('.overlay-form select#requestInformation_mainMessage').find("option:selected").val().replace(/[\↵ \ ]*/, '').replace(/[\↵]/gi, '').trim().replace(/\s{2,}/g, ' ');

				requestCategory = cartier.common.toTitleCase(requestCategory);

				dataLayer.push({
					'event': 'wishlistRequest',
					'requestCategory': requestCategory
				});
			});

			//----------- End of Rule 204 --------------//
		}
	};

	Plugin.prototype.myWishlistRequestInfoConfirm = function() {

		if (_cache.$wrapper.hasClass("js-ga-mycartier-wishlists")) {

			//----------- Start of Rule 201 --------------//

			dataLayer.push({
				'event': 'virtualPageview',
				'page': adaptive + '/services/my-cartier/my-preferences/my-wishlists/request-information/confirmation'
			});

			//----------- End of Rule 201 --------------//
		}
	};

	//----------------End MY CARTIER - MY WISHLISTS -----------------//

	Plugin.prototype.myWishlistAddtoShoppingBag = function(addToCartObj) {

		//---------------- Start MY CARTIER - MY WISHLISTS -----------------//        

		if (_cache.$wrapper.hasClass("js-ga-mycartier-wishlists")) {

			//----------- Start of Rule 202 --------------//

			var productId = $(addToCartObj).closest('li.js-product-wrapper').data('refid'),
				productLine = $(addToCartObj).closest('li.js-product-wrapper').data('productline'),
				productCollection = $(addToCartObj).closest('li.js-product-wrapper').data('productcollection'),
				productName = $(addToCartObj).closest('li.js-product-wrapper').data('productname'),
				sellable = $(addToCartObj).closest('li.js-product-wrapper').data('sellable');

			dataLayer.push({
				'event': 'wishlistAddToCart',
				'productLine': productLine,
				'productId': productId,
				'productCollection': productCollection,
				'sellable': sellable,
				'productName': productName

			});

			//----------- End of Rule 202 --------------// 
		}

		//----------------End MY CARTIER - MY WISHLISTS -----------------//
	};

	//---------------- Start Login In Pop In -----------------//

	Plugin.prototype.logininPopinGARules = function(pageType) {

		//----------- End of Rule 252 --------------// 

		dataLayer.push({
			'event': "virtualPageview",
			'page': adaptive + '/' + uri + "/Pop-in_Login" + '/' + visitorStatus
		});

		//----------- End of Rule 252 --------------// 
	};

	//----------------End Login In Pop In -----------------//

	//---------------- Start Already Registered Pop In -----------------//

	Plugin.prototype.alreadyRegisteredPopin = function() {

		//----------- Start of Rule 255 --------------//

		dataLayer.push({
			'event': "virtualPageview",
			'page': adaptive + '/' + uri + "/Pop-in_Arleady_registered" + '/' + visitorStatus
		});

		//----------- End of Rule 255 --------------//
	};

	Plugin.prototype.alreadyRegisteredContinue = function() {

		//----------- Start of Rule 256 --------------//

		dataLayer.push({
			'event': "alreadyRegisteredContinue"
		});

		//----------- End of Rule 256 --------------//
	};

	Plugin.prototype.alreadyRegisteredCountrySelect = function() {

		//----------- Start of Rule 257 --------------//

		var countrySelectedResident = $('#js-login-form .js-login-dropdown #fn_country').find('option:selected').val();

		dataLayer.push({
			'event': "alreadyRegisteredCountry",
			'countrySelectedResident': countrySelectedResident
		});

		//----------- End of Rule 257 --------------//
	};

	//---------------- End Already Registered Pop In -----------------//

	Plugin.prototype.forgotPasswordPopin = function() {

		// ---------------------------- Start FORGOT YOUR PASSWORD POPIN ---------------------------//

		// -------- Start of Rule 254 -------------//

		dataLayer.push({ ///// Should work
			'event': "virtualPageview",
			"page": adaptive + "/" + uri + "/" + "Pop-in_Your_password_have_been_sent" + "/" + visitorStatus
		});

		// -------- Start of Rule 254 -------------//

		// ---------------------------- End FORGOT YOUR PASSWORD POPIN ---------------------------//

	};

	var _carouselGARules = function(pageType) {

		//----------------Start Carousel Pages-----------------//

		if (_cache.$carousel.hasClass("js-ga-carousel")) {

			//----------- previous --------------//

			$('.bx-controls-direction-left').on('click', function() {
				onPageLoad = false;
				dataLayer.push({
					'event': pageType + "SlidePrevious"
				});
			});
			//----------- previous --------------//

			//----------- Next --------------//

			$('.bx-controls-direction-right').on('click', function() {
				onPageLoad = false;
				dataLayer.push({
					'event': pageType + "SlideNext"
				});
			});

			//-----------Next --------------//

			//----------- Dot --------------//

			if (pageType !== 'maisonHistory') {
				$('.bx-pager').on('click', function(e) {
					if ($(e.target).hasClass('active')) {
						onPageLoad = false;
						dataLayer.push({
							'event': pageType + "SlideDot"
						});
					}
				});
			}

			//----------- Dot --------------//

		}

		//----------------End Carousel Pages-----------------//
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

		if (localStorage.getItem('destinationPagePush') !== null) {
			var existingObj = JSON.parse(localStorage.getItem('destinationPagePush'));

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
		localStorage.setItem('destinationPagePush', str);
	};

	var _onDestinationPage = function() {
		if (localStorage.getItem('destinationPagePush') !== null) {
			var obj = JSON.parse(localStorage.getItem('destinationPagePush'));

			if ($.isArray(obj)) {
				$.each(obj, function(index, value) {
					dataLayer.push(value);
				});
			} else {
				dataLayer.push(obj);
			}

			localStorage.removeItem('destinationPagePush');
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
			yearOfBirth = $('select[name="piform_birthdayyear"]').val();
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

	var _pushUniqueDataObjectOnBlur = function(dataObject, keyValue, inputName) {

		var pushObject = 1;

		if (dataObject != undefined && inputName != undefined) {

			$.each(dataLayer, function(index, object) {
				if (nameResovler(inputName) === object[keyValue]) {
					pushObject = 0;
				}
			});

			if (pushObject) {
				dataLayer.push(dataObject);
			}
		}
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
		/*dataLayer.push = function() {
            if (!arguments[0].hasOwnProperty('_55internal'))
                console.log(arguments[0]);
            return Array.prototype.push.apply(this, arguments);
        };*/
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
		window.categoryOrCollection = _notUndefined(window.categoryOrCollection);
		window.homepageVersion = _notUndefined(window.homepageVersion);
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

			return str.replace(/<span class='loveFont'>A <\/span>/g, "Love").replace(/<span class='lovefont'>A <\/span>/gi, "Love").replace(/#/gi, "@");
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