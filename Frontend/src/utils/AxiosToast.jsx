import React from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AxiosToastError= ()=>{
    toast.error(
        error(error?.response?.formData?.message)
    )

}
export default AxiosToastError;