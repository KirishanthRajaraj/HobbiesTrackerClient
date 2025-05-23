import { useState } from 'react'
import './App.css'
import { Box, Button, IconButton, Modal, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

function App() {
  const [count, setCount] = useState(0)
  const [openHobbyEditModal, setOpenHobbyEditModal] = useState(false)

  const closeHobbyEditModal = () => {
    setOpenHobbyEditModal(false)
  }

  const handleOpenHobbyEditModal = () => {
    setOpenHobbyEditModal(true);
  }

  return (
    <>
      <div className=''>
        <Modal className='flex justify-center align-center' open={openHobbyEditModal} onClose={closeHobbyEditModal} component="div">
          <div className='w-auto h-auto flex justify-center align-center flex-col rounded-3xl'>
            <div className='bg-neutral-950 p-6 rounded-xl'>
              <IconButton
                onClick={closeHobbyEditModal}
                className="absolute! top-2! right-2! text-white"
              >
                <CloseIcon />
              </IconButton>

              <Typography variant="h6" component="h2" className='mb-2!'>
                Create Hobby
              </Typography>

              <TextField label="Hobbyname" variant="standard" color='primary'></TextField>
            </div>
          </div>

        </Modal>
        <Button variant='outlined' onClick={handleOpenHobbyEditModal}>test</Button>
      </div>
    </>
  )
}

export default App
