import {Router} from 'express';
import axios from "axios";
import * as redis from "redis";
const router = Router()
import {validate} from 'uuid';
const client = redis.createClient();
client.connect().then(() => {});

router
    .route('/rockets/history')
    .get(async (req, res) => {
        try {
            let rocketHistory = await client.lRange('recentRocketList', 0, 20);

            return res.status(200).send(rocketHistory);
        } catch (e) {
            return res.status(400).json({error: e});
        }
    });

router
    .route('/rockets')
    .get(async (req, res) => {
        console.log("Rocket list not cached");
        try {
            // 1. It will query the data from the SpaceX API for the list of Rockets.
            let rocketData = await axios.get("https://api.spacexdata.com/v4/rockets");

            const rocketJSON = JSON.stringify(rocketData.data);

            // 2. You will then add the data of all the Rockets returned from the API to the Cache.
            await client.set('rocketData', rocketJSON);

            // 3. You will then send a response to the browser of the JSON returned from the API call in step 1.
            return res.status(200).send(rocketJSON);
        } catch (e) {
            return res.status(400).json({error: e});
        }
    });

router
    .route('/rockets/:id')
    .get(async (req, res) => {
        if (req.originalUrl === `/api/rockets/${req.params.id}`) {
            console.log(`Rocket ${req.params.id} not cached`);

            if (!validate(req.params.id)) return res.status(400).json('Invalid rocket ID');

            // 1. It will query the data from the SpaceX API for the rocket with the ID specified in the URL Params.
            // You will fail the request if the Rocket id is not found in the API (if it can't find that rocket with the
            // specified ID, you do not add anything to cache)
            try {
                let rocketData = await axios.get(`https://api.spacexdata.com/v4/rockets/${req.params.id}`);

                // 2. If the rocket for the specified ID is found, you will then add the data for that rocket to the cache.
                const rocketJSON = JSON.stringify(rocketData.data);

                await client.set(req.params.id, rocketJSON);

                // 3. You will then send a response to the browser of the JSON returned from the API call from step 1.
                res.status(200).send(rocketJSON);

                // 4. If the rocket is found, then you will also add that rocket's data to a Redis list of recently viewed
                // rockets (see history route below) ordered by most recent rocket. This list can be infinitely large.
                await client.lPush('recentRocketList', rocketJSON);
            } catch (e) {
                return res.status(404).json("Error retrieving rocket data.");
            }
        }
    });

router
    .route('/launches')
    .get(async (req, res) => {
        console.log("Launch list not cached");

        try {
            // 1. It will query the data from the SpaceX API for the list of launches.
            let launchData = await axios.get("https://api.spacexdata.com/v4/launches");

            const launchJSON = JSON.stringify(launchData.data);

            // 2. You will then add the data of all the launches returned from the API to the Cache.
            await client.set('launchData', launchJSON);

            // 3. You will then send a response to the browser of the JSON returned from the API call in step 1.
            return res.status(200).send(launchJSON);
        } catch (e) {
            return res.status(400).json(e);
        }
    });

router
    .route('/launches/:id')
    .get(async (req, res) => {
        if (req.originalUrl === `/api/launches/${req.params.id}`) {
            console.log(`launch ${req.params.id} not cached`);

            if (!validate(req.params.id)) return res.status(400).json('Invalid launch ID');

            // 1. It will query the data from the SpaceX API for the launch with the ID specified in the URL Params.
            // You will fail the request if the launch id is not found in the API (if it can't find that launch with the
            // specified ID, you do not add anything to cache)
            try {
                let launchData = await axios.get(`https://api.spacexdata.com/v4/launches/${req.params.id}`);

                // 2. If the launch for the specified ID is found, you will then add the data for that launch to the cache.
                const launchJSON = JSON.stringify(launchData.data);

                await client.set(req.params.id, launchJSON);

                // 3. You will then send a response to the browser of the JSON returned from the API call from step 1.
                return res.status(200).send(launchJSON);
            } catch (e) {
                return res.status(404).json("Error retrieving launch data.");
            }
        }
    });

router
    .route('/capsules')
    .get(async (req, res) => {
        console.log("capsule list not cached");
        try {
            // 1. It will query the data from the SpaceX API for the list of capsules.
            let capsuleData = await axios.get("https://api.spacexdata.com/v4/capsules");

            const capsuleJSON = JSON.stringify(capsuleData.data);

            // 2. You will then add the data of all the capsules returned from the API to the Cache.
            await client.set('capsuleData', capsuleJSON);

            // 3. You will then send a response to the browser of the JSON returned from the API call in step 1.
            return res.status(200).send(capsuleJSON);
        } catch (e) {
            return res.status(400).json(e);
        }
    });

router
    .route('/capsules/:id')
    .get(async (req, res) => {
        if (req.originalUrl === `/api/capsules/${req.params.id}`) {
            console.log(`capsule ${req.params.id} not cached`);

            if (!validate(req.params.id)) return res.status(400).json('Invalid capsule ID');

            // 1. It will query the data from the SpaceX API for the capsule with the ID specified in the URL Params.
            // You will fail the request if the capsule id is not found in the API (if it can't find that capsule with the
            // specified ID, you do not add anything to cache)
            try {
                let capsuleData = await axios.get(`https://api.spacexdata.com/v4/capsules/${req.params.id}`);
                if (!capsuleData) return res.status(404).json("capsule object not found.");

                // 2. If the capsule for the specified ID is found, you will then add the data for that capsule to the cache.
                const capsuleJSON = JSON.stringify(capsuleData.data);

                await client.set(req.params.id, capsuleJSON);

                // 3. You will then send a response to the browser of the JSON returned from the API call from step 1.
                return res.status(200).send(capsuleJSON);
            } catch (e) {
                return res.status(404).json("Error retrieving capsule data.");
            }
        }
    });

export default router