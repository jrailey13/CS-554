// Setup server, session and middleware here.
import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import configRoutes from './routes/index.js';
import session from "express-session";
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import postData from './data/posts.js';
import commentData from "./data/comments.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + '/public');

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the request's method
    // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
    // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

    // let the next middleware run:
    next();
};

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);


app.use(cookieParser());

app.use(
    session({
        name: 'AuthState',
        secret: "some secret string!",
        resave: false,
        saveUninitialized: false,
    })
);


app.use(async (req, res, next) => {
    const auth = req.session.user ? true : false;

    // Middleware for /sitblog POST method
    if (req.originalUrl === '/sitblog' && req.method === 'POST') {
        if (!auth) {
            return res.status(401).json('You must be logged in to post to the blog');
        }
    }

    // Middleware for /sitblog/logout
    if (req.originalUrl === '/sitblog/logout') {
        if (!auth) {
            return res.status(401).json('You must be logged in to log out.');
        }
    }

    // Middleware for /sitblog/signin
    if (req.originalUrl === '/sitblog/signin') {
        if (auth) {
            return res.status(401).json('You are already signed in.');
        }
    }

    // Middleware for /sitblog/register
    if (req.originalUrl === '/sitblog/register') {
        if (auth) {
            return res.status(401).json('You cannot register if you are already signed in.');
        }
    }
    next();
});


app.use('/sitblog/:id', async (req, res, next) => {
    const auth = req.session.user ? true : false;
    let curPost;

    // Middleware for /sitblog/:id PUT request
    if (req.method === 'PUT' && req.originalUrl === `/sitblog/${req.params.id}`) {
        try {
            curPost = await postData.get(req.params.id);
        } catch (e) {
            console.log(e)
        }
        if (!auth) {
            return res.status(401).json('You must be logged in to edit a post');
        }
        if (req.session.user._id !== curPost.userThatPosted._id) return res.status(403).json('You can only edit your own blog posts');
    }

    // Middleware for /sitblog/:id PATCH request
    if (req.method === 'PATCH' && req.originalUrl === `/sitblog/${req.params.id}`) {
        try {
            curPost = await postData.get(req.params.id);
        } catch (e) {
            console.log(e)
        }
        if (!auth) {
            return res.status(401).json('You must be logged in to edit a post');
        }
        if (req.session.user._id !== curPost.userThatPosted._id) return res.status(403).json('You can only edit your own blog posts');
    }
    next()
});


app.use('/sitblog/:id/comments', async (req, res, next) => {
    const auth = req.session.user ? true : false;

    if (!auth) {
        return res.status(403).json('You can only add a comment if you are logged in');
    }
    next();
});

app.use('/sitblog/:blogId/:commentId', async (req, res, next) => {
    const auth = req.session.user ? true : false;

    if (req.originalUrl !== `/sitblog/${req.params.blogId}/comments`) {

        const commentId = req.params.commentId;

        const curComment = await commentData.getComment(commentId);

        const userThatPostedComment = curComment.userThatPostedComment._id;

        if (!auth) {
            return res.status(403).json('You can only delete comments if you are logged in');
        }
        if (req.session.user._id !== userThatPostedComment) {
            return res.status(403).json('You can only delete your own comments');
        }
    }
    next();
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});