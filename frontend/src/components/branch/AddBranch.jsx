import BranchForm from './BranchForm';

function AddBranch() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Get form values, add branch to list (optional logic for now)
    alert('Branch Added!');
  };
  return <BranchForm heading="ADD BRANCH" onSubmit={handleSubmit} buttonText="Add Branch" isEditMode={false} />;
}
export default AddBranch