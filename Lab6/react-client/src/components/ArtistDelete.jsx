import React, {useState} from 'react';
import '../App.css';
import {useMutation} from '@apollo/client';
import ReactModal from 'react-modal';

//Import the file where my query constants are defined
import queries from '../queries.js';

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

function ArtistDelete(props) {
    const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
    const [artist, setArtist] = useState(props.deleteArtist);

    const [removeArtist] = useMutation(queries.DELETE_ARTIST, {
        update(cache) {
            cache.modify({
                fields: {
                    artists(existingArtists, {readField}) {
                        return existingArtists.filter(
                            (artistRef) => artist._id !== readField('_id', artistRef)
                        );
                    }
                }
            });
        }
    });

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setArtist(null);
        props.handleClose();
    };

    return (
        <div>
            {/*Delete Artist Modal */}
            <ReactModal
                name='deleteModal'
                isOpen={showDeleteModal}
                contentLabel='Delete Artist'
                style={customStyles}
            >
                {/*Here we set up the mutation, since I want the data on the page to update
				after I have added someone, I need to update the cache. If not then
				I need to refresh the page to see the data updated

				See: https://www.apollographql.com/docs/react/essentials/mutations for more
				information on Mutations
			*/}
                <div>
                    <p>
                        Are you sure you want to delete {artist.name}?
                    </p>

                    <form
                        className='form'
                        id='delete-artist'
                        onSubmit={(e) => {
                            e.preventDefault();
                            removeArtist({
                                variables: {
                                    id: artist._id
                                }
                            });
                            setShowDeleteModal(false);

                            alert('Artist Deleted');
                            props.handleClose();
                        }}
                    >
                        <br />
                        <br />
                        <button className='button add-button' type='submit'>
                            Delete Artist
                        </button>
                    </form>
                </div>

                <br />
                <br />
                <button
                    className='button cancel-button'
                    onClick={handleCloseDeleteModal}
                >
                    Cancel
                </button>
            </ReactModal>
        </div>
    );
}

export default ArtistDelete;