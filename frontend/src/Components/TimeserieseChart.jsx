import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import '../index.css';

const TimeserieseChart = ({ data }) => {

    return (
        (data.length > 0 && (
            <div className='main-chart'>
                <LineChart className='line-chart'
                    width={700}
                    height={450}
                    data={data}>
                    <XAxis dataKey="date" interval='preserveStartEnd' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="linear"
                        dataKey="priceActual"
                        stroke="#8884d8" />
                    <Line
                        type="linear"
                        dataKey="pricePrediction"
                        stroke="#5fc77d" />
                </LineChart>
            </div>))
    );
}

export default TimeserieseChart;