import {useEffect, useState} from 'react';
import axios from 'axios';

const useAxios = (url) => {
    const [state, setState] = useState({data: null, loading: true});

    useEffect(() => {
        async function fetchData() {
            try {
                axios.get(url).then(({data}) => {
                    setState({data: data, loading: false});
                });
            } catch {
                setState({data: null, loading: false});
            }
        }
        fetchData();
    }, [url]);

    return state;
};

export default useAxios;