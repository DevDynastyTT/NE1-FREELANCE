import '../../static/css/jobs/reportForm.css'
import React, { useState } from 'react';
import {reportJob} from '../utils/APIRoutes'



export default function ReportForm(props){
  const [showForm, setShowForm] = useState(props.showForm);
  const [message, setMessage] = useState('');

  const handleReportButtonClick = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    props.setReportForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const reportData = {
      job_id: props.jobInfo[0].job_id,
      jobTitle: props.jobInfo[0].job_title,
      user_id: props.jobInfo[0].user_id,
      freelancer_id: props.jobInfo[0].freelancer_id,
      reason: formData.get('reason'),
      reportCategory: formData.get('reportReason'),
    };



    try {
      const response = await axios.post(reportJob, reportData);

      const data = response.data

      if(data.error) {
        console.error(data.error)
        setMessage(data.error)
        return
      }

      setMessage(data.message)
      console.log(data.message)
    } catch (error) {
      console.error('Error while submitting report:', error);
      setMessage('An error occurred while submitting the report');
    }
  };


  if (showForm) {
    return (
      <div className="report-form-container">
        <div className="report-form">
        <div className="update-profile-form-container">

              {message.length > 0 && (
                  <div className="alert alert-warning alert-dismissible fade show" role="alert">
                  <strong className="message">
                      <i className="fa-solid"></i>
                  {message }</strong> 
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
              )}
        </div> 

          <h4>Let us know why you want to report this job</h4>
          <p className="report-form-subtitle">Your report will be kept anonymous to everyone</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="form-check">
                <input type="radio" id="non-original" name="reportReason" value="Non Original Content" />
                <label htmlFor="non-original">Non Original Content</label>
              </div>
              <div className="form-check">
                <input type="radio" id="inappropriate" name="reportReason" value="Inappropriate Gig" />
                <label htmlFor="inappropriate">Inappropriate Gig</label>
              </div>
              <div className="form-check">
                <input type="radio" id="trademark" name="reportReason" value="Trademark Violations" />
                <label htmlFor="trademark">Trademark Violations</label>
              </div>
              <div className="form-check">
                <input type="radio" id="copyright" name="reportReason" value="Copyright Violations" />
                <label htmlFor="copyright">Copyright Violations</label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="reason">Reason for report:</label>
              <textarea id="reason" name="reason" className="form-control" rows="4"></textarea>
            </div>
            <button type="submit" className="btn btn-primary">{message && message.length > 0 ? (<>Report</>): (<>Report Again</>)}</button>
          </form>
          <p className="close-btn" 
          onClick={handleFormClose}><span className="close-icon">x</span></p>
        </div>
      </div>
    );
  }
}

