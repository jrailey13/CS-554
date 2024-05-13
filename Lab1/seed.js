import {dbConnection, closeConnection} from "./config/mongoConnection.js";
import posts from "./data/posts.js";
import comments from "./data/comments.js";
import {registerUser, loginUser} from "./data/users.js";

const db = await dbConnection();
await db.dropDatabase();

let registerUser1;
let loginUser1;
let post1;
let comment1;

try {
    registerUser1 = await registerUser('Jameson Railey', 'JRailey13', 'Soccer1310!');
} catch (e) {
    console.log(e);
}

try {
    loginUser1 = await loginUser('JRailey13', 'Soccer1310!');
} catch (e) {
    console.log(e);
}

try {
    post1 = await posts.create('Happy Monday', 'Hello everyone! Hope you guys have a great start to the week!', loginUser1._id.toString(), loginUser1.username);
} catch (e) {
    console.log(e);
}

try {
    comment1 = await comments.createComment(post1._id.toString(), loginUser1._id.toString(), 'jrailey13',
        "Monday Motivation: Without commitment, you'll never start. But more importantly, without consistency, you'll never finish. ― Denzel Washington");
} catch (e) {
    console.log(e);
}

// End of seed file
await closeConnection();
