import React from 'react'

const DropDown = ({ options, label, onChange, selectValues }) => {
  return (
    <div>
      { label && <label htmlFor=""> {label} </label> }
    </div>
  )
}

export default DropDown
