import React, { useState } from 'react';
import './Filter.scss';
// import arrowIcon from '../../../assets/images/icons/arrow.svg';
import filterIcon from '../../../assets/images/icons/filter.svg';
import '../../../assets/libs/react-dates/lib/initialize';
import { DateRangePicker } from '../../../assets/libs/react-dates';
import moment from 'moment';

const Filter = (props:{filterList:any, initialPeriod:[string, string]}) => {

    const [startDate, changeStartDate] = useState(moment(props.initialPeriod[0]));
    const [endDate, changeEndDate] = useState(moment(props.initialPeriod[1]));
    const [dateRangePickerVision, changeDateRangePickerVision] = useState(false);
    type focusedInputType = 'startDate' | 'endDate' | null;
    const [focusedInput, changeFocusedInput] = useState<focusedInputType>('startDate');

    return(
        <div className="filter">
            <button onClick={() => changeDateRangePickerVision(!dateRangePickerVision)} className="toggle-filter-btn"><img src={filterIcon} alt=""/></button>
            {dateRangePickerVision ? 
                <div className="date-range-container">
                    <p onClick={() => {
                        changeStartDate(moment().set('hours', 0).set('minutes', 0).set('seconds', 0))
                        changeEndDate(moment());
                        console.log(`${startDate}-${endDate}`)
                        props.filterList(0);
                    }}>Today</p>
                    <p onClick={() => {
                        changeStartDate(moment().subtract(7, 'days'))
                        changeEndDate(moment());
                        props.filterList(1);
                    }}>Week</p>
                    <p onClick={() => {
                        changeStartDate(moment().subtract(1, 'month'))
                        changeEndDate(moment());
                        props.filterList(2)
                    }}>Month</p>
                    <DateRangePicker
                        startDate={startDate}
                        startDateId='start_date'
                        endDate={endDate}
                        endDateId='end_date'
                        onDatesChange={({startDate, endDate} : {startDate:any,endDate:any}) => {
                            changeStartDate(startDate);
                            changeEndDate(endDate);
                            props.filterList(3, `${moment(startDate).format('gggg-MM-DD')}T00:00:00.455Z`, `${moment(endDate).format('gggg-MM-DD')}T23:23:59.455Z`);
                        }}
                        focusedInput={focusedInput}
                        onFocusChange={(focusedInput:any) => changeFocusedInput(focusedInput)}
                        orientation='horizontal'
                        anchorDirection='right'
                        startDatePlaceholderText='Start date'
                        endDatePlaceholderText='End date'
                        enableOutsideDays={true}
                        verticalHeight={80}
                        numberOfMonths={1}
                        minDate={moment('2000-01-01')}
                        isOutsideRange={()=> false}
                    />
                </div> : null
            }
        </div>
    );
}

export default Filter;