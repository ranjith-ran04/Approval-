import "./branch.css";
import EditBranch from "./EditBranch";

function Branch({setCurrent,setState}) {
  return (
    <div id="mainB">
      <div className= "box">
        <div className="first">
          <h2 className="heading">BRANCH DETAILS</h2>
          <button
            className="addBranch-btn"
            onClick={() => setCurrent(3)}
          >
            Add Branch
          </button>
        </div>
        <div className="table">
          <div className="table-header">
            <div>Edit</div>
            <div>Branch Code</div>
            <div>Branch Name</div>
            <div>Approved In Take</div>
            <div>First Year Admitted</div>
            <div>Discontinued</div>
            <div>Transferred Students From Your College</div>
            <div>Transferred Students To Your College</div>
            <div>LAP</div>
            <div>Year of Starting the Course</div>
            <div>Accredition Valid Upto</div>
            <div>NBA Status</div>
            <div>Delete</div>
          </div>

          {branchData.map((branch, index) => (
            <div className="table-row" key={index}>
              <div>
                <button
                  className="edit-btn"
                  onClick={() => {setCurrent(4);setState({code:branch.code,name:branch.name})}}
                >
                  Edit
                </button>
              </div>
              <div>{branch.code}</div>
              <div>{branch.name}</div>
              <div>{branch.approvedIntake}</div>
              <div>{branch.firstYearAdmitted}</div>
              <div>{branch.discontinued}</div>
              <div>{branch.transferredFrom}</div>
              <div>{branch.transferredTo}</div>
              <div>{branch.lap}</div>
              <div>{branch.yearStart}</div>
              <div>{branch.accUpto}</div>
              <div>{branch.nba}</div>
              <div>
                <button className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
const branchData = [
  {
    code: "CM",
    name: "COMPUTER SCIENCE AND ENGINEERING (SS)",
    approvedIntake: 118,
    firstYearAdmitted: 117,
    discontinued: 2,
    transferredFrom: 0,
    transferredTo: 0,
    lap: 1,
    yearStart: 2006,
    accUpto: 2029,
    nba: "Yes",
  },
  {
    code: "CS",
    name: "COMPUTER SCIENCE AND ENGINEERING",
    approvedIntake: 59,
    firstYearAdmitted: 58,
    discontinued: 0,
    transferredFrom: 0,
    transferredTo: 0,
    lap: 1,
    yearStart: 1982,
    accUpto: 2029,
    nba: "Yes",
  },
  {
    code: "CM",
    name: "COMPUTER SCIENCE AND ENGINEERING (SS)",
    approvedIntake: 118,
    firstYearAdmitted: 117,
    discontinued: 2,
    transferredFrom: 0,
    transferredTo: 0,
    lap: 1,
    yearStart: 2006,
    accUpto: 2029,
    nba: "Yes",
  },
  {
    code: "CS",
    name: "COMPUTER SCIENCE AND ENGINEERING",
    approvedIntake: 59,
    firstYearAdmitted: 58,
    discontinued: 0,
    transferredFrom: 0,
    transferredTo: 0,
    lap: 1,
    yearStart: 1982,
    accUpto: 2029,
    nba: "Yes",
  },
  {
    code: "CM",
    name: "COMPUTER SCIENCE AND ENGINEERING (SS)",
    approvedIntake: 118,
    firstYearAdmitted: 117,
    discontinued: 2,
    transferredFrom: 0,
    transferredTo: 0,
    lap: 1,
    yearStart: 2006,
    accUpto: 2029,
    nba: "Yes",
  },
  {
    code: "CS",
    name: "COMPUTER SCIENCE AND ENGINEERING",
    approvedIntake: 59,
    firstYearAdmitted: 58,
    discontinued: 0,
    transferredFrom: 0,
    transferredTo: 0,
    lap: 1,
    yearStart: 1982,
    accUpto: 2029,
    nba: "Yes",
  },
  {
    code: "CM",
    name: "COMPUTER SCIENCE AND ENGINEERING (SS)",
    approvedIntake: 118,
    firstYearAdmitted: 117,
    discontinued: 2,
    transferredFrom: 0,
    transferredTo: 0,
    lap: 1,
    yearStart: 2006,
    accUpto: 2029,
    nba: "Yes",
  },
  {
    code: "CS",
    name: "COMPUTER SCIENCE AND ENGINEERING",
    approvedIntake: 59,
    firstYearAdmitted: 58,
    discontinued: 0,
    transferredFrom: 0,
    transferredTo: 0,
    lap: 1,
    yearStart: 1982,
    accUpto: 2029,
    nba: "Yes",
  },
  // Add more rows if needed
];

export default Branch;
