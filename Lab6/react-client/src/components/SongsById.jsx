import React, {useState} from 'react';
import '../App.css';
import {useQuery} from '@apollo/client';
import queries from '../queries';
import SongEdit from "./SongEdit.jsx";
import SongDelete from "./SongDelete.jsx";
import {Link, useParams, useNavigate} from "react-router-dom";
function SongsById() {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editSong, setEditSong] = useState(null);
    const [deleteSong, setDeleteSong] = useState(null);

    const navigate = useNavigate();

    let songId = useParams();
    songId = songId.id;

    const {loading, error, data} = useQuery(queries.SONGS_BY_ID, {
        variables: {id: songId},
        fetchPolicy: 'cache-and-network'
    });
    const handleOpenEditModal = (song) => {
        setShowEditModal(true);
        setEditSong(song);
    };

    const handleOpenDeleteModal = (song) => {
        setShowDeleteModal(true);
        setDeleteSong(song);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
        navigate(-1);
    };

    if (data) {
        const song = data.getSongById;
        return (
            <div>
                <div className='card' key={song._id}>
                    <div className='card-body'>
                        <h2 className='card-title'>
                            {song.title}
                        </h2>
                        <strong>Duration:</strong> {song.duration}
                        <br />
                        <strong>Album:</strong> {<Link to={"/albums/"+song.albumId._id}>{song.albumId.title}</Link>}
                        <br/>

                        <button
                            className='button'
                            onClick={() => {
                                handleOpenEditModal(song);
                            }}
                        >
                            Edit
                        </button>
                        <button
                            className='button'
                            onClick={() => {
                                handleOpenDeleteModal(song)
                            }}
                        >
                            Delete
                        </button>
                        <br />
                    </div>
                </div>
                {showEditModal && (
                    <SongEdit
                        isOpen={showEditModal}
                        song={editSong}
                        handleClose={handleCloseModals}
                    />
                )}

                {showDeleteModal && (
                    <SongDelete
                        isOpen={showDeleteModal}
                        handleClose={handleCloseModals}
                        deleteSong={deleteSong}
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

export default SongsById;