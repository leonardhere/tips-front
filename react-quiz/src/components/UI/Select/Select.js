import React from 'react'
import classes from './Select.module.css'

const Select = (props) => {
    const htmlFor = `&{props.label} - ${Math.random()}`
    return(
        <div className={classes.Select}>
            <label htmlFor={htmlFor}>{props.label}</label>
            <select id={htmlFor} value={props.value} onChange={props.onChange}>
                {props.options.map((option, index) => {
                    return(
                        <option
                            value={option.value}
                            key={option.value + index}
                        >
                            {option.text}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}

//рендерим сам селект, добавляя в него варианты ответа, при помощи метода map разворачивая массив и передавая в JSX-разметку данные из props

export default Select