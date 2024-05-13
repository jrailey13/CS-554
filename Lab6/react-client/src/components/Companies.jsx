import React, {useState} from 'react';
import '../App.css';
import {useQuery} from '@apollo/client';
import queries from '../queries.js';
import Add from './Add.jsx';
import CompanyDelete from './CompanyDelete.jsx';
import CompanyEdit from './CompanyEdit.jsx';
import {Link} from "react-router-dom";
function Companies() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editRecordCompany, setEditRecordCompany] = useState(null);
    const [deleteRecordCompany, setDeleteRecordCompany] = useState(null);

    const {loading, error, data} = useQuery(queries.GET_RECORD_COMPANIES, {
        fetchPolicy: 'cache-and-network'
    });
    const handleOpenEditModal = (recordCompany) => {
        setShowEditModal(true);
        setEditRecordCompany(recordCompany);
    };

    const handleOpenDeleteModal = (recordCompany) => {
        setShowDeleteModal(true);
        setDeleteRecordCompany(recordCompany);
    };
    const closeAddFormState = () => {
        setShowAddForm(false);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
    };

    if (data) {
        const {recordCompanies} = data;
        return (
            <div>
                <button className='button' onClick={() => setShowAddForm(!showAddForm)}>
                    Create Record Company
                </button>
                {showAddForm && (
                    <Add type='recordCompany' closeAddFormState={closeAddFormState} />
                )}
                <br />
                <br />

                {recordCompanies.map((recordCompany) => {
                    return (
                        <div className='card' key={recordCompany._id}>
                            <div className='card-body'>
                                <h2 className='card-title'>
                                    <Link to={"/companies/"+recordCompany._id}>{recordCompany.name}</Link>
                                </h2>
                                <strong>Year Founded:</strong> {recordCompany.foundedYear}
                                <br/>

                                <strong>Country:</strong> {recordCompany.country}
                                <br/>

                                <strong>Number Of Albums:</strong> {recordCompany.numOfAlbums}
                                <br/>

                                <strong>Albums:</strong> {recordCompany.albums && recordCompany.albums.length > 0 ? recordCompany.albums.map((album) => album.title).join(', ') : "Yet to be added."}
                                <br />

                                <button
                                    className='button'
                                    onClick={() => {
                                        handleOpenEditModal(recordCompany);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className='button'
                                    onClick={() => {
                                        handleOpenDeleteModal(recordCompany);
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
                    <CompanyEdit
                        isOpen={showEditModal}
                        recordCompany={editRecordCompany}
                        handleClose={handleCloseModals}
                    />
                )}

                {showDeleteModal && (
                    <CompanyDelete
                        isOpen={showDeleteModal}
                        handleClose={handleCloseModals}
                        deleteRecordCompany={deleteRecordCompany}
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

export default Companies;