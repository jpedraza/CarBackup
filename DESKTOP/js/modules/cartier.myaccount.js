/*
 * cartier.myaccount.js
 * This file contains functionalities handling the my account module
 *
 * @project   cartier Desktop
 * @date      2014-01-03
 * @author    Sapient 
 * @licensor  cartier Desktop
 * @site      cartier Desktop
   @dependency cartier.core.js
 * @ NOTE:
    This file has the following sequence of the actions
    1) Declare all the private variables
    2) caching jquery wrapper objects and messages
    $last) call to init() method
 */

;
(function(window, $, myaccount, undefined) {
	//this will cause the browser to check for errors more aggressively
	'use strict';

	//check if Jquery is defined, else return
	if (typeof $ === 'undefined') {
		//console.log('jQuery not found');
		return false;
	}

	/*
        private variables
    */

	var
	_cache = {},
		_objPropertiesMsg,
		_objPropertiesPath,
		addressCountryName,
		_bobjaddressList = [],
		_initialNewsLetterCheck = false,
		_initialCatalogeCheck = false,


		/*
          @private method : caching jquery objects 
          @param : none 
        */
		_cacheObjects = function() {

			_cache = {
				$myaccount: $('.js-myaccount'),
				datePicker: $('.js-date-picker'),
				accordionObject: $('.js-accordion'),
				checkbox: $('.js-radiobox'),
				$doyouownBox: $('.js-owncreation-container'),
				$radioTab: $('.js-radio-tabs'),
				$addressLookupEdit: $('#address-listing-detail-view').find('.addressAction .edit'),
				$addressLookupDelete: $('#address-listing-detail-view').find('.addressAction .delete'),
				$accesoriesCheckBox: $('.js-acessories'),
				$accesoriesList: $('.js-accessories-list'),
				$addressSubmit: $('.js-address-submit'),
				$addressSubmitReg: $('.js-address-submit-reg'),
				$myaddressSelector: $('.js-my-address .select-wrapper select'),
				$passwordInput: $('.js-changepass'),
				$changePasswordField: $('.js-confirmpass'),
				$addressDropDown: $('#address'),
				$addressContainer: $('#address-listing-detail-view'),
				$myAddressUsForm: $('.js-address-form'),
				$ukMyaddressCountryDropDown: $('.js-address-form-uk form #addressform_country'),
				$myAddressFromAddressSelect: $('.js-address-form input[name=fn_grpaddr]'),
				$radioGroupProductinterested: $('.fn_grpinterdin'),
				$radioGroupAccessories: $('.fn_grpinterdinacc'),
				$accesoriesInputfield: $('.fn_grpinterdin input[value="ACCESSORIES"]'),
				$radioGroupAccessoriesHeadingField: $('.fn_grpinterdinacc').closest('.group-wrapper').prev('.heading-wrapper'),
				$addressCountryNameVal: $('input[name="countryCode"]').val(),
				$addressCountryName: $('input[name="countryCode"]'),
				$ukMyAddressResetBut: $('.js-address-form-uk form .reset'),
				$bobjsave: $('.js-bobj-save-botton')


			};

		},

		//--------------------------------------------------------------------------------------------------------
		//          EVENT Bindings
		//--------------------------------------------------------------------------------------------------------

		/*
          @private method : bind events
          @param : none
        */

		_bindEvent = function() {

			//Onclick bind event for save button
			_cache.$addressLookupEdit.on('click', {
				action: 'edit',
				variable: '?id='
			}, _addressChangehandler);

			//Onclick bind event for Delete button
			_cache.$addressLookupDelete.on('click', {
				action: 'delete',
				variable: '?del=',
				ele: $(this),
				callBackFunction: _addressChangehandler
			}, _showPopUpBoxHandler);

			_cache.$addressSubmit.on('click', {
				path: _objPropertiesPath.addressSubmit
			}, _ajaxCallHandlerFormSubmit);

			_cache.$addressSubmitReg.on('click', {
				path: _objPropertiesPath.addressSubmitReg
			}, _ajaxCallHandlerFormSubmit);

			// onclick event bind on accessories check box
			_cache.$accesoriesCheckBox.on('click', _dispalyAccessoriesList);

			_cache.$myaddressSelector.on('change', _addressSelector);

			_cache.$addressDropDown.on('change', _addressChangehandlerDesktop).trigger('change');

			_cache.$ukMyaddressCountryDropDown.on('change', _showHideFromFiledForUk);

			_cache.$ukMyAddressResetBut.on('click', _findAddressReset);

			_cache.$bobjsave.on('click', function(e) {
				e.preventDefault();
				_saveButtonBobjHandler();
			});

			// disable address field acording selected radio button
			_cache.$myAddressFromAddressSelect.on('click', _disableAddressFiled);
			

			_cache.$accesoriesInputfield.on('click', _showAccessoriesBlock);


			$('.appointment_contacttype input.form-radio').on('change', _contactPreferenceDisplayHandler);


			// trigger  reg step-3 validation
			$('.js-reg-step-3').find('input').on('change blur', _validationFixForStep3);

			if (cartier.countryHandler.isJP) {
				$('.js-jp-reg-step-3').find('input').on('change blur', _validationFixForStep3);
			}

			$('#js-subscription-and-interest-form').find('.button-wrapper').on('click', function() {

				if (!_initialNewsLetterCheck && $('#fn_newsletter').is(':checked'))
					$('input[name="subscriptionFlag"]').val(true);

				if (!_initialCatalogeCheck && $('#fn_catalogue').is(':checked'))
					$('input[name="catalogFlag"]').val(true);

			});

			/* “ DATE  07-11-2014|  DEFECT- CARE -4766 | BRANCH 2.0.0”  
    			START bind event
        
    		*/
			if ($('#js-personal-info-form').length) {
				$('#js-personal-info-form input[type="text"]').each(function(index) {
					$(this).val($(this).val().replace(/&#039;/gi, '\''));
				});
			}

			if (cartier.countryHandler.isJP) {
				$("#find_addressjapan").on('click', _findAddressAjaxCall);
			}
			/*END*/
		},



		//--------------------------------------------------------------------------------------------------------
		//          EVENT HANDLERS
		//--------------------------------------------------------------------------------------------------------
		/* “ DATE  07-11-2014|  DEFECT- CARE -4766 | BRANCH 2.0.0”  
    			START zip code validation function and ajax call bind
        
    	*/
		/*
          @private method : find address ajax call Japan
          @param : event -default event Object 
        */
		_findAddressAjaxCall = function(event) {
			event.preventDefault();
			var validation = true,
				resourcePath = $("#resourcePath").val();

			// set action type ok button 
			//$(this).closest('form').find('.js-actiontype').val('ok');

			validation = applyValidationForFindAnAdress();

			if (validation) {
				var $form = $(this).closest('form'),
					url = "/cms-base/richemont/form/actionController?actionName=find_address&currentPagePath=" + resourcePath,
					zip1 = $("input[name='addressform_zip1']").val(),
					zip2 = $("input[name='addressform_zip2']").val();

				formData = {
					formid: "find_addressjapan",
					addressform_zip1: zip1,
					addressform_zip2: zip2
				}

				_postCodeAjaxCallHandlerForFindAddress(url, formData, _findAddressCallback);

			}



		},
		/*
          @private  method   : Ajax call handler
          @param : url      : url on which ajax call hit
					formData :  form data
                    callBackFunction : call back function of ajax call
         */
		_postCodeAjaxCallHandlerForFindAddress = function(url, formData, callBackFunction) {
			var objXHR = cartier.ajaxWrapper.getXhrObj({
				type: 'POST',
				url: url,
				dataType: 'json',
				data: formData,
				contentType: 'application/x-www-form-urlencoded'
			});

			if (objXHR) {
				objXHR.done(function(data) {
					// handle failure
					if (typeof data.success !== 'undefined' && !data.success) {

						// handle redirectURL exist if the session expires
						//data.redirectURL ?  window.location.href = data.redirectURL : $form.find('.server_message').html(data.errorMessage);
					} else {


						callBackFunction(data);
					}
				});
			}
		},
		/*
         @pubic method : check zip code validation for find an address,japan my address form 
         @param :  none
        */
		applyValidationForFindAnAdress = function() {


			var zip1Input = $("input[name='addressform_zip1']"),
				zip2Input = $("input[name='addressform_zip2']"),
				isFormValid = true;

			zip1Input.closest('form').validate();
			zip1Input.rules("add", {
				required: true,
				messages: {
					required: _objPropertiesMsg.mandatory
				}
			});
			zip2Input.rules("add", {
				required: true,
				messages: {
					required: _objPropertiesMsg.mandatory
				}
			});

			isFormValid = zip1Input.valid();
			isFormValid = zip2Input.valid() && isFormValid;

			return isFormValid;


		},


		/*END*/

		/*
          @private method : Add Validation to My Address Inputs on the Basis of whether its a Us/Japan Site
          @param : inputEl object for input element where the validation needs to be added
        */
		addValidation = function(inputEl) {

			$(inputEl).closest('form').validate();
			if (cartier.countryHandler.isJP) {
				$('input[name=addressform_zip1]').rules('add', {
					required: true,
					messages: {
						required: _objPropertiesMsg.mandatory
					}
				});
				$('input[name=addressform_zip2]').rules('add', {
					required: true,
					messages: {
						required: _objPropertiesMsg.mandatory
					}
				});
				$('input[name=addressform_address9]').rules('add', {
					required: true,
					messages: {
						required: _objPropertiesMsg.mandatory
					}
				});

				$('input[name=addressform_address7]').rules('add', {
					required: true,
					messages: {
						required: _objPropertiesMsg.mandatory
					}
				});
				$('input[name=addressform_address1]').rules('add', {
					required: true,
					messages: {
						required: _objPropertiesMsg.mandatory
					}
				});

				$('input[name=fn_addrname]').rules('add', {
					required: true,
					messages: {
						required: _objPropertiesMsg.mandatory
					}
				});

				$('input[name="addressFilled"]').val('true');

			} else if (cartier.countryHandler.isUS || cartier.countryHandler.isAU) {

				$('input[name=fn_addrname]').rules('add', {
					required: true,
					messages: {
						required: _objPropertiesMsg.mandatory
					}
				});

				if ($('input[name=fn_grpaddr]:checked').val() !== 'homeaddress') {alert()




					$('input[name=fn_pobox]').rules('add', {
						required: true,
						messages: {
							required: _objPropertiesMsg.mandatory
						}
					});

					var strnum = $('input[name=fn_strnum]'),
						strname = $('input[name=fn_strname]');
					strnum.rules('remove', 'required');
					strname.rules('remove', 'required');
					strnum.removeClass('error');
					strname.removeClass('error');

					strnum.siblings('label.error').html('');
					strname.siblings('label.error').html('');
					

				} else {
					
					$('input[name=fn_strnum]').rules('add', {
						required: true,
						messages: {
							required: _objPropertiesMsg.mandatory
						}
					});
					$('input[name=fn_strname]').rules('add', {
						required: true,
						messages: {
							required: _objPropertiesMsg.mandatory
						}
					});
					var pobox = $('input[name=fn_pobox]');
					pobox.rules('remove', 'required');


					pobox.removeClass('error');
					pobox.siblings('label.error').html('');


				}


				$('input[name=fn_city]').rules('add', {
					required: true,
					messages: {
						required: _objPropertiesMsg.mandatory
					}
				});

/*				$('input[name=fn_phno]').rules('add', {
					required: true,
					messages: {
						required: _objPropertiesMsg.mandatory
					}
				});*/
				$('input[name=fn_zip]').rules('add', {
					required: true,
					messages: {
						required: _objPropertiesMsg.mandatory
					}
				});

				$('input[name=addressFilled]').val('true');
			} else {
				if ($('input[name=fn_strnum]').length) {

					$('input[name=fn_strnum]').rules('add', {
						required: true,
						messages: {
							required: _objPropertiesMsg.mandatory
						}
					});
				}
				if ($('input[name=fn_strname]').length) {

					$('input[name=fn_strname]').rules('add', {
						required: true,
						messages: {
							required: _objPropertiesMsg.mandatory
						}
					});
				}
/*				if ($('input[name=fn_addrinfo]').length) {

					$('input[name=fn_addrinfo]').rules('add', {
						required: true,
						messages: {
							required: _objPropertiesMsg.mandatory
						}
					});
				}*/

				if ($('input[name=fn_city]').length) {

					$('input[name=fn_city]').rules('add', {
						required: true,
						messages: {
							required: _objPropertiesMsg.mandatory
						}
					});
				}
				if ($('input[name=fn_zip]').length) {

					$('input[name=fn_zip]').rules('add', {
						required: true,
						messages: {
							required: _objPropertiesMsg.mandatory
						}
					});
				}

				if ($('input[name=fn_colony]').length) {

					$('input[name=fn_colony]').rules('add', {
						required: true,
						messages: {
							required: _objPropertiesMsg.mandatory
						}
					});
				}

				if ($('input[name=fn_delegation]').length) {

					$('input[name=fn_delegation]').rules('add', {
						required: true,
						messages: {
							required: _objPropertiesMsg.mandatory
						}
					});
				}

				$('input[name=addressFilled]').val('true');
			}


		},

		/*
          @private method : Remove certain Validation to My Address Inputs on the Basis of whether its a Us/Japan Site
          @param : none
        */
		removeValidation = function() {

			if (cartier.countryHandler.isJP) {
				$('input[name=addressform_zip1]').rules('remove', 'required');
				$('input[name=addressform_zip2]').rules('remove', 'required');
				$('input[name=addressform_address9]').rules('remove', 'required');
				$('input[name=addressform_address7]').rules('remove', 'required');
				$('input[name=addressform_address1]').rules('remove', 'required');
				$('input[name=fn_addrname]').rules('remove', 'required');
				$('input[name=addressFilled]').val('false');
			} else if (cartier.countryHandler.isUS || cartier.countryHandler.isAU) {
				$('input[name=fn_addrname]').rules('remove', 'required');
				$('input[name=fn_strnum]').rules('remove', 'required');
				$('input[name=fn_strname]').rules('remove', 'required');
				$('input[name=fn_pobox]').rules('remove', 'required');
				$('input[name=fn_city]').rules('remove', 'required');
				$('input[name=fn_phno]').rules('remove', 'required');
				$('input[name=fn_zip]').rules('remove', 'required');
				$('input[name=addressFilled]').val('false');
			} else {
				$('input[name=fn_addrname]').rules('remove', 'required');
				$('input[name=fn_strnum]').rules('remove', 'required');
				$('input[name=fn_addrinfo]').rules('remove', 'required');
				$('input[name=fn_strname]').rules('remove', 'required');
				$('input[name=fn_city]').rules('remove', 'required');
				$('input[name=fn_zip]').rules('remove', 'required');
				$('input[name=fn_phno]').rules('remove', 'required');
				$('input[name=addressFilled]').val('false');
			}
		},

		/*
         @private  method    : add validation  Reg. step -3
         @param   none
         
        */
		_validationFixForStep3 = function() {

			if (cartier.countryHandler.isJP) {

				if ($.trim($('input[name="addressform_zip1"]').val()) !== '' || $.trim($('input[name="addressform_zip2"]').val()) !== '' || $.trim($('input[name="addressform_address9"]').val()) !== '' || $.trim($('input[name="addressform_address7"]').val()) !== '' || $.trim($('input[name="addressform_address1"]').val()) !== '' || $.trim($('input[name="fn_addrname"]').val()) !== '') {
					addValidation(this);

				} else {
					removeValidation();
					$('input.error').removeClass('error');
					/* “ DATE  08-10-2014 |  DEFECT- CARE-4344 | BRANCH 2.0.0”  
                   			START
                    		date validation error mgs issue 
                 		*/
					$('.input-wrapper span.error').html('');
					/*END*/
				}
			}

			if (cartier.countryHandler.isUS || cartier.countryHandler.isAU) {
				if ($.trim($("input[name='fn_addrname']").val()) !== "" || $.trim($("input[name='fn_strnum']").val()) !== "" || $.trim($("input[name='fn_strname']").val()) !== "" || $.trim($("input[name='fn_pobox']").val()) !== "" || $.trim($("input[name='fn_city']").val()) !== "" || $.trim($("input[name='fn_zip']").val()) !== "" || $.trim($("input[name='fn_zip']").val()) !== "" || $.trim($("input[name='fn_phno']").val()) !== "") {
					addValidation(this);

				} else {
					removeValidation();
					$('input.error').removeClass('error');
					/* “ DATE  08-10-2014 |  DEFECT- CARE-4344 | BRANCH 2.0.0”  
                    		START
                   			 date validation error mgs issue 
                 		*/
					$('.input-wrapper span.error').html('');
					/*END*/
				}

			} else {
				if ($.trim($("input[name='fn_addrname']").val()) !== "" || $.trim($("input[name='fn_strnum']").val()) !== "" || $.trim($("input[name='fn_strname']").val()) !== "" || $.trim($("input[name='fn_addrinfo']").val()) !== "" || $.trim($("input[name='fn_city']").val()) !== "" || $.trim($("input[name='fn_zip']").val()) !== "" || $.trim($("input[name='fn_phno']").val()) !== "") {
					addValidation(this);

				} else {
					removeValidation();
					$('input.error').removeClass('error');

					$('.input-wrapper span.error').html('');

				}
			}


		},

		/* @public method : Function to Hide/show Accessories Block
           @param :  none
        */
		_showAccessoriesBlock = function() {
			if (_cache.$radioGroupAccessories && _cache.$accesoriesInputfield.prop('checked')) {
				_cache.$radioGroupAccessories.show();
				_cache.$radioGroupAccessoriesHeadingField.show();
			} else {
				/* “ DATE  29-10-2014 |  DEFECT- CARE-5525 | BRANCH 2.0.0”  
		   			START
		        	Accessories checkbox issue 
		    	*/
				_cache.$radioGroupAccessories.hide();
				_cache.$radioGroupAccessoriesHeadingField.hide();
				/* “ DATE  29-10-2014 |  DEFECT- CARE-5525 | BRANCH 2.0.0”  
		   			END
		        	Accessories checkbox issue 
		    	*/
			}
		},


		/* @public method : Function to Show/hide Address Selector
           @param :  none
        */
		_addressSelector = function(e) {
			e.preventDefault();
			var selected = $(this).val();
			$('.my-address__box').each(function() {
				if ($(this).data('select-value') == selected) {
					$(this).show();
				} else {
					$(this).hide();
				}
			});
		},

		/*
         @private  method    : on change show hide address
         @param   none
          li:nth-child(1)
        */

		_addressChangehandlerDesktop = function() {
			var selectedOptionEl = $(this).find('option:selected'),
				isDefaultAddress = selectedOptionEl.data('isdefault'),
				selectedValue = selectedOptionEl.val(),
				selectedAddressNumber = parseInt(selectedOptionEl.data('address'));
			_cache.$addressContainer.find('.default').removeClass('default');
			$(_cache.$addressContainer.find('.addressList')[selectedAddressNumber])
				.addClass('default');
			if (isDefaultAddress) {
				_cache.$addressContainer.find('.js-message').removeClass('display-none');
				$('.js-set-default').addClass('display-none');
			} else {
				$('.js-set-default').removeClass('display-none');
				_cache.$addressContainer.find('.js-message').addClass('display-none')
				$('.js-set-default').attr('data-id', selectedValue);
			}

		},

		/*
         @private  method    : disable  enable address filed acording radio button value

         @param   none  
          
        */
		_disableAddressFiled = function() {
           

			var $this = $("#homeaddress"),
				addressContainer = $('.js-address-form'),
				streetNumber = addressContainer.find('input[name = addressform_address2]'),
				streetName = addressContainer.find('input[name = addressform_address5]'),
				streetDetail = addressContainer.find('input[name = addressform_address6]'),
				poBox = addressContainer.find('input[name = addressform_address12]');
               

			if (cartier.countryHandler.isUS || cartier.countryHandler.isAU) {
				if ($this.val() === 'homeaddress') {
					streetNumber.prop('disabled', false);
					streetName.prop('disabled', false);
					streetDetail.prop('disabled', false);
					poBox.prop('disabled', true);

				} else {
					streetNumber.prop('disabled', true);
					streetName.prop('disabled', true);
					streetDetail.prop('disabled', true);
					poBox.prop('disabled', false);

				}
			} else {
				streetNumber.prop('disabled', false);
				streetName.prop('disabled', false);
				streetDetail.prop('disabled', false);
				poBox.prop('disabled', false);
			}
		},

		/*
         @private  method    : on country drop down change show hide specific form filed 

         @param   none
          
        */
		_showHideFromFiledForUk = function() {
			var $this = $(this),
				countryValue, formContiner;
			if (typeof $(this).closest('form')[0] !== 'undefined')
				formContiner = $(this).closest('form');
			else
				formContiner = $('.addressform_country').closest('form');

			var inputFieldArrayOthers = [],
				inputFieldArrayUk = [],
				inputFieldArrayUkToHide = [],
				serachAddressEl = formContiner.find('.findaddress'),
				reset = formContiner.find('.reset'),
				phoneNo = formContiner.find('.addressform_phone');
			if (!$.isWindow(this)) {
				if (_cache.$addressCountryNameVal && !($(this).val())) {
					countryValue = _cache.$addressCountryNameVal;
				} else
					countryValue = $(this).val();
			} else {
				if (_cache.$addressCountryNameVal.length) {
					countryValue = _cache.$addressCountryNameVal;
				}

			}



			// hide input filed 
			inputFieldArrayOthers.push(formContiner.find('.addressform_address2')[1]);
			inputFieldArrayOthers.push(formContiner.find('.addressform_address5')[1]);
			inputFieldArrayOthers.push(formContiner.find('.addressform_address6'));
			inputFieldArrayOthers.push(formContiner.find('.addressform_address4')[1]);
			inputFieldArrayOthers.push(formContiner.find('.addressform_address7')[1]);
			inputFieldArrayOthers.push(formContiner.find('.addressform_address9')[1]);
			inputFieldArrayOthers.push(formContiner.find('.addressform_zip')[1]);
			inputFieldArrayOthers.push(formContiner.find('.addressform_phone')[1]);

			inputFieldArrayUk.push(formContiner.find('.addressform_zip')[0]);
			inputFieldArrayUk.push(formContiner.find('.addressform_address5')[0]);
			inputFieldArrayUk.push(formContiner.find('.addressform_address2')[0]);
			inputFieldArrayUk.push(formContiner.find('.addressform_address4')[0]);
			inputFieldArrayUk.push(formContiner.find('.addressform_address7')[0]);
			inputFieldArrayUk.push(formContiner.find('.addressform_address9')[0]);
			inputFieldArrayUk.push(formContiner.find('.addressform_phone')[0]);

			inputFieldArrayUkToHide.push(formContiner.find('.addressform_address5')[0]);
			inputFieldArrayUkToHide.push(formContiner.find('.addressform_address2')[0]);
			inputFieldArrayUkToHide.push(formContiner.find('.addressform_address4')[0]);
			inputFieldArrayUkToHide.push(formContiner.find('.addressform_address7')[0]);
			inputFieldArrayUkToHide.push(formContiner.find('.addressform_address9')[0]);



			if (countryValue === _objPropertiesMsg.gb) {
				$(inputFieldArrayOthers).each(function() {
					$(this).addClass('display-none');
					$(this).find('input').addClass('display-none');
				});

				$(inputFieldArrayUk).each(function() {
					$(this).removeClass('display-none');
					$(this).find('input').removeClass('display-none');
				});
				$(inputFieldArrayUkToHide).each(function() {
					$(this).addClass('display-none');
					$(this).find('input').addClass('display-none');
				});
				serachAddressEl.removeClass('display-none');
				reset.addClass('display-none');


			} else {
				$(inputFieldArrayUk).each(function() {
					$(this).addClass('display-none');
					$(this).find('input').addClass('display-none');
				});

				$(inputFieldArrayOthers).each(function() {
					$(this).removeClass('display-none');
					$(this).find('input').removeClass('display-none');
				});
				$(inputFieldArrayUkToHide).each(function() {
					$(this).addClass('display-none');
					$(this).find('input').addClass('display-none');
				});
				serachAddressEl.addClass('display-none');
				reset.addClass('display-none');

			}

		},


		/* @public method : Function to Handle Find Address Callbacks according to the Site UK/JP
           @param :  none
        */
		_findAddressCallback = function(data) {

			/* “ DATE  07-11-2014|  DEFECT- CARE -4766 | BRANCH 2.0.0”  
    			START if condition added 
        
    		*/
			if (typeof data === "object") {
				if (data.content.country == "GB") {
					_findAddressCallbackUk(data);
				} else {
					if (data.content.country == "JP") {
						_findAddressCallbackJP(data);
					}
				}
			}
			/*END*/


		},
		/* @public method :Find Address Callback for JP
           @param :  callback response
        */
		_findAddressCallbackJP = function(data) {

			$('.error-div').remove();

			if (data.content.isSubmitSuccess === false) {
				var errorMsg = '<div class="error-div">' + CQ.I18n.getMessage(data.content.errorMessage) + '</div>';
				$('.js-address-form-jp,.js-jp-reg-step-3,.js-reg-step-3,.js-address-form').before(errorMsg);
				$('.error-div').ScrollTo({
					duration: 800,
					offsetTop: 140
				});
				// reset specific input filed
				$('.js-reset').find('input').val('');

			} else {
				$('.error-div').remove();
				// set json  value in input filed 
				$('#addressform_state').val(data.content.prefecturecode).trigger('blur');
				$('.addressform_address9').find('input').val(data.content.state).trigger('blur');
				$('.addressform_address1').find('input').val(data.content.town).trigger('blur');
				$('.addressform_address7').find('input').val(data.content.region).trigger('blur');

			}
		},


		/* @public method :Find Address Callback for UK
           @param :  callback response
        */
		_findAddressCallbackUk = function(data) {


			var inputFieldArrayUkToShow = [],
				formContiner = $('.addressform_country').closest('form');

			inputFieldArrayUkToShow.push(formContiner.find('.addressform_address5')[0]);
			inputFieldArrayUkToShow.push(formContiner.find('.addressform_address2')[0]);
			inputFieldArrayUkToShow.push(formContiner.find('.addressform_address4')[0]);
			inputFieldArrayUkToShow.push(formContiner.find('.addressform_address7')[0]);
			inputFieldArrayUkToShow.push(formContiner.find('.addressform_address9')[0]);
			inputFieldArrayUkToShow.push(formContiner.find('.reset'));



			var cityField = formContiner.find('.addressform_address7'),
				streetNameField = formContiner.find('.addressform_address5'),
				streetNumberField = formContiner.find('.addressform_address2'),
				streetNameOptionArray = [],
				streetNumberOptionArray = [],
				constantCity,
				streetNameOptionValue;

			$(inputFieldArrayUkToShow).each(function() {
				$(this).removeClass('display-none');
				$(this).find('input').removeClass('display-none');
			});


			$.each(data.content.AddressData, function(key, value) {
				streetNameOptionArray[key] = value.street;
				constantCity = value.city;


			});

			var a = [],
				l = streetNameOptionArray.length;
			for (var i = 0; i < l; i++) {
				for (var j = i + 1; j < l; j++)
					if (streetNameOptionArray[i] === streetNameOptionArray[j]) j = ++i;
				a.push(streetNameOptionArray[i]);
			}

			streetNameOptionValue = a;

			for (var k = 0; k < streetNameOptionValue.length; k++) {

				streetNameOptionArray[k] = new Option(streetNameOptionValue[0], streetNameOptionValue[0]);
			}



			streetNameField.find('select').empty();
			for (l = 0; l < streetNameOptionArray.length; l++) {

				streetNameField.find('select').append(streetNameOptionArray[l]);
			}


			streetNameField.find('span').html(streetNameOptionValue[0]);



			$.each(data.content.AddressData, function(key, value) {

				streetNumberOptionArray[key] = new Option(value.streetNumber, value.streetNumber);
				if (key === 0)
					streetNumberField.find('span').html(value.streetNumber);

			});
			streetNumberField.find('select').empty();
			streetNumberField.find('select').append(streetNumberOptionArray);



			cityField.find('input').val(constantCity);



		},

		/* @public method :My Address Function for Reset 
           @param :  event object 
        */
		_findAddressReset = function(e) {
			e.preventDefault();
			var inputFieldArrayUkToShow = [],
				formContiner = $('.addressform_country').closest('form');

			inputFieldArrayUkToShow.push(formContiner.find('.addressform_address5')[0]);
			inputFieldArrayUkToShow.push(formContiner.find('.addressform_address2')[0]);
			inputFieldArrayUkToShow.push(formContiner.find('.addressform_address4')[0]);
			inputFieldArrayUkToShow.push(formContiner.find('.addressform_address7')[0]);
			inputFieldArrayUkToShow.push(formContiner.find('.addressform_address9')[0]);

			$(inputFieldArrayUkToShow).each(function() {
				$(this).addClass('display-none');
				$(this).find('input').addClass('display-none');

				if ($(this).find('select'))
					$(this).find('select').empty();
				else
				if ($(this).find('input'))
					$(this).find('input').val('');
			});

		},

		/* @public method :Function to add Select box with Addresses 
           @param :  none  
        */
		_setSelectAddressVal = function() {

			_cache.$ukMyaddressCountryDropDown.find('option[value="' + _cache.$addressCountryNameVal + '"]').attr('selected', 'selected');
			$('.addressform_country').find('.selector > span')
				.html(_cache.$ukMyaddressCountryDropDown.find('option[value="' + _cache.$addressCountryNameVal + '"]').html());


		},

		/*
	       @private method : to send Post Ajax request for on Submit of Address form
	       @param : Form object, URL Link and a callback function 
	    */
		_ajaxCallHandlerFormSubmit = function(e) {
			e.preventDefault();
			var $form = $(this).closest('form');
			var objXHR = cartier.ajaxWrapper.getXhrObj({
				type: 'POST',
				url: e.data.path,
				data: $form.serialize(),
				dataType: 'json',
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
					if (typeof data.success !== 'undefined' && !data.success) {

					} else { // handle success
						var parsedData = cartier.common.cartierJSONparser({
							json: data
						});
						if (parsedData !== false) {
							_submitAddressCallback(parsedData, $form);
						}
					}
				});
			}
			return false;
		},


		/*
	       @private method : Callback for Address Form Submit
	       @param : response data 'data' and form object
	    */
		_submitAddressCallback = function(data, $form) {
			if (data.isSubmitSuccess)
				location.replace(data.redirecturl);
			else {
				$('.error-div').remove();
				$form.prepend('<div class="error-div">' + CQ.I18n.getMessage(data.errorMessage) + '</div>');
				$('.error-div').ScrollTo({
					duration: 800,
					offsetTop: 200
				});
			}
		},

		/* @public method : Function to handle Change Password
           @param :  none  
        */
		_changePasswordHandler = function() {
			_cache.$passwordInput.parent().hide();

			_cache.$changePasswordField.bind('change paste keyup', function() {
				_cache.$passwordInput.parent().show();
				if (_cache.$changePasswordField.val() === '') {

					_cache.$passwordInput.parent().hide();
				}
			});
		},

		/*
         @private  method    : handle radio button change
         @param             none
          
	    */

		_handlerRadioChange = function() {

			_cache.checkbox.find('.js-owncreation-container').addClass('display-none');
			$('.js-added-creation').remove();
			$('.creation-link').remove();
			$('.owned-creations-label').remove();
		},

		/*
         @private  method    : add own creation drop dwon
         @param             dataJSON :- drop down data list
          
        */
		_addDropDownOne = function(dataJSON) {

			//TO DecodeURI on dataJSON
			$.each(dataJSON, function(key, value) {
				$.each(value, function(key, value) {
					this.display = decodeURIComponent(this.display);
				});
			});

			_resetDropDownTwo();
			$('.js-own-dropone .select-wrapper select option:first-child').hide();

			$('.js-own-dropone .select-wrapper select option').removeAttr('selected');
			$('.js-own-dropone select').removeClass('display-none').on('change', function(data) {
				if ($(this).find('option:selected').val() === 'default')
					_resetDropDownTwo();
				else {
					_addDropDownTwo();
					var dataSelected = $(this),
						selectBox = dataSelected.find('option:selected').val();



					cartier.log(dataJSON[selectBox]);
					cartier.log(dataJSON);
					_fillOptionFields(dataJSON[selectBox]);
				}
			});
		},

		/*
         @private  method    : add own creation  2nd drop dwon
         @param             none
          
        */
		_addDropDownTwo = function() {
			_resetDropDownThree();
			$('.js-own-droptwo .select-wrapper select option:first-child').hide();
			$('.js-own-droptwo .select-wrapper select option').removeAttr('selected');
			$('.js-own-droptwo').removeClass('display-none').on('change', function() {

				$(this).find('.selector span').html($(this).find('option:selected').html());

				if ($(this).find('option:selected').val() === 'default')
					_resetDropDownThree();
				else
					_addDropDownThree();
			});
		},

		/*
         @private  method    : add own creation  3rd drop dwon
         @param             none

        */
		_addDropDownThree = function() {
			_resetDropDownLast();
			$('.js-own-dropthree .select-wrapper select option:first-child').hide();
			$('.js-own-dropthree .select-wrapper select option').removeAttr('selected');
			$('.js-own-dropthree').removeClass('display-none').on('change', function() {
				if ($(this).find('option:selected').val() === 'default') {
					_resetDropDownLast();

				} else
					_addCreateProductLink();
			});
		},

		/*
         @private  method    : reset own creation drop down
         @param             none
          
        */
		_resetDropDownLast = function() {
			$('.creation-link').remove();
			$('.js-own-dropthree select').val('default');
		},
		/*
         @private  method    : add options  in drop down select box
         @param             data- option data
          
	    */
		_fillOptionFields = function(data) {
			if (typeof data !== 'undefined') {
				var dataLength = data.length,
					clonedOption = $('.js-own-droptwo select').empty().clone(true, true);
				clonedOption.append('<option value="default">-Select-</option>');

				for (var i = 0; i < dataLength; i++) {
					clonedOption.append('<option value="' + data[i].value + '">' + data[i].display + '</option>');
				}
				$('.js-own-droptwo select').replaceWith(clonedOption);
			}

			if (typeof($('.js-own-droptwo select').attr('name')) === 'undefined') {
				$('.js-own-droptwo select').attr('name', 'piform_productCategory');
			}
		},

		/*
         @private  method    : reset own creation 2nd drop down
         @param             none
          
        */
		_resetDropDownTwo = function() {
			$('.js-own-dropone select').val('default');
			$('.js-own-droptwo').addClass('display-none');
			$('.js-own-dropthree').addClass('display-none');
			$('.creation-link').remove();
		},

		/*
         @private  method    : reset own creation 3rd drop down
         @param             none
          
        */
		_resetDropDownThree = function() {
			$('.js-own-droptwo select').val('default');
			$('.js-own-dropthree').addClass('display-none');
			$('.creation-link').remove();
		},


		/*
		 *  @private  method   :add selected own creation dom
		 *  @param          none
		 *
		 */
		_addCreateProductLink = function() {
			$('.creation-link').remove();
			var selected = $('.js-own-droptwo select option:selected').html(), //$(this).val(),
				html;
			html = '<a class="more-button creation-link">';
			html += '<span class="arrow-show"></span>';
			html += _objPropertiesMsg.addThisCreation;
			html += '</a>';

			_cache.$doyouownBox.append(html);
			var dropDownOne = $('.js-own-dropone select'),
				dropDownTow = $('.js-own-droptwo select'),
				dropDownThree = $('.js-own-dropthree select');
			_cache.$doyouownBox.find('.creation-link').on('click', {
				creationName: selected,
				var1: dropDownOne.find('option:selected').val(),
				var2: dropDownTow.find('option:selected').val(),
				var3: dropDownThree.find('option:selected').val()
			}, _handlerAddCreation);

		},

		/*
          @private  method   : Bind Delete Event handler on delete button
          @param : none
	    */
		_bindDeleteHandler = function() {
			$('.delete-icon').on('click', function() {
				$(this).closest('.added-creation').remove();
				_labelCheckerOwnedCreations();
			});
		},
		/*
         @private  method    : add selected cration
         @param             : selected creation name
          
        */
		_handlerAddCreation = function(parameter) {

			var html;
			html = " <div class='added-creation js-added-creation' > <div class='added-creation__name'> " + parameter.data.creationName +
				"</div> <span class = 'delete-icon'> <input type='hidden' name='fn_doyouownproducts' value='" + parameter.data.var1 + "," + parameter.data.var2 + "," + parameter.data.var3 + " '></span>" +
				"</div>";
			_cache.$doyouownBox
				.find('.creation-link')
				.remove();
			_cache.checkbox.append(html);
			$('.js-own-dropone .selector span').html($('.js-own-dropone select option:first-child').html());
			_resetDropDownTwo();
			_bindDeleteHandler();
			_labelCheckerOwnedCreations();
		},


		/*
          @private  method   : Bind Event on Edit and delete button
          @param : none
	    */
		_buttonHandler = function() {
			var popUpBoxText = {
				'title': '',
				'messages ': '',
				'buttons': {
					'Yes': {
						'class': 'cta-button cta-button__inner cta--red',
						'action': function() {
							e.data.clickedElement = clickedButton;
							e.data.callBackFunction(e);
						}
					},
					'No': {
						'class': 'cta-button cta-button__inner cta--grey',
						'action': function() {

						} // Nothing to do in this case. You can as well omit the action property.
					}
				}
			};


		},

		/*
          @private  method   : show to pop-up box 
          @param : e :- event 
    */
		_showPopUpBoxHandler = function(e) {
			var clickedButton = $(this);


			_cache.$addressLookupDelete.confirmBox();
			_cache.$addressLookupDelete.data('plugin_confirmBox').popupInitialize({
					'title': _objPropertiesMsg.myAddressTitle,
					'message': _objPropertiesMsg.myAddressMessage,
					'buttons': {
						'yes': {
							'buttonName': _objPropertiesMsg.myAddressYesButton,
							'class': 'cta-button cta-button__inner cta--red',
							'action': function() {
								e.data.clickedElement = clickedButton;
								e.data.callBackFunction(e);
							}
						},
						'No': {

							'buttonName': _objPropertiesMsg.myAddressNoButton,
							'class': 'cta-button cta-button__inner cta--grey',
							'action': function() {

							} // Nothing to do in this case. You can as well omit the action property.
						}
					}
				},
				_cache.$addressLookupDelete.data('plugin_confirmBox').confirmHide

			);


		},
		/*
          @private  method   : Ajax call handler
          @param : url      : url on which ajax call hit
                    callBackFunction : call back function of ajax call
    */
		_ajaxCallHandler = function(url, callBackFunction) {
			var objXHR = cartier.ajaxWrapper.getXhrObj({
				type: 'GET',
				url: url,
				dataType: 'json',
				data: 'lang=' + $('.js-owncreation-container').attr('data-lang')
			});

			if (objXHR) {
				objXHR.done(function(data) {
					// handle failure
					if (typeof data.success !== 'undefined' && !data.success) {

						// handle redirectURL exist if the session expires
						//data.redirectURL ?  window.location.href = data.redirectURL : $form.find('.server_message').html(data.errorMessage);
					} else {
						var data = cartier.common.cartierJSONparser({
							json: data
						});

						callBackFunction(data);
					}
				});
			}
		},

		/*
          @private  method   : send index of adress on which edit or delete action performed 
          @param : e :- event 
    */
		_addressChangehandler = function(e) {

			var clickedButton;
			if (typeof e.data.clickedElement !== undefined) {
				clickedButton = e.data.clickedElement;
			} else {
				clickedButton = $(this);
			}

			e.preventDefault();
			var indexValue = clickedButton.data('id');

		},


		_labelCheckerOwnedCreations = function() {
			$('.owned-creations-label').remove();
			$('.added-creation:eq(0)').before('<label for="fn_grpdoyouown" class="form-label owned-creations-label">' + _objPropertiesMsg.yourOwnedCreations + '</label>');
		},
		/*
          @private  method   :  Show password
          @param :none
        */
		_showNewPassField = function() {
			$('.forgot-pass input').bind('change paste keyup', function() {
				$('.newpass').show();
				if ($('.forgot-pass input').val() === '') {
					$('.newpass').hide();
				}
			});
		},

		_radioButtonSelector = function() {

			if ($('.added-creation').length > 0)
				setTimeout(function() {
					$('#fn_grpdoyouownyes').trigger('click');
				}, 10);
			else
				setTimeout(function() {
					$('#fn_grpdoyouownno').trigger('click');
				}, 10);
		},


		_radioButtonAddressHandler = function() {
			var radioval = $('.js-radio-tabs').attr('data-addrtab');
			setTimeout(function() {
				$('input[value="' + radioval + '"]').trigger('click').closest('.radio-btn-li').trigger('click');
			}, 10);
		},

		_tabHiddenCounter = function() {
			$('.js-radio-tabs').on('click', function() {
				if ($('#homeaddress').is(':visible'))
					$('.tab-hidden-counter').val('true');
				else
					$('.tab-hidden-counter').val('false');
			});
		},


		/* @pubic method : do you own cration ajax call back function {after click on yes button}
           @param :  data :- ajax call responce in json formate
        */
		_OwnCreationCallBack = function(data) {

			_addDropDownOne(data.content);
			$('.js-owncreation-container').removeClass('display-none');
			$('#yes1').removeAttr('disabled');

		},

		/*
         @pubic method : fill country drop down and boutique list
           @param :  data : boutiques info 
        */
		_fillCountryDropDown = function(data) {

			var countryList = {},
				$boutiqueCountrySelectBoxEL = $('.appointment_boutique_country select'),
				$userCountry = $('.appointment_country_select select'),
				boutiqueCountrySelectBoxHtmlMarkUp = "<option value='default'> select </option>";

			$.each(data, function(index, val) {

				var continent = data[index].continent,
					countryListInContinent = $.extend([], countryList[continent]);
				countryListInContinent.push(index);
				countryList[continent] = countryListInContinent;
			});



			//create markup for country dropdown
			$.each(countryList, function(key, value) {

				boutiqueCountrySelectBoxHtmlMarkUp += '<optgroup label=' + key + '>';
				$.each(value, function(key, value) {
					boutiqueCountrySelectBoxHtmlMarkUp += "<option value='" + value + "''>" + CQ.I18n.getMessage("country." + value) + "</option>";
				})
				boutiqueCountrySelectBoxHtmlMarkUp += '</optgroup>';

			})

			$boutiqueCountrySelectBoxEL.empty();
			$boutiqueCountrySelectBoxEL.append(boutiqueCountrySelectBoxHtmlMarkUp);

			// set country in boutique country selecter acording 1st country selector
			if (typeof data[$userCountry.val()] !== 'undefined') {

				$boutiqueCountrySelectBoxEL.val($userCountry.val());

			};

			$boutiqueCountrySelectBoxEL.on('change', {
				'boutiqueJson': data
			}, _fillBoutiqueList);

			$userCountry.on('change', function() {
				var slectedCountry = $(this).val();
				$boutiqueCountrySelectBoxEL.val(slectedCountry);
				if (typeof $boutiqueCountrySelectBoxEL.val() === 'undefined') {
					$boutiqueCountrySelectBoxEL.val('default');
				}
				$boutiqueCountrySelectBoxEL.trigger('change')
				$.uniform.update();
			});



			$.uniform.update();
		},

		/*
        	@private method : fill boutique list dropdown  acording selected country
        	@param :  event : default event parameter
        */
		_fillBoutiqueList = function(event) {

			var $boutiqueListdropDownEL = $('.appointment_boutique_location select'),
				selectedCountry = $(this).find(':selected').val(),
				boutiqueListHtmlMarkup = {},
				boutiqueListHtmlMarkup = ["<option value='default'> select </option>"],
				boutiqueListJson = {},
				$hiddenEmailField = $('#appointment_boutique_email');

			// boutique list of selected country
			if (typeof event.data.boutiqueJson[selectedCountry] !== 'undefined') {
				boutiqueListJson = event.data.boutiqueJson[selectedCountry]['boutiques'];
			}



			$.each(boutiqueListJson, function(key, value) {

				boutiqueListHtmlMarkup[key] = "<option value='" + value.id + "' data-email='" + value.email + "'>" + value.name + "</option>";

			});

			$boutiqueListdropDownEL.empty();
			$boutiqueListdropDownEL.append(boutiqueListHtmlMarkup);
			$.uniform.update();

			$boutiqueListdropDownEL.on('change', function() {
				if (typeof $hiddenEmailField !== 'undefined') {
					var selecteBoutiqueEmail = $(this).find(':selected').data('email');
					$hiddenEmailField.val(selecteBoutiqueEmail);
				}
			});

		},

		/*
        	@private method : Ask for Appointment Display handler
        	@param :  none
        */
		_askAppointmentDisplayHandler = function() {
			$('.appointment_contacttype input[value=email]').attr('checked', true);
			$('.appointment_contacttype input[value=email]').parent('span').addClass('checked');

		},

		/*
        	@private method : Contact Preference Displayer handler
        	@param : 
        */
		_contactPreferenceDisplayHandler = function() {
			if ($(this).val() == 'phone') {
				$('.appointment_email').hide();
				$('.appointment_phone').show();

			} else {
				if ($(this).val() == 'email') {
					$('.appointment_phone').hide();
					$('.appointment_email').show();

				}
			}

		},

		/* @public method : Callback Function for My Address
           @param :  none
        */
		_myAddressCallback = function(data) {
			if (typeof data === 'object') {
				var parsedData = data.content;
				if (!parsedData.isSubmitSuccess) // Error Case
				{
					if (typeof parsedData.bobjAddressList !== 'undefined') {
						_bobjAddressSuggestion(parsedData.bobjAddressList);
					} else {
						$('.error-div').remove();
						$('.js-address-form-jp,.js-address-form').prepend('<div class="error-div">' + CQ.I18n.getMessage(parsedData.errorMessage) + '</div>');
						$('.error-div').ScrollTo({
							duration: 800,
							offsetTop: 140
						});
						_errorMessageHighlighter(parsedData.errorMessage);
					}
				} else {
					if (location.href.match(/issuccess/) === null) {
						var queryParam = '';
						if (location.href.match(/\?/) === null)
							queryParam = '?issuccess=true&origin=myAddressesSave1';
						else
							queryParam = '&issuccess=true&origin=myAddressesSave1';
						window.location.replace(location.href + queryParam);
					} else {
						window.location.replace(location.href);
					}
				}
			}
		},



		_errorMessageHighlighter = function(messages) {


			if (messages === "address.errorMessage.11.phone.mobile"){
				$('#addressform_phone').addClass('error');
				$('#addressform_mobile').addClass('error');
			}
			
			if (messages === "address.errorMessage.11") {
				$('#addressform_phone').addClass('error');
			}
			if (messages === "address.errorMessage.12") {
				$('#addressform_phone').addClass('error');
			}
			if (messages === "address.errorMessage.18") {
				$('#addressform_zip').addClass('error');
			}
			if (messages === "address.errorMessage.11.mobile") {
				$('#addressform_mobile').addClass('error');
			}
		},

		/* 
			@public method : BobJ Suggestion handler for MyAddress
        	@param :  none
        */
		_bobjAddressSuggestion = function(data) {
			_bobjaddressList = data;
			$('.bobj-radio-input').on('click', function() {
				$('.bobj-radio-input').closest('span').removeClass('checked');
				$(this).closest('span').addClass('checked');
			});
			var addressBox = $('.js-bobj-address-li:first').clone(true, true);
			$('.js-bobj-address-li').remove();
			var addressList = $('.js-bobj-address').clone(true, true);
			for (var i = 0; i < data.length; i++) {
				addressList.append(_bobjAddressFiller(addressBox.clone(true, true), data[i], i));
			}
			$('.js-bobj-address').replaceWith(addressList);
			setTimeout(function() {
				$('.js-bobj-address').find('.js-bobj-address-li:first input').trigger('click');
			}, 10);
			if (data.length === 1) {
				addressList.find('.radio-bobj').addClass('visibility-none');
			} else {
				addressList.find('.radio-bobj').removeClass('visibility-none');
			}
			$('.js-bobj-section-one,.js-address-form,.error_message_js-address-form').addClass('display-none');
			$('.js-bobj-section-two').removeClass('display-none').ScrollTo({
				duration: 800,
				offsetTop: 200
			});
		},

		/*
	       @private method : Address Filler for Bobj Suggestion in My Address
	       @param : addressli for Address box markup, response data 'data' and index
	    */
		_bobjAddressFiller = function(addressli, data, i) {

			var localpoboxNumber = "";

			if (data.poboxNumber !== undefined && data.poboxNumber !== "")
				localpoboxNumber = _objPropertiesMsg.pobox + " " + data.poboxNumber;



			var regex = /[<\>\&\/\\]/gi;
			if (typeof $('#addressform_firstName1').val() !== "undefined")
				$('#addressform_firstName1').val($('#addressform_firstName1').val().replace(regex, ""));

			if (typeof $('#addressform_lastName1').val() !== "undefined")
				$('#addressform_lastName1').val($('#addressform_lastName1').val().replace(regex, ""));

			if (typeof $('input[name="addressform_phone"]').val() !== "undefined")
				$('input[name="addressform_phone"]').val($('input[name="addressform_phone"]').val().replace(regex, ""));


			addressli
				.find('input').val(i).attr('id', 'id' + i).end()
				.find('.js-add-fname').text($('#addressform_firstName1').val()).end()
				.find('.js-add-lname').text($('#addressform_lastName1').val()).end()
				.find('.js-add-snum').html(data.streetNumber).end()
				.find('.js-add-sname').html(data.streetName).end()
				.find('.js-add-pobox').html(localpoboxNumber).end()
				.find('.js-add-city').html(data.city).end()
				.find('.js-add-state').html(data.state).end()
				.find('.js-add-info').html(data.additionalInfo).end()
				.find('.js-add-zip').html(data.zip);

			if ($('input[name="addressform_phone"]').val() !== undefined)
				addressli.find('.js-add-phno').text($('input[name="addressform_phone"]').val());


			return addressli;
		},

		/*
	       @private method : Save button handler for Bobj in My Address
	       @param : none
	    */
		_saveButtonBobjHandler = function() {
			var addressObj = _bobjaddressList[$('.bobj-radio-input:checked').val()];
			$('input[name="bobjValid"]').val('true');

			$('.js-address-form')
				.find('#addressform_address2').val(addressObj.streetNumber).end()
				.find('#addressform_address5').val(addressObj.streetName).end()
				.find('#addressform_address12').val(addressObj.poboxNumber).end()
				.find('#addressform_address7').val(addressObj.city).end()
				.find('#addressform_address9').val(addressObj.state).end()
				.find('#addressform_address6').val(addressObj.additionalInfo).end()
				.find('#addressform_zip').val(addressObj.zip).end();
			$('#js-address-form').submit();

			$('.js-jp-reg-step-3,.js-reg-step-3')
				.find('#fn_strnum').val(addressObj.streetNumber).end()
				.find('#fn_strname').val(addressObj.streetName).end()
				.find('#fn_pobox').val(addressObj.poboxNumber).end()
				.find('#fn_city').val(addressObj.city).end()
				.find('#fn_state').val(addressObj.state).end()
				.find('#fn_addrinfo').val(addressObj.additionalInfo).end()
				.find('#fn_zip').val(addressObj.zip).end();
			$('#js-jp-reg-step-3,#js-reg-step-3').submit();

		},

		/*
	       @private method : Callback Function for Reg Step 3
	       @param : none
	    */

		_regStep3Callback = function(data) {
			if (typeof data === 'object') {
				var parsedData = data.content;
				if (!parsedData.isSubmitSuccess) // Error Case
				{
					if (typeof parsedData.bobjAddressList !== 'undefined') {
						_bobjAddressSuggestionRegStep3(parsedData.bobjAddressList);
					} else {
						$('.error-div').remove();
						$('#js-jp-reg-step-3,#js-reg-step-3').prepend('<div class="error-div">' + CQ.I18n.getMessage(parsedData.errorMessage) + '</div>');
						$('.error-div').ScrollTo({
							duration: 800,
							offsetTop: 140
						});
					}
				} else {

					var url = $('input[name=":redirect"]').val();
					window.location.replace(url);
				}
			}
		},

		/*
	       @private method : BobJ Address Suggestion handler for Reg Step 3
	       @param : none
	    */

		_bobjAddressSuggestionRegStep3 = function(data) {
			_bobjaddressList = data;
			$('.bobj-radio-input').on('click', function() {
				$('.bobj-radio-input').closest('span').removeClass('checked');
				$(this).closest('span').addClass('checked');
			});
			var addressBox = $('.js-bobj-address-li:first').clone(true, true);
			$('.js-bobj-address-li').remove();
			var addressList = $('.js-bobj-address').clone(true, true);
			for (var i = 0; i < data.length; i++) {
				addressList.append(_bobjAddressFillerRegStep3(addressBox.clone(true, true), data[i], i));
			}
			$('.js-bobj-address').replaceWith(addressList);
			setTimeout(function() {
				$('.js-bobj-address').find('.js-bobj-address-li:first input').trigger('click');
			}, 10);
			if (data.length === 1) {
				addressList.find('.radio-bobj').addClass('visibility-none');
			} else {
				addressList.find('.radio-bobj').removeClass('visibility-none');
			}
			$('.js-bobj-section-one,.js-jp-reg-step-3,.js-reg-step-3,.error_message_js-jp-reg-step-3').addClass('display-none');
			$('.js-bobj-section-two').removeClass('display-none').ScrollTo({
				duration: 800,
				offsetTop: 200
			});
		},

		/*
	       @private method : BobJ Address Suggestion Filler for _bobjAddressSuggestionRegStep3 for Reg Step 3
	       @param : addressli for Address box markup, response data 'data' and index
	    */
		_bobjAddressFillerRegStep3 = function(addressli, data, i) {

			var localpoboxNumber = "";

			if (data.poboxNumber !== undefined && data.poboxNumber !== "")
				localpoboxNumber = _objPropertiesMsg.pobox + " " + data.poboxNumber;

			var regex = /[<\>\&\/\\]/gi;

			if (typeof $('input[name="fn_phno"]').val() !== "undefined")
				$('input[name="fn_phno"]').val($('input[name="fn_phno"]').val().replace(regex, ""));


			addressli
				.find('input').val(i).attr('id', 'id' + i).end()
				.find('.js-add-snum').html(data.streetNumber).end()
				.find('.js-add-sname').html(data.streetName).end()
				.find('.js-add-pobox').html(localpoboxNumber).end()
				.find('.js-add-city').html(data.city).end()
				.find('.js-add-state').html(data.state).end()
				.find('.js-add-info').html(data.additionalInfo).end()
				.find('.js-add-zip').html(data.zip);


			if ($('input[name="fn_phno"]').val() !== undefined)
				addressli.find('.js-add-phno').text($('input[name="fn_phno"]').val());


			return addressli;
		},
		/*
         	@pubic method : onload ajax call for boutique list
           @param :  none
        */
		_getBoutiqueListOnLoad = function(url, currentPagePath) {

			var objXHR = cartier.ajaxWrapper.getXhrObj({
				type: 'POST',
				// data: 'action=getwishlists&wishlist_pagepath=' + $('.js-wishlist_pagepath').val() + '',
				//url: _objPropertiesPth.saveWishlist,

				url: url + currentPagePath,
				dataType: 'json',
				contentType: 'application/x-www-form-urlencoded'
			});


			if (objXHR) {
				objXHR.done(function(data) {
					// handle failure
					if (typeof data.success !== 'undefined' && !data.success) {
						// handle redirectURL exist if the session expires
						// data.redirectURL ?  window.location.href = data.redirectURL : $form.find('.server_message').html(data.errorMessage);
					} else {


						var parsedData = cartier.common.cartierJSONparser({
							json: data
						});

						if (parsedData !== false) {
							_fillCountryDropDown(parsedData);
						}
					}
				});
			}

		},

		//--------------------------------------------------------------------------------------------------------
		//          Initialize Plugins
		//--------------------------------------------------------------------------------------------------------

		/*
         @private  method    : Initialize date picker
         @param   none
          
        */
		_initializeDatePicker = function() {
			_cache.datePicker.date_picker({
				validationRequired: true
			});
		},

		/*
         @private  method    : Initialize acordian
         @param       none
          
        */
		_initializeAccordion = function() {
			_cache.accordionObject.makeAccordion({
				showBehaviour: false
			});
		},

		/*
         @private  method    : initialize own creation
         @param none

        */
		_intializeOwnCreation = function() {

			_cache.checkbox.find('#No , #no').on('click', _handlerRadioChange);
		},

		/*
          @private  method   :  initialize  radio tab 
          @param :none
        */
		_initializeRadioTabs = function() {

			_cache.$radioTab.radio_tabs();
			_tabHiddenCounter();
		},

		//--------------------------------------------------------------------------------------------------------
		//         Other Business Logic Functions
		//--------------------------------------------------------------------------------------------------------

		/*
          @private method : show load time  Accessories list if check is checked
          @param : none 
        */
		_showAccessoriesList = function() {
			if (_cache.$accesoriesCheckBox.prop('checked')) {
				cartier.common.showHideList(_cache.$accesoriesCheckBox, _cache.$accesoriesList);
			}
		},

		/*
         @private  method    : show hide accesories list 
         @param   none
          
        */
		_dispalyAccessoriesList = function() {
			var checkBoxStatus = $(this).prop('checked');
			cartier.common.showHideList(checkBoxStatus, _cache.$accesoriesList);

		},
		/* @public method : Function to Bind Edit Button Event
           @param :  none
        */
		_editText = function() {
			$('.edit_add').on('click', function() {
				$('#create-text').addClass('display-none');
				$('#edit-text').removeClass('display-none');
			})
		},

		/* “ DATE  08-10-2014 |  DEFECT- CARE-4344 | BRANCH 2.0.0”  
                    START
                    date validation error mgs issue 
         */
		/* @public method : set default validation option 
           @param :  none
        */
		_setDefaultValidationOption = function() {

			$.validator.setDefaults({
				errorElement: "span",
				errorPlacement: function(error, element) {
					return $('#errormessage-' + $(element).attr('name')).append(error);
				}
			});
		},

		_requiredStarHandler = function(argument) {
			// body...
			$('input[name="fn_grpaddr"]').on('change', function() {

				$('.label_addressform_address2, .label_addressform_address5, .label_addressform_address12, .label_fn_strnum, .label_fn_strname, .label_fn_pobox').find('.form-mandatory').remove();
				if ($(this).val() === "homeaddress"){
					$('.label_addressform_address2, .label_addressform_address5, .label_fn_strnum, .label_fn_strname').append('<span class="form-mandatory">*</span>');
				    $('#fn_strnum').prop('disabled', false);
					$('#fn_strname').prop('disabled', false);
					$('#fn_addrinfo').prop('disabled', false);
					$('#fn_pobox').prop('disabled', true);
                 
				}
				else{
					$('.label_addressform_address12, .label_fn_pobox').append('<span class="form-mandatory">*</span>');
					$('#fn_strnum').prop('disabled', true);
					$('#fn_strname').prop('disabled', true);
					$('#fn_addrinfo').prop('disabled', true );
					$('#fn_pobox').prop('disabled', false);
				}

			});
		}


		;
	/*END*/

	/*
        @pubic method : initailize the module
        */
	myaccount.init = function() {
		if ($('.success-div').length) {
			$('.heading-wrapper').before($('.success-div').addClass('clearfix').removeClass('success-div'));
		}

		$('.js-date-picker').addClass('js-validation-ignore');


		if ($('.js-date-picker').length) {
			$('input[type="submit"]').click(function(e) {
				e.preventDefault();
				$('.js-date-picker').removeClass('js-validation-ignore');
				$(this).closest('form').trigger('submit');
			})
		}

		if ($('#js-address-form').length || $('#js-reg-step-3').length) {
			_requiredStarHandler();
		}

		RICHEMONT.AjaxCaller.listOfCallbackFun.OwnCreationAction = _OwnCreationCallBack;

		/* “ DATE  07-11-2014|  DEFECT- CARE -4766 | BRANCH 2.0.0”  
    			START remove call back function
        
    	*/
		//RICHEMONT.AjaxCaller.listOfCallbackFun.find_address = _findAddressCallback;

		/*END*/

		RICHEMONT.AjaxCaller.listOfCallbackFun.MyAddressAction = _myAddressCallback;

		RICHEMONT.AjaxCaller.listOfCallbackFun.FinalizeProfileStep2Action = _regStep3Callback;

		// caching the jquery objects
		_objPropertiesMsg = cartier.properties.messages;
		_objPropertiesPath = cartier.properties.paths;
		/* “ DATE  08-10-2014 |  DEFECT- CARE-4344 | BRANCH 2.0.0”  
                    START
                    date validation error mgs issue 
                 */
		if ($('.js-jp-reg-step-3').length || $('.js-reg-step-3').length) {
			_setDefaultValidationOption();
		}
		/*END*/
		_radioButtonAddressHandler();
		_cacheObjects();
		_intializeOwnCreation();
		_buttonHandler();
		_bindEvent();
		_showNewPassField();
		_bindDeleteHandler();
		_radioButtonSelector();
		_changePasswordHandler();
		_editText();

		_initialNewsLetterCheck = $('#fn_newsletter').is(':checked');
		_initialCatalogeCheck = $('#fn_catalogue').is(':checked');

		if (_cache.$accesoriesInputfield.length) {
			_showAccessoriesBlock();
		}

		if (_cache.datePicker.length) {
			// Initializing the year
			_initializeDatePicker();
		}
		if (_cache.accordionObject.length) {
			// Initializing the accordion
			_initializeAccordion();
		}
		if (_cache.$radioTab.length) {
			_initializeRadioTabs();
		}
		_tabHiddenCounter();
		_labelCheckerOwnedCreations();


		// disable specific form input

		if (_cache.$myAddressUsForm.length > 0) {
			_disableAddressFiled();
		}

		if (_cache.$addressCountryNameVal) {
			_setSelectAddressVal();
			_showHideFromFiledForUk();
		}

		if ($('.js-ask-appointment-form').length > 0) {
			_askAppointmentDisplayHandler();
		}

		if ($('.js-askanappointment').length > 0) {
			_getBoutiqueListOnLoad(_objPropertiesPath.askaappointment, $('.js-askanappointment').data('currentpagepath'));
		}

		if ($('.js-address-form-jp fieldset a').length > 0 || $('.js-address-form fieldset a').length > 0) {
			$('.js-address-form-jp fieldset a, .js-address-form fieldset a').addClass('display-none');
		}

		if ($('.js-jp-reg-step-3').length > 0) {
			//$('.js-jp-reg-step-3').validate().settings.ignore = 'js-validation-ignore';
			//$('.js-jp-reg-step-3').find('input').addClass('js-validation-ignore');
		}

		if ($('#noAddressExists').length) {
			$('#noAddress').val($('#noAddressExists').val());
		}


		if ($('.js-personal-info-form').length) { /// Check if this is personal info and the site is .com

			var piFormCountryEnable = ['GB'],
				isDisable = true;

			$(piFormCountryEnable).each(function(index, el) {
				if (countryCode === el)
					isDisable = false;
			});
		

			if (isDisable) {
				$('#piform_countryName').attr('disabled', 'true');
				$('#uniform-piform_countryName').find('span').css({
					color: '#a0a0a0'
				});

				$('.js-personal-info-form').submit(function() {
					$('#piform_countryName').removeAttr('disabled');
				});
			}
		}

		if (cartier.countryHandler.isAU) {
			setTimeout(function() {
				$('#homeaddress').trigger('click');
				$('#homeaddress').trigger('click');
			}, 100);
		}
	};

}(window, jQuery, cartier.myaccount));
