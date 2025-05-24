import { useEffect, useState } from 'react'
import './App.css'
import { Box, Button, IconButton, Modal, TextareaAutosize, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
interface Hobby {
  id: number
  name: string
  description?: string
  image?: string
}

interface Hobbies {
  hobbies: Hobby[]
}

function App() {
  const [hobby, setHobby] = useState<Hobby>({
    id: Date.now(),
    name: "",
    description: "",
    image: "",
  })
  const [editHobby, setEditHobby] = useState<Hobby>({
    id: Date.now(),
    name: "",
    description: "",
    image: "",
  })

  const [hobbies, setHobbies] = useState<Hobbies>()
  const [openHobbyEditModal, setOpenHobbyEditModal] = useState(false)

  const closeHobbyEditModal = () => {
    setOpenHobbyEditModal(false)
  }

  const handleOpenHobbyEditModal = () => {
    // reset edit hobby
    setEditHobby({
      id: Date.now(),
      name: "",
      description: "",
      image: "",
    });
    setOpenHobbyEditModal(true);
  }

  const handleEditHobby = (editHobby: Hobby) => {
    setHobby(editHobby);
    setEditHobby(editHobby);
    setOpenHobbyEditModal(true);
  }

  const handleAddEditHobby = () => {
    const newHobby: Hobby = {
      id: Date.now(),
      name: hobby.name,
      description: hobby.description,
      image: hobby.image,
    };

    if(editHobby.id === hobby.id) {
      // update hobby
      setHobbies((prev) => ({
        hobbies: prev?.hobbies.map((h) =>
          h.id === editHobby.id ? { ...h, ...newHobby } : h
        ) || [],
      }));
    } else {
      setHobbies((prev) => ({
        hobbies: [...(prev?.hobbies || []), newHobby],
      }));
    }

    setOpenHobbyEditModal(false);
  };

  useEffect(() => {
    //console.log(hobbies);
  }, [hobbies]);

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
              {editHobby?.id === hobby.id ? "Edit" : "Create"} Hobby
            </Typography>

            <TextField label="Hobbyname" className='mb-4!' variant="standard" color='primary' value={hobby.name} onChange={(e) => setHobby((prev) => ({ ...prev, name: e.target.value }))}></TextField>

            <TextareaAutosize className='text-white' value={hobby.description} color='primary' onChange={(e) => setHobby((prev) => ({ ...prev, description: e.target.value }))} minRows={3} placeholder="Description">
            </TextareaAutosize>

            <Button variant='outlined' onClick={handleAddEditHobby}>{editHobby?.id === hobby.id ? "Edit" : "Create"}</Button>

          </div>
        </div>

      </Modal>
    )
  }

  return (
    <>
      <div className='max-w-xl mx-auto p-4'>
        <Typography variant="h6" component="h2" color="seondary" className='mb-2! text-gray-400'>
          Hobbies
        </Typography>

        <div className="flex flex-col gap-2">

          {hobbies?.hobbies.map((hobby) => (
            <div
              key={hobby.id}
              className="flex items-center justify-between w-full px-4 py-2 bg-white hover:bg-gray-100 rounded-xl shadow transition-all"
            >
              <Typography variant="h6" component="h2" color="seondary" className='mb-2! text-black'>
                {hobby.name}
              </Typography>

              <IconButton color="primary" onClick={() => handleEditHobby(hobby)}>
                <EditIcon />
              </IconButton>
            </div>

          ))}
        </div>

        <Button variant='outlined' color='secondary' className='bg-orange-500' onClick={handleOpenHobbyEditModal}>test</Button>
        {renderHobbyEditModal()}

      </div>
    </>
  )
}

export default App
