import { FC } from "react";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './calendar-custom.css';




export const Calender = ({
    value,
    disabledDates,
    onChange
}) => {

    return (
        <div className="calendar-full-width">
            <DateRange
            rangeColors={["#ea580c"]}
            ranges={[value]}
            date={new Date()}
            onChange={onChange}
            direction="vertical"
            showDateDisplay={false}
            minDate={new Date()}
            disabledDates={disabledDates}
            />
        </div>
    );
}
