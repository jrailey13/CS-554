import React, {useEffect, useState} from 'react';
import queries from '../queries.js';
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

function SearchResult(props) {
    const [searchResults, setSearchResults] = useState([]);

    // Using the queries to obtain data
    let { data: albumData } = useQuery(queries.ALBUMS_BY_GENRE, {
        variables: { genre: props.searchParams.searchTerm.toUpperCase() },
        skip: props.searchType !== 'Albums By Genre'
    });

    let { data: companyData } = useQuery(queries.COMPANY_BY_FOUNDED_YEAR, {
        variables: { min: props.searchParams.minYear, max: props.searchParams.maxYear },
        skip: props.searchType !== 'Companies By Founded Year'
    });

    let { data: artistData } = useQuery(queries.ARTIST_BY_ARTIST_NAME, {
        variables: { searchTerm: props.searchParams.searchTerm },
        skip: props.searchType !== 'Artists By Name'
    });

    let { data: songData } = useQuery(queries.SONG_BY_TITLE, {
        variables: { searchTitleTerm: props.searchParams.searchTerm },
        skip: props.searchType !== 'Songs By Title'
    });

    // Reset search results
    useEffect(() => {
        setSearchResults([]);
    }, [props.searchType])

    // Setting the search results with whatever the user is searching for
    useEffect(() => {
        if (albumData) {
            setSearchResults(albumData.albumsByGenre);
        }
        else if (companyData) {
            setSearchResults(companyData.companyByFoundedYear);
        }
        else if (artistData) {
            setSearchResults(artistData.searchArtistByArtistName);
        }
        else if (songData) {
            setSearchResults(songData.searchSongByTitle);
        }
    }, [albumData, companyData, artistData, songData]);


    console.log(searchResults);
    let searchBody = null;
    // Filling out the search body
    if (albumData) {
        searchBody = (
            <div>
                {searchResults && searchResults.map((result) => {
                    return (
                        <div className='card' key={result._id}>
                            <div className='card-body'>
                                {props.searchType === 'Albums By Genre' && (
                                    <div>
                                        <h2 className='card-title'>
                                            <Link to={"/albums/" + result._id}>{result.title}</Link>
                                        </h2>
                                        <strong>Artist:</strong> {<Link to={"/artists/"+result.artist._id}>{result.artist.name}</Link>}
                                        <br/>
                                        <strong>Release Date:</strong> {result.releaseDate}
                                        <br/>

                                        <strong>Genre:</strong> {result.genre}
                                        <br/>

                                        <strong>Record Company:</strong> {<Link to={"/companies/"+result.recordCompany._id}>{result.recordCompany.name}</Link>}
                                        <br/>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    } else if (companyData) {
        searchBody = (
            <div>
                {searchResults && searchResults.map((result) => {
                    return (
                        <div className='card' key={result._id}>
                            <div className='card-body'>
                                {props.searchType === 'Companies By Founded Year' && (
                                    <div>
                                        <h2 className='card-title'>
                                            <Link to={"/companies/" + result._id}>{result.name}</Link>
                                        </h2>
                                        <strong>Year Founded:</strong> {result.foundedYear}
                                        <br/>
                                        <strong>Country:</strong> {result.country}
                                        <br/>

                                        <strong>Number of Albums:</strong> {result.numOfAlbums}
                                        <br/>

                                        <strong>Albums:</strong> {result.albums && result.albums.length > 0 ? result.albums.map((album) => album.title).join(', ') : "Yet to be added."}
                                        <br/>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    } else if (artistData) {
        console.log(searchResults)
        console.log(artistData)
        searchBody = (
            <div>
                {searchResults && searchResults.map((result) => {
                    return (
                        <div className='card' key={result._id}>
                            <div className='card-body'>
                                {props.searchType === 'Artists By Name' && (
                                    <div>
                                        <h2 className='card-title'>
                                            <Link to={"/artists/" + result._id}>{result.name}</Link>
                                        </h2>
                                        <strong>Date Formed:</strong> {result.dateFormed}
                                        <br/>
                                        <strong>Members:</strong> {result.members.length > 1 ? result.members.join(', ') : result.members[0]}
                                        <br/>

                                        <strong>Number of Albums:</strong> {result.numOfAlbums}
                                        <br/>

                                        <strong>Albums:</strong> {result.albums && result.albums.length > 0 ? result.albums.map((album) => album.title).join(', ') : "Yet to be added."}
                                        <br/>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    } else if (songData) {
        searchBody = (
            <div>
                {searchResults && searchResults.map((result) => {
                    return (
                        <div className='card' key={result._id}>
                            <div className='card-body'>
                                {props.searchType === 'Songs By Title' && (
                                    <div>
                                        <h2 className='card-title'>
                                            <Link to={"/songs/" + result._id}>{result.title}</Link>
                                        </h2>
                                        <strong>Duration:</strong> {result.duration}
                                        <br/>
                                        <strong>Album:</strong> {<Link to={"/albums/"+result.albumId._id}>{result.albumId.title}</Link>}
                                        <br/>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
    return (
        <div>{searchBody}</div>
    )
}

export default SearchResult;
