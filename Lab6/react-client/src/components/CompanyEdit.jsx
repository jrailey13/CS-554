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

function CompanyEdit(props) {
    const [showEditModal, setShowEditModal] = useState(props.isOpen);
    const [recordCompany, setRecordCompany] = useState(props.recordCompany);
    const {loading, error, data} = useQuery(queries.GET_RECORD_COMPANIES);
    const [editRecordCompany] = useMutation(queries.EDIT_RECORD_COMPANY);
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setRecordCompany(null);

        props.handleClose();
    };

    let name;
    let founded_year;
    let country;
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
                contentLabel='Edit Record Company'
                style={customStyles}
            >
                <form
                    className='form'
                    id='add-record-company'
                    onSubmit={(e) => {
                        e.preventDefault();

                        if (!props.recordCompany || !props.recordCompany._id) {
                            console.error("Invalid record company object or id property");
                            return;
                        }

                        // Check name input
                        if (!helpers.validCompanyName(name.value)) {
                            console.log('test')
                            alert('Invalid name input.');
                            return;
                        }

                        // Check date input
                        if (!founded_year.value || !parseInt(founded_year.value)) {
                            alert('Please enter a four-digit year between 1900 and 2024.');
                            return;
                        }

                        if (!helpers.validFoundedYear(parseInt(founded_year.value))) {
                            alert('Invalid founded year input.');
                            return;
                        }

                        // Check members input
                        if (!helpers.validCountry(country.value)) {
                            alert('Invalid country input.');
                            return;
                        }
                        editRecordCompany({
                            variables: {
                                id: props.recordCompany._id,
                                name: name.value,
                                foundedYear: parseInt(founded_year.value),
                                country: country.value
                            }
                        });
                        name.value = '';
                        founded_year.value = '';
                        country.value = '';
                        setShowEditModal(false);

                        alert('Record Company Updated');
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
                                defaultValue={recordCompany.name}
                                autoFocus={true}
                            />
                        </label>
                    </div>
                    <br />
                    <div className='form-group'>
                        <label>
                            Founded Year:
                            <br />
                            <input
                                ref={(node) => {
                                    founded_year = node;
                                }}
                                defaultValue={recordCompany.foundedYear}
                            />
                        </label>
                    </div>
                    <br />

                    <div className='form-group'>
                        <label>
                            Country:
                            <br />
                            <textarea
                                ref={(node) => {
                                    country = node;
                                }}
                                defaultValue={recordCompany.country}
                            />
                        </label>
                    </div>
                    <br />
                    <br />
                    <button className='button add-button' type='submit'>
                        Update Record Company
                    </button>
                </form>

                <button className='button cancel-button' onClick={handleCloseEditModal}>
                    Cancel
                </button>
            </ReactModal>
        </div>
    );
}

export default CompanyEdit;