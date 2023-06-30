
const head = `<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  /* Add necessary CSS styles for the invoice template */
  body {
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: black !important;
    background-color: white !important;
  }

  .invoice-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #dddddd;
    border-radius: 4px;
  }

  .invoice-header {
    display: inline-block;
    height: 10rem;
    margin-top: -2%;
    height: 5rem;
  }

  .invoice-logo {
    width: 100%;
    height: 100%;
  }

  .invoice-greeting {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    margin-top: -5%;
  }

  .invoice-details {
    margin-bottom: 20px;
  }

  .invoice-details-title {
    font-weight: bold;
  }

  .invoice-table {
    width: 100%;
    margin-bottom: 20px;
    border-collapse: collapse;
  }
  .invoice-table td{
    text-align: right !important;
  }

  .invoice-table th, .invoice-table td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #dddddd;
  }

  .invoice-table th {
    background-color: #f9f9f9;
  }

  .invoice-footer {
    text-align: right;
  }
</style>
</head>`

export default function template (username, jobFee, serviceFee, transaction_id, totalFee): string{
    const date = new Date(); // Assuming you have a Date object

    const options: any = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    console.log(formattedDate)
    return `<!DOCTYPE html>
    <html>
    ${head}
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <img src="https://th.bing.com/th/id/OIP.lSaystdVXnyZHtRfLB9l1AHaHa?pid=ImgDet&rs=1" alt="NE1-FREELANCE Logo" class="invoice-logo">
        </div>
    
        <div class="invoice-greeting">
          <h1>Thank you for your payment!</h1>
        </div>
    
        <div class="invoice-details">
          <p>
            Dear Customer,
            <br>
            We would like to express our sincere gratitude for choosing NE1-FREELANCE and for your recent payment. Your support is invaluable to us, and we are committed to providing you with the best possible service and experience.
          </p>
          <p>
            At NE1-FREELANCE, we strive to exceed your expectations. We are dedicated to delivering exceptional results and ensuring your satisfaction. Should you have any questions or need further assistance, our friendly and knowledgeable team is here to help you every step of the way.
          </p>
        </div>
    
        <table class="invoice-table">
          <tr>
            <th>Invoice Date:</th>
            <td>${formattedDate}</td>
          </tr>
          <tr>
            <th>Freelancer:</th>
            <td>${username}</td>
          </tr>
          <tr>
            <th>Job Fee:</th>
            <td>${jobFee.toFixed(2)}</td>
          </tr>
          <tr>
            <th>Service Fee:</th>
            <td>${serviceFee.toFixed(2)}</td>
          </tr>
          <tr>
            <th>Transaction ID:</th>
            <td>${transaction_id}</td>
          </tr>
            <th><b>Total Fee:</b></th>
            <td>${totalFee.toFixed(2)}</td>
          </tr>
         
        </table>
    
        <div class="invoice-footer">
          <p>
            Once again, thank you for your trust in NE1-FREELANCE. We look forward to serving you again and ensuring your continued satisfaction.
            <br>
            Best regards,
            <br>
            NE1-FREELANCE
          </p>
        </div>
      </div>
    </body>
    </html>
    `
}
