import React, {useEffect, useState} from 'react';
import {Link, Outlet} from "react-router-dom";
import axios from "axios";

function Home() {
    // State for company info
    const [companyInfo, setCompanyInfo] = useState([]);
    // State for company history
    const [companyHistory, setCompanyHistory] = useState([]);
    // State for dropdowns
    const [viewed, setViewed] = useState([]);

    useEffect(() => {
        // Function that retrieves company info
        async function getCompanyInfo() {
            try {
                const companyInfo = await axios.get('https://api.spacexdata.com/v4/company');
                setCompanyInfo(companyInfo.data);
            } catch (e) {
                let error = new Error('Unable to find company info.');
                error.status = 404;
                throw error;
            }
        }

        // Function that retrieves company history

        async function getCompanyHistory() {
            try {
                const companyHistory = await axios.get('https://api.spacexdata.com/v4/history');
                setCompanyHistory(companyHistory.data);
                setViewed(companyHistory.data.map(() => false));
            } catch (e) {
                let error = new Error('Unable to find company history.');
                error.status = 404;
                throw error;
            }
        }
        getCompanyInfo();
        getCompanyHistory()
    }, []);

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
                <h2>Company History</h2>
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
                                        <Link to={obj.links.article}>Read More</Link>
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
                                <Link to='/launches/page/0'>Launches</Link>
                            </li>
                            <li>
                                <Link to='/payloads/page/0'>Payloads</Link>
                            </li>
                            <li>
                                <Link to='/cores/page/0'>Cores</Link>
                            </li>
                            <li>
                                <Link to='/rockets/page/0'>Rockets</Link>
                            </li>
                            <li>
                                <Link to='/ships/page/0'>Ships</Link>
                            </li>
                            <li>
                                <Link to='/launchpads/page/0'>Launch Pads</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            <Outlet />
        </div>
    )
}

export default Home;