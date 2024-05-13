import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import queryData from "../queryData.js";
import YoutubeEmbed from "../youtubeEmbed.jsx";

function LaunchPadById() {
    // Store launchpad id
    let launchpadId = useParams();
    launchpadId = launchpadId.id;

    // Set up navigation functionality
    const navigate = useNavigate();

    // rocket data state
    const [launchpadData, setLaunchpadData] = useState({});

    const queryParams = {
        query: {_id: launchpadId},
        options: {
            populate: [
                {path: "launches"},
                {path: "rockets"}
            ]
        }
    };

    let {data, loading} = queryData(`https://api.spacexdata.com/v4/launchpads/query`, queryParams);

    // Use effect for loading the page with appropriate data
    useEffect(() => {
        if (data) {
            if (Object.keys(data).length === 0) {
                navigate('/error');
            }
            setLaunchpadData(data);
        }
    }, [data]);

    if (loading) {
        return <div>Loading...</div>
    }

    console.log(launchpadData);

    return (
        <div>
            <h1>{launchpadData.name}</h1>
            {loading
                ? 'Loading...'
                : (<div key={launchpadData.id}>
                        {launchpadData &&
                            <div style={{borderBottom: "2px solid black"}}>
                                {launchpadData.images && launchpadData.images.large[0] ? <img src={launchpadData.images.large[0]} alt={"../../No-image-found.jpg"} width={800} height={600}></img> : null}
                                <div>
                                    <h4 style={{margin: 0, paddingTop: 20}}>Full Name</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{launchpadData.full_name}</p>
                                </div>
                                {launchpadData.details ?
                                    <div>
                                        <h4 style={{margin: 0}}>Details</h4>
                                        <p style={{margin: 0, paddingBottom: 12}}>{launchpadData.details}</p>
                                    </div> : null}
                                {launchpadData.locality ?
                                    <div>
                                        <h4 style={{margin: 0}}>Location</h4>
                                        <p style={{margin: 0, paddingBottom: 12}}>{launchpadData.locality}</p>
                                    </div> : null}
                                {launchpadData.region ?
                                    <div>
                                        <h4 style={{margin: 0}}>Region</h4>
                                        <p style={{margin: 0, paddingBottom: 12}}>{launchpadData.region}</p>
                                    </div> : null}
                                {launchpadData.launch_attempts && launchpadData.launch_successes ?
                                    <div>
                                        <h4 style={{margin: 0}}>Success Rate</h4>
                                        <p style={{margin: 0}}>Attempts: {launchpadData.launch_attempts}</p>
                                        <p style={{margin: 0, paddingBottom: 12}}>Successes: {launchpadData.launch_successes}</p>
                                    </div> : null}
                                {launchpadData.latitude && launchpadData.longitude ?
                                    <div>
                                        <h4 style={{margin: 0}}>Coordinates</h4>
                                        <p style={{margin: 0}}>Latitude: {launchpadData.latitude}</p>
                                        <p style={{margin: 0, paddingBottom: 12}}>Longitude: {launchpadData.longitude}</p>
                                    </div> : null}
                            </div>
                        }
                        {launchpadData.launches && launchpadData.launches.length > 0 ?
                            <div style={{margin: 0, paddingBottom: 12}}>
                                <h3>Associated Launches</h3>
                                <ul style={{display: "inline-block", textAlign: "center", listStyleType: "none", padding: 0, margin: 0}}>
                                    {launchpadData.launches.map((launch) => (
                                        <li style={{margin: 0, paddingBottom: 10}} key={launch.id}>
                                            <Link to={"/launches/"+launch.id}>{launch.name}</Link>
                                        </li>
                                    ))
                                    }
                                </ul>
                            </div> : null}
                        {launchpadData.rockets && launchpadData.rockets.length > 0 ?
                            <div style={{margin: 0, paddingBottom: 12}}>
                                <h3>Associated Rockets</h3>
                                <ul style={{display: "inline-block", textAlign: "center", listStyleType: "none", padding: 0, margin: 0}}>
                                    {launchpadData.rockets.map((rocket) => (
                                        <li style={{margin: 0, paddingBottom: 10}} key={rocket.id}>
                                            <Link to={"/rockets/"+rocket.id}>{rocket.name}</Link>
                                        </li>
                                    ))
                                    }
                                </ul>
                            </div> : null}
                    </div>
                )}
        </div>
    )}

export default LaunchPadById;