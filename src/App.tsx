import { useEffect, useState } from 'react'
import './App.css'
import { Alert, Box, Button, IconButton, Modal, Snackbar, TextareaAutosize, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as HobbyClient from './client/hobby.tsx';
import type { Hobby } from './interfaces/Hobby.tsx';
import type { Hobbies } from './interfaces/Hobbies.tsx';


function App() {
  const [currentHobby, setCurrentHobby] = useState<Hobby>({
    id: Date.now(),
    name: "",
    description: "",
    //image: "",
  })
  const [editHobby, setEditHobby] = useState<Hobby>({
    id: Date.now(),
    name: "",
    description: "",
    //image: "",
  })

  // @ts-ignore
  enum ToastType {
    SUCCESS = "success",
    ERROR = "error",
  }

  const [hobbies, setHobbies] = useState<Hobby[]>()
  const [openHobbyEditModal, setOpenHobbyEditModal] = useState(false)
  const [openToast, setOpenToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<ToastType>(ToastType.ERROR)

  const closeHobbyEditModal = () => {
    setOpenHobbyEditModal(false)
  }

  const handleOpenHobbyAddModal = () => {
    // reset edit hobby
    setEditHobby({
      id: 0,
      name: "",
      description: "",
      //image: "",
    });
    setCurrentHobby((prev) => ({
      id: prev.id,
      name: "",
      description: "",
      //image: "",
    }));
    setOpenHobbyEditModal(true);
  }

  const handleCloseToast = () => {
    setOpenToast(false)
  }

  const handleEditHobby = (editHobby: Hobby) => {
    setCurrentHobby(editHobby);
    setEditHobby(editHobby);
    setOpenHobbyEditModal(true);
  }

  const handleDeleteHobby = async (toDelHobby: Hobby) => {
    await deleteHobby(toDelHobby.id);
    getAllHobbies();
  }

  const handleAddEditHobby = async () => {
    const newHobby: Hobby = {
      id: Date.now(),
      name: currentHobby.name,
      description: currentHobby.description,
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
        console.log(res.data);
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
  }, []);

  useEffect(() => {
    console.log("hobbies fetched", hobbies);
  }, [hobbies]);

  useEffect(() => {
    console.log("current hobby: ", currentHobby);
  }, [currentHobby]);

  const renderHobbyEditModal = () => {
    return (
      <Modal className='flex justify-center align-center' open={openHobbyEditModal} onClose={closeHobbyEditModal} component="div">
        <div className='w-auto h-auto flex justify-center align-center flex-col rounded-3xl'>
          <div className='bg-neutral-950 p-6 rounded-xl flex flex-col'>
            <IconButton
              onClick={closeHobbyEditModal}
              className="absolute! top-2! right-2! text-white"
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h6" component="h2" color="seondary" className='mb-2! text-gray-400'>
              {editHobby?.id === currentHobby.id ? "Edit" : "Create"} Hobby
            </Typography>

            <TextField label="Hobbyname" className='mb-4!' variant="standard" color='primary' value={currentHobby.name} onChange={(e) => setCurrentHobby((prev) => ({ ...prev, name: e.target.value }))}></TextField>

            <TextareaAutosize className='text-white border-gray-500 border-[1px] rounded-sm mb-2 p-1' value={currentHobby.description} color='primary' onChange={(e) => setCurrentHobby((prev) => ({ ...prev, description: e.target.value }))} minRows={3} placeholder="Description">
            </TextareaAutosize>

            <Button variant='outlined' onClick={handleAddEditHobby}>{editHobby?.id === currentHobby.id ? "Edit" : "Create"}</Button>

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
        <Typography variant="h6" component="h2" color="seondary" className='mb-2! text-gray-400'>
          Hobbies
        </Typography>

        <div className="flex flex-col gap-2">

          {hobbies?.map((hobby) => (
            <div
              key={hobby.id}
              className="flex items-center justify-between w-full px-4 py-2 bg-white hover:bg-gray-100 rounded-xl shadow transition-all"
            >
              <Typography variant="h6" component="h2" color="seondary" className='mb-2! text-black'>
                {hobby.name}
              </Typography>

              <IconButton color="secondary" onClick={() => handleEditHobby(hobby)}>
                <EditIcon />
              </IconButton>

              <IconButton color="secondary" onClick={() => handleDeleteHobby(hobby)}>
                <DeleteIcon />
              </IconButton>
            </div>

          ))}
        </div>

        <Button variant='outlined' color='secondary' className='bg-orange-500' onClick={handleOpenHobbyAddModal}>Create</Button>
        {renderHobbyEditModal()}

        {renderToast()}
      </div>
    </>
  )
}

export default App
