import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import queryData from "../queryData.js";
import YoutubeEmbed from "../youtubeEmbed.jsx";

function ShipsById() {
    // Store ship id
    let shipId = useParams();
    shipId = shipId.id;

    // Set up navigation functionality
    const navigate = useNavigate();

    // rocket data state
    const [shipData, setShipData] = useState({});

    const queryParams = {
        query: {_id: shipId},
        options: {
            populate: [
                {path: "launches"}
            ]
        }
    };

    let {data, loading} = queryData(`https://api.spacexdata.com/v4/ships/query`, queryParams);

    // Use effect for loading the page with appropriate data
    useEffect(() => {
        if (data) {
            if (Object.keys(data).length === 0) {
                navigate('/error');
            }
            setShipData(data);
        }
    }, [data]);

    if (loading) {
        return <div>Loading...</div>
    }

    console.log(shipData);

    return (
        <div>
            <h1>{shipData.name}</h1>
            {loading
                ? 'Loading...'
                : (<div key={shipData.id}>
                    {shipData &&
                        <div style={{borderBottom: "2px solid black"}}>
                            {shipData.image ? <img src={shipData.image} alt={"../../No-image-found.jpg"} width={800} height={600}></img> : null}
                            <div>
                                <h4 style={{margin: 0, paddingTop: 20}}>Home Port</h4>
                                <p style={{margin: 0, paddingBottom: 12}}>{shipData.home_port}</p>
                            </div>
                            {shipData.model ?
                            <div>
                                <h4 style={{margin: 0}}>Model</h4>
                                <p style={{margin: 0, paddingBottom: 12}}>{shipData.model}</p>
                            </div> : null}
                            {shipData.year_built ?
                                <div>
                                    <h4 style={{margin: 0}}>Year Built</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{shipData.year_built}</p>
                                </div> : null}
                            {shipData.type ?
                                <div>
                                    <h4 style={{margin: 0}}>Type</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{shipData.type}</p>
                                </div> : null}
                            {shipData.mass_kg && shipData.mass_lbs ?
                                <div>
                                    <h4 style={{margin: 0}}>Mass</h4>
                                    <p style={{margin: 0}}>{shipData.mass_kg} kilograms</p>
                                    <p style={{margin: 0, paddingBottom: 12}}>{shipData.mass_lbs} pounds</p>
                                </div> : null}
                            {shipData.latitude && shipData.longitude ?
                                <div>
                                    <h4 style={{margin: 0}}>Coordinates</h4>
                                    <p style={{margin: 0}}>Latitude: {shipData.latitude}</p>
                                    <p style={{margin: 0, paddingBottom: 12}}>Longitude: {shipData.longitude}</p>
                                </div> : null}
                        </div>
                    }
                    {shipData.launches && shipData.launches.length > 0 ?
                        <div style={{margin: 0, paddingBottom: 12}}>
                            <h3>Associated Launches</h3>
                            <ul style={{display: "inline-block", textAlign: "center", listStyleType: "none", padding: 0, margin: 0}}>
                                {shipData.launches.map((launch) => (
                                    <li style={{margin: 0, paddingBottom: 10}} key={launch.id}>
                                        <Link to={"/launches/"+launch.id}>{launch.name}</Link>
                                    </li>
                                ))
                                }
                            </ul>
                        </div> : null}
                    </div>
                )}
                </div>
    )}

export default ShipsById;