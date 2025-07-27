import { StaticDatePicker, PickersDay } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useState } from 'react';
import isSameDay from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameDay);

const highlightedDays = [
  dayjs('2025-07-10'),
  dayjs('2025-07-15'),
];

function ServerDay(props) {
  const isSelected = highlightedDays.some((date) =>
    date.isSame(props.day, 'day')
  );

  return (
    <PickersDay
      {...props}
      sx={{
        backgroundColor: isSelected ? '#ffcc00' : undefined,
        color: isSelected ? '#000' : undefined,
        borderRadius: isSelected ? '50%' : undefined,
        '&:hover': {
          backgroundColor: isSelected ? '#e6b800' : undefined,
        },
      }}
    />
  );
}

export default function MyCalendar() {
  const today = dayjs();
  const [value, setValue] = useState(today);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        value={value}
        onChange={(newValue) => {
          if (newValue !== null) setValue(newValue);
        }}
        defaultValue={today}
        minDate={today}
        maxDate={today.add(1, 'month')}
        slots={{ day: ServerDay }}
      />
    </LocalizationProvider>
  );
}
