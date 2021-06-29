import seatResponse from './mockedResponse'

const axiosGetSeats = async () => {
  return Promise.resolve(seatResponse)
}

export default axiosGetSeats;