import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import '../index.css';

const TimeserieseChart = ({ data }) => {

    return (
        (data.length > 0 && (
            <div className='main-chart'>
                <LineChart className='line-chart'
                    width={800}
                    height={500}
                    data={data}>
                    <XAxis dataKey="date" interval='preserveStartEnd' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line className='line'
                        type="linear"
                        dataKey="priceActual"
                        stroke="#808080"
                        strokeWidth={3} />
                    <Line className='line'
                        type="linear"
                        dataKey="pricePrediction"
                        stroke="blue" 
                        strokeWidth={3}/>
                </LineChart>
            </div>))
    );
}

export default TimeserieseChart;