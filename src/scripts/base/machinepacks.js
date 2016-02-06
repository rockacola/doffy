//
// Site / Base / Machinepacks
//

'use strict';

// Base
// --------------------------------------------------

var Machinepacks = {

    Dof: {
        Calculate: require('machine').build(require('../machinepacks/machinepack-dof/machines/calculate')),
    },

};


// Exports
// --------------------------------------------------

module.exports = Machinepacks;
