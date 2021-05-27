import axios from "axios";

export const getSeats = async () => {
  return axios.get('http://localhost:3000/seats')
    .then((res) => res.data);
}