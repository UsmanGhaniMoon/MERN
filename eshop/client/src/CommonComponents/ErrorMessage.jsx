import React, { useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const ErrorMessage = ({ showToast, msg, type = "error" }) => {
    const notify = useCallback(() => {
        const toastType = toast[type] || toast.error
        toast[type](msg, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [msg, type]);

    useEffect(() => {
        if (showToast) {
            notify();
        }
    }, [showToast, notify]); 

    return <ToastContainer />;
};

export default ErrorMessage;
