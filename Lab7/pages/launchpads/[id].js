import axios from "axios";
import {useRouter} from 'next/router';
import {useEffect, useState} from "react";
import Link from "next/link";

export default function LaunchpadById({launchpadData}) {
    const router = useRouter();

    // Use effect for loading the page with appropriate data
    useEffect(() => {
        if (launchpadData) {
            if (Object.keys(launchpadData).length === 0) {
                console.log("ERROR")
                router.push('/error');
            }
        }
    }, [launchpadData, router]);

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
            <h1>{launchpadData.name}</h1>
            {<div key={launchpadData.id}>
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
                                            <Link href={"/launches/"+launch.id}>{launch.name}</Link>
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
                                            <Link href={"/rockets/"+rocket.id}>{rocket.name}</Link>
                                        </li>
                                    ))
                                    }
                                </ul>
                            </div> : null}
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
    const response = await fetch('https://api.spacexdata.com/v4/launchpads');
    const launchpads = await response.json();

    const paths = launchpads.map((launchpad) => {
        return {
            params: {id: launchpad.id}
        }
    });

    return {
        paths: paths,
        fallback: 'blocking'
    };
}

export async function getStaticProps({params}){
    const launchpadId = params.id;

    const queryParams = {
        query: {_id: launchpadId},
        options: {
            populate: [
                {path: "launches"},
                {path: "rockets"}
            ]
        }
    };

    let response;
    try {
        response = await fetchData(`https://api.spacexdata.com/v4/launchpads/query`, queryParams);
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
        props: {launchpadData: data.docs[0]},
        revalidate: 86400
    };
}