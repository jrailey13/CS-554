import axios from "axios";
import {useRouter} from 'next/router';
import {useEffect, useState} from "react";
import Link from "next/link";
import YoutubeEmbed from "@/youtubeEmbed";

export default function RocketById({rocketData}) {
    const router = useRouter();

    // Use effect for loading the page with appropriate data
    useEffect(() => {
        if (rocketData) {
            if (Object.keys(rocketData).length === 0) {
                console.log("ERROR")
                router.push('/error');
            }
        }
    }, [rocketData, router]);

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
            <h1>{rocketData.name}</h1>
            {<div key={rocketData.id}>
                        {rocketData &&
                            <div style={{borderBottom: "2px solid black"}}>
                                {rocketData.description ? <div>
                                    <h4 style={{margin: 0, paddingTop: 20}}>Description</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{rocketData.description}</p>
                                </div> : null}
                                {rocketData.company ? <div>
                                    <h4 style={{margin: 0}}>Company</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{rocketData.company}</p>
                                </div> : null}
                                {rocketData.country ? <div>
                                    <h4 style={{margin: 0}}>Country</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{rocketData.country}</p>
                                </div> : null}
                                {rocketData.first_flight ? <div>
                                    <h4 style={{margin: 0}}>First Flight</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{new Date(rocketData.first_flight).toLocaleDateString()}</p>
                                </div> : null}
                                {rocketData.cost_per_launch ? <div>
                                    <h4 style={{margin: 0}}>Cost Per Launch</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>${rocketData.cost_per_launch}</p>
                                </div> : null}
                                {rocketData.success_rate_pct ? <div>
                                    <h4 style={{margin: 0}}>Success Rate</h4>
                                    <p style={{margin: 0, paddingBottom: 12}}>{rocketData.success_rate_pct}%</p>
                                </div> : null}
                                {rocketData.first_stage ? rocketData.first_stage &&
                                    <div>
                                        <h4 style={{margin: 0}}>Stage One</h4>
                                        <p style={{margin: 0}}>Burn Time: {rocketData.first_stage.burn_time_sec} seconds</p>
                                        <p style={{margin: 0}}>Fuel Used: {rocketData.first_stage.fuel_amount_tons} tons</p>
                                        <p style={{margin: 0}}>Sea Level Thrust: {rocketData.first_stage.thrust_sea_level.kN} kilonewtons/{rocketData.first_stage.thrust_sea_level.lbf} pounds-force</p>
                                        <p style={{margin: 0, paddingBottom: 12}}>Vacuum Thrust: {rocketData.first_stage.thrust_vacuum.kN} kilonewtons/{rocketData.first_stage.thrust_vacuum.lbf} pounds-force</p>
                                    </div> : null}
                                {rocketData.second_stage ? rocketData.second_stage &&
                                    <div>
                                        <h4 style={{margin: 0}}>Stage Two</h4>
                                        <p style={{margin: 0}}>Burn Time: {rocketData.second_stage.burn_time_sec} seconds</p>
                                        <p style={{margin: 0, paddingBottom: 12}}>Fuel Used: {rocketData.second_stage.fuel_amount_tons} tons</p>
                                    </div> : null}
                                {rocketData.engines ? rocketData.engines &&
                                    <div>
                                        <h4 style={{margin: 0}}>Engines</h4>
                                        <p style={{margin: 0}}>Layout: {rocketData.engines.layout}</p>
                                        <p style={{margin: 0}}>Type: {rocketData.engines.type}</p>
                                        <p style={{margin: 0}}>First Propellant: {rocketData.engines.propellant_1}</p>
                                        <p style={{margin: 0}}>Second Propellant: {rocketData.engines.propellant_2}</p>
                                        <p style={{margin: 0}}>Sea Level Specific Impulse: {rocketData.engines.isp.sea_level} meters per second</p>
                                        <p style={{margin: 0, paddingBottom: 12}}>Vacuum Specific Impulse: {rocketData.engines.isp.vacuum} meters per second</p>
                                    </div> : null}
                                {rocketData.landing_legs ? rocketData.landing_legs &&
                                    <div>
                                        <h4 style={{margin: 0}}>Landing Legs</h4>
                                        <p style={{margin: 0}}>Number: {rocketData.landing_legs.number}</p>
                                        <p style={{margin: 0, paddingBottom: 12}}>Material: {rocketData.landing_legs.material ? rocketData.landing_legs.material : "N/A"}</p>
                                    </div> : null}
                                {rocketData.height && rocketData.diameter && rocketData.mass &&
                                    <div style={{paddingBottom: 12}}>
                                        <table style={{marginLeft: "auto", marginRight: "auto"}}>
                                            <thead>
                                            <tr>
                                                <th>Dimensions</th>
                                                <th>Metric</th>
                                                <th>Imperial</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td>Height</td>
                                                <td>{rocketData.height.meters} meters</td>
                                                <td>{rocketData.height.feet} feet</td>
                                            </tr>
                                            <tr>
                                                <td>Weight</td>
                                                <td>{rocketData.mass.kg} kilograms</td>
                                                <td>{rocketData.mass.lb} pounds</td>
                                            </tr>
                                            <tr>
                                                <td>Diameter</td>
                                                <td>{rocketData.diameter.meters} meters</td>
                                                <td>{rocketData.diameter.feet} feet</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        {rocketData.wikipedia &&
                                            <div style={{paddingTop: 20, paddingBottom: 12}}>
                                                <h4 style={{margin: 0}}>More Information</h4>
                                                <Link href={rocketData.wikipedia}>{rocketData.wikipedia}</Link>
                                            </div>}
                                    </div>}
                            </div>
                        }
                    </div>
                }
        </div>
    );
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
    const response = await fetch('https://api.spacexdata.com/v4/rockets');
    const rockets = await response.json();

    const paths = rockets.map((rocket) => {
        return {
            params: {id: rocket.id}
        }
    });

    return {
        paths: paths,
        fallback: 'blocking'
    };
}

export async function getStaticProps({params}){
    const rocketId = params.id;

    const queryParams = {
        query: {_id: rocketId},
    };

    let response;
    try {
        response = await fetchData(`https://api.spacexdata.com/v4/rockets/query`, queryParams);
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
        props: {rocketData: data.docs[0]},
        revalidate: 86400
    };
}