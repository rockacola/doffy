//
// Site / View / Input
//

'use strict';

// Dependencies
var log = require('bows')('Input');
//var App = require('ampersand-app');
var View = require('ampersand-view');
var Events = require('ampersand-events');
var Utils = require('../base/utils');


// View
// --------------------------------------------------

var InputView = View.extend({

    template: '<div class="form-block">' +
                '<label>[Label]</label>' +
                '<textarea class="input"></textarea>' +
              '</div>',

    render: function() {
        this.renderWithTemplate(this);
        return this;
    },

    props: {
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

module.exports = InputView;
