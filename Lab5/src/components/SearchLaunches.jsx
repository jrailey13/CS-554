import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import searchData from "../searchData.js";

function SearchLaunches() {
    // Store launch id
    let searchTerm = useParams();
    searchTerm = searchTerm.searchTerm;

    // Set up navigation functionality
    const navigate = useNavigate();

    // Launch data state
    const [launchData, setLaunchData] = useState([]);

    const queryParams = {
        query: {name: {"$regex": searchTerm, "$options": "i"}},
        options: {
            populate: [
                {path: "payloads"},
                {path: "rocket"},
                {path: "cores.core"},
                {path: "capsules"},
                {path: "launchpad"},
                {path: "ships"}
            ],
            limit: 500
        },
    };

    let {data, loading} = searchData(`https://api.spacexdata.com/v4/launches/query`, queryParams);

    // Use effect for loading the page with appropriate data
    useEffect(() => {
        if (data) {
            setLaunchData(data);
        }
    }, [data]);

    if (loading) {
        return <div>Loading...</div>
    }

    console.log(launchData);

    return (
        <div>
            <h2>Launches</h2>
            {loading
            ? 'Loading...'
            : (launchData.map((launch) => {
                return (
                    <div style={{borderBottom: "2px solid black"}} key={launch.id}>
                        <p>{launch.name}</p>
                        <p>Flight Number: {launch.flight_number}</p>
                    </div>
                );
            }))}
            {launchData.length === 0 ?
                <div>
                    <p>No launches were found for that search term.</p>
                </div>
                : null
            }
            {/* https://stackoverflow.com/questions/52039083/handle-back-button-with-react-router */}
            <div style={{position: "fixed", top: 0, left: 0, padding: 10, textAlign: "left"}}>
                <button onClick={() => navigate(-1)}>
                    Return to All Launches
                </button>
            </div>
        </div>
    )
}

export default SearchLaunches;