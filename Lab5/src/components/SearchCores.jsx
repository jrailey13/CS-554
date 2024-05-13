import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import searchData from "../searchData.js";

function SearchCores() {
    // Store launch id
    let searchTerm = useParams();
    searchTerm = searchTerm.searchTerm;

    // Set up navigation functionality
    const navigate = useNavigate();

    // Launch data state
    const [coreData, setCoreData] = useState([]);

    const queryParams = {
        query: {name: {"$regex": searchTerm, "$options": "i"}},
        options: {
            populate: [
                {path: "launches"}
            ],
            limit: 500
        },
    };

    let {data, loading} = searchData(`https://api.spacexdata.com/v4/cores/query`, queryParams);

    // Use effect for loading the page with appropriate data
    useEffect(() => {
        if (data) {
            setCoreData(data);
        }
    }, [data]);

    if (loading) {
        return <div>Loading...</div>
    }

    console.log(coreData);

    return (
        <div>
            <h2>Cores</h2>
            {loading
                ? 'Loading...'
                : (coreData.map((core) => {
                    return (
                        <div style={{borderBottom: "2px solid black"}} key={core.id}>
                            <p>{core.serial}</p>
                        </div>
                    );
                }))}
            {coreData.length === 0 ?
                <div>
                    <p>No cores were found with that serial number.</p>
                </div>
                : null
            }
            {/* https://stackoverflow.com/questions/52039083/handle-back-button-with-react-router */}
            <div style={{position: "fixed", top: 0, left: 0, padding: 10, textAlign: "left"}}>
                <button onClick={() => navigate(-1)}>
                    Return to All Cores
                </button>
            </div>
        </div>
    )
}

export default SearchCores;