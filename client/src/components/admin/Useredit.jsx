import { React, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import './Admin.css';

const Useredit = () => {
    const location = useLocation();
    const user = location.state || {};
    const [userInputs, setuserInputs] = useState(user);
    console.log(userInputs);
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        usertype: '',
        phone: '',
    });
    const userChange = (e) => {
        const { name, value, type, checked } = e.target;
        setuserInputs((prevState) => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value, // Handle checkbox
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};
        if (!userInputs.name) {
            formErrors.name = 'Name is required';
        }
        const phonePattern = /^[0-9]{10}$/;
        if (!userInputs.phone) {
            formErrors.phone = 'Phone number is required';
        } else if (!phonePattern.test(userInputs.phone)) {
            formErrors.phone = 'Please enter a valid phone number (10 digits)';
        }
        if (!userInputs.usertype) {
            formErrors.usertype = 'Please select a user type';
        }
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return; // Stop the form submission if there are errors
        }
        try {
            const base_url = import.meta.env.VITE_API_BASE_URL;
            await axios.put(`${base_url}/api/v5/useredit`, userInputs,{withCredentials:true})
                .then((response) => {
                    if (response.data.message) {
                        toast.error(response.data.message);
                    }
                    else{
                        toast.success("User updated successfully");
                        setuserInputs(response.data); // Update state with the latest data
                    }
                });
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    };
    return (
        <div>
            <div className='container d-flex justify-content-center align-items-center signup-cont'>
                <div className='signup-box p-4 bg-white'>
                    <form onSubmit={handleSubmit}>
                        <div className='fw-bold fs-4 signup-text mb-3'>User Edit Form</div>
                        <div>
                            <div className='mb-2'>I am</div>
                            <div className='d-flex signup-radio'>
                                <div className="form-check">
                                    <input className={`form-check-input ${errors.usertype ? 'border-danger' : ''}`} type="radio" name="usertype" id="buyer"
                                        value="Buyer/Owner/Tenant"
                                        checked={userInputs.usertype === "Buyer/Owner/Tenant"}
                                        onChange={userChange} />
                                    <label className="form-check-label" for="buyer">
                                        Buyer/Owner/Tenant
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className={`form-check-input ${errors.usertype ? 'border-danger' : ''}`} type="radio" name="usertype" id="Agent"
                                        value="Agent"
                                        checked={userInputs.usertype === "Agent"}
                                        onChange={userChange} />
                                    <label className="form-check-label" for="Agent">
                                        Agent
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className={`form-check-input ${errors.usertype ? 'border-danger' : ''}`} type="radio" name="usertype" id="builder"
                                        value="Builder"
                                        checked={userInputs.usertype === "Builder"}
                                        onChange={userChange} />
                                    <label className="form-check-label" for="builder">
                                        Builder
                                    </label>
                                </div>
                            </div>
                            {errors.usertype && <div className="text-danger error-txt">{errors.usertype}</div>}
                        </div>
                        <div className={`mt-3 ${errors.name ? 'mb-2' : 'mb-3'}`}>
                            <div>Name</div>
                            <input type="text" className="signup-input" name="name"
                                value={userInputs.name}
                                onChange={userChange} />
                            {errors.name && <div className="text-danger error-txt">{errors.name}</div>}
                        </div>
                        <div>
                            <div>Email</div>
                            <input type="email" className="signup-input" name="email"
                                value={userInputs.email}
                                onChange={userChange} />
                            {errors.email && <div className="text-danger error-txt">{errors.email}</div>}
                        </div>
                        <div className={`d-flex phone-cont ${errors.email ? 'mt-2' : 'mt-4'}`}>
                            <div className='w-25'>IND +91</div>
                            <input type="text" className={`phone-input ${errors.phone ? 'border-danger' : ''}`} name="phone" id="phone" placeholder='     Mobile Number'
                                value={userInputs.phone}
                                onChange={userChange} />
                        </div>
                        {errors.phone && <div className="text-danger error-txt">{errors.phone}</div>}
                        <div className='mt-3'>
                            <button className="btn signup-btn w-100" type="submit">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Useredit