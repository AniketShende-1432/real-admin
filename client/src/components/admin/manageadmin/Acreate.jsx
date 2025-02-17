import { React, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from "axios";
import "../../login/Login.css";
import { toast } from 'react-toastify';

const Acreate = () => {
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const location = useLocation();
    const { admin, mode } = location.state || {};
    const { password, ...editdata } = admin || {};
    const [adminedit, setadminedit] = useState(editdata);
    const [admindata, setadmindata] = useState({
        name: '', email: '', phone: '', password: '', ...adminedit
    })
    const [upass, setupass] = useState({
        currpass: '', newpass: '', confpass: ''
    })
    console.log(upass);
    const [modaldata, setmodaldata] = useState({
        name: '', email: '', phone: '', password: ''
    })

    useEffect(() => {
        if (mode === 'edit' && adminedit) {
            setadmindata({
                ...admindata, // Spread initial form data to maintain structure
                ...adminedit, // Override with property-specific data
            });
        }
    }, [mode, adminedit]);
    const handleInput = (e) => {
        const { name, value } = e.target;
        setadmindata((prvState) => ({
            ...prvState,
            [name]: value,
        }));
    }
    const handlepassedit = (e) => {
        const { name, value } = e.target;
        setupass((prvState) => ({
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
    const handleEdit = async (e) => {
        e.preventDefault();
        if (!admindata.name || !admindata.email || !admindata.phone) {
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
        if(upass.currpass || upass.newpass || upass.confpass ){
            if(!upass.currpass || !upass.newpass || !upass.confpass){
                toast.error('All Password Fields are required');
                return;
            }else if (upass.currpass.length < 6 || upass.newpass.length < 6 || upass.confpass.length < 6 ){
                toast.error('Password must be at least 6 characters long !');
                return;
            }else if(upass.newpass !== upass.confpass){
                toast.error('New Password and Confirm Password does not Match !');
                return;
            }
        }
        try {
            let updateData = {
                name: admindata.name,
                email: admindata.email,
                phone: admindata.phone,
                password: upass.newpass,
                currentpassword: upass.currpass,
            };
            const base_url = import.meta.env.VITE_BASE_URL;
            const updateResponse = await axios.put(`${base_url}/api/v1/updateadmin`, updateData);
            if (updateResponse.status === 200) {
                setadmindata({name: '', email: '', phone: '', password: ''});
                setupass({currpass: '', newpass: '', confpass: ''});
                toast.success('Admin updated successfully!',{
                    onClose: () => navigate('/admin/manage-admin')
                });
            }
        } catch (error) {
            if (error.response?.status === 404) {
                toast.error('Admin not found!');
            } else if (error.response?.status === 400) {
                toast.error('Incorrect password!');
            } else {
                toast.error('Error verifying password');
            }
        }

    }
    return (
        <div>
            <div className='d-flex justify-content-center align-items-center admin-main' style={{ backgroundColor: '' }}>
                <div className={`admin-box ${mode === 'edit' ? 'mt-3' : ''}`}>
                    <div className='d-flex flex-column'>
                        {mode !== 'edit' ? <h4 className='login-head'>Admin Register</h4> : <h4 className='login-head'>Edit Admin</h4>}
                    </div>
                    <form onSubmit={mode !== 'edit' ? handlelogin : handleEdit}>
                        <div className="mb-3 mt-2">
                            <label for="exampleInputEmail1" className="form-label fs-6 mb-0 fw-semibold">Name</label>
                            <input type="text" className="form-control admin-input" id="exampleInputName" name="name"
                                value={admindata.name}
                                onChange={handleInput} />
                        </div>
                        <div className="mb-3 mt-2">
                            <label for="exampleInputEmail1" className="form-label fs-6 mb-0 fw-semibold">Email</label>
                            <input type="text" className="form-control admin-input" id="exampleInputEmail" name="email"
                                value={admindata.email}
                                onChange={handleInput} />
                        </div>
                        {mode !== 'edit' ? <div className="mb-3">
                            <label for="exampleInputPassword1" className="form-label fs-6 mb-0 fw-semibold">Password</label>
                            <input type="password" className="form-control admin-input" id="exampleInputPassword1" name="password"
                                value={admindata.password}
                                onChange={handleInput} />
                        </div> : ''}
                        <div className="mb-3 mt-2">
                            <label for="exampleInputEmail1" className="form-label fs-6 mb-0 fw-semibold">Phone Number</label>
                            <input type="text" className="form-control admin-input" id="exampleInputPhone" name="phone"
                                value={admindata.phone}
                                onChange={handleInput} />
                        </div>
                        {mode === 'edit' && (
                            <div>
                                <div className='d-flex align-items-center'>
                                    <div className="flex-grow-1 border border-danger"></div>
                                    <span className="mx-3 fw-bold">To Change Password (Optional)</span>
                                    <div className="flex-grow-1 border border-danger"></div>
                                </div>
                                <div className="mb-3 mt-2">
                                    <label for="exampleInputPassword1" className="form-label fs-6 mb-0 fw-semibold">Current Password</label>
                                    <input type="password" className="form-control admin-input" id="exampleInputPassword1" name="currpass"
                                        value={upass.currpass}
                                        onChange={handlepassedit} />
                                </div>
                                <div className="mb-3">
                                    <label for="exampleInputPassword1" className="form-label fs-6 mb-0 fw-semibold">New Password</label>
                                    <input type="password" className="form-control admin-input" id="exampleInputPassword2" name="newpass"
                                        value={upass.newpass}
                                        onChange={handlepassedit} />
                                </div>
                                <div className="mb-3">
                                    <label for="exampleInputPassword1" className="form-label fs-6 mb-0 fw-semibold">Confirm Password</label>
                                    <input type="password" className="form-control admin-input" id="exampleInputPassword3" name="confpass"
                                        value={upass.confpass}
                                        onChange={handlepassedit} />
                                </div>
                            </div>
                        )}
                        {mode !== 'edit' ? <button type="submit" className="login-btn p-2 w-100 text-white fw-bold">Create Admin</button> :
                            <button type="submit" className="login-btn p-2 w-100 text-white fw-bold">Save Changes</button>}
                    </form>
                </div>
            </div>
            <div className="modal fade" id="exampleModal" tabindex="-1" ref={modalRef} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Admin Created Successfull</h1>
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