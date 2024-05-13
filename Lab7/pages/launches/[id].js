import axios from "axios";
import {useRouter} from 'next/router';
import {useEffect, useState} from "react";
import Link from "next/link";
import YoutubeEmbed from "@/youtubeEmbed";

export default function LaunchById({launchData}) {
    const router = useRouter();

    // Use effect for loading the page with appropriate data
    useEffect(() => {
        if (launchData) {
            if (Object.keys(launchData).length === 0) {
                console.log("ERROR")
                router.push('/error');
            }
        }
    }, [launchData, router]);

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
            <h1>{launchData.name}</h1>
            {<div key={launchData.id}>
                        {launchData.links && launchData.links.youtube_id &&
                            <div style={{borderBottom: "2px solid black"}}>
                                <div>
                                    <h4 style={{margin: 0}}>Flight Number</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{launchData.flight_number}</p>
                                </div>
                                <div>
                                    <h4 style={{margin: 0}}>Launch Status</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{launchData.success ? 'Successful' : 'Failed'}</p>
                                </div>
                                <YoutubeEmbed embedId={launchData.links.youtube_id}/>
                                {launchData.date_utc ? <div>
                                    <h4 style={{margin: 0, paddingTop: 20}}>Date</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{new Date(launchData.date_utc).toLocaleDateString()}</p>
                                </div> : null}
                                {launchData.details ? <div>
                                    <h4 style={{margin: 0}}>Launch Details</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{launchData.details}</p>
                                </div> : null}
                                <div>
                                    <h4 style={{margin: 0}}>Crew Members</h4>
                                    {launchData.crew.length > 0 ?
                                        <div style={{margin: 0, paddingBottom: 12}}>
                                            <ul style={{display: "inline-block", textAlign: "center", listStyleType: "none", padding: 0, margin: 0}}>
                                                {launchData.crew.map((member) => (
                                                    <li key={member.name}>{member.name}</li>
                                                ))
                                                }
                                            </ul>
                                        </div> :
                                        <p style={{margin: 0, paddingBottom: 12}}>No crew data available</p>}
                                </div>
                            </div>
                        }
                        <div>
                            <h3 style={{margin: 0, paddingTop: 20}}>Payloads</h3>
                            {launchData.payloads
                                ?
                                (launchData.payloads.length === 0
                                    ?
                                    (<p style={{margin: 0, paddingBottom: 12}}>No payload data available</p>)
                                    :
                                    (launchData.payloads.map((payload) => {
                                        return (
                                            <div style={{paddingBottom: 12}} key={payload.id}>
                                                <Link href={"/payloads/"+payload.id}>{payload.name}</Link>
                                            </div>
                                        );
                                    }))) :
                                <p style={{margin: 0, paddingBottom: 12}}>No payload data available</p>}
                        </div>
                        <div>
                            <h3 style={{margin: 0}}>Cores</h3>
                            {launchData.cores
                                ?
                                (!launchData.cores.core
                                    ?
                                    (<p style={{margin: 0, paddingBottom: 12}}>No core data available</p>)
                                    :
                                    (launchData.cores.map((core) => {
                                        return (
                                            <div style={{margin: 0, paddingBottom: 12}} key={core.core.id}>
                                                <Link href={"/cores/"+core.core.id}>{core.core.serial}</Link>
                                            </div>
                                        );
                                    }))) :
                                <p style={{margin: 0, paddingBottom: 12}}>No core data available</p>}
                        </div>
                        <div>
                            <h3 style={{margin: 0}}>Rocket</h3>
                            {!launchData.rocket
                                ? <p style={{margin: 0, paddingBottom: 12}}>No rocket data available</p>
                                :
                                <div style={{margin: 0, paddingBottom: 12}} key={launchData.rocket.id}>
                                    <Link href={"/rockets/"+launchData.rocket.id}>{launchData.rocket.name}</Link>
                                </div>
                            }
                        </div>
                        <div>
                            <h3 style={{margin: 0}}>Ships</h3>
                            {launchData.ships
                                ?
                                (launchData.ships.length === 0
                                    ?
                                    (<p style={{margin: 0, paddingBottom: 12}}>No ship data available</p>)
                                    :
                                    (launchData.ships.map((ship) => {
                                        return (
                                            <div style={{margin: 0, paddingBottom: 12}} key={ship.id}>
                                                <Link href={"/ships/"+ship.id}>{ship.name}</Link>
                                            </div>
                                        );
                                    }))) :
                                <p style={{margin: 0, paddingBottom: 12}}>No ship data available</p>}
                        </div>
                        <div>
                            <h3 style={{margin: 0}}>Launchpad</h3>
                            {!launchData.launchpad
                                ? <p style={{margin: 0, paddingBottom: 12}}>No launchpad data available</p>
                                :
                                <div style={{margin: 0, paddingBottom: 12}} key={launchData.launchpad.id}>
                                    <Link href={"/launchpads/"+launchData.launchpad.id}>{launchData.launchpad.name}</Link>
                                </div>
                            }
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
    const response = await fetch('https://api.spacexdata.com/v4/launches');
    const launches = await response.json();

    const paths = launches.map((launch) => {
        return {
            params: {id: launch.id}
        }
    });

    return {
        paths: paths,
        fallback: 'blocking'
    };
}

export async function getStaticProps({params}){
    const launchId = params.id;

    const queryParams = {
        query: {_id: launchId},
        options: {
            populate: [
                {path: "payloads"},
                {path: "rocket"},
                {path: "cores.core"},
                {path: "capsules"},
                {path: "launchpad"},
                {path: "ships"},
                {path: "crew"}
            ]
        }
    };

    let response;
    try {
        response = await fetchData(`https://api.spacexdata.com/v4/launches/query`, queryParams);
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
        props: {launchData: data.docs[0]},
        revalidate: 86400
    };
}