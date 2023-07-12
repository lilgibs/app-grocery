import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import { useSelector, useDispatch } from "react-redux";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Center } from "@chakra-ui/react";

const DatePicker = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  return (
    <div>
      <Center>
        <DateRangePicker
          onChange={(item) => {
            setSelectedDate([item.selection]);
            console.log("Start date: " + selectedDate[0].startDate);
            console.log("End date: " + selectedDate[0].endDate);
          }}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={selectedDate}
          direction="horizontal"
        />
        ;
      </Center>
    </div>
  );
};

export default DatePicker;
