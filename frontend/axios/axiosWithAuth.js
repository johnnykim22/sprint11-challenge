import axios from 'axios';

const axiosWithAuth = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: 'http://localhost:9000', // or your backend base URL
    headers: {
      Authorization: token,
    },
  });
};

export default axiosWithAuth;