import React from 'react'
import { toast } from 'react-toastify'

export const ShowToast = (message,type,) => {
    toast[type](message,{
        position:"top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
    })
}
