//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.

import {ObjectId} from 'mongodb';

const exportedMethods = {
    checkId(id, varName) {
        if (!id) throw `Error: You must provide a ${varName}`;
        if (typeof id !== 'string') throw `Error:${varName} must be a string`;
        id = id.trim();
        if (id.length === 0)
            throw `Error: ${varName} cannot be an empty string or just spaces`;
        if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
        return id;
    },

    checkString(strVal, varName) {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0)
            throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        if (!isNaN(strVal))
            throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
        return strVal;
    },

    checkName(name) {
        let regex = /^(?![\s.]+$)[a-zA-Z\s.]*$/;
        if (!regex.test(name)) throw `Error: name must only contain letters!`;
        if (name.length < 2) throw `Error: name must be two or more characters!`;
    },

    checkUsername(username) {
        // If email address is not valid, throw an error
        if (username.length < 4) throw "Username must be longer than 3 characters";
        if (!username.match(/^[A-z0-9][A-z0-9!()-.?_`~;:@#$%^&*+=]+$/gi)) throw "Username is not valid";
        if (username.length > 25) throw "Username cannot be more than 25 characters";
    },

    checkPassword(password) {
        if (password.length < 8) throw 'Password must be greater than eight characters!';
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!+=<>~#%*?&])[A-Za-z\d@$!+=<>~#%*?&]{8,}$/gi)) throw `Error: Password must contain at least one uppercase character, one special character, and one number`;
    },
};

export default exportedMethods;
