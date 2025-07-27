import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import * as HobbyClient from '../client/hobby.tsx';
import type { HobbyDates } from '../interfaces/HobbyDates.tsx';

interface Props {
  hobbyId: number;
}

export default function WeekCalendar({ hobbyId }: Props) {
  const today = dayjs();
  const startOfWeek = today.startOf('week'); // Sunday
  const [hobbyDates, setHobbyDates] = useState<HobbyDates[]>([]);

  const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));

  useEffect(() => {
    getAllHobbyDates();

    //setSelectedDates()
  }, [])

  useEffect(() => {
    console.log("Selected Dates:", hobbyDates);
  }, [hobbyDates])

  const getAllHobbyDates = async () => {
    try {
      const res = await HobbyClient.getAllHobbyDates();
      setHobbyDates(res.data);
    } catch (error) {
      console.error("Error fetching hobby dates:", error);
    }
  }

  const toggleSelect = (day: dayjs.Dayjs) => {
    const hobbyDatesOnly = hobbyDates.map((hd) => hd.date);
    const alreadySelected = hobbyDates.filter((d) => d.hobbyId == hobbyId).map((hd) => dayjs(hd.date)).some((d) => d.isSame(day, 'day'));
    console.log(hobbyDates);
    console.log(day);

    if (alreadySelected) {
      console.log("already selected");
      setHobbyDates((prev) => prev.filter((d) => !dayjs(d.date).isSame(day, 'day')));
      const hobbyDateToRemove = hobbyDates.find((d) => d.hobbyId === hobbyId && dayjs(d.date).isSame(day, 'day'));

      if(hobbyDateToRemove){
        HobbyClient.removeHobbyDate(hobbyDateToRemove);
      }

    } else {
      setHobbyDates((prev) => [
        ...prev,
        {
          id: 0,
          hobbyId,
          date: day.startOf('day').format('YYYY-MM-DD'),
        },
      ]);

      const hobbyDateToAdd: HobbyDates = {
        id: 0,
        hobbyId,
        date: day.startOf('day').format('YYYY-MM-DD'),
      };
      HobbyClient.updateHobbyDate(hobbyDateToAdd);

    }
  };

  return (
    <Box display="flex" gap={1} onClick={(e) => e.stopPropagation()}>
      {weekDays.map((day) => {
        const hobbyDatesOnly = hobbyDates.filter(hd => hd.hobbyId === hobbyId).map(hdo => dayjs(hdo.date));

        const isSelected = hobbyDatesOnly.some((d) => dayjs(d).isSame(day, 'day'));
        const isToday = day.isSame(today, 'day');

        return (
          <div key={day.format('YYYY-MM-DD')} className="text-center">
            <Typography className="text-gray-700 font-bold" variant="body2">
              {day.format('ddd')}
            </Typography>
            <div
              onClick={() => toggleSelect(day)}
              className={`
                cursor-pointer p-2 rounded-xl leading-1 aspect-square w-10 text-md flex items-center justify-center font-bold transition-colors duration-300
                ${isSelected ? 'bg-green-500 text-black' : 'bg-transparent text-gray-800'} 
                ${isToday ? 'border-2 border-black' : 'border-2 border-gray-200'} 
                hover:${isSelected ? 'bg-yellow-600' : 'bg-gray-300'}
              `}
            >
              <Typography variant="inherit">{day.format('D')}</Typography>
            </div>
          </div>
        );
      })}
    </Box>
  );
}
