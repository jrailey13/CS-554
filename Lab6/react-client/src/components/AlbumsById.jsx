import React, {useState} from 'react';
import '../App.css';
import {useQuery} from '@apollo/client';
import queries from '../queries';
import AlbumEdit from "./AlbumEdit.jsx";
import AlbumDelete from "./AlbumDelete.jsx";
import {Link, useParams, useNavigate} from "react-router-dom";
function AlbumsById() {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editAlbum, setEditAlbum] = useState(null);
    const [deleteAlbum, setDeleteAlbum] = useState(null);

    const navigate = useNavigate();

    let albumId = useParams();
    albumId = albumId.id;

    const {loading, error, data} = useQuery(queries.GET_ALBUMS_BY_ID, {
        variables: {id: albumId},
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

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
        navigate('/albums')
    };

    if (data) {
        const album = data.getAlbumById;
        return (
            <div>
                <div className='card' key={album._id}>
                    <div className='card-body'>
                        <h2 className='card-title'>
                            {album.title}
                        </h2>
                        <strong>Artist:</strong> <Link to={"/artists/"+album.artist._id}>{album.artist.name}</Link>
                        <br />
                        <strong>Release Date:</strong> {album.releaseDate}
                        <br/>

                        <strong>Genre:</strong> {album.genre}
                        <br/>

                        <strong>Record Company:</strong> <Link to={"/companies/"+album.recordCompany._id}>{album.recordCompany.name}</Link>
                        <br/>

                        <strong>Songs:</strong> {album.songs && album.songs.length > 0 ? (
                        <ul style={{margin: 0, padding: 0}}>
                            {album.songs.map((song) => (
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
                                handleOpenEditModal(album);
                            }}
                        >
                            Edit
                        </button>
                        <button
                            className='button'
                            onClick={() => {
                                handleOpenDeleteModal(album)
                            }}
                        >
                            Delete
                        </button>
                        <br />
                    </div>
                </div>
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

export default AlbumsById;