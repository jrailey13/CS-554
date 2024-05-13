import {graphql, GraphQLError} from 'graphql';
import redis from "redis";
import {flatten} from 'flat';

import {
    songs as songCollection,
    artists as artistCollection,
    albums as albumCollection,
    records as recordCollection
} from './config/mongoCollections.js';

import helpers from "./helpers.js";
import {GraphQLScalarType, Kind} from "graphql";
import {ObjectId} from "mongodb";
import { createClient } from "redis";
const client = redis.createClient();
client.connect();


// inspired from https://www.apollographql.com/docs/apollo-server/schema/custom-scalars/
function dateValue(dateString) {
    if (!helpers.validDate(dateString)) {
        throw new GraphQLError('Provided value is not an acceptable date string', {
            extensions: { code: 'BAD_USER_INPUT' },
        });
    }
    dateString = new Date(dateString).toLocaleDateString();

    return dateString;
}

export const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue: dateValue,
        serialize: dateValue,
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return dateValue(ast.value);
            }
            throw new Error('Invalid date string');
        },
    }),
    MusicGenre: {
        POP: "POP",
        ROCK: "ROCK",
        HIP_HOP: "HIP_HOP",
        COUNTRY: "COUNTRY",
        JAZZ: "JAZZ",
        CLASSICAL: "CLASSICAL",
        ELECTRONIC: "ELECTRONIC",
        R_AND_B: "R_AND_B",
        INDIE: "INDIE",
        ALTERNATIVE: "ALTERNATIVE"
    },
    Query: {
        artists: async() => {
            const exists = await client.exists('artists');

            if (exists) {
                const cachedArtists = await client.get('artists');
                return JSON.parse(cachedArtists);
            } else {
                const artists = await artistCollection();
                const allArtists = await artists.find({}).toArray();
                if (allArtists.length === 0) {
                    throw new GraphQLError("No artists found in database", {
                        extensions: {code: "NOT_FOUND"}
                    });
                }

                await client.setEx('artists', 3600, JSON.stringify(allArtists)); // Store artists as JSON string

                return allArtists;
            }
        },
        albums: async() => {
            let exists = await client.exists('albums');
            if (exists) {
                const cachedAlbums = await client.get('albums');
                return JSON.parse(cachedAlbums);
            } else {
                const albums = await albumCollection();
                const allAlbums = await albums.find({}).toArray();
                if (allAlbums.length === 0) {
                    throw new GraphQLError("No albums found in database", {
                        extensions: {code: "NOT_FOUND"}
                    });
                }

                await client.setEx('albums', 3600, JSON.stringify(allAlbums));
                return allAlbums;
            }
        },
        recordCompanies: async() => {
            let exists = await client.exists('recordCompanies');
            if (exists) {
                const cachedRecordComps = await client.get('recordCompanies');
                return JSON.parse(cachedRecordComps);
            } else {
                const recordComps = await recordCollection();
                const allRecordComps = await recordComps.find({}).toArray();
                if (allRecordComps.length === 0) {
                    throw new GraphQLError("No record companies found in database", {
                        extensions: {code: "NOT_FOUND"}
                    });
                }

                await client.setEx('recordCompanies', 3600, JSON.stringify(allRecordComps));
                return allRecordComps;
            }
        },
        getArtistById: async(_, args) => {
            if (!helpers.validId(args._id)) {
                console.log("Invalid ID")
                throw new GraphQLError(`Invalid object ID`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }
            let exists = await client.exists(args._id);
            if (exists) {
                const cachedArtist = await client.get(args._id);
                return JSON.parse(cachedArtist);
            } else {
                const artists = await artistCollection();
                const artist = await artists.findOne({_id: new ObjectId(args._id)});
                if (!artist) {
                    throw new GraphQLError(
                        `Could not find artist with an ID of ${args._id}`,
                        {
                            extensions: {code: 'NOT_FOUND'}
                        }
                    );
                }
                await client.set(args._id.toString(), JSON.stringify(flatten(artist)));
                return artist;
            }
        },
        getAlbumById: async(_, args) => {
            if (!helpers.validId(args._id)) {
                console.log("Invalid ID")
                throw new GraphQLError(`Invalid object ID`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }
            let exists = await client.exists(args._id.toString());
            if (exists) {
                const cachedAlbum = await client.get(args._id.toString());
                return JSON.parse(cachedAlbum);
            } else {
                const albums = await albumCollection();
                const album = await albums.findOne({_id: new ObjectId(args._id)});
                if (!album) {
                    throw new GraphQLError(
                        `Could not find album with an ID of ${args._id}`,
                        {
                            extensions: {code: 'NOT_FOUND'}
                        }
                    );
                }
                await client.set(args._id.toString(), JSON.stringify(album));
                return album;
            }
        },
        getCompanyById: async(_, args) => {
            if (!helpers.validId(args._id)) {
                console.log("Invalid ID")
                throw new GraphQLError(`Invalid object ID`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }
            let exists = await client.exists(args._id.toString());
            if (exists) {
                const cachedRecordComp = await client.get(args._id.toString());
                return JSON.parse(cachedRecordComp);
            } else {
                const recordComps = await recordCollection();
                const recordComp = await recordComps.findOne({_id: new ObjectId(args._id)});
                if (!recordComp) {
                    throw new GraphQLError(
                        `Could not find record company with an ID of ${args._id}`,
                        {
                            extensions: {code: 'NOT_FOUND'}
                        }
                    );
                }
                await client.set(args._id.toString(), JSON.stringify(recordComp));
                return recordComp;
            }
        },
        getSongsByArtistId: async(_, args) => {
            if (!helpers.validId(args.artistId.toString())) {
                throw new GraphQLError(`Invalid object ID`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }
            let exists = await client.exists("songs:" + args.artistId.toString());
            if (exists) {
                const cachedSongs = await client.lRange("songs:" + args.artistId.toString(), 0, -1);
                return JSON.parse(cachedSongs);
            } else {
                const artists = await artistCollection();

                const artist = await artists.findOne({ _id: new ObjectId(args.artistId) });
                if (!artist) {
                    throw new GraphQLError(`Artist not found for ID ${args.artistId}`, {
                        extensions: { code: 'NOT_FOUND' }
                    });
                }

                const albums = await artists.aggregate([
                    { $match: { _id: new ObjectId(args.artistId) } },
                    { $lookup: { from: "albums", localField: "_id", foreignField: "artistId", as: "albums" } },
                    { $unwind: "$albums" }, // Unwind the albums array
                    { $replaceRoot: { newRoot: "$albums" } } // Replace the root with the unwound albums
                ]).toArray();

                const songIds = albums.flatMap(album => album.songs);

                const songs = await songCollection();
                const songObjects = await songs.find({_id: {$in: songIds}}).toArray();

                await client.lPush("songs:" + args.artistId.toString(), JSON.stringify(songObjects));
                await client.expire("songs:" + args.artistId.toString(), 3600);

                return songObjects;
            }
        },
        albumsByGenre: async(_, args) => {
            if (!args.genre) {
                throw new GraphQLError(`A genre must be provided`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }

            if (!helpers.validGenre(args.genre)) {
                throw new GraphQLError(`Invalid genre`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }

            let exists = await client.exists(args.genre.toLowerCase());
            if (exists) {
                const cachedAlbums = await client.lRange(args.genre.toLowerCase(), 0, -1);
                return JSON.parse(cachedAlbums);
            } else {
                const albums = await albumCollection();
                const genreAlbums = await albums.find({genre: args.genre.toUpperCase()}).toArray();
                if (genreAlbums.length === 0) {
                    throw new GraphQLError(
                        `Could not find albums with a genre of ${args.genre}`,
                        {
                            extensions: {code: 'NOT_FOUND'}
                        }
                    );
                }
                await client.lPush(args.genre.toLowerCase(), JSON.stringify(genreAlbums));
                await client.expire(args.genre.toLowerCase(), 3600);
                return genreAlbums;
            }
        },
        companyByFoundedYear: async(_, args) => {
            if (!args.min || !args.max) {
                throw new GraphQLError(`Both min and max years must be provided`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }
            if (!Number.isInteger(args.min) && !Number.isInteger(args.max)) {
                throw new GraphQLError(`Min and max year parameters must be integers`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }

            if (args.max <= args.min) {
                throw new GraphQLError(`Max year parameter must be greater than min year parameter`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }

            if (args.max > 2024 || args.min < 1900) {
                throw new GraphQLError(`Year parameters must be between 1900 and 2024`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }

            let exists = await client.exists(args.min.toString()+":"+args.max.toString());
            if (exists) {
                const cachedRecords = await client.lRange(args.min.toString()+":"+args.max.toString(), 0, -1);
                return JSON.parse(cachedRecords);
            } else {
                const recordComps = await recordCollection();
                const recordCompList = await recordComps.find({foundedYear: {$gte: args.min, $lte: args.max}}).toArray();
                if (!recordCompList) {
                    throw new GraphQLError(
                        `Could not find records between years of ${args.min} and ${args.max}`,
                        {
                            extensions: {code: 'NOT_FOUND'}
                        }
                    );
                }
                await client.lPush(args.min.toString()+":"+args.max.toString(), JSON.stringify(recordCompList));
                await client.expire(args.min.toString()+":"+args.max.toString(), 3600);
                return recordCompList;
            }
        },
        searchArtistByArtistName: async(_, args) => {
            if (!args.searchTerm) {
                throw new GraphQLError(`Search term must be provided`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }
            if (!args.searchTerm.trim()) {
                throw new GraphQLError(`Search term cannot be an empty string or string with spaces`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }

            let exists = await client.exists(args.searchTerm.toLowerCase());
            if (exists) {
                const cachedArtistList = await client.lRange(args.searchTerm.toLowerCase(), 0, -1);
                return JSON.parse(cachedArtistList);
            } else {
                const artists = await artistCollection();
                const artistList = await artists.find({name: {$regex: args.searchTerm.toLowerCase(), $options: 'i'}}).toArray();
                if (!artistList) {
                    throw new GraphQLError(
                        `Could not find artists with ${args.searchTerm} in their name`,
                        {
                            extensions: {code: 'NOT_FOUND'}
                        }
                    );
                }
                await client.lPush(args.searchTerm.toLowerCase(), JSON.stringify(artistList));
                await client.expire(args.searchTerm.toLowerCase(), 3600);
                return artistList;
            }
        },
        getSongById: async (_, args) => {
            if (!helpers.validId(args._id)) {
                throw new GraphQLError(`Invalid object ID`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }
            let exists = await client.exists(args._id.toString());
            if (exists) {
                const cachedSong = await client.get(args._id.toString());
                return JSON.parse(cachedSong);
            } else {
                const songs = await songCollection();
                const song = await songs.findOne({_id: new ObjectId(args._id)});
                if (!song) {
                    throw new GraphQLError(
                        `Could not find song with an ID of ${args._id}`,
                        {
                            extensions: {code: 'NOT_FOUND'}
                        }
                    );
                }
                await client.set(args._id.toString(), JSON.stringify(song));
                return song;
            }
        },
        getSongsByAlbumId: async (_, args) => {
            if (!helpers.validId(args._id)) {
                throw new GraphQLError(`Invalid object ID`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }

            let exists = await client.exists("songsFromAlbum:"+args._id.toString());
            if (exists) {
                const cachedSongs = await client.get("songsFromAlbum:"+args._id.toString());
                return JSON.parse(cachedSongs);
            } else {
                const songs = await songCollection();
                const songList = await songs.find({albumId: new ObjectId(args._id)}).toArray();
                if (songList.length === 0) {
                    throw new GraphQLError(
                        `Could not find songs with an album ID of ${args._id}`,
                        {
                            extensions: {code: 'NOT_FOUND'}
                        }
                    );
                }
                await client.set("songsFromAlbum:"+args._id.toString(), JSON.stringify(songList));
                return songList;
            }

        },
        searchSongByTitle: async (_, args) => {
            if (!args.searchTitleTerm) {
                throw new GraphQLError(`Search title term must be provided`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }
            if (!args.searchTitleTerm.trim()) {
                throw new GraphQLError(`Search title term cannot be an empty string or string with spaces`, {
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }

            let exists = await client.exists(args.searchTitleTerm.toLowerCase());
            if (exists) {
                const cachedSongList = await client.lRange(args.searchTitleTerm.toLowerCase(), 0, -1);
                return JSON.parse(cachedSongList);
            } else {
                const songs = await songCollection();
                const songList = await songs.find({title: {$regex: args.searchTitleTerm.toLowerCase(),
                        $options: 'i'}}).toArray();
                if (!songList) {
                    throw new GraphQLError(
                        `Could not find artists with ${args.searchTerm} in their name`,
                        {
                            extensions: {code: 'NOT_FOUND'}
                        }
                    );
                }
                await client.lPush(args.searchTitleTerm.toLowerCase(), JSON.stringify(songList));
                await client.expire(args.searchTitleTerm.toLowerCase(), 3600);
                return songList;
            }
        }
    },
    Album: {
        artist: async (parentValue) => {
            const artists = await artistCollection();
            const artist = await artists.findOne({
                _id: new ObjectId(parentValue.artistId)
            });
            return artist;
        },
        recordCompany: async (parentValue) => {
            const recordCompanies = await recordCollection();
            const recordCompany = await recordCompanies.findOne({
                _id: new ObjectId(parentValue.recordCompanyId)
            });
            return recordCompany;
        },
        songs: async (parentValue) => {
            const songs = await songCollection();
            const songList = await songs.find({
                albumId: new ObjectId(parentValue._id)
            }).toArray();
            return songList;
        }
    },
    Artist: {
        albums: async (parentValue) => {
            const albums = await albumCollection();
            const albumList = await albums.find({
                artistId: new ObjectId(parentValue._id)
            }).toArray();
            return albumList;
        },
        numOfAlbums: async (parentValue) => {
            const albums = await albumCollection();
            const numAlbums = await albums.count({
                artistId: new ObjectId(parentValue._id)
            });
            return numAlbums;
        }
    },
    RecordCompany: {
        albums: async (parentValue) => {
            const albums = await albumCollection();
            const albumList = await albums.find({
                recordCompanyId: new ObjectId(parentValue._id)
            }).toArray();
            return albumList;
        },
        numOfAlbums: async (parentValue) => {
            const albums = await albumCollection();
            const numAlbums = await albums.count({
                recordCompanyId: new ObjectId(parentValue._id)
            });
            return numAlbums;
        },
    },
    Song: {
        // Fill in
        albumId: async (parentValue) => {
            const albums = await albumCollection();
            const album = await albums.findOne({
                _id: new ObjectId(parentValue.albumId)
            });
            return album;
        }
    },
    Mutation: {
        addArtist: async (_, args) => {
            if (!helpers.validName(args.name)) {
                throw new GraphQLError('Name parameter is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            console.log(args.date_formed)
            if (!helpers.validDate(args.date_formed)) {
                throw new GraphQLError('Date formed parameter is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            if (!helpers.validMembers(args.members)) {
                throw new GraphQLError('Members input is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            const newArtist = {
                _id: new ObjectId(),
                name: args.name,
                dateFormed: args.date_formed,
                members: args.members,
                albums: [],
            }
            const artists = await artistCollection();
            let insertedArtist = await artists.insertOne(newArtist);
            if (!insertedArtist.acknowledged || !insertedArtist.insertedId) {
                throw new GraphQLError(`Could not add artist`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }

            await client.set(newArtist._id.toString(), JSON.stringify(newArtist));
            await client.del("artists");
            return newArtist;
        },
        editArtist: async (_, args) => {
            if (!helpers.validId(args._id)) {
                throw new GraphQLError('Invalid object ID', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            if (!args.name && !args.date_formed && !args.members) {
                throw new GraphQLError('At least one field to edit must be provided', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            let artistObj = {};

            if (args.name) {
                if (!helpers.validName(args.name)) {
                    throw new GraphQLError('Name parameter is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
                }
                artistObj.name = args.name;
            }

            if (args.date_formed) {
                if (!helpers.validDate(args.date_formed)) {
                    throw new GraphQLError('Date formed parameter is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
                }
                artistObj.dateFormed = args.date_formed;
            }

            if (args.members) {
                if (!helpers.validMembers(args.members)) {
                    throw new GraphQLError('Members input is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
                }
                artistObj.members = args.members;
            }


            const artists = await artistCollection();
            let artistToUpdate = await artists.findOneAndUpdate({_id: new ObjectId(args._id)}, {$set: artistObj},
                {returnDocument: "after"});

            await client.set(artistToUpdate._id.toString(), JSON.stringify(artistToUpdate));
            await client.del('artists')
            return artistToUpdate;
            },
        removeArtist: async (_, args) => {
            if (!helpers.validId(args._id)) {
                throw new GraphQLError('Invalid object ID', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            const artists = await artistCollection();
            const removedArtist = await artists.findOneAndDelete({_id: new ObjectId(args._id)});
            if (!removedArtist) {
                throw new GraphQLError(`Could not remove the artist in database`, {
                    extensions: {code: 'NOT_FOUND'}
                });
            }

            const albums = await albumCollection();

            if (removedArtist.albums.length > 0) {
                await albums.deleteMany({artistId: removedArtist._id});
                for (let album of removedArtist.albums) {
                    if (await client.exists(album._id.toString())) {
                        await client.del(album._id.toString());
                    }
                }
                await client.del('albums');
            }

            if (await client.exists(removedArtist._id.toString())) {
                await client.del(removedArtist._id.toString());
            }
            await client.del('artists');

            return removedArtist;
        },
        addCompany: async (_, args) => {
            if (!helpers.validCompanyName(args.name)) {
                throw new GraphQLError('Name parameter is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            if (!helpers.validFoundedYear(args.founded_year)) {
                throw new GraphQLError('Founded year parameter is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            if (!helpers.validCountry(args.country)) {
                throw new GraphQLError('Country is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            const newCompany = {
                _id: new ObjectId(),
                name: args.name,
                foundedYear: args.founded_year,
                country: args.country,
                albums: [],
            }
            const companies = await recordCollection();
            let insertedCompany = await companies.insertOne(newCompany);
            if (!insertedCompany.acknowledged || !insertedCompany.insertedId) {
                throw new GraphQLError(`Could not add record company`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }

            await client.set(insertedCompany.insertedId.toString(), JSON.stringify(insertedCompany));
            await client.del('recordCompanies')
            return newCompany;
        },
        editCompany: async (_, args) => {
            if (!helpers.validId(args._id)) {
                throw new GraphQLError('Invalid object ID', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            if (!args.name && !args.founded_year && !args.country) {
                throw new GraphQLError('At least one field to edit must be provided', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            let companyObj = {};

            if (args.name) {
                if (!helpers.validCompanyName(args.name)) {
                    throw new GraphQLError('Name parameter is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
                }
                companyObj.name = args.name;
            }

            if (args.founded_year) {
                if (!helpers.validFoundedYear(args.founded_year)) {
                    throw new GraphQLError('Date formed parameter is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
                }
                companyObj.foundedYear = args.founded_year;
            }

            if (args.country) {
                if (!helpers.validCountry(args.country)) {
                    throw new GraphQLError('Country is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
                }
                companyObj.country = args.country;
            }

            const companies = await recordCollection();
            let companyToUpdate = await companies.findOneAndUpdate({_id: new ObjectId(args._id)}, {$set: companyObj},
                {returnDocument: "after"});

            await client.set(companyToUpdate._id.toString(), JSON.stringify(companyToUpdate));
            await client.del('recordCompanies')
            return companyToUpdate;
        },
        removeCompany: async (_, args) => {
            if (!helpers.validId(args._id)) {
                throw new GraphQLError('Invalid object ID', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            const companies = await recordCollection();
            const removedCompany = await companies.findOneAndDelete({_id: new ObjectId(args._id)});
            if (!removedCompany) {
                throw new GraphQLError(`Could not remove the record company in database`, {
                    extensions: {code: 'NOT_FOUND'}
                });
            }

            const albums = await albumCollection();
            if (removedCompany.albums.length > 0) {
                await albums.deleteMany({recordCompanyId: removedCompany._id});
                for (let album of removedCompany.albums) {
                    if (await client.exists(album._id.toString())) {
                        await client.del(album._id.toString());
                    }
                }
                await client.del('albums');
            }

            if (await client.exists(removedCompany._id.toString())) {
                await client.del(removedCompany._id.toString());
            }
            await client.del('recordCompanies');

            return removedCompany;
        },
        addAlbum: async (_, args) => {
            if (!helpers.validTitle(args.title)) {
                throw new GraphQLError('Title parameter is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            if (!helpers.validDate(args.releaseDate)) {
                throw new GraphQLError('Release date parameter is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            if (!helpers.validGenre(args.genre)) {
                throw new GraphQLError('Genre is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            if (!helpers.validId(args.artistId.toString())) {
                throw new GraphQLError('Artist ID is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
            }
            const artists = await artistCollection();
            let artist = await artists.findOne({_id: new ObjectId(args.artistId)});
            if (!artist) {
                throw new GraphQLError(
                    `Could not find artist with an ID of ${args.artistId}`,
                    {
                        extensions: {code: 'BAD_USER_INPUT'}
                    }
                );
            }

            // Check release date
            if (new Date(args.releaseDate) < new Date(artist.dateFormed)) {
                throw new GraphQLError(
                    'Album release date cannot be before the date the artist was formed',
                    {extensions: {code: 'BAD_USER_INPUT'}}
                );
            }

            if (!helpers.validId(args.companyId.toString())) {
                throw new GraphQLError('Record company ID is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
            }
            const recordCompanies = await recordCollection();
            let recordCompany = await recordCompanies.findOne({_id: new ObjectId(args.companyId)});
            if (!recordCompany) {
                throw new GraphQLError(
                    `Could not find album with a record company ID of ${args.companyId}`,
                    {
                        extensions: {code: 'BAD_USER_INPUT'}
                    }
                );
            }

            const newAlbum = {
                _id: new ObjectId(),
                title: args.title,
                releaseDate: args.releaseDate,
                genre: args.genre,
                artistId: new ObjectId(args.artistId),
                recordCompanyId: new ObjectId(args.companyId),
                songs: []
            }
            const albums = await albumCollection();
            let insertedAlbum = await albums.insertOne(newAlbum);
            if (!insertedAlbum.acknowledged || !insertedAlbum.insertedId) {
                throw new GraphQLError(`Could not add album`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }

            await client.set(newAlbum._id.toString(), JSON.stringify(newAlbum));
            await client.del('albums');
            await client.del('artists');
            await client.del('recordCompanies');

            await artists.updateOne({_id: new ObjectId(args.artistId)}, {$push: {albums: new ObjectId(newAlbum._id)}});
            await recordCompanies.updateOne({_id: new ObjectId(args.companyId)}, {$push: {albums: new ObjectId(newAlbum._id)}});

            return newAlbum;
            },
        editAlbum: async (_, args) => {
            if (!helpers.validId(args._id)) {
                throw new GraphQLError('Invalid object ID', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            if (!args.title && !args.releaseDate && !args.genre && !args.songs && !args.artistId && !args.companyId) {
                throw new GraphQLError('At least one field to edit must be provided', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            let albumObj = {};

            if (args.title) {
                if (!helpers.validTitle(args.title)) {
                    throw new GraphQLError('Title parameter is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
                }
                albumObj.title = args.title;
            }

            if (args.releaseDate) {
                if (!helpers.validDate(args.releaseDate)) {
                    throw new GraphQLError('Release date parameter is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
                }
                albumObj.releaseDate = args.releaseDate;
            }

            if (args.genre) {
                if (!helpers.validGenre(args.genre)) {
                    throw new GraphQLError('Genre is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
                }
                albumObj.genre = args.genre;
            }

            const artists = await artistCollection();
            if (args.artistId) {
                if (!helpers.validId(args.artistId)) {
                    throw new GraphQLError('Artist ID is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
                }
                let artist = await artists.findOne({_id: new ObjectId(args.artistId)});
                if (!artist) {
                    throw new GraphQLError(
                        `Could not find artist with an ID of ${args.artistId}`,
                        {
                            extensions: {code: 'BAD_USER_INPUT'}
                        }
                    );
                }

                // Check release date
                if (new Date(args.releaseDate) < new Date(artist.dateFormed)) {
                    throw new GraphQLError(
                        'Album release date cannot be before the date the artist was formed',
                        {extensions: {code: 'BAD_USER_INPUT'}}
                    );
                }
                albumObj.artistId = new ObjectId(args.artistId);
            }


            const recordCompanies = await recordCollection();
            if (args.companyId) {
                if (!helpers.validId(args.companyId)) {
                    throw new GraphQLError('Record company ID is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
                }
                let recordCompany = await recordCompanies.findOne({_id: new ObjectId(args.companyId)});
                if (!recordCompany) {
                    throw new GraphQLError(
                        `Could not find album with a record company ID of ${args.companyId}`,
                        {
                            extensions: {code: 'BAD_USER_INPUT'}
                        }
                    );
                }

                // Check release date
                if (new Date(args.releaseDate) < new Date(recordCompany.founded_year)) {
                    throw new GraphQLError(
                        'Album release date cannot be before the date the artist was formed',
                        {extensions: {code: 'BAD_USER_INPUT'}}
                    );
                }

                albumObj.recordCompanyId = new ObjectId(args.companyId);
            }

            const albums = await albumCollection();
            let albumToUpdate = await albums.findOneAndUpdate({_id: new ObjectId(args._id)}, {$set: albumObj}, {returnDocument: "after"});
            if (!albumToUpdate) {
                throw new GraphQLError(`Could not update the album in database`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }

            await artists.updateOne({_id: new ObjectId(albumToUpdate.artistId)}, {$pull: {albums: new ObjectId(albumToUpdate._id)}});
            await artists.updateOne({_id: new ObjectId(args.artistId)}, {$push: {albums: new ObjectId(albumToUpdate._id)}});

            await recordCompanies.updateOne({_id: new ObjectId(albumToUpdate.recordCompanyId)}, {$pull: {albums: new ObjectId(albumToUpdate._id)}});
            await recordCompanies.updateOne({_id: new ObjectId(args.companyId)}, {$push: {albums: new ObjectId(albumToUpdate._id)}});

            await client.set(albumToUpdate._id.toString(), JSON.stringify(albumToUpdate));
            await client.del('albums')
            await client.del('artists');
            await client.del('recordCompanies');

            return albumToUpdate;
            },
        removeAlbum: async (_, args) => {
            if (!helpers.validId(args._id)) {
                throw new GraphQLError('Invalid object ID', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            const albums = await albumCollection();
            const removedAlbum = await albums.findOneAndDelete({_id: new ObjectId(args._id)});
            if (!removedAlbum) {
                throw new GraphQLError(`Could not remove the album in database`, {
                    extensions: {code: 'NOT_FOUND'}
                });
            }

            const artists = await artistCollection();
            await artists.updateOne({_id: new ObjectId(removedAlbum.artistId)}, {$pull: {albums: new ObjectId(args._id)}});
            const recordCompanies = await recordCollection();
            await recordCompanies.updateOne({_id: new ObjectId(removedAlbum.recordCompanyId)}, {$pull: {albums: new ObjectId(args._id)}});

            const songs = await songCollection();
            await songs.deleteMany({albumId: removedAlbum._id});

            await client.del(removedAlbum._id.toString());
            await client.del('albums');
            await client.del('artists');
            await client.del('recordCompanies')

            return removedAlbum;
        },
        addSong: async(_, args) => {
            if (!helpers.validTitle(args.title)) {
                throw new GraphQLError('Title parameter is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            if (!helpers.validDuration(args.duration)) {
                throw new GraphQLError('Duration parameter is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            if (!helpers.validId(args.albumId)) {
                throw new GraphQLError('Album Id is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            const albums = await albumCollection();
            const album = albums.findOne({_id: new ObjectId(args.albumId)});
            if (!album) {throw new GraphQLError(`Could not find album with an ID of ${args.albumId}`, {
                            extensions: {code: 'BAD_USER_INPUT'}})
            }

            const newSong = {
                _id: new ObjectId(),
                title: args.title,
                duration: args.duration,
                albumId: new ObjectId(args.albumId),
            }

            const songs = await songCollection();
            let insertedSong = await songs.insertOne(newSong);
            if (!insertedSong.acknowledged || !insertedSong.insertedId) {
                throw new GraphQLError(`Could not add song`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }

            await client.set(newSong._id.toString(), JSON.stringify(newSong));
            await client.del('albums');

            await albums.updateOne({_id: new ObjectId(args.albumId)}, {$push: {songs: new ObjectId(newSong._id)}});

            return newSong;
        },
        editSong: async(_, args) => {
            if (!helpers.validId(args._id)) {
                throw new GraphQLError('Invalid object ID', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            if (!args.title && !args.duration && !args.albumId) {
                throw new GraphQLError('At least one field to edit must be provided', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            let songObj = {};

            if (args.title) {
                if (!helpers.validTitle(args.title)) {
                    throw new GraphQLError('Title parameter is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
                }
                songObj.title = args.title;
            }

            if (args.duration) {
                if (!helpers.validDuration(args.duration)) {
                    throw new GraphQLError('Duration parameter is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
                }
                songObj.duration = args.duration;
            }

            const albums = await albumCollection();
            if (args.albumId) {
                if (!helpers.validId(args.albumId)) {
                    throw new GraphQLError('Album id is invalid', {extensions: {code: 'BAD_USER_INPUT'}})
                }
                let album = await albums.findOne({_id: new ObjectId(args.albumId)});
                if (!album) {
                    throw new GraphQLError(
                        `Could not find album with an ID of ${args.albumId}`,
                        {
                            extensions: {code: 'BAD_USER_INPUT'}
                        }
                    );
                }
                songObj.albumId = new ObjectId(args.albumId);
            }

            const songs = await songCollection();
            let songToUpdate = await songs.findOneAndUpdate({_id: new ObjectId(args._id)}, {$set: songObj}, {returnDocument: "after"});
            if (!songToUpdate) {
                throw new GraphQLError(`Could not update the song in database`, {
                    extensions: {code: 'INTERNAL_SERVER_ERROR'}
                });
            }

            console.log(songObj);

            await albums.updateOne({_id: new ObjectId(songToUpdate.albumId)}, {$pull: {songs: new ObjectId(songToUpdate._id)}});
            await albums.updateOne({_id: new ObjectId(args.albumId)}, {$push: {songs: new ObjectId(songToUpdate._id)}});

            await client.set(songToUpdate._id.toString(), JSON.stringify(songToUpdate));
            await client.del('albums')

            return songToUpdate;
        },
        removeSong: async(_, args) => {
            if (!helpers.validId(args._id)) {
                throw new GraphQLError('Invalid object ID', {extensions: {code: 'BAD_USER_INPUT'}})
            }

            const songs = await songCollection();
            const removedSong = await songs.findOneAndDelete({_id: new ObjectId(args._id)});
            if (!removedSong) {
                throw new GraphQLError(`Could not remove the song in database`, {
                    extensions: {code: 'NOT_FOUND'}
                });
            }

            const albums = await albumCollection();
            await albums.updateOne({_id: new ObjectId(removedSong.albumId)}, {$pull: {songs: new ObjectId(args._id)}});


            await client.del(removedSong._id.toString());
            await client.del('albums');

            return removedSong;
        }
    }
}