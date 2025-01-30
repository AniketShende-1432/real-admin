import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Plot = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const property = location.state || {};

    const [clickedplotapprove, setclickedplotapprove] = useState({
        na: false,
        na_pro: false,
        collect: false,
        co_operation: false,
    });
    const [clickedplotowner, setclickedplotowner] = useState({
        free: false,
        lease: false,
        co_operate: false,
        power: false,
    });
    const [formattedplotPrice, setFormattedplotPrice] = useState("");
    const [plotData, setplotData] = useState(property);

    const [formErrors, setFormErrors] = useState({});

    const handlecity = (e) => {
        const value = e.target.value;
        setplotData({
            ...plotData, // Copy the existing state
            city: value, // Update the city field with the new value
        });
        const namepattern = /^[A-Za-z\s]+$/;
        if (value.trim() === "") {
            setFormErrors({
                ...formErrors,
                city: "",
            });
        }
        else if (!namepattern.test(value)) {
            setFormErrors({
                ...formErrors,
                city: "Please enter a valid city",
            });
        }
        else {
            setFormErrors({
                ...formErrors,
                city: "",
            });
        }
    }
    const handlelocation = (e) => {
        const value = e.target.value;
        setplotData({
            ...plotData, // Copy the existing state
            locality: value, // Update the city field with the new value
        });
        const namepattern = /^[A-Za-z\s]+$/;
        if (value.trim() === "") {
            setFormErrors({
                ...formErrors,
                location: "",
            });
        }
        else if (!namepattern.test(value)) {
            setFormErrors({
                ...formErrors,
                location: "Please enter a valid Locality",
            });
        }
        else {
            setFormErrors({
                ...formErrors,
                location: "",
            });
        }
    }
    const handlesociety = (e) => {
        const value = e.target.value;
        setplotData({
            ...plotData, // Copy the existing state
            societyName: value, // Update the city field with the new value
        });
        const namepattern = /^[A-Za-z\s]+$/;
        if (value.trim() === "") {
            setFormErrors({
                ...formErrors,
                society: "",
            });
        }
        else if (!namepattern.test(value)) {
            setFormErrors({
                ...formErrors,
                society: "Please enter a valid Name",
            });
        }
        else {
            setFormErrors({
                ...formErrors,
                society: "",
            });
        }
    }
    const handleAreaChange = (e) => {
        const value = e.target.value;
        setplotData({
            ...plotData,
            plotArea: value === '' ? '' : parseInt(value, 10), // Update the area value based on input
        });
        const areapattern = /^\d+(\.\d{1,2})?$/;
        if (value.trim() === "") {
            setFormErrors({
                ...formErrors,
                parea: "",
            });
        }
        else if (!areapattern.test(value)) {
            setFormErrors({
                ...formErrors,
                parea: "Please enter a Valid Number",
            });
        }
        else {
            setFormErrors({
                ...formErrors,
                parea: "",
            });
        }
    };
    const changeplotarea = (e, value) => {
        e.preventDefault();
        setplotData({
            ...plotData,
            areaUnit: value, // Update the area unit when selected from the dropdown
        });
        setFormErrors({
            ...formErrors,
            punit: "",
        });
    };
    const validateField = (name, value) => {
        // Validation: Only positive numbers are allowed
        const numberPattern = /^[1-9]\d*(\.\d+)?$/;

        if (value.trim() === "") {
            return ""; // No error for empty input
        } else if (!numberPattern.test(value)) {
            return "Please enter a valid positive Number";
        } else {
            return ""; // Valid input
        }
    };
    const handledimenChange = (e) => {
        const { name, value } = e.target;
        setplotData((prevData) => ({
            ...prevData,
            dimensions: {
                ...prevData.dimensions, // Spread the previous dimensions
                [name]: value, // Dynamically update the field (length or breadth)
            },
        }));
        const error = validateField(name, value);
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [`p${name}`]: error, // Dynamically update the error key
        }));
    };
    const handlefloorChange = (e) => {
        const { name } = e.target;
        const val = e.target.value.replace(/[^\d]/g, "");
        setplotData((prevData) => ({
            ...prevData,
            features: {
                ...prevData.features, // Spread to keep existing feature data
                [name]: val === '' ? '' : parseInt(val, 10), // Dynamically update the floorAllowed field
            },
        }));
        setFormErrors({
            ...formErrors,
            floor: "",
        });
    };
    const handleplotbound = (buttonKey) => {
        setclickedplotbound((prevState) => {
            const newState = {
                [buttonKey]: !prevState[buttonKey], // Toggle the clicked button's style
            };

            // Update plotData state based on the button clicked
            setplotData((prevData) => ({
                ...prevData,
                features: {
                    ...prevData.features, // Spread to keep existing feature data
                    boundaryWall: buttonKey === 'yes', // Update boundaryWall based on the button clicked
                },
            }));

            setFormErrors((prevErrors) => ({
                ...prevErrors,
                boundary: "", // Dynamically update the error key
            }));

            return newState; // Return the updated clicked button state
        });
    };
    const handleplotside = (buttonKey) => {
        setclickedplotside((prevState) => ({
            [buttonKey]: !prevState[buttonKey], // Toggle the clicked button's style
        }));
        const open = buttonKey === 'open1' ? '1' :
            buttonKey === 'open2' ? '2' :
                buttonKey === 'open3' ? '3' :
                    '3+';
        setplotData((prevData) => ({
            ...prevData,
            features: {
                ...prevData.features, // Spread to keep existing feature data
                openSides: open, // Update boundaryWall based on the button clicked
            },
        }));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            open: "", // Dynamically update the error key
        }));
    };
    const changeposs = (e, value) => {
        e.preventDefault();
        setplotData((prevData) => ({
            ...prevData,
            possessionBy: value, // Set the possessionBy field with the selected value
        }));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            possession: "", // Dynamically update the error key
        }));
    };
    const handleplotapprove = (buttonKey) => {
        setclickedplotapprove((prevState) => ({
            [buttonKey]: !prevState[buttonKey], // Toggle the clicked button's style
        }));
        const approve = buttonKey === 'na' ? 'N.A(Non-Agricultural)' :
            buttonKey === 'na_pro' ? 'N.A(in-process)' :
                buttonKey === 'collect' ? 'Collector Approved' :
                    'Corporation Approved';
        setplotData((prevData) => ({
            ...prevData,
            approvedBy: approve,
        }));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            approve: "", // Dynamically update the error key
        }));
    };
    const handleplotowner = (buttonKey) => {
        setclickedplotowner((prevState) => ({
            [buttonKey]: !prevState[buttonKey], // Toggle the clicked button's style
        }));
        const owner = buttonKey === 'free' ? 'Freehold' :
            buttonKey === 'lease' ? 'Leasehold' :
                buttonKey === 'co_operate' ? 'Co-operative Society' :
                    'Power of Attorney';
        setplotData((prevData) => ({
            ...prevData,
            ownershipType: owner,
        }));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            owner: "", // Dynamically update the error key
        }));
    };
    const formatplotPrice = (value) => {
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
    const handleplotInputChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, ""); // Allow only numbers
        setplotData({ ...plotData, price: value === '' ? '' : parseInt(value, 10) });
        setFormattedplotPrice(formatplotPrice(value));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            price: "", // Dynamically update the error key
        }));
    };
    const handleplotpage = () => {
        const error = { ...formErrors };
        if (!plotData.city.trim()) {
            error.city = "City is required";
        }
        if (!plotData.locality.trim()) {
            error.location = "locality is required";
        }
        if (!plotData.societyName.trim()) {
            error.society = "Name is required";
        }
        if (!plotData.plotArea) {
            error.parea = "Plot Area is required";
        }
        if (!plotData.areaUnit) {
            error.punit = "Select Plot Area Unit";
        }
        if (!plotData.dimensions.length) {
            error.plength = "Length is Required";
        }
        if (!plotData.dimensions.breadth) {
            error.pbreadth = "Breadth is Required";
        }
        if (!plotData.features.floorAllowed) {
            error.floor = "No. Of Floors is Required";
        }
        if (plotData.features.boundaryWall === '' || plotData.features.boundaryWall === undefined) {
            error.boundary = "Boundary Wall is Required"; // Dynamically update the error key
        }
        if (!plotData.features.openSides) {
            error.open = "Open Sides is required"; // Dynamically update the error key
        }
        if (!plotData.possessionBy) {
            error.possession = "Possession By is required"; // Dynamically update the error key
        }
        if (!plotData.approvedBy) {
            error.approve = "Approved By is required"; // Dynamically update the error key
        }
        if (!plotData.ownershipType) {
            error.owner = "Ownership is required"; // Dynamically update the error key
        }
        if (!plotData.price) {
            error.price = "Cost is required"; // Dynamically update the error key
        }
        setFormErrors(error);
        const hasErrors = Object.values(error).some((er) => er.trim() !== "");
        if (hasErrors) {
            return;
        } else {
            navigate('/admin/edit2-property', { state: plotData});
        }
    };

    return (
        <div>
            <div className='container rent-main-box w-50'>
                <div className='rent-main2-box bg-white p-4'>
                    <div className='rent-head'><h3>Edit Plot/Land Property</h3></div>
                    <div className='mt-4'>
                        <div><h5>Property Location</h5></div>
                        <div>
                            <div>City/ Taluka/ District</div>
                            <input type="text" className="property-inp p-2 pt-1 w-100" name='pcity' id='city'
                                value={plotData.city}
                                onChange={handlecity} />
                            {formErrors.city && <div className="text-danger error-txt">{formErrors.city}</div>}
                            <div className={formErrors.city ? 'mt-2' : 'mt-3'}>Locality</div>
                            <input type="text" className="property-inp p-2 pt-1 w-100" name='locality' id='plocality'
                                value={plotData.locality}
                                onChange={handlelocation} />
                            {formErrors.location && <div className="text-danger error-txt">{formErrors.location}</div>}
                            <div className={formErrors.location ? 'mt-2' : 'mt-3'}>Name of Society/Project</div>
                            <input type="text" className="property-inp p-2 pt-1 w-100" name='society' id='project'
                                value={plotData.societyName}
                                onChange={handlesociety} />
                            {formErrors.society && <div className="text-danger error-txt">{formErrors.society}</div>}
                        </div>
                    </div>
                    <div className={formErrors.society ? 'mt-4' : 'mt-5'}>
                        <div><h5>Area</h5></div>
                        <div className='mt-2 mb-2'>Plot/Land Area</div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" aria-label="Text input with dropdown button"
                                value={plotData.plotArea} // Bind the area value to the state
                                onChange={handleAreaChange} />
                            <button className="btn btn-secondary bg-white text-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{plotData.areaUnit || 'Select Unit'}</button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><a className="dropdown-item" onClick={(e) => changeplotarea(e, "Sq-ft")} href="#">Sq-ft</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changeplotarea(e, "Sq-yrd")} href="#">Sq-yrd</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changeplotarea(e, "Sq-m")} href="#">Sq-m</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changeplotarea(e, "Acre")} href="#">Acre</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changeplotarea(e, "Bigha")} href="#">Bigha</a></li>
                            </ul>
                        </div>
                        {formErrors.parea && <div className="text-danger error-txt">{formErrors.parea}</div>}
                        {formErrors.punit && <div className="text-danger error-txt">{formErrors.punit}</div>}
                    </div>
                    <div className={formErrors.parea || formErrors.punit ? 'mt-3' : 'mt-5'}>
                        <div><h5>Property Dimensions</h5></div>
                        <div>
                            <div>Length of Plot (in Ft.)</div>
                            <input type="text" className="property-inp p-2 pt-1 w-100" name='length' id='lengthp'
                                value={plotData.dimensions.length} // Bind the length to the state
                                onChange={handledimenChange} />
                            {formErrors.plength && <div className="text-danger error-txt">{formErrors.plength}</div>}
                            <div className={formErrors.plength ? 'mt-2' : 'mt-3'}>Breadth of Plot (in Ft.)</div>
                            <input type="text" className="property-inp p-2 pt-1 w-100" name='breadth' id='breadthp'
                                value={plotData.dimensions.breadth} // Bind the length to the state
                                onChange={handledimenChange} />
                            {formErrors.pbreadth && <div className="text-danger error-txt">{formErrors.pbreadth}</div>}
                        </div>
                    </div>
                    <div className={formErrors.pbreadth ? 'mt-4' : 'mt-5'}>
                        <div><h5>Floor Allowed for Construction</h5></div>
                        <div>
                            <div>No. of floors</div>
                            <input type="text" className="property-inp p-2 pt-1 w-100" name='floorAllowed' id='nofloor'
                                value={plotData.features.floorAllowed}
                                onChange={handlefloorChange} />
                        </div>
                        {formErrors.floor && <div className="text-danger error-txt">{formErrors.floor}</div>}
                    </div>
                    <div className='mt-5'>
                        <div><h5>Is there a boundary wall around the property ?</h5></div>
                        <div className='d-flex'>
                            <button className='btn btn-light border' onClick={() => handleplotbound("yes")}
                                style={plotData.features.boundaryWall === true ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Yes</button>
                            <button className='btn btn-light border ms-3' onClick={() => handleplotbound("no")}
                                style={plotData.features.boundaryWall === false ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>No</button>
                        </div>
                        {formErrors.boundary && <div className="text-danger error-txt">{formErrors.boundary}</div>}
                    </div>
                    <div className='mt-5'>
                        <div><h5>No. of Open Sides</h5></div>
                        <div className='d-flex'>
                            <button className='btn btn-light border' onClick={() => handleplotside("open1")}
                                style={plotData.features.openSides === '1' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >1</button>
                            <button className='btn btn-light border ms-3' onClick={() => handleplotside("open2")}
                                style={plotData.features.openSides === '2' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>2</button>
                            <button className='btn btn-light border ms-3' onClick={() => handleplotside("open3")}
                                style={plotData.features.openSides === '3' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >3</button>
                            <button className='btn btn-light border ms-3' onClick={() => handleplotside("open4")}
                                style={plotData.features.openSides === '3+' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>3+</button>
                        </div>
                        {formErrors.open && <div className="text-danger error-txt">{formErrors.open}</div>}
                    </div>
                    <div className='mt-5'>
                        <div className='mb-2'><h5>Possession By</h5></div>
                        <div class="dropdown d-flex rent-drop">
                            <button class="btn btn-secondary dropdown-toggle bg-white text-dark d-flex justify-content-between align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span>{plotData.possessionBy || 'Expected By'}</span>
                                <span className="dropdown-arrow"></span>
                            </button>
                            <ul class="dropdown-menu rent-drop-menu">
                                <li><a class="dropdown-item" onClick={(e) => changeposs(e, "Immediate")} href="#">Immediate</a></li>
                                <li><a class="dropdown-item" onClick={(e) => changeposs(e, "Within 3 Months")} href="#">Within 3 Months</a></li>
                                <li><a class="dropdown-item" onClick={(e) => changeposs(e, "Within 6 Months")} href="#">Within 6 Months</a></li>
                                <li><a class="dropdown-item" onClick={(e) => changeposs(e, "By 2025")} href="#">By 2025</a></li>
                                <li><a class="dropdown-item" onClick={(e) => changeposs(e, "By 2026")} href="#">By 2026</a></li>
                                <li><a class="dropdown-item" onClick={(e) => changeposs(e, "By 2027")} href="#">By 2027</a></li>
                                <li><a class="dropdown-item" onClick={(e) => changeposs(e, "By 2028")} href="#">By 2028</a></li>
                                <li><a class="dropdown-item" onClick={(e) => changeposs(e, "By 2029")} href="#">By 2029</a></li>
                                <li><a class="dropdown-item" onClick={(e) => changeposs(e, "By 2030")} href="#">By 2030</a></li>
                                <li><a class="dropdown-item" onClick={(e) => changeposs(e, "By 2031")} href="#">By 2031</a></li>
                            </ul>
                        </div>
                        {formErrors.possession && <div className="text-danger error-txt">{formErrors.possession}</div>}
                    </div>
                    <div className='mt-5'>
                        <div><h5>Approved By</h5></div>
                        <div className='d-flex flex-wrap plot-approve justify-content-center'>
                            <button className='btn btn-light border' onClick={() => handleplotapprove("na")}
                                style={clickedplotapprove.na || plotData.approvedBy === 'N.A(Non-Agricultural)' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >N.A(Non-Agricultural)</button>
                            <button className='btn btn-light border ms-3' onClick={() => handleplotapprove("na_pro")}
                                style={clickedplotapprove.na_pro || plotData.approvedBy === 'N.A(in-process)' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>N.A(in-process)</button>
                            <button className='btn btn-light border ms-3' onClick={() => handleplotapprove("collect")}
                                style={clickedplotapprove.collect || plotData.approvedBy === 'Collector Approved' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>Collector Approved</button>
                            <button className='btn btn-light border ms-3' onClick={() => handleplotapprove("co_operation")}
                                style={clickedplotapprove.co_operation || plotData.approvedBy === 'Corporation Approved' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Corporation Approved</button>
                        </div>
                        {formErrors.approve && <div className="text-danger error-txt">{formErrors.approve}</div>}
                    </div>
                    <div className='mt-4'>
                        <div><h5>Ownership</h5></div>
                        <div className='d-flex'>
                            <button className='btn btn-light border' onClick={() => handleplotowner("free")}
                                style={clickedplotowner.free || plotData.ownershipType === 'Freehold' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Freehold</button>
                            <button className='btn btn-light border ms-3' onClick={() => handleplotowner("lease")}
                                style={clickedplotowner.lease || plotData.ownershipType === 'Leasehold' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>Leasehold</button>
                            <button className='btn btn-light border ms-3' onClick={() => handleplotowner("co_operate")}
                                style={clickedplotowner.co_operate || plotData.ownershipType === 'Co-operative Society' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Co-operative Society</button>
                            <button className='btn btn-light border ms-3' onClick={() => handleplotowner("power")}
                                style={clickedplotowner.power || plotData.ownershipType === 'Power of Attorney' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>Power of Attorney</button>
                        </div>
                        {formErrors.owner && <div className="text-danger error-txt">{formErrors.owner}</div>}
                    </div>
                    <div className="mt-5">
                        <div><h5>Price Details</h5></div>
                        <div>
                            <div>Cost</div>
                            <div className='d-flex'>
                                <FaRupeeSign className='rupee-icon' /><input type="text" className='property-inp p-2 w-100' name='plotprice' value={plotData.price}
                                    onChange={handleplotInputChange} id='price' />
                            </div>
                        </div>
                        <span className='fw-bold ms-3 price-format'>{formattedplotPrice}</span>
                        {formErrors.price && <div className="text-danger error-txt">{formErrors.price}</div>}
                    </div>
                    <button className='sell-btn p-2 w-100 text-white fw-bold mt-3' onClick={handleplotpage}>Post Property</button>
                </div>
            </div>
        </div>
    )
}

export default Plot