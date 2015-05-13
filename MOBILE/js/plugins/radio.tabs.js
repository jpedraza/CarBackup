/*!
 * Radio Tabs.js
 * This file contains application namespace and initializing the other modules
 *
 * @project   cartier mobile
 * @date      2014-02-04
 * @author    SapientNitro
 * @licensor  cartier mobile
 * @site      cartier mobile
 * USAGE : 
 * 
 * Initialize radio tabs Plugin with pluginName "radio_tabs" to The div that has class ".radio-tabs"
 
 * This Tabs snippet works for 2 and 3 Headings tabs 


 */

;
(function($, window, document, undefined) {

	'use strict';

	//check if jquery is defined, else retun
	if ($ === undefined) {
		//console.log("jQuery not found");
		return false;
	}

	var pluginName = "radio_tabs",
		defaults = {
			somevariable: true
		};

	function Plugin(element, options) {
		this.element = element;
		this.$elem = $(this.element);
		this.options = $.extend({}, defaults, options);
		this.init();
	}

	Plugin.prototype = {
		/*@Static  method   :   init function
          @param            :   None
        */

		init: function() {

			var elem = this.$elem;

			//Default Action                 
			elem.find(".tab_content").hide(); //Hide all content
			$('.js-radio-tabs').find(".radio-btn-li:first")
				.addClass("active") //Activate first tab         
			.show()
				.find("input:radio")
				.attr("checked", "");

			var activeID = $('.js-radio-tabs').find(".radio-btn-li:first").find('input').val();
			
			if($('#' + activeID).length)
				$('#' + activeID).show(); //Show first tab content 
			else
				$(".tab_content:first").show(); //Show first tab content

			$('.js-radio-tabs').find(".radio-btn-li").on('click', function() {
				$(this).removeClass("active");
				$(this).find("input:radio")
					.attr("checked", "");

				$(this).addClass("active")
					.find("input:radio")
					.attr("checked", "checked");

				$(".tab_content").hide(); //Hide all tab content 

				var activeTab = $(this).find("input:radio").val();

				$('#' + activeTab).show();
			});
		}
	};



	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName,
					new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);