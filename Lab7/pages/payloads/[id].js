import axios from "axios";
import {useRouter} from 'next/router';
import {useEffect, useState} from "react";
import Link from "next/link";
import YoutubeEmbed from "@/youtubeEmbed";

export default function PayloadById({payloadData}) {
    const router = useRouter();

    // Use effect for loading the page with appropriate data
    useEffect(() => {
        if (payloadData) {
            if (Object.keys(payloadData).length === 0) {
                console.log("ERROR")
                router.push('/error');
            }
        }
    }, [payloadData, router]);

    // Home button functionality
    const homeButton = () => {
        return <button
            onClick={(e) => {
                e.preventDefault();
                router.push('/');
            }} style={{position: "fixed", top: 0, right: 0, padding: 10}}
        >
            Home
        </button>
    }

    return (
        <div>
            <div>
                {homeButton()}
            </div>
            <h1>{payloadData.name}</h1>
            {<div key={payloadData.id}>
                        {payloadData.launch && payloadData.launch.links && payloadData.launch.links.youtube_id &&
                            <div style={{borderBottom: "2px solid black"}}>
                                <YoutubeEmbed embedId={payloadData.launch.links.youtube_id}/>
                                {payloadData.type ? <div>
                                    <h4 style={{margin: 0, paddingTop: 20}}>Payload Type</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{payloadData.type}</p>
                                </div> : null}
                                {payloadData.mass_kg && payloadData.mass_lbs ? <div>
                                    <h4 style={{margin: 0}}>Payload Mass</h4>
                                    <p style={{margin: 0}}>{payloadData.mass_kg} kilograms</p>
                                    <p style={{margin: 0, paddingBottom: 12}}>{payloadData.mass_lbs} pounds</p>
                                </div> : null}
                                {payloadData.lifespan_years ? <div>
                                    <h4 style={{margin: 0}}>Lifespan</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{payloadData.lifespan_years} years</p>
                                </div> : null}
                                <div>
                                    <h4 style={{margin: 0}}>Manufacturers</h4>
                                    {payloadData.manufacturers.length > 0 ?
                                        <div style={{margin: 0, paddingBottom: 12}}>
                                            <ul style={{display: "inline-block", textAlign: "center", listStyleType: "none", padding: 0, margin: 0}}>
                                                {payloadData.manufacturers.map((man) => (
                                                    <li key={man}>{man}</li>
                                                ))
                                                }
                                            </ul>
                                        </div> :
                                        <p style={{margin: 0, paddingBottom: 12}}>No manufacturer data available</p>}
                                </div>
                                <div>
                                    <h4 style={{margin: 0}}>Nationalities</h4>
                                    {payloadData.nationalities.length > 0 ?
                                        <div style={{margin: 0, paddingBottom: 12}}>
                                            <ul style={{display: "inline-block", textAlign: "center", listStyleType: "none", padding: 0, margin: 0}}>
                                                {payloadData.nationalities.map((nat) => (
                                                    <li key={nat}>{nat}</li>
                                                ))
                                                }
                                            </ul>
                                        </div> :
                                        <p style={{margin: 0, paddingBottom: 12}}>No nationality data available</p>}
                                </div>
                                {payloadData.orbit ? <div>
                                    <h4 style={{margin: 0}}>Orbit</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{payloadData.orbit}</p>
                                </div> : null}
                                {payloadData.longitude ? <div>
                                    <h4 style={{margin: 0}}>Longitude</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{payloadData.longitude}</p>
                                </div> : null}
                                {payloadData.apoapsis_km ? <div>
                                    <h4 style={{margin: 0}}>Apoapsis</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{payloadData.apoapsis_km} kilometers</p>
                                </div> : null}
                                {payloadData.periapsis_km ? <div>
                                    <h4 style={{margin: 0}}>Periapsis</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{payloadData.periapsis_km} kilometers</p>
                                </div> : null}
                                {payloadData.semi_major_axis_km ? <div>
                                    <h4 style={{margin: 0}}>Semi Major Axis</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{payloadData.semi_major_axis_km} kilometers</p>
                                </div> : null}
                                {payloadData.arg_of_pericenter ? <div>
                                    <h4 style={{margin: 0}}>Argument of Pericenter</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{payloadData.arg_of_pericenter} degrees</p>
                                </div> : null}
                                {payloadData.inclination_deg ? <div>
                                    <h4 style={{margin: 0}}>Inclination</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{payloadData.inclination_deg} degrees</p>
                                </div> : null}
                            </div>
                        }
                        <div>
                            <h3 style={{margin: 0, paddingTop: 20}}>Associated Launch</h3>
                            {payloadData.launch
                                ?
                                <div style={{paddingBottom: 12}} key={payloadData.launch.id}>
                                    <Link href={"/launches/"+payloadData.launch.id}>{payloadData.launch.name}</Link>
                                </div>
                                :
                                <p style={{margin: 0, paddingBottom: 12}}>No launch data available</p>}
                        </div>
                    </div>
                }
        </div>
    )
}

async function fetchData(url, query) {
    try {
        const response = axios.post(url, query);
        return response;
    } catch (e) {
        console.error(e);
    }
}

export async function getStaticPaths() {
    const response = await fetch('https://api.spacexdata.com/v4/payloads');
    const payloads = await response.json();

    const paths = payloads.map((payload) => {
        return {
            params: {id: payload.id}
        }
    });

    return {
        paths: paths,
        fallback: 'blocking'
    };
}

export async function getStaticProps({params}){
    const payloadId = params.id;

    const queryParams = {
        query: {_id: payloadId},
        options: {
            populate: [
                {path: "launch"},
            ]
        }
    };

    let response;
    try {
        response = await fetchData(`https://api.spacexdata.com/v4/payloads/query`, queryParams);
    } catch {
        return {
            redirect: {
                destination: '/400',
                permanent: false
            }
        };
    }
    const data = response.data;


    if (!data.docs || data.docs.length === 0) {
        return {notFound: true};
    }

    return {
        props: {payloadData: data.docs[0]},
        revalidate: 86400
    };
}