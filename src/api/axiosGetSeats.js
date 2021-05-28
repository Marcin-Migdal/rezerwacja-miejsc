import axios from "axios";

export const axiosGetSeats = async () => {
  return axios.get('http://localhost:3000/seats')
    .then((res) => res.data)
}