//import mongo collections and implement the following data functions
import {posts} from '../config/mongoCollections.js'
import helpers from '../helpers.js'
import {ObjectId} from "mongodb";


export const create = async (blogTitle, blogBody, userId, username) => {
    blogTitle = helpers.checkString(blogTitle, 'Blog title');
    blogBody = helpers.checkString(blogBody, 'Blog body');
    userId = helpers.checkId(userId, 'User ID');
    username = helpers.checkString(username, 'Username');

    // If blog title is invalid length, throw an error
    if (blogTitle.length < 2 || blogTitle.length > 30) throw "Blog title can be between 2 and 30 characters";

    // If blog body is invalid length, throw an error
    if (blogBody.length > 1000 || blogBody.length < 1) throw "Blog body can be between 1 and 1000 characters";

    // Create post
    let newPost = {
        blogTitle: blogTitle,
        blogBody: blogBody,
        userThatPosted: {_id: userId, username},
        comments: []
    }
    const blogCollection = await posts();
    const postInfo = await blogCollection.insertOne(newPost);
    if (!postInfo.acknowledged || !postInfo.insertedId) throw "Could not add post";

    const postId = postInfo.insertedId.toString();

    const post = await get(postId);
    return post;
};

export const getAll = async (limit, skip) => {
    const blogCollection = await posts();
    let postList;

    // If limit is >100, set it to 100
    if (limit > 100) limit = 100;

    // If no limit or skip were provided, resort to default
    if (limit === undefined && skip === undefined) {
        postList = await blogCollection.find({}).limit(20).toArray();
    }
    // If no limit provided but a skip was, default limit and include appropriate skip value
    else if (limit === undefined) {
        postList = await blogCollection.find({}).limit(20).skip(skip).toArray();
    }
    // If no skip was provided, just include limit
    else if (skip === undefined) {
        postList = await blogCollection.find({}).limit(limit).toArray();
    }
    // If both are provided, include them both
    else {
        postList = await blogCollection.find({}).limit(limit).skip(skip).toArray();
    }
    if (postList === undefined) throw 'Error getting all posts';

    postList = postList.map((element) => {
        element._id = element._id.toString();
        return element;
    })

    return postList;
};

export const get = async (postId) => {
    // Check that id is a valid string
    postId = helpers.checkString(postId, 'Post ID');

    // Check that the id is a valid object id
    if (!ObjectId.isValid(postId)) throw "Input id is not a valid object id";

    // Get post
    const blogCollection = await posts();
    const post = await blogCollection.findOne({_id: new ObjectId(postId)});
    if (post === null) throw 'No post with that id';
    post._id = post._id.toString();
    return post;
};

export const remove = async (postId) => {
    // Check that id is a valid string
    postId = helpers.checkString(postId, 'Post ID');

    // Check that the id is a valid object id
    if (!ObjectId.isValid(postId)) throw "Input id is not a valid object id";

    const blogCollection = await posts();
    const deletedPost = await blogCollection.findOneAndDelete({_id: new ObjectId(postId)});

    if (!deletedPost) throw "Post you are trying to delete does not exist";

    let return_object = {
        blogTitle: deletedPost.blogTitle,
        deleted: true
    };
    return return_object;
};

export const update = async (postId, blogTitle, blogBody) => {
    blogTitle = helpers.checkString(blogTitle, 'Blog title');
    blogBody = helpers.checkString(blogBody, 'Blog body');

    // If blog title is invalid length, throw an error
    if (blogTitle.length < 2 || blogTitle.length > 30) throw "Blog title can be between 2 and 30 characters";

    // If blog body is invalid length, throw an error
    if (blogBody.length > 500 || blogBody.length < 1) throw "Blog body can be between 1 and 500 characters";

    // Check post ID
    if (!ObjectId.isValid(postId)) throw 'Post ID is not a valid Object ID';

    const postToUpdate = await get(postId);

    // Create updated post
    let updatedPost = {
        blogTitle: blogTitle,
        blogBody: blogBody,
        userThatPosted: postToUpdate.userThatPosted,
        comments: postToUpdate.comments
    }

    // Update the post
    const blogCollection = await posts();
    const postInfo = await blogCollection.findOneAndReplace(
        {_id: new ObjectId(postId)},
        updatedPost,
        {returnDocument: "after"});

    if (!postInfo) throw "No post with that post ID exists";

    postInfo._id = postInfo._id.toString();
    return postInfo;
};

export default {get, getAll, create, update, remove};