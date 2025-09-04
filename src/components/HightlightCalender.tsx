import { StaticDatePicker, PickersDay } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import * as HobbyClient from '../client/hobby.tsx';
import type { HobbyDates } from '../interfaces/HobbyDates';
import type { Hobby } from '../interfaces/Hobby.tsx';

interface Props {
  hobbyId: number;
  isInterval: boolean;
  setHobbies: React.Dispatch<React.SetStateAction<Hobby[]>>;
}

export default function MyCalendar({ hobbyId, isInterval, setHobbies }: Props) {
  const [hobbyDates, setHobbyDates] = useState<HobbyDates[]>([]);
  const [intervalDatesMonths, setIntervalDatesMonths] = useState<number[]>([]);

  useEffect(() => {
    getHobbyDatesByHobbyId();
  }, [])

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
      text: {
        primary: '#fff',
        secondary: '#aaa',
      },
    },
  });

  const toggleSelectHobbyDates = async (day: dayjs.Dayjs) => {
    //const hobbyDatesOnly = hobbyDates.map((hd) => hd.date);
    // true or false, if the clicked day was already selected
    const alreadySelected = hobbyDates.filter((d) => d.hobbyId == hobbyId).map((hd) => dayjs(hd.date)).some((d) => d.isSame(day, 'day'));

    if (alreadySelected) {
      // remove the day from the hobbyDates
      setHobbyDates((prev) => prev.filter((d) => !dayjs(d.date).isSame(day, 'day')));
      const hobbyDateToRemove = hobbyDates.find((d) => d.hobbyId === hobbyId && dayjs(d.date).isSame(day, 'day'));

      if (hobbyDateToRemove) {
        HobbyClient.removeHobbyDate(hobbyDateToRemove);
        const updatedPoints = await HobbyClient.removeHobbyPoints(hobbyId);

        setHobbies((prev) =>
          prev?.map((hobby) =>
            hobby.id === hobbyId
              ? { ...hobby, pointsCurrent: updatedPoints }
              : hobby
          )
        );
      }
    } else {

      const hobbyDateToAdd: HobbyDates = {
        id: 0,
        hobbyId,
        date: day.startOf('day').format('YYYY-MM-DD'),
      };
      const createdHobbyDate = await HobbyClient.updateHobbyDate(hobbyDateToAdd); // to get the id from the backend
      const updatedPoints = await HobbyClient.updateHobbyPoints(hobbyId);

      setHobbies((prev) =>
        prev?.map((hobby) =>
          hobby.id === hobbyId
            ? { ...hobby, pointsCurrent: updatedPoints }
            : hobby
        )
      );
      setHobbyDates((prev) => [...prev, createdHobbyDate]);
    }
  };

  const getHobbyDatesByHobbyId = async () => {
    try {
      const res = await HobbyClient.getHobbyDatesByHobbyId(hobbyId);
      console.log("fetched hobby dates:", res.data);
      setHobbyDates(res.data);
    } catch (error) {
      console.error("Error fetching hobby dates:", error);
    }
  }

  function ServerDay(props: any) {
    const highlightedDays: Dayjs[] = hobbyDates.map((hd) => dayjs(hd.date));
    const isHighlighted = highlightedDays.find((d) => d.isSame(props.day, 'day'));

    const handleClick = () => {
      toggleSelectHobbyDates(props.day);
    };

    return (
      <PickersDay
        {...props}
        onClick={handleClick}
        sx={{
          backgroundColor: isHighlighted
            ? '#00c951'
            : undefined,
          color: isHighlighted ? '#fff' : undefined,
          '&:hover': {
            backgroundColor: isHighlighted
              ? '#000'
              : undefined,
          },
        }}
      />
    );
  }

  const today = dayjs();
  const [value, setValue] = useState(today);

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StaticDatePicker
          value={value}
          onChange={(newValue) => newValue && setValue(newValue)}
          defaultValue={today}
          minDate={dayjs('2025-01-01')}
          maxDate={today.add(5, 'month')}
          slots={{ day: ServerDay }}
          readOnly
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}
