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

    props: {
        type: 'string',
        unit: 'string',
        $input: 'element',
    },

    bindings: {
    },

    events: {
        'focus input': '_inputFocusHandler',
        'focusout input': '_inputFocusOutHandler',
    },

    initialize: function () {
        log('initialize()');

        // Bootstrap
        this.type = this.el.getAttribute('data-type');
        this.unit = this.el.getAttribute('data-unit');
        this.$input = this.el.querySelector('input');

        // Init setup

        // Bindings
    },

    // Event Handlers ----------------

    _inputFocusHandler: function (e) {
        //log('_inputFocusHandler triggered');
        this.el.classList.add('is-focused');
    },

    _inputFocusOutHandler: function (e) {
        //log('_inputFocusOutHandler triggered');
        this.el.classList.remove('is-focused');
    },

    // Private Methods ----------------

    // Public Methods ----------------

    SetValue: function (value) {
        this.$input.value = value;
    },

    GetValue: function() {
        //TODO: extend this to do validation, sanitization and unit conversion
        return this.$input.value;
    },

});


// Exports
// --------------------------------------------------

module.exports = InputView;
