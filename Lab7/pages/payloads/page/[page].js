import axios from 'axios';
import {useRouter} from "next/router";
import {useState, useEffect} from 'react';
import Link from "next/link";

export default function PayloadPages({payloadData, page}) {
    const router = useRouter();

    const [pageData, setPageData] = useState([]);

    // Use effect for loading the page with appropriate data
    useEffect(() => {
        if (page < 0 || isNaN(parseInt(page))) {
            router.push('/error')
        }
        if (payloadData) {
            const slicedData = payloadData.slice(page*10, page*10+10);
            if (slicedData.length === 0) {
                router.push('/error');
            }
            setPageData(slicedData);
        }
    }, [payloadData, page]);


    // Next page functionality
    const nextButton = () => {
        let nextPageUrl = `/payloads/page/${parseInt(page)+1}`;

        const lastPage = payloadData.length/10;
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
        let prevPageUrl = `/payloads/page/${parseInt(page) - 1}`;

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
            <h2>Payloads</h2>
            {pageData.map((payload) => {
                    return (
                        <div style={{borderBottom: "2px solid black", marginBottom: 15}} key={payload.id}>
                            <Link href={`/payloads/${payload.id}`}>{payload.name}</Link>
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
    const {data} = await axios.get(`https://api.spacexdata.com/v4/payloads`);

    if (isNaN(page) || page < 0) {
        return { notFound: true };
    }

    if (!data.length) {
        return {notFound: true};
    }

    return {
        props: {payloadData: data, page},
        revalidate: 86400
    };
}