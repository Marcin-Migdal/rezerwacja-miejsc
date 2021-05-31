import axios from "axios";

const axiosGetSeats = async () => {
  return axios.get('http://localhost:3000/seats')
    .then((res) => res.data)
}

export default axiosGetSeats;