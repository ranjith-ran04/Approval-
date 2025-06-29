  import {host} from '../../constants/backendpath';
  import axios from 'axios';
  
  const handleForm = async (endpoint,body) => {
    try {
      const res = await axios.post(`${host}${endpoint}`,body,{ responseType: "blob" });
      if (res.status === 200) {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    } catch (error) {
      console.log("error failed to send request", error);
    }
  };

  export default handleForm;