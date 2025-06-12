import BranchForm from './BranchForm';

function EditBranch({state}) {
  const handleSubmit = (data) => {
    console.log(data);
  };

  return <BranchForm heading="EDIT BRANCH" values={state} onSubmit={handleSubmit} buttonText="SAVE" isEditMode={true} />;
}
export default EditBranch
