/*!
* cartier.properties.js
* This file contains common properties
*
* @project   cartier mobile
* @date      2014-01-03
* @author    SapientNitro 
* @licensor  cartier mobile
* @site      cartier mobile
@dependency cartier.core.js
* @ NOTE:
This file has the following sequence of the actions
1) This files contains the common properties
 */
(function(window, $, properties) {

	properties.init = function() {

		cartier.properties = {
			paths: {

				ambassadorAjaxForm: '../includes/components/ambassador_form/html.shtml', ///////    $('.reqAmbPagePath').val(),
				requestInfoAjaxForm: '../includes/components/request_info_form/html.shtml', ///////    $('.reqInfoPagePath').val(),
				addToCartLink: '../json/shoppingBagUpdate1.json', ///////      window.location.href.replace('.html', '.variant.html'),
				productListJson: '../json/product_list.json',
				availabilityJson: '../json/availability.json', ///////     window.location.href.replace('.html', '.variant.html')
				storeListJson: '../json/store_list.json', /////// storelocator.pagePath + "/jcr:content.json"
				saveWishlist: '../json/wishlist.json', //////// '/bin/richemont/wishlist',
				getCart: '../json/shoppingBagUpdate1.json', ///////     '/bin/cartier/cart.GetCart.json'
				doyouown: '../json/doyouown.json', ///////     '/bin/richemont/private/ownCreation.json' 
				billingformconf: '../json/billingformconf.json', ///////     '/bin/richemont-car/core/components/forms/confirmBillingForm',
				loginForgotPass: '../json/forgot_pass.json', ///////   '/bin/richemont-car/core/components/forgotpassword'
				pricePath: '../json/price_list.json', ///////     '/bin/cartier/getPrices.all'
				deleteTeaser: '../json/shoppingBagUpdate1.json', ///////     '/bin/cartier/cart.DeleteCart.json'
				quantityChange: '../json/shoppingBagUpdate1.json', ///////     '/bin/cartier/cart.ModifyCart.json'
				productUpdate: '../json/shoppingBagUpdate1.json', ///////     '/bin/cartier/cart.PersonalizeCart.json'
				bagCheckout: '../json/shoppingBagUpdate1.json', ////////  '/bin/cartier/checkout'
				reviewOrder: '',
				loginCountryDropdown: '../json/countrySelector.json?country=', ////////  '/bin/richemont/private/countrydropdown.json'
				loginCapcha: '../json/login_ajax.json', /////////  '/bin/cartier/myCaptcha.json'
				sizeUpdateShopping: '../json/shoppingBagUpdate1.json', ///////     '/bin/cartier/cart.UpdateSize.json'
				countrydropdown: '../json/shoppingBagUpdate1.json', ////////bin/cartier/cart.CountryChange.json
				addressSubmit: '../json/addressSubmit.json',
				addressSubmitReg: '../json/addressSubmit.json',
				tinyUrlAjaxCall: '../json/tinyurlAjax.json', /////////'/bin/richemont/private/socialShare'
				socialEmailForm: '../json/socialEmailForm.json', /////////'/bin/richemont/private/socialemailform'
				createAccountForm: '../json/createAccountForm.json', // richemont-car/core/components/forms/registeraccountform
				reqinfoPagePathSubmit: '../json/reqInfo.json', /////   /bin/richemont-car/core/components/forms/requestinfoform
				conAmbPagePathSubmit: '../json/reqInfo.json', //////   /bin/richemont-car/core/components/forms/requestambassadorform
				requestPriceAjaxForm: '../includes/components/request_price_form/html.shtml', ///////    $('.reqPricePath').val(),
				reqPricePathSubmit: '../json/reqInfo.json', //////   /richemont-car/core/components/forms/requestpriceform
				deleteSectionInBag: '../json/shoppingBagUpdate1.json', //////////   '/bin/cartier/cart.RemovePersonaliation.json'
				actionControllerPath: '/cms-base/richemont/form/actionController?actionName=',
				editAddressPath: '/includes/views/ecs-my-address/html.shtml',
				confirmAddressPath: '/json/thankyou.json',
				jsonAddressPath: '/json/ecsPreregistration.json',
				searchViewMoreAjax: '../json/searchViewMore.json',
				checkoutCallRes: '../json/checkoutAjax.json',
				collectionJson: '../json/selection.json' ///////     window.location.href.replace('.html', '.variant.html')
			},

			messages: {
				mandatory: "Field is mandatory, please fullfill",
				validEmailIdRequired: "Email has unrecognized format",
				minlength: "Please enter at least {0} characters!",
				messageSentSuccess1: "Your message has been sent",
				messageSentSuccess2: "Your request has been submitted to our Client Relations Center. We will contact you as soon as possible.",
				messageSentFailure: "A technical error happened, please try again",
				noConnection: "Right now ,There was some server error this message is shown.",
				fileNotFound: "Right now ,There was some server error this message is shown.",
				serverError: "Right now ,There was some server error this message is shown.",
				parserError: "Right now ,There was some server error this message is shown.",
				timeout: "There was some server error while making this request5",
				ajaxReqAbort: "There was some server error while making this request6",
				noJSONprovided: "No JSON provided by the module",
				badJSONProvided: "JSON is not in the predefined format",
				//invalidSize: "You must select a size",
				validOption: 'Please select a valid option',
				defaultValue: 'default',
				sameEmailRequired: 'Emails are not corresponding',
				samePasswordRequired: 'Passwords are not corresponding',
				valueNotEquals: 'Value must not equal arg',
				disabledValueSelected: 'Please select a value which is not disabled',
				InputLetterAndNubmer: 'Please enter Letters and Numbers only',
				exactLength: 'Please enter exactly {0} characters',
				showPassword: 'show',
				hidePassword: 'hide',
				myAddressTitle: 'Delete Confirmation',
				myAddressMessage: 'You are about to delete this item.Continue?',
				myAddressYesButton: 'yes',
				myAddressNoButton: 'no',
				wishlistNoItems: 'There are 0 items in your Wishlist',
				okButton: 'ok',
				wishListSavePopup: 'your comment has been updated',
				cartEmpty: 'Cart is empty.',
				wishListeditText: 'edit ',
				cancelButton: 'cancel',
				yesButton: 'Yes',
				noButton: 'No',
				countrySelectorMsg: 'By submitting this button, you\'ll be redirected automatically to  continue your subscription.',
				countrySelectorTitle: 'DISCOVER YOUR DEDICATED LOCAL WEBSITE.',
				cardNotValid: 'Invalid card number',
				cvvNotValid: 'Invalid cvv number',
				notaNumber: 'This field has to be a number',
				addressLookupWrongAlphabet: 'Wrong alphabet is used, please use the alphabet of the choosen country.',
				wrongNameFormate: 'Field has not the right format',
				passWeak: 'Password is weak',
				notInRange: 'Value filled is not in the range or has wrong format',
				dateValidation: 'Date is not valid',
				addThisCreation: 'Add this creation',
				addingToCart: 'Adding product to the cart...',
				wishlistcopytoWishlist: 'selection added to your wishlist',
				wishlistParagraph: 'My wishlists',
				wishlistDeleteMessage: 'Wishlist deleted',
				yourOwnedCreations: 'Your owned creations',
				invalidPasswordMessage: 'Your Email/Password is invalid',
				messageEmpty: 'Message content can\'t be empty, please select blank card for sending an empty card',
				boutiqueCartierText: 'Boutique Cartier ',
				boutiqueDescText: ' : discover the Cartier creations in the Cartier boutiques and authorised points of sales in the world',
				exact: 'Exact',
				loose: 'Loose',
				productRefineNoResult: 'SORRY, THESE MODELS ARE NOT AVAILABLE AT THIS TIME',
				day: "day",
				month: "month",
				wishlistDeleted: "Wishlist Deleted",
				selectValue: "- Select -",
				fieldErrorMessage: "Field has not the right format",
				savingAddress: "Saving the address ... ",
				createAccount: "Create an account",
				productDeleted: "selection removed successfully",
				marraigeDateValidation: "Wedding date should not be before birth date",
				japanNameFieldError: "The field should only have katakana double byte character",
				valueInBetween: "Size from",
				andString: "and",
				countrydropdownText: "You do not have an account in this country. To log in, please select a country from the drop-down list below. If you wish to create an account in the current country, please register.",
				kanjiError: "Invalid kanji character.",
				katakanaError: "Invalid katakana character.",
				birthDateValidation: "Birth date is not valid",
				charactersMax: "characters max",
				pobox: "PO Box",
				toWordString: "to",
				hasNoSpace: "This field should not contain a blank space",
				forgotPasswordPopupHeading: 'Your password has just been sent.',
				forgotPasswordPopupText: 'You may consult your mailbox.<br> Once connected to your account, don\'t forget to modify your password. Your current password can only be used once due to security purposes.',
				forgotPasswordPopupHeadingFail: 'Your password has not been sent.',
				forgotPasswordPopupTextFail: 'You may consult your mailbox.<br> Once connected to your account, don\'t forget to modify your password. Your current password can only be used once due to security purposes.',
				loginFromDifferentCountry: "You do not have to account for this country. To log on, simply select a country from the dropdown below. If you want to create an account on the current country, please register.",
				tweeterStaticText: '- Check this on @Cartier website',
				wishListProductRemoved: 'Some products have been removed from your selection for availability reasons.',
				contactAmbassadorCancelOptionText: 'Create an account',
				engravingErrorMessage: "Fill atleast one line",
				sendAFriendHeading: "Email sent to the friend",
				sendAFriendHeadingText: "Your message has been sent",
				forbidden : "Forbidden"
			}
		};
	};

}(window, jQuery, cartier.properties));