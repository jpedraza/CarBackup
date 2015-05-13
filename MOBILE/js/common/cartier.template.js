/*!
 * cartier.template.js
 * This file contains the code for common methods.
 *
 * @date      2012-12-06
 * @author    YOUR NAME, SapientNitro <YOUREMAIL@sapient.com>
 *
 */

(function(window, $, template) {



	/* public function */

	template.init = function() {

		//cartier.log('template init');

	};

	var $this = template;
	/*
        type object containing all the templates 
    */
	template.type = {
		//Sample template 


		"BoutiqueTemplate":

		"<li class='store-detail js-store-detail {TAGS}' data-sid='{SID}' >" +
			"<h2 class='store-detail__title'>" +
			"{NAME1} " +
			"<\/h2>" +
			"<div class='image-text'>" +
			"<img src='{IMGSRC}' alt='{NAME2}'>" +
			"<div class='image-text__details'>" +
			"<div class='boutique_details__add'>{FULLADDRESS}<\/div>" +
			"<div class='boutique_details__con'>" +
			"<span class='arrow-red'></span><a href='tel:{PHONE1}' data-gtm='{NAME3}'>Tel.:{PHONE2}<\/a>" +
			"<div> Fax: {FAX} <\/div>" +
			"<\/div>" +
			"<\/div>" +
			"<\/div>" +
			"<div class='more-link'>" +
			"<a href='{URL}' class='read-more' data-gtm='{NAME4}'><span class='arrow-red'> <\/span>{READMORE}<\/a>" +
			"<a target='_blank' href='http://maps.google.com/?q={LAT},{LNG}({NAME5})' class='show-map' data-gtm='{NAME6}' class='show-map' data-gtm='{NAME6}'>" +
			"<span class='arrow-red'> <\/span>{SHOWMAP}" +
			"<\/a> " +
			"<\/div>" +
			"<\/li>",


		"BoutiqueTemplateHidden":

		"<li class='store-detail js-store-detail js-hide-content {TAGS}' data-sid='{SID}' >" +
			"<h2 class='store-detail__title'>" +
			"{NAME1} " +
			"<\/h2>" +
			"<div class='image-text'>" +
			"<img class='loading js-lazy-load' src='' data-linksrc='{IMGSRC}' alt='{NAME2}'>" +
			"<div class='image-text__details'>" +
			"<div class='boutique_details__add'>{FULLADDRESS}<\/div>" +
			"<div class='boutique_details__con'>" +
			"<span class='arrow-red'></span><a href='tel:{PHONE1}' data-gtm='{NAME3}'>Tel.:{PHONE2}<\/a>" +
			"<div> Fax: {FAX} <\/div>" +
			"<\/div>" +
			"<\/div>" +
			"<\/div>" +
			"<div class='more-link'>" +
			"<a href='{URL}' class='read-more' data-gtm='{NAME4}'><span class='arrow-red'> <\/span>{READMORE}<\/a>" +
			"<a target='_blank' href='http://maps.google.com/?q={LAT},{LNG}({NAME5})' class='show-map' data-gtm='{NAME6}' class='show-map' data-gtm='{NAME6}'>" +
			"<span class='arrow-red'> <\/span>{SHOWMAP}" +
			"<\/a> " +
			"<\/div>" +
			"<\/li>",



		"RetailerTemplate":

		"<li class='store-detail js-store-detail {TAGS1}' data-sid='{SID}' >" +
			"<h2 class='store-detail__title'>" +
			"{NAME1}</span>" +
			"<\/h2>" +
			"<div class='image-text'>" +
			"<div class='image-text__details auth-dealer'>" +
			"<div class='boutique_details__add'>{FULLADDRESS}<\/div>" +
			"<div class='boutique_details__con'>" +
			"<span class='arrow-red'></span><a href='tel:{PHONE1}' data-gtm='{NAME2}'>Tel.:{PHONE2}<\/a>" +
			"<div> Fax: {FAX} <\/div>" +
			"<\/div>" +
			"<div class='service-detail'>" +
			"<span class='store-detail_bold'>Services: <\/span>{TAGS2}" +
			"<\/div>" +
			"<\/div>" +
			"<\/div>" +
			"<div class='more-link'>" +
			"<a target='_blank' href='http://maps.google.com/?q={LAT},{LNG}({NAME4})' class='show-map' data-gtm='{NAME5}'>" +
			"<span class='arrow-red'> <\/span>{SHOWMAP}" +
			"<\/a> " +
			"<\/div>" +
			"<\/li>",


		"RetailerTemplateHidden":

		"<li class='store-detail js-store-detail js-hide-content {TAGS1}' data-sid='{SID}' >" +
			"<h2 class='store-detail__title'>" +
			"{NAME1}" +
			"<\/h2>" +
			"<div class='image-text'>" +
			"<div class='image-text__details auth-dealer'>" +
			"<div class='boutique_details__add'>{FULLADDRESS}<\/div>" +
			"<div class='boutique_details__con'>" +
			"<span class='arrow-red'></span><a href='tel:{PHONE1}' data-gtm='{NAME2}'>Tel.:{PHONE2}<\/a>" +
			"<div> Fax: {FAX} <\/div>" +
			"<\/div>" +
			"<div class='service-detail'>" +
			"<span class='store-detail_bold'>Services: <\/span>{TAGS2}" +
			"<\/div>" +
			"<\/div>" +
			"<\/div>" +
			"<div class='more-link'>" +
			"<a target='_blank' href='http://maps.google.com/?q={LAT},{LNG}({NAME4})' class='show-map' data-gtm='{NAME5}'>" +
			"<span class='arrow-red'> <\/span>{SHOWMAP}" +
			"<\/a> " +
			"<\/div>" +
			"<\/li>",



	};
    var _addressTempleatFinder = function(localCountryCode) {

        var addressString;

        addressString =
            [
            "", // Leave the 0th index
            "<span itemprop='streetAddress'>{STREET}<\/span><\/br>" +
            "<span itemprop='addressRegion'>{ZIPCODE} {CITY}<\/span>",

            "<span itemprop='streetAddress'>{STREET}<\/span><\/br>" +
            "<span itemprop='addressRegion'>{CITY}<\/span>",

            "<span itemprop='streetAddress'>{STREET}<\/span><\/br>" +
            "<span itemprop='addressRegion'>{ZIPCODE} {CITY} {STATE} <\/br> {COUNTRY} <\/span>",

            "<span itemprop='streetAddress'>{STREET}<\/span><\/br>" +
            "<span itemprop='addressRegion'>{CITY} {ZIPCODE} {STATE} <\/br> {COUNTRY} <\/span>",

            "<span itemprop='streetAddress'>{STREET}<\/span><\/br>" +
            "<span itemprop='addressRegion'>{ZIPCODE} {CITY} <\/br> {COUNTRY} <\/span>",

            "<span itemprop='streetAddress'>{STREET}<\/span><\/br>" +
            "<span itemprop='addressRegion'>{CITY} {ZIPCODE} <\/br> {COUNTRY} <\/span>",

            "<span itemprop='streetAddress'>{STREET}<\/span><\/br>" +
            "<span itemprop='addressRegion'>{CITY} {ZIPCODE}<\/span>",

            "<span itemprop='streetAddress'>{ZIPCODE}<\/span><\/br>" +
            "<span itemprop='addressRegion'>{STATE} {CITY}  <\/br> {STREET} <\/span>",

            "<span itemprop='streetAddress'>{STREET}<\/span><\/br>" +
            "<span itemprop='addressRegion'>{STATE}, {CITY} {ZIPCODE} <\/br> {COUNTRY} <\/span>",

            "<span itemprop='streetAddress'>{STREET}<\/span><\/br>" +
            "<span itemprop='addressRegion'>{CITY} {ZIPCODE}<\/span>",

            "<span itemprop='streetAddress'>{STREET}<\/span><\/br>" +
            "<span itemprop='addressRegion'>{CITY} <\/br> {ZIPCODE} <\/br> {COUNTRY}<\/span>"
        ];
        return addressString[_typeOfAddress(localCountryCode)];
    };

    var _typeOfAddress = function(localCountryCode) {

        var returnVal = 1;
        // Generic handling
        var type2 = ['AF', 'AG', 'AL', 'AO', 'BB', 'BI', 'BJ', 'BO', 'BS', 'BW', 'BZ', 'CF', 'CG', 'CM', 'CO', 'DJ', 'DM',
            'EG', 'ER', 'FJ', 'GD', 'GH', 'GM', 'GQ', 'GY', 'KI', 'KM', 'KP', 'KY', 'LC', 'LY', 'ML', 'MR', 'NA',
            'NR', 'RW', 'SB', 'SC', 'SL', 'SR', 'ST', 'TD', 'TG', 'TL', 'TO', 'TT', 'TV', 'TZ', 'UG', 'VC', 'VU',
            'WS', 'ZW', 'HK'
        ];

        var type3 = ['AR', 'BS', 'BY', 'BZ', 'CN', 'DO', 'EG', 'ES', 'FJ', 'KI', 'KN', 'KR', 'KW', 'KY', 'KZ', 'MX',
            'MY', 'MZ', 'NG', 'NI', 'NR', 'NZ', 'OM', 'PA', 'PF', 'PG', 'PH', 'PR', 'PW', 'RU', 'SM', 'SO',
            'SR', 'SV', 'TW', 'UA', 'UY', 'VE', 'VI', 'VN', 'YU', 'ZA'
        ];

        var type4 = ['AU', 'CA', 'FM', 'GB', 'ID', 'IE', 'IN', 'JM', 'JO', 'TH'];

        var type5 = ['ES', 'MX', 'RU', 'CN'];

        var type6 = ['US'];

        var type7 = ['BD', 'BF', 'BH', 'BM', 'BN', 'BT', 'KH', 'LB', 'LS', 'LV', 'MM', 'MN', 'MV', 'MW', 'NG', 'NP',
            'NZ', 'PE', 'PK', 'PR', 'PW', 'SA', 'SO', 'VG', 'VN'
        ];

        var type9 = ['JP'];

        var type10 = ['SG'];

        var type11 = ['BR', 'TW'];


        $.each(type2, function(index, val) {
            if (val === localCountryCode)
                returnVal = 2;
        });

        $.each(type3, function(index, val) {
            if (val === localCountryCode)
                returnVal = 3;
        });


        $.each(type4, function(index, val) {
            if (val === localCountryCode)
                returnVal = 4;
        });

        $.each(type5, function(index, val) {
            if (val === localCountryCode)
                returnVal = 5;
        });

        $.each(type6, function(index, val) {
            if (val === localCountryCode)
                returnVal = 6;
        });


        $.each(type7, function(index, val) {
            if (val === localCountryCode)
                returnVal = 7;
        });

        $.each(type9, function(index, val) {
            if (val === localCountryCode)
                returnVal = 9;
        });


        $.each(type10, function(index, val) {
            if (val === localCountryCode)
                returnVal = 10;
        });

        $.each(type11, function(index, val) {
            if (val === localCountryCode)
                returnVal = 11;
        });


        //Local site handling
        if (localCountryCode === "JP" && countryCode === "JP") {
            returnVal = 8;
        }
        if (localCountryCode === "TW" && countryCode === "TW") {
            returnVal = 8;
        }

        if (localCountryCode === "SG" && countryCode === "SG") {
            returnVal = 7;
        }

        if (localCountryCode === "BR" && countryCode === "BR") {
            returnVal = 3;
        }


        return returnVal;
    };

    var _addressFormatter = function(objData) {
        var strTemplate = _addressTempleatFinder(objData.country);


        strTemplate = strTemplate.replace(/\{CITY\}/, objData.city);
        //For Street
        if (objData.street !== undefined) {
            strTemplate = strTemplate.replace(/\{STREET\}/, objData.street);
        } else {
            strTemplate = strTemplate.replace(/\{STREET\}/, "");
        }
        //For state
        if (objData.state !== undefined) {
            strTemplate = strTemplate.replace(/\{STATE\}/, objData.state);
        } else {
            strTemplate = strTemplate.replace(/\{STATE\}/, "");
        }
        //For zipcode
        if (objData.zipcode !== undefined) {
            strTemplate = strTemplate.replace(/\{ZIPCODE\}/, objData.zipcode);
        } else {
            strTemplate = strTemplate.replace(/\{ZIPCODE\}/, "");
        }
        //For country
        if (objData.country !== undefined) {
            strTemplate = strTemplate.replace(/\{COUNTRY\}/, CQ.I18n.getMessage("country." + objData.country));
        } else {
            strTemplate = strTemplate.replace(/\{COUNTRY\}/, "");
        }

        return strTemplate;
    };
	/*
	 *    @public  method   : Boutique Template Filler
	 *    @param :
	 */

	template.BoutiqueTemplateFiller = function(strTemplate, objData) {

		strTemplate = strTemplate.replace(/\{SID\}/, objData.sid);
		strTemplate = strTemplate.replace(/\{TAGS\}/, objData.tags);
		strTemplate = strTemplate.replace(/\{NAME1\}/, objData.name);
		strTemplate = strTemplate.replace(/\{NAME2\}/, objData.name);
		strTemplate = strTemplate.replace(/\{NAME3\}/, objData.nameen);
		strTemplate = strTemplate.replace(/\{NAME4\}/, objData.nameen);
		strTemplate = strTemplate.replace(/\{NAME5\}/, objData.name);
		strTemplate = strTemplate.replace(/\{NAME6\}/, objData.nameen);

        strTemplate = strTemplate.replace(/\{FULLADDRESS\}/, _addressFormatter(objData));


		if (objData.phone) {
			strTemplate = strTemplate.replace(/\{PHONE1\}/, objData.phone);
			strTemplate = strTemplate.replace(/\{PHONE2\}/, objData.phone);
		} else
			strTemplate = strTemplate.replace("<span class='arrow-red'></span><a href='tel:{PHONE1}' data-gtm='" + objData.nameen + "'>Tel.:{PHONE2}<\/a>", "");

		if (objData.fax) {
			strTemplate = strTemplate.replace(/\{FAX\}/, objData.fax);
		} else
			strTemplate = strTemplate.replace("<div> Fax: {FAX} <\/div>", "");

		strTemplate = strTemplate.replace(/\{URL\}/, objData.url);
		strTemplate = strTemplate.replace(/\{LAT\}/, objData.latitude);
		strTemplate = strTemplate.replace(/\{LNG\}/, objData.longitude);
		strTemplate = strTemplate.replace(/\{IMGSRC\}/, objData.imgsrc);
		strTemplate = strTemplate.replace(/\{READMORE\}/, objData.readmore);
		strTemplate = strTemplate.replace(/\{SHOWMAP\}/, objData.showmap);

		return strTemplate;
	};

	/*
	 *    @public  method   : Retailer Template Filler
	 *    @param :
	 */
	template.RetailerTemplateFiller = function(strTemplate, objData) {

		strTemplate = strTemplate.replace(/\{SID\}/, objData.sid);
		strTemplate = strTemplate.replace(/\{NAME1\}/, objData.name);
		strTemplate = strTemplate.replace(/\{NAME2\}/, objData.nameen);
		strTemplate = strTemplate.replace(/\{NAME3\}/, objData.nameen);
		strTemplate = strTemplate.replace(/\{NAME4\}/, objData.name);
		strTemplate = strTemplate.replace(/\{NAME5\}/, objData.nameen);

        strTemplate = strTemplate.replace(/\{FULLADDRESS\}/, _addressFormatter(objData));

		if (objData.phone) {
			strTemplate = strTemplate.replace(/\{PHONE1\}/, objData.phone);
			strTemplate = strTemplate.replace(/\{PHONE2\}/, objData.phone);
		} else
			strTemplate = strTemplate.replace("<span class='arrow-red'></span><a href='tel:{PHONE1}' data-gtm='" + objData.nameen + "'>Tel.:{PHONE2}<\/a>", "");

		if (objData.fax) {
			strTemplate = strTemplate.replace(/\{FAX\}/, objData.fax);
		} else
			strTemplate = strTemplate.replace("<div> Fax: {FAX} <\/div>", "");

		strTemplate = strTemplate.replace(/\{TAGS1\}/, objData.tags);

		/*Internationalize the filter tags display*/
		var tempTagArray = objData.tags.split(' ');
		$.each(tempTagArray, function(index, val) {
			if(val.match(/store.refineTags./)  === null)
			tempTagArray[index] = CQ.I18n.getMessage('store.refineTags.' + tempTagArray[index]);
		});
		tempTagArray = tempTagArray.toString().replace(/[\,\ ]/gi, ' ');
		//////////////////////////////////////////////

		
		strTemplate = strTemplate.replace(/\{TAGS2\}/, tempTagArray);
		strTemplate = strTemplate.replace(/\{URL\}/, objData.url);
		strTemplate = strTemplate.replace(/\{LAT\}/, objData.latitude);
		strTemplate = strTemplate.replace(/\{LNG\}/, objData.longitude);
		strTemplate = strTemplate.replace(/\{READMORE\}/, objData.readmore);
		strTemplate = strTemplate.replace(/\{SHOWMAP\}/, objData.showmap);
		return strTemplate;
	};


}(window, jQuery, cartier.template));