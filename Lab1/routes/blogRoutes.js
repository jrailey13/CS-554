//import express, express router as shown in lecture code

import {Router} from 'express';
const router = Router()
import {registerUser, loginUser} from "../data/users.js";
import helpers from "../helpers.js";
import {postData, commentData} from '../data/index.js';
import {ObjectId} from "mongodb";
import {get} from "../data/posts.js";
import {posts} from "../config/mongoCollections.js";


router
    .route('/')
    .get(async (req, res) => {
        try {
            // Store limit and skip values, will be undefined if not provided
            let limit = req.query.limit;
            let skip = req.query.skip;

            if (typeof req.query.limit !== "undefined") {
                if (isNaN(limit)) throw "Invalid limit parameter";
                else {
                    if (typeof limit !== "number") throw "Limit parameter must be a number";
                    if (limit < 0) throw "Limit parameter must be a positive number";
                }
            }

            if (typeof req.query.skip !== "undefined") {
                if (isNaN(skip)) throw "Invalid skip parameter";
                else {
                    if (typeof skip !== "number") throw "Skip parameter must be a number";
                    if (skip < 0) throw "Skip parameter must be a positive number";
                }
            }

            const postList = await postData.getAll(limit, skip);
            return res.status(200).json(postList);
        } catch (e) {
            return res.status(400).json({error: e});
        }
    })
    .post(async (req, res) => {
        const postInfo = req.body;
        if (!postInfo || Object.keys(postInfo).length === 0) {
            return res
                .status(400)
                .json({error: "There are no fields in the request body"});
        }

        // Error checking
        try {
            postInfo.blogTitle = helpers.checkString(postInfo.blogTitle, 'Blog title');
            postInfo.blogBody = helpers.checkString(postInfo.blogBody, 'Blog body');

            // If blog title is invalid length, throw an error
            if (postInfo.blogTitle.length < 3 || postInfo.blogTitle.length > 30) throw "Blog title can be between 3 and 30 characters";

            // If blog body is invalid length, throw an error
            if (postInfo.blogBody.length > 1000 || postInfo.blogBody.length < 1) throw "Blog body can be between 1 and 1000 characters";

            // Create post
            const newPost = await postData.create(
                postInfo.blogTitle,
                postInfo.blogBody,
                req.session.user._id,
                req.session.user.username
            );
            return res.status(200).json(newPost);
        } catch (e) {
            return res.status(400).json({error: e});
        }
    });

router.route('/logout').get(async (req, res) => {
    //code here for GET
    req.session.destroy();
    res.clearCookie("AuthState");
    return res.status(200).json('You have been logged out.');
});

router
    .route('/:id')
    .get(async (req, res) => {
        if (req.originalUrl !== '/sitblog/logout') {
            if (!ObjectId.isValid(req.params.id)) return res.status(400).json({error: "Post ID is invalid"});

            try {
                const postInfo = await postData.get(req.params.id);
                return res.status(200).json(postInfo);
            } catch (e) {
                return res.status(404).json({error: "Post with that ID not found"});
            }
        }
    })
    .put(async (req, res) => {
        let postInfo = req.body;
        // If no fields in the request body have valid values, throw an error
        if (!postInfo || Object.keys(postInfo).length === 0) {
            return res
                .status(400)
                .json({error: 'There are no fields in the request body'});
        }

        // If the post id url param is invalid, return 400 status code
        if (!ObjectId.isValid(req.params.id)) return res.status(404).json({error: "Post ID URL parameter is invalid"});

        // If the post does not exist, throw an error
        try {
            let postToUpdate = await postData.get(req.params.id);
            if (!postToUpdate) throw "A post with that id does not exist";
        } catch (e) {
            return res.status(404).json({error: e});
        }

        try {
            postInfo.blogTitle = helpers.checkString(postInfo.blogTitle, 'Blog title');
            postInfo.blogBody = helpers.checkString(postInfo.blogBody, 'Blog body');

            // If blog title is invalid length, throw an error
            if (postInfo.blogTitle.length < 3 || postInfo.blogTitle.length > 30) throw "Blog title can be between 3 and 30 characters";

            // If blog body is invalid length, throw an error
            if (postInfo.blogBody.length > 500 || postInfo.blogBody.length < 1) throw "Blog body can be between 1 and 500 characters";
        } catch (e) {
            return res.status(400).json({error: e});
        }

        try {
            const updatedPost = await postData.update(
                req.params.id,
                postInfo.blogTitle,
                postInfo.blogBody,
                req.session.user._id,
                req.session.user.username
            );
            return res.status(200).json(updatedPost);
        } catch (e) {
            res.status(400).json({error: e});
        }
    })
    .patch(async (req, res) => {
        let postInfo = req.body;
        // If no fields in the request body have valid values, throw an error
        if (!postInfo || Object.keys(postInfo).length === 0) {
            return res
                .status(400)
                .json({error: 'There are no fields in the request body'});
        }

        // If the post id url param is invalid, return 400 status code
        if (!ObjectId.isValid(req.params.id)) return res.status(404).json({error: "Post ID URL parameter is invalid"});

        let updateObj = {};

        try {
            if (postInfo.blogTitle) {
                postInfo.blogTitle = helpers.checkString(postInfo.blogTitle, 'Blog title');

                // If blog title is invalid length, throw an error
                if (postInfo.blogTitle.length < 3 || postInfo.blogTitle.length > 30) throw "Blog title can be between 3 and 30 characters";

                updateObj.blogTitle = postInfo.blogTitle;
            }

            if (postInfo.blogBody) {
                postInfo.blogBody = helpers.checkString(postInfo.blogBody, 'Blog body');

                // If blog body is invalid length, throw an error
                if (postInfo.blogBody.length > 500 || postInfo.blogBody.length < 1) throw "Blog body can be between 1 and 500 characters";

                updateObj.blogBody = postInfo.blogBody;
            }
        } catch (e) {
            res.status(400).json({error: e});
        }

        try {
            const blogCollection = await posts();
            const updatedPost = await blogCollection.findOneAndUpdate(
                {_id: new ObjectId(req.params.id)},
                {$set: updateObj},
                {returnDocument: "after"}
            );
            return res.status(200).json(updatedPost);
        } catch (e) {
            return res.status(400).json({error: e});
        }
    });

