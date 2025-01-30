import React, { useState, useEffect } from 'react';
import { FaRupeeSign } from "react-icons/fa";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Rent = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const property = location.state || {};
    console.log(property);

    const [clickedrentBhk, setClickedrentBhk] = useState({
        bhk1: false,
        bhk2: false,
        bhk3: false,
        bhk4: false,
    });
    const [clickedrentfurni, setClickedrentfurni] = useState({
        furni1: false,
        furni2: false,
        furni3: false,
    });
    const [formattedrentPrice, setFormattedrentPrice] = useState("");
    const [depformattedrentPrice, setdepFormattedrentPrice] = useState("");
    const [rentData, setrentData] = useState(property);
    //console.log(rentData);
    const [errors, setErrors] = useState({
        type: '',
        city: '',
        location: '',
        societyName: '',
        bhk: '',
        furni: '',
        carea: '',
        cunit: '',
        mprice: '',
        sprice: '',
        avail: '',
    });
    const changedrop = (value) => {
        setrentData((prevState) => ({
            ...prevState,
            propertyType: value
        }));
    }
    const handlerentBhk = (buttonKey) => {
        setClickedrentBhk((prevState) => ({
            [buttonKey]: !prevState[buttonKey], // Toggle the clicked button's style
        }));
        const bhkValue = buttonKey === 'bhk1' ? '1RK' :
            buttonKey === 'bhk2' ? '1BHK' :
                buttonKey === 'bhk3' ? '2BHK' :
                    '3BHK'; // Default to '3BHK' if 'bhk4' is clicked

        setrentData({ ...rentData, bhk: bhkValue });
    }
    const handlerentfurni = (buttonKey) => {
        setClickedrentfurni((prevState) => ({
            [buttonKey]: !prevState[buttonKey], // Toggle the clicked button's style
        }));
        const furniValue = buttonKey === 'furni1' ? 'Fully furnished' :
            buttonKey === 'furni2' ? 'Semi Furnished' : "Unfurnished"
        setrentData({ ...rentData, furnishedType: furniValue });
    }
    const handleRentareaInput = (event) => {
        const value = event.target.value;
        setrentData((prevState) => ({
            ...prevState,
            carpetArea: value === '' ? '' : parseInt(value, 10),
        }));
    };
    const changerentarea = (e, value) => {
        e.preventDefault();
        setrentData((prevState) => ({
            ...prevState,
            areaUnit: value, // Update formData with the selected unit
        }));
    }
    const formatrentPrice = (value) => {
        if (!value) return ""; // Handle empty input
        const num = parseFloat(value);

        if (isNaN(num)) return value; // Handle invalid number input

        if (num >= 10000000) {
            return `${(num / 10000000).toFixed(1)} Cr`; // Format as Crore
        } else if (num >= 100000) {
            return `${(num / 100000).toFixed(1)} Lacs`; // Format as Lacs
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)} K`; // Format as Thousand
        } else {
            return num.toString(); // Return as is for smaller values
        }
    };
    const handleInputrentChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, ""); // Allow only numbers
        setrentData((prevData) => ({
            ...prevData,
            monthlyRent: value, // Store the rent price in rentData
        }));
        setFormattedrentPrice(formatrentPrice(value));
    };
    const handledepInputrentChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, ""); // Allow only numbers
        setrentData((prevData) => ({
            ...prevData,
            securityDeposit: value, // Store the security deposit in rentData
        }));
        setdepFormattedrentPrice(formatrentPrice(value));
    };
    const handlerentpage = () => {
        let formErrors = {};
        if (!rentData.propertyType) {
            formErrors.type = 'Select Property Type';
        }
        const namepattern = /^[A-Za-z\s]+$/;
        if (!rentData.city) {
            formErrors.city = 'City is required';
        } else if (!namepattern.test(rentData.city)) {
            formErrors.city = 'Please enter a valid city';
        }
        if (!rentData.locality) {
            formErrors.location = 'Location is required';
        } else if (!namepattern.test(rentData.locality)) {
            formErrors.location = 'Please enter a valid Location';
        }
        if (!rentData.societyName) {
            formErrors.societyName = 'Name of Society/Project is required';
        } else if (!namepattern.test(rentData.society)) {
            formErrors.societyName = 'Please enter a Name';
        }
        if (!rentData.bhk) {
            formErrors.bhk = 'Select BHK';
        }
        if (!rentData.furnishedType) {
            formErrors.furni = 'Select furnished Type';
        }
        const areapattern = /^\d+(\.\d{1,2})?$/;
        if (!rentData.carpetArea) {
            formErrors.carea = 'Carpet Area is required';
        } else if (!areapattern.test(rentData.carpetArea)) {
            formErrors.carea = 'Please enter a valid numbers';
        }
        if (!rentData.areaUnit) {
            formErrors.cunit = 'Select Carpet Area Unit';
        }
        if (!rentData.securityDeposit) {
            formErrors.sprice = 'Security Deposit is required';
        }
        if (!rentData.monthlyRent) {
            formErrors.mprice = 'Monthly Rent is required';
        }
        if (!rentData.availableFrom) {
            formErrors.avail = 'Available date cannot be empty';
        } else {
            const date = typeof rentData.availableFrom === 'string' ? new Date(rentData.availableFrom) : rentData.availableFrom;
            const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date.toISOString().split('T')[0]);
            if (!isValidDate) {
                formErrors.avail = 'Date must be in the format YYYY-MM-DD';
            }
        }
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return; // Stop the form submission if there are errors
        }
        navigate('/admin/edit2-property', { state: rentData});
    }
    return (
        <div>
            <div className='container rent-main-box w-50'>
                <div className='rent-main2-box bg-white p-4'>
                    <div className='rent-head'><h3>Edit Rent Property</h3></div>
                    <div className='mt-4'>
                        <div className='mb-2'>Property Type</div>
                        <div class="dropdown d-flex rent-drop">
                            <button class="btn btn-secondary dropdown-toggle bg-white text-dark d-flex justify-content-between align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span>{rentData.propertyType || 'Select Property type'}</span>
                                <span className="dropdown-arrow"></span>
                            </button>
                            <ul class="dropdown-menu rent-drop-menu">
                                <li><a class="dropdown-item" onClick={() => changedrop("Flat")}>Flat</a></li>
                                <li><a class="dropdown-item" onClick={() => changedrop("Residential House")}>Residential House</a></li>
                                <li><a class="dropdown-item" onClick={() => changedrop("Villa")}>Villa</a></li>
                                <li><a class="dropdown-item" onClick={() => changedrop("Penthouse")}>Penthouse</a></li>
                                <li><a class="dropdown-item" onClick={() => changedrop("Builder Floor Ready")}>Builder Floor Ready to Move</a></li>
                                <li><a class="dropdown-item" onClick={() => changedrop("Office")}>Office</a></li>
                                <li><a class="dropdown-item" onClick={() => changedrop("Shop")}>Shop</a></li>
                                <li><a class="dropdown-item" onClick={() => changedrop("Retail")}>Retail</a></li>
                                <li><a class="dropdown-item" onClick={() => changedrop("Godam")}>Godown</a></li>
                                <li><a class="dropdown-item" onClick={() => changedrop("Industry")}>Industry</a></li>
                            </ul>
                        </div>
                        {errors.type && <div className="text-danger error-txt">{errors.type}</div>}
                    </div>
                    <div className={errors.type ? 'mt-4' : 'mt-5'}>
                        <div><h5>Property Location</h5></div>
                        <div>
                            <div>City</div>
                            <input type="text" className="rent-property-inp p-2 pt-1 w-100" name='pcity' id='city'
                                value={rentData.city}
                                onChange={(e) => setrentData({ ...rentData, city: e.target.value })} />
                            {errors.city && <div className="text-danger error-txt">{errors.city}</div>}
                            <div className='mt-3'>Locality</div>
                            <input type="text" className="rent-property-inp p-2 pt-1 w-100" name='locality' id='plocality'
                                value={rentData.locality}
                                onChange={(e) => setrentData({ ...rentData, locality: e.target.value })} />
                            {errors.location && <div className="text-danger error-txt">{errors.location}</div>}
                            <div className='mt-3'>Name of Society/Project</div>
                            <input type="text" className="rent-property-inp p-2 pt-1 w-100" name='namesociety' id='project'
                                value={rentData.societyName}
                                onChange={(e) => setrentData({ ...rentData, societyName: e.target.value })} />
                            {errors.societyName && <div className="text-danger error-txt">{errors.societyName}</div>}
                        </div>
                    </div>
                    <div className={errors.societyName ? 'mt-4' : 'mt-5'}>
                        <div><h5>BHK</h5></div>
                        <div className='d-flex'>
                            <button className='btn btn-light border' onClick={() => handlerentBhk("bhk1")}
                                style={clickedrentBhk.bhk1 || rentData.bhk.includes('1RK') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >1RK</button>
                            <button className='btn btn-light border ms-3' onClick={() => handlerentBhk("bhk2")}
                                style={clickedrentBhk.bhk2 || rentData.bhk.includes('1BHK') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>1BHK</button>
                            <button className='btn btn-light border ms-3' onClick={() => handlerentBhk("bhk3")}
                                style={clickedrentBhk.bhk3 || rentData.bhk.includes('2BHK') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >2BHK</button>
                            <button className='btn btn-light border ms-3' onClick={() => handlerentBhk("bhk4")}
                                style={clickedrentBhk.bhk4 || rentData.bhk.includes('3BHK') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>3BHK</button>
                        </div>
                        {errors.bhk && <div className="text-danger error-txt">{errors.bhk}</div>}
                    </div>
                    <div className={errors.bhk ? 'mt-4' : 'mt-5'}>
                        <div className='mb-2'><h5>Furnished Type</h5></div>
                        <div className='d-flex'>
                            <button className='btn btn-light border' onClick={() => handlerentfurni("furni1")}
                                style={clickedrentfurni.furni1 || rentData.furnishedType.includes('Fully furnished') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Fully furnished</button>
                            <button className='btn btn-light border ms-3' onClick={() => handlerentfurni("furni2")}
                                style={clickedrentfurni.furni2 || rentData.furnishedType.includes('Semi Furnished') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>Semi Furnished</button>
                            <button className='btn btn-light border ms-3' onClick={() => handlerentfurni("furni3")}
                                style={clickedrentfurni.furni3 || rentData.furnishedType.includes('Unfurnished') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Unfurnished</button>
                        </div>
                        {errors.furni && <div className="text-danger error-txt">{errors.furni}</div>}
                    </div>
                    <div className={errors.furni ? 'mt-4' : 'mt-5'}>
                        <div><h5>Area</h5></div>
                        <div className='mt-2 mb-2'>Carpet Area</div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Text input with dropdown button"
                                value={rentData.carpetArea}
                                onChange={handleRentareaInput} />
                            <button className="btn btn-secondary bg-white text-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"> {rentData.areaUnit || 'Select Area'}</button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><a className="dropdown-item" onClick={(e) => changerentarea(e, "Sq-ft")} href="#">Sq-ft</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changerentarea(e, "Sq-yrd")} href="#">Sq-yrd</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changerentarea(e, "Sq-m")} href="#">Sq-m</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changerentarea(e, "Acre")} href="#">Acre</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changerentarea(e, "Bigha")} href="#">Bigha</a></li>
                            </ul>
                        </div>
                        {errors.carea && <div className="text-danger error-txt">{errors.carea}</div>}
                        {errors.cunit && <div className="text-danger error-txt">{errors.cunit}</div>}
                    </div>
                    <div className={errors.carea || errors.cunit ? 'mt-4' : 'mt-5'}>
                        <div><h5>Price Details</h5></div>
                        <div>
                            <div>Monthly Rent</div>
                            <div className='d-flex'>
                                <FaRupeeSign className='rupee-icon' /><input type="text" className='property-inp p-2 w-100' name='price' value={rentData.monthlyRent}
                                    onChange={handleInputrentChange} id='price' />
                            </div>
                            <span className='fw-bold ms-3 price-format'>{formattedrentPrice}</span>
                            {errors.mprice && <div className="text-danger error-txt">{errors.mprice}</div>}
                            <div className='mt-3'>Security Deposit</div>
                            <div className='d-flex'>
                                <FaRupeeSign className='rupee-icon' /><input type="text" className='property-inp p-2 w-100' name='price' value={rentData.securityDeposit}
                                    onChange={handledepInputrentChange} id='price' />
                            </div>
                            <span className='fw-bold ms-3 price-format'>{depformattedrentPrice}</span>
                            {errors.sprice && <div className="text-danger error-txt">{errors.sprice}</div>}
                        </div>
                    </div>
                    <div className='rent-date-cont mt-3'>
                        <div><h5>Available From</h5></div>
                        <DatePicker
                            id="date"
                            selected={rentData.availableFrom}
                            onChange={(date) => setrentData({ ...rentData, availableFrom: date })} // Update state with the selected date
                            dateFormat="yyyy-MM-dd" // Format shown in the input
                            placeholderText="YYYY - MM - DD" // Placeholder text for the input field
                            className="form-control rent-date" // Bootstrap input styling
                        />
                        {errors.avail && <div className="text-danger error-txt">{errors.avail}</div>}
                    </div>
                    <button className='sell-btn p-2 w-100 text-white fw-bold mt-4' onClick={handlerentpage}>Post Property</button>
                </div>
            </div>
        </div>
    )
}

export default Rent