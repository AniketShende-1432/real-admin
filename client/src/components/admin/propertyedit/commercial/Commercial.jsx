import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Commercial = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const property = location.state || {};

    const [formattedcommPrice, setFormattedcommPrice] = useState("");
    const [clickedcommowner, setclickedcommowner] = useState({
        free: false,
        lease: false,
        co_operate: false,
        power: false,
    });
    const [possessionStatus, setPossessionStatus] = useState("");
    const [CommData, setCommData] = useState(property);
    const [errors, setErrors] = useState({});
    const changedropcomm = (value) => {
        setCommData((prevState) => ({
            ...prevState,
            propertyType: value
        }));
    };
    const handlecommpossChange = (event) => {
        const poss = event.target.value;
        setPossessionStatus(poss);
        setCommData({ ...CommData, possessionStatus: poss });
    }
    const handleCommAreaInput = (event) => {
        const value = event.target.value;
        setCommData((prevState) => ({
            ...prevState,
            carpetArea: value.trim() === '' ? '' : isNaN(parseInt(value, 10)) ? prevState.carpetArea : parseInt(value, 10),
        }));
    }
    const changecommarea = (e, value) => {
        e.preventDefault();
        setCommData((prevState) => ({
            ...prevState,
            areaUnit: value, // Update formData with the selected unit
        }));
    };
    const handlecommowner = (buttonKey) => {
        setclickedcommowner((prevState) => ({
            [buttonKey]: !prevState[buttonKey], // Toggle the clicked button's style
        }));
        const own = buttonKey === 'free' ? 'Freehold' :
            buttonKey === 'lease' ? 'Leasehold' :
                buttonKey === 'co_operate' ? 'Co-operative Society' : 'Power of Attorney'
        setCommData({ ...CommData, ownership: own });
    };
    const formatcommPrice = (value) => {
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
    const handleInputcommChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, ""); // Allow only numbers
        setCommData({ ...CommData, price: value === '' ? '' : parseInt(value, 10) });
        setFormattedcommPrice(formatcommPrice(value));
    };
    const handlecommpage = () => {
        let formErrors = {};
        if (!CommData.propertyType) {
            formErrors.type = 'Select Property Type';
        }
        const namepattern = /^[A-Za-z\s]+$/;
        if (!CommData.city) {
            formErrors.city = 'City is required';
        } else if (!namepattern.test(CommData.city)) {
            formErrors.city = 'Please enter a valid city';
        }
        if (!CommData.locality) {
            formErrors.location = 'Location is required';
        } else if (!namepattern.test(CommData.locality)) {
            formErrors.location = 'Please enter a valid Location';
        }
        if (!CommData.projectName) {
            formErrors.projectName = 'Name of Society/Project is required';
        } else if (!namepattern.test(CommData.projectName)) {
            formErrors.projectName = 'Please enter a valid Name';
        }
        if (!CommData.possessionStatus) {
            formErrors.poss = 'Select Possession Status';
        }
        const areapattern = /^\d+(\.\d{1,2})?$/;
        if (!CommData.carpetArea) {
            formErrors.carea = 'Carpet Area is required';
        } else if (!areapattern.test(CommData.carpetArea)) {
            formErrors.carea = 'Please enter a valid numbers';
        }
        if (!CommData.areaUnit) {
            formErrors.cunit = 'Select Carpet Area Unit';
        }
        if (!CommData.ownership) {
            formErrors.owner = 'Ownership is Required';
        }
        if (!CommData.price) {
            formErrors.price = 'Price is Required';
        }
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return; // Stop the form submission if there are errors
        }
        navigate('/admin/edit2-property', { state: CommData });
    }
    return (
        <div>
            <div className='container rent-main-box w-50'>
                <div className='rent-main2-box bg-white p-4'>
                    <div className='rent-head'><h3>Commercial Property</h3></div>
                    <div className='mt-4'>
                        <div className='mb-2'>Property Type</div>
                        <div class="dropdown d-flex rent-drop">
                            <button class="btn btn-secondary dropdown-toggle bg-white text-dark d-flex justify-content-between align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span>{CommData.propertyType || 'Select Property type'}</span>
                                <span className="dropdown-arrow"></span>
                            </button>
                            <ul class="dropdown-menu rent-drop-menu">
                                <li><a class="dropdown-item" onClick={() => changedropcomm("Office")} href="#">Office</a></li>
                                <li><a class="dropdown-item" onClick={() => changedropcomm("Shop")} href="#">Shop</a></li>
                                <li><a class="dropdown-item" onClick={() => changedropcomm("Retail")} href="#">Retail</a></li>
                                <li><a class="dropdown-item" onClick={() => changedropcomm("Godam")} href="#">Godown</a></li>
                                <li><a class="dropdown-item" onClick={() => changedropcomm("Industry")} href="#">Industry</a></li>
                            </ul>
                        </div>
                        {errors.type && <div className="text-danger error-txt">{errors.type}</div>}
                    </div>
                    <div className={errors.type ? 'mt-4' : 'mt-5'}>
                        <div><h5>Property Location</h5></div>
                        <div>
                            <div>City</div>
                            <input type="text" className="rent-property-inp p-2 pt-1 w-100" name='pcity' id='city'
                                value={CommData.city}
                                onChange={(e) => setCommData({ ...CommData, city: e.target.value })} />
                            {errors.city && <div className="text-danger error-txt">{errors.city}</div>}
                            <div className='mt-3'>Locality</div>
                            <input type="text" className="rent-property-inp p-2 pt-1 w-100" name='locality' id='plocality'
                                value={CommData.locality}
                                onChange={(e) => setCommData({ ...CommData, locality: e.target.value })} />
                            {errors.location && <div className="text-danger error-txt">{errors.location}</div>}
                            <div className='mt-3'>Name of Building/Project</div>
                            <input type="text" className="rent-property-inp p-2 pt-1 w-100" name='building' id='cproject'
                                value={CommData.projectName}
                                onChange={(e) => setCommData({ ...CommData, projectName: e.target.value })} />
                            {errors.projectName && <div className="text-danger error-txt">{errors.projectName}</div>}
                        </div>
                    </div>
                    <div className={errors.projectName ? 'mt-4' : 'mt-5'}>
                        <div><h5>Possession Status</h5></div>
                        <div className='d-flex'>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="constructcomm"
                                    value="Under Construction"
                                    checked={CommData.possessionStatus === "Under Construction"}
                                    onChange={handlecommpossChange} />
                                <label className="form-check-label" for="constructcomm">
                                    Under Construction
                                </label>
                            </div>
                            <div className="form-check ms-4">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="readyn"
                                    value="Ready to Move New"
                                    checked={CommData.possessionStatus === "Ready to Move New"}
                                    onChange={handlecommpossChange} />
                                <label className="form-check-label" for="readyn">
                                    Ready to Move New
                                </label>
                            </div>
                            <div className="form-check ms-4">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="resell2"
                                    value="Resell"
                                    checked={CommData.possessionStatus === "Resell"}
                                    onChange={handlecommpossChange} />
                                <label className="form-check-label" for="resell2">
                                    Resell
                                </label>
                            </div>
                        </div>
                        {errors.poss && <div className="text-danger error-txt">{errors.poss}</div>}
                    </div>
                    <div className={errors.poss ? 'mt-4' : 'mt-5'}>
                        <div><h5>Area</h5></div>
                        <div className='mt-2 mb-2'>Carpet Area</div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Text input with dropdown button"
                                value={CommData.carpetArea}
                                onChange={handleCommAreaInput} />
                            <button className="btn btn-secondary bg-white text-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"> {CommData.areaUnit || "Select Unit"}</button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><a className="dropdown-item" onClick={(e) => changecommarea(e, "Sq-ft")} href="#">Sq-ft</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changecommarea(e, "Sq-yrd")} href="#">Sq-yrd</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changecommarea(e, "Sq-m")} href="#">Sq-m</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changecommarea(e, "Acre")} href="#">Acre</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changecommarea(e, "Bigha")} href="#">Bigha</a></li>
                            </ul>
                        </div>
                        {errors.carea && <div className="text-danger error-txt">{errors.carea}</div>}
                        {errors.cunit && <div className="text-danger error-txt">{errors.cunit}</div>}
                    </div>
                    <div className={errors.carea || errors.cunit ? 'mt-3' : 'mt-4'}>
                        <div><h5>Ownership</h5></div>
                        <div className='d-flex'>
                            <button className='btn btn-light border' onClick={() => handlecommowner("free")}
                                style={clickedcommowner.free || CommData.ownership === 'Freehold' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Freehold</button>
                            <button className='btn btn-light border ms-3' onClick={() => handlecommowner("lease")}
                                style={clickedcommowner.lease || CommData.ownership === 'Leasehold' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>Leasehold</button>
                            <button className='btn btn-light border ms-3' onClick={() => handlecommowner("co_operate")}
                                style={clickedcommowner.co_operate || CommData.ownership === 'Co-operative Society' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Co-operative Society</button>
                            <button className='btn btn-light border ms-3' onClick={() => handlecommowner("power")}
                                style={clickedcommowner.power || CommData.ownership === 'Power of Attorney' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>Power of Attorney</button>
                        </div>
                        {errors.owner && <div className="text-danger error-txt">{errors.owner}</div>}
                    </div>
                    <div className={errors.owner ? 'mt-3' : 'mt-4'}>
                        <div><h5>Price Details</h5></div>
                        <div>
                            <div>Cost</div>
                            <div className='d-flex'>
                                <FaRupeeSign className='rupee-icon' /><input type="text" className='property-inp p-2 w-100' name='plotprice' value={CommData.price}
                                    onChange={handleInputcommChange} id='price' />
                            </div>
                        </div>
                        <span className='fw-bold ms-3 price-format'>{formattedcommPrice}</span>
                        {errors.price && <div className="text-danger error-txt">{errors.price}</div>}
                    </div>
                    <button className='sell-btn p-2 w-100 text-white fw-bold mt-3' onClick={handlecommpage}>Post Property</button>
                </div>
            </div>
        </div>
    )
}

export default Commercial