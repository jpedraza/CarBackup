 /*!cartier.product.js 
 * This file contains functionalities handling the PDP module
 * * @project Cartier Desktop
 * @date 2014 - 01 - 03
 * @author Sapient * @licensor cartier desktop
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

    //check if jquery is defined, else return
    if (typeof $ === "undefined") {
        cartier.log("jQuery not found");
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
        _clone,
        productCarousel,
        _scaleImage = "",
        scale,
        $newthumbli = $('.thumbnail-list').find('.thumbnail.first:eq(0)').on('click', function(){
            dataLayer.push({
                'event': "productSlideDot"
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
                $product: $(".js-product"),
                $reqinfo: $(".js-request-info"),
                $contam: $(".js-contact-ambas"),
                $overlayObject: $(".js-zoom"),
                $line1: $(".js-engraving-preview-line1"),
                $line2: $(".js-engraving-preview-line2"),
                $boldclass: "js-bold-class",
                $cursiveclass: "js-cursive-class",
                $accordionObject: $(".js-accordion"),
                $accordionObjectX: $(".js-accordion-x"),
                $carouselSlider: $(".js-slider"),
                $slider: $('.js-slider-gallery'),
                $pdpslider: $('.js-pdp-slider'),
                $productSlider: $('.js-product-img-slider'),
                $engrvingSubmit: $('.js-confirm-button'),
                $accancel: $('.js-cancel-ac'),
                $addToShopping: $('.js-addtoshopping'),
                $sizeSelector: $('.js-sizeselector'),
                $socialShareObject: $('.social-share'),
                $fbButton: $('.js-social-share__facebook'),
                $twitterButton: $('.js-social-share__twitter'),
                $pinterestButton: $('.js-social-share__pin-it'),
                $addtomywishlistok: $('.js-addtomywishlist-ok'),
                $productRef: $(".js-product-detail__size,.product-reference"),
                $tabsObject: $('.js-tabs'),
                $videoCarousel: $('.js-video-slider'),
                $pageWrapper: $('.page-product'),
                $createWishlistInput: $('.js-newwishlistname'),
                $requestButton: $('.js-request-popup'),
                $requestInfoPagePath: $('.js-request-popup').attr('href'),
                $requestPricePagePath: $('.js-request-price').attr('href'),
                $videoslider: $('.history-stories .js-slider'),
                $engravingWrapper: $('.js-engraving'),
                $adjustmentWrapper: $('.js-adjustment'),
                $featuresWrapper: $('.js-features'),
                $requestpopup: $('.js-request-popup'),
                $requestprice: $('.js-request-price'),
                $contactpopup: $('.js-contam-popup'),
                $tooltipEngraving: $('.tooltip-engraving'),
                $tooltipAdjust: $('.tooltip-adjustment'),
                $tooltipshopping: $('.tooltip-shoppingbag'),
                $appointmentPopup: $('.js-appointment-popup'),
                $askAppointmentPagePath: $('.js-appointment-popup').attr('href'),
                $contactAmbPopup: $('.js-contam-popup'),
                $contactAmbPagePath: $('.js-contam-popup').attr('href'),
                $requestInfoRadio: $("input[name='requestInformation_contactPreference']")

            };

        },


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

            //Click event for engraving submit
            _cache.$engrvingSubmit.on('click', _engrvingButtonsSubmitHandler);


            // Escape button event to close zoomed image
            $(document).keyup(function(e) {

                if (e.keyCode === 27) {
                    if ($('.js-overlay').is(':visible')) {
                        $('.js-overlay').fadeOut();
                    }
                } // esc
            });

            // Click event for cancel button
            $('.js-cancel-ac').on('click', _engrvingButtonsCancleHandler);

            // Change event for size
            _cache.$sizeSelector.on('change', _bindEventOnSizeSelectorHandler);

            // Click event for add to shopping bag
            _cache.$addToShopping.on('click', _addToShoppingClickHandler);

            // Click event for facebook button in product detail page
            _cache.$fbButton.on('click', function(event) {

            });

            // Mouse enter and mouse leave event for video pushes
            $('.js-video-pushes__teaser.opened').on({
                mouseenter: _videoPushesHoverHandler,
                mouseleave: _videoPushesUnHoverHandler
            });

            // Click event for video push
            $('.js-video-pushes').bind('click', _videoPushesClickHandler);

            // Click event for close button on video pushes
            $('.js-video-pushes a.close-button').on('click', function() {
                if (!$('.js-video-pushes__slideshow.opened').length) {
                    return (null);
                } else {}

                _videoPushesCloseHandler();

            });

            // Click event for refine search checkbox
            $('.js-refine-checkbox').on('click', _refineSelectorRadioBoxHandler);



            setTimeout(function() {
                if (_cache.$sizeSelector.length === 0 || _cache.$sizeSelector.val() !== "default" || _cache.$sizeSelector.hasClass('display-none')) {
                    _cache.$engravingWrapper.css('cursor', 'pointer');
                    _cache.$adjustmentWrapper.css('cursor', 'pointer');
                    _cache.$engravingWrapper.on('click', function() {
                        _cache.$engravingWrapper.parent().addLoaderPrepend();
                        _cache.$featuresWrapper.val('engraving');
                        _bindEngravingPopup();
                        _cache.$engravingWrapper.parent().removeLoader();

                    });

                    _cache.$adjustmentWrapper.on('click', function() {                       
                        _cache.$adjustmentWrapper.parent().addLoaderPrepend();
                        _cache.$featuresWrapper.val('adjustment');
                        _bindAdjustmentPopup();
                        _cache.$adjustmentWrapper.parent().removeLoader();
                    });
                } else {
                    //tooltip for Engraving
                    _cache.$engravingWrapper.on('mouseenter', function() {
                        _cache.$tooltipEngraving.find('.js-tool-tip-detail').fadeIn(200);

                    })
                        .on('mouseleave', function() {
                            _cache.$tooltipEngraving.find('.js-tool-tip-detail').fadeOut();
                        });

                    //tooltip for Adjustment
                    _cache.$adjustmentWrapper.on('mouseenter', function() {
                        _cache.$tooltipAdjust.find('.js-tool-tip-detail').fadeIn(200);
                    })
                        .on('mouseleave', function() {
                            _cache.$tooltipAdjust.find('.js-tool-tip-detail').fadeOut();
                        });

                    //tooltip for Shopping Bag button
                    _cache.$addToShopping.on('mouseenter', function() {
                        _cache.$tooltipshopping.find('.js-tool-tip-detail').fadeIn(200);
                    })
                        .on('mouseleave', function() {
                            _cache.$tooltipshopping.find('.js-tool-tip-detail').fadeOut();
                        });
                }

            }, 800);
        },

        /*
        @private method :Clone modal window markup
        @param : none
    */
        _cloneObjects = function() {
            _clone = {
                $clonepopup: $('.js-clone').clone(true, true)
            };
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
      @private method : Handler for engraving popup
      @param : None
    */
        _bindEngravingPopup = function() {

            $(".js-modal-window").empty();
            $("#modalWindow").addCrossButton();
            $('.js-modal-window').append(_clone.$clonepopup);
            $('.js-clone').find('button').removeAttr('disabled');
            // Bind event for cancel button
            $('.js-cancel-ac').on('click', _engrvingButtonsCancleHandler);
            _cacheObjects();
            var clickedButton = _cache.$featuresWrapper.val('engraving');
            popupinitializeAccordion();
            _engravingPreview();
            _engravingClassToggle();
            _adjustmentClassToggle();
            // Check the click event whether it is engraving or adjustment
            if (clickedButton.val() === 'engraving') {
                $(".js-engraving-wrapper").trigger("click");
            }

            setTimeout(function() {
                _cache.$pageWrapper.modalWindow({
                    $modalOverlay: $(".js-modal-features"),
                    $modalWindow: $(".js-window-features")
                });
            }, 800);
        },

        /*
      @private method : Handler for Adjustment popup
      @param : None
    */
        _bindAdjustmentPopup = function() {
            $(".js-modal-window").empty();
            $("#modalWindow").addCrossButton();
            $('.js-modal-window').append(_clone.$clonepopup);
            $('.js-clone').find('button').removeAttr('disabled');
            // Bind event for cancel button
            var _placeholder = $('.js-sizefield').attr('placeholder');

            if (typeof $('.js-sizefield').data('placeholderbackup') === "undefined" && _placeholder !== "")
                $('.js-sizefield').data('placeholderbackup', _placeholder);


            $('.js-cancel-ac').on('click', _engrvingButtonsCancleHandler);
            _cacheObjects();
            var clickedButton = _cache.$featuresWrapper.val('adjustment');
            popupinitializeAccordion();
            _engravingPreview();
            _engravingClassToggle();
            _adjustmentClassToggle();
            // Check the click event whether it is engraving or adjustment
            if (clickedButton.val() === 'adjustment') {
                $(".js-adjust-wrapper").trigger("click");
            }

            _cache.$pageWrapper.modalWindow({
                $modalOverlay: $(".js-modal-features"),
                $modalWindow: $(".js-window-features")
            });

        },


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
            // Append loading div
            $(this).before('<div class="loaderDiv">' + '' + '</div>');
            $('.loaderDiv').addLoader();


            _sendPostRequest('html', $(this).closest('form'), formPath, function(data) {
                _$node = $('<div id="_node"></div>');
                _$node.append($($.parseHTML(data)));

                //Handle Success from the server side  
                if (_$node.find("#success").length === 1) {
                    formName.find('.js-accordion_node__title').trigger('click');
                    cartier.common.addErrorDiv($('.info-icon'), _objPropertiesMsg.messageSentSuccess1, _objPropertiesMsg.messageSentSuccess2);



                    formName.find(".js-accordion_node__desc")
                        .find("form")
                        .remove();
                }
                //Handle Failure from the server side   
                else if (_$node.find("#fail").length === 1) {
                    formName.find('.js-accordion_node__title').trigger('click');
                    $('.info-icon')
                        .after(_failureDiv);
                    $('.message-area').ScrollTo({
                        duration: 800,
                        offsetTop: 140
                    });
                }
                //Handle server side validations
                else if (_$node.find('form').length > 0) {
                    newform = $($.parseHTML(data)).find('form').addBack('form');
                    formName.find(".js-accordion_node__desc")
                        .find("form")
                        .remove()
                        .end()
                        .append(newform);
                    _bindEventOnSubmit(formName, formPath);
                    cartier.formValidationWrapper.applyValidation(formName.find("form"));
                    _displayEmailOrPhone();
                }

                //Handle Failure from the server side   
                else {
                    formName.find('.js-accordion_node__title').trigger('click');
                    $('.info-icon')
                        .after(_failureDiv);
                    $('.message-area').ScrollTo({
                        duration: 800,
                        offsetTop: 180
                    });
                }
            });
        },

        /*
      @private method : Click handler for click on the contact ambassador link
      @param : event
    */
        _bindEventsConHandler = function(e) {
            $('.message-area').remove();
            var contForm = (_cache.$contam.find("form").length > 0);
            if (!contForm) {
                _cache.$contam.find(".js-accordion_node__title").unbind('click', _bindEventsConHandler);
                _cache.$contam.find(".js-accordion_node__desc").addLoader();
                _getAndAppendForm(_cache.$contam, _objPropertiesPth.ambassadorAjaxForm, function() {
                    _cache.$contam.find(".js-accordion_node__desc").removeLoader();
                    _bindEventOnSubmit(_cache.$contam, _objPropertiesPth.ambassadorAjaxForm);
                    _cache.$contam.find(".js-accordion_node__title").on('click', _bindEventsConHandler);
                });
            }
        },

        /*
      @private method :handler for change event for price dropdown
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

            //bind engraving and adjustment link
            if ($(this).val() !== 'default') {
                _cache.$engravingWrapper.css('cursor', 'pointer');
                _cache.$adjustmentWrapper.css('cursor', 'pointer');
                _cache.$engravingWrapper.unbind('click');
                _cache.$engravingWrapper.on('click', function() {
                    _cache.$engravingWrapper.parent().addLoaderPrepend();
                    _cache.$featuresWrapper.val('engraving');
                    _bindEngravingPopup();
                    _cache.$engravingWrapper.parent().removeLoader();
                });
                // Unbind events on engraving link
                _cache.$engravingWrapper.unbind('mouseenter')
                    .unbind('mouseleave');

                // Unbind events on Adjustment link  
                _cache.$adjustmentWrapper.unbind('click');
                _cache.$adjustmentWrapper.on('click', function() {

                    _cache.$adjustmentWrapper.parent().addLoaderPrepend();
                    _cache.$featuresWrapper.val('adjustment');
                    _bindAdjustmentPopup();
                    _cache.$adjustmentWrapper.parent().removeLoader();

                });
                // Unbind events on Adjustment link  
                _cache.$adjustmentWrapper.unbind('mouseenter')
                    .unbind('mouseleave');
                // Unbind events on add to shopping link  
                _cache.$addToShopping.unbind('mouseenter')
                    .unbind('mouseleave');

            } else {
                // Set Cursor property
                _cache.$engravingWrapper.css('cursor', 'default');
                _cache.$adjustmentWrapper.css('cursor', 'default');

                _cache.$engravingWrapper.unbind('click');
                // bind events and show tooltip on Engraving link  
                _cache.$engravingWrapper.on('mouseenter', function() {
                    _cache.$tooltipEngraving.find('.js-tool-tip-detail').fadeIn(200);
                })
                    .on('mouseleave', function() {
                        _cache.$tooltipEngraving.find('.js-tool-tip-detail').fadeOut();

                    });

                _cache.$adjustmentWrapper.unbind('click');
                // bind events and show tooltip on Adjustment link  
                _cache.$adjustmentWrapper.on('mouseenter', function() {

                    _cache.$tooltipAdjust.find('.js-tool-tip-detail').fadeIn(200);

                })
                    .on('mouseleave', function() {
                        _cache.$tooltipAdjust.find('.js-tool-tip-detail').fadeOut();

                    });

                // bind events and show tooltip on Adjustment link  
                _cache.$addToShopping.on('mouseenter', function() {

                    _cache.$tooltipshopping.find('.js-tool-tip-detail').fadeIn(200);

                })
                    .on('mouseleave', function() {
                        _cache.$tooltipshopping.find('.js-tool-tip-detail').fadeOut();

                    });



            }

            // change ref id of product
            if (selectedValue !== 'default') {
                _cache.$productRef.html(refId);
                $('#wishlist_varient_refrence').val("CR" + refId);
            } else {
                _cache.$productRef.html(_initialProductRef);
                $('#wishlist_varient_refrence').val("CR" + _initialProductRef);
            }

            //On change save the size on local Storage
            $.jStorage.set(pid + "size", $selectedOption.val());
            $('.js-product-price').html(newPrice);

            if (numericPrice > 0) {
                $('.product-price').removeClass('display-none');
                $('.product-taxes').removeClass('display-none');
            } else {
                $('.product-price').addClass('display-none');
                $('.product-taxes').addClass('display-none');
            }



            if (typeof $selectedOption.data('availability') === "boolean") {

                if (numericPrice <= 0) {
                    $('.js-addtoshopping,.js-confirm-button').addClass('display-none');
                    $('.js-addtoshopping-call').addClass('display-none');
                } else {
                    if ($selectedOption.data('availability')) {
                        $('.js-addtoshopping, .js-confirm-button').removeClass('display-none');
                        $('.js-addtoshopping-call').removeClass('display-none');
                    } else {
                        $('.js-addtoshopping, .js-confirm-button').addClass('display-none');

                        if($selectedOption.data('sellable')){
                            $('.js-addtoshopping-call').removeClass('display-none');
                        } else {
                            $('.js-addtoshopping-call').addClass('display-none');
                        }
                    }
                }
            }


            if (!showReqPrice) {
                $('.js-request-price').addClass('display-none').removeClass('display-block');
            } else {
                $('.js-request-price').addClass('display-block').removeClass('display-none');
                $('.js-addtoshopping, .js-confirm-button').addClass('display-none');
                $('.js-addtoshopping-call').addClass('display-none');
                $('.product-price').addClass('display-none');
                $('.product-taxes').addClass('display-none');
            }


            //Change the carousel
            if (typeof $selectedOption.data('carousel') === "object" && $selectedOption.data('carousel').length !== 0) {
                var newCarousel = _carouselCloned.clone(),
                    $newul = newCarousel.find('.js-pdp-slider'),
                    $newli = $newul.find('li:eq(0)').clone(true, true),
                    $newthumb = $('.thumbnail-list');

                $newul.empty();
                var thumb360 = $newthumb.find('.degree-border').clone();
                $newthumb.find('.thumbnail').remove();

                var newpathJSON = $selectedOption.data('carousel'),

                    jsonlength = newpathJSON.length;


                for (var i = 0; i < jsonlength; i++) {
                    var _nodeli = $newli.clone();
                    _nodeli.find('img').attr({
                        src: newpathJSON[i]
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

                $newthumb.append(thumb360);

                $('.js-product-carousel').replaceWith(newCarousel);
                _initializeSlider($(".js-product-carousel .js-pdp-slider"));

            }

            //Zoom
            initializeOverlay();

            //360 degree
            initialize360();


        },

        /*
      @private method : Onload AJAX call to update the wishlist dropdown
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
      @private method : Handler to update the wishlist dropdown
      @param : none
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

                var selectedOption = $('.js-select-addtomywishlist option:selected').html();
                $('.copy-to-wishlist').find('.selector span').html(selectedOption);
                $('.js-select-addtomywishlist').on('change', function() {
                    var selectedOption = $('.js-select-addtomywishlist option:selected').html();
                    $('.copy-to-wishlist').find('.selector span').html(selectedOption);
                });

            } else {
                $('.copy-to-wishlist .input-field:eq(0)').addClass('display-none');
            }

        },

        /*
      @private method : Click handler for click on the price add to shopping bag
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
                data: $('.js-product-pdp').find('form').serialize(),
                dataType: 'json',
                contentType: "application/x-www-form-urlencoded",
                beforeSend: function(jqXHR) {
                    if (!$('.js-form-validator-fieldset').find('.js-sizeselector').valid()) {
                        jqXHR.abort();

                    } else {

                        _cache.$addToShopping.attr('disabled', 'disabled').after('<div class="loaderDiv">' + _objPropertiesMsg.pdpLoaderMessage + '</div>');
                        $('.loaderDiv').addLoaderPrepend();
                        // return false to cancel submit 
                        _flushTheLocalStorage($('#productid').val());

                    }
                }
            });

            if (objXHR) {
                objXHR.done(function(data) {
                    // handle failure
                    if (typeof data === "undefined") {} else { // handle success
                        _cache.$addToShopping.removeAttr('disabled');
                        _flushTheLocalStorage($('#productid').val());
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
                            cartier.common.minShoppingBag(cartier.common.JsonLCUpgrader(parsedData), false);

                            $('.js-pop-up-content-wrapper').fadeIn("slow").delay(4000);
                            $('.js-pop-up-content-wrapper').fadeOut("slow");
                        }
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
            var reqForm = (_cache.$reqinfo.find("form").length > 0);
            if (!reqForm) {
                _cache.$reqinfo.find(".js-accordion_node__title").unbind('click', _bindEventsReqHandler);
                _cache.$reqinfo.find(".js-accordion_node__desc").addLoader();
                _getAndAppendForm(_cache.$reqinfo, _objPropertiesPth.requestInfoAjaxForm, function() {
                    _cache.$reqinfo.find(".js-accordion_node__desc").removeLoader(); //Removes the loader
                    _displayEmailOrPhone(); //gives the functionality of chosing email or phone
                    _bindEventOnSubmit(_cache.$reqinfo, _objPropertiesPth.requestInfoAjaxForm);
                    _cache.$reqinfo.find(".js-accordion_node__title").on('click', _bindEventsReqHandler);

                });
            }
        },



        /*
      @private method : ok event handler on pdp (engraving)
      @param : none
    */
        _engrvingButtonsSubmitHandler = function(e) {
            e.preventDefault();

            var clickedButton = _cache.$featuresWrapper.val();

            if (clickedButton === "engraving") {
                if ($(this).closest('form').find('.js-inputfield').valid()) {

                    $(this).closest('form').data('confirmFlag', 'true');
                    _addToShoppingClickHandler(e);

                    $('#modalOverlay-features').hide();
                }
            } else if (clickedButton === "adjustment") {
                if ($(this).closest('form').find('.js-sizefield').valid()) {

                    $(this).closest('form').data('confirmFlag', 'true');
                    _addToShoppingClickHandler(e);

                    $('#modalOverlay-features').hide();
                }
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

        },


        /*
      @private method : cancle event handler on pdp (engraving)
      @param : none
    */
        _engrvingButtonsCancleHandler = function(e) {
            e.preventDefault();

            $("#modalOverlay-features").hide();
            $('.engraving')
                .find('.js-inputfield')
                .val("")
                .trigger('change');
            $('.adjust-size')
                .find('.js-sizefield')
                .val("")
                .trigger('change');

            $('.adjust-size')
                .find('.js-sizefield').removeClass('error').end().find('.error').remove();

            $('.engraving')
                .find('.js-inputfield').removeClass('error').end().find('.error').remove();

            var _placeholder = $('.js-sizefield').data('placeholderbackup');

            $('.js-sizefield').attr('placeholder', _placeholder);

            setTimeout(function() {
                $('.engraving').find('.slide_switch').find('input:eq(0)').trigger('click');
                $('.adjust-size').find('.slide_switch').find('input:eq(0)').trigger('click');
            }, 10); /// Fix for firefox

        },


        //--------------------------------------------------------------------------------------------------------
        //          Initialize Plugins
        //--------------------------------------------------------------------------------------------------------

        /*@private method : initialize accordion of product page
      @param : none 
    */
        popupinitializeAccordion = function() {
            _cache.$accordionObject.makeAccordion({
                showBehaviour: true,
                disableClickOnClickedAcordion: true
            });
        },
        /*
      @private method : initialize accordion of product page
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

        /*
      @private method : Callback for image overlay
      @param : none
    */
        initializingImageInOverLay = function() {
            var winHeight = $(win).height(),
                winWidth = $(win).width();
            var imgPath = $('.js-pdp-slider li:visible').find('.zoom-cursor img').attr('data-original');

            if (typeof imgPath === "undefined")
                imgPath = $('.js-pdp-slider li:visible').find('.zoom-cursor img').attr('src');

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
      @private method : Function to initialize the tabs
      @param : none 
    */
        _initializeTabs = function() {
            _cache.$tabsObject.tabs();
        },


        /*
      @private method : Function to initialize the Slider
      @param : carouselObject 
    */
        _initializeSlider = function(carouselObject) {


            //Cloning for further use
            if (carouselObject.hasClass("js-pdp-slider")) {
                _carouselCloned = $('.js-product-carousel').clone();
                productCarousel = carouselObject.bxSlider({
                    mode: 'fade',
                    speed: 0,
                    controls: false,
                    autoHover: true,
                    pager: false,


                    onSlideAfter: function(currentSlideNumber, totalSlideQty, currentSlideHtmlObject) {
                        $('.active-slider').removeClass('active-slider');
                        $('.active-slide').removeClass('active-slide');
                        $('.js-pdp-slider>li').eq(currentSlideHtmlObject).addClass('active-slider');
                        $('.thumbnail-list .thumbnail').eq(currentSlideHtmlObject).addClass('active-slide');
                    },

                    onSlideBefore: function() {
                        $('.js-pdp-slider>li').eq(0).addClass('active-slider');
                        $('.thumbnail-list .thumbnail').eq(0).addClass('active-slider');

                    }
                });


            } else {
                _carouselCloned = $('.js-product-carousel').clone();
                carouselObject.bxSlider({
                    mode: 'fade',
                    speed: 0,
                    pager: true,
                    controls: false,
                    autoHover: true
                });
            }



        },


        /*
      @private method : Function to initialize the video carousel
      @param : None 
    */
        _initializeVideoCarousel = function() {
            _cache.$videoCarousel.bxSlider({
                mode: 'fade',
                speed: 1000,
                pager: true,
                controls: true,
                autoHover: true,
                bridalPreviewBox: true

            });
        },

        /*
      @private method : Function to initialize the other suggestions carousel
      @param : None 
    */
        _initializeShowcase = function() {

            _cache.$slider.bxSlider({
                mode: 'horizontal',
                speed: 1000,
                auto: false,
                pager: false,
                infiniteLoop: false,
                //preloadImages:'visible',
                minSlides: 3,
                maxSlides: 4,
                slideWidth: 180,
                slideMargin: 20,
                autoHover: true,
                hideControlOnEnd: true
            });
        },

        /*
            @private method : Function to push image in 360 pass as callback function in ovelay.container function
            @param : none 
        */
        /*
      @private method : Handler for 360 degree
      @param : None 
    */
        initializingImagesInView = function() {
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

            setTimeout(function() {

                $(".js-degree360").on('click', function(e) {
                    $('.thumbnail').removeClass('active-slide');
                    $(this).closest('.thumbnail').addClass('active-slide');
                    e.preventDefault();
                    $('.image-tab').removeClass('display-none').addClass('display-block');
                    $(".js-product-carousel").find('.bx-wrapper').addClass('display-none').removeClass('display-block');
                });
                $('.thumbnail-list .thumbnail').eq(0).addClass('active-slide');
                $(".thumbnail-list .thumbnail").on("mouseover", function() {

                    if ($((this)).find('.js-degree360').length === 0) {
                        productCarousel.goToSlide($(this).index());
                        $('.js-product-carousel .bx-wrapper').removeClass('display-none').addClass('display-block');
                        $('.image-tab').removeClass('display-block').addClass('display-none');
                    }
                });
                $(".js-degree360").hover(function() {
                   $(this).trigger('click');
                }, function() {
                });
            }, 3000);

            $(".js-degree360").openOverlay({
                ovelayInitializeClass: 'js-degree360',
                hiddenOvelayClass: 'js-overlay-zoom',
                callback: initializingImagesInView
            });

        },

        /*
      @private method : Function to decide if to display email or password in the req info form
      @param : none 
    */
        _displayEmailOrPhone = function() {
            //clone variables to save the email and phone html 
            var $ph = $(".js-phonenumdisplay").clone(),
                $em = $(".js-emaildisplay").clone();


            //remove phone number on load
            $(".js-phonenumdisplay").remove();

            $(".radio-conpref").on('click', function() {

                if ($('.radio-conpref').find(".radio-btn-li:eq(0) input").is(':checked')) {
                    $(".js-phonenumdisplay").replaceWith($em);
                }

                if ($('.radio-conpref').find(".radio-btn-li:eq(1) input").is(':checked')) {
                    $(".js-emaildisplay").replaceWith($ph);
                }
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
                    $(".js-cursive-switch").parent().addClass('checked');
                    $(".js-bold-switch").parent().removeClass('checked');
                    _cache.$line1.removeClass(_cache.$boldclass).addClass(_cache.$cursiveclass);
                    _cache.$line2.removeClass(_cache.$boldclass).addClass(_cache.$cursiveclass);
                } else
                if ($(".js-bold-switch").is(':checked')) {
                    $(".js-bold-switch").parent().addClass('checked');
                    $(".js-cursive-switch").parent().removeClass('checked');
                    _cache.$line1.removeClass(_cache.$cursiveclass).addClass(_cache.$boldclass);
                    _cache.$line2.removeClass(_cache.$cursiveclass).addClass(_cache.$boldclass);
                }
            });
        },

        /*
      @private method : Function to provide functionality to adjustment
      @param : none 
    */
        _adjustmentClassToggle = function() {
            $(".slide_switch input").change(function() {
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
        @private method : send ajax call, appends the data to the description
        @param : datatype, $form, link, callback 
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
        @param : $node, link, callback 
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
                        var parsedData = $($.parseHTML(data)).find('form').addBack('form');
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
      @private method : On page load to update variants
      @param : product id
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
                            $('.js-pdp-slider li img').each(function(index, el) {
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
            var $newthumb = $('.thumbnail-list')


            var thumb360 = $newthumb.find('.degree-border').clone();
            $newthumb.find('.thumbnail').remove();

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

            $newthumb.append(thumb360);
        },

        _adaptImage = function(arg) {
            var _scaleImageArr;
            if (_scaleImage === "") {
                _scaleImage = $('.js-adaptiveImage:eq(0)').attr('data-original');

                if (_scaleImage == null || typeof _scaleImage === "undefined")
                    return arg;

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
      @private method : handler to update variants
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
                $('.js-addtoshopping, .js-confirm-button').addClass('display-none');
                $('.js-addtoshopping-call').addClass('display-none');
            } else {
                if (data.availability === true) {
                    $('.js-addtoshopping , .js-confirm-button').removeClass('display-none');
                    $('.js-addtoshopping-call').removeClass('display-none');
                } else {
                    $('.js-addtoshopping , .js-confirm-button').addClass('display-none');

                    if(data.sellable){
                        $('.js-addtoshopping-call').removeClass('display-none');
                    } else {
                        $('.js-addtoshopping-call').addClass('display-none');
                    }
                }
            }


            if (!data.showReqPrice) {
                $('.js-request-price').addClass('display-none').removeClass('display-block');
            } else {
                $('.js-request-price').addClass('display-block').removeClass('display-none');
                $('.js-addtoshopping, .js-confirm-button').addClass('display-none');
                $('.js-addtoshopping-call').addClass('display-none');
                $('.product-price').addClass('display-none');
                $('.product-taxes').addClass('display-none');
            }


            if (!data.hasVariants) {
                dropdownOptions.find("option[value='default']").attr({
                    "value": 'false'
                });
                _cache.$sizeSelector.empty();
                _cache.$sizeSelector.append($(dropdownOptions).children());
                $('.sizing-wrapper').addClass('display-none').val('false');

                if ($('.product-features div').is(':visible') === false)
                    $('.product-features').css({
                        "border-bottom": 'none'
                    });

                $('.js-product-price').html(data.productprice);



                if ($('.sizing-wrapper').hasClass('display-none')) {
                    _cache.$engravingWrapper.css('cursor', 'pointer');
                    _cache.$adjustmentWrapper.css('cursor', 'pointer');
                    _cache.$engravingWrapper.on('click', function() {
                        _cache.$engravingWrapper.parent().addLoaderPrepend();
                        _cache.$featuresWrapper.val('engraving');
                        _bindEngravingPopup();
                        _cache.$engravingWrapper.parent().removeLoader();
                    });


                    _cache.$adjustmentWrapper.on('click', function() {
                        _cache.$adjustmentWrapper.parent().addLoaderPrepend();
                        _cache.$featuresWrapper.val('adjustment');
                        _bindAdjustmentPopup();
                        _cache.$adjustmentWrapper.parent().removeLoader();
                    });

                    _cache.$engravingWrapper.on('mouseenter', function() {
                        _cache.$tooltipEngraving.find('.js-tool-tip-detail').css('display', 'none');

                    })
                        .on('mouseleave', function() {
                            _cache.$tooltipEngraving.find('.js-tool-tip-detail').css('display', 'none');
                        });

                    //tooltip for Adjustment
                    _cache.$adjustmentWrapper.on('mouseenter', function() {
                        _cache.$tooltipAdjust.find('.js-tool-tip-detail').css('display', 'none');
                    })
                        .on('mouseleave', function() {
                            _cache.$tooltipAdjust.find('.js-tool-tip-detail').css('display', 'none');
                        });

                    //tooltip for Shopping Bag button
                    _cache.$addToShopping.on('mouseenter', function() {
                        _cache.$tooltipshopping.find('.js-tool-tip-detail').css('display', 'none');
                    })
                        .on('mouseleave', function() {
                            _cache.$tooltipshopping.find('.js-tool-tip-detail').css('display', 'none');
                        });


                }



            } else {
                $('.sizing-wrapper').removeClass('display-none');
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
                        "data-sellable" : data.variants[i].sellable
                    }).html(data.variants[i].size);

                    dropdownOptions.append(optionFiledStructure1);
                }
                _cache.$sizeSelector.empty();
                _cache.$sizeSelector.append($(dropdownOptions).children());
                _cache.$sizeSelector.removeClass('display-none');
                $('.sizing-wrapper').find('.selector').removeAttr('style');
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

            $('.personalise-features .js-cancel-ac').on('click', function() {
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
        _saveButtonAjaxCallBack = function(parsedData, message, title) {
            $('.js-accordion-x .js-accordion_node__title').trigger('click');

            _cache.$addtomywishlistok.confirmBox();
            _cache.$addtomywishlistok.data('plugin_confirmBox').popupInitialize({

                    'title': title,
                    'anchormessage': _objPropertiesMsg.wishlistParagraph,
                    'src': $('.js-wishlist_link_secure').val() + ".html",
                    'buttons': {
                        'ok': {
                            'buttonName': _objPropertiesMsg.okButton,
                            'class': 'cta-button cta-button__inner cta--red'

                        }
                    }
                },
                _cache.$addtomywishlistok.data('plugin_confirmBox').confirmHide
            );
            $('.popup-close-button').on('click', function() {
                _cache.$addtomywishlistok.data('plugin_confirmBox').confirmHide();
            });
        },

        /*
      @private method : Video pushes hover handler
      @param : None
    */
        _videoPushesHoverHandler = function() {
            $('.js-video-pushes-wrapper , .js-video-pushes__inner').clearQueue();
            if (!$('.js-video-pushes__teaser.opened').length) {
                return (null);
            }
            $('.js-video-pushes-wrapper , .js-video-pushes__inner').animate({
                height: 130
            }, 500);

        },

        /*
      @private method : Video pushes no hover handler
      @param : None
    */
        _videoPushesUnHoverHandler = function() {
            $('.js-video-pushes-wrapper , .js-video-pushes__inner').clearQueue();
            if (!$('.js-video-pushes__teaser.opened').length) {
                return (null);
            }
            $('.js-video-pushes-wrapper , .js-video-pushes__inner').animate({
                height: 120
            }, 500);

        },

        /*
      @private method : Video pushes click handler
      @param : None
    */
        _videoPushesClickHandler = function() {
            if (!$('.js-video-pushes__slideshow.closed').length || $('.js-video-pushes__slideshow.closethis').length) {
                $('.js-video-pushes__slideshow.closed').removeClass('closethis');
                return (null);
            }


            var slideshowHeight = $('.js-video-pushes__slideshow').height() + 50;
            $('.js-video-pushes__teaser').fadeOut('400');
            $('.js-video-pushes-wrapper , .js-video-pushes__inner').animate({
                height: slideshowHeight
            }, 500, function() {
                if ($('.js-multiple-video .js-slider').length) {
                    $('.js-multiple-video .js-slider').find('li iframe').css({
                        height: '650',
                        width: 'inherit'
                    });
                }
            });
            $('.js-video-pushes__slideshow').fadeIn('400');
            $('.js-video-pushes a.close-button').fadeIn('400');
            $('.js-video-pushes__slideshow').removeClass('closed').addClass('opened');
            $('.js-video-pushes__teaser').removeClass('opened').addClass('closed');
        },


        /*
      @private method : Video pushes close handler
      @param : None
    */

        _videoPushesCloseHandler = function() {
            var teaserHeight = $('.js-video-pushes__teaser').height();
            $('.js-video-pushes__teaser').fadeIn('400');
            $('.js-video-pushes-wrapper , .js-video-pushes__inner').animate({
                height: teaserHeight
            }, 500);
            $('.js-video-pushes__slideshow').fadeOut('400');
            $('.js-video-pushes a.close-button').fadeOut('400');

            $('.js-video-pushes__slideshow').removeClass('opened').addClass('closed').addClass('closethis');
            $('.js-video-pushes__teaser').removeClass('closed').addClass('opened');

        },

        /*
      @private method : Add to top link
      @param : None
    */
        _addBacktoTopLink = function() {
            var wWidth = $(win).width(),
                mainWidth = $('.main-container').width(),
                gutter = (wWidth - mainWidth) / 2,
                rightPos = mainWidth + gutter;
            $('.js-link-to-top a').css('left', rightPos + 'px');

            // Scroll to top when your click on link.

            $('.js-link-to-top a').on('click', function(event) {
                event.preventDefault();
                $('.main-container').ScrollTo({
                    top: 0,
                    duration: 800,
                    offsetTop: 140
                });
            });


            // Function to show and hide the top link when you scroll.
            if ($('.main-container').length > 0) {
                $(win).scroll(function() {


                    var wScrollTop = $(this).scrollTop(),
                        tOffsetTop = $('.js-product').offset().top;
                    if (wScrollTop >= (tOffsetTop - 100)) {
                        $('.js-link-to-top a').addClass('is-fixed').fadeIn(100);
                    } else {
                        $('.js-link-to-top a').fadeOut(300, function() {
                            $(this).removeClass('is-fixed');
                        });
                    }
                });
            }

        },

        /*
      @private method : Initialize JW player
      @param : None
    */

        _initializeJw = function() {

            jwplayer("js-video-player").setup({
                file: "https://www.youtube.com/watch?v=kNrkt5X687Q",
                title: '[L\'Odyssée de Cartier] Never Be Afraid Again',
                width: '100%',
                aspectratio: '16:9',
                fallback: 'true',
                autostart: 'false',
                primary: 'html5',
                skin: '../xmls/main_theme_skin/main_theme_skin.xml',
                "controlbar.idlehide": true,
                sharing: {
                    code: encodeURI("<iframe src='http://www.youtube.com/embed/kNrkt5X687Q' />"),
                    link: "http://www.youtube.com/embed/kNrkt5X687Q"
                }
            });
        },


        /*
        @private method : Guest account
        @param : loggedIn :- login in or not 
    */
        _guestAccount = function(loggedIn) {

            if (loggedIn) {
                $('.js-addtomywishlist-ok').on('click', function(e) {
                    var ClickedEl=$('.js-addtomywishlist-ok');
                    e.preventDefault();
                    cartier.common.addSelectionToWishlist("", "addPDPwishlist", _saveButtonAjaxCallBack, _objPropertiesMsg.wishlistParagraph, _objPropertiesMsg.wishlistcopytoWishlist, ClickedEl);
                });

                $('.js-createnewwishlist-ok').on('click', function() {

                    cartier.common.addSelectionToWishlist(_createWishlistValidation, "createPDPwishlist", function(data) {
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



                        _saveButtonAjaxCallBack("", _objPropertiesMsg.wishlistParagraph, _objPropertiesMsg.wishlistcopytoWishlist, $('.js-addtomywishlist-ok'));

                    });
                });

            } else {

                $('.js-add-selection').on('click', function() {
                    var ClicedEl=$(this);
                    cartier.common._guestAccountAjaxCallHandler("GuestUserWishList", ClicedEl);


                });
            }


        },

        /*
        @private method : Validation for Create Wishlist and popup
        @param : login in or not 
    */

        _createWishlistValidation = function(jqXHR) {

            if (_cache.$createWishlistInput.val() === '') {
                $('body').confirmBox();
                $('body').data('plugin_confirmBox').popupInitialize({
                        'title': _objPropertiesMsg.createWishlishlistValidation,
                        'buttons': {
                            'ok': {
                                'buttonName': _objPropertiesMsg.okButton,
                                'class': 'cta-button cta-button__inner cta--red'
                            }

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

        /*
        @private method : Handler for refine radio button
        @param : loggedIn :- None
    */
        _refineSelectorRadioBoxHandler = function() {
            $(this).toggleClass('is-checked');
        },

        /*
        @private method : Hover event for maison
        @param : None
    */
        initializeMisionHover = function() {
            $(".maison-nav li").hover(
                function() {

                    $(this).find(".arrowSecond").addClass("hover");
                    $(this).find(".arrowSecond").css("background-color", "#ffffff");
                    $(this).find(".arrowFirst").css("background-color", "#ffffff");
                    $(this).find(".arrowFirst").addClass("hover");
                }, function() {
                    $(this).find(".arrowSecond").removeClass("hover");
                    $(this).find(".arrowFirst").removeClass("hover");
                    $(this).find(".arrowSecond").css("background-color", "");
                    $(this).find(".arrowFirst").css("background-color", "");
                }
            );


        },

        /*
        @private method : Bind event for maison navigation
        @param : None
    */
        _navMasionHandler = function() {

            $(".link").click(function() {
                $('.active').addClass('display-none');
                $('.link').removeClass('display-none');
                $(this).addClass("display-none");
                $(this).next().removeClass("display-none");

            });
        },//change Images
        _onload=function(){

            var bold=$('.js-imageEngraving').data('bold');
            var crusive=$('.js-imageEngraving').data('cursive');
             if($("#bold").prop("checked", true)){
                 if(bold)
                $(".js-imageEngraving").attr('src', bold); 


             }else{
                 if(crusive)
                    $('.js-imageEngraving').attr('src',crusive);

             }




          },


        /*
        @private method : Handler for Refine selection header
        @param : None
    */
        _refineSelectorFixedHeader = function() {
            $(win).scroll(function() {

                if ($('.collection__refine-selection__category').length > 0) {
                    var wScrollTop = $(this).scrollTop(),
                        tOffsetTop = $('.product-list-wrapper').offset().top;

                    if (wScrollTop >= tOffsetTop - 50) {
                        $('.collection__refine-selection__category').addClass('is-fixed');
                    } else {
                        $('.collection__refine-selection__category').removeClass('is-fixed');
                    }
                }


            });
        },



        /*
        @private method : Initiliaze video slider
        @param : None
    */
        _initializeVideoSlider = function() {
            _cache.$videoslider.bxSlider({
                mode: 'horizontal',
                speed: 1600,
                auto: true,
                autoHover: true,
                video: true,
                onSliderLoad: function() {$(window).resize();}
            });
        },


        /*
        @private method : Initiliaze single video carousel
        @param : None
    */
        _initializeSingleVideoSlider = function() {
            _cache.$videoslider.bxSlider({
                mode: 'horizontal',
                speed: 1200,
                auto: true,
                pager: false,
                autoHover: true,
                controls: false,
                video: true
            });

        },


        /*
        @private method : Show and hide tab for similar product data is available or not
        @param : None
    */
        _hideSimilarProduct = function() {

            if ($('.js-tab-hide-show').data('tabhide') === "") {

                $('.js-tab-list li').eq(0).addClass('display-none');
                $('.js-content-active').eq(0).addClass('display-none');

                setTimeout(function() {
                    $('.js-tab-list li').eq(1).trigger("click");
                }, 3);

            } else {
                $('.js-tab-list li').eq(0).removeClass('display-none');
                $('.js-tab-list li').eq(1).removeClass('js-tab-active tab-active');
            }

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
            decimalPattern = "[0-9]+(\.[0-9][0-9]?)?",
            sizeInputField = $("input[name='fn_wristsize']");
        min = parseFloat(sizeInputField.data('min'));
        max = parseFloat(sizeInputField.data('max'));

        if (isNaN(min)) min = 5;
        if (isNaN(max)) max = 10;

        var patt1 = new RegExp(decimalPattern);
        var validNo = patt1.test(value);
        if (validNo === true && value >= min && value <= max) {

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



    //--------------------------------------------------------------------------------------------------------
    //          Public functions
    //--------------------------------------------------------------------------------------------------------



    /*
      @public method :Init function for initializing the module
      @param : none
    */
    product.init = function() {
        var bold=$('.js-imageEngraving').data('bold');
        var crusive=$('.js-imageEngraving').data('cursive');
        initializeMisionHover();
        _navMasionHandler();
        var loggedIn = cartier.common.isLoggedIn();
        _objPropertiesPth = cartier.properties.paths;
        _objPropertiesMsg = cartier.properties.messages;

        _htmlTemplateInit();
        // caching the jquery objects
        _cacheObjects();
        initialize360();
        // store initial product ref no
        _initialProductRef = _cache.$productRef.html();
        _bindEvents();
        _cloneObjects();
        _guestAccount(loggedIn);

        if ($('.js-product-pdp').length > 0)
            _onPageLoadCalls(); // Must be called as soon as the page loades

        _hideSimilarProduct();
        _initializeShowcase();
        initializeOverlay();

        // initializeAccordion();
        _initializeTabs();


        if (loggedIn) {
            initializeAccordionX();
            _onPageLoadCalls2();
        }

        if (_cache.$pdpslider.length) {
            _initializeSlider(_cache.$pdpslider);
        }

        if (_cache.$videoCarousel.length) {
            _initializeVideoCarousel();
        }


        cartier.formValidationWrapper.init();

        _addValidation();

        if (_cache.$videoslider.length) {
            if ($('.js-slider > li').not('.bx-clone').length === 1) {
                _initializeSingleVideoSlider();
            } else {
                _initializeVideoSlider();
            }

        }

        _textFieldGetterSetter();
        if ($('.js-collection__refine-selection').length > 0) {
            _refineSelectorFixedHeader();
        }

        if ($('.js-link-to-top').length > 0)
            _addBacktoTopLink();

        if ($('#js-video-player').length > 0)
            _initializeJw();

        localStorage.removeItem('backButtonEvent');
        //new changes
         _onload();
            $('.js-bold-switch').on('click', function(){
                if(bold)
                   $(".js-imageEngraving").attr('src', bold); 
              });
            $('.js-cursive-switch').on('click', function(){
                if(crusive)
                $('.js-imageEngraving').attr('src',crusive);
            });
    };


 }(window, jQuery, cartier.product));

 /*product page ajax call ends here============================================================================= */