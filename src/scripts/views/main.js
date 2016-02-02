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

        // Bindings
    },

    // Event Handlers ----------------


    // Private Methods ----------------

    // Public Methods ----------------

});


// Exports
// --------------------------------------------------

module.exports = MainView;
