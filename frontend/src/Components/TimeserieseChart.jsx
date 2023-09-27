import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import '../index.css';

const TimeserieseChart = ({ data }) => {

    return (
        (data.length > 0 && (
            <div className='main-chart'>
                <LineChart className='line-chart'
                    width={800}
                    height={550}
                    data={data}>
                    <XAxis dataKey="date" interval='preserveStartEnd' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line className='line'
                        type="linear"
                        dataKey="priceActual"
                        stroke="#8884d8" />
                    <Line className='line'
                        type="linear"
                        dataKey="pricePrediction"
                        stroke="#5fc77d" />
                </LineChart>
            </div>))
    );
}

export default TimeserieseChart;