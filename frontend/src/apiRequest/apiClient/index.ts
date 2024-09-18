
import axios from 'axios'

export const apiClient =  axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  
  headers: {
    "Content-Type": "application/json",
  },
})





export const apiClientAuth =  axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
})
