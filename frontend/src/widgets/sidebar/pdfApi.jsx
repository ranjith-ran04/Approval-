  import {adminhost,host} from '../../constants/backendpath';
  import axios from 'axios';
  
  const handleForm = async (endpoint,admin) => {
    try {
      if(admin){
        const res = await axios.get(`${adminhost}${endpoint}`,{withCredentials:true,responseType: "blob" });
      if (res.status === 200) {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    }else{
      const res = await axios.get(`${host}${endpoint}`,{withCredentials:true,responseType: "blob" });
      if (res.status === 200) {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    }
    } catch (error) {
      console.log("error failed to send request", error);
    }
  };

  export default handleForm;