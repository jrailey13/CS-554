import express from 'express';
import configRoutes from './routes/index.js';
const app = express();
import { createClient } from "redis";
const client = await createClient().
    on('error', err => console.log('Redis Client Error', err))
    .connect();

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

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);


// app.get('/', async (req, res, next) => {
//     let cacheForHomePageExists = await client.get('homePage');
//     if (cacheForHomePageExists) {
//         console.log('Data was in cache');
//         res.send(cacheForHomePageExists);
//     } else {
//         next();
//     }
// });

app.get('/api/rockets/', async (req, res, next) => {
    if (req.originalUrl === '/api/rockets') {
        let exists = await client.exists('rocketData');
        if (exists) {
            //if we do have it in cache, send the data from cache
            console.log('Rocket list in cache');
            let rocketList = await client.get('rocketData');
            res.send(rocketList);
        } else {
            next();
        }
    }
});

app.get('/api/rockets/:id', async (req, res, next) => {
    if (req.originalUrl === `/api/rockets/${req.params.id}`) {
        let exists = await client.exists(req.params.id);
        if (exists) {
            //if we do have it in cache, send the raw html from cache
            console.log('Rocket in cache');
            let rocketObj = await client.get(req.params.id);
            res.send(rocketObj);

            await client.lPush('recentRocketList', rocketObj);
        } else {
            next();
        }
    }
});

app.get('/api/launches/', async (req, res, next) => {
    if (req.originalUrl === '/api/launches') {
        let exists = await client.exists('launchData');
        if (exists) {
            //if we do have it in cache, send the data from cache
            console.log('Launch list in cache');
            let launchList = await client.get('launchData');
            res.send(launchList);
        } else {
            next();
        }
    }
});

app.get('/api/launches/:id', async (req, res, next) => {
    if (req.originalUrl === `/api/launches/${req.params.id}`) {
        let exists = await client.exists(req.params.id);
        if (exists) {
            //if we do have it in cache, send the raw html from cache
            console.log('Launch in cache');
            let launchObj = await client.get(req.params.id);
            res.send(launchObj);
        } else {
            next();
        }
    }
});

app.get('/api/capsules/', async (req, res, next) => {
    if (req.originalUrl === '/api/capsules') {
        let exists = await client.exists('capsuleData');
        if (exists) {
            //if we do have it in cache, send the data from cache
            console.log('Capsule list in cache');
            let capsuleList = await client.get('capsuleData');
            res.send(capsuleList);
        } else {
            next();
        }
    }
});

app.get('/api/capsules/:id', async (req, res, next) => {
    if (req.originalUrl === `/api/capsules/${req.params.id}`) {
        let exists = await client.exists(req.params.id);
        if (exists) {
            //if we do have it in cache, send the raw html from cache
            console.log('Capsule in cache');
            let capsuleObj = await client.get(req.params.id);
            res.send(capsuleObj);
        } else {
            next();
        }
    }
});

configRoutes(app);

app.listen(3000, async () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
