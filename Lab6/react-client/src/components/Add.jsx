import React from 'react';
import '../App.css';

import {useQuery, useMutation} from '@apollo/client';
//Import the file where my query constants are defined
import queries from '../queries.js';
import helpers from '../helpers.js';

function Add(props) {
    const [addArtist] = useMutation(queries.ADD_ARTIST, {
        onError: (error) => {
            alert(`Error adding artist: ${error.message}`);
        },
        update(cache, {data: {addArtist}}) {
            const {artists} = cache.readQuery({
                query: queries.GET_ARTISTS
            });
            cache.writeQuery({
                query: queries.GET_ARTISTS,
                data: {artists: [...artists, addArtist]}
            });
        }
    });

    const [addAlbum] = useMutation(queries.ADD_ALBUM, {
        onError: (error) => {
            alert(`Error adding album: ${error.message}`);
        },
        update(cache, {data: {addAlbum}}) {
            const {albums} = cache.readQuery({
                query: queries.GET_ALBUMS
            });
            cache.writeQuery({
                query: queries.GET_ALBUMS,
                data: {albums: [...albums, addAlbum]}
            });
        }
    });

    const [addCompany] = useMutation(queries.ADD_RECORD_COMPANY, {
        onError: (error) => {
            alert(`Error adding record company: ${error.message}`);
        },
        update(cache, {data: {addCompany}}) {
            const {recordCompanies} = cache.readQuery({
                query: queries.GET_RECORD_COMPANIES
            });
            cache.writeQuery({
                query: queries.GET_RECORD_COMPANIES,
                data: {recordCompanies: [...recordCompanies, addCompany]}
            });
        }
    });

    const {loading: artistLoading, error: artistError, data: artistData} = useQuery(queries.GET_ARTISTS);
    const {loading: companyLoading, error: companyError, data: recordCompanyData} = useQuery(queries.GET_RECORD_COMPANIES);

    if (artistLoading || companyLoading) {
        return <div>loading...</div>;
    }

    if (artistError || companyError) {
        return <div>{artistError ? artistError.message : companyError.message}</div>;
    }

    const artists = artistData.artists;
    const recordCompanies = recordCompanyData.recordCompanies;
    const onSubmitArtist = (e) => {
        e.preventDefault();
        let name = document.getElementById('artistName').value;
        let dateFormed = document.getElementById('dateFormed').value;
        let members = document.getElementById('members').value.split(',').map(member => member.trim());

        // Check name input
        if (!helpers.validName(name)) {
            alert('Invalid name input.');
            return;
        }

        // Check date input
        if (!helpers.validDate(dateFormed)) {
            alert('Invalid date format. Must be in one of the following formats: MM/DD/YYYY, MM/D/YYYY, M/DD/YYYY, or M/D/YYYY.');
            return;
        }

        // Check members input
        if (!helpers.validMembers(members)) {
            alert('Invalid members input. Member names should only contain letters and each member should be on a separate line.');
            return;
        }

        addArtist({
            variables: {
                name: name,
                dateFormed: dateFormed,
                members: members
            }
        });

        document.getElementById('add-artist').reset();
        alert('Artist Added');
        props.closeAddFormState();
    };

    const onSubmitRecordCompany = (e) => {
        e.preventDefault();
        let name = document.getElementById('recordCompanyName').value;
        let foundedYear = document.getElementById('foundedYear').value;
        let country = document.getElementById('country').value;


        // Check name input
        if (!helpers.validCompanyName(name)) {
            alert('Invalid name input.');
            return;
        }

        if (!foundedYear || !parseInt(foundedYear)) {
            alert('Please enter a four-digit year between 1900 and 2024.');
            return;
        }

        foundedYear = parseInt(foundedYear);
        // Check founded year input
        if (!helpers.validFoundedYear(foundedYear)) {
            alert('Please enter a four-digit year between 1900 and 2024.');
            return;
        }

        // Check country input
        if (!helpers.validCountry(country)) {
            alert('Invalid country input.');
            return;
        }

        addCompany({
            variables: {
                name: name,
                foundedYear: parseInt(foundedYear),
                country: country
            }
        });

        document.getElementById('add-record-company').reset();
        alert('Record Company Added');
        props.closeAddFormState();
    };

    const onSubmitAlbum = (e) => {
        e.preventDefault();
        let title = document.getElementById('title').value;
        let releaseDate = document.getElementById('releaseDate').value;
        let genre = document.getElementById('genre').value;
        let artistId = document.getElementById('artistId').value;
        let recordCompanyId = document.getElementById('recordCompanyId').value;

        // Check title input
        if (!helpers.validTitle(title)) {
            alert('Title input is invalid.')
        }

        // Check date input
        if (!helpers.validDate(releaseDate)) {
            alert('Invalid date format. Must be in one of the following formats: MM/DD/YYYY, MM/D/YYYY, M/DD/YYYY, or M/D/YYYY.');
            return;
        }

        // Check genre
        if (!helpers.validGenre(genre)) {
            alert('Invalid genre. Must be one of the following: "POP",\n' +
                '            "ROCK",\n' +
                '            "HIP_HOP",\n' +
                '            "COUNTRY",\n' +
                '            "JAZZ",\n' +
                '            "CLASSICAL",\n' +
                '            "ELECTRONIC",\n' +
                '            "R_AND_B",\n' +
                '            "INDIE",\n' +
                '            "ALTERNATIVE"');
            return;
        }

        addAlbum({
            variables: {
                title: title,
                releaseDate: releaseDate,
                genre: genre.toUpperCase(),
                artistId: artistId,
                companyId: recordCompanyId
            }
        });

        document.getElementById('add-album').reset();
        alert('Album Added');
        props.closeAddFormState();
    };

    let body = null;
    if (props.type === 'album') {
        body = (
            <div className='card'>
                <form className='form' id='add-album' onSubmit={onSubmitAlbum}>
                    <div className='form-group'>
                        <label>
                            Title:
                            <input id='title' required autoFocus={true} />
                        </label>
                        <br/>
                    </div>
                    <div className='form-group'>
                        <label>
                            Release Date:
                            <input id='releaseDate' required />
                        </label>
                        <br/>
                    </div>
                    <div className='form-group'>
                        <label>
                            Genre:
                            <input id='genre' required autoFocus={true} />
                        </label>
                        <br/>
                    </div>
                    <br />
                    <div className='form-group'>
                        <label>
                            Artist:
                            <select className='form-control' id='artistId'>
                                {artists &&
                                    artists.map((artist) => {
                                        return (
                                            <option key={artist._id} value={artist._id}>
                                                {artist.name}
                                            </option>
                                        );
                                    })}
                            </select>
                        </label>
                    </div>
                    <div className='form-group'>
                        <label>
                            Record Company:
                            <select className='form-control' id='recordCompanyId'>
                                {recordCompanies &&
                                    recordCompanies.map((recordCompany) => {
                                        return (
                                            <option key={recordCompany._id} value={recordCompany._id}>
                                                {recordCompany.name}
                                            </option>
                                        );
                                    })}
                            </select>
                        </label>
                    </div>
                    <br />

                    <button className='button add-button' type='submit'>
                        Add Album
                    </button>
                    <button
                        type='button'
                        className='button cancel-button'
                        onClick={() => {
                            document.getElementById('add-album').reset();
                            props.closeAddFormState();
                        }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        );
    } else if (props.type === 'artist') {
        let name;
        body = (
            <div className='card'>
                <form className='form' id='add-artist' onSubmit={onSubmitArtist}>
                    <div className='form-group'>
                        <label>
                            Artist Name:
                            <input id='artistName' required autoFocus={true} />
                        </label>
                        <br/>
                        <label>
                            Date Formed:
                            <input id='dateFormed' required autoFocus={true} />
                        </label>
                        <br/>
                        <label>
                            Members:
                            <input id='members' placeholder="Separate by commas" required autoFocus={true} />
                        </label>
                    </div>
                    <br />
                    <button className='button' type='submit'>
                        Add Artist
                    </button>
                    <button
                        type='button'
                        className='button'
                        onClick={() => {
                            document.getElementById('add-artist').reset();
                            props.closeAddFormState();
                        }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        );
    } else if (props.type === 'recordCompany') {
        let name;
        body = (
            <div className='card'>
                <form className='form' id='add-record-company' onSubmit={onSubmitRecordCompany}>
                    <div className='form-group'>
                        <label>
                            Record Company Name:
                            <input id='recordCompanyName' required autoFocus={true} />
                        </label>
                        <br />
                        <label>
                            Founded Year:
                            <input id='foundedYear' required autoFocus={true} />
                        </label>
                        <br />
                        <label>
                            Country:
                            <input id='country' required autoFocus={true} />
                        </label>
                        <br />
                    </div>

                    <button className='button' type='submit'>
                        Add Record Company
                    </button>
                    <button
                        type='button'
                        className='button'
                        onClick={() => {
                            document.getElementById('add-record-company').reset();
                            props.closeAddFormState();
                        }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        );
    }
    return <div>{body}</div>;
}

export default Add;