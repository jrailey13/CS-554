const express = require('express');
const router = express.Router();
const redis = require('redis');
const bluebird = require('bluebird');
const client = redis.createClient();
const axios = require('axios');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get('/', async (req, res) => {
	//lets check to see if we have the show list page in cache
	let exists = await client.existsAsync('showListHomepage');
	if (exists) {
		//if we do have it in cache, send the raw html from cache
		console.log('Show List from cache');
		let showsHomePage = await client.getAsync('showListHomepage');
		console.log('Sending HTML from Redis....');
		res.send(showsHomePage);
		return;
	} else {
		//if the show list is not in cache, then query the API for the show list,
		//render handlebars and cache the HTML and send raw HTML in response
		console.log('Show List not cached');
		let { data } = await axios.get('http://api.tvmaze.com/shows');
		res.render('shows/showlist', { shows: data }, async (err, html) => {
			console.log('HTML', html);
			await client.setAsync('showListHomepage', html);
			res.send(html);
		});
	}
});

router.get('/popularsearches', async (req, res) => {
	//Display the top 10 search terms
	const scores = await client.zrevrangeAsync('searchTerms', 0, 9);
	console.log(scores);
	let upperFirstChar = scores.map((element) => {
		return element.charAt(0).toUpperCase() + element.slice(1);
	});

	res.render('shows/topsearches', { scores: upperFirstChar });
});

router.get('/show/:id', async (req, res) => {
	//lets check to see if we have the show detail page for this show in cache
	let exists = await client.existsAsync(req.params.id);
	if (exists) {
		//if we do have it in cache, send the raw html from cache
		console.log('Show in Cache');
		let showDetailPage = await client.getAsync(req.params.id);
		console.log('Sending HTML from Redis....');
		res.send(showDetailPage);
	} else {
		//if the show is not in cache, then query the API for the show, render handlebars and
		//cache the HTML and send raw HTML in response
		console.log('Show not in cache');
		let { data } = await axios.get(`http://api.tvmaze.com/shows/${req.params.id}`);
		res.render('shows/show', { show: data }, async (err, html) => {
			await client.setAsync(req.params.id, html);
			res.send(html);
		});
	}
});

router.post('/search', async (req, res) => {
	const searchQuery = req.body.searchTerm;
	if (!searchQuery.trim()) {
		res.render('shows/searchresults', { hasError: true });
		return;
	}
	//first let's check to see if it's in the search term list
	let existsInScoreBoard = await client.zrankAsync('searchTerms', searchQuery.toLowerCase());
	if (existsInScoreBoard !== null) {
		console.log('found search term in sorted set');
		// It has been found in the list so let's increment it by 1
		await client.zincrby('searchTerms', 1, searchQuery.toLowerCase());
	} else {
		console.log('search term in sorted set NOT found');
		//If the search term is not found in the list, then we know to add it
		await client.zaddAsync('searchTerms', 1, searchQuery.toLowerCase());
	}

	//check to see if we have results cached for that search term already
	let exists = await client.existsAsync(searchQuery.toLowerCase());
	if (exists) {
		console.log('Results  in cache');
		//if we do, then send that to the client
		let searchResults = await client.getAsync(searchQuery.toLowerCase());
		console.log('Sending HTML from Redis....');
		res.send(searchResults);
	} else {
		//if we don't, then query the api, render the results and cache them
		console.log('Results not in cache');
		let { data } = await axios.get(`http://api.tvmaze.com/search/shows?q=${req.body.searchTerm}`);
		res.render('shows/searchresults', { shows: data }, async (err, html) => {
			await client.setAsync(searchQuery.toLowerCase(), html);
			res.send(html);
		});
	}
});

module.exports = router;