router
    .route('/:blogId/comments')
    .post(async (req, res) => {
        const commentInfo = req.body;

        // make sure the request body has values
        if (!commentInfo || Object.keys(commentInfo).length === 0) {
            return res
                .status(400)
                .json({error: 'There are no fields in the request body'});
        }

        try {
            // Check postId URL parameter
            if (!ObjectId.isValid(req.params.blogId)) return res.status(404).json({error: "Invalid post ID parameter"});

            commentInfo.commentBody = helpers.checkString(commentInfo.commentBody, 'Comment body');

            // Limit comment length
            if (commentInfo.commentBody.length > 1000) throw 'Comments cannot be longer than 1000 characters';

            const newComment = await commentData.createComment(req.params.blogId, req.session.user._id, req.session.user.username, commentInfo.commentBody);

            const blogPost = await postData.get(req.params.blogId);

            return res.status(200).json(blogPost);
        } catch (e) {
            return res.status(400).json({error: e})
        }
    });

router
    .route('/:blogId/:commentId')
    .delete(async (req, res) => {
        if (!ObjectId.isValid(req.params.commentId)) return res.status(404).json({error: "Comment ID parameter is not a valid object ID"});
        try {
            const commentInfo = await commentData.removeComment(req.params.commentId);

            const blogPost = await postData.get(req.params.blogId);

            return res.status(200).json(blogPost);
        } catch (e) {
            return res.status(403).json({error: e});
        }
    });


router
  .route('/register')
  .post(async (req, res) => {
      let userInput = req.body;
      if (!userInput || Object.keys(userInput).length === 0) {
        return res
          .status(401)
          .json('Error with registration');
        }

    try {
        // Ensure all inputs exist and are strings
        userInput.name = helpers.checkString(userInput.name, 'name');
        userInput.username = helpers.checkString(userInput.username, 'username');
        userInput.password = helpers.checkString(userInput.password, 'password');

        // Ensure name valid
        helpers.checkName(userInput.name, 'first');

        // Ensure username is valid
        helpers.checkUsername(userInput.username)

        // Ensure password is valid
        helpers.checkPassword(userInput.password);
    } catch (e) {
        return res.status(401).json({error: e})
    }

    try {
        let registeredUser = await registerUser(userInput.name,
            userInput.username, userInput.password);
        if (registeredUser) {
            return res.status(200).json(registeredUser);
        } else {
            return res.status(500).json({error: 'Internal Server Error'});
        }
    } catch (e) {
        return res.status(401).json({error: e});
    }
  });

router
  .route('/signin')
  .get(async (req, res) => {
    //code here for GET
      return res.json('Login here to add posts to the blog and comment on other posts.');
  })
  .post(async (req, res) => {
    //code here for POST
      let userInput = req.body;
      if (!userInput || Object.keys(userInput).length === 0) {
          return res
              .status(401)
              .json({error: 'Please fill in all fields to login'});
      }

      try {
          // Check username and password
          userInput.username = helpers.checkString(userInput.username, 'username');
          userInput.password = helpers.checkString(userInput.password, 'password');

          helpers.checkUsername(userInput.username);
          helpers.checkPassword(userInput.password);
      } catch (e) {
          return res.status(401).json({error: e})
      }

      try {
          let userInfo = await loginUser(userInput.username.toLowerCase(), userInput.password);
          req.session.user = userInfo;
          return res.status(200).json(userInfo);
      } catch (e) {
          return res.status(401).json({error: e});
      }
  });


export default router;
