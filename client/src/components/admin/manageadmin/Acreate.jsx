import { React, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import "../../login/Login.css";
import { toast } from 'react-toastify';

const Acreate = () => {
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const [admindata, setadmindata] = useState({
        name: '', email: '', phone: '', password: ''
    })
    const [modaldata, setmodaldata] = useState({
        name: '', email: '', phone: '', password: ''
    })
    console.log(modaldata);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setadmindata((prvState) => ({
            ...prvState,
            [name]: value,
        }));
    }
    const handlelogin = async (e) => {
        e.preventDefault();
        const modal = new window.bootstrap.Modal(modalRef.current); // Create modal instance
        if (!admindata.name || !admindata.email || !admindata.phone || !admindata.password) {
            toast.error('All fields are required!');
            return;
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phonePattern = /^[0-9]{10}$/;
        if (!emailPattern.test(admindata.email)) {
            toast.error('Enter a valid email');
            return;
        }
        if (!phonePattern.test(admindata.phone)) {
            toast.error('Enter valid Phone Number');
            return;
        }
        if (admindata.password.length < 6) {
            toast.error('Password must be at least 6 characters long !');
            return;
        }
        try {
            const base_url = import.meta.env.VITE_BASE_URL; // Get the base URL from environment variables
            const response = await axios.post(`${base_url}/api/v1/register`, admindata, { withCredentials: true });
            if (response.data.message) {
                toast.error(response.data.message);
            } else {
                setadmindata({ name: '', email: '', phone: '', password: '' });
                setmodaldata(response.data);
                modal.show();
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    }
    return (
        <div>
            <div className='d-flex justify-content-center align-items-center admin-main' style={{ backgroundColor: '' }}>
                <div className='admin-box'>
                    <div className='d-flex flex-column'>
                        <h4 className='login-head'>Admin Register</h4>
                    </div>
                    <form onSubmit={handlelogin}>
                        <div className="mb-3 mt-2">
                            <label for="exampleInputEmail1" className="form-label fs-5 mb-0">Name</label>
                            <input type="text" className="form-control admin-input" id="exampleInputEmail1" name="name"
                                value={admindata.name}
                                onChange={handleInput} />
                        </div>
                        <div className="mb-3 mt-2">
                            <label for="exampleInputEmail1" className="form-label fs-5 mb-0">Email</label>
                            <input type="text" className="form-control admin-input" id="exampleInputEmail1" name="email"
                                value={admindata.email}
                                onChange={handleInput} />
                        </div>
                        <div className="mb-3">
                            <label for="exampleInputPassword1" className="form-label fs-5 mb-0">Password</label>
                            <input type="password" className="form-control admin-input" id="exampleInputPassword1" name="password"
                                value={admindata.password}
                                onChange={handleInput} />
                        </div>
                        <div className="mb-3 mt-2">
                            <label for="exampleInputEmail1" className="form-label fs-5 mb-0">Phone Number</label>
                            <input type="text" className="form-control admin-input" id="exampleInputEmail1" name="phone"
                                value={admindata.phone}
                                onChange={handleInput} />
                        </div>
                        <button type="submit" className="login-btn p-2 w-100 text-white fw-bold">Create Admin</button>
                    </form>
                </div>
            </div>
            <div className="modal fade" id="exampleModal" tabindex="-1" ref={modalRef} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Login Successfull</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Email: {modaldata.email}<br />
                            Password: {modaldata.password}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal"><Link className="nav-link active text-white small" aria-current="page" to='/admin/manage-admin'>Understood</Link></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Acreate