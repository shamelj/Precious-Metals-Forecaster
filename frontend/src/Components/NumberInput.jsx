const NumberInput = ({title, value, onChange}) => {
  return (
    <div className='inputNumber'>
        <label htmlFor="numberInput"> {title}: </label>
        <input
            type="number"
            id="numberInput"
            value={value}
            onChange={onChange}
        />
    </div>
  )
}

export default NumberInput;