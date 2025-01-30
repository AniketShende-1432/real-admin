import {React,useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import login from "../../assets/login.jpg"
import user from "../../assets/user.png";
import axios from "axios";
import "./Login.css";
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const [adminData,setadminData] = useState({
        userid:'',password:''
    }) 
    console.log(adminData);

    const handleInput = (e)=>{
        const value = e.target.value;
        setadminData({...adminData,userid:value});
    }
    const handlePass = (e)=>{
        const value = e.target.value;
        setadminData({...adminData,password:value});
    }
    const handlelogin = async(e)=>{
        e.preventDefault();
        if (!adminData.userid || !adminData.password) {
            toast.error('All fields are required!');
            return;
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phonePattern = /^[0-9]{10}$/; 
        if (!emailPattern.test(adminData.userid) && !phonePattern.test(adminData.userid)) {
            toast.error('Enter a valid email or Phone Number');
            return;
        }
        if (adminData.password.length < 6) {
            toast.error('Password must be at least 6 characters long !');
            return;
        }
        try {
            const base_url = import.meta.env.VITE_BASE_URL; // Get the base URL from environment variables
            const response = await axios.post(`${base_url}/api/v1/login`, adminData, { withCredentials: true });
            if (response.data.message) {
                toast.error(response.data.message);
            } else {
                sessionStorage.setItem("showLoginToast", "true");
                sessionStorage.setItem("login", "true");
                setadminData({ userid:'',password:''});
                navigate('/admin');
            }
        } catch (error) {
            console.error('Error during login:', error);

        }
    }

    return (
        <div>
            <nav class="navbar nav-head" style={{backgroundColor:"darkorange"}}>
                <div class="container-fluid">
                    <a class="navbar-brand logo" href="#">ShelterBIG</a>
                </div>
            </nav>
            <div className='d-flex container'>
                <div className='w-50'>
                    <img src={login} alt="img" />
                </div>
                <div className='w-50 d-flex justify-content-center align-items-center' style={{ backgroundColor: '' }}>
                    <div className='w-75 login-box'>
                        <div className='d-flex flex-column align-items-center'>
                            <img src={user} className='user-img' alt="img" />
                            <h4 className='login-head'>Admin Login</h4>
                        </div>
                        <form onSubmit={handlelogin}>
                            <div className="mb-3 mt-2">
                                <label for="exampleInputEmail1" className="form-label fs-5">Email address or Phone Number</label>
                                <input type="text" className="form-control login-input" id="exampleInputEmail1" aria-describedby="emailHelp"
                                value={adminData.userid}
                                onChange={handleInput}/>
                            </div>
                            <div className="mb-3">
                                <label for="exampleInputPassword1" className="form-label fs-5">Password</label>
                                <input type="password" className="form-control login-input" id="exampleInputPassword1" 
                                value={adminData.password}
                                onChange={handlePass}/>
                            </div>
                            <button type="submit" className="login-btn p-2 w-100 text-white fw-bold">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login