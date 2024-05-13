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

function AlbumDelete(props) {
    const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
    const [album, setAlbum] = useState(props.deleteAlbum);

    const [removeAlbum] = useMutation(queries.DELETE_ALBUM, {
        update(cache) {
            cache.modify({
                fields: {
                    albums(existingAlbums, {readField}) {
                        return existingAlbums.filter(
                            (albumRef) => album._id !== readField('_id', albumRef)
                        );
                    }
                }
            });
        }
    });

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setAlbum(null);
        props.handleClose();
    };

    return (
        <div>
            {/*Delete Album Modal */}
            <ReactModal
                name='deleteModal'
                isOpen={showDeleteModal}
                contentLabel='Delete Album'
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
                        Are you sure you want to delete {album.title}?
                    </p>

                    <form
                        className='form'
                        id='delete-album'
                        onSubmit={(e) => {
                            e.preventDefault();
                            removeAlbum({
                                variables: {
                                    id: album._id
                                }
                            });
                            setShowDeleteModal(false);

                            alert('Album Deleted');
                            props.handleClose();
                        }}
                    >
                        <br />
                        <br />
                        <button className='button add-button' type='submit'>
                            Delete Album
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

export default AlbumDelete;