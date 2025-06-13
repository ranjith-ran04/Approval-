import BranchForm from './BranchForm';

function EditBranch({state,setCurrent}) {
  const handleSubmit = (data) => {
    console.log(data);
  };

  return <BranchForm heading="EDIT BRANCH" values={state} onSubmit={handleSubmit} buttonText="SAVE" isEditMode={true} setCurrent={setCurrent} />;
}
export default EditBranch
