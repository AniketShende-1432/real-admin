import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from "axios";
import { toast } from 'react-toastify';

const User = () => {

  const navigate = useNavigate();
  const permissions = useSelector((state) => state.auth.permissions);
  console.log(permissions);

  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({
    type: '',
    search: ''
  })
  useEffect(() => {
    const fetchUsers = async () => {
      const base_url = import.meta.env.VITE_API_BASE_URL;
      try {
        const response = await axios.get(`${base_url}/api/v5/users`, {
          withCredentials: true,  // Include credentials (cookies)
        });
        setUsers(response.data);  // Set the users data to state
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const base_url = import.meta.env.VITE_API_BASE_URL;
    try {
      // Make the API call to delete the user by ID
      await axios.delete(`${base_url}/api/v5/users/${id}`, {
        withCredentials: true, // Include credentials (cookies)
      }).then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
        }
      });
      setUsers(prevUsers => prevUsers.filter(user => user._id !== id));

    } catch (error) {
      toast.error('Error deleting user:');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value, // Dynamically set the value for the appropriate field
    }));
  };

  const handleSearch = async () => {
    const base_url = import.meta.env.VITE_API_BASE_URL;

    try {
      // Make the API call to fetch filtered users
      const response = await axios.get(`${base_url}/api/v5/filterusers`, {
        params: {
          type: filter.type,
          search: filter.search,
        },
        withCredentials: true, // Include credentials (cookies)
      });
      console.log(response.data); // This can be used to update the UI with filtered users
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching filtered users:', error);
    }
  };

  const handleEdit = (user) => {
    navigate(`/admin/user-edit`, { state: user });
  };

  return (
    <div>
      <div className='user-bar d-flex justify-content-center align-items-center p-2'>
        <div className="input-group w-50">
          <button className="btn btn-outline-secondary dropdown-toggle drop-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">{filter.type || "UserType"}</button>
          <ul className="dropdown-menu drop-item" style={{ cursor: 'pointer' }}>
            <li><a className="dropdown-item" onClick={() => setFilter((prev) => ({ ...prev, type: 'Agent' }))}>Agent</a></li>
            <li><a className="dropdown-item" onClick={() => setFilter((prev) => ({ ...prev, type: 'Builder' }))}>Builder</a></li>
            <li><a className="dropdown-item" onClick={() => setFilter((prev) => ({ ...prev, type: 'Buyer/Owner/Tenant' }))}>Buyer/Owner/Tenant</a></li>
          </ul>
          <input type="text" className="form-control user-input" name='search'
            value={filter.search}
            onChange={handleInputChange}
            placeholder='Phone/Email/Name' />
        </div>
        <button className='search-btn text-white ms-2' onClick={handleSearch}>search</button>
      </div>
      <div className='d-flex flex-column align-items-center'>
        <table className="table table-striped table-bordered w-auto mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.usertype}</td>
                <td>{user.phone}</td>
                <td>
                  {permissions.canEdit &&
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>}
                  {permissions.canDelete &&
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default User