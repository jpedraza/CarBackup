/*!
 * cartier.country.handler.js
 * This file contians country handling part
 *
 * @project   cartier mobile
 * @date      2014-09-10
 * @author    YOUR NAME, SapientNitro <YOUREMAIL@sapient.com>
 * @site      cartier mobile
   @dependency none
 * @ NOTE:
    This file has the following sequence of the actions
    1) Public methods to access country code
    
 */
;
(function(win, $, countryHandler, undefined) {

	//this will cause the browser to check for errors more aggressively
	'use strict';

	//check if jquery is defined, else retun
	if (typeof $ === undefined) {
		//console.log("jQuery not found");
		return false;
	}


	var countryCodeArray = ['US', 'JP', 'WW', 'AU'];
	/*
		public variables
	*/

	/*	
		@public method : set the country code 
    */
	countryHandler.countryCode = function() {
		var returnValue = countryCodeArray[0]; // Default
		if (win.countryCode) {
			returnValue = win.countryCode.toUpperCase();
		}
		return returnValue;
	};


	/*	
		@public method : get the JP country code
    */

    (function() {
    	countryHandler.isUS = (countryHandler.countryCode() === countryCodeArray[0]);
    	countryHandler.isJP = (countryHandler.countryCode() === countryCodeArray[1]);
    	countryHandler.isWW = (countryHandler.countryCode() === countryCodeArray[2]);
    	countryHandler.isAU = (countryHandler.countryCode() === countryCodeArray[3]);
    })();

}(window, jQuery, cartier.countryHandler));