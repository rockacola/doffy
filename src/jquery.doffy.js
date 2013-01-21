/*!
 * Doffy Depth of Field Calculator
 * http://travislin.com/doffy
 *
 * Copyright 2011, Travis Lin
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: 2013-01-19
 * 
 * Known Bugs:
 *      - DoF goes negative when Subject Distance > Hyperfocal
 *      - DoF goes 0 when Subject Distance is too close (eg/ 0.2m)
 */
(function($){

	/*
	 * Set Default Configuration
	 */
	var defaults = {
		// regular expression used to detect numbers, if you want to force the field to contain
		// numbers, you can add a ^ to the beginning or $ to the end of the regex to force the
		// the regex to match the entire string: /^(-?\$?)(\d+(,\d{3})*(\.\d{1,})?|\.\d{1,})$/g
		//
		// To find European formated numbers, use: /(-?\$?)(\d+(\.\d{3})*(,\d{1,})?|,\d{1,})/g
		reNumbers: /(-?\$?)(\d+(,\d{3})*(\.\d{1,})?|\.\d{1,})/g
		// this function is used in the parseNumber() to cleanse up any found numbers
		// the function is intended to remove extra information found in a number such
		// as extra commas and dollar signs. override this function to strip European values
		, cleanseNumber: function (v){
			// cleanse the number one more time to remove extra data (like commas and dollar signs)
			// For European numbers use: v.replace(/[^0-9,\-]/g, "").replace(/,/g, ".")
			return v.replace(/[^0-9.\-]/g, "");
		}
		// should the Field plug-in be used for getting values of :input elements?
		, useFieldPlugin: (!!$.fn.getValue)
		// a callback function to run when an parsing error occurs
		, onParseError: null
		// a callback function to run once a parsing error has cleared
		, onParseClear: null
	};
	
    
    
	/*
	 * Set Default Options
	 */
	$.Calculation = {
		version: "1.1.0",
		setDefaults: function(options){
			$.extend(defaults, options);
		}
	};
    
    
    
	/*
	 * jQuery.fn.parseNumber()
	 *
	 * returns Array - detects the DOM element and returns it's value. input
	 *                 elements return the field value, other DOM objects
	 *                 return their text node
	 *
	 * NOTE: Breaks the jQuery chain, since it returns a Number.
	 *
	 * Examples:
	 * $("input[name^='price']").parseNumber();
	 * > This would return an array of potential number for every match in the selector
	 *
	 */
	$.fn.parseNumber = function(options){
		var aValues = [];
		options = $.extend(options, defaults);
		
		this.each(
			function (){
				var
					// get a pointer to the current element
					$el = $(this),
					// determine what method to get it's value
					sMethod = ($el.is(":input") ? (defaults.useFieldPlugin ? "getValue" : "val") : "text"),
					// parse the string and get the first number we find
					v = $.trim($el[sMethod]()).match(defaults.reNumbers, "");
					
				// if the value is null, use 0
				if( v == null ){
					v = 0; // update value
					// if there's a error callback, execute it
					if( jQuery.isFunction(options.onParseError) ) options.onParseError.apply($el, [sMethod]);
					$.data($el[0], "calcParseError", true);
				// otherwise we take the number we found and remove any commas
				} else {
					// clense the number one more time to remove extra data (like commas and dollar signs)
					v = options.cleanseNumber.apply(this, [v[0]]);
					// if there's a clear callback, execute it
					if( $.data($el[0], "calcParseError") && jQuery.isFunction(options.onParseClear) ){
						options.onParseClear.apply($el, [sMethod]);
						// clear the error flag
						$.data($el[0], "calcParseError", false);
					} 
				}
				aValues.push(parseFloat(v, 10));
			}
		);
        
		// return an array of values
		return aValues;
	};
    
    
	/*
	 * jQuery.fn.hyperfocal()
	 */
    $.fn.hyperfocal = function(addressOfFocalLength, addressOfFNumber, addressOfCoc){
        //-- Arrange
        var focalLength = parseFloat($(addressOfFocalLength).parseNumber());
        var fNumber = parseFloat($(addressOfFNumber).parseNumber());
        var coc = parseFloat($(addressOfCoc).parseNumber());
        
        //-- Act
        var hyperfocal = $.CalculateHyperfocalDistance(focalLength, fNumber, coc);
        
        //-- Output
        this.val(hyperfocal);
        this.text(hyperfocal);
        return this;
    };
    
	/*
	 * jQuery.fn.nearFocusLimit()
	 */
    $.fn.nearFocusLimit = function(addressOfHyperfocalDistance, addressOfFocusDistance){
        //-- Arrange
        var hyperfocalDistance = parseFloat($(addressOfHyperfocalDistance).parseNumber());
        var focusDistance = parseFloat($(addressOfFocusDistance).parseNumber());
        
        //-- Act
        var nearFocusLimit = $.CalculateNearFocusLimit(hyperfocalDistance, focusDistance);
        
        //-- Output
        this.val(nearFocusLimit);
        this.text(nearFocusLimit);
        return this;
    };
    
	/*
	 * jQuery.fn.farFocusLimit()
	 */
    $.fn.farFocusLimit = function(addressOfHyperfocalDistance, addressOfFocusDistance){
        //-- Arrange
        var hyperfocalDistance = parseFloat($(addressOfHyperfocalDistance).parseNumber());
        var focusDistance = parseFloat($(addressOfFocusDistance).parseNumber());
        
        //-- Act
        var farFocusLimit = $.CalculateFarFocusLimit(hyperfocalDistance, focusDistance);
        
        //-- Output
        this.val(farFocusLimit);
        this.text(farFocusLimit);
        return this;
    };
    
	/*
	 * jQuery.fn.depthOfField()
	 */
    $.fn.depthOfField = function(addressOfHyperfocalDistance, addressOfFocusDistance){
        //-- Arrange
        var hyperfocalDistance = parseFloat($(addressOfHyperfocalDistance).parseNumber());
        var focusDistance = parseFloat($(addressOfFocusDistance).parseNumber());
        
        //-- Act
        var dof = $.CalculateDepthOfField(hyperfocalDistance, focusDistance);
        
        //-- Output
        this.val(dof);
        this.text(dof);
        return this;
    };    
    
    
    
	/*
	 * Direct Accessible Methods to Depth of Field Calculator
	 */
    $.CalculateHyperfocalDistance = function(focalLength, fNumber, circleOfConfusion) {
        return math["hyperfocalDistance"](focalLength, fNumber, circleOfConfusion);
    };
    
    $.CalculateNearFocusLimit = function(hyperfocalDistance, focusDistance) {
        return math["nearFocusLimit"](hyperfocalDistance, focusDistance);
    };
    
    $.CalculateFarFocusLimit = function(hyperfocalDistance, focusDistance) {
        return math["farFocusLimit"](hyperfocalDistance, focusDistance);
    };
    
    $.CalculateDepthOfField = function(hyperfocalDistance, focusDistance) {
        var far = math["farFocusLimit"](hyperfocalDistance, focusDistance);
        var near = math["nearFocusLimit"](hyperfocalDistance, focusDistance);
        return far - near;
    };
    
        
    
	/*
	 * Mathmatical Functions
	 */
	var math = {
        //-- Find Hyperfocal Distance (in mm)
        hyperfocalDistance: function (focalLength, fNumber, circleOfConfusion){
            return (focalLength * focalLength) / (fNumber * circleOfConfusion) + fNumber;
        },
        
        //-- Find Near Focus Limit (in mm)
        nearFocusLimit: function (hyperfocalDistance, focusDistance){
            return (hyperfocalDistance * focusDistance) / (hyperfocalDistance + focusDistance);
        },
        
        //-- Find Far Focus Limit (in mm)
        farFocusLimit: function (hyperfocalDistance, focusDistance){
            return (hyperfocalDistance * focusDistance) / (hyperfocalDistance - focusDistance);
        }
	};
    
})(jQuery);