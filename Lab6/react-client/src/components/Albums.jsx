import React, {useState} from 'react';
import '../App.css';
import {useQuery} from '@apollo/client';
import queries from '../queries.js';
import Add from './Add.jsx';
import AlbumEdit from "./AlbumEdit.jsx";
import AlbumDelete from "./AlbumDelete.jsx";
import {Link} from "react-router-dom";
function Albums() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editAlbum, setEditAlbum] = useState(null);
    const [deleteAlbum, setDeleteAlbum] = useState(null);

    const {loading, error, data} = useQuery(queries.GET_ALBUMS, {
        fetchPolicy: 'cache-and-network'
    });
    const handleOpenEditModal = (album) => {
        setShowEditModal(true);
        setEditAlbum(album);
    };

    const handleOpenDeleteModal = (album) => {
        setShowDeleteModal(true);
        setDeleteAlbum(album);
    };
    const closeAddFormState = () => {
        setShowAddForm(false);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
    };

    if (data) {
        const {albums} = data;
        return (
            <div>
                <button className='button' onClick={() => setShowAddForm(!showAddForm)}>
                    Create Album
                </button>
                {showAddForm && (
                    <Add type='album' closeAddFormState={closeAddFormState} />
                )}
                <br />
                <br />

                {albums.map((album) => {
                    return (
                        <div className='card' key={album._id}>
                            <div className='card-body'>
                                <h2 className='card-title'>
                                    <Link to={"/albums/"+album._id}>{album.title}</Link>
                                </h2>
                                <strong>Artist:</strong> {album.artist.name}
                                <br />
                                <strong>Release Date:</strong> {album.releaseDate}
                                <br/>

                                <strong>Genre:</strong> {album.genre}
                                <br/>

                                <strong>Record Company:</strong> {album.recordCompany.name}
                                <br/>

                                <button
                                    className='button'
                                    onClick={() => {
                                        handleOpenEditModal(album);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className='button'
                                    onClick={() => {
                                        handleOpenDeleteModal(album);
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
                    <AlbumEdit
                        isOpen={showEditModal}
                        album={editAlbum}
                        handleClose={handleCloseModals}
                    />
                )}

                {showDeleteModal && (
                    <AlbumDelete
                        isOpen={showDeleteModal}
                        handleClose={handleCloseModals}
                        deleteAlbum={deleteAlbum}
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

export default Albums;