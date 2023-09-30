import React from 'react'

const DateInput = ({ title, selectedDate, onChange }) => {
  return (
    <div>
        <label htmlFor="dateInput"> { title } </label>
        <input
        type="date"
        id="dateInput"
        value={selectedDate}
        onChange={onChange}/>
    </div>
  )
}

export default DateInput;