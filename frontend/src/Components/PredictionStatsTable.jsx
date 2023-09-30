import React from 'react';

const PredictionStatsTable = ({ data }) => {
  // Calculate RMSE, min error, max error, or any other statistics you need
  const errors = () => {
    return data
    .filter( (row) => row.predicted )
    .map( (row) => row.actual - row.predicted )
  }

  const calculateRMSE = () => {
    const sumSquaredErrors = errors()
    .map( (error) => error*error )
    .reduce((a, b) => a + b , 0);

    return Math.sqrt(sumSquaredErrors)/errors().length;
  };

  const calculateMinError = () => {
    return Math.min( ...(errors().map(Math.abs)) );
  };

  const calculateMaxError = () => {
    return Math.max( ...(errors().map(Math.abs)) );
  };

  // Call the functions to calculate the statistics
  const rmse = calculateRMSE();
  const minError = calculateMinError();
  const maxError = calculateMaxError();

  return (
    <div className='prediction-stats'>
      <h2>Prediction Statistics</h2>
      <table>
        <thead>
          <tr>
            <th>Statistic</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>RMSE (Root Mean Square Error)</td>
            <td>{rmse.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Minimum Error</td>
            <td>{minError.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Maximum Error</td>
            <td>{maxError.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PredictionStatsTable;
