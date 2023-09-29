import { useEffect, useState } from 'react';
import TimeserieseChart from '../Components/TimeserieseChart';
import PredictionStatsTable from '../Components/PredictionStatsTable';

const comparator = (a, b) => new Date(a.date) - new Date(b.date);

const formatData = (actual, predictions) => {
    const data = [];

    const datePredictValueMap = {};

    for (const prediction of predictions) {
        datePredictValueMap[prediction.date] = prediction.price;
    }

    return actual
        .sort(comparator)
        .map(o => {
            return { date: o.date, priceActual: o.price, pricePrediction: datePredictValueMap[o.date] }
        });
}

const fetchData = async (since) => {
    let data = await fetch(`http://127.0.0.1:5000/gold_prices?start_date=${since}`);
    data = await data.json();
    return data.map((record) => {
        return {
            date: record.date.split(' ')[0],
            predicted: record.predicted,
            actual: record.actual,
        }
    });
}

const ContinuousEvaluation = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [data, setData] = useState([]);
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    useEffect(() => {
        fetchData(selectedDate).then(d => setData(d));
    }, [selectedDate]);

    return (
        <div className='evaluation'>
            <div className='stats-container'>
                <div className='evaluation-input'>
                    <input
                        type="date"
                        id="dateInput"
                        value={selectedDate}
                        onChange={handleDateChange}
                    />
                </div>
                <PredictionStatsTable actual={data.actual} predictions={data.prediction}
                />
            </div>
            <TimeserieseChart
                data={data}
            />
        </div>
    );
}

export default ContinuousEvaluation;