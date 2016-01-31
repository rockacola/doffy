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

        // Init setup

        // Bindings
    },

    // Event Handlers ----------------


    // Private Methods ----------------

    // Public Methods ----------------

});


// Exports
// --------------------------------------------------

module.exports = MainView;
