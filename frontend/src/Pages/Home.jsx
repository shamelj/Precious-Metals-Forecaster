import { useEffect, useState } from 'react';
import TimeserieseChart from '../Components/TimeserieseChart'

const Home = () => {
    const [actual, setActual] = useState([]);
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {

            const actualData = [
                {
                    date: '2023/09/02',
                    price: 100
                }, {
                    date: '2023/09/01',
                    price: 200
                }, {
                    date: '2023/09/04',
                    price: 300
                }, {
                    date: '2023/09/03',
                    price: 500
                }, {
                    date: '2023/09/05',
                    price: 900
                }, {
                    date: '2023/09/06',
                    price: 700
                }, {
                    date: '2023/09/08',
                    price: 800
                },
            ];
        
            const predictionsData = [
                {
                    date: '2023/09/09',
                    price: 1000
                }, {
                    date: '2023/09/10',
                    price: 1100
                }, {
                    date: '2023/09/11',
                    price: 900
                }, {
                    date: '2023/09/12',
                    price: 700
                }, {
                    date: '2023/09/13',
                    price: 800
                },
            ];
        
            setActual(actualData);
            setPredictions(predictionsData);
        }
        fetchData();
    }, []);

    console.log(actual);

    return (
        <TimeserieseChart
            actual={actual}
            prediction={predictions}
        />
    );
}

export default Home;