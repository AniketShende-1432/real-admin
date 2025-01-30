import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Selldrop from '../sell/Selldrop';
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
import '../Propertyedit.css';

const Rent2 = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const rentData = location.state || {};
    const [rentdata, setrentdata] = useState(rentData);
    const [clickedrentperson, setClickedrentperson] = useState({
        family: false,
        men: false,
        women: false,
    });

    const [imagesrent, setImagesrent] = useState(rentdata?.images || []); // State to store image previews
    const [selectImage, setselectImage] = useState([]);

    const handleFileChangerent = (event) => {
        const files = Array.from(event.target.files); // Convert FileList to an array
        const previewImages = files.map((file) => URL.createObjectURL(file)); // Create object URLs for preview
        setImagesrent((prevImages) => [...prevImages, ...previewImages]); // Update state with image previews
        setselectImage((prevFiles) => [...prevFiles, ...files]);
    };
    const handleRemoveImage = (index) => {
        const imageToRemove = imagesrent[index]; // This is the image being removed from the preview

        // Case 1: If the image is a Cloudinary URL (from formData.images)
        if (rentdata.images.includes(imageToRemove)) {
            // Remove from formData.images
            setrentdata((prevFormData) => ({
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
        setImagesrent((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const bedroomoptionsrent = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const balconiesoptionsrent = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const Bathroomoptionsrent = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const Floornooptionsrent = [];
    const Totalflooroptionsrent = [];
    const Agepropoptionsrent = ['10+'];
    const Durationoptions = ['0 month', '1 month'];
    for (let i = 0; i <= 80; i++) {
        Floornooptionsrent.push(i);
        Totalflooroptionsrent.push(i);
    }
    for (let i = 9; i >= 0; i--) {
        Agepropoptionsrent.unshift(i);
    }
    for (let i = 2; i <= 36; i++) {
        Durationoptions.push(`${i} months`);
    }
    const handlerentperson = (buttonKey) => {
        setClickedrentperson((prevState) => ({
            ...prevState,
            [buttonKey]: !prevState[buttonKey], // Toggle the clicked button's style
        }));
        const person = buttonKey === 'family' ? 'Family' :
            buttonKey === 'men' ? 'Single Men' : "Single Women"
        setrentdata({ ...rentdata, willingToRent: person });
    }
    const changeduardrop = (value) => {
        setrentdata({ ...rentdata, durationOfAgreement: value });
    }
    const handleflatrent = (amenity) => {
        setrentdata((prevState) => {
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
    const handlesocrent = (amenity) => {
        setrentdata((prevState) => {
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
        setrentdata((prevState) => ({
            ...prevState,
            features: {
                ...prevState.features,
                [field]: field === "ageOfProperty" ? value : value === '' ? '' : parseInt(value, 10), // Parse as number for all except ageOfProperty
            },
        }));
    };
    const handleRentupdate = async (e) => {
        e.preventDefault();
        try {
            const base_url = import.meta.env.VITE_API_BASE_URL;
            const rdata = { ...rentdata, type: "Rent" };
            const rntData = new FormData();
            for (let [key, value] of Object.entries(rdata)) {
                if (key === "availableFrom" && value instanceof Date) {
                    value = value.toISOString().split("T")[0]; // Convert to 'yyyy-MM-dd' format
                }
                if (Array.isArray(value)) {
                    // If the value is an array (like amenities or images), append each item
                    value.forEach((item) => rntData.append(key, item));
                } else if (typeof value === "object" && value !== null) {
                    // If the value is an object (like features), append each property of the object
                    for (const [subKey, subValue] of Object.entries(value)) {
                        rntData.append(`${key}[${subKey}]`, subValue);
                    }
                } else {
                    // For other simple data types, append directly
                    rntData.append(key, value);
                }
            }
            selectImage.forEach((image) => rntData.append("newimages", image));
            rntData.forEach((value, key) => {
                console.log(key, value);
            });
            // Send the update request
            const response = await axios.put(`${base_url}/api/v6/updaterentproperty/${rdata._id}`, rntData,
                { withCredentials: true }
            );
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
                    <div className='sell-head'><h3>Edit Rent Property</h3></div>
                    <div className='mt-4'>
                        <div><h5>Property Features</h5></div>
                        <div className='mt-2 d-flex justify-content-around'>
                            <div>
                                <Selldrop
                                    label="Bedroom"
                                    options={bedroomoptionsrent}
                                    value={rentdata.features.bedrooms}
                                    onChange={(value) => handleFeaturesChange("bedrooms", value)}
                                />
                            </div>
                            <div>
                                <Selldrop
                                    label="Balconies"
                                    options={balconiesoptionsrent}
                                    value={rentdata.features.balconies}  // Bind to formData.features.balconies
                                    onChange={(value) => handleFeaturesChange('balconies', value)}
                                />
                            </div>
                        </div>
                        <div className='mt-3 d-flex justify-content-around'>
                            <div>
                                <Selldrop
                                    label="Bathroom"
                                    options={Bathroomoptionsrent}
                                    value={rentdata.features.bathrooms}  // Bind to formData.features.bathrooms
                                    onChange={(value) => handleFeaturesChange('bathrooms', value)}
                                />
                            </div>
                            <div>
                                <Selldrop
                                    label="Age of Property"
                                    options={Agepropoptionsrent}
                                    value={rentdata.features.ageOfProperty}  // Bind to formData.features.ageOfProperty
                                    onChange={(value) => handleFeaturesChange('ageOfProperty', value)}
                                />
                            </div>
                        </div>
                        <div className='mt-3 d-flex justify-content-around'>
                            <div>
                                <Selldrop
                                    label="Total Floor"
                                    options={Totalflooroptionsrent}
                                    value={rentdata.features.totalFloors}  // Bind to formData.features.totalFloors
                                    onChange={(value) => handleFeaturesChange('totalFloors', value)}
                                />
                            </div>
                            <div>
                                <Selldrop
                                    label="Floor no"
                                    options={Floornooptionsrent}
                                    value={rentdata.features.floorNumber}  // Bind to formData.features.floorNumber
                                    onChange={(value) => handleFeaturesChange('floorNumber', value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <div><h5>Willing to Rent out to</h5></div>
                        <div>
                            <button className='btn btn-light border' onClick={() => handlerentperson("family")}
                                style={clickedrentperson.family || rentdata.willingToRent.includes('Family') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Family</button>
                            <button className='btn btn-light border ms-3' onClick={() => handlerentperson("men")}
                                style={clickedrentperson.men || rentdata.willingToRent.includes('Single Men') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>Single Men</button>
                            <button className='btn btn-light border ms-3' onClick={() => handlerentperson("women")}
                                style={clickedrentperson.women || rentdata.willingToRent.includes('Single Women') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Single Women</button>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <div><h5>Duration of Agreement</h5></div>
                        <div class="dropdown d-flex rent-drop">
                            <button class="btn btn-secondary dropdown-toggle bg-white text-dark d-flex justify-content-between align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span>{rentdata.durationOfAgreement || 'Select'}</span>
                                <span className="dropdown-arrow"></span>
                            </button>
                            <ul class="dropdown-menu rent-drop-menu">
                                {Durationoptions.map((option, index) => (
                                    <li key={index}>
                                        <a class="dropdown-item" onClick={() => changeduardrop(option)}>{option}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <div><h5>Add Amenities</h5></div>
                        <div>
                            <div className='text-secondary'>Flat Furnishing</div>
                            <div className='d-flex flex-wrap justify-content-evenly flat-ament mt-2'>
                                <button className='btn btn-light border' onClick={() => handleflatrent("Washing Machine")}
                                    style={rentdata.amenities.includes('Washing Machine') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><GiWashingMachine className='mb-1 fs-5 me-2' />Washing Machine</button>
                                <button className='btn btn-light border' onClick={() => handleflatrent("Sofa")}
                                    style={rentdata.amenities.includes('Sofa') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><GiSofa className='mb-1 fs-5 me-2' />Sofa</button>
                                <button className='btn btn-light border' onClick={() => handleflatrent("Bed")}
                                    style={rentdata.amenities.includes('Bed') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><FaBed className='mb-1 fs-5 me-2' />Bed</button>
                                <button className='btn btn-light btn-flatimg border' onClick={() => handleflatrent("Fridge")}
                                    style={rentdata.amenities.includes('Fridge') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={fridge} alt="img" className='h-100 mb-1' />Fridge</button>
                                <button className='btn btn-light border' onClick={() => handleflatrent("AC")}
                                    style={rentdata.amenities.includes('AC') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={aircond} alt="img" className='flat-img' />AC</button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleflatrent("Cupboard")}
                                    style={rentdata.amenities.includes('Cupboard') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={cupboard} alt="img" className='flat-img' />Cupboard</button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleflatrent("Geyser")}
                                    style={rentdata.amenities.includes('Geyser') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={geyser} alt="img" className='flat-img' />Geyser</button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleflatrent("TV")}
                                    style={rentdata.amenities.includes('TV') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={tv} alt="img" className='flat-img' />TV</button>
                            </div>
                        </div>
                        <div className='mt-3'>
                            <div className='text-secondary'>Society Amenities</div>
                            <div className='d-flex flex-wrap flat-ament justify-content-evenly mt-2'>
                                <button className='btn btn-light border' onClick={() => handlesocrent("Lift")}
                                    style={rentdata.amenities.includes('Lift') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><GiElevator className='mb-1 fs-5 me-2' />Lift</button>
                                <button className='btn btn-light border' onClick={() => handlesocrent("CCTV")}
                                    style={rentdata.amenities.includes('CCTV') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><BiCctv className='mb-1 fs-5 me-2' />CCTV</button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlesocrent("Kides Area")}
                                    style={rentdata.amenities.includes('Kides Area') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={kidsarea} alt="img" className='flat-img' /><label>Kides Area</label></button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlesocrent("Garden")}
                                    style={rentdata.amenities.includes('Garden') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={garden} alt="img" className='flat-img' /><label>Garden</label></button>
                                <button className='btn btn-light border' onClick={() => handlesocrent("Gym")}
                                    style={rentdata.amenities.includes('Gym') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={gym} alt="img" className='flat-img' /><label>Gym</label></button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlesocrent("Swimming Pool")}
                                    style={rentdata.amenities.includes('Swimming Pool') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={swim} alt="img" className='flat-img' /><label>Swimming Pool</label></button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlesocrent("Regular Water Supply")}
                                    style={rentdata.amenities.includes('Regular Water Supply') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={water} alt="img" className='flat-img' /><label>Regular Water Supply</label></button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <div><h5>Photos Property</h5></div>
                        <div>
                            <div>
                                <label for="formFileMultiplerent" class="form-label photo-btn text-white fw-bold text-center mt-2 p-2 w-100" htmlFor='formFileMultiplerent'>Add Photos Now</label>
                                <input className="form-control" type="file" id="formFileMultiplerent" multiple style={{ display: 'none' }}
                                    onChange={handleFileChangerent} />
                            </div>
                            <div className="image-preview-container d-flex flex-wrap">
                                {imagesrent.map((src, index) => (
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
                    <button className='sell-btn p-2 w-100 text-white fw-bold mt-3' onClick={handleRentupdate}>Save Changes</button>
                </div>
            </div>
        </div>
    )
}

export default Rent2