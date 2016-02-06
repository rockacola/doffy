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
            example: 50,
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
        // NOTE:
        // No needs to null check 'inputs' as the input requirements are set per machine definition.
        // There are also no needs to datatype check as machine will automatically pick up expecting datatype base
        // on example value. More on inputs: http://node-machine.org/implementing/Understanding-Inputs

        if(inputs.coc <= 0) {
            return exits.invalidInputParameter('Invalid coc supplied.');
        }
        if(inputs.focalLength <= 0) {
            return exits.invalidInputParameter('Invalid focalLength supplied.');
        }
        if(inputs.aperture <= 0) {
            return exits.invalidInputParameter('Invalid aperture supplied.');
        }
        if(inputs.focusDistance <= 0) {
            return exits.invalidInputParameter('Invalid focusDistance supplied.');
        }
        if(inputs.focusDistance < inputs.focalLength) {
            return exits.invalidInputParameter('focusDistance is smaller than focalLength.');
        }

        // Act
        var hd = ((inputs.focalLength * inputs.focalLength) / (inputs.aperture * inputs.coc)) + inputs.aperture;
        var near;
        var far;
        if(hd > inputs.focusDistance) {
            near = (hd * inputs.focusDistance) / (hd + inputs.focusDistance);
            far = (hd * inputs.focusDistance) / (hd - inputs.focusDistance);
        } else {
            near = hd / 2;
            far = Infinity;
        }

        var output = {
            focusLimitNear: parseInt(near),
            focusLimitFar: parseInt(far),
            dof: isFinite(far) ? parseInt(far - near) : Infinity,
            hyperfocalDistance: parseInt(hd),
        };

        return exits.success(output);
    },
};

// Export
module.exports = machine;