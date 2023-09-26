import { useEffect, useState } from 'react';
import TimeserieseChart from '../Components/TimeserieseChart'

const comparator = (a, b) => new Date(a.date) - new Date(b.date);

const formatData = (actual, predictions) => {
    const data = [];
    
    const datePredictValueMap = {};

    for ( const prediction of predictions ) {
        datePredictValueMap[prediction.date] = prediction.price;
    }

    return actual
        .sort(comparator)
        .map(o => {
            return { date: o.date, priceActual: o.price, pricePrediction: datePredictValueMap[o.date] }
        });
}

const ContinuousEvaluation = () => {
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
                    date: '2023/09/02',
                    price: 110
                }, {
                    date: '2023/09/01',
                    price: 180
                }, {
                    date: '2023/09/04',
                    price: 250
                }, {
                    date: '2023/09/03',
                    price: 600
                }, {
                    date: '2023/09/05',
                    price: 1000
                }, {
                    date: '2023/09/06',
                    price: 600
                }, {
                    date: '2023/09/08',
                    price: 650
                },
            ];

            setActual(actualData);
            setPredictions(predictionsData);
        }
        fetchData();
    }, []);

    const data = formatData(actual, predictions);

    return (
        <div className='someClass'>
            <TimeserieseChart
                data={data}
            />
        </div>
    );
}

export default ContinuousEvaluation;