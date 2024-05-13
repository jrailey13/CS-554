import {users} from '../config/mongoCollections.js'
import helpers from '../helpers.js'
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";

export const registerUser = async (
    name,
    username,
    password
) => {
    // Ensure all inputs are strings
    name = helpers.checkString(name, "name");
    username = helpers.checkString(username, "username");
    password = helpers.checkString(password, "password");

    // Use helper functions to ensure all user data is valid
    helpers.checkName(name);
    helpers.checkUsername(username)
    helpers.checkPassword(password);

    // Make username lowercase
    username = username.toLowerCase();

    // Create a hash to store for password
    const hash = await bcrypt.hash(password, 16);

    let newUser = {
        name: name,
        username: username,
        password: hash
    }
    const userCollection = await users();
    // If there is already a user with that username throw an error
    let user = await userCollection.find({name: name}).toArray();
    if (user.length > 0) throw "A user with that username already exists.";
    const userData = await userCollection.insertOne(newUser);
    if (!userData.acknowledged || !userData.insertedId) throw "Unable to register user";

    return userData;
};

export const loginUser = async (username, password) => {
    username = helpers.checkString(username, "username");
    password = helpers.checkString(password, "password");

    // Make sure username is in valid format and lowercase
    helpers.checkUsername(username);
    username = username.toLowerCase();

    helpers.checkPassword(password);

    const userCollection = await users();
    let user = await userCollection.find({username: username}).toArray();

    if (user.length === 0) throw 'No account found. Either the username or password is invalid, or you need to register using the link below.';

    // Compare password and hash
    let passwordCompare = await bcrypt.compare(password, user[0].password);
    if (!passwordCompare) throw 'Either the username or password is invalid';

    return user[0];
};
