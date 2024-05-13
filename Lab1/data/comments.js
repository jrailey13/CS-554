import {posts} from '../config/mongoCollections.js'
import helpers from '../helpers.js'
import {ObjectId} from "mongodb";
import {get} from "./posts.js";

const createComment = async (postId, userId, username, commentBody) => {
    //Implement Code here
    postId = helpers.checkString(postId, 'Post ID');
    userId = helpers.checkString(userId, 'User ID');
    username = helpers.checkString(username, 'Username');
    commentBody = helpers.checkString(commentBody, 'Comment body');


    // If postID is not a valid ObjectID, throw an error
    if (!ObjectId.isValid(postId)) throw "Post ID is not a valid object ID";

    // If userID is not a valid object id, throw an error
    if (!ObjectId.isValid(userId)) throw 'User ID is not a valid object ID';

    // Ensure username is valid
    helpers.checkUsername(username);

    // Limit comment length
    if (commentBody.length > 1000) throw 'Comments cannot be longer than 1000 characters';


    // Create comment object
    const comment = {
        _id: new ObjectId(), userThatPostedComment: {_id: userId, username}, comment: commentBody
    };

    // If an post with that id does not exist, throw an error
    let post = await get(postId);
    if (!post) throw "Cannot create a comment because a post with that post ID does not exist";

    const blogCollection = await posts();
    const updatedPost = await blogCollection.findOneAndUpdate(
        {_id: new ObjectId(postId)},
        {$push: {comments: comment}},
        {returnDocument: "after"}
    );

    return updatedPost;
};

const getComment = async (commentId) => {
    //Implement Code here
    // Check and trim comment id
    commentId = helpers.checkString(commentId, 'Comment ID');

    // Check that comment id is a valid object id
    if (!ObjectId.isValid(commentId)) throw "Comment ID is not a valid object id";

    const blogCollection = await posts();

    // Find the post with the comment id and project the appropriate fields
    const post = await blogCollection.find({'comments._id': new ObjectId(commentId)}).toArray();

    if (!post) throw "Could not find a post that contains that comment id";

    let comment = post[0].comments.filter(obj => obj._id.toString() === commentId);

    if (!comment) throw "Comment with that comment id does not exist"

    return comment[0];
};

const removeComment = async (commentId) => {
    //Implement Code here
    // Check comment Id
    commentId = helpers.checkString(commentId, 'Comment ID')

    // Check that comment id is a valid object id
    if (!ObjectId.isValid(commentId)) throw "Comment ID is not a valid object id";

    // Load in posts
    const blogCollection = await posts();

    // Get the comment we are going to remove
    let comment = await getComment(commentId);

    // Find the post with the comment id and project the appropriate fields
    let post = await blogCollection.findOneAndUpdate({'comments._id': new ObjectId(commentId)},
        {$pull: {comments: comment}},
        {returnDocument: "after"});

    if (!post) throw "No post with that comment id";

    return post;
};

export default {createComment, getComment, removeComment};
