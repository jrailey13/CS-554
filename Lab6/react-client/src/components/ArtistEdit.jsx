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

function ArtistEdit(props) {
    const [showEditModal, setShowEditModal] = useState(props.isOpen);
    const [artist, setArtist] = useState(props.artist);
    const {loading, error, data} = useQuery(queries.GET_ARTISTS);
    const [editArtist] = useMutation(queries.EDIT_ARTIST);
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setArtist(null);

        props.handleClose();
    };

    let name;
    let date_formed;
    let members;
    if (loading) {
        return <div>loading...</div>;
    }
    if (error) {
        return <div>{error.message}</div>;
    }
    return (
        <div>
            <ReactModal
                name='editModal'
                isOpen={showEditModal}
                contentLabel='Edit Artist'
                style={customStyles}
            >
                <form
                    className='form'
                    id='add-artist'
                    onSubmit={(e) => {
                        e.preventDefault();

                        if (!props.artist || !props.artist._id) {
                            console.error("Invalid artist object or id property");
                            return;
                        }

                        // Check name input
                        if (!helpers.validName(name.value)) {
                            alert('Invalid name input.');
                            return;
                        }

                        // Check date input
                        if (!helpers.validDate(date_formed.value)) {
                            alert('Invalid date format. Must be in one of the following formats: MM/DD/YYYY, MM/D/YYYY, M/DD/YYYY, or M/D/YYYY.');
                            return;
                        }

                        // Check members input
                        if (!helpers.validMembers(members.value.split('\n'))) {
                            alert('Invalid members input. Member names should only contain letters and each member should be on a separate line.');
                            return;
                        }
                        editArtist({
                            variables: {
                                id: props.artist._id,
                                name: name.value,
                                dateFormed: date_formed.value,
                                members: members.value.split('\n'),
                            }
                        });
                        name.value = '';
                        date_formed.value = '';
                        members.value = '';
                        setShowEditModal(false);

                        alert('Artist Updated');
                        props.handleClose();
                    }}
                >
                    <div className='form-group'>
                        <label>
                            Name:
                            <br />
                            <input
                                ref={(node) => {
                                    name = node;
                                }}
                                defaultValue={artist.name}
                                autoFocus={true}
                            />
                        </label>
                    </div>
                    <br />
                    <div className='form-group'>
                        <label>
                            Date Formed:
                            <br />
                            <input
                                ref={(node) => {
                                    date_formed = node;
                                }}
                                defaultValue={artist.dateFormed}
                            />
                        </label>
                    </div>
                    <br />

                    <div className='form-group'>
                        <label>
                            Members:
                            <br />
                            <textarea
                                ref={(node) => {
                                    members = node;
                                }}
                                defaultValue={artist.members.join('\n')}
                            />
                        </label>
                    </div>
                    <br />
                    <br />
                    <button className='button add-button' type='submit'>
                        Update Artist
                    </button>
                </form>

                <button className='button cancel-button' onClick={handleCloseEditModal}>
                    Cancel
                </button>
            </ReactModal>
        </div>
    );
}

export default ArtistEdit;