import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import queryData from "../queryData.js";
import YoutubeEmbed from "../youtubeEmbed.jsx";

function CoresById() {
    // Store core id
    let coreId = useParams();
    coreId = coreId.id;

    // Set up navigation functionality
    const navigate = useNavigate();

    // core data state
    const [coreData, setCoreData] = useState({});

    const queryParams = {
        query: {_id: coreId},
        options: {
            populate: [
                {path: "launches"},
            ]
        }
    };

    let {data, loading} = queryData(`https://api.spacexdata.com/v4/cores/query`, queryParams);

    // Use effect for loading the page with appropriate data
    useEffect(() => {
        if (data) {
            if (Object.keys(data).length === 0) {
                navigate('/error');
            }
            setCoreData(data);
        }
    }, [data]);

    if (loading) {
        return <div>Loading...</div>
    }

    console.log(coreData);

    return (
        <div>
            <h1>{coreData.serial}</h1>
            {loading
                ? 'Loading...'
                : (<div key={coreData.id}>
                        {coreData.launches &&
                            <div style={{borderBottom: "2px solid black"}}>
                                <div style={{margin: 0, paddingBottom: 12}}>
                                    <h2 style={{margin: 0}}>Associated Launches</h2>
                                    <ul style={{display: "inline-block", textAlign: "center", listStyleType: "none", width: 853, height: 480, padding: 0, margin: 0}}>
                                        {coreData.launches.map((launch) => (
                                            <li key={launch.id} style={{padding: 10, margin: 0, paddingBottom: 10}}>
                                                <p style={{padding: 5, margin: 0, fontSize: 20}}>{launch.name}</p>
                                                <YoutubeEmbed embedId={launch.links.youtube_id}/>
                                            </li>
                                        ))
                                        }
                                    </ul>
                                </div>
                                {coreData.status ? <div>
                                    <h4 style={{margin: 0, paddingTop: 20}}>Core Status</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{coreData.status}</p>
                                </div> : null}
                                {coreData.status ? <div>
                                    <h4 style={{margin: 0}}>Number of Times Reused</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{coreData.reuse_count ? coreData.reuse_count : "None"}</p>
                                </div> : null}
                                {coreData.status ? <div>
                                    <h4 style={{margin: 0}}>Return to Launch Site</h4>
                                    <p style={{margin: 0}}>Attempts: {coreData.rtls_attempts}</p>
                                    <p style={{margin: 0, paddingBottom: 12}}>Successes: {coreData.rtls_landings}</p>
                                </div> : null}
                                {coreData.status ? <div>
                                    <h4 style={{margin: 0}}>Autonomous Spaceport Drone Ship Landings</h4>
                                    <p style={{margin: 0}}>Attempts: {coreData.asds_attempts}</p>
                                    <p style={{margin: 0, paddingBottom: 12}}>Successes: {coreData.asds_landings}</p>
                                </div> : null}
                            </div>
                        }
                        <div>
                            <h3 style={{margin: 0, paddingTop: 20}}>Associated Launches</h3>
                            {coreData.launches
                                ?
                                (coreData.launches.length === 0
                                    ?
                                    (<p style={{margin: 0, paddingBottom: 12}}>No launch data available</p>)
                                    :
                                    (coreData.launches.map((launch) => {
                                        return (
                                            <div style={{paddingBottom: 12}} key={launch.id}>
                                                <Link to={"/launches/"+launch.id}>{launch.name}</Link>
                                            </div>
                                        );
                                    }))) :
                                <p style={{margin: 0, paddingBottom: 12}}>No launch data available</p>}
                        </div>
                    </div>
                )}
        </div>
    )
}

export default CoresById;