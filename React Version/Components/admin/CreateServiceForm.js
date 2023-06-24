export default function CreateServiceForm({handleCreateService, setTitle, setDescription, setThumbnail}){
   
   return(
    <form encType="multipart/form-data" className="right-service-form">
        <h3>Create a service</h3>
        <label htmlFor="title">Title:</label>
        <br/>
        <input type="text" name="title" onChange={(event) => setTitle(event.target.value)}></input>
        <br/>
        <label htmlFor="description">Description:</label>
        <br/>
        <input type ="text" name="description" onChange={(event) => setDescription(event.target.value)}></input>
        <br/>
        <label htmlFor="thumbnail">Thumbnail:</label>
        <br/>
        <input id="image-input" type="file" name="thumbnail" accept="image/*" onChange={(event) => setThumbnail(event.target.files[0])} className="btn btn-secondary image-btn" />
        <br/>
        <button onClick={handleCreateService} className="form-control action-btn">create</button>
</form>
   )
}