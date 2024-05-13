import React, {useState} from 'react';
import '../App.css';
import {useQuery} from '@apollo/client';
import queries from '../queries.js';
import Add from './Add.jsx';
import ArtistDelete from './ArtistDelete.jsx';
import ArtistEdit from './ArtistEdit.jsx';
import {Link} from "react-router-dom";
function Artists() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editArtist, setEditArtist] = useState(null);
    const [deleteArtist, setDeleteArtist] = useState(null);

    const {loading, error, data} = useQuery(queries.GET_ARTISTS, {
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
    const closeAddFormState = () => {
        setShowAddForm(false);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
    };

    if (data) {
        const {artists} = data;
        return (
            <div>
                <button className='button' onClick={() => setShowAddForm(!showAddForm)}>
                    Create Artist
                </button>
                {showAddForm && (
                    <Add type='artist' closeAddFormState={closeAddFormState} />
                )}
                <br />
                <br />

                {artists.map((artist) => {
                    return (
                        <div className='card' key={artist._id}>
                            <div className='card-body'>
                                <h2 className='card-title'>
                                    <Link to={"/artists/"+artist._id}>{artist.name}</Link>
                                </h2>
                                <strong>Date Formed:</strong> {artist.dateFormed}
                                <br/>

                                <strong>Members:</strong> {artist.members.join(', ')}
                                <br/>

                                <strong>Number Of Albums:</strong> {artist.numOfAlbums}
                                <br/>

                                <strong>Albums:</strong> {artist.albums && artist.albums.length > 0 ? artist.albums.map((album) => album.title).join(', ') : "Yet to be added."}
                                <br />

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
                    );
                })}
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

export default Artists;