import React, {useState} from 'react';
import '../App.css';
import {useQuery} from '@apollo/client';
import queries from '../queries.js';
import Add from './Add.jsx';
import ArtistDelete from './ArtistDelete.jsx';
import ArtistEdit from './ArtistEdit.jsx';
import {Link, useNavigate, useParams} from "react-router-dom";
function ArtistsById() {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editArtist, setEditArtist] = useState(null);
    const [deleteArtist, setDeleteArtist] = useState(null);

    const navigate = useNavigate();

    // Artist id
    let artistId  = useParams();
    artistId = artistId.id

    const {loading, error, data} = useQuery(queries.GET_ARTISTS_BY_ID, {
        variables: { id: artistId },
        fetchPolicy: 'cache-and-network'
    });

    const {loading: songLoading, error: songError, data: songData} = useQuery(queries.SONGS_BY_ARTIST_ID, {
        variables: { artistId: artistId },
        fetchPolicy: 'cache-and-network'
    });
    const handleOpenEditModal = (artist) => {
        setShowEditModal(true);
        setEditArtist(artist);
    };

    const handleOpenDeleteModal = (artist) => {
        setShowDeleteModal(true);
        setDeleteArtist(artist);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
        navigate('/artists')
    };

    let songs
    if (songData) {
        songs = songData.getSongsByArtistId;
    }

    if (data) {
        let artist = data.getArtistById;
        return (
            <div>
                <div className='card' key={artist._id}>
                    <div className='card-body'>
                        <h2 className='card-title'>
                            {artist.name}
                        </h2>
                        <strong>Date Formed:</strong> {artist.dateFormed}
                        <br/>

                        <strong>Members:</strong> {artist.members.join(', ')}
                        <br/>

                        <strong>Number Of Albums:</strong> {artist.numOfAlbums}
                        <br/>

                        <strong>Albums:</strong> {artist.albums && artist.albums.length > 0 ? (
                        <ul style={{margin: 0, padding: 0}}>
                            {artist.albums.map((album) => (
                                <li key={album._id}>
                                    {<Link to={'/albums/'+album._id}>{album.title}</Link>}
                                </li>
                            ))}
                        </ul>
                    ) : ("No albums available.")}

                        <strong>Songs:</strong> {songs && songs.length > 0 ? (
                            <ul style={{margin: 0, padding: 0}}>
                                {songs.map((song) => (
                                    <li key={song._id}>
                                        {<Link to={'/songs/'+song._id}>{song.title}</Link>} - {song.duration}
                                    </li>
                                ))}
                            </ul>
                        ) : ("No songs available.")}
                        <br/>

                        <button
                            className='button'
                            onClick={() => {
                                handleOpenEditModal(artist);
                            }}
                        >
                            Edit
                        </button>
                        <button
                            className='button'
                            onClick={() => {
                                handleOpenDeleteModal(artist);
                            }}
                        >
                            Delete
                        </button>
                        <br />
                    </div>
                </div>
            {showEditModal && (
                <ArtistEdit
                    isOpen={showEditModal}
                    artist={editArtist}
                    handleClose={handleCloseModals}
                />
            )}

            {showDeleteModal && (
                <ArtistDelete
                    isOpen={showDeleteModal}
                    handleClose={handleCloseModals}
                    deleteArtist={deleteArtist}
                />
            )}
        </div>
        );
    } else if (loading) {
        return <div>Loading</div>;
    } else if (error) {
        return <div>{error.message}</div>;
    }
}

export default ArtistsById;