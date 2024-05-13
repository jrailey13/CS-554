import axios from 'axios';
import Link from 'next/link';
import {useRouter} from "next/router";
import {useState, useEffect} from 'react';

export default function LaunchPages({launchData, page}) {
    const router = useRouter();

    const [pageData, setPageData] = useState([]);

    // Use effect for loading the page with appropriate data
    useEffect(() => {
        if (page < 0 || isNaN(parseInt(page))) {
            router.push('/error')
        }
        if (launchData) {
            const slicedData = launchData.slice(page*10, page*10+10);
            if (slicedData.length === 0) {
                router.push('/error');
            }
            setPageData(slicedData);
        }
    }, [launchData, page]);


    // Next page functionality
    const nextButton = () => {
        let nextPageUrl = `/launches/page/${parseInt(page)+1}`;

        const lastPage = launchData.length/10;
        if (parseInt(page) === Math.floor(lastPage)) return;

        return (<button
                onClick={(e) => {
                    e.preventDefault();
                    router.push(nextPageUrl);
                }} style={{border: "1px solid black"}}
            >
                Next
            </button>
        );
    }

    // Prev page functionality
    const prevButton = () => {
        let prevPageUrl = `/launches/page/${parseInt(page) - 1}`;

        if (parseInt(page) === 0) return;

        return <button
            onClick={(e) => {
                e.preventDefault();
                router.push(prevPageUrl);
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
                router.push('/');
            }} style={{position: "fixed", top: 0, right: 0, padding: 10, margin: 10}}
        >
            Home
        </button>
    }

    return (
        <div>
            <h2>Launches</h2>
            {pageData.map((launch) => {
                    return (
                        <div style={{borderBottom: "2px solid black"}} key={launch.id}>
                            <Link href={`/launches/${launch.id}`}>{launch.name}</Link>
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

export async function getStaticPaths(){
    return {
        paths: [{params: {page: '0'}}],
        fallback: 'blocking'
    };
}

export async function getStaticProps({params}){
    const page = params.page;
    const {data} = await axios.get(`https://api.spacexdata.com/v4/launches`);

    if (isNaN(page) || page < 0) {
        return { notFound: true };
    }

    if (!data.length) {
        return {notFound: true};
    }

    return {
        props: {launchData: data, page},
        revalidate: 86400
    };
}