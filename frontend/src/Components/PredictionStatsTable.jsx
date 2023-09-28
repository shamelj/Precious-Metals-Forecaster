import React from 'react';

const PredictionStatsTable = ({ actual, predictions }) => {
  // Calculate RMSE, min error, max error, or any other statistics you need
  const calculateRMSE = () => {
    // Calculate RMSE logic here
    return 100;
  };

  const calculateMinError = () => {
    // Calculate min error logic here
    return 20;
  };

  const calculateMaxError = () => {
    // Calculate max error logic here
    return 140;
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
            <td>{rmse}</td>
          </tr>
          <tr>
            <td>Minimum Error</td>
            <td>{minError}</td>
          </tr>
          <tr>
            <td>Maximum Error</td>
            <td>{maxError}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PredictionStatsTable;
