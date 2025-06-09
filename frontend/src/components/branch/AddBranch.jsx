import BranchForm from './BranchForm';

function AddBranch() {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    alert('Branch Added!');
  };
  return <BranchForm heading="ADD BRANCH" onSubmit={handleSubmit} buttonText="Add Branch" isEditMode={false} msg="Branch Added Successfully" />;
}
export default AddBranch