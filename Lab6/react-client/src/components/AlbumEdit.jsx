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

function AlbumEdit(props) {
    const [showEditModal, setShowEditModal] = useState(props.isOpen);
    const [album, setAlbum] = useState(props.album);

    const {loading: artistLoading, error: artistError, data: artistData} = useQuery(queries.GET_ARTISTS);
    const {loading: companyLoading, error: companyError, data: companyData} = useQuery(queries.GET_RECORD_COMPANIES, {
        fetchPolicy: 'cache-and-network'
    });

    const [editAlbum] = useMutation(queries.EDIT_ALBUM);
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setAlbum(null);

        props.handleClose();
    };

    let title;
    let releaseDate;
    let genre;
    let artistId;
    let companyId;

    if (artistLoading || companyLoading) {
        return <div>loading...</div>;
    }

    if (artistError || companyError) {
        return <div>{artistError ? artistError.message : companyError.message}</div>;
    }

    if (artistData) {
        var {artists} = artistData;
    }
    if (companyData) {
        var {recordCompanies} = companyData
    }
    return (
        <div>
            <ReactModal
                name='editModal'
                isOpen={showEditModal}
                contentLabel='Edit Album'
                style={customStyles}
            >
                <form
                    className='form'
                    id='add-album'
                    onSubmit={(e) => {
                        e.preventDefault();

                        // Check title input
                        if (!helpers.validTitle(title.value)) {
                            alert('Title input is invalid.')
                        }

                        // Check date input
                        if (!helpers.validDate(releaseDate.value)) {
                            alert('Invalid date format. Must be in one of the following formats: MM/DD/YYYY, MM/D/YYYY, M/DD/YYYY, or M/D/YYYY.');
                            return;
                        }

                        // Check genre
                        if (!helpers.validGenre(genre.value)) {
                            alert('Invalid genre. Must be one of the following: "POP",\n' +
                                '            "ROCK",\n' +
                                '            "HIP_HOP",\n' +
                                '            "COUNTRY",\n' +
                                '            "JAZZ",\n' +
                                '            "CLASSICAL",\n' +
                                '            "ELECTRONIC",\n' +
                                '            "R_AND_B",\n' +
                                '            "INDIE",\n' +
                                '            "ALTERNATIVE"');
                            return;
                        }

                        editAlbum({
                            variables: {
                                id: props.album._id,
                                title: title.value,
                                releaseDate: releaseDate.value,
                                genre: genre.value.toUpperCase(),
                                artistId: artistId.value,
                                companyId: companyId.value
                            }
                        });
                        title.value = '';
                        releaseDate.value = '';
                        genre.value = '';
                        setShowEditModal(false);

                        alert('Album Updated');
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
                                defaultValue={album.title}
                                autoFocus={true}
                            />
                        </label>
                    </div>
                    <br />
                    <div className='form-group'>
                        <label>
                            Release Date:
                            <br />
                            <input
                                ref={(node) => {
                                    releaseDate = node;
                                }}
                                defaultValue={album.releaseDate}
                            />
                        </label>
                    </div>
                    <br />
                    <div className='form-group'>
                        <label>
                            Genre:
                            <br />
                            <input
                                ref={(node) => {
                                    genre = node;
                                }}
                                defaultValue={album.genre}
                            />
                        </label>
                    </div>
                    <br />

                    <div className='form-group'>
                        <label>
                            Artist:
                            <select
                                defaultValue={album.artist._id}
                                className='form-control'
                                ref={(node) => {
                                    artistId = node;
                                }}
                            >
                                {artists &&
                                    artists.map((artist) => {
                                        return (
                                            <option key={artist._id} value={artist._id}>
                                                {artist.name}
                                            </option>
                                        );
                                    })}
                            </select>
                        </label>
                    </div>
                    <br/>
                    <div className='form-group'>
                        <label>
                            Record Company:
                            <select
                                defaultValue={album.recordCompany._id}
                                className='form-control'
                                ref={(node) => {
                                    companyId = node;
                                }}
                            >
                                {recordCompanies &&
                                    recordCompanies.map((recordCompany) => {
                                        return (
                                            <option key={recordCompany._id} value={recordCompany._id}>
                                                {recordCompany.name}
                                            </option>
                                        );
                                    })}
                            </select>
                        </label>
                    </div>
                    <br />
                    <br />
                    <button className='button add-button' type='submit'>
                        Update Album
                    </button>
                </form>

                <button className='button cancel-button' onClick={handleCloseEditModal}>
                    Cancel
                </button>
            </ReactModal>
        </div>
    );
}

export default AlbumEdit;