import { useEffect, useState } from 'react';
import TimeserieseChart from '../Components/TimeserieseChart'
import Intro from '../Components/Intro';

const comparator = (a, b) => new Date(a.date) - new Date(b.date);

const formatData = (actual, prediction) => {
    const data = [];

    const actualFormatted = actual
        .sort(comparator)
        .map(o => {
            return { date: o.date, priceActual: o.price }
        });

    const predictionFormatted = prediction
        .sort(comparator)
        .map(o => {
            return { date: o.date, pricePrediction: o.price }
        });

    if (actual.length + prediction.length === 0) {
        data.push({
            date: '',
            priceActual: 0
        });
    } else {
        actualFormatted[actualFormatted.length - 1].pricePrediction = actualFormatted[actualFormatted.length - 1].priceActual;
        data.push(...actualFormatted, ...predictionFormatted);
    }
    return data;
}

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

    const data = formatData(actual, predictions);

    return (
        <div className='home'>
            <Intro />
            <TimeserieseChart
                data={data}
            />            
        </div>
    );
}

export default Home;