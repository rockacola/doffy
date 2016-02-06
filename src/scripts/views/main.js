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
var Machinepacks = require('../base/machinepacks');



// View
// --------------------------------------------------

var MainView = View.extend({

    props: {
        formInputViews: ['array', true, function() { return []; }],
        formOutputViews: ['array', true, function() { return []; }],
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

        var $outputs = this.el.querySelectorAll('.output-form .form-block');
        Utils.forEach($outputs, function($output) {
            var view = new InputView({ el: $output });
            _this.formOutputViews.push(view);
        });

        this._mock();

        // Bindings
    },

    // Event Handlers ----------------

    _calculateButtonClickHandler: function(e) {
        log('_calculateButtonClickHandler triggered.');
        e.preventDefault();
        var _this = this;

        var inputs = {
            coc: Utils.find(this.formInputViews, {type: 'coc'}).GetValue(),
            focalLength: Utils.find(this.formInputViews, {type: 'focal-length'}).GetValue(),
            aperture: Utils.find(this.formInputViews, {type: 'aperture'}).GetValue(),
            focusDistance: Utils.find(this.formInputViews, {type: 'focus-distance'}).GetValue(),
        };

        Machinepacks.Dof.Calculate(inputs).exec({
            error: function(err) {
                log('DofCalculator.calculate error!', err);
            },
            success: function(result) {
                //log('DofCalculator.calculate success! result:', result);
                _this._setResult(result);
            }
        });
    },

    // Private Methods ----------------

    _mock: function() { // Set default values for the fields
        Utils.find(this.formInputViews, {type: 'coc'}).SetValue(0.032);
        Utils.find(this.formInputViews, {type: 'focal-length'}).SetValue(50);
        Utils.find(this.formInputViews, {type: 'aperture'}).SetValue(2.8);
        Utils.find(this.formInputViews, {type: 'focus-distance'}).SetValue(5000);
    },

    _setResult: function(result) {
        log('_setResult triggered. result:', result);

        Utils.find(this.formOutputViews, {type: 'dof'}).SetValue(parseInt(result.dof));
        Utils.find(this.formOutputViews, {type: 'hyperfocal-distance'}).SetValue(parseInt(result.hyperfocalDistance));
        Utils.find(this.formOutputViews, {type: 'near-limit'}).SetValue(parseInt(result.focusLimitNear));
        Utils.find(this.formOutputViews, {type: 'far-limit'}).SetValue(parseInt(result.focusLimitFar));
    },


    // Public Methods ----------------

});


// Exports
// --------------------------------------------------

module.exports = MainView;
