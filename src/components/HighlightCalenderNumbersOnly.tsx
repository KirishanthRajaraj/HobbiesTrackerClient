import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#121212",
            paper: "#1e1e1e",
        },
        text: {
            primary: "#fff",
            secondary: "#aaa",
        },
    },
});

export default function NumberSlotsCalendar() {
    const daysInMonth = 31;
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const [selected, setSelected] = useState<number[]>([]);

    const toggleDay = (day: number) => {
        setSelected((prev) =>
            prev.includes(day)
                ? prev.filter((d) => d !== day)
                : [...prev, day]
        );
    };

    const toggleSelectIntervalDates = (day: dayjs.Dayjs) => {
        const alreadySelected = intervalDatesMonths.filter((i) => i === weekdayNumber(day));

        if (alreadySelected && alreadySelected.length > 0) {

            // remove the day from the intervalDates
            setIntervalDatesMonths((prev) => prev.filter((i) => i !== weekdayNumber(day)));
            const intervalDateToRemove = intervalDatesMonths.find((i) => i === weekdayNumber(day));
            const updatedIntervalDays = intervalDatesMonths
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

            setIntervalDatesMonths((prev) => [
                ...prev,
                intervalDateToAdd
            ]);

            HobbyClient.patchHobby(newHobby.id, newHobby);
        }
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: 1,
                    p: 2,
                    bgcolor: "background.default",
                }}
            >
                {days.map((day) => {
                    const isSelected = selected.includes(day);
                    return (
                        <Box
                            key={day}
                            onClick={() => toggleDay(day)}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                cursor: "pointer",
                                backgroundColor: isSelected ? "#00c951" : undefined,
                                color: isSelected ? "#fff" : "text.primary",
                                "&:hover": {
                                    backgroundColor: isSelected ? "#000" : "#333",
                                },
                            }}
                        >
                            {day}
                        </Box>
                    );
                })}
            </Box>
        </ThemeProvider>
    );
}
