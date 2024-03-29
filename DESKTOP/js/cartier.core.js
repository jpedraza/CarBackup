/*!
 * cartier.core.js
 * This file contains application namespace and initializing the other modules
 *
 * @project   cartier mobile
 * @date      2014-01-03
 * @author    Sapient
 * @licensor  cartier
 * @site      cartier mobile
   @dependency none
 * @ NOTE:
    This file has the following sequence of the actions
    1) Declare all the private variables

 */
var cartier = cartier || {}; // core namespace

var CQ = CQ || {};

(function(window, $, cartier, undefined) {
    //this will cause the browser to check for errors more aggressively
    'use strict';

    //check if jquery is defined, else retun
    if ($ === undefined) {
        cartier.log("jQuery not found");
        return false;
    }

    cartier.debug = true;
    /*module objects*/
    cartier.home = {};
    cartier.login = {};
    cartier.billing = {};
    cartier.myaccount = {};
    cartier.product = {};
    cartier.wishlist = {};
    cartier.productlist = {};
    cartier.boutique = {};
    cartier.boutiqueDispatch = {};
    cartier.others = {};
    cartier.shoppingbag = {};
    /*common objects*/
    cartier.properties = {};
    cartier.common = {};
    cartier.countryHandler = {};
    /*wrapper objects*/
    cartier.formValidationWrapper = {};
    cartier.ajaxWrapper = {};
    cartier.template = {};
    cartier.pendingestimatelist = {};
    cartier.sfy = {};
    cartier.sfy_step1 = {};
    cartier.gift_for_you = {};
    cartier.multiple_video = {};
    cartier.location = {};
    cartier.maison = {};
    cartier.ecsRegistration = {};
    cartier.ecsPayment = {};
    //cartier.desktop_common={};
    /*
    @private method : initailize the module
    */
    var initializeModule = function() {


        ////// CREATED A DUMMY COOKIE TO MAKE MINICART AND CART QUANTITY WORK
        $.cookie('carqty','{"count":2,"total":"$26,784","totalInfo":"checkout.label.tax.inclTaxesText","teaserArray":[{"productTitle":"anaar","productDesc":"quartz, yellow gold","imageURL":"/content/dam/rcq/car/58/19/28/581928.png/jcr:content/renditions/cq5dam.thumbnail.319.319.png","selectedQuantity":3,"variantID":"W1529856","totalDisplayPrice":"$1,280"},{"productTitle":"anaar","productDesc":"quartz, yellow gold","imageURL":"/content/dam/rcq/car/58/19/28/581928.png/jcr:content/renditions/cq5dam.thumbnail.319.319.png","selectedQuantity":3,"variantID":"W1529856","totalDisplayPrice":"$1,280"}]}');
        
        // cartier.desktop_common.init();
        cartier.properties.init(); ////////////////////////////////////TO BE CHANGED IN CQ
        //Initialize Global things

        if ($('.body-wrapper').length) {
            cartier.common.init();
        }
        //Initialize Module level things

        if ($('.js-login').length || $('.js-forgotpassword').length) {
            cartier.login.init();
        }

        if ($('.js-product').length) {
            cartier.product.init();
        }

        if ($('.js-productlist').length) {
            cartier.productlist.init();
        }
        if ($('.js-home').length) {
            cartier.home.init();
        }

        if ($('.js-myaccount').length || $('.js-personal-info-form').length || $('.js-reg-step-2').length || $('.js-jp-reg-step-3').length || $('.js-subscription-and-interest-form').length || $('.js-ask-appointment-form').length || $('#address-container').length) {
            cartier.myaccount.init();
        }

        if ($('.js-ecsV3Registration').length) {
           cartier.ecsRegistration.init();
        }

        if ($('#paynow').length) {
           cartier.ecsPayment.init();
        }


        if ($('.js-billing').length) {
            cartier.billing.init();
        }


        if ($('.js-boutique').length) {
            // var scriptSrc = "//maps.google.com/maps/api/js?key=AIzaSyCfRRGowVUnkquuaAujaJQZYsfV770gvxg&sensor=false&language=en&version=3.8&libraries=places,geometry";
            //cartier.common.addApiScript(scriptSrc);
            cartier.boutique.init();
        }

        if ($('.js-country-list-wrapper').length) {
            cartier.boutiqueDispatch.init();
        }

        if ($('.js-others').length) {
            cartier.others.init();
        }

        if ($('.js-wishlist').length) {
            cartier.wishlist.init();
        }

        if ($('.js-shoppingbag').length) {
            cartier.shoppingbag.init();
        }

        if ($('.js-repair-service').length) {
            cartier.pendingestimatelist.init();
        }

        //if ($('.js-form-validator').length || $('.form-layout').length || $('.js-boutique').length > 0) {
            cartier.formValidationWrapper.init();
        //}

        if ($('.js-sfy').length) {
            cartier.sfy.init();
            cartier.sfy_step1.init();
        }

        if ($('.js-video').length) {
            var youtubeApi = 'https://www.youtube.com/iframe_api';
            cartier.common.addApiScript(youtubeApi);
            cartier.others.initializeVideo();
        }

        if ($('.js-social-share').length) {
            cartier.common.socialShareHandler();
           // cartier.common.emailDisplayHandler();
        }

        if ($('.use-location').length || $('.js-location').length) {
            cartier.location.init();
        }

        if ($('.js-gift-for-you').length) {
            cartier.gift_for_you.init();
        }

        if ($('.js-multiple-video').length) {

            cartier.multiple_video.init();
        }
        if ($('.js-living-heritage').length) {
            cartier.maison.init();
        }
        cartier.ajaxWrapper.init();
        cartier.template.init();
        $('.body-wrapper').analytics();

        //     var $menuSliderWrapper = $('.left-push-menu');
        //      $menuSliderWrapper.menuslider();
    };
    /*
      @pubic method : initailize the module
      */
    cartier.init = function() {
        cartier.log('JS-LOG:Core Init Called');
         cartier.common._CQI18nCreator();
        $("input:checkbox, input:radio, select").not('.no-uniform').uniform();
        initializeModule();
    };



    /**
     * Logging function, for debugging mode
     */
    cartier.log = function() {
        if (cartier.debug) {
            var index = 0;
            try {
                if (arguments.length === 1) {
                    console.debug(arguments[index]);
                } else {
                    console.log(Array.prototype.slice.call(arguments));
                }
            } catch (e) {}
        }
    };


}(window, jQuery, cartier));