const mongoose = require('mongoose');
const ReportJob = require('../models/reportModel');

const reportJob = async(request, response) => {
    const {
        job_id,
        jobTitle,
        user_id,
        freelancer_id,
        reason,
        reportCategory
      } = request.body;
      console.log(job_id, jobTitle, user_id, freelancer_id, reason, reportCategory);

      
  try {
    ReportJob.create({
      job_id,
      jobTitle,
      user_id,
      freelancer_id,
      reason,
      reportCategory
    });
    response.status(201).json({ message: 'Report submitted successfully' });
  } catch (error) {
    console.error('Error while submitting report:', error);
    return response.status(500).json({ error: 'An error occurred while submitting the report' });
  }
}

export default reportJob