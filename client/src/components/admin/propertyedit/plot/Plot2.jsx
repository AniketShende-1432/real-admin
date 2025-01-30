import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import water from "../../../../assets/water.png";
import storage from "../../../../assets/storage.png";
import rain from "../../../../assets/rain.png";
import electric from "../../../../assets/electric.png";
import vastu from "../../../../assets/vastu.png";
import gym from "../../../../assets/gym.png";
import park from "../../../../assets/garden.png";
import pool from "../../../../assets/swim.png";
import { FaRoad } from "react-icons/fa";
import { MdOutlineSportsCricket } from "react-icons/md";
import { toast } from 'react-toastify';
import '../Propertyedit.css';

const Plot2 = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const plotData = location.state || {};
  const [plotdata, setplotdata] = useState(plotData);

  const [imagesplot, setImagesplot] = useState(plotdata?.images || []); // State to store image previews
  const [selectedImage, setselectedImage] = useState([]);


  const handleFileChangeplot = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to an array
    const previewImages = files.map((file) => URL.createObjectURL(file)); // Create object URLs for preview
    setImagesplot((prevImages) => [...prevImages, ...previewImages]); // Update state with image previews
    setselectedImage((prevFiles) => [...prevFiles, ...files]);
  };
  const handleRemoveImage = (index) => {
    const imageToRemove = imagesplot[index]; // This is the image being removed from the preview

    // Case 1: If the image is a Cloudinary URL (from formData.images)
    if (plotdata.images.includes(imageToRemove)) {
      // Remove from formData.images
      setplotdata((prevFormData) => ({
        ...prevFormData,
        images: prevFormData.images.filter((img) => img !== imageToRemove),
      }));
    }
    // Case 2: If the image is a temporary URL (from selectImage)
    else {
      // Find the file corresponding to the temporary URL in selectImage
      const fileIndex = selectedImage.findIndex((file) => URL.createObjectURL(file) === imageToRemove);

      // Remove from selectImage (newly uploaded files)
      if (fileIndex !== -1) {
        setselectedImage((prevFiles) => prevFiles.filter((_, i) => i !== fileIndex));
      }
    }

    // Remove from the image preview array (this is common for both cases)
    setImagesplot((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const handleamenity = (amenity) => {
    setplotdata((prevState) => {
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
  const handleover = (overlook) => {
    setplotdata((prevState) => {
      const overlooking = [...prevState.overlooking];

      // If the amenity is not in the array, add it
      if (!overlooking.includes(overlook)) {
        overlooking.push(overlook);
      } else {
        // If it's already in the array, remove it (toggle effect)
        const index = overlooking.indexOf(overlook);
        overlooking.splice(index, 1);
      }

      return { ...prevState, overlooking };
    });
  };
  const handlePlotupdate = async (e) => {
    e.preventDefault();
    try {
      const base_url = import.meta.env.VITE_API_BASE_URL;
      const pdata = { ...plotdata, type: "Plot" };
      const pltData = new FormData();
      for (let [key, value] of Object.entries(pdata)) {
        if (Array.isArray(value)) {
          // If the value is an array (like amenities or images), append each item
          value.forEach((item) => pltData.append(key, item));
        } else if (typeof value === "object" && value !== null) {
          // If the value is an object (like features), append each property of the object
          for (const [subKey, subValue] of Object.entries(value)) {
            pltData.append(`${key}[${subKey}]`, subValue);
          }
        } else {
          // For other simple data types, append directly
          pltData.append(key, value);
        }
      }
      selectedImage.forEach((image) => pltData.append("newimages", image))
      pltData.forEach((value, key) => {
        console.log(key, value);
      });
      // Send the update request
      const response = await axios.put(`${base_url}/api/v6/updateplotproperty/${pdata._id}`, pltData,
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
          <div className='sell-head'><h3>Sell Of Plot/Land Property</h3></div>
          <div className='mt-4'>
            <div><h5>Add Amenities</h5></div>
            <div>
              <div className='text-secondary'>Amenities</div>
              <div className='d-flex flex-wrap justify-content-start flat-ament mt-2'>
                <button className='btn btn-light border' onClick={() => handleamenity("Water Storage")}
                  style={plotdata.amenities.includes('Water Storage') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={storage} alt="img" className='flat-img' />Water Storage</button>
                <button className='btn btn-light border' onClick={() => handleamenity("Water Supply")}
                  style={plotdata.amenities.includes('Water Supply') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={water} alt="img" className='flat-img' />Water Supply</button>
                <button className='btn btn-light border' onClick={() => handleamenity("Vastu Compliant")}
                  style={plotdata.amenities.includes('Vastu Compliant') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={vastu} alt="img" className='flat-img' />Vastu Compliant</button>
                <button className='btn btn-light border' onClick={() => handleamenity("Rain Water Harvesting")}
                  style={plotdata.amenities.includes('Rain Water Harvesting') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={rain} alt="img" className='flat-img' />Rain Water Harvesting</button>
                <button className='btn btn-light btn-flatimg border' onClick={() => handleamenity("Electricity Supply")}
                  style={plotdata.amenities.includes('Electricity Supply') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={electric} alt="img" className='flat-img' />Electricity Supply</button>
              </div>
            </div>
            <div className='mt-3'>
              <div className='text-secondary'>Overlooking</div>
              <div className='d-flex flex-wrap flat-ament justify-content-start mt-2'>
                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleover("Pool")}
                  style={plotdata.overlooking.includes('Pool') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={pool} alt="img" className='flat-img' /><label>Pool</label></button>
                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleover("Park/Garden")}
                  style={plotdata.overlooking.includes('Park/Garden') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={park} alt="img" className='flat-img' /><label>Park/Garden</label></button>
                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleover("Gym")}
                  style={plotdata.overlooking.includes('Gym') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={gym} alt="img" className='flat-img' /><label>Gym</label></button>
                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleover("Main Road")}
                  style={plotdata.overlooking.includes('Main Road') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><FaRoad className='fs-5 me-2 mt-1' /><label>Main Road</label></button>
                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleover("Club")}
                  style={plotdata.overlooking.includes('Club') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><MdOutlineSportsCricket className='fs-5 me-2' /><label>Club</label></button>
              </div>
            </div>
            <div className="mt-5">
              <div><h5>Photos Property</h5></div>
              <div>
                <div>
                  <label for="formFileMultipleplot" class="form-label photo-btn text-white fw-bold text-center mt-2 p-2 w-100" htmlFor='formFileMultipleplot'>Add Photos Now</label>
                  <input className="form-control" type="file" id="formFileMultipleplot" multiple style={{ display: 'none' }}
                    onChange={handleFileChangeplot} />
                </div>
                <div className="image-preview-container d-flex flex-wrap">
                  {imagesplot.map((src, index) => (
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
            <button className='sell-btn p-2 w-100 text-white fw-bold mt-3' onClick={handlePlotupdate}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Plot2