import { React, useEffect } from 'react'
import { Link, useNavigate, Outlet } from 'react-router-dom';
import axios from "axios";
import { useSelector,useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import "./Admin.css";
import { authActions } from '../../store/authSlice';

const Admin = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const role = useSelector((state) => state.auth.role);

    useEffect(() => {
        // Check if login toast should be shown
        if (sessionStorage.getItem("showLoginToast") === "true") {
            toast.success("Login successful!", {
                toastId: "login-success",
                onClose: () => {
                    sessionStorage.removeItem("showLoginToast");
                },
            });
        }
    }, []);

    const handlelogout = async () => {
        try {
            const base_url = import.meta.env.VITE_BASE_URL;
            const response = await axios.post(`${base_url}/api/v1/logout`, {}, { withCredentials: true });
            if (response.status === 200) {
                dispatch(authActions.clearPermissions());
                toast.success("Log Out Successfully", {
                    onClose: () => {
                        sessionStorage.removeItem("login");
                        navigate('/');
                    },
                });
            }
        } catch (error) {
            toast.error("Failed to log out. Please try again.");
            console.error("Logout error:", error); // Log error for debugging
        }
    }

    return (
        <div className='parent-cont'>
            <nav className={`navbar navbar-expand-lg border cont`}>
                <div className="container d-flex justify-content-around">
                    <a className="navbar-brand logo" href="#">ShelterBIG</a>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item ms-1">
                                <Link className="nav-link active text-white small" aria-current="page">Home</Link>
                            </li>
                            {role === 'Super Admin' &&
                                <li className="nav-item ms-1">
                                    <Link className="nav-link active text-white small" aria-current="page" to='/admin/manage-admin'>Manage Admin</Link>
                                </li>
                            }
                            <li className="nav-item ms-2">
                                <Link className="nav-link active text-white small" aria-current="page" to="/admin">Manage User</Link>
                            </li>
                            <li className="nav-item ms-2">
                                <Link className="nav-link active text-white small" aria-current="page" to="/admin/manage-property">Manage Properties</Link>
                            </li>
                            <li>
                                <button className="text-white ms-2 logout-btn mt-1 p-1" onClick={handlelogout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <main>
                <Outlet /> {/* Renders the child route components */}
            </main>
        </div>
    )
}

export default Admin