import {dbConnection, closeConnection} from './config/mongoConnection.js';
import {artists, albums, records, songs} from './config/mongoCollections.js';
import {ObjectId} from "mongodb";

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    const artistCollection = await artists();
    const albumCollection = await albums();
    const recordCompanyCollection = await records();
    const songCollection = await songs();

    // artists
    let brunoMars;
    let maroon5;
    let taylorSwift;

    // albums
    let doowopsAndHooligans;
    let songsAboutJane;
    let nineteenEightyNine;

    // record companies
    let octoneRecords;
    let atlanticRecords;
    let bigMachineRecords;

    let justTheWayYouAre;



    brunoMars = await artistCollection.insertOne({
        _id: new ObjectId(),
        name: 'Bruno Mars',
        dateFormed: new Date().toLocaleDateString(),
        members: ['Bruno Mars'],
        albums: [],
        numOfAlbums: 0
    });

    maroon5 = await artistCollection.insertOne({
        _id: new ObjectId(),
        name: 'Maroon 5',
        dateFormed: new Date().toLocaleDateString(),
        members: ['Adam Levine', 'Jesse Carmichael', 'James Valentine', 'Matt Flynn', 'PJ Flynn', 'Sam Farrar'],
        albums: [],
        numOfAlbums: 0
    });

    taylorSwift = await artistCollection.insertOne({
        _id: new ObjectId(),
        name: 'Taylor Swift',
        dateFormed: new Date().toLocaleDateString(),
        members: ['Taylor Swift'],
        albums: [],
        numOfAlbums: 0
    });

    octoneRecords = await recordCompanyCollection.insertOne({
        _id: new ObjectId(),
        name: "A&M Octone Records",
        foundedYear: 2007,
        country: "United States",
        albums: []
    });

    atlanticRecords = await recordCompanyCollection.insertOne({
        _id: new ObjectId(),
        name: "Atlantic Records",
        foundedYear: 1947,
        country: "United States",
        albums: []
    });

    bigMachineRecords = await recordCompanyCollection.insertOne({
        _id: new ObjectId(),
        name: "Big Machine Records",
        foundedYear: 2005,
        country: "United States",
        albums: []
    });

    // albums
    doowopsAndHooligans = await albumCollection.insertOne({
        _id: new ObjectId(),
        title: "Doo Wops and Hooligans",
        releaseDate: "10/04/2010",
        genre: "POP",
        artistId: brunoMars.insertedId,
        recordCompanyId: atlanticRecords.insertedId,
        songs: []
    });

    // Song
    justTheWayYouAre = await songCollection.insertOne({
        _id: new ObjectId(),
        title: "Just The Way You Are",
        duration: "03:40",
        albumId: doowopsAndHooligans.insertedId
    })

    await closeConnection();
};

main().catch(console.log);