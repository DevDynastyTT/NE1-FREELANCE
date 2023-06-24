import AdminNavbar from '../adminNav/AdminNavbar';
import { getAllServices, updateService, deleteService, createService } from '../utils/APIRoutes';
import { useEffect, useState } from 'react';
import '../../static/css/admin/userinfo.css';
import CreateServiceForm from './CreateServiceForm';
import AboutUs from './AboutUsContent'
export default function ServicesDisplay({currentUser}) {
  const [serviceData, setServiceData] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [thumbnail, setThumbnail] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [create, setCreate] = useState(false)
  async function fetchServiceInfo() {
    try {
      const response = await axios.get(getAllServices);
      const data = response.data;
      setServiceData(data.serviceInfo);
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    fetchServiceInfo();
  }, []);



  async function handleUpdateService(updatedService) {
    try {
      await axios.post(updateService, updatedService);
      setSelectedService(null)
      fetchServiceInfo(); // Fetch updated data after successful update
    } catch (error) {
      console.error('Error updating service:', error);
    }
  }

  async function handleDeleteService(serviceTitle) {
    try {
      const response = await axios.post(deleteService, { chosenTitle: serviceTitle });
      const data = response.data
      if(data.error) {
        console.log(data.error)
        alert(data.error)
        return
      }
      setSelectedService(null)
      fetchServiceInfo(); // Fetch updated data after successful deletion
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  }

  function handleRenderForm(service) {
    if(!selectedService) setSelectedService(service)
    else {
      setSelectedService('')
      setTimeout(()=>{
        setSelectedService(service)
      }, 1)
    }
  }


  
  async function handleCreateService(event){
      event.preventDefault();
      const formData = new FormData();
      formData.append('title', title)
      formData.append('description', description)
      formData.append('thumbnail', thumbnail);
      console.log('File =', thumbnail);

      try {
          const response = await axios.post(createService, formData)
          const data = response.data;
          if (data.error) {
            console.log(data.error)
            alert(data.error)
            return
          }
          fetchServiceInfo()
        } catch (error) {
          console.log("Error:", error);
        }
    }
  return (
    <>
      {serviceData && currentUser ? (
        <div className="service-body">
          <AdminNavbar />
          <main className="main-service-display-container">
            <table id="service-info">
              <thead>
                <tr>
                  <th className="table-heading">Title</th>
                  <th className="table-heading">Description</th>
                  <th className="table-heading">Thumbnail</th>
                </tr>
              </thead>
              <tbody>
                {serviceData.map((service) => (
                  <tr key={service._id}>
                    <td 
                      className={`table-values ${selectedService === service ? 'highlighted' : ''}`}
                    onClick={() => handleRenderForm(service)}>
                      {service.title}
                    </td>
                    <td className="table-values">{service.description}</td>
                    <td className="table-values service-thumbnails"
                      style={{
                        width: "130px",
                        height: "130px"
                      }}
                    >
                      <img src={`http://localhost:3000/images/${service.thumbnail}`} alt={service.thumbnail}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain"
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2>As an Administration, you have access to configuring services</h2>
              <p className="info">Click on a title to configure
              {create ? (
                <svg 
                  className='create-icon'
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 448 512"
                  onClick={()=>setCreate(false)}>
                  <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/>
                </svg>
              ): (
                <svg
                  className="create-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  onClick={() => setCreate(true)}>
                  <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                </svg>
              )}
             
              </p>

            <section className="service-form-section">
                  {selectedService && (
                      <RenderUpdateForm
                        service={selectedService}
                        setSelectedService={setSelectedService}
                        handleUpdateService={handleUpdateService}
                        handleDeleteService={handleDeleteService}
                      />
                    )}
                  {create && 
                  <CreateServiceForm 
                    handleCreateService={handleCreateService} 
                    setTitle={setTitle}
                    setDescription={setDescription}
                    setThumbnail={setThumbnail}
                    />}
            </section>

            <section id="about-us-section">
                    <AboutUs/>
            </section>

          </main>
        </div>
      ) : (
        <h1 style={{ textAlign: 'center' }}>Loading Please Wait...</h1>
      )}
    </>
  );
}

function RenderUpdateForm({ service, setSelectedService, handleUpdateService, handleDeleteService }) {
  const [title, setTitle] = useState(service.title || '');
  const [description, setDescription] = useState(service.description || '');
  const [thumbnail, setThumbnail] = useState();

  async function handleDelete(event) {
    event.preventDefault();
    if (window.confirm('Are you sure you want to delete this service?')) {
      handleDeleteService(service.title);
    }
  }

  async function handleUpdate(event) {
    event.preventDefault();
    const formData = new FormData()
    formData.append('updatedTitle', title)
    formData.append('chosenTitle', service.title)
    formData.append('description', description)
    formData.append('thumbnail', thumbnail)
    handleUpdateService(formData);
  }
  // 1684304744214-transporation.jpg

  return (
    <>
      <form className="left-service-form" encType="multipart/form-data">
      <h3>Configure</h3>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          className="form-control"
          type="text"
          name="title"
          placeholder={service.title}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <label htmlFor="description">Description</label>
        <input
          id="description"
          className="form-control"
          type="text"
          name="description"
          placeholder={service.description}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <label htmlFor="thumbnail">Thumbnail</label>
        <input
          id="thumbnail"
          className="form-control-file image-btn"
          type="file"
          name="thumbnail"
          accept="image/*"
          onChange={(event) => setThumbnail(event.target.files[0])}
        />

        <button type="button" className="form-control action-btn" onClick={handleUpdate}>
          Update
        </button>

        <button type="button" className="form-control action-btn" onClick={handleDelete}>
          Delete
        </button>

        <button
          type="button"
          className="form-control action-btn"
          onClick={() => setSelectedService(null)}
        >
          Cancel
        </button>
      </form>
    </>
  );
}
