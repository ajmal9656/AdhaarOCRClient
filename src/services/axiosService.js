import axiosUrl from "../utils/axios";

export const parseData=(formData)=>{
   
    
    return axiosUrl.post('/parseData', formData);
    
}