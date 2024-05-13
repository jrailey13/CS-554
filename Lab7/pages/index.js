import Link from 'next/link';
import axios from 'axios';
import {useState} from "react";

export default function Home({companyHistory, companyInfo}) {
    const [viewed, setViewed] = useState([]);


    // Function for toggling dropdown states
    const dropdown = (index) => {
        setViewed(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    return (
        <div>
            <h1>SpaceX Database</h1>
            <div>
                <h2>About SpaceX</h2>
                {companyInfo && (<p>{companyInfo.summary}</p>)}
            </div>
            <div id="historyContainer">
                <h2 style={{textAlign: "center"}}>Company History</h2>
                {companyHistory && companyHistory.map((obj, index) => (
                    <div style={{textAlign: "center"}} key={obj.title}>
                        <ul style={{display: "inline-block", textAlign: "center", listStyleType: "none", padding: 0}}>
                            <li>
                                <p style={{margin: 0}}>{new Date(obj.event_date_utc).toLocaleDateString()}</p>
                                <button onClick={() => dropdown(index)}>
                                    {obj.title}
                                    {viewed[index] ? <span>&#9650;</span> : <span>&#9660;</span>}
                                </button>
                                {viewed[index] && (
                                    <div>
                                        <p style={{margin: 0}}>{obj.details}</p>
                                        {obj.links.article ? <Link href={obj.links.article}>Read More</Link> : null}
                                    </div>)}
                            </li>
                        </ul>
                    </div>
                ))}
            </div>
            <div id="navBarContainer">
                <h2>Explore The Database</h2>
                <nav>
                    <div>
                        <ul className="homePageList">
                            <li>
                                <Link href='/launches/page/0'>Launches</Link>
                            </li>
                            <li>
                                <Link href='/payloads/page/0'>Payloads</Link>
                            </li>
                            <li>
                                <Link href='/cores/page/0'>Cores</Link>
                            </li>
                            <li>
                                <Link href='/rockets/page/0'>Rockets</Link>
                            </li>
                            <li>
                                <Link href='/ships/page/0'>Ships</Link>
                            </li>
                            <li>
                                <Link href='/launchpads/page/0'>Launch Pads</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
    )
}

export async function getStaticProps() {
    const [historyData, companyData] = await Promise.all([
        axios.get('https://api.spacexdata.com/v4/history'),
        axios.get('https://api.spacexdata.com/v4/company')
    ]);
    const companyHistory = historyData.data;
    const companyInfo = companyData.data

    return {
        props: {companyHistory, companyInfo}
    };
}