/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';

export function FetchHook(url: string, request: any) {
    const [data, setData] = useState<any>([]);
    const getData = async () => {
        const response = await fetch(url, request).then(res => res.text());
        let d = response;
        try {
            d = JSON.parse(response);
        } catch (error) {}
        setData(d);
    }
    useEffect(() => {
        getData();
    }, []);
    return data;
}

export default FetchHook;