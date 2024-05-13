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

function CompanyDelete(props) {
    const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
    const [recordCompany, setRecordCompany] = useState(props.deleteRecordCompany);

    const [removeRecordCompany] = useMutation(queries.DELETE_RECORD_COMPANY, {
        update(cache) {
            cache.modify({
                fields: {
                    recordCompanies(existingRecordCompanies, {readField}) {
                        return existingRecordCompanies.filter(
                            (recordCompanyRef) => recordCompany._id !== readField('_id', recordCompanyRef)
                        );
                    }
                }
            });
        }
    });

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setRecordCompany(null);
        props.handleClose();
    };

    return (
        <div>
            {/*Delete Record Company Modal */}
            <ReactModal
                name='deleteModal'
                isOpen={showDeleteModal}
                contentLabel='Delete Record Company'
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
                        Are you sure you want to delete {recordCompany.name}?
                    </p>

                    <form
                        className='form'
                        id='delete-record-company'
                        onSubmit={(e) => {
                            e.preventDefault();
                            removeRecordCompany({
                                variables: {
                                    id: recordCompany._id
                                }
                            });
                            setShowDeleteModal(false);

                            alert('Record Company Deleted');
                            props.handleClose();
                        }}
                    >
                        <br />
                        <br />
                        <button className='button add-button' type='submit'>
                            Delete Record Company
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

export default CompanyDelete;