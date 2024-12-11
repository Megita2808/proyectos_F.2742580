"use client"
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import ButtonOnClick from '@/components/Buttons/ButtonOnClick';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "70%",
  maxHeight: "90%",
  boxShadow: 24,
  backgroundColor: "transparent",
  borderRadius: "15px",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  scrollbarWidth: "none",
};

const BasicModal: React.FC<{children?: any, tituloBtn?: string, tituloModal?: string}> = ({children, tituloBtn = "Por Defecto", tituloModal="Titulo Por Defecto"}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <ButtonOnClick
        label={tituloBtn}
        customClasses=" text-xl font-semibold border border-primary hover:bg-primary hover:text-white text-primary rounded-[5px] px-10 py-3 lg:px-8 xl:px-10"
        onClick={handleOpen}
      >
      </ButtonOnClick>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        sx={{
          zIndex: 1000,
        }}
      >
        <Fade in={open}>
            <Box sx={style}>
              <div className='rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card text-xl'>
                <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3 flex flex-row justify-between">
                  <h3 className="font-semibold text-dark dark:text-white text-3xl">
                      {tituloModal}
                  </h3>
                  <div className=" text-red-500 cursor-pointer hover:scale-125 duration-300">
                      <button onClick={handleClose}><CloseRoundedIcon fontSize="large"/></button>
                      
                  </div>
                </div>
              </div>
              {/* {children} */}
              {React.cloneElement(children, { handleClose })}
            </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default BasicModal;