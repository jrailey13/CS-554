import axios from "axios";
import {useRouter} from 'next/router';
import {useEffect} from "react";
import Link from "next/link";
import YoutubeEmbed from "@/youtubeEmbed";

export default function CoreById({coreData}) {
    const router = useRouter();

    // Use effect for loading the page with appropriate data
    useEffect(() => {
        if (coreData) {
            if (Object.keys(coreData).length === 0) {
                console.log("ERROR")
                router.push('/error');
            }
        }
    }, [coreData, router]);

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
            <h1>{coreData.serial}</h1>
            {<div key={coreData.id}>
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
                                                <Link href={"/launches/"+launch.id}>{launch.name}</Link>
                                            </div>
                                        );
                                    }))) :
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
    const response = await fetch('https://api.spacexdata.com/v4/cores');
    const cores = await response.json();

    const paths = cores.map((core) => {
        return {
            params: {id: core.id}
        }
    });

    return {
        paths: paths,
        fallback: 'blocking'
    };
}

export async function getStaticProps({params}){
    const coreId = params.id;

    const queryParams = {
        query: {_id: coreId},
        options: {
            populate: [
                {path: "launches"},
            ]
        }
    };

    let response;
    try {
        response = await fetchData(`https://api.spacexdata.com/v4/cores/query`, queryParams);
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
        props: {coreData: data.docs[0]},
        revalidate: 86400
    };
}