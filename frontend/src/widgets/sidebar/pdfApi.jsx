    import {host} from '../../constants/backendpath';
    import axios from 'axios';
    
    const handleForm = async (endpoint,admin,c_code) => {
      try {
        var res;
        if(!admin){
        res = await axios.get(`${host}${endpoint}`,{withCredentials:true,responseType: "blob" });
      }
      else{
        // console.log('post')
        res = await axios.post(`${host}${endpoint}`,{collegeCode:c_code},{withCredentials:true,responseType:"blob"});
        // console.log(res,res.status)
      }
        if (res.status === 200) {
          // console.log('hi')
          const blob = new Blob([res.data], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
        }
      } catch (error) {
        console.log("error failed to send request", error);
      }
    };

    export default handleForm;