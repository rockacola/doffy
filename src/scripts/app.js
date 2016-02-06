//
// Site / App
//

'use strict';

// Dependencies
//NOTE: Browser may needs to run "localStorage.debug=true" to have bows showing up in console.
var log = require('bows')('App');
var App = require('ampersand-app');
var MainView = require('./views/main');
//var Utils = require('./base/utils');



// App Initialization
// --------------------------------------------------

var TheInstance = window.App = window.App || {

        isDebug: false, // Whether the application is run in debug mode
        //clickOrTouch: 'click',

        init: function () {
            log('TheInstance.init()');

            //-- Init
            var baseInstance = this;
            document.body.setAttribute('data-debug', baseInstance.isDebug);
            //baseInstance.clickOrTouch = ('ontouchend' in window) ? 'touchend' : 'click';

            //-- View
            baseInstance.view = new MainView({el: document.querySelector('[data-hook="outline"]'), encodings: baseInstance.encodings});
        }
    };

App.extend(TheInstance); // use Ampersand-App for better singleton usage.
App.init();
