var machine = {
    //identity: 'calculate',
    friendlyName: 'Calculate',
    description: 'Calculate depth of field properties',
    cacheable: false,
    sync: false,

    inputs: {
        coc: {
            example: 0.032,
            description: 'Camera censor circle of confusion parameter in millimetres.',
            required: true,
        },
        focalLength: {
            example: 0.032,
            description: 'Lens focal length parameter in millimetres.',
            required: true,
        },
        aperture: {
            example: 2.8,
            description: 'Lens aperture parameter in f-stops.',
            required: true,
        },
        focusDistance: {
            example: 5000,
            description: 'Distance between focus subject and the camera sensor, in millimetres.',
            required: true,
        },
    },

    exits: {
        invalidInputParameter: {
            description: 'Invalid input on 1 or more parameters.',
        },
        success: {
            description: 'Returns an object represents depth of field properties, in millimetres.',
            example: {
                focusLimitNear: 4245.53,
                focusLimitFar: 6080.57,
                dof: 1835.04,
                hyperfocalDistance: 27904.59,
            },
        },
    },

    fn: function (inputs, exits) {
        var output = {
            focusLimitNear: 4245.53,
            focusLimitFar: 6080.57,
            dof: 1835.04,
            hyperfocalDistance: 27904.59,
        };

        return exits.success(output);
    },
};

// Export
module.exports = machine;