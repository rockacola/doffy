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
        //TODO: validate
        if(!inputs) {
            //TODO: Error
        }
        //TODO: property null check as null != isNaN
        if(isNaN(inputs.coc)) {
            //TODO: Error
        }
        if(isNaN(inputs.focalLength)) {
            //TODO: Error
        }
        if(isNaN(inputs.aperture)) {
            //TODO: Error
        }
        if(isNaN(inputs.focusDistance)) {
            //TODO: Error
        }
        //TODO: Focus distance must be greater than focal length

        // Act
        var hd = (inputs.focalLength * inputs.focalLength) / (inputs.aperture * inputs.coc) + inputs.aperture;
        var near = (inputs.focusDistance * (hd - inputs.focalLength)) / (hd + inputs.focusDistance - (2*inputs.focalLength));
        var far = (hd <= inputs.focusDistance) ? Infinity : (inputs.focusDistance * (hd - inputs.focalLength)) / (hd - inputs.focusDistance);

        var output = {
            focusLimitNear: near,
            focusLimitFar: far,
            dof: isFinite(far) ? far - near : Infinity,
            hyperfocalDistance: hd,
        };

        console.log('foo bar. output:', output);

        return exits.success(output);
    },
};

// Export
module.exports = machine;