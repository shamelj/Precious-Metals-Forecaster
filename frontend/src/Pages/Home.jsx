import { useEffect, useState } from 'react';
import TimeserieseChart from '../Components/TimeserieseChart'
import Intro from '../Components/Intro';
import NumberInput from '../Components/NumberInput';

const getPrev = async (sinceDate) => {
    const sinceString = `${sinceDate.getFullYear()}-${String(sinceDate.getMonth()+1).padStart(2, '0')}-${String(sinceDate.getDate()).padStart(2, '0')}`;
    let prev = await fetch(`http://127.0.0.1:5000/gold_prices?start_date=${sinceString}`);
    prev = await prev.json();
    
    return prev.map( (row) => {
        return {
            date: row.date.split(' ')[0],
            actual: row.actual
        }
    });
}

const getPrid = async (stepsForward) => {
    const response = await fetch(`http://127.0.0.1:5000/predictions?steps=${stepsForward}`);
    const json = await response.json();
    let predictions = json.predictions;

    const lastDate = new Date();
    
    return predictions.map((val) => {
        lastDate.setDate(lastDate.getDate() + 1);
        const dayOfWeek = lastDate.getDay();
        if( dayOfWeek < 2 ){
            lastDate.setDate(lastDate.getDate() + 1 - dayOfWeek);
        }
        return {
            date: lastDate.getFullYear() +
            `-${String(lastDate.getMonth()+1).padStart(2, '0')}` +
            `-${String(lastDate.getDate()).padStart(2, '0')}`,
            predicted: val
            };
    });
}

const fetchData = async (sinceDate, stepsForward) => {
    const prev = await getPrev(sinceDate);

    let predictions = await getPrid(stepsForward);
    
    const lastActual = prev[prev.length-1];
    lastActual.predicted = lastActual.actual;
    
    return [...prev, ...predictions];
}

const Home = () => {
    const [steps, setSteps] = useState(3);
    const [data, setData] = useState([]);

    const handleStepsChange = (event) => {
        const value = parseFloat(event.target.value);
        
        if (!isNaN(value)) {
          setSteps(value);
        }
      };

    useEffect(() => {
        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - 20);
        fetchData(sinceDate, steps).then( (d) => setData(d));
    }, [steps]);


    return (
        <div className='home'>
            <Intro />
            <NumberInput 
            title={'Days Forward'}
            value={steps}
            onChange={handleStepsChange}/>
            <TimeserieseChart
                data={data}
            />     
        </div>
    );
}

export default Home;