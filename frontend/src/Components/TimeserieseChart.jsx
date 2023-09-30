import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import '../index.css';

const TimeserieseChart = ({ data }) => {

    const values = [ 
        ...data.map( (r) => r.actual ), 
        ...data.map( (r) => r.predicted ).filter( (v) => v !== null) 
    ]
    .map((d) => parseInt(d));
    
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const margin = (maxVal-minVal) / 10;

    const lowerLimit = minVal-margin;
    const upperLimit = maxVal+margin;

    return (
        (data.length > 0 && (
            <div className='main-chart'>
                <LineChart className='line-chart'
                    width={800}
                    height={500}
                    data={data}>
                    <XAxis dataKey="date" interval='preserveStartEnd' />
                    <YAxis domain={[lowerLimit, upperLimit]} />
                    <Tooltip />
                    <Legend />
                    <Line className='line'
                        type="linear"
                        dataKey="actual"
                        stroke="#808080"
                        strokeWidth={3} />
                    <Line className='line'
                        type="linear"
                        dataKey="predicted"
                        stroke="blue" 
                        strokeWidth={3}/>
                </LineChart>
            </div>))
    );
}

export default TimeserieseChart;