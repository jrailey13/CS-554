const flat = require('flat');
const unflatten = flat.unflatten;
const redis = require('redis');
const client = redis.createClient();

const main = async () => {
  await client.connect();
  let sayHello = await client.set('hello', ' FROM THE OTHER SIIIIIIIIIIDE');
  // await client.expire('hello', 20);
  // let hello = await client.get('hello');
  // console.log(`hello, ${hello}`);

  let doesHelloExist = await client.exists('hello');
  console.log(`doesHelloExist ? ${doesHelloExist === 1}`);

  let doesPikachuExist = await client.exists('pikachu');
  console.log(`doesPikachuExist ? ${doesPikachuExist === 1}`);

  let setResult = await client.set('goodnight', 'moon');
  console.log(setResult);

  let batchResult = await client
    .multi()
    .set('favoriteDrink', 'coffee')
    .set('favoriteFood', 'steak')
    .set('cake', 'is a lie')
    .expire('hello', 20)
    .exec();
  console.log(batchResult);

  let multiResult = await client.mGet([
    'favoriteDrink',
    'favoriteFood',
    'cake',
    'goodnight',
    'hello'
  ]);
  console.log(multiResult);

  let deleteHello = await client.del('hello');
  console.log(deleteHello);

  doesHelloExist = await client.exists('hello');
  console.log(`doesHelloExist ? ${doesHelloExist === 1}`);

  let bio = {
    name: {
      first: 'Patrick',
      last: 'Hill'
    },
    goal: {
      desc: 'TO BE THE VERY BEST, LIKE NO ONE EVER WAS!',
      test: 'TO CATCH THEM IS MY REAL TEST -- ',
      cause: 'TO TRAIN THEM IS MY CAUUUUUSE!'
    },
    hobbies: ['making coffee', 'making low carb recipes', 'soccer'],
    'education.college': {
      name: 'Stevens'
    },
    'hobbiesAsObject[]': {
      0: 'making coffee',
      1: 'making low carb recipes',
      sport: 'Baseball'
    },
    age: 48
  };

  let flatBio = flat(bio);
  console.log(flatBio);
  let hmSetAsyncBio = await client.hSet('bio', flatBio);
  console.log(hmSetAsyncBio);

  const incrAge = await client.hIncrBy('bio', 'age', 1);
  console.log(incrAge);

  const flatBioFromRedis = await client.hGetAll('bio');
  console.log(flatBioFromRedis);

  const remadeBio = unflatten(flatBioFromRedis);
  console.log(remadeBio);

  const jsonBio = JSON.stringify(bio);
  await client.set('patrickJsonBio', jsonBio);

  const jsonBioFromRedis = await client.get('patrickJsonBio');
  const recomposedBio = JSON.parse(jsonBioFromRedis);
  console.log(recomposedBio);

  //This code will ONLY work if you have the RedisJson module installed into redis-server or you use redis-stack-server
  const redisJson = await client.json.set('redisJsonBio', '$', bio);
  console.log(await client.json.get('redisJsonBio'));
  const incAge = await client.json.NUMINCRBY('redisJsonBio', '$.age', 1);
  console.log(await client.json.get('redisJsonBio'));

  //add a new to the object:

  const addKey = await client.json.set('redisJsonBio', '$.favoriteMovies', [
    'Breakfast Club',
    'Hidden Figures',
    'The Goonies'
  ]);

  console.log(await client.json.get('redisJsonBio'));

  const addFavMovie = await client.json.arrAppend(
    'redisJsonBio',
    '$.favoriteMovies',
    'Office Space'
  );

  console.log(await client.json.get('redisJsonBio'));
};

main();
