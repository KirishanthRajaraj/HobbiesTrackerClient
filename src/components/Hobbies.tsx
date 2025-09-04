import { useEffect, useRef, useState, type SetStateAction } from 'react'
import '../App.css'
import { Alert, Autocomplete, Box, Button, IconButton, Modal, Slider, Snackbar, TextareaAutosize, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as HobbyClient from '../client/hobby.tsx';
import * as CategoryClient from '../client/category.tsx';
import type { Hobby } from '../interfaces/Hobby.tsx';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Label } from '@mui/icons-material';
import type { Category } from '../interfaces/Category.tsx';
import CategoryToggleGroup from '../components/CategoryToggleGroup.tsx';
import type { Point } from '../interfaces/Point.tsx';
import PlusMinusInputs from '../components/PlusMinusInputs.tsx';
import BottomNav from '../components/BottomNav.tsx';
import HobbyRecommendation from '../components/HobbyRecommendation.tsx';
import Home from '../App.tsx';
import HighlightCalendar from './HightlightCalender.tsx';
import WeekCalendar from './weekCalender.tsx';
import type { PointsInterval } from '../interfaces/PointsInterval.tsx';


function Hobbies() {
    const [currentHobby, setCurrentHobby] = useState<Hobby>({
        id: Date.now(),
        name: "",
        description: "",
        interestLevel: 0,
        effortLevel: 0,
        categories: [],
        pluspoints: [],
        minuspoints: [],
        pointIntervalType: "DAILY",
        intervalDaysOfWeek: [],
        intervalDaysOfMonth: [],
        pointsCurrent: 0,
        pointsValued: 0,
        //image: "",
    })
    const [editHobby, setEditHobby] = useState<Hobby>({
        id: Date.now(),
        name: "",
        description: "",
        interestLevel: 0,
        effortLevel: 0,
        categories: [],
        pluspoints: [],
        minuspoints: [],
        pointIntervalType: "DAILY",
        intervalDaysOfWeek: [],
        intervalDaysOfMonth: [],
        pointsCurrent: 0,
        pointsValued: 0,
        //image: "",
    })

    // @ts-ignore
    enum ToastType {
        SUCCESS = "success",
        ERROR = "error",
    }

    const [hobbies, setHobbies] = useState<Hobby[]>([])
    const [openHobbyEditModal, setOpenHobbyEditModal] = useState(false)
    const [openCalenderModal, setOpenCalenderModal] = useState(false)
    const [openToast, setOpenToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastType, setToastType] = useState<ToastType>(ToastType.ERROR)
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
    const [selectedInterval, setSelectedInterval] = useState<PointsInterval>()
    const [plusPoints, setPlusPoints] = useState<Point[]>([{ id: Date.now(), text: "", hobbyId: 0 }]);
    const [minusPoints, setMinusPoints] = useState<Point[]>([{ id: Date.now() + 1, text: "", hobbyId: 0 }]);
    const minuspointRefs = useRef<(HTMLInputElement | null)[]>([]);
    const pluspointRefs = useRef<(HTMLInputElement | null)[]>([]);


    {/* management of plus and minuspoints */ }
    const updatePoint = (type: "plus" | "minus", index: number, value: string) => {
        const setter = type === "plus" ? setPlusPoints : setMinusPoints;
        const state = type === "plus" ? plusPoints : minusPoints;

        const updated = [...state];
        updated[index] = { ...updated[index], text: value, hobbyId: null };
        setter(updated);
    };

    const addPoint = (type: "plus" | "minus") => {
        const setter = type === "plus" ? setPlusPoints : setMinusPoints;
        setter((prev) => [...prev, { id: Date.now(), text: "", hobbyId: currentHobby.id }]);
    };

    const removePoint = (type: "plus" | "minus", index: number) => {
        const setter = type === "plus" ? setPlusPoints : setMinusPoints;
        const current = type === "plus" ? plusPoints : minusPoints;

        const updated = [...current];
        updated.splice(index, 1);
        setter(updated);
    };
    {/* management of plus and minuspoints */ }

    const onChangeCategories = (newCategories: Category[]) => {
        setCurrentHobby((prev) => ({ ...prev, categories: newCategories }));
        setSelectedCategories(newCategories);
    }

    const onChangeIntervalPointType = (intervalType: PointsInterval) => {
        setCurrentHobby((prev) => ({ ...prev, pointIntervalType: intervalType }));
        setSelectedInterval(intervalType);
    }

    const closeHobbyEditModal = () => {
        setOpenHobbyEditModal(false)
    }

    const closeCalenderModal = () => {
        setOpenCalenderModal(false)
    }

    const handleOpenHobbyAddModal = () => {
        // reset edit hobby
        setEditHobby({
            id: 0,
            name: "",
            description: "",
            interestLevel: 0,
            effortLevel: 0,
            categories: [],
            pluspoints: [],
            minuspoints: [],
            pointIntervalType: "DAILY",
            intervalDaysOfWeek: [],
            intervalDaysOfMonth: [],
            pointsCurrent: 0,
            pointsValued: 0,
        });
        setCurrentHobby((prev) => ({
            id: prev.id,
            name: "",
            description: "",
            interestLevel: 0,
            effortLevel: 0,
            categories: [],
            pluspoints: [],
            minuspoints: [],
            pointIntervalType: "DAILY",
            intervalDaysOfWeek: [],
            intervalDaysOfMonth: [],
            pointsCurrent: 0,
            pointsValued: 0,
        }));
        setPlusPoints([{ id: Date.now(), text: "", hobbyId: 0 }]);
        setMinusPoints([{ id: Date.now() + 1, text: "", hobbyId: 0 }]);
        setOpenHobbyEditModal(true);
    }

    const handleCloseToast = () => {
        setOpenToast(false)
    }

    const handleEditHobby = (editHobby: Hobby) => {
        setCurrentHobby(editHobby);
        setPlusPoints(editHobby.pluspoints || [{ id: Date.now(), text: "", hobbyId: editHobby.id }]);
        setMinusPoints(editHobby.minuspoints || [{ id: Date.now() + 1, text: "", hobbyId: editHobby.id }]);
        setEditHobby(editHobby);
        setOpenHobbyEditModal(true);
    }

    const handleDeleteHobby = async (toDelHobby: Hobby) => {
        await deleteHobby(toDelHobby.id);
        getAllHobbies();
    }

    const handleAddEditHobby = async () => {
        /* handle plus minuspoints saving, if user doesn't change textfield values */
        const minusPointsToUpdate: Point[] = minuspointRefs.current
            .map((ref, index): Point | null =>
                ref
                    ? {
                        id: index,
                        text: ref.value,
                        hobbyId: currentHobby.id,
                    }
                    : null
            )
            .filter((point): point is Point => point !== null);

        const plusPointsToUpdate: Point[] = pluspointRefs.current
            .map((ref, index): Point | null =>
                ref
                    ? {
                        id: index,
                        text: ref.value,
                        hobbyId: currentHobby.id,
                    }
                    : null
            )
            .filter((point): point is Point => point !== null);

        setPlusPoints(plusPointsToUpdate);
        setMinusPoints(minusPointsToUpdate);
        /* handle plus minuspoints saving, if user doesn't change textfield values */

        const newHobby: Hobby = {
            id: Date.now(),
            name: currentHobby.name,
            description: currentHobby.description,
            interestLevel: currentHobby.interestLevel || 0,
            effortLevel: currentHobby.effortLevel || 0,
            categories: currentHobby.categories,
            pluspoints: plusPointsToUpdate,
            minuspoints: minusPointsToUpdate,
            pointIntervalType: "DAILY",
            intervalDaysOfWeek: [],
            intervalDaysOfMonth: [],
            pointsCurrent: currentHobby.pointsCurrent || 0,
            pointsValued: currentHobby.pointsValued || 0,
            //image: currentHobby.image,
        };

        if (editHobby.id === currentHobby.id) {
            try {
                // update hobby
                await putHobby(currentHobby, currentHobby.id);
                setHobbies((prev) =>
                    prev?.map((h) =>
                        h.id === editHobby.id ? { ...h, ...newHobby } : h
                    ) || [],
                );
            } catch (err: any) {
                setToastMessage("Error updating hobby: " + err.message);
                setToastType(ToastType.ERROR);
                setOpenToast(true);
            }
        } else {
            try {
                // add hobby
                await postHobby(currentHobby);
                setHobbies((prev) =>
                    [...(prev || []), newHobby]
                );
            } catch (err: any) {
                setToastMessage("Error creating hobby: " + err.message);
                setToastType(ToastType.ERROR);
                setOpenToast(true);
            }
        }

        getAllHobbies();
        setOpenHobbyEditModal(false);
    };

    const getAllHobbies = async () => {
        try {
            HobbyClient.getAllHobbies().then((res) => {
                setHobbies(res.data);
            }).catch((err) => {
                console.error("Error fetching hobbies:", err);
            });
        } catch (error) {
            console.error("Error in getAllHobbies:", error);
        }
    }

    const getAllCategories = async () => {
        try {
            CategoryClient.getAllCategories().then((res) => {
                setCategories(res.data);
            }).catch((err) => {
                console.error("Error fetching hobbies:", err);
            });
        } catch (error) {
            console.error("Error in getAllHobbies:", error);
        }
    }

    const postHobby = async (hobby: Hobby) => {
        await HobbyClient.postHobby(hobby);
    }

    const putHobby = async (hobby: Hobby, id: number) => {
        await HobbyClient.editHobby(id, hobby);
    }

    const deleteHobby = async (id: number) => {
        await HobbyClient.deleteHobby(id);
    }

    useEffect(() => {
        getAllHobbies();
        getAllCategories();
    }, []);

    useEffect(() => {
        setCurrentHobby((prev) => ({
            ...prev,
            pluspoints: plusPoints,
            minuspoints: minusPoints,
        }));
    }, [plusPoints, minusPoints]);


    /*useEffect(() => {
        console.log("categories", categories);
    }, [categories]);*/

    useEffect(() => {
        console.log("current hobbyy", currentHobby);
    }, [currentHobby]);

    const renderCalenderModal = () => {
        return (
            <Modal className='flex justify-center align-center' open={openCalenderModal} onClose={closeCalenderModal} component="div">
                <div className='w-auto h-auto flex justify-center align-center flex-col rounded-3xl overflow-x-auto my-6'>
                    <div className='bg-neutral-950 p-12 rounded-xl flex flex-col scroll-auto'>
                        <HighlightCalendar hobbyId={currentHobby.id} isInterval={false} setHobbies={setHobbies} />
                    </div>
                </div>
            </Modal>
        )
    }

    const renderHobbyEditModal = () => {
        return (
            <Modal className='flex justify-center align-center' open={openHobbyEditModal} onClose={closeHobbyEditModal} component="div">
                <div className='w-auto h-auto flex justify-center align-center flex-col rounded-3xl overflow-x-auto my-6'>
                    <div className='bg-neutral-950 p-12 rounded-xl flex flex-col scroll-auto'>
                        <IconButton
                            onClick={closeHobbyEditModal}
                            className="absolute! top-2! right-2! text-white"
                        >
                            <CloseIcon />
                        </IconButton>

                        <Typography variant="h6" component="h2" color="seondary" className='mb-2! text-gray-400 focus:outline-[#ffcc00]!'>
                            {editHobby?.id === currentHobby.id ? "Edit" : "Create"} Hobby
                        </Typography>

                        <TextField label="Hobbyname" className='mb-4!' variant="standard" color='primary' value={currentHobby.name} onChange={(e) => setCurrentHobby((prev) => ({ ...prev, name: e.target.value }))}></TextField>

                        <TextareaAutosize className='text-white border-gray-500 border-[1px] rounded-sm mb-2 p-1' value={currentHobby.description} color='primary' onChange={(e) => setCurrentHobby((prev) => ({ ...prev, description: e.target.value }))} minRows={3} placeholder="Description">
                        </TextareaAutosize>

                        <Typography gutterBottom>
                            Interest Level
                        </Typography>
                        <Slider
                            aria-label="Small steps"
                            defaultValue={0}
                            value={currentHobby.interestLevel}
                            onChange={(e, newValue) => setCurrentHobby((prev) => ({ ...prev, interestLevel: newValue as number }))}
                            step={1}
                            marks
                            min={0}
                            max={10}
                            valueLabelDisplay="auto"
                        />

                        <Typography gutterBottom>
                            Effort Level
                        </Typography>
                        <Slider
                            aria-label="Small steps"
                            defaultValue={0}
                            value={currentHobby.effortLevel}
                            onChange={(e, newValue) => setCurrentHobby((prev) => ({ ...prev, effortLevel: newValue as number }))}
                            step={1}
                            marks
                            min={0}
                            max={10}
                            valueLabelDisplay="auto"
                        />

                        <CategoryToggleGroup
                            items={categories}
                            selected={currentHobby.categories}
                            onChange={(newCategories) => onChangeCategories(newCategories)}
                            getKey={(c) => c.id}
                            getLabel={(c) => c.name}
                            multiple={true}
                        />

                        <PlusMinusInputs
                            plusPoints={plusPoints}
                            minusPoints={minusPoints}
                            pluspointRefs={pluspointRefs}
                            minuspointRefs={minuspointRefs}
                            onChange={updatePoint}
                            onAdd={addPoint}
                            onRemove={removePoint}
                        />


                        <Typography className='inline-block! border-b-2 border-white mb-2' gutterBottom>
                            Points
                        </Typography>


                        {/* Hobby Point Fields */}
                        <TextField label="Valued points" type='number' className='mb-4!' variant="standard" color='primary' value={currentHobby.pointsValued ?? 0} onChange={(e) => setCurrentHobby((prev) => ({ ...prev, pointsValued: e.target.value as unknown as number }))}></TextField>

                        <CategoryToggleGroup
                            items={["DAILY", "WEEKLY"]}
                            selected={currentHobby.pointIntervalType}
                            onChange={(newInterval) => onChangeIntervalPointType(newInterval as PointsInterval)}
                            getKey={(c) => c}
                            getLabel={(c) => c}
                            multiple={false}
                        />

                        {selectedInterval === "WEEKLY" && (
                            <WeekCalendar hobbyId={currentHobby.id} isInterval={true} setHobbies={setHobbies} />
                        )}

                        {selectedInterval === "CUSTOM" && (
                            <HighlightCalendar hobbyId={currentHobby.id} isInterval={false} setHobbies={setHobbies} />
                        )}

                        <Button className='mt-5 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-4 py-2 rounded-xl shadow-md transition duration-200 hover:border-[#ffcc00]!' variant='outlined' onClick={handleAddEditHobby}>{editHobby?.id === currentHobby.id ? "Edit" : "Create"}</Button>

                    </div>
                </div>

            </Modal>
        )
    }

    const renderToast = () => {
        return (
            <Snackbar open={openToast} autoHideDuration={3000} onClose={handleCloseToast}>
                <Alert onClose={handleCloseToast} severity={toastType} sx={{ width: '100%' }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        )
    }

    return (
        <>

            <div className='max-w-xl mx-auto p-4'>
                <Typography variant="h3" component="h2" color="seondary" className='mb-6! text-gray-400'>
                    Habits & Tasks
                </Typography>

                <div className="flex flex-col gap-2">

                    {hobbies?.map((hobby) => (
                        <div
                            key={hobby.id}
                            className="hover:cursor-pointer mb-6 w-full px-8 py-4 bg-[#ffcc00] shadow-[-12px_12px_0_0_#e6b800] border-[#000] border-b-4 border-l-4 hover:shadow-none transition-all duration-[250ms] hover:translate-x-[4px] hover:translate-y-[4px]"
                            style={{ transform: 'skew(-20deg)' }}
                            onClick={() => handleEditHobby(hobby)}>
                            <div
                                className='flex p-2 justify-between items-stretch'
                                style={{ transform: 'skew(20deg)' }}
                            >


                                <div className='row-one gap-2 flex flex-col items-start justify-between p-2'>
                                    <Typography variant="h6" component="h2" color="seondary" className='text-black font-black!'>
                                        {hobby.name}
                                    </Typography>

                                    <div className='row-two'>
                                        <WeekCalendar hobbyId={hobby.id} setHobbies={setHobbies} isInterval={false}></WeekCalendar>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-between">


                                    <span color="secondary" className='text-black font-bold! text-5xl'>
                                        {hobby.pointsValued &&
                                            hobby.pointsCurrent
                                        }

                                    </span>

                                    <IconButton color="primary" onClick={() => handleDeleteHobby(hobby)}>
                                        <DeleteIcon sx={{ color: "black" }} />
                                    </IconButton>


                                    <IconButton color="primary" onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentHobby(hobby);
                                        setOpenCalenderModal(true)
                                    }}>
                                        <CalendarMonthIcon sx={{ color: "black" }} />
                                    </IconButton>
                                </div>
                            </div>


                        </div>
                    ))}
                </div>

                <Button variant='outlined' color='secondary' className='bg-orange-500 hover:border-[#ffcc00]! mb-16!' onClick={handleOpenHobbyAddModal}>Create</Button>
                {renderHobbyEditModal()}

                {renderCalenderModal()}

                {renderToast()}

            </div>
        </>
    )
}

export default Hobbies