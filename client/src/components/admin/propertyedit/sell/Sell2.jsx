import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import Selldrop from './Selldrop';
import axios from "axios";
//import { useSelector, useDispatch } from 'react-redux';
import { GiWashingMachine } from "react-icons/gi";
import { GiSofa } from "react-icons/gi";
import { FaBed } from "react-icons/fa";
import { GiElevator } from "react-icons/gi";
import { BiCctv } from "react-icons/bi";
import fridge from "../../../../assets/fridge.png";
import aircond from "../../../../assets/air-conditioner.png";
import gym from "../../../../assets/gym.png";
import garden from "../../../../assets/garden.png";
import kidsarea from "../../../../assets/kidsarea.png";
import cupboard from "../../../../assets/cupboard.png";
import tv from "../../../../assets/tv.png";
import geyser from "../../../../assets/geyser.png";
import swim from "../../../../assets/swim.png";
import water from "../../../../assets/water.png";
import { toast } from 'react-toastify';

const Sell2 = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const formData = location.state || {};
    const [formdata, setformdata] = useState(formData);
    const [images, setImages] = useState(formdata?.images || []); // State to store image previews
    const [selectImage, setselectImage] = useState([]);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // Convert FileList to an array
        const previewImages = files.map((file) => URL.createObjectURL(file)); // Create object URLs for preview
        setImages((prevImages) => [...prevImages, ...previewImages]); // Add new previews to existing ones
        setselectImage((prevFiles) => [...prevFiles, ...files]); // Add new files to existing ones
    };
    const handleRemoveImage = (index) => {
        const imageToRemove = images[index]; // This is the image being removed from the preview

        // Case 1: If the image is a Cloudinary URL (from formData.images)
        if (formdata.images.includes(imageToRemove)) {
            // Remove from formData.images
            setformdata((prevFormData) => ({
                ...prevFormData,
                images: prevFormData.images.filter((img) => img !== imageToRemove),
            }));
        }
        // Case 2: If the image is a temporary URL (from selectImage)
        else {
            // Find the file corresponding to the temporary URL in selectImage
            const fileIndex = selectImage.findIndex((file) => URL.createObjectURL(file) === imageToRemove);

            // Remove from selectImage (newly uploaded files)
            if (fileIndex !== -1) {
                setselectImage((prevFiles) => prevFiles.filter((_, i) => i !== fileIndex));
            }
        }

        // Remove from the image preview array (this is common for both cases)
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };
    const [errors, setErrors] = useState({
        developer: '',
    });
    const bedroomoptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const balconiesoptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const Bathroomoptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const Floornooptions = [];
    const Totalflooroptions = [];
    const Agepropoptions = [];
    for (let i = 0; i <= 80; i++) {
        Floornooptions.push(i);
        Totalflooroptions.push(i);
    }
    for (let i = 20; i >= 0; i--) {
        Agepropoptions.unshift(i);
    }
    const handleflat = (amenity) => {
        // Check if the amenity is already in the array
        setformdata((prevState) => {
            const amenities = [...prevState.amenities];

            // If the amenity is not in the array, add it
            if (!amenities.includes(amenity)) {
                amenities.push(amenity);
            } else {
                // If it's already in the array, remove it (toggle effect)
                const index = amenities.indexOf(amenity);
                amenities.splice(index, 1);
            }

            return { ...prevState, amenities };
        });
    };
    const handlesoc = (amenity) => {
        // Check if the amenity is already in the array
        setformdata((prevState) => {
            const amenities = [...prevState.amenities];

            // If the amenity is not in the array, add it
            if (!amenities.includes(amenity)) {
                amenities.push(amenity);
            } else {
                // If it's already in the array, remove it (toggle effect)
                const index = amenities.indexOf(amenity);
                amenities.splice(index, 1);
            }

            return { ...prevState, amenities };
        });
    };
    const handleFeaturesChange = (field, value) => {
        setformdata((prevState) => ({
            ...prevState,
            features: {
                ...prevState.features,
                [field]: value === '' ? '' : parseInt(value, 10), // Dynamically update the field based on the 'field' argument
            },
        }));
    };
    const handleformdevChange = (e) => {
        setformdata({ ...formdata, developer: e.target.value });
    };
    const handlesocietyAreaInput = (event) => {
        const value = event.target.value;
        setformdata((prevState) => ({
            ...prevState,
            societyArea: value === '' ? '' : parseFloat(value),
        }));
    };
    const changearea = (e, value) => {
        e.preventDefault();
        setformdata((prevState) => ({
            ...prevState,
            societyAreaUnit: value, // Update formData with the selected unit
        }));
    }
    const handlePupdate = async (e) => {
        e.preventDefault();
        let formErrors = {};
        const namepattern = /^[A-Za-z\s]+$/;
        if (!namepattern.test(formdata.developer)) {
            formErrors.developer = 'Please enter a valid Developer';
        }
        if (!formdata.societyArea) {
            formErrors.socarea = 'Please enter Total Society Area';
        }
        if (!formdata.societyAreaUnit) {
            formErrors.socunit = 'Select Area Unit';
        }
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return; // Stop the form submission if there are errors
        }
        try {
            const base_url = import.meta.env.VITE_API_BASE_URL;
            const fdata = { ...formdata, type: "sell" };
            console.log(fdata);
            const frmData = new FormData();
            for (let [key, value] of Object.entries(fdata)) {
                if (Array.isArray(value)) {
                    // If the value is an array (like amenities or images), append each item
                    value.forEach((item) => frmData.append(key, item));
                } else if (typeof value === "object" && value !== null) {
                    // If the value is an object (like features), append each property of the object
                    for (const [subKey, subValue] of Object.entries(value)) {
                        frmData.append(`${key}[${subKey}]`, subValue);
                    }
                } else {
                    // For other simple data types, append directly
                    frmData.append(key, value);
                }
            }
            selectImage.forEach((image) => frmData.append("newimages", image))
            frmData.forEach((value, key) => {
                console.log(key, value);
            });
            // Send the update request
            const response = await axios.put(`${base_url}/api/v6/sellproperty/${fdata._id}`, frmData,
                { withCredentials: true }
            );

            // Handle response
            const message = response.data.message;
            if (message === "Property updated successfully") {
                toast.success(message, {
                    onClose: () => {
                        navigate('/admin/manage-property');
                    }
                });
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.error("Error updating property:", error);
            toast.error("Error updating property");
        }
    };
    return (
        <div>
            <div className='container main-box w-50'>
                <div className='main2-box bg-white p-4'>
                    <div className='sell-head'><h3>Edit Sell Property</h3></div>
                    <div className='mt-4'>
                        <div><h5>Property Features</h5></div>
                        <div className='mt-2 d-flex justify-content-around'>
                            <div>
                                <Selldrop
                                    label="Bedroom"
                                    options={bedroomoptions}
                                    value={formdata.features.bedrooms}
                                    onChange={(value) => handleFeaturesChange("bedrooms", value)}
                                />
                            </div>
                            <div>
                                <Selldrop
                                    label="Balconies"
                                    options={balconiesoptions}
                                    value={formdata.features.balconies}  // Bind to formData.features.balconies
                                    onChange={(value) => handleFeaturesChange('balconies', value)}  // Pass field name and value
                                />
                            </div>
                        </div>
                        <div className='mt-3 d-flex justify-content-around'>
                            <div>
                                <Selldrop
                                    label="Bathroom"
                                    options={Bathroomoptions}
                                    value={formdata.features.bathrooms}  // Bind to formData.features.bathrooms
                                    onChange={(value) => handleFeaturesChange('bathrooms', value)}
                                />
                            </div>
                            <div>
                                <Selldrop
                                    label="Age of Property"
                                    options={Agepropoptions}
                                    value={formdata.features.ageOfProperty}  // Bind to formData.features.ageOfProperty
                                    onChange={(value) => handleFeaturesChange('ageOfProperty', value)}
                                />
                            </div>
                        </div>
                        <div className='mt-3 d-flex justify-content-around'>
                            <div>
                                <Selldrop
                                    label="Total Floor"
                                    options={Totalflooroptions}
                                    value={formdata.features.totalFloors}  // Bind to formData.features.totalFloors
                                    onChange={(value) => handleFeaturesChange('totalFloors', value)}
                                />
                            </div>
                            <div>
                                <Selldrop
                                    label="Floor no"
                                    options={Floornooptions}
                                    value={formdata.features.floorNumber}  // Bind to formData.features.floorNumber
                                    onChange={(value) => handleFeaturesChange('floorNumber', value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h5 className='mb-0 mt-5'>Developer</h5>
                        <input type="text" className="property-inp p-2 pt-1 w-100" name='developer' id='developer'
                            value={formdata.developer} onChange={handleformdevChange} />
                        {errors.developer && <div className="text-danger error-txt">{errors.developer}</div>}
                    </div>
                    <div>
                        <div className='mt-2 mb-2 mt-4 fs-5 fw-semibold'>Society Occupied Total Area</div>
                        <div className="input-group">
                            <input type="number" className="form-control" aria-label="Text input with dropdown button" step="any"
                                value={formdata.societyArea}
                                onChange={handlesocietyAreaInput} />
                            <button className="btn btn-secondary bg-white text-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"> {formdata.societyAreaUnit || "Select Unit"}</button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><a className="dropdown-item" onClick={(e) => changearea(e, "Sq-ft")} >Sq-ft</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changearea(e, "Sq-yrd")} >Sq-yrd</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changearea(e, "Sq-m")} >Sq-m</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changearea(e, "Acre")} >Acre</a></li>
                                <li><a className="dropdown-item" onClick={(e) => changearea(e, "Bigha")} >Bigha</a></li>
                            </ul>
                        </div>
                        {errors.socarea && <div className="text-danger error-txt">{errors.socarea}</div>}
                        {errors.socunit && <div className="text-danger error-txt">{errors.socunit}</div>}
                    </div>
                    <div className={errors.socarea || errors.socunit ? 'mt-3' : 'mt-5'}>
                        <div><h5>Add Amenities</h5></div>
                        <div>
                            <div className='text-secondary'>Flat Furnishing</div>
                            <div className='d-flex flex-wrap justify-content-evenly flat-ament mt-2'>
                                <button className='btn btn-light border' onClick={() => handleflat("Washing Machine")}
                                    style={formdata.amenities.includes("Washing Machine") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><GiWashingMachine className='mb-1 fs-5 me-2' />Washing Machine</button>
                                <button className='btn btn-light border' onClick={() => handleflat("Sofa")}
                                    style={formdata.amenities.includes("Sofa") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><GiSofa className='mb-1 fs-5 me-2' />Sofa</button>
                                <button className='btn btn-light border' onClick={() => handleflat("Bed")}
                                    style={formdata.amenities.includes("Bed") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><FaBed className='mb-1 fs-5 me-2' />Bed</button>
                                <button className='btn btn-light btn-flatimg border' onClick={() => handleflat("Fridge")}
                                    style={formdata.amenities.includes("Fridge") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={fridge} alt="img" className='h-100 mb-1' />Fridge</button>
                                <button className='btn btn-light border' onClick={() => handleflat("AC")}
                                    style={formdata.amenities.includes("AC") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={aircond} alt="img" className='flat-img' />AC</button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleflat("Cupboard")}
                                    style={formdata.amenities.includes("Cupboard") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={cupboard} alt="img" className='flat-img' />Cupboard</button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleflat("Geyser")}
                                    style={formdata.amenities.includes("Geyser") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={geyser} alt="img" className='flat-img' />Geyser</button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleflat("TV")}
                                    style={formdata.amenities.includes("TV") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={tv} alt="img" className='flat-img' />TV</button>
                            </div>
                        </div>
                        <div className='mt-3'>
                            <div className='text-secondary'>Society Amenities</div>
                            <div className='d-flex flex-wrap flat-ament justify-content-evenly mt-2'>
                                <button className='btn btn-light border' onClick={() => handlesoc("Lift")}
                                    style={formdata.amenities.includes("Lift") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><GiElevator className='mb-1 fs-5 me-2' />Lift</button>
                                <button className='btn btn-light border' onClick={() => handlesoc("CCTV")}
                                    style={formdata.amenities.includes("CCTV") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><BiCctv className='mb-1 fs-5 me-2' />CCTV</button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlesoc("Kides Area")}
                                    style={formdata.amenities.includes("Kides Area") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={kidsarea} alt="img" className='flat-img' /><label>Kides Area</label></button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlesoc("Garden")}
                                    style={formdata.amenities.includes("Garden") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={garden} alt="img" className='flat-img' /><label>Garden</label></button>
                                <button className='btn btn-light border' onClick={() => handlesoc("Gym")}
                                    style={formdata.amenities.includes("Gym") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={gym} alt="img" className='flat-img' /><label>Gym</label></button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlesoc("Swimming Pool")}
                                    style={formdata.amenities.includes("Swimming Pool") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={swim} alt="img" className='flat-img' /><label>Swimming Pool</label></button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlesoc("Regular Water Supply")}
                                    style={formdata.amenities.includes("Regular Water Supply") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={water} alt="img" className='flat-img' /><label>Regular Water Supply</label></button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <div><h5>Photos Property</h5></div>
                        <div>
                            <div>
                                <label for="formFileMultiple" class="form-label photo-btn text-white fw-bold text-center mt-2 p-2 w-100" htmlFor='formFileMultiple'>Add Photos Now</label>
                                <input className="form-control" type="file" id="formFileMultiple" multiple style={{ display: 'none' }}
                                    onChange={handleFileChange} />
                            </div>
                            <div className="image-preview-container d-flex flex-wrap">
                                {images.map((src, index) => (
                                    <div key={index} className="m-2">
                                        <img
                                            src={src}
                                            alt={`Preview ${index}`}
                                            className="img-thumbnail"
                                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                                        />
                                        <button className="close-btn" onClick={() => handleRemoveImage(index)}
                                        >X</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button className='sell-btn p-2 w-100 text-white fw-bold mt-3' onClick={handlePupdate}>Save Changes</button>
                </div>
            </div>
        </div>
    )
}

export default Sell2