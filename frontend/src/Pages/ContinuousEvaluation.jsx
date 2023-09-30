import { useEffect, useState } from 'react';
import TimeserieseChart from '../Components/TimeserieseChart';
import PredictionStatsTable from '../Components/PredictionStatsTable';
import DateInput from '../Components/DateInput';

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
    const [startingDate, setStartingDate] = useState('');
    const [data, setData] = useState([]);
    const handleDateChange = (event) => {
        setStartingDate(event.target.value);
      };

    useEffect(() => {
        fetchData(startingDate)
        .then(d => setData(d) );
    }, [startingDate]);

    return (
        <div className='evaluation'>

            <DateInput 
            title={'Starting Date'} 
            selectedDate={startingDate} 
            onChange={handleDateChange}/>

            <PredictionStatsTable 
            actual={[]} 
            predictions={[]}
            />

            <TimeserieseChart
                data={data}
            />
        </div>
    );
}

export default ContinuousEvaluation;