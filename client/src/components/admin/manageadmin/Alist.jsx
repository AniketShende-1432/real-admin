import { React, useState, useEffect } from 'react'
import axios from "axios";
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../Admin.css";

const Alist = () => {
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
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                    <td>
                      <button className='btn btn-danger btn-sm me-2'>Edit</button>
                      <button className='btn btn-danger btn-sm'>Delete</button>
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