import BranchForm from './BranchForm';

function AddBranch({setCurrent}) {
  const handleSubmit = (data) => {
    console.log(data);
  };
  return <BranchForm heading="ADD BRANCH" onSubmit={handleSubmit} buttonText="Add Branch" isEditMode={false} setCurrent={setCurrent}/>;
}
export default AddBranch