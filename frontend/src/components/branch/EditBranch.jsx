import BranchForm from './BranchForm';

function EditBranch({state}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Changes Saved!');
  };

  return <BranchForm heading="EDIT BRANCH" values={state} onSubmit={handleSubmit} buttonText="Save" isEditMode={true}/>;
}
export default EditBranch
