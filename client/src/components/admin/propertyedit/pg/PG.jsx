import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import '../Propertyedit.css';

const PG = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const property = location.state || {};

    const [formattedpgPrice, setFormattedpgPrice] = useState("");
    const [depformattedpgPrice, setdepFormattedpgPrice] = useState("");
    const mDurationoptions = ['0 month', '1 month'];
    const [pgData, setpgData] = useState(property);
    const [errors, setErrors] = useState({});
    const changepg = (value) => {
        setpgData((prevState) => ({
            ...prevState,
            propertyType: value
        }));
    };
    const handlepgtype = (buttonKey) => {
        const room = buttonKey === 'share' ? 'Shared' : 'Private'; // Default to '3BHK' if 'bhk4' is clicked
        setpgData({ ...pgData, roomType: room });
    };
    const handleroom = (e) => {
        const value = e.target.value.replace(/[^\d]/g, "");
        setpgData({
            ...pgData,
            capacity: value === '' ? '' : parseInt(value, 10)
        });
    }
    const handlePgareainput = (event) => {
        const value = event.target.value;
        setpgData((prevState) => ({
            ...prevState,
            carpetArea: value === '' ? '' : parseInt(value, 10),
        }));
    };
    const changepgarea = (e, value) => {
        e.preventDefault();
        setpgData((prevState) => ({
            ...prevState,
            areaUnit: value, // Update formData with the selected unit
        }));
    };
    const handlepgfurni = (buttonKey) => {
        const furniValue = buttonKey === 'furni1' ? 'Fully furnished' :
            buttonKey === 'furni2' ? 'Semi Furnished' : "Unfurnished"
        setpgData({ ...pgData, furnishedType: furniValue });
    };
    const handlepgfor = (buttonKey) => {
        const availfor = buttonKey === 'girl' ? 'Girls' :
            buttonKey === 'boy' ? 'Boys' : "Any"
        setpgData({ ...pgData, availableFor: availfor });
    };
    const formatpgPrice = (value) => {
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
    const handleInputpgChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, ""); // Allow only numbers
        setpgData((prevData) => ({
            ...prevData,
            monthlyRent: value, // Store the security deposit in rentData
        }));
        setFormattedpgPrice(formatpgPrice(value));
    };
    const handledepInputpgChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, ""); // Allow only numbers
        setpgData((prevData) => ({
            ...prevData,
            securityDeposit: value, // Store the security deposit in rentData
        }));
        setdepFormattedpgPrice(formatpgPrice(value));
    };
    for (let i = 2; i <= 36; i++) {
        mDurationoptions.push(`${i} months`);
    }
    const changepgduardrop = (e, value) => {
        e.preventDefault();
        setpgData((prevData) => ({
            ...prevData,
            durationOfAgreement: value, // Store the security deposit in rentData
        }));
    }
    const handlepgpage = () => {
        let formErrors = {};
        if (!pgData.propertyType) {
            formErrors.type = 'Select Property Type';
        }
        const namepattern = /^[A-Za-z\s]+$/;
        if (!pgData.city) {
            formErrors.city = 'City is required';
        } else if (!namepattern.test(pgData.city)) {
            formErrors.city = 'Please enter a valid city';
        }
        if (!pgData.locality) {
            formErrors.location = 'Location is required';
        } else if (!namepattern.test(pgData.locality)) {
            formErrors.location = 'Please enter a valid Location';
        }
        if (!pgData.societyName) {
            formErrors.societyName = 'Name of Society/Project is required';
        } else if (!namepattern.test(pgData.societyName)) {
            formErrors.societyName = 'Please enter a valid Name';
        }
        if (!pgData.roomType) {
            formErrors.room = 'Select Room Type';
        }
        if (!pgData.furnishedType) {
            formErrors.furni = 'Select furnished Type';
        }
        const capacityPattern = /^\d{1,2}$/;
        if (!pgData.capacity) {
            formErrors.capacity = "Enter Capacity"
        } else if (!capacityPattern.test(pgData.capacity)) {
            formErrors.capacity = 'Please enter a valid Number(not more than 2 digit)';
        }
        const areapattern = /^\d+(\.\d{1,2})?$/;
        if (!pgData.carpetArea) {
            formErrors.carea = 'Carpet Area is required';
        } else if (!areapattern.test(pgData.carpetArea)) {
            formErrors.carea = 'Please enter a valid numbers';
        }
        if (!pgData.areaUnit) {
            formErrors.cunit = 'Select Carpet Area Unit';
        }
        if (!pgData.availableFor) {
            formErrors.availFor = 'Select Available For !';
        }
        if (!pgData.securityDeposit) {
            formErrors.sprice = 'Security Deposit is required';
        }
        if (!pgData.monthlyRent) {
            formErrors.mprice = 'Monthly Rent is required';
        }
        if (!pgData.durationOfAgreement) {
            formErrors.duration = 'Duration is required';
        }
        if (!pgData.availableFrom) {
            formErrors.avail = 'Available date cannot be empty';
        } else {
            const date = typeof pgData.availableFrom === 'string' ? new Date(pgData.availableFrom) : pgData.availableFrom;
            const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date.toISOString().split('T')[0]);
            if (!isValidDate) {
                formErrors.avail = 'Date must be in the format YYYY-MM-DD';
            }
        }
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return; // Stop the form submission if there are errors
        }
        navigate('/admin/edit2-property', { state: pgData });
    }

    return (
        <div>
            <div className='container rent-main-box w-50'>
                <div className='rent-main2-box bg-white p-4'>
                    <div className='rent-head'><h3>PG Property</h3></div>
                    <div className='mt-4'>
                        <div className='mb-2'>Property Type</div>
                        <div class="dropdown d-flex rent-drop">
                            <button class="btn btn-secondary dropdown-toggle bg-white text-dark d-flex justify-content-between align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span>{pgData.propertyType || 'Select Property type'}</span>
                                <span className="dropdown-arrow"></span>
                            </button>
                            <ul class="dropdown-menu rent-drop-menu">
                                <li><a class="dropdown-item" onClick={() => changepg("Flat")} href="#">Flat</a></li>
                                <li><a class="dropdown-item" onClick={() => changepg("Residential House")} href="#">Residential House</a></li>
                                <li><a class="dropdown-item" onClick={() => changepg("Villa")} href="#">Villa</a></li>
                                <li><a class="dropdown-item" onClick={() => changepg("Penthouse")} href="#">Penthouse</a></li>
                                <li><a class="dropdown-item" onClick={() => changepg("Builder Floor Ready")} href="#">Builder Floor Ready to Move</a></li>
                            </ul>
                        </div>
                        {errors.type && <div className="text-danger error-txt">{errors.type}</div>}
                    </div>
                    <div className={errors.type ? 'mt-4' : 'mt-5'}>
                        <div><h5>Property Location</h5></div>
                        <div>
                            <div>City</div>
                            <input type="text" className="rent-property-inp p-2 pt-1 w-100" name='pcity' id='city'
                                value={pgData.city}
                                onChange={(e) => setpgData({ ...pgData, city: e.target.value })} />
                            {errors.city && <div className="text-danger error-txt">{errors.city}</div>}
                            <div className='mt-3'>Locality</div>
                            <input type="text" className="rent-property-inp p-2 pt-1 w-100" name='pglocality' id='plocality'
                                value={pgData.locality}
                                onChange={(e) => setpgData({ ...pgData, locality: e.target.value })} />
                            {errors.location && <div className="text-danger error-txt">{errors.location}</div>}
                            <div className='mt-3'>Name of Society/Project</div>
                            <input type="text" className="rent-property-inp p-2 pt-1 w-100" name='psociety' id='project'
                                value={pgData.societyName}
                                onChange={(e) => setpgData({ ...pgData, societyName: e.target.value })} />
                            {errors.societyName && <div className="text-danger error-txt">{errors.societyName}</div>}
                        </div>
                    </div>
                    <div className={errors.societyName ? 'mt-4' : 'mt-5'}>
                        <div><h5>Room Type</h5></div>
                        <div className='d-flex'>
                            <button className='btn btn-light border' onClick={() => handlepgtype("share")}
                                style={pgData.roomType === 'Shared' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Shared</button>
                            <button className='btn btn-light border ms-3' onClick={() => handlepgtype("prv")}
                                style={pgData.roomType === 'Private' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>Private</button>
                        </div>
                        {errors.room && <div className="text-danger error-txt">{errors.room}</div>}
                    </div>
                    <div className={errors.room ? 'mt-4' : 'mt-5'}>
                        <div><h5>Capacity (Total No. of Beds)</h5></div>
                        <input type="text" className="rent-property-inp p-2 pt-1 w-100" name='bed' id='nobed'
                            value={pgData.capacity}
                            onChange={handleroom} />
                        {errors.capacity && <div className="text-danger error-txt">{errors.capacity}</div>}
                    </div>
                    <div className={errors.capacity ? 'mt-4' : 'mt-5'}>
                        <div><h5>Area</h5></div>
                        <div className='mt-2 mb-2'>Carpet Area</div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Text input with dropdown button"
                                value={pgData.carpetArea}
                                onChange={handlePgareainput} />
                            <button className="btn btn-secondary bg-white text-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{pgData.areaUnit || 'Select Area'}</button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><a className="dropdown-item" onClick={(e) => changepgarea(e, "Sq-ft")} href="#">Sq-ft</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changepgarea(e, "Sq-yrd")} href="#">Sq-yrd</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changepgarea(e, "Sq-m")} href="#">Sq-m</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changepgarea(e, "Acre")} href="#">Acre</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changepgarea(e, "Bigha")} href="#">Bigha</a></li>
                            </ul>
                        </div>
                        {errors.carea && <div className="text-danger error-txt">{errors.carea}</div>}
                        {errors.cunit && <div className="text-danger error-txt">{errors.cunit}</div>}
                    </div>
                    <div className={errors.carea || errors.cunit ? 'mt-4' : 'mt-5'}>
                        <div className='mb-2'><h5>Furnished Type</h5></div>
                        <div className='d-flex'>
                            <button className='btn btn-light border' onClick={() => handlepgfurni("furni1")}
                                style={ pgData.furnishedType === 'Fully furnished' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Fully furnished</button>
                            <button className='btn btn-light border ms-3' onClick={() => handlepgfurni("furni2")}
                                style={ pgData.furnishedType === 'Semi Furnished' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>Semi Furnished</button>
                            <button className='btn btn-light border ms-3' onClick={() => handlepgfurni("furni3")}
                                style={ pgData.furnishedType === 'Unfurnished' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Unfurnished</button>
                        </div>
                        {errors.furni && <div className="text-danger error-txt">{errors.furni}</div>}
                    </div>
                    <div className='rent-date-cont mt-4'>
                        <div><h5>Available From</h5></div>
                        <DatePicker
                            id="date"
                            selected={pgData.availableFrom}
                            onChange={(date) => setpgData({ ...pgData, availableFrom: date })} // Update state with the selected date
                            dateFormat="yyyy-MM-dd" // Format shown in the input
                            placeholderText="YYYY - MM - DD" // Placeholder text for the input field
                            className="form-control rent-date" // Bootstrap input styling
                        />
                        {errors.avail && <div className="text-danger error-txt">{errors.avail}</div>}
                    </div>
                    <div className='mt-4'>
                        <div><h5>Available For</h5></div>
                        <div className='d-flex'>
                            <button className='btn btn-light border' onClick={() => handlepgfor("girl")}
                                style={ pgData.availableFor === 'Girls' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Girls</button>
                            <button className='btn btn-light border ms-3' onClick={() => handlepgfor("boy")}
                                style={ pgData.availableFor === 'Boys' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>Boys</button>
                            <button className='btn btn-light border ms-3' onClick={() => handlepgfor("any")}
                                style={ pgData.availableFor === 'Any' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Any</button>
                        </div>
                        {errors.availFor && <div className="text-danger error-txt">{errors.availFor}</div>}
                    </div>
                    <div className={errors.availFor ? 'mt-4' : 'mt-5'}>
                        <div><h5>Price Details</h5></div>
                        <div>
                            <div>Monthly Rent</div>
                            <div className='d-flex'>
                                <FaRupeeSign className='rupee-icon' /><input type="text" className='property-inp p-2 w-100' name='price'
                                    value={pgData.monthlyRent}
                                    onChange={handleInputpgChange} id='price' />
                            </div>
                            {errors.mprice && <div className="text-danger error-txt">{errors.mprice}</div>}
                            <span className='fw-bold ms-3 price-format'>{formattedpgPrice}</span>
                            <div className={errors.mprice ? 'mt-0' : 'mt-3'}>Security Deposit</div>
                            <div className='d-flex'>
                                <FaRupeeSign className='rupee-icon' /><input type="text" className='property-inp p-2 w-100' name='price'
                                    value={pgData.securityDeposit}
                                    onChange={handledepInputpgChange} id='price' />
                            </div>
                            {errors.sprice && <div className="text-danger error-txt">{errors.sprice}</div>}
                            <span className='fw-bold ms-3 price-format'>{depformattedpgPrice}</span>
                        </div>
                    </div>
                    <div className={errors.sprice ? 'mt-2' : 'mt-4'}>
                        <div><h5>Minimum Duration of Contract</h5></div>
                        <div class="dropdown d-flex rent-drop">
                            <button class="btn btn-secondary dropdown-toggle bg-white text-dark d-flex justify-content-between align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span>{pgData.durationOfAgreement || 'Select'}</span>
                                <span className="dropdown-arrow"></span>
                            </button>
                            <ul class="dropdown-menu rent-drop-menu">
                                {mDurationoptions.map((option, index) => (
                                    <li key={index}>
                                        <a class="dropdown-item" onClick={(e) => changepgduardrop(e, option)} href="#">{option}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {errors.duration && <div className="text-danger error-txt">{errors.duration}</div>}
                    </div>
                    <button className='sell-btn p-2 w-100 text-white fw-bold mt-4' onClick={handlepgpage}>Post Property</button>
                </div>
            </div>
        </div>
    )
}

export default PG