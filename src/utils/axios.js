import axios from "axios";

const axiosUrl =  axios.create({
    baseURL:"http://localhost:3000/",
    withCredentials:true
});

export default axiosUrl;