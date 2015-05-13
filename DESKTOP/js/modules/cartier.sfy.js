/*!
 * cartier.sfy.js
 * This file contains functionalities handling the sfy pages ( Step 2 and Step 3)
 *
 * @project   Cartier Desktop
 * @date      2014-24-09
 * @author    Sapient
 * @licensor  Cartier Desktop
 * @site      Cartier Desktop
   @dependency None
   @dependency cartier.core.js
 * @ NOTE:
    This file has the following sequence of the actions
    1) Declare all the private variables
    2) caching jquery wrapper objects and messages
    $last) call to init() method
 */

;
(function(window, $, sfy, undefined) {
	'use strict'; //this will cause the browser to check for errors more aggressively

	if ($ === undefined) {
		cartier.log("jQuery not found");
		return false;
	}

	var
	_cache = {}, _cacheStep2 = {};

	//--------------------------------------------------------------------------------------------------------
	//         Caching jQuery object
	//--------------------------------------------------------------------------------------------------------

	/*
      @private method : caching jquery objects 
      @param : none 
    */
	var _cacheObjects = function() {

		_cache = {
			$slider: $(".js-nested-slider").eq(0),
			$productSlider: $('.js-product-img-slider'),
			$previewBox: $('.js-slider-bridal'),
			$helpSlider: $(".js-slider-help"),
			$pdpslider: $('.js-pdp-slider'),
			$sfystepThreeslider: $(".sfyTabThreeCrousel").find((".js-slider-help")),
			$sfystepTwoslider: $(".sfyTabTwoCrousel").find((".js-slider-help")),
			$selectionPrice: $(".sfy__results .value"),
			$requestInfoRadio: $("input[name='requestInformation_contactPreference']")



		};
	}, _nestedCarousel, _helpslider, pricemin = 0,
		pricemax = 100000,
		caratmin = 0.5,
		caratmax = 3.8,
		pricesort = [],
		previewBoxObj,
		arrayOfExceptionalCarousel = [],
		currencySymbol = '$',
		toolTipTemplate = "<div class='js-tool-tip-detail tool-tip-details-wrapper'><img class='callout' alt='CSS Tooltip callout' src='../etc/designs/richemont-car/clientlibs/publish/Clientlibs_desktop/images/icons/bottom-arrow-grey.png'><div class='tool-tip-details'><p>Before changing the carat, please change the price range</p></div></div>",
		_cacheObjectsStep2 = function() {
			_cacheStep2 = {
				$priceRangeSlider: $("#Price-slider"),
				$caratRangeSlider: $("#carat-slider"),
				$previewboxcarousel: $(".js-bridal-sfy-preview .js-slider-bridal li")
			}
		},

		_initializeSlider = function() {

			var autoBool = false;

			if($('.js-nested-exceptional-creation').length)
				autoBool = true;

			_nestedCarousel = _cache.$slider.bxSlider({
				speed: 1200,
				auto: autoBool,
				autoHover: true,
				pager: false
			});
		},
		_initializwPreviewBoxSlider = function() {
			_cache.$previewBox.bxSlider({
				speed: 0,
				controls: false,
				pager: true,
				autoHover: true,
				infiniteLoop: false,
				bridalPreviewBox: true
			});
		},

		_initializeHelpSlider = function() {
			if ($('.js-product').length) {
				_helpslider = _cache.$helpSlider.bxSlider({
					speed: 1200,
					pager: true,
					autoHover: true,
					controls: true,
				});
			} else {
				_helpslider = _cache.$helpSlider.bxSlider({
					speed: 1200,
					pager: false,
					autoHover: true,
					controls: true,
				});
			}

		},
		_initializeHelpThreeSfySlider = function() {

			_helpslider = _cache.$sfystepThreeslider.bxSlider({
				speed: 1200,
				pager: false,
				autoHover: true,
				controls: true
			});
		},
		_initializeHelpTwoSfySlider = function() {

			_helpslider = _cache.$sfystepTwoslider.bxSlider({
				speed: 1200,
				pager: false,
				autoHover: true,
				controls: true
			});
		},

		/*
			@private method : to Show the tab and the page
			@param : none
		*/


		_sfyTabBar = function() {
			$('#tab1 .nested-carousel-wrapper').css("visibility", "hidden");


			$(".sfy-backTop").click(function() {
				$("#tab1 .nested-carousel-wrapper").show();
				$("html, body").animate({
					scrollBottom: $(document).height()
				}, "slow");
			});
			$(".tabTwolink").click(function() {
				$("html, body").animate({
					scrollTop: $(document).height() -100
				}, "slow");
				$(".sfyTabTwoCrousel").css("visibility", "visible").removeClass("heightZero");



			});



			/******************************** This section of DEAD code needs to be reviewed ***********************/



			/*remove this block after integration*/
			$(".sfy .carousel .cta-button").click(function(e) {
				$('#tab2').css("visibility", "visible").removeClass("heightZero");
				$('#tab1 , .sfyTabTwoCrousel').css("visibility", "hidden").addClass("heightZero");
				$('.sfy-progress_tab li:eq( 1 )').addClass("visited active");
				$('.sfy-progress_tab li:eq( 0 )').removeClass("active");
			});

			$("#tab2 .searchbutton").click(function(e) {
				$('#tab3').css("visibility", "visible").removeClass("heightZero");
				$('#tab1 , #tab2').css("visibility", "hidden").addClass("heightZero");
				$('.sfy-progress_tab li:eq(1) , .sfy-progress_tab li:eq(0)').removeClass("active");
				$('.sfy-progress_tab li:eq(2)').addClass("active visited");
				$('.sfyTabThreeCrousel').css("visibility", "hidden").addClass("heightZero");
			});

		},



		/*
			@private method : step one check box selection handling
			@param : none
		*/
		_sfyCaroselCheckbox = function() {
			$(".sfy_checkPlatinum label").click(function() {

				$(".platinum-1").css("visibility", "visible").removeClass("heightZero");
				$(".goldBlock-1").css("visibility", "hidden").addClass("heightZero");
			});
			$(".sfy_checkGold label").click(function() {

				$(".platinum-1").css("visibility", "hidden").addClass("heightZero");
				$(".goldBlock-1").css("visibility", "visible").removeClass("heightZero");
			});
		},



		/*
			@private method : back to top link on SFY pages
			@param : none
		*/
		_addBacktoTopLink = function() {
			var wWidth = $(window).width(),
				mainWidth = $('.main-container').width(),
				gutter = (wWidth - mainWidth) / 2,
				rightPos = mainWidth + gutter;
			$('.js-link-to-top a').css('left', rightPos + 'px');

			// Scroll to top when your click on link.

			$('.js-link-to-top a').on('click', function(event) {
				event.preventDefault();
				$('body').ScrollTo({
					top: 0,
					duration: 800,
					offsetTop: 140
				});
			});



			// Function to show and hide the top link when you scroll.

		},

		_initializeProductSlider = function() {

			/*			_cache.$productSlider.bxSlider({
				speed: 0,
				pager: true,
				controls: false,
				autoHover: true,
				useCSS: false,
				infiniteLoop: false
			});*/

			_cache.$productSlider.each(function(index, el) {

				var excepCarousel = $(el).bxSlider({
					speed: 0,
					pager: true,
					controls: false,
					autoHover: true,
					useCSS: false,
					infiniteLoop: false
				}).data('sliderindex',index);

				arrayOfExceptionalCarousel.push(excepCarousel);
			});

		},

		_initializeSfySlider = function() {

			_cache.$pdpslider.bxSlider({
				mode: 'fade',
				speed: 0,
				pager: true,
				controls: false,
				autoHover: true
			});
		},

		/*@private method : Function to initialize the Overlay
         @param : none 
        */

		_initializeOverlay = function() {

			$(".js-zoom").openOverlay({
				callback: initializingImageInOverLay
			});

			$(".js-product-img-slider img").openOverlay({
				callback: initializingImageInOverLay
			});
		},



		/*
			@private method : Iframe height needs to be fixed manually to render the content properly
			@param : none
		*/
		_iframeHeightVideo = function() {

			var heights = $(".nested-carousel-wrapper").height();
			var widths = $(".product-carousel__wrapper").width();


			var iframeheight = $(".product-carousel__wrapper").find(".bx-viewport").contents("iframe").css("height", heights + "px");
			var iframeWidth = $(".product-carousel__wrapper").find(".bx-viewport").contents("iframe").css("width", widths + "px");


			$(".product-carousel__wrapper").find(".js-video").contents("iframe").css("height", heights + "px");
			$(".product-carousel__wrapper").find(".js-video").contents("iframe").css("width", widths + "px");
			$('iframe').each(function() {
				var url = $(this).attr("src");
				var reqChar = "?";
				if (url.indexOf("?") != -1) {
					var reqChar = "&";
				}
				$(this).attr("src", url + reqChar + "wmode=transparent");
			});

		},


		/*
			@private method : to Show the tab and the page
			@param : none
		*/
		initializingImageInOverLay = function(clickedEl) {

			


			var winHeight = $(window).height(),
				winWidth = $(window).width();
			$(".js-overlay .img-container img").attr('src', "#");

			var sliderNumber = $(clickedEl).closest('.product-carousel__wrapper').find('.js-product-img-slider').data('sliderindex');
			var currentElement = arrayOfExceptionalCarousel[sliderNumber].getCurrentSlideElement();

			var imgPath = currentElement.find('img:visible').attr('data-original');

			if (typeof imgPath === "undefined")
				imgPath = currentElement.find('img:visible').attr('src');

			imgPath = imgPath.replace(/\.scale\.(.*?)\./, ".scale.2000.");


			winHeight = (winHeight < winWidth) ? winHeight : winWidth;
			$(".js-overlay .img-container img").attr('src', imgPath).css('opacity', '0').load(function() {
				var h = $(".js-overlay .img-container img").height();
				$(".js-overlay .img-container")
					.height(winHeight)
					.width('100%');
				var itop = ((winHeight - h)) > 0 ? (winHeight - h) / 2 : 20;
				$(".js-overlay .img-container img")
					.css('position', 'absolute')
					.css('top', itop).css('opacity', '1');
			});

			$(".js-overlay .img-container img").ready(function() {
				$(".js-overlay .img-container img").css('opacity', '1');
			});

		},

		/*
			@private method : Generates a link for the step 3
			@param : none
		*/
		_urlGeneratorToThree = function() {
			var pagepath = $("input[name='thirdPagePath']").val();
			var selector = $('input[name="selectors"]').val().replace(/\ /g, "-");
			var query = pagepath + "." + selector + ".html?sfy_from_price=" + $("input[name='sfy_from_price']").val() + "&sfy_to_price=" + $("input[name='sfy_to_price']").val() + "&sfy_from_carat=" + $("input[name='sfy_from_carat']").val() + "&sfy_to_carat=" + $("input[name='sfy_to_carat']").val();
			$.each($("input[name='colors']"), function(k, v) {
				if ($(this).prop("checked")) {
					query = query + "&colors=" + $(this).val();
				}
			});
			$.each($("input[name='clarity']"), function(k, v) {
				if ($(this).prop("checked")) {
					query = query + "&clarity=" + $(this).val();
				}
			});
			return query;
		},



		/*
			@private method : MAkes and AJAX call for get step 2 data
			@param : none
		*/


		_jsonParser = function() {
			/* var objXHR = cartier.ajaxWrapper.getXhrObj({
                type: 'GET',
                url : '../json/sfy_step2.json',
                dataType: 'json'
            }); */

			var objXHR = cartier.ajaxWrapper.getXhrObj({
				type: 'POST',
				url: $("input[name=resourcePath]").val() + ".sfyStep2" + ".html",
				data: {
					currentPagePath: $('input[name="currentPagePath"]').val(),
					firstPagePath: $('input[name="firstPagePath"]').val(),
					selectors: $('input[name="selectors"]').val()
				},
				dataType: 'json',
				contentType: "application/x-www-form-urlencoded"
			});

			if (objXHR) {
				objXHR.done(function(data) {
					pricemin = data[0][0].price;
					pricemax = data[0][(data[0].length) - 1].price;
					caratmin = data[1].mincarat;
					caratmax = data[1].maxcarat;
					currencySymbol = data[1].currencySymbol;
					pricesort = data[0];
					previewBoxObj = data[2];
					_previewBoxfiller();
					_initailizeCalcSlider();
					$("input[name='sfy_from_carat']").val($('#carat-slider').slider('values', 0));
					$("input[name='sfy_to_carat']").val($('#carat-slider').slider('values', 1));
					$("input[name='sfy_from_price']").val($('#Price-slider').slider('values', 0));
					$("input[name='sfy_to_price']").val($('#Price-slider').slider('values', 1));
					$(".js-sfy-submit").on("click", function(e) {
						e.preventDefault();
						window.location.href = _urlGeneratorToThree();
					});
				});
			}
		},


		/*
			@private method : Used to format price based on Loacle
			@param : none
		*/

		_priceFormatter = function(number) {
			number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
			var n = !isFinite(+number) ? 0 : +number,
				prec = !isFinite(+2) ? 0 : Math.abs(2),
				sep = ',',
				dec = '.',
				s = '',
				toFixedFix = function(n, prec) {
					var k = Math.pow(10, prec);
					return '' + Math.round(n * k) / k;
				};
			// Fix for IE parseFloat(0.55).toFixed(0) = 0;
			s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
			if (s[0].length > 3) {
				s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
			}
			if ((s[1] || '').length < prec) {
				s[1] = s[1] || '';
				s[1] += new Array(prec - s[1].length + 1).join('0');
			}
			s = currencySymbol + s.join(dec);

			return s;
		},

		/*
			@private method : Filles the url of the images
			@param : none
		*/
		_previewBoxfiller = function() {
			if(typeof previewBoxObj[0] !== "undefined") {
				$.each($(previewBoxObj[0].imgsrc), function(key, value) {
					_cacheStep2.$previewboxcarousel.eq(key).find("img").attr("src", value);
				});
			}
		},


		/*
			@private method : Initializes the Price slider on step 2
			@param : none
		*/

		_initailizeCalcSlider = function() {
			var leftpntr = 0,
				rightpntr = (pricesort.length) - 1,
				caratlptr, caratrptr, tempResultSort, lefthandle, righthandle, lefthandleC, righthandleC, previewboxpntr = 0,
				caratRightHandle, tempPriceSort;



			/*Handles the user interaction on the radio buttons of Step 2*/

			$("input[name='colors']").on('change', function() {

				if ($(this).is(':checked')) {
					$(this).removeClass('userChecked');
				} else {
					if ($("input[name='colors']:checked").length === 0) {
						$(this).prop('checked', true).attr('disabled', true).closest('span').addClass('checked');
						return false;
					} else {
						$(this).prop('checked', false).attr('disabled', false);
					}

					$(this).addClass('userChecked');
				}

				_checkboxDependencyColor();
			});
			$("input[name='clarity']").on('change', function() {

				if ($(this).is(':checked')) {
					$(this).removeClass('userChecked');
				} else {
					if ($("input[name='clarity']:checked").length === 0) {
						$(this).prop('checked', true).attr('disabled', true).closest('span').addClass('checked');
						return false;
					} else {
						$(this).prop('checked', false).attr('disabled', false);
					}

					$(this).addClass('userChecked');
				}

				_checkboxDependencyClarity();
			});


			/* Price Slider of step to and its properties */

			_cacheStep2.$priceRangeSlider.slider({
				range: true,
				min: Math.floor(pricemin),
				max: Math.ceil(pricemax),
				values: [pricemin, pricemax],
				step: 1,
				minRangeSize: 1000,
				start: function(event, ui) {
					lefthandle = ui.values[0];
					righthandle = ui.values[1];
					caratRightHandle = $('#carat-slider').slider('values', 1);
				},

				slide: function(event, ui) {

					
					$('.js-sfy-submit').show();
					$("input[name='colors'].uniform-processed").removeClass("lastCheck");
					$("input[name='clarity'].uniform-processed1").removeClass("lastCheck");
					$($('#Price-slider .ui-slider-handle')[0]).find('span').html(_priceFormatter(ui.values[0]));
					$($('#Price-slider .ui-slider-handle')[1]).find('span').html(_priceFormatter(ui.values[1]));
					//left handle moves right
					if (lefthandle < ui.values[0]) {
						/*console.log(lefthandle+"  sdsds"+ui.values[0]);*/
						rangeMovementHandler(ui.values[0], ui.values[1], "leftincrease");
					}
					//left handle moves left
					if (lefthandle > ui.values[0]) {
						/* console.log(lefthandle+"  bbbbb"+ui.values[0]);*/
						rangeMovementHandler(ui.values[0], ui.values[1], "leftdecrease");
					}
					//right handle moves left
					if (righthandle > ui.values[1]) {
						/*console.log(lefthandle+"  cccc"+ui.values[0]);*/
						rangeMovementHandler(ui.values[0], ui.values[1], "rightdecrease");
					}
					//right handle move right
					if (righthandle < ui.values[1]) {
						/*console.log(lefthandle+"  dddd"+ui.values[0]);*/
						rangeMovementHandler(ui.values[0], ui.values[1], "rightincrease");
					}
					$($('#carat-slider .ui-slider-handle')[0]).find('span').html($('#carat-slider').slider('values', 0));
					$($('#carat-slider .ui-slider-handle')[1]).find('span').html($('#carat-slider').slider('values', 1));
					$("input[name='sfy_from_price']").val(ui.values[0]);
					$("input[name='sfy_to_price']").val(ui.values[1]);

					$("input[name='sfy_from_carat']").val($('#carat-slider').slider('values', 0));
					$("input[name='sfy_to_carat']").val($('#carat-slider').slider('values', 1));

					if (caratRightHandle > $('#carat-slider').slider('values', 1)) {
						previewBoxImageChanger($('#carat-slider').slider('values', 1), "rightdecrease");
					}
					lefthandle = ui.values[0];
					righthandle = ui.values[1];
					$($('#carat-slider .ui-slider-handle')[0]).find('.js-tool-tip-detail').fadeOut();
					$($('#carat-slider .ui-slider-handle')[1]).find('.js-tool-tip-detail').fadeOut();

				},

				create: function() {
					$('#pricemin').text(_priceFormatter(pricemin).replace(/\.[^.$]+$/, ''));
					$('#pricemax').text(_priceFormatter(pricemax).replace(/\.[^.$]+$/, ''));
					$('#Price-slider .ui-slider-handle').html("<span></span>");
					$($('#Price-slider .ui-slider-handle')[0]).find('span').html(_priceFormatter(pricemin));
					$($('#Price-slider .ui-slider-handle')[1]).find('span').html(_priceFormatter(pricemax));

				}
			});



			/* Carat Slider of step 2 and its Initial Properties */


			_cacheStep2.$caratRangeSlider.slider({
				range: true,
				min: caratmin,
				max: caratmax,
				values: [caratmin, caratmax],
				step: 0.01,
				minRangeSize: 0.01,
				start: function(event, ui) {
					lefthandleC = ui.values[0];
					righthandleC = ui.values[1];
				},

				slide: function(event, ui) {
					$('.js-sfy-submit').show();
					$("input[name='colors'].uniform-processed").removeClass("lastCheck");
					$("input[name='clarity'].uniform-processed1").removeClass("lastCheck");
					$($('#carat-slider .ui-slider-handle')[0]).find('span').html(ui.values[0]);
					$($('#carat-slider .ui-slider-handle')[1]).find('span').html(ui.values[1]);
					caratAdjuster(5);
					if (lefthandleC < ui.values[0]) {

						colorClarityAdjuster(ui.values[0], ui.values[1], "color", "leftincrease");
						colorClarityAdjuster(ui.values[0], ui.values[1], "clarity", "leftincrease");
					}
					if (lefthandleC > ui.values[0]) {

						colorClarityAdjuster(ui.values[0], ui.values[1], "color", "leftdecrease");
						colorClarityAdjuster(ui.values[0], ui.values[1], "clarity", "leftdecrease");
					}
					if (righthandleC > ui.values[1]) {

						colorClarityAdjuster(ui.values[0], ui.values[1], "color", "rightdecrease");
						colorClarityAdjuster(ui.values[0], ui.values[1], "clarity", "rightdecrease");
						previewBoxImageChanger(ui.values[1], "rightdecrease");
					}

					if (righthandleC < ui.values[1]) {

						colorClarityAdjuster(ui.values[0], ui.values[1], "color", "rightincrease");
						colorClarityAdjuster(ui.values[0], ui.values[1], "clarity", "rightincrease");
						previewBoxImageChanger(ui.values[1], "rightincrease");
					}
					lefthandleC = ui.values[0];
					righthandleC = ui.values[1];

					$("input[name='sfy_from_carat']").val(ui.values[0]);
					$("input[name='sfy_to_carat']").val(ui.values[1]);


				},
				create: function() {
					$('#caratmin').html(caratmin);
					$('#caratmax').html(caratmax);
					$('#carat-slider .ui-slider-handle').html(toolTipTemplate + "<span></span>");
					$($('#carat-slider .ui-slider-handle')[0]).find('span').html(caratmin);
					$($('#carat-slider .ui-slider-handle')[1]).find('span').html(caratmax);
				}
			});

			var



			/*
			@private method : Binary Search algorithm for price slider
			@param : none
		*/

			binarySearchWrapper = function(lb, ub, value, check) {
				var indexCountArr = binarySearch(lb, ub, value);
				if (check) {
					while (true) {
						if (pricesort[indexCountArr - 1] !== undefined && pricesort[indexCountArr - 1].price === pricesort[indexCountArr].price)
							indexCountArr--;
						else
							break;
					}
				} else {
					while (true) {

						if (pricesort[indexCountArr + 1] !== undefined && pricesort[indexCountArr + 1].price === pricesort[indexCountArr].price)
							indexCountArr++;
						else
							break;
					}
				}
				return indexCountArr;
			},



				binarySearch = function(lb, ub, value) {
					var mid = parseInt((lb + ub) / 2);
					if (lb <= ub) {
						if (pricesort[mid].price < value) {
							lb = mid + 1;
						} else {
							if (pricesort[mid].price == value) {
								return mid;
							}
							ub = mid - 1;
						}
						return binarySearch(lb, ub, value);
					} else {
						if (lb == (pricesort.length)) {
							lb--;
						}
						return mid;
					}
				},

				/*
			@private method : Binary search algorithm for carat slider
			@param : none
		*/
				binarySearchCaratWrapper = function(lb, ub, value, check) {
					var indexCountArr = binarySearchCarat(lb, ub, value);
					if (check) {
						while (true) {
							if (tempResultSort[indexCountArr - 1] !== undefined && tempResultSort[indexCountArr - 1].carat === tempResultSort[indexCountArr].carat)
								indexCountArr--;
							else
								break;
						}
					} else {
						while (true) {

							if (tempResultSort[indexCountArr + 1] !== undefined && tempResultSort[indexCountArr + 1].carat === tempResultSort[indexCountArr].carat)
								indexCountArr++;
							else
								break;
						}
					}

					return indexCountArr;
				},

				binarySearchCarat = function(lb, ub, value) {

					var mid = parseInt((lb + ub) / 2);
					if (lb <= ub) {
						if (tempResultSort[mid].carat < value) {
							lb = mid + 1;
						} else {
							if (tempResultSort[mid].carat == value) {
								return mid;
							}
							ub = mid - 1;
						}
						return binarySearchCarat(lb, ub, value);
					} else {
						if (lb == (tempResultSort.length)) {
							lb--;
						}

						return mid;
					}
				},


				/*
			@private method : When the user interacts with the price slider, This handles the carat cslider
			@param : none
		*/

				rangeMovementHandler = function(lb, ub, direction) {
					switch (direction) {
						case "leftincrease":
							leftpntr = binarySearchWrapper(leftpntr, rightpntr, lb, true);
							while (pricesort[leftpntr].price < lb)
								leftpntr++;
							caratAdjuster();
							break;

						case "leftdecrease":
							leftpntr = 0;
							leftpntr = binarySearchWrapper(leftpntr, rightpntr, lb, true);
							while (pricesort[leftpntr].price < lb)
								leftpntr++;
							caratAdjuster();

							break;
						case "rightdecrease":
							rightpntr = binarySearchWrapper(leftpntr, rightpntr, ub, false);
							caratAdjuster();

							break;
						case "rightincrease":
							rightpntr = (pricesort.length) - 1;
							rightpntr = binarySearchWrapper(leftpntr, rightpntr, ub, false);
							caratAdjuster();

							break;
					}

				},


				/*
			@private method : this function handles the carat slider and changes the properties of the carat slider
			@param : none
		*/
				caratAdjuster = function(i) {
					var tempResult = pricesort.slice(leftpntr, rightpntr + 1);
					tempPriceSort=tempResult;
					tempResultSort =tempResult.splice(0);					
					
					tempResultSort.sort(function(a, b) {
						return a.carat - b.carat;
					});
					tempPriceSort=tempResultSort.slice();
					tempPriceSort.sort(function(a, b) {
						return a.price - b.price;
					});
					

					/*testing code*/



					if (tempResultSort.length === 0) {
						$.each($('input[type=checkbox].' + 'uniform-processed'), function(key, val) {
							$(val).prop('checked', false);
							$.uniform.update('.uniform-processed');
							$.uniform.update('.uniform-processed1');
							$(val).attr('disabled', 'disabled');
						});
						$.each($('input[type=checkbox].' + 'uniform-processed1'), function(key, val) {
							$(val).prop('checked', false);
							$.uniform.update('.uniform-processed');
							$.uniform.update('.uniform-processed1');
							$(val).attr('disabled', 'disabled');
						});
						$('.js-sfy-submit').hide();

						_cacheStep2.$caratRangeSlider.slider({
							values: [caratmin, caratmax]
						});

						_cacheStep2.$caratRangeSlider.slider("option", "disabled", true);

						return false;
					}


					if (!i) {

						var lowSliderMax = false;
						var hiSliderMin = false;

						if (tempResultSort.length > 1) {
							lowSliderMax = (tempResultSort[tempResultSort.length - 2].carat);
							hiSliderMin = tempResultSort[1].carat;
						}

						_cacheStep2.$caratRangeSlider.slider("option", "disabled", false);

						_cacheStep2.$caratRangeSlider.slider({
							animate: "slow",
							lowMin: tempResultSort[0].carat,
							topMax: tempResultSort[tempResultSort.length - 1].carat,
							values: [tempResultSort[0].carat, tempResultSort[tempResultSort.length - 1].carat],
							lowMax: lowSliderMax,
							topMin: hiSliderMin,
							start: function(event, ui) {
								lefthandleC = ui.values[0];
								righthandleC = ui.values[1];
							},
							slide: function(event, ui) {
								$("input[name='colors'].uniform-processed").removeClass("lastCheck");
								$("input[name='clarity'].uniform-processed1").removeClass("lastCheck");
								$('.js-sfy-submit').show();
								$($('#carat-slider .ui-slider-handle')[0]).find('.js-tool-tip-detail').fadeOut();
								$($('#carat-slider .ui-slider-handle')[1]).find('.js-tool-tip-detail').fadeOut();

								$("input[name='sfy_from_carat']").val(ui.values[0]);
								$("input[name='sfy_to_carat']").val(ui.values[1]);

								$($('#carat-slider .ui-slider-handle')[0]).find('span').html(ui.values[0]);
								$($('#carat-slider .ui-slider-handle')[1]).find('span').html(ui.values[1]);

								caratAdjuster(5);

								if (lefthandleC < ui.values[0]) {

									colorClarityAdjuster(ui.values[0], ui.values[1], "color", "leftincrease");
									colorClarityAdjuster(ui.values[0], ui.values[1], "clarity", "leftincrease");
								}
								if (lefthandleC > ui.values[0]) {

									colorClarityAdjuster(ui.values[0], ui.values[1], "color", "leftdecrease");
									colorClarityAdjuster(ui.values[0], ui.values[1], "clarity", "leftdecrease");
								}
								if (righthandleC > ui.values[1]) {

									colorClarityAdjuster(ui.values[0], ui.values[1], "color", "rightdecrease");
									colorClarityAdjuster(ui.values[0], ui.values[1], "clarity", "rightdecrease");
									previewBoxImageChanger(ui.values[1], "rightdecrease");
								}

								if (righthandleC < ui.values[1]) {
									colorClarityAdjuster(ui.values[0], ui.values[1], "color", "rightincrease");
									colorClarityAdjuster(ui.values[0], ui.values[1], "clarity", "rightincrease");
									previewBoxImageChanger(ui.values[1], "rightincrease");
								}

								$("input[name='sfy_from_carat']").val(ui.values[0]);
								$("input[name='sfy_to_carat']").val(ui.values[1]);
								//caratAdjuster(5);
								lefthandleC = ui.values[0];
								righthandleC = ui.values[1];

							},
							create: function(event, ui) {
								$("input[name='sfy_from_carat']").val(ui.values[0]);
								$("input[name='sfy_to_carat']").val(ui.values[1]);
							}

						});

						caratlptr = 0;
						caratrptr = (tempResultSort.length) - 1;
						colorClarityAdjuster(_cacheStep2.$caratRangeSlider.slider("values", 0), _cacheStep2.$caratRangeSlider.slider("values", 1), "color");
						colorClarityAdjuster(_cacheStep2.$caratRangeSlider.slider("values", 0), _cacheStep2.$caratRangeSlider.slider("values", 1), "clarity");
					}
				},



				/*
			@private method : Function to handle the checkbox status after the user slides
			@param : none
		*/
				_checkboxDependencyColor = function() {
					var resultset = tempResultSort.slice(caratlptr, (caratrptr + 1)) || pricesort,
						clarityAvail = [];
					$.each($('input[type=checkbox].uniform-processed'), function(k, val) {
						if ($(val).prop("checked")) {
							$.each(resultset, function(k, v) {
								if ($(val).val() === v.color) {
									clarityAvail.push(v.clarity);
								}
							})
						}
					});
					var temp = [];
					$.each(clarityAvail, function(i, el) {
						if ($.inArray(el, temp) === -1) temp.push(el);
					});
					clarityAvail = temp;
					$.each($('input[type=checkbox].uniform-processed1'), function(k, val) {

						if ($.inArray($(val).val(), clarityAvail) === -1) {
							$(val).prop('checked', false);
							$(val).attr('disabled', 'disabled');
							$.uniform.update('.uniform-processed1');
						} else {
							$(val).removeAttr('disabled');

							if (!$(val).hasClass('userChecked'))
								$(val).prop('checked', true);

							$.uniform.update('.uniform-processed1');
						}
					});
				},



				/*
			@private method : Clarity checkbox change after the slider
			@param : none
		*/

				_checkboxDependencyClarity = function() {
					var resultset = tempResultSort.slice(caratlptr, (caratrptr + 1)) || pricesort,
						colorsAvail = [];
					$.each($('input[type=checkbox].uniform-processed1'), function(k, val) {
						if ($(val).prop("checked")) {
							$.each(resultset, function(k, v) {
								if ($(val).val() === v.clarity) {
									colorsAvail.push(v.color);
								}
							})
						}
					});
					var temp = [];
					$.each(colorsAvail, function(i, el) {
						if ($.inArray(el, temp) === -1) temp.push(el);
					});
					colorsAvail = temp;
					$.each($('input[type=checkbox].uniform-processed'), function(k, val) {
						if ($.inArray($(val).val(), colorsAvail) === -1) {
							$(val).prop('checked', false);
							$(val).attr('disabled', 'disabled');
							$.uniform.update('.uniform-processed');
						} else {
							$(val).removeAttr('disabled');

							if (!$(val).hasClass('userChecked'))
								$(val).prop('checked', true);

							$.uniform.update('.uniform-processed1');
						}
					});
				},


				/*
			@private method : This finction is called after the event slide on the carat slider
			@param : none
		*/

				colorClarityAdjuster = function(lb, ub, prop, direction) {
					var className;
					if (prop === "color") {
						className = "uniform-processed";
					} else if (prop === "clarity") {
						className = "uniform-processed1";
					}
					if (caratlptr == undefined || caratrptr == undefined) {
						caratlptr = 0;
						caratrptr = (tempResultSort.length) - 1;
					}
					switch (direction) {
						case "leftincrease":
							caratlptr = binarySearchCaratWrapper(caratlptr, caratrptr, lb, true);

							while (tempResultSort[caratlptr].carat < lb)
								caratlptr++;

							break;
						case "leftdecrease":
							caratlptr = 0;
							caratlptr = binarySearchCaratWrapper(caratlptr, caratrptr, lb, true);
							while (tempResultSort[caratlptr].carat < lb)
								caratlptr++;
							break;

						case "rightdecrease":
							caratrptr = binarySearchCaratWrapper(caratlptr, caratrptr, ub, false);
							break;
						case "rightincrease":
							caratrptr = (tempResultSort.length) - 1;
							caratrptr = binarySearchCaratWrapper(caratlptr, caratrptr, ub, false);
							break;
					}

					var checkedColorArray = [];
					var checkedCaratArray = [];

					$('.uniform-processed').each(function(index, el) {
						if ($(el).hasClass('userChecked'))
							checkedColorArray.push($(el).val());
					});
					$('.uniform-processed1').each(function(index, el) {
						if ($(el).hasClass('userChecked'))
							checkedCaratArray.push($(el).val());
					});


					var resultset = tempResultSort;
					resultset = resultset.slice(caratlptr, caratrptr + 1);
					var lowSliderMax = false,
						hiSliderMin = false,
						lowSliderMax2 = false,
						hiSliderMin2 = false;

					if (resultset.length > 1) {
						lowSliderMax = (resultset[resultset.length - 2].carat);
						hiSliderMin = resultset[1].carat;
					}
					if (tempPriceSort.length > 1) {
						lowSliderMax2 = (tempPriceSort[tempPriceSort.length - 2].price-1);
						hiSliderMin2 = tempPriceSort[1].price;
					}
					_cacheStep2.$priceRangeSlider.slider({
						lowMax: lowSliderMax2,
						topMin: hiSliderMin2
					});
					_cacheStep2.$caratRangeSlider.slider({
						lowMax: lowSliderMax,
						topMin: hiSliderMin
					});

					var fileredResultSet = [];
					var filerLeftOver = [];

					$.each(resultset, function(index, val) {
						if ((checkedCaratArray.indexOf(val.clarity) !== -1) || (checkedColorArray.indexOf(val.color) !== -1))
							filerLeftOver.push(val);
						else
							fileredResultSet.push(val);
					});


					$.each($('input[type=checkbox].' + className), function(key, val) {
						var colorchk = $(val).val(),
							disable = false,
							check = false;

						$.each(fileredResultSet, function(kley1, val1) {
							if (prop == "color") {
								if (val1.color === colorchk) {
									check = true;
									return false;
								}
							} else if (prop === "clarity") {
								if (val1.clarity === colorchk) {
									check = true;
									return false;
								}
							}
						});

						$.each(resultset, function(kley1, val1) {
							if (prop == "color") {
								if (val1.color === colorchk) {
									disable = true;
									return false;
								}
							} else if (prop === "clarity") {
								if (val1.clarity === colorchk) {
									disable = true;
									return false;
								}
							}
						});

						if (disable) {
							$(val).removeAttr('disabled');
						}

						if (check) {
							$(val).prop('checked', true);
							$.uniform.update('.uniform-processed');
							$.uniform.update('.uniform-processed1');
						} else {
							$(val).prop('checked', false);
							$.uniform.update('.uniform-processed');
							$.uniform.update('.uniform-processed1');
						}

						if (!disable) {
							$(val).attr('disabled', 'disabled');
						}

					});

					if ($('input[name="color"]:checked').length + $('input[name="clarity"]:checked').length === 0)
						$('.js-sfy-submit').hide();
					else
						$('.js-sfy-submit').show();
				},

				previewBoxImageChanger = function(righthandle, direction) {


					if (previewboxpntr + 1 < previewBoxObj.length) {
						if (righthandle < previewBoxObj[previewboxpntr + 1].carat && direction == "rightdecrease") {
							while (righthandle < previewBoxObj[previewboxpntr].carat && previewboxpntr + 1 < previewBoxObj.length) {
								previewboxpntr++;
								updateImage();
							}
						}
					}
					if (righthandle > previewBoxObj[previewboxpntr].carat && direction == "rightincrease") {
						while (righthandle > previewBoxObj[previewboxpntr].carat && previewboxpntr - 1 >= 0) {
							if (previewboxpntr - 1 >= 0) {
								previewboxpntr--;
							}

						}
						updateImage();
					}


				},

				updateImage = function() {
					$.each(_cacheStep2.$previewboxcarousel, function(key, val) {
						if ((previewboxpntr + 1) < previewBoxObj.length) {
							$(val).find('img').attr('src', previewBoxObj[previewboxpntr].imgsrc[key]);
						} else {
							$(val).find('img').attr('src', previewBoxObj[previewBoxObj.length - 1].imgsrc[key]);
						}

					})
				};


		},


		/*
			@private method : get price rules
			@param : none
		*/
		_getPriceRules = function() {
			var $addMessage = $('.requestPrice_checkbox_askForPrice');
			$addMessage.on('click', function() {

				if ($('.requestPrice_checkbox_askForPrice .checker').find('span').hasClass('checked')) {
					$('.requestPrice_message').css('display', 'block');
				} else {
					$('.requestPrice_message').css('display', 'none');
				}
			});
		},



		/*
			@private method : request information call back
			@param : none
		*/
		RequestInfoCallback = function(data) {

			if (typeof data === "object") {


				var loggedIn = cartier.common.isLoggedIn();
				$("#modalWindow").empty();
				$("#modalOverlay").hide();


				if (data.content.isSubmitSuccess) {

					if (loggedIn) {
						_cache.$requestButton.data('plugin_confirmBox').popupInitialize({
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
							_cache.$requestButton.data('plugin_confirmBox').confirmHide

						);
					} else {
						$('.js-request-popup').confirmBox();
						$('.js-request-popup').data('plugin_confirmBox').popupInitialize({
								'title': _objPropertiesMsg.contactAmbassadorPopupHeading,
								'message': _objPropertiesMsg.contactAmbassadorPopupText,
								'buttons': {
									'ok': {
										'buttonName': _objPropertiesMsg.okButton,
										'href': '#',
										'class': 'cta-button cta-button__inner cta--red'

									},
									'cancel': {
										'buttonName': _objPropertiesMsg.contactAmbassadorCancelOptionText,
										'href': '#',
										'class': 'cta-button more-button-overlay'
									}

								}
							},
							$('.js-request-popup').data('plugin_confirmBox').confirmHide

						);

					}

					$('.popup-close-button').on('click', function() {
						$('.js-request-popup').data('plugin_confirmBox').confirmHide();
					});



					$($('#confirmButtons button')[0]).on('click', function() {
						location.href = '' + $(this).attr('href') + '';
					});

				}



			}

		},


		/*
			@private method : contact ambassador call back
			@param : none
		*/

		contactAmbCallback = function(data) {
			if (typeof data === "object") {
				var loggedIn = cartier.common.isLoggedIn();
				$("#modalWindow").empty();
				$("#modalOverlay").hide();


				if (typeof(data.content.isSubmitSuccess) !== 'undefined' && data.content.isSubmitSuccess) {

					if (loggedIn) {
						$('.js-appointment-popup').confirmBox();
						$('.js-appointment-popup').data('plugin_confirmBox').popupInitialize({
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
							$('.js-appointment-popup').data('plugin_confirmBox').confirmHide

						);
					} else {
						$('.js-appointment-popup').confirmBox();
						$('.js-appointment-popup').data('plugin_confirmBox').popupInitialize({
								'title': _objPropertiesMsg.contactAmbassadorPopupHeading,
								'message': _objPropertiesMsg.contactAmbassadorPopupText,
								'buttons': {
									'ok': {
										'buttonName': _objPropertiesMsg.okButton,
										'href': '#',
										'class': 'cta-button cta-button__inner cta--red'

									},
									'cancel': {
										'buttonName': _objPropertiesMsg.contactAmbassadorCancelOptionText,
										'href': '#',
										'class': 'cta-button more-button-overlay'
									}

								}
							},
							$('.js-appointment-popup').data('plugin_confirmBox').confirmHide

						);

					}

					$('.popup-close-button').on('click', function() {
						$('.js-appointment-popup').data('plugin_confirmBox').confirmHide();
					});



					$($('#confirmButtons button')[0]).on('click', function() {
						location.href = '' + $(this).attr('href') + '';
					});

				} else {
					var newServerMsgEl = $("<div class='serverMessage' style='display:block;'></div>").text("There was some server error while making this request.");
					$('.main-container').prepend(newServerMsgEl);

				}

			}
		},

		_dataLoad = function(url, action) {

			var objXHR = cartier.ajaxWrapper.getXhrObj({
				type: 'GET',
				url: url,
				dataType: 'html',
				contentType: "application/x-www-form-urlencoded"
			})
			if (objXHR) {
				objXHR.done(function(data) {
					var parsed = $($.parseHTML(data, document, true)).find('.overlay-form').addBack('.overlay-form');
					action(parsed);

				})
			}
		},
		_requestInfoRadioValidation = function() {
			$("input[name='requestInformation_contactPreference']").on('change', function(e) {
				if ($(this).val() == "email") {
					$("input[name='requestInformation_phoneNumber']").removeClass('error').rules('remove', 'required');
					$("input[name='requestInformation_emailAddress']").rules('add', 'required');
					$("input[name='requestInformation_phoneNumber']").siblings('.errormessage').find('label').hide();
					$.uniform.update();
				} else if ($(this).val() == "phone") {
					$("input[name='requestInformation_phoneNumber']").rules('add', 'required');
					$("input[name='requestInformation_emailAddress']").removeClass('error').rules('remove', 'required');
					$("input[name='requestInformation_emailAddress']").siblings('.errormessage').find('label').hide();
					$.uniform.update();
				}
			})
		},

		/*
         @private  method    :tasks to be done after result come from first Ajax call on page
         @param   result data loaded from Ajax
         */
		_postAjaxEvents = function(result) {
			if ($("input[name='requestInformation_contactPreference']").length) {
				_requestInfoRadioValidation();
			}
			$("#modalWindow").empty();
			$("#modalWindow").html(result);
			$("#modalWindow").addCrossButton();
			setTimeout(function() {
				$(this).modalWindow();
			}, 20);
			$("input:checkbox, input:radio, select").not('.no-uniform').uniform();
			$("input:checkbox, input:radio").not('.no-uniform').uniform();
			$('input[name=pdp_pagepath]').val($('#pagePath').val());
			_getPriceRules();
			$(".close").on("click", function() {
				$("#modalWindow").empty();
				$("#modalWindow").addAjaxLoader();
				$("#modalOverlay").hide();
			});
		},

		/*
			@private method : Step 2 init
			@param : none
		*/

		initStep2 = function() {
			_cacheObjectsStep2();
			_jsonParser();
			linkSlides();
			//getPriceMinMax and carat too

			setTimeout(function(){ $('.bx-pager-link').on('mouseover',function(){

				$(this).trigger('click');

			})}, 200);
		},

		/*
			@private method : MAkes and AJAX call for get step 2 data
			@param : none
		*/
		linkSlides = function() {
			$('.help').on('click', function(e) {
				$(".sfyTabTwoCrousel").css("visibility", "visible").removeClass("heightZero");
				e.preventDefault();
				switch ($(this).attr('href')) {
					case "#slide-carat":
						$("html, body").animate({
							scrollTop: $(document).height() - 130
						}, "slow");
						_helpslider.goToSlide(0);
						break;
					case "#slide-color":
						$("html, body").animate({
							scrollTop: $(document).height() - 130
						}, "slow");
						_helpslider.goToSlide(1);
						break;
					case "#slide-clarity":
						$("html, body").animate({
							scrollTop: $(document).height() - 130
						}, "slow");
						_helpslider.goToSlide(2);
						break;
					case "#more":
						$("html, body").animate({
							scrollTop: $(document).height() - 130
						}, "slow");
						_helpslider.goToSlide(3);
						break;
				}
			});
		},

		/*
			@private method : step 3 init
			@param : none
		*/
		initStep3 = function() {
			$(".sfy-result__table .checkbox input").click(function() {
				$(".stepThreeSlider").find("div.sfyCrousel").hide();
				var checkboxId = $(this).attr("data-sfy");
				var indexCount = $(this).attr('data-index');
				var casroselid = $(".stepThreeSlider").find("div" + "#" + checkboxId + indexCount);
				$(casroselid).find('.bxslider li').width(377);
				$(casroselid).find('.bx-wrapper .bx-viewport').height(421);
				$(casroselid).fadeIn(250);
				$(".model__reference span").html(checkboxId);
				_cache.$selectionPrice.html($(this).closest('.checkbox').siblings()[3].innerHTML);

			});
			linkSlides();
			$('table.sfy-result__table tbody tr').eq(0).find('td').eq(0).find('input').trigger('click');
			$.uniform.update();

		};



	//--------------------------------------------------------------------------------------------------------
	//          Public functions
	//--------------------------------------------------------------------------------------------------------



	/*
        @pubic method : initailize the module
    */
	sfy.init = function() {
		cartier.log('JS-LOG:sfy Init Called');

		// caching the jquery objects
		_cacheObjects();
		_sfyTabBar();
		_addBacktoTopLink();
		_initializeSfySlider();
		_initializeOverlay();
		_initializeHelpSlider();
		_initializeProductSlider();
		_initializwPreviewBoxSlider();
		if (_cache.$slider.length) {
			_initializeSlider();
			$('.collection-push').click(function(e) {

				$("#tab1 .nested-carousel-wrapper").css("visibility", "visible").removeClass("heightZero");
				$("html, body").animate({
					scrollTop: $(document).height() - 100
				}, "slow");
				_sfyCaroselCheckbox();
				var idx = $(this).index('.collection-push');

				_nestedCarousel.goToSlide(idx);
				_iframeHeightVideo();
			});
		}



		if ($('#tab3').length) {
			initStep3();
		}
		if ($('#tab2').length) {
			initStep2();
		}
	};

}(window, jQuery, cartier.sfy));