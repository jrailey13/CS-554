import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import getData from "../getData.js";

function LaunchPages() {
    // Store current page number
    let pageNumber = useParams();
    pageNumber = parseInt(pageNumber.page);

    // Set up navigation functionality
    const navigate = useNavigate();

    // Launch data state
    const [launchData, setLaunchData] = useState([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);

    // Search data state
    const [searchedData, setSearchedData] = useState([]);

    // Error message state
    const [searchError, setSearchError] = useState("");

    let {data, loading} = getData('https://api.spacexdata.com/v4/launches');

    // Use effect for loading the page with appropriate data
    useEffect(() => {
        setCurrentPage(pageNumber);
        if (data) {
            const slicedData = data.slice(currentPage*10, currentPage*10+9);
            if (slicedData.length === 0) {
                navigate('/error');
            }
            setLaunchData(slicedData);
        }
    }, [data, currentPage, pageNumber]);


    if (loading) {
        return <div>Loading...</div>
    }

    // Next page functionality
    const nextButton = () => {
        let nextPageUrl = `/launches/page/${currentPage+1}`;

        const lastPage = data.length/10;
        if (currentPage === Math.floor(lastPage)) return;

        return (<button
            onClick={(e) => {
                e.preventDefault();
                setSearchError("");
                navigate(nextPageUrl);
            }} style={{border: "1px solid black"}}
        >
            Next
        </button>
        );
    }

    // Prev page functionality
    const prevButton = () => {
        let prevPageUrl = `/launches/page/${currentPage - 1}`;

        if (currentPage === 0) return;

        return <button
            onClick={(e) => {
                e.preventDefault();
                setSearchError("");
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
                setSearchError("");
                navigate('/');
            }} style={{position: "fixed", top: 0, left: 0, padding: 10}}
        >
            Home
        </button>
    }

    // Search bar functionality
    const searchFunction = (e) => {
        e.preventDefault();
        if (e.target.input.value.trim() === "") {
            setSearchError("You must provide a search term.");
        } else {
            setSearchError("");
            navigate('/launches/search/' + e.target.input.value);
        }
    }

    console.log(launchData);
    return (
        <div>
            <div style={{textAlign: "right", margin: 0}}>
                <form onSubmit={searchFunction}>
                    <input type="text" name="input" placeholder="Search"/>
                    <button type="submit">Submit</button>
                </form>
            </div>
            {searchError && (
                <div style={{textAlign: "right", color: "red"}}>
                    <p>{searchError}</p>
                </div>
            )}
            <h2>Launches</h2>
            {loading
                ? 'Loading...'
                : launchData.map((launch) => {
                    return (
                        <div style={{borderBottom: "2px solid black"}} key={launch.id}>
                            <p>{launch.name}</p>
                            <p>Flight Number: {launch.flight_number}</p>
                        </div>
                    );
                })}
            <div style={{padding: 10}}>
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

export default LaunchPages;