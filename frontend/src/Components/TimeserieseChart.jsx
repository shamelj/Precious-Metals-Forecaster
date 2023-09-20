import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const comparator = (a, b) => new Date(a.date) - new Date(b.date);


const TimeserieseChart = ({ actual, prediction }) => {

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

    if (actual.length + prediction.length == 0) {
        data.push({
            date: '',
            priceActual: 0
        });
    } else {
        actualFormatted[actualFormatted.length - 1].pricePrediction = actualFormatted[actualFormatted.length - 1].priceActual;
        data.push(...actualFormatted, ...predictionFormatted);
    }
    

    return (
        (data.length > 0 && (
            <LineChart
                width={500}
                height={300}
                data={data}
            >
                <XAxis dataKey="date" interval='preserveStartEnd' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="linear"
                    dataKey="priceActual"
                    stroke="#8884d8"
                />
                <Line
                    type="linear"
                    dataKey="pricePrediction"
                    stroke="#5fc77d"
                />
            </LineChart>))
    );
}

export default TimeserieseChart;