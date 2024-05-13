import React, {useState} from 'react';
import '../App.css';
import ReactModal from 'react-modal';
import {useQuery, useMutation} from '@apollo/client';
//Import the file where my query constants are defined
import queries from '../queries.js';
import helpers from '../helpers.js';

//For react-modal
ReactModal.setAppElement('#root');
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        border: '1px solid #28547a',
        borderRadius: '4px'
    }
};

function SongEdit(props) {
    const [showEditModal, setShowEditModal] = useState(props.isOpen);
    const [song, setSong] = useState(props.song);

    const {loading: albumLoading, error: albumError, data: albumData} = useQuery(queries.GET_ALBUMS);

    const [editSong] = useMutation(queries.EDIT_SONG);
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSong(null);

        props.handleClose();
    };

    let title;
    let duration;
    let albumId;

    if (albumLoading) {
        return <div>loading...</div>;
    }

    if (albumError) {
        return <div>{albumError.message}</div>;
    }

    if (albumData) {
        var {albums} = albumData
    }

    return (
        <div>
            <ReactModal
                name='editModal'
                isOpen={showEditModal}
                contentLabel='Edit Song'
                style={customStyles}
            >
                <form
                    className='form'
                    id='add-song'
                    onSubmit={(e) => {
                        e.preventDefault();

                        // Check title input
                        if (!helpers.validTitle(title.value)) {
                            alert('Title input is invalid.')
                        }

                        // Check date input
                        if (!helpers.validDuration(duration.value)) {
                            alert('Invalid date format. Must be in one of the following formats: MM/DD/YYYY, MM/D/YYYY, M/DD/YYYY, or M/D/YYYY.');
                            return;
                        }

                        console.log(props.song._id)
                        console.log(title.value)
                        console.log(duration.value)
                        console.log(albumId.value)
                        editSong({
                            variables: {
                                id: props.song._id,
                                title: title.value,
                                duration: duration.value,
                                albumId: albumId.value
                            }
                        });
                        title.value = '';
                        duration.value = '';
                        setShowEditModal(false);

                        alert('Song Updated');
                        props.handleClose();
                    }}
                >
                    <div className='form-group'>
                        <label>
                            Title:
                            <br />
                            <input
                                ref={(node) => {
                                    title = node;
                                }}
                                defaultValue={song.title}
                                autoFocus={true}
                            />
                        </label>
                    </div>
                    <br />
                    <div className='form-group'>
                        <label>
                            Duration:
                            <br />
                            <input
                                ref={(node) => {
                                    duration = node;
                                }}
                                defaultValue={song.duration}
                            />
                        </label>
                    </div>
                    <br />

                    <div className='form-group'>
                        <label>
                            Album:
                            <select
                                defaultValue={song.albumId._id}
                                className='form-control'
                                ref={(node) => {
                                    albumId = node;
                                }}
                            >
                                {albums &&
                                    albums.map((album) => {
                                        return (
                                            <option key={album._id} value={album._id}>
                                                {album.title}
                                            </option>
                                        );
                                    })}
                            </select>
                        </label>
                    </div>
                    <br />
                    <br />
                    <button className='button add-button' type='submit'>
                        Update Song
                    </button>
                </form>

                <button className='button cancel-button' onClick={handleCloseEditModal}>
                    Cancel
                </button>
            </ReactModal>
        </div>
    );
}

export default SongEdit;