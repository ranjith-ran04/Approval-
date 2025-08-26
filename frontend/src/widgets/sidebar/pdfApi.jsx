import { host, adminhost } from "../../constants/backendpath";
import axios from "axios";

const handleForm = async (endpoint, admin, collegeCode, list, approved, supp, data) => {
  try {
    var res;
    const body = { data }
    // alert(endpoint)
    if (endpoint == "formApprv") {
      res = await axios.post(`${host}${endpoint}`, body, {
        withCredentials: true,
        responseType: "blob",
      });
    }
    else if (!admin) {
      res = await axios.get(`${host}${endpoint}`, {
        withCredentials: true,
        responseType: "blob",
      });
    } else {
      const body = { collegeCode, supp };

      if (Array.isArray(list) && list.length > 0) {
        body.caste = list;
      }
      if (approved) {
        body.approved = true;
      } else {
        body.approved = false;
      }
      if (supp) {
        body.supp = true;
      }
      else {
        body.supp = false;
      }
      // console.log(body);
      res = await axios.post(
        `${list ? adminhost : host}${endpoint}`,
        body,
        { withCredentials: true, responseType: "blob" }
      );
    }
    if (res.status === 200) {
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  } catch (error) {
    console.log("error failed to send request", error);
  }
};

export default handleForm;
