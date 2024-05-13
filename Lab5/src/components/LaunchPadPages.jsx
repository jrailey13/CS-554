import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import getData from "../getData.js";

function LaunchPadPages() {
    // Store current page number
    let pageNumber = useParams();
    pageNumber = parseInt(pageNumber.page);

    // Set up navigation functionality
    const navigate = useNavigate();

    // Launch data state
    const [launchpadData, setLaunchPadData] = useState([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);

    let {data, loading} = getData('https://api.spacexdata.com/v4/launchpads');

    // Use effect for loading the page with appropriate data
    useEffect(() => {
        setCurrentPage(pageNumber);
        if (data) {
            const slicedData = data.slice(currentPage*10, currentPage*10+9);
            if (slicedData.length === 0) {
                navigate('/error');
            }
            setLaunchPadData(slicedData);
        }
    }, [data, currentPage, pageNumber]);


    if (loading) {
        return <div>Loading...</div>
    }

    // Next page functionality
    const nextButton = () => {
        let nextPageUrl = `/launchpads/page/${currentPage+1}`;

        const lastPage = data.length/10;
        if (currentPage === Math.floor(lastPage)) return;

        return (<button
                onClick={(e) => {
                    e.preventDefault();
                    navigate(nextPageUrl);
                }} style={{border: "1px solid black"}}
            >
                Next
            </button>
        );
    }

    // Prev page functionality
    const prevButton = () => {
        let prevPageUrl = `/launchpads/page/${currentPage - 1}`;

        if (currentPage === 0) return;

        return <button
            onClick={(e) => {
                e.preventDefault();
                navigate(prevPageUrl);
            }} style={{border: "1px solid black"}}
        >
            Previous
        </button>
    }

    // Home button functionality
    const homeButton = () => {
        return <button
            onClick={(e) => {
                e.preventDefault();
                navigate('/');
            }} style={{position: "fixed", top: 0, left: 0, padding: 10}}
        >
            Home
        </button>
    }

    console.log(launchpadData);
    return (
        <div>
            <h2>Launchpads</h2>
            {loading
                ? 'Loading...'
                : launchpadData.map((launchpad) => {
                    return (
                        <div style={{borderBottom: "2px solid black"}} key={launchpad.id}>
                            <p>{launchpad.name}</p>
                        </div>
                    );
                })}
            <div>
                {homeButton()}
            </div>
            <div style={{padding: 10}}>
                {nextButton()}
            </div>
            <div style={{padding: 10}}>
                {prevButton()}
            </div>
        </div>
    );
}

export default LaunchPadPages;