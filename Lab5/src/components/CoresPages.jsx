import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import getData from "../getData.js";

function CoresPages() {
    // Store current page number
    let pageNumber = useParams();
    pageNumber = parseInt(pageNumber.page);

    // Set up navigation functionality
    const navigate = useNavigate();

    // Launch data state
    const [coreData, setCoreData] = useState([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);

    // Error message state
    const [searchError, setSearchError] = useState("");

    let {data, loading} = getData('https://api.spacexdata.com/v4/cores');

    // Use effect for loading the page with appropriate data
    useEffect(() => {
        setCurrentPage(pageNumber);
        if (data) {
            const slicedData = data.slice(currentPage*10, currentPage*10+9);
            if (slicedData.length === 0) {
                navigate('/error');
            }
            setCoreData(slicedData);
        }
    }, [data, currentPage, pageNumber]);


    if (loading) {
        return <div>Loading...</div>
    }

    // Next page functionality
    const nextButton = () => {
        let nextPageUrl = `/cores/page/${currentPage+1}`;

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
        let prevPageUrl = `/cores/page/${currentPage - 1}`;

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
            navigate('/cores/search/' + e.target.input.value);
        }
    }

    console.log(coreData);
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
            <h2>Cores</h2>
            {loading
                ? 'Loading...'
                : coreData.map((core) => {
                    return (
                        <div style={{borderBottom: "2px solid black"}} key={core.id}>
                            <p>{core.serial}</p>
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

export default CoresPages;