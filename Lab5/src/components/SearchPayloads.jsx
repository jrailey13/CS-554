import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import searchData from "../searchData.js";

function SearchPayloads() {
    // Store launch id
    let searchTerm = useParams();
    searchTerm = searchTerm.searchTerm;

    // Set up navigation functionality
    const navigate = useNavigate();

    // Launch data state
    const [payloadData, setPayloadData] = useState([]);

    const queryParams = {
        query: {name: {"$regex": searchTerm, "$options": "i"}},
        options: {
            populate: [
                {path: "launch"}
            ],
            limit: 500
        },
    };

    let {data, loading} = searchData(`https://api.spacexdata.com/v4/payloads/query`, queryParams);

    // Use effect for loading the page with appropriate data
    useEffect(() => {
        if (data) {
            setPayloadData(data);
        }
    }, [data]);

    if (loading) {
        return <div>Loading...</div>
    }

    console.log(payloadData);

    return (
        <div>
            <h2>Payloads</h2>
            {loading
                ? 'Loading...'
                : (payloadData.map((payload) => {
                    return (
                        <div style={{borderBottom: "2px solid black"}} key={payload.id}>
                            <p>{payload.name}</p>
                        </div>
                    );
                }))}
            {payloadData.length === 0 ?
                <div>
                    <p>No payloads were found for that search term.</p>
                </div>
                : null
            }
            {/* https://stackoverflow.com/questions/52039083/handle-back-button-with-react-router */}
            <div style={{position: "fixed", top: 0, left: 0, padding: 10, textAlign: "left"}}>
                <button onClick={() => navigate(-1)}>
                    Return to All Payloads
                </button>
            </div>
        </div>
    )
}

export default SearchPayloads;