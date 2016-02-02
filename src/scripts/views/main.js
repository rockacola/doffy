//
// Site / View / Main
//

'use strict';

// Dependencies
var log = require('bows')('Main');
var App = require('ampersand-app');
var View = require('ampersand-view');
var Events = require('ampersand-events');
var Utils = require('../base/utils');
var InputView = require('./input');



// View
// --------------------------------------------------

var MainView = View.extend({

    props: {
        formInputViews: ['array', true, function() { return []; }],
    },

    derived: {
    },

    bindings: {
    },

    events: {
        'click [data-hook="calculate"]': '_calculateButtonClickHandler',
    },

    initialize: function () {
        log('initialize()');

        // Bootstrap
        var _this = this;


        // Init setup
        var $inputs = this.el.querySelectorAll('.input-form .form-block'); //TODO: ideally is to use data-hook
        //log('$inputs:', $inputs);
        Utils.forEach($inputs, function($input) {
            var view = new InputView({ el: $input });
            _this.formInputViews.push(view);
        });

        this._mock();

        // Bindings
    },

    // Event Handlers ----------------

    _calculateButtonClickHandler: function(e) {
        log('_calculateButtonClickHandler triggered.');
        e.preventDefault();
    },

    // Private Methods ----------------

    _mock: function() { // Set default values for the fields
        Utils.find(this.formInputViews, {type: 'coc'}).SetValue(0.032);
        Utils.find(this.formInputViews, {type: 'focal-length'}).SetValue(50);
        Utils.find(this.formInputViews, {type: 'aperture'}).SetValue(2.8);
        Utils.find(this.formInputViews, {type: 'focus-distance'}).SetValue(5000);
    },

    // Public Methods ----------------

});


// Exports
// --------------------------------------------------

module.exports = MainView;
