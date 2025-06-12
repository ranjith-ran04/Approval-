import BranchForm from './BranchForm';

function AddBranch() {
  const handleSubmit = (data) => {
    console.log(data);
  };
  return <BranchForm heading="ADD BRANCH" onSubmit={handleSubmit} buttonText="Add Branch" isEditMode={false} />;
}
export default AddBranch