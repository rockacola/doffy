/*!
 * Doffy - Depth of Field Calculator
 * @name jquery.doffy.js
 * @description jQuery calculator plugin computes Depth of Field of specified lens attributes. 
 * @author Travis Lin - http://travislin.com/doffy
 * @version 1.2.0
 * @date 2013-01-28
 * @copyright (c) 2013 Travis Lin - http://travislin.com/doffy
 * @license MIT license
 * @example TBA
 */
(function($){
    
	/*
	 * Set Default Options
	 */
	$.Doffy = {
		version: "1.2.0",
		setDefaults: function(options){
			$.extend(defaults, options);
		}
	};
    
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
	 * jQuery.fn.hyperfocal()
	 */
    $.fn.hyperfocal = function(addressOfFocalLength, addressOfFNumber, addressOfCoc){
        //-- Arrange
        var focalLength = $(addressOfFocalLength).parseFloatNumber();
        var fNumber = $(addressOfFNumber).parseFloatNumber();
        var coc = $(addressOfCoc).parseFloatNumber();
        //-- Act
        var hyperfocal = $.CalculateHyperfocalDistance(focalLength, fNumber, coc);
        //-- Output
        return $(this).printValue(hyperfocal);
    };
    
	/*
	 * jQuery.fn.nearFocusLimit()
	 */
    $.fn.nearFocusLimit = function(addressOfFocalLength, addressOfHyperfocalDistance, addressOfFocusDistance){
        //-- Arrange
        var hyperfocalDistance = $(addressOfHyperfocalDistance).parseFloatNumber();
        var focusDistance = $(addressOfFocusDistance).parseFloatNumber();
        var focalLength = $(addressOfFocalLength).parseFloatNumber();
        //-- Act
        var nearFocusLimit = $.CalculateNearFocusLimit(focalLength, hyperfocalDistance, focusDistance);
        //-- Output
        return $(this).printValue(nearFocusLimit);
    };
    
	/*
	 * jQuery.fn.farFocusLimit()
	 */
    $.fn.farFocusLimit = function(addressOfFocalLength, addressOfHyperfocalDistance, addressOfFocusDistance){
        //-- Arrange
        var hyperfocalDistance = $(addressOfHyperfocalDistance).parseFloatNumber();
        var focusDistance = $(addressOfFocusDistance).parseFloatNumber();
        var focalLength = $(addressOfFocalLength).parseFloatNumber();
        //-- Act
        var farFocusLimit = $.CalculateFarFocusLimit(focalLength, hyperfocalDistance, focusDistance);
        //-- Output
        return $(this).printValue(farFocusLimit);
    };
    
	/*
	 * jQuery.fn.depthOfField()
	 */
    $.fn.depthOfField = function(addressOfFocalLength, addressOfHyperfocalDistance, addressOfFocusDistance){
        //-- Arrange
        var hyperfocalDistance = $(addressOfHyperfocalDistance).parseFloatNumber();
        var focusDistance = $(addressOfFocusDistance).parseFloatNumber();
        var focalLength = $(addressOfFocalLength).parseFloatNumber();
        //-- Act
        var dof = $.CalculateDepthOfField(focalLength, hyperfocalDistance, focusDistance);
        //-- Output
        return $(this).printValue(dof);
    };
    
	/*
	 * Direct Accessible Methods to Depth of Field Calculator
	 */
    $.CalculateHyperfocalDistance = function(focalLength, fNumber, circleOfConfusion) {
        //-- Act
        return math["hyperfocalDistance"](focalLength, fNumber, circleOfConfusion);
    };
    
    $.CalculateNearFocusLimit = function(focalLength, hyperfocalDistance, focusDistance) {
        //-- Act
        var result = math["nearFocusLimit"](focalLength, hyperfocalDistance, focusDistance);
        //-- Validate
        if(result == null)
            result = 0;
        //-- Output
        return result;
    };
    
    $.CalculateFarFocusLimit = function(focalLength, hyperfocalDistance, focusDistance) {
        //-- Act
        var result = math["farFocusLimit"](focalLength, hyperfocalDistance, focusDistance);
        //-- Validate
        if(result == null)
            result = 0;
        //-- Output
        return result;
    };
    
    $.CalculateDepthOfField = function(focalLength, hyperfocalDistance, focusDistance) {
        //-- Arrange
        var far = math["farFocusLimit"](focalLength, hyperfocalDistance, focusDistance);
        var near = math["nearFocusLimit"](focalLength, hyperfocalDistance, focusDistance);
        //-- Validate & Act
        if(far == null || near == null)
            var result = 0;
        else if(far == Infinity)
            var result = Infinity;
        else
            var result = (far - near);
        //-- Output
        return result
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
        nearFocusLimit: function (focalLength, hyperfocalDistance, focusDistance){
            if(focusDistance < focalLength)
                var result = null; // Cannot focus closer to lens front element
            else
                var result = (focusDistance * (hyperfocalDistance - focalLength)) / (hyperfocalDistance + focusDistance - (2*focalLength));
            return result;
        },
        
        //-- Find Far Focus Limit (in mm)
        farFocusLimit: function (focalLength, hyperfocalDistance, focusDistance){
            if(focusDistance < focalLength)
                var result = null; // Cannot focus closer to lens front element
            else if(hyperfocalDistance <= focusDistance)
                var result = Infinity;
            else
                result = (focusDistance * (hyperfocalDistance - focalLength)) / (hyperfocalDistance - focusDistance);
            return result;
        }
	};
    
	/*
	 * jQuery.fn.parseNumber()
	 * extract float value within a given HTML element
     * NOTE: Breaks the jQuery chain, since it returns a float value.
	 */
    $.fn.parseFloatNumber = function(options){
        //-- Arrange
        options = $.extend(options, defaults);
        var targetElement = $(this);
        
        //-- Act
        var fetchMethod = targetElement.is(":input") ? (defaults.useFieldPlugin ? "getValue" : "val") : "text";
        var result = $.trim(targetElement[fetchMethod]()).match(defaults.reNumbers, "");
        
        if(result == null) {
            result = 0;
            // if there's a error callback, execute it
            if(jQuery.isFunction(options.onParseError)) {
                options.onParseError.apply(targetElement, [fetchMethod]);
                $.data(targetElement[0], "calcParseError", true);
            }
        } else {
            // clense the number one more time to remove extra data (like commas and dollar signs)
            result = options.cleanseNumber.apply(this, [result[0]]);
            // if there's a clear callback, execute it
            if( $.data(targetElement[0], "calcParseError") && jQuery.isFunction(options.onParseClear) ){
                options.onParseClear.apply(targetElement, [fetchMethod]);
                // clear the error flag
                $.data(targetElement[0], "calcParseError", false);
            }
        }
        
        //-- Output
        result = parseFloat(result);
        return result;
    }
    
	/*
	 * jQuery.fn.printValue()
	 * Output and display any value to a specified HTML element
	 */
    $.fn.printValue = function(value){
        //-- Arrange
        var targetElement = $(this);
        //-- Act
        var fetchMethod = targetElement.is(":input") ? (defaults.useFieldPlugin ? "getValue" : "val") : "text";
        targetElement[fetchMethod](value);
        //-- Output
        return targetElement;
    }
    
})(jQuery);