import axios from "axios";
import {useRouter} from 'next/router';
import {useEffect} from "react";
import Link from "next/link";

export default function ShipById({shipData}) {
    const router = useRouter();

    // Use effect for loading the page with appropriate data
    useEffect(() => {
        if (shipData) {
            if (Object.keys(shipData).length === 0) {
                console.log("ERROR")
                router.push('/error');
            }
        }
    }, [shipData, router]);

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
            <h1>{shipData.name}</h1>
            {<div key={shipData.id}>
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
                                            <Link href={"/launches/"+launch.id}>{launch.name}</Link>
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
    const response = await fetch('https://api.spacexdata.com/v4/ships');
    const ships = await response.json();

    const paths = ships.map((ship) => {
        return {
            params: {id: ship.id}
        }
    });

    return {
        paths: paths,
        fallback: 'blocking'
    };
}

export async function getStaticProps({params}){
    const shipId = params.id;

    const queryParams = {
        query: {_id: shipId},
        options: {
            populate: [
                {path: "launches"}
            ]
        }
    };

    let response;
    try {
        response = await fetchData(`https://api.spacexdata.com/v4/ships/query`, queryParams);
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
        props: {shipData: data.docs[0]},
        revalidate: 86400
    };
}