import axios from 'axios';
import Link from 'next/link';
import {useRouter} from "next/router";
import {useState, useEffect} from 'react';

export default function CorePages({coreData, page}) {
    const router = useRouter();

    const [pageData, setPageData] = useState([]);

    // Use effect for loading the page with appropriate data
    useEffect(() => {
        if (page < 0 || isNaN(parseInt(page))) {
            router.push('/error')
        }
        if (coreData) {
            const slicedData = coreData.slice(page*10, page*10+10);
            if (slicedData.length === 0) {
                router.push('/error');
            }
            setPageData(slicedData);
        }
    }, [coreData, page]);


    // Next page functionality
    const nextButton = () => {
        let nextPageUrl = `/cores/page/${parseInt(page)+1}`;

        const lastPage = coreData.length/10;
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
        let prevPageUrl = `/cores/page/${parseInt(page) - 1}`;

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
            }} style={{position: "fixed", top: 0, right: 0, padding: 10}}
        >
            Home
        </button>
    }

    return (
        <div>
            <h2>Cores</h2>
            {pageData.map((core) => {
                    return (
                        <div style={{borderBottom: "2px solid black", marginBottom: 15}} key={core.id}>
                            <Link href={`/cores/${core.id}`}>{core.serial}</Link>
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
    const {data} = await axios.get(`https://api.spacexdata.com/v4/cores`);

    if (isNaN(page) || page < 0) {
        return { notFound: true };
    }

    if (!data.length) {
        return {notFound: true};
    }

    return {
        props: {coreData: data, page},
        revalidate: 86400
    };
}