import "../../static/css/admin/admin.css";
import AdminNavbar from "../adminNav/AdminNavbar";
import { countJobsInCategory, countCategories, countJobs, countServices, countUsers, countInvoices, countInvoiceDates } from "../utils/APIRoutes";
import { useEffect, useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import WorkIcon from '@mui/icons-material/Work';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CategoryIcon from '@mui/icons-material/Category';
import BarCharts from "./BarCharts";
import { useNavigate } from "react-router-dom";
export default function Admin({currentUser}) {
  const navigate = useNavigate()

  if(!currentUser || !currentUser?.is_staff) navigate('/members/login')
  const [categoryCount, setCategoryCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [invoiceDates, setInvoiceDates] = useState([]);
  // const [currentUser, setCurrentUser] = useState(null);
  const [countingJobs, setCountingJobs] = useState(true)
  const [barChartData, setBarChartData] = useState({})
  useEffect(() => {
    fetchJobInCategoryCount();
    fetchCategoryCount();
    fetchUserCount();
    fetchServiceCount();
    fetchJobCount();
    fetchInvoiceCount();
    fetchInvoiceCounts();
  }, []);

  async function fetchJobInCategoryCount() {
    try {
      const response = await axios.get(countJobsInCategory);
      const data = response.data;

      if (response.status === 200) {
        setCountingJobs(false)
        setBarChartData(data);
      } else {
        console.log("Error fetching data. Status:", response.status);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async function fetchCategoryCount() {
    try {
      const response = await axios.get(countCategories);
      const catcount = response.data;
      console.log("Category count:", catcount);
      setCategoryCount(catcount); // Update the categoryCount state
    } catch (error) {
      console.log("Error fetching category count:", error);
    }
  }

  async function fetchJobCount() {
    try {
      const response = await axios.get(countJobs);
      const jobcount = response.data;
      console.log("Category count:", jobcount);
      setJobCount(jobcount); // Update the jobCount state
    } catch (error) {
      console.log("Error fetching category count:", error);
    }
  }

  async function fetchUserCount() {
    try {
      const response = await axios.get(countUsers);
      const usercount = response.data;
      console.log("Category count:", usercount);
      setUserCount(usercount); // Update the userCount state
    } catch (error) {
      console.log("Error fetching category count:", error);
    }
  }

  async function fetchServiceCount() {
    try {
      const response = await axios.get(countServices);
      const servicecount = response.data;
      console.log("Category count:", servicecount);
      setServiceCount(servicecount); // Update the serviceCount state
    } catch (error) {
      console.log("Error fetching category count:", error);
    }
  }

  async function fetchInvoiceCount() {
    try {
      const response = await axios.get(countInvoices);
      const invoicecount = response.data;
      console.log("Category count:", invoicecount);
      setInvoiceCount(invoicecount); // Update the invoiceCount state
    } catch (error) {
      console.log("Error fetching category count:", error);
    }
  }

  async function fetchInvoiceCounts() {
    try {
      const response = await axios.get(countInvoiceDates);
      const counts = response.data;
      setInvoiceDates(counts);
    } catch (error) {
      console.log("Error fetching invoice counts:", error);
    }
  }
  


  return (
    <>


      {currentUser && currentUser?.is_staff && (

        
        <>
          <AdminNavbar />
            <main id="admin">
              <div className="item-counts">
                <div className="count-box">
                  <div className="count-label">Categories</div>
                  <div className="count-icon"><CategoryIcon /></div>
                  <div className="count-value">{categoryCount}</div>
                </div>
                <div className="count-box">
                  <div className="count-label">No. of Services Available</div>
                  <div className="count-icon"><MiscellaneousServicesIcon /></div>
                  <div className="count-value">{serviceCount}</div>
                </div>
                <div className="count-box">
                  <div className="count-label">Users Created</div>
                  <div className="count-icon"><PersonIcon /></div>
                  <div className="count-value">{userCount}</div>
                </div>
                <div className="count-box">
                  <div className="count-label">Total Jobs Created</div>
                  <div className="count-icon"><WorkIcon /></div>
                  <div className="count-value">{jobCount}</div>
                </div>
                <div className="count-box">
                  <div className="count-label">Invoices Generated</div>
                  <div className="count-icon"><ReceiptIcon /></div>
                  <div className="count-value">{invoiceCount}</div>
                </div>
              </div>
  
              {barChartData && invoiceDates && invoiceCount ? (
                <BarCharts barChartData={barChartData} invoiceDates={invoiceDates}/>
                ): <h1 style={{textAlign: "center"}}>Checking for data...</h1> }      

            </main>
        </>
      )}



    </>
)
          }