import { useEffect, useState } from 'react';
import TimeserieseChart from '../Components/TimeserieseChart';
import PredictionStatsTable from '../Components/PredictionStatsTable';

const comparator = (a, b) => new Date(a.date) - new Date(b.date);

const fetchData = async (since) => {
    let data = await fetch(`http://127.0.0.1:5000/gold_prices?start_date=${since}`);
    data = await data.json();
    return data.map((record) => {
        return {
            date: record.date.split(' ')[0],
            predicted: record.predicted,
            actual: record.actual,
        }
    }).sort(comparator);
}

const ContinuousEvaluation = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [data, setData] = useState([]);
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
      };


    useEffect(() => {
        fetchData(selectedDate).then(d => setData(d) );
    }, [selectedDate]);

    return (
        <div className='evaluation'>
            <div>
                <input
                    type="date"
                    id="dateInput"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            </div>
            <PredictionStatsTable actual={[]} predictions={[]}
            />
            <TimeserieseChart
                data={data}
            />
        </div>
    );
}

export default ContinuousEvaluation;