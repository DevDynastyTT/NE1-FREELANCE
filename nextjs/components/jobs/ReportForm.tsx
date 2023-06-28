import '@styles/jobs/reportForm.css'
import {reportJob} from '@utils/APIRoutes'

import axios from 'axios';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';

export default function ReportForm(
  { showForm, 
    setReportForm, 
    jobInfo} : 
  { showForm: boolean, 
    setReportForm: Dispatch<SetStateAction<boolean>>, 
    jobInfo:any })
  {
  
    const [_showForm, setShowForm] = useState<boolean>(showForm);
    const [message, setMessage] = useState<string>();

  function handleReportButtonClick () { setShowForm(true) };

  function handleFormClose() {
    setShowForm(false);
    setReportForm(false);
  }

  const handleSubmit = async (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const reportData = {
      job_id: (jobInfo && jobInfo?.length > 0 ) ? jobInfo[0].job_id : null,
      jobTitle: (jobInfo && jobInfo?.length > 0 ) ? jobInfo[0].job_title : null,
      user_id: (jobInfo && jobInfo?.length > 0 ) ? jobInfo[0].user_id : null,
      freelancer_id: (jobInfo && jobInfo?.length > 0 ) ? jobInfo[0].freelancer_id : null,
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

                {message && message?.length > 0 && (
                    <div className="alert alert-warning alert-dismissible fade show" role="alert">
                      <strong className="message">
                          <i className="fa-solid"/>
                        {message }
                      </strong> 
                      <button 
                        className="btn-close" 
                        type="button" 
                        data-bs-dismiss="alert" 
                        aria-label="Close" />
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
                <textarea id="reason" name="reason" className="form-control" rows={4} />
              </div>

              <button type="submit" className="btn btn-primary">{message && message.length > 0 ? (<>Report</>): (<>Report Again</>)}</button>
            
            </form>
            
            <p 
              className="close-btn" 
              onClick={handleFormClose}>
                <span className="close-icon">x</span>
            </p>
        </div>
      </div>
    );
  }
}

