import axios from "axios";

const axiosUrl =  axios.create({
    baseURL:"https://adhaarocrserver.onrender.com/",
    withCredentials:true
});

export default axiosUrl;

