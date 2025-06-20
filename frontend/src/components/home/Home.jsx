import "./home.css";

function Home() {
  const details = {
    Taluk: "Mambam",
    Contituency: "Mylapore",
    District: "Chennai",
    Pincode: "620001",
  };

  const contactDetails = {
    Chairman: "Vishnu (ph.no: 9897969594)",
    Principal: "Dr.K.S.EASWARAKUMAR (ph.no: 04422358491)",
    College: "044-22358491",
  };

  return (
    <div className="container">
      <h2 className="heading">1. UNIVERSITY COLLEGE OF ENGINEERING</h2>
      <div className="content-box">
        <div className="section">
          <h3>Location Details</h3>
          {Object.entries(details).map(([label, value]) => (
            <div className="row" key={label}>
              <span className="label">{label}</span>
              <span className="separator">:</span>
              <span className="value">{value}</span>
            </div>
          ))}
        </div>

        <div className="section">
          <h3>Contact Details</h3>
          <div className="row">
            <span className="label">Chairman</span>
            <span className="separator">:</span>
            <span className="value">{contactDetails.Chairman}</span>
          </div>
          <div className="row">
            <span className="label">Principal/Dean</span>
            <span className="separator">:</span>
            <span className="value">{contactDetails.Principal}</span>
          </div>
          <div className="row">
            <span className="label">College Contact No</span>
            <span className="separator">:</span>
            <span className="value">{contactDetails.College}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;