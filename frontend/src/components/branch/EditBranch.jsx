import { useLocation } from 'react-router-dom';
import BranchForm from './BranchForm';

function EditBranch() {
  const { state } = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle saving updates here
    alert('Changes Saved!');
  };

  return <BranchForm heading="EDIT BRANCH" values={state} onSubmit={handleSubmit} buttonText="Save" isEditMode={true}/>;
}
export default EditBranch
