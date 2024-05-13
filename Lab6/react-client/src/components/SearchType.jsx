import React, { useState } from 'react';

import SearchResult from './SearchResult';
import helpers from "../helpers.js";

function SearchType() {
    const [searchType, setSearchType] = useState(null);
    const [searchParams, setSearchParams] = useState({
        searchTerm: "",
        minYear: 1900,
        maxYear: 2024
    });

    const handleButtonClick = (type) => {
        setSearchType(type);
    };

    const onAlbumSearch = (e) => {
        e.preventDefault();

        const searchTerm = document.getElementById('genre').value;

        if (!helpers.validGenre(searchTerm)) {
            alert('Genre must be one of the following values: Pop, Rock, Hip_hop, Country, Jazz, Classical, Electronic, R_and_B, Indie, or Alternative');
            return;
        }

        setSearchParams({searchTerm: searchTerm, minYear: 1900, maxYear: 2024});
    };

    const onCompanySearch = (e) => {
        e.preventDefault();

        const minYear = parseInt(document.getElementById('minYear').value);
        const maxYear = parseInt(document.getElementById('maxYear').value);

        if (!helpers.validFoundedYear(minYear)) {
            alert('Min year cannot be prior to 1900.');
            return;
        }

        if (!helpers.validFoundedYear(maxYear)) {
            alert('Max year cannot be after 2024');
            return;
        }

        if (minYear > maxYear) {
            alert('Min year cannot be greater than max year.')
            return;
        }

        console.log(`Executing company search for min year ${minYear} and max year ${maxYear}`);

        setSearchParams({searchTerm: "", minYear: minYear, maxYear: maxYear});
    };

    const onArtistSearch = (e) => {
        e.preventDefault();

        const artistName = document.getElementById('artistName').value;

        if (!artistName) {
            alert(`Search term must be provided`);
            return;
        }
        if (!artistName.trim()) {
            alert('Search term cannot be a string with just spaces');
            return;
        }

        console.log(`Executing artist search for ${artistName}`);

        setSearchParams({searchTerm: artistName, minYear: 1900, maxYear: 2024});
    };

    const onSongSearch = (e) => {
        e.preventDefault();

        const songTitle = document.getElementById('songTitle').value;

        if (!songTitle) {
            alert(`Search term must be provided`);
            return;
        }
        if (!songTitle.trim()) {
            alert('Search term cannot be a string with just spaces');
            return;
        }

        console.log(`Executing song search for ${songTitle}`);

        setSearchParams({searchTerm: songTitle, minYear: 1900, maxYear: 2024});
    };

    return (
        <div>
            <div>
                <button className='button' onClick={() => handleButtonClick('Albums By Genre')}>Albums By Genre</button>
                <button className='button' onClick={() => handleButtonClick('Companies By Founded Year')}>Companies By Founded Year</button>
                <button className='button' onClick={() => handleButtonClick('Artists By Name')}>Artists By Name</button>
                <button className='button' onClick={() => handleButtonClick('Songs By Title')}>Songs By Title</button>
            </div>

            {searchType === 'Companies By Founded Year' && (
                <form className='form' id='searchCompanyByYear' onSubmit={onCompanySearch}>
                    <div className='form-group'>
                        <h2 style={{margin: 0, padding: 0, paddingTop: 15}}>Search Companies By Founded Year</h2>
                        <p style={{margin: 0, padding: 0, fontSize: 14}}>(1900 to 2024 by Default)</p>
                        <label>Min Year:</label>
                        <input
                            type="number"
                            id="minYear"
                            name="minYear"
                            placeholder="1900"
                            defaultValue={1900}
                        />
                        <label>Max Year:</label>
                        <input
                            type="number"
                            id="maxYear"
                            name="maxYear"
                            placeholder="2024"
                            required
                        />
                        <button className='button' type="submit">Search</button>
                    </div>
                </form>
            )}

            {searchType === 'Albums By Genre' && (
                <form className='form' id='searchAlbumByGenre' onSubmit={onAlbumSearch}>
                    <div className='form-group'>
                        <h2>Search Albums By Genre</h2>
                        <input
                            type="text"
                            id="genre"
                            name="searchValue"
                            required
                        />
                        <button className='button' type="submit">Search</button>
                    </div>
                </form>
            )}

            {searchType === 'Artists By Name' && (
                <form className='form' id='searchArtistsByName' onSubmit={onArtistSearch}>
                    <div className='form-group'>
                        <h2>Search Artists By Name</h2>
                        <input
                            type="text"
                            id="artistName"
                            name="searchValue"
                            required
                        />
                        <button className='button' type="submit">Search</button>
                    </div>
                </form>
            )}

            {searchType === 'Songs By Title' && (
                <form className='form' id='searchSongsByTitle' onSubmit={onSongSearch}>
                    <div className='form-group'>
                        <h2>Search Songs By Title</h2>
                        <input
                            type="text"
                            id="songTitle"
                            name="searchValue"
                            required
                        />
                        <button className='button' type="submit">Search</button>
                    </div>
                </form>
            )}
            <SearchResult searchParams={searchParams} searchType={searchType}/>
        </div>
    );
}

export default SearchType;
