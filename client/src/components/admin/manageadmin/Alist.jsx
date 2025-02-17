import { React, useState, useEffect } from 'react'
import axios from "axios";
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../Admin.css";

const Alist = () => {

  const navigate = useNavigate();
  const [admins, setadmins] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const base_url = import.meta.env.VITE_BASE_URL;
      try {
        const response = await axios.get(`${base_url}/api/v1/admins`, {
          withCredentials: true,  // Include credentials (cookies)
        });
        setadmins(response.data);  // Set the users data to state
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleEdit = (admin) => {
    navigate('/admin/admin-create', { state: { admin, mode: 'edit' } });
  }
  const handleDelete = async (id) => {
    const base_url = import.meta.env.VITE_BASE_URL;
    try {
      // Make the API call to delete the user by ID
      await axios.delete(`${base_url}/api/v1/delete-admin/${id}`).then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
        }
      });
      setadmins(prevUsers => prevUsers.filter(admin => admin._id !== id));

    } catch (error) {
      toast.error('Error deleting user:');
    }
  };
  const handlePermission = async (admin, permissionType) => {
    try {
      const updatedPermissions = {
        ...admin.permissions,
        [permissionType]: !admin.permissions[permissionType], // Toggle value dynamically
      };
      const base_url = import.meta.env.VITE_BASE_URL;
      await axios.put(`${base_url}/api/v1/update-permissions/${admin._id}`, { permissions: updatedPermissions }).then((response) => {
        if (response.status === 200) {
          setadmins((prevAdmins) =>
            prevAdmins.map((a) => (a._id === admin._id ? { ...a, permissions: updatedPermissions } : a))
          );
        }
      });
    } catch (error) {
      console.error(`Error updating ${permissionType}:`, error);
      toast.error(`Failed to update ${permissionType}`);
    }
  };

  return (
    <div>
      <div className='container d-flex justify-content-center'>
        <div className='mt-3'>
          <button className='rounded border p-1 px-2 text-white create-btn'><Link className="nav-link active small" aria-current="page" to='/admin/admin-create'>+ Create</Link></button>
          <div className='d-flex flex-column align-items-center'>
            <table className="table table-striped table-bordered w-auto mt-2">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                  <th>Authorize</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, index) => (
                  <tr key={index}>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>{admin.phone}</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() => handleEdit(admin)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(admin._id)}
                      >
                        Delete
                      </button>
                    </td>
                    <td>
                      <button className={`btn ${admin.permissions?.canEdit ? 'btn-success' : 'btn-danger'} btn-sm me-2`}
                        onClick={() => handlePermission(admin, 'canEdit')}>Edit</button>
                      <button className={`btn ${admin.permissions?.canDelete ? 'btn-success' : 'btn-danger'} btn-sm`}
                        onClick={() => handlePermission(admin, 'canDelete')}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alist