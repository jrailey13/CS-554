import {useEffect, useState} from 'react';
import axios from 'axios';

const queryData = (url, query) => {
    const [state, setState] = useState({data: null, loading: true});

    useEffect(() => {
        async function fetchData() {
            try {
                axios.post(url, query).then(({data}) => {
                    setState({data: data.docs, loading: false});
                }).catch((e) => {
                    console.error(e)
                    setState({data: null, loading: false});
                });
            } catch {
                console.log('Query catch block')
                setState({data: null, loading: false});
            }
        }
        fetchData();
    }, [url]);

    return state;
};

export default queryData;