import React, {useState} from 'react';
import '../App.css';
import {useQuery} from '@apollo/client';
import queries from '../queries.js';
import Add from './Add.jsx';
import CompanyDelete from './CompanyDelete.jsx';
import CompanyEdit from './CompanyEdit.jsx';
import {Link, useNavigate, useParams} from "react-router-dom";
function CompanyById() {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editRecordCompany, setEditRecordCompany] = useState(null);
    const [deleteRecordCompany, setDeleteRecordCompany] = useState(null);

    const navigate = useNavigate();

    // Record company id
    let recordCompanyId  = useParams();
    recordCompanyId = recordCompanyId.id

    const {loading, error, data} = useQuery(queries.GET_RECORD_COMPANIES_BY_ID, {
        variables: { id: recordCompanyId },
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

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
        navigate('/companies')
    };

    if (data) {
        console.log(data)
        let recordCompany = data.getCompanyById;
        return (
            <div>
                <div className='card' key={recordCompany._id}>
                    <div className='card-body'>
                        <h2 className='card-title'>
                            {recordCompany.name}
                        </h2>
                        <strong>Year Founded:</strong> {recordCompany.foundedYear}
                        <br/>

                        <strong>Country:</strong> {recordCompany.country}
                        <br/>

                        <strong>Number Of Albums:</strong> {recordCompany.numOfAlbums}
                        <br/>

                        <strong>Albums:</strong> {recordCompany.albums && recordCompany.albums.length > 0 ? (
                        <ul style={{margin: 0, padding: 0}}>
                            {recordCompany.albums.map((album) => (
                                <li key={album._id}>
                                    {<Link to={'/albums/'+album._id}>{album.title}</Link>}
                                </li>
                            ))}
                        </ul>
                    ) : ("No albums available.")}
                        <br/>

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

export default CompanyById;