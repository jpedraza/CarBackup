/*!
 * cartier.address.js
 * This file contains functionality handling the my address module
 *
 * @project   cartier mobile
 * @date      2014-01-03
 * @author    SapientNitro
 * @licensor  cartier mobile
 * @site      cartier mobile

 @dependency cartier.core.js
 * @ NOTE:
 THIS FILE HAS BEEN WRITTEN IN PLATFORM AND IT HAS BEEN USED IN CARTIER CODEBASE
 This file has the following sequence of the actions
 1) Declare all the private variables
 2) caching jquery wrapper objects and messages
 $last) call to init() method
 */

$(document).ready(function() {

	// [FOR NO SAVED ADDRESSES If ID #addressform_firstName1 [this is a hidden input for first name] exists then execute following snippet
	if ($('#addressform_firstName1').length > 0) {    
		$("input[name='addressform_address20'][value=" + $('input#title[name=title]').val() + "]").prop("checked", true);    
		$('#addressform_firstName1').val($('input[name="firstName1"]').val());    
		$('#addressform_lastName1').val($('input[name="lastName1"]').val());    
		$('#addressform_lastName2').val($('input[name="lastName2"]').val());
		$('#addressform_firstName2').val($('input[name="firstName2"]').val());
	};


	$(".address-listing-detail").filter(":first").show();
	$("#address-options").change(function() {
		$(".address-listing-detail").hide();
		$("#" + $(this).val()).show();
	});



	if (cartier.countryHandler.isUS) {
		$('#homeaddress').prop('checked', true);
		$("input[name='addressform_address5']").removeAttr('disabled');
		$("input[name='addressform_address6']").removeAttr('disabled');
		$("input[name='addressform_address2']").removeAttr('disabled');
		$("input[name='addressform_address12']").prop("disabled", true);

		/*
     @private method : "HOME ADDRESS" Click Event Handler
     @param : none
     */
		$('#homeaddress').on('click', function() {
			$('#homeaddress').prop('checked', true);
			$("input[name='addressform_address5']").prop("disabled", false);
			$("input[name='addressform_address6']").prop("disabled", false);
			$("input[name='addressform_address2']").prop("disabled", false);
			$("input[name='addressform_address12']").prop("disabled", true);
			$.uniform.update();
		});
		/*
     @private method : "PO BOX ADDRESS" Click Event Handler
     @param : none
     */
		$('#poboxaddress').on('click', function() {
			$('#poboxaddress').prop('checked', true);
			$("input[name='addressform_address5']").prop("disabled", true);
			$("input[name='addressform_address6']").prop("disabled", true);
			$("input[name='addressform_address2']").prop("disabled", true);
			$("input[name='addressform_address12']").prop("disabled", false);
			$.uniform.update();
		});


	} 


	var editMode = false;

	/*
     @private method : "EDIT/ADD" Click Event Handler
     @param : none
     */
	$(".edit_add").click(function() {

		$('#isDefaultAddress').val($(this).data('isdefault'));


		editMode = true;
		$('form fieldset a').removeClass('display-none');
		// check selected address is fill through po box or not 
		var ismobilepobox = $('input[type="hidden"]', this).val();


		if (cartier.countryHandler.isUS) {
			if (ismobilepobox === 'true') {
				$('.js-second-radio').find('#poboxaddress').prop('checked', true);
				$("input[name='addressform_address12']").rules('add', 'required');
				$('.addressform_address12').find('input#addressform_address12').prop('disabled', false);
				$('.addressform_address2').find('input#addressform_address2').prop('disabled', true);
				$('.addressform_address5').find('input#addressform_address5').prop('disabled', true);
				$('.addressform_address6').find('input#addressform_address6').prop('disabled', true);
				$('.addressform_address2').addClass('display-none');
				$('.addressform_address5').addClass('display-none');
				$('.addressform_address6').addClass('display-none');
				$('.addressform_address12').removeClass('display-none');
				$.uniform.update();
			} else {
				$('.js-first-radio').find('#homeaddress').prop('checked', true);
				$('.addressform_address12').addClass('display-none');
				$("input[name='addressform_address5']").prop("disabled", false);
				$("input[name='addressform_address6']").prop("disabled", false);
				$("input[name='addressform_address2']").prop("disabled", false);
				$("input[name='addressform_address12']").prop("disabled", true);
				$('.addressform_address2').removeClass('display-none');
				$('.addressform_address5').removeClass('display-none');
				$('.addressform_address6').removeClass('display-none');
				$.uniform.update();
			}
		}



		$("input[name=addressId]").val($(this).data("id"));
		var persistance = $(this).parents(".addressList").find(".address");

		if (persistance.find(".address-name-view").length != 0) {
			var titleValue = persistance.find("input[name=addresstitle]").val(),
				titleField = "input[name='addressform_address20'][value=" + titleValue + "]";

			$(titleField).prop("checked", true);

		}
		if (persistance.find(".firstName1").length != 0)
			$("input[name='addressform_firstName1']").val(persistance.find(".firstName1").html());
		if (persistance.find(".lastName1").length != 0)
			$("input[name='addressform_lastName1']").val(persistance.find(".lastName1").html());
		if (persistance.find(".firstName2").length != 0)
			$("input[name='addressform_firstName2']").val(persistance.find(".firstName2").html());
		if (persistance.find(".lastName2").length != 0)
			$("input[name='addressform_lastName2']").val(persistance.find(".lastName2").html());
		if (persistance.find(".address1").length != 0)
			$("input[name=addressform_address1]").val(persistance.find(".address1").html());
		if (persistance.find(".address2").length != 0)
			$("input[name='addressform_address2']").val(persistance.find(".address2").html());
		if (persistance.find(".address3").length != 0)
			$("input[name='addressform_address3']").val(persistance.find(".address3").html());
		if (persistance.find(".address4").length != 0)
			$("input[name='addressform_address4']").val(persistance.find(".address4").html());
		if (persistance.find(".address5").length != 0)
			$("input[name='addressform_address5']").val(persistance.find(".address5").html());
		if (persistance.find(".address6").length != 0)
			$("input[name='addressform_address6']").val(persistance.find(".address6").html());
		if (persistance.find(".address7").length != 0)
			$("input[name='addressform_address7']").val(persistance.find(".address7").html());
		if (persistance.find(".address8").length != 0)
			$("input[name='addressform_address8']").val(persistance.find(".address8").html());


		if (persistance.find(".address9").length != 0 && $('select[name="addressform_address9"]').length > 0) {
			$('select[name="addressform_address9"]').val(persistance.find(".address9").html());
		} else {
			$("input[name='addressform_address9']").val(persistance.find(".address9").html());
		}
		$.uniform.update();
		if (persistance.find(".address10").length != 0)
			$("input[name='addressform_address10']").val(persistance.find(".address10").html());
		if (persistance.find(".address11").length != 0)
			$("input[name='addressform_address11']").val(persistance.find(".address11").html());
		if (persistance.find(".address12").length != 0)
			$("input[name='addressform_address12']").val(persistance.find(".address12").html());
		if (persistance.find(".address13").length != 0)
			$("input[name='addressform_address13']").val(persistance.find(".address13").html());
		if (persistance.find(".address14").length != 0)
			$("input[name='addressform_address14']").val(persistance.find(".address14").html());
		if (persistance.find(".address15").length != 0)
			$("input[name='addressform_address15']").val(persistance.find(".address15").html());
		if (persistance.find(".address16").length != 0)
			$("input[name='addressform_address16']").val(persistance.find(".address16").html());
		if (persistance.find(".address17").length != 0)
			$("input[name='addressform_address17']").val(persistance.find(".address17").html());
		if (persistance.find(".address18").length != 0)
			$("input[name='addressform_address18']").val(persistance.find(".address18").html());
		if (persistance.find(".address19").length != 0)
			$("input[name='addressform_address19']").val(persistance.find(".address19").html());

		if (persistance.find(".address20").length != 0) {
			var titlevar = persistance.find(".address20").html();

		}

		//This has Been overriddening and Nullifying the Title Box, Hence commenting it
		//$("input[name='addressform_address20']:checked").val(titlevar);



		if (persistance.find(".country").length != 0)
			$("input[name='addressform_country']").val(persistance.find(".country").html());
		if (persistance.find(".phone").length != 0)
			$("input[name='addressform_phone']").val(persistance.find(".phone").html());
		if (persistance.find(".mobile").length != 0)
			$("input[name='addressform_mobile']").val(persistance.find(".mobile").html());
		if (persistance.find(".state").length != 0)
			$("input[name='addressform_state']").val(persistance.find(".state").html());
		if (persistance.find(".zip").length != 0) {
			$("input[name='addressform_zip']").val(persistance.find(".zip").html());
			var zipcode = persistance.find(".zip").html();
			var zip1 = zipcode.substring(0, 3);
			var zip2 = zipcode.substr(zipcode.length - 4);
			$("input[name='addressform_zip1']").val(zip1);
			$("input[name='addressform_zip2']").val(zip2);
		}

		if (persistance.find(".addressLabel").length != 0)
			$('input[name="addressLabel"]').val(persistance.find(".addressLabel").html());
		$("#edit_add").show();
		$("#create_add").hide();
		$("#address-container").hide();

	});
	/*
     @private method : "RESET/ADD" Click Event Handler
     @param : none
     */
	$(".reset_add").click(function() {

		$("input[name=addressId]").val($(this).data("id"));
		$(".form-element input").not("input[name='addressform_firstName1']").not("input[name='addressform_lastName1']").not("input[type=button]").not("input[name='addressform_firstName2']").not("input[name='addressform_lastName2']").val("");
		if (editMode) {
			$("#edit_add").show();
			$("#create_add").hide();
		}
	});

	/*
     @private method : "EDIT/ADD" Click Event Handler
     @param : none
     */
	$('#create_add, #edit_add').click(function() {
		var action = $(this).attr('id'),
			resourcePath = $("#resourcePath").val();
		if (action == "create_add") {
			if (validateWholeForm($("#addForm input[type=text]"), rulesObjects, messagesObjects)) {
				updateForm(action, resourcePath);
			}
		} else {
			updateForm(action, resourcePath);
		}

	});
	/*
     @private  method    : update address form
     @param   action
     resourcePath

     */
	var updateForm = function(action, resourcePath) {

		var addressId = $("input[name=addressId]").val();
		if (action == "create_add") {
			$("input[name=addressId]").val("");

		}
		var address1 = $("input[name='addressform_address1']").val();
		var address2 = $("input[name='addressform_address2']").val();
		var address3 = $("input[name='addressform_address3']").val();
		var address4 = $("input[name='addressform_address4']").val();
		var address5 = $("input[name='addressform_address5']").val();
		var address6 = $("input[name='addressform_address6']").val();
		var address7 = $("input[name='addressform_address7']").val();
		var address8 = $("input[name='addressform_address8']").val();
		var address9 = $('select[name="addressform_address9"] option:selected').val();
		var address10 = $("input[name='addressform_address10']").val();
		var address11 = $("input[name='addressform_address11']").val();
		var address12 = $("input[name='addressform_address12']").val();
		var address13 = $("input[name='addressform_address13']").val();
		var address14 = $("input[name='addressform_address14']").val();
		var address15 = $("input[name='addressform_address15']").val();
		var address16 = $("input[name='addressform_address16']").val();
		var address17 = $("input[name='addressform_address17']").val();
		var address18 = $("input[name='addressform_address18']").val();
		var address19 = $("input[name='addressform_address19']").val();
		var address20 = $("input[name='addressform_address20']:checked").val();
		var mobile = $("input[name='addressform_mobile']").val();
		var state = $("input[name='addressform_state']").val();
		var addCountry = $("input[name='addressform_country']").val();

		if (typeof addCountry == 'undefined') {
			var addCountry = $('select[name="addressform_country"] option:selected').val();
		};
		var firstName1 = $("input[name='addressform_firstName1']").val();
		var lastName1 = $("input[name='addressform_lastName1']").val();
		var firstName2 = $("input[name='addressform_firstName2']").val();
		var lastName2 = $("input[name='addressform_lastName2']").val();
		var phone = $("input[name='addressform_phone']").val();
		var zip = $("input[name='addressform_zip']").val();
		var zip1 = $("input[name='addressform_zip1']").val();
		var zip2 = $("input[name='addressform_zip2']").val();
		var addressLabel = $("input[name='addressLabel']").val();
		//CODE REVIEWED : remove the hard code path to properties files
		resourcePath = $("#resourcePath").val();
		$.ajax({
			url: cartier.properties.paths.actionControllerPath + '' + action + '&currentPagePath=' + resourcePath,
			type: "POST",
			data: {
				action: action,
				addressId: addressId,
				addressLabel: addressLabel,
				address1: address1,
				address2: address2,
				address3: address3,
				address4: address4,
				address5: address5,
				address6: address6,
				address7: address7,
				address8: address8,
				address9: address9,
				address10: address10,
				address11: address11,
				address12: address12,
				address13: address13,
				address14: address14,
				address15: address15,
				address16: address16,
				address17: address17,
				address18: address18,
				address19: address19,
				address20: address20,
				mobile: mobile,
				state: state,
				addCountry: addCountry,
				firstName1: firstName1,
				lastName1: lastName1,
				lastName2: lastName2,
				firstName2: firstName2,
				phone: phone,
				zip: zip,
				zip1: zip1,
				zip2: zip2
			},
			success: function(data) {
				if (data.content != undefined) {
					location.reload();
				} else {

					$(".serverMessage").html(data.content.errorMessage);
					$(".serverMessage").removeClass("display-none");
				}
			}
		})
	};
	/*
     @private method : "Delete/Add" button Click Event Handler
     @param : none
     */
	$(".delete_add").click(function() {



		var id = $(this).data("id"),
			isDefaultAdd = $(this).data('isdefault'),
			_objPropertiesMsg = cartier.properties.messages,
			_objPropertiesPath = cartier.properties.paths;


		$('body').confirmBox();
		$('body').data('plugin_confirmBox').popupInitialize({

				'title': _objPropertiesMsg.myAddressTitle,
				//'anchormessage': _objPropertiesMsg.myAddressMessage,
				'src': $('.js-wishlist_link').val() + ".html",
				'buttons': {
					'ok': {
						'buttonName': _objPropertiesMsg.myAddressYesButton,
						'class': 'cta-button cta-button__inner cta--red',
						'action': function() {

							resourcePath = $("#resourcePath").val();
							$.ajax({
								url: _objPropertiesPath.actionControllerPath + 'remove_address&currentPagePath=' + resourcePath,
								type: "POST",
								data: {
									addressId: id,
									isDefaultAddress: isDefaultAdd
								},
								success: function(data) {
									//  window.location=resourcePath+'.html';
									location.reload();
								}
							})

						}
					},
					'no': {
						'buttonName': _objPropertiesMsg.myAddressNoButton,
						'class': 'cta-button cta-button__inner cta--red'

					}
				}
			},
			$('body').data('plugin_confirmBox').confirmHide
		);



	});
	/*
     @private method : Set As Default Address Click Event Handler
     @param : none
     */
	$(".setDefault").click(function() {
		var id = $(this).data("id");
		resourcePath = $("#resourcePath").val();
		$.ajax({
			url: cartier.properties.paths.actionControllerPath + 'setDefault_address&currentPagePath=' + resourcePath,
			type: "POST",
			data: {
				addressId: id
			},
			success: function(data) {
				location.reload();
			}
		})
	});
});