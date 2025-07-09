import BranchForm from "./BranchForm";
import axios from "axios";
import { host } from "../../constants/backendpath";

function EditBranch({ state, setCurrent }) {
  const handleEditSubmit = async (data) => {
    try {
      const changedFields = {};

      state.NBA_2020 === 1 ? (state.NBA_2020 = "yes") : (state.NBA_2020 = "no");

      Object.keys(data).forEach((key) => {
        if (String(data[key]) !== String(state[key])) {
          changedFields[key] = data[key];
        }
      });

      if ("NBA_2020" in changedFields) {
        changedFields.NBA_2020 =
          changedFields.NBA_2020.toLowerCase() === "yes" ? 1 : 0;
      }

      const res = await axios.put(`${host}branch`, {
        ...changedFields,
        collegeCode: state.c_code,
        b_code: state.b_code,
      });

      if(res.status === 200 || res.status === 201 ){
        console.log("Branch Edited Successfully");  
      }else {
        console.error("Failed to edit branch");
      }
    } catch (err) {
      console.error("update failed : ", err);
    }
  };

  return (
    <BranchForm
      heading="EDIT BRANCH"
      values={state}
      onSubmit={handleEditSubmit}
      buttonText="SAVE"
      isEditMode={true}
      setCurrent={setCurrent}
    />
  );
}
export default EditBranch;
