import React, { useEffect, useState } from 'react';
import AdminNavbar from '../adminNav/AdminNavbar';
import { getAllUserInfo, heartBeat } from '../utils/APIRoutes';
import '../../static/css/admin/userinfo.css'

export default function UserInfo() {
  const [userData, setUserData] = useState([]);
  const [isServerAlive, setServerAlive] = useState(true);

  async function fetchUserInfo() {
    try {
      const response = await axios.get(getAllUserInfo);
      const data = response.data;
      setUserData(Array.from(data));
      console.log(Array.from(data))
    } catch (error) {
      console.log('Error:', error);
    }
  }

  useEffect(() => {
    const interval = setInterval(fetchUserInfo, 5000);
    // fetchCurrentUser();
  
    if (!isServerAlive) {
      clearInterval(interval);
    }
  
    return () => {
      clearInterval(interval);
    };
  }, []);
  

  useEffect(() => {
    if (isServerAlive == false  && currentUser) {
      alert('Your session has ended');
      // setCurrentUser(null);
    }
  }, [isServerAlive]);

 
  return (
    <>
      <AdminNavbar />
      <br />
      <table id="user-info">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Is Staff?</th>
            <th>Is Active?</th>
            <th>Date Joined</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.is_staff ? 'Yes' : 'No'}</td>
              <td>{user.is_active ? 'Yes' : 'No'}</td>
              <td>{new Date(user.date_joined).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
