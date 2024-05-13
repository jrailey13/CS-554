import React, {useState} from 'react';
import '../App.css';
import {useMutation} from '@apollo/client';
import ReactModal from 'react-modal';

//Import the file where my query constants are defined
import queries from '../queries';

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

function SongDelete(props) {
    const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
    const [song, setSong] = useState(props.deleteSong);

    const [removeSong] = useMutation(queries.DELETE_SONG, {
        update(cache) {
            cache.modify({
                fields: {
                    albums(existingSongs, {readField}) {
                        return existingSongs.filter(
                            (songRef) => song._id !== readField('_id', songRef)
                        );
                    }
                }
            });
        }
    });

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSong(null);
        props.handleClose();
    };

    return (
        <div>
            {/*Delete Song Modal */}
            <ReactModal
                name='deleteModal'
                isOpen={showDeleteModal}
                contentLabel='Delete Song'
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
                        Are you sure you want to delete {song.title}?
                    </p>

                    <form
                        className='form'
                        id='delete-song'
                        onSubmit={(e) => {
                            e.preventDefault();
                            removeSong({
                                variables: {
                                    id: song._id
                                }
                            });
                            setShowDeleteModal(false);

                            alert('Song Deleted');
                            props.handleClose();
                        }}
                    >
                        <br />
                        <br />
                        <button className='button add-button' type='submit'>
                            Delete Song
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

export default SongDelete;