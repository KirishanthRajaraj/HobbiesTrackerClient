import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import * as HobbyClient from '../client/hobby.tsx';
import type { HobbyDates } from '../interfaces/HobbyDates.tsx';
import type { PointsInterval } from '../interfaces/PointsInterval.tsx';
import type { Hobby } from '../interfaces/Hobby.tsx';
import type { DaysOfWeek } from '../interfaces/DaysOfWeek.tsx';

interface Props {
  hobbyId: number;
  isInterval: boolean;
  setHobbies: React.Dispatch<React.SetStateAction<Hobby[]>>;
}

export default function WeekCalendar({ hobbyId, isInterval, setHobbies }: Props) {
  const today = dayjs();
  const startOfWeek = today.startOf('week'); // Sunday
  const [hobbyDates, setHobbyDates] = useState<HobbyDates[]>([]);
  const [intervalDatesWeeks, setIntervalDatesWeeks] = useState<number[]>([]);

  const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));

  useEffect(() => {
    switch (isInterval) {
      case true:
        getHobbyById();
        break;
      case false:
        getAllHobbyDates();
        break;
      default:
        getAllHobbyDates();
        break;
    }

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

  const getHobbyById = async () => {
    try {
      const res = await HobbyClient.getHobbyById(hobbyId);
      setIntervalDatesWeeks(
        res.data.intervalDaysOfWeek.map((day: DaysOfWeek) => daysOfWeekToNumber[day])
      );

    } catch (error) {
      console.error("Error fetching hobby dates:", error);
    }
  };

  const daysOfWeekToNumber: Record<DaysOfWeek, number> = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 7,
  };

  // purpose is to remap 0-6 to 1-7, where 1 is Monday and 7 is Sunday
  const weekdayNumber = (date: dayjs.Dayjs): number => {
    const d = date.day();
    return d === 0 ? 7 : d;
  };

  const jsDayToDaysOfWeek: Record<number, DaysOfWeek> = {
    0: "SUNDAY",
    1: "MONDAY",
    2: "TUESDAY",
    3: "WEDNESDAY",
    4: "THURSDAY",
    5: "FRIDAY",
    6: "SATURDAY",
  };

  function toDaysOfWeekArray(dayNumbers: number[]): DaysOfWeek[] {
    return dayNumbers.map(dayNumber => {
      if (dayNumber < 0 || dayNumber > 6) {
        throw new Error(`Invalid day number: ${dayNumber}`);
      }
      return jsDayToDaysOfWeek[dayNumber];
    });
  }

  const toggleSelectIntervalDates = (day: dayjs.Dayjs) => {
    const alreadySelected = intervalDatesWeeks.filter((i) => i === weekdayNumber(day));

    if (alreadySelected && alreadySelected.length > 0) {

      // remove the day from the intervalDates
      setIntervalDatesWeeks((prev) => prev.filter((i) => i !== weekdayNumber(day)));
      const intervalDateToRemove = intervalDatesWeeks.find((i) => i === weekdayNumber(day));
      const updatedIntervalDays = intervalDatesWeeks
        .filter(day => day !== intervalDateToRemove);
      /* new hobby with only intervalDateToRemove */

      const newHobby: Hobby = {
        id: hobbyId,
        name: "",
        description: undefined,
        interestLevel: 0,
        effortLevel: 0,
        categories: [],
        pluspoints: [],
        minuspoints: [],
        pointIntervalType: "WEEKLY" as PointsInterval,
        intervalDaysOfWeek: toDaysOfWeekArray(updatedIntervalDays),
        intervalDaysOfMonth: [],
        pointsCurrent: 0,
        pointsValued: 0
      };

      if (intervalDateToRemove) {
        HobbyClient.patchHobby(newHobby.id, newHobby);
      }
    } else {
      const intervalDateToAdd: number = weekdayNumber(day);

      const newHobby: Hobby = {
        id: hobbyId,
        name: "",
        description: undefined,
        interestLevel: 0,
        effortLevel: 0,
        categories: [],
        pluspoints: [],
        minuspoints: [],
        pointIntervalType: "WEEKLY" as PointsInterval,
        intervalDaysOfWeek: toDaysOfWeekArray([...intervalDatesWeeks, intervalDateToAdd]),
        intervalDaysOfMonth: [],
        pointsCurrent: 0,
        pointsValued: 0
      };

      setIntervalDatesWeeks((prev) => [
        ...prev,
        intervalDateToAdd
      ]);

      HobbyClient.patchHobby(newHobby.id, newHobby);
    }
  }

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

  const determineToggleSelect = (day: dayjs.Dayjs) => {
    if (isInterval) {
      toggleSelectIntervalDates(day);
    } else {
      toggleSelectHobbyDates(day);
    }
  };

  return (
    <Box gap={1} onClick={(e) => e.stopPropagation()}>

      <div className={`${isInterval ? 'mb-4!' : 'mt-0'} flex! gap-2`}>

        {weekDays.map((day) => {
          // determine if the day is selected

          const hobbyDatesOnly = hobbyDates
            .filter(hd => hd.hobbyId === hobbyId)
            .map(hd => dayjs(hd.date));

          let isSelected: boolean;
          let isToday: boolean;
          if (isInterval) {
            isSelected = intervalDatesWeeks.includes(weekdayNumber(day));
            isToday = false;
          } else {
            isSelected = hobbyDatesOnly.some(d => d.isSame(day, "day"));
            isToday = day.isSame(today, "day");
          }

          return (
            <div key={day.format('YYYY-MM-DD')} className="text-center">
              <Typography
                className={`font-bold
                `}
                variant="body2"
                sx={{
                  color: isInterval ? "#fff" : "#000",
                }}
              >
                {day.format("ddd")}
              </Typography>
              <div
                onClick={() => determineToggleSelect(day)}
                className={`
                cursor-pointer p-2 rounded-xl leading-1 aspect-square w-10 text-md flex items-center justify-center font-bold transition-colors duration-300
                ${isSelected ? 'bg-green-500 text-black' : 'bg-transparent text-gray-800'} 
                ${isToday ? 'border-2 border-black' : 'border-2 border-gray-200'} 
                hover:${isSelected ? 'bg-yellow-600' : 'bg-gray-300'}
                ${isInterval ? 'mb-4' : 'mb-0'}
              `}
              >
                <Typography
                  variant="inherit"
                  sx={{
                    color: isInterval && !isSelected ? "#fff" : undefined,
                  }}
                >
                  {day.format("D")}
                </Typography>            </div>
            </div>
          );
        })}
      </div>

    </Box>
  );
}
