import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from "axios";
import { toast } from 'react-toastify';

const Property = () => {
  const navigate = useNavigate();
  const permissions = useSelector((state) => state.auth.permissions);

  const [property, setproperty] = useState([]);
  const [filterdata, setFilterdata] = useState({
    type: '', city: '', budget: 0, rentBudget: 0, propertyType: '', area: 0, status: ''
  })
  console.log(filterdata);
  console.log(property);
  useEffect(() => {
    const fetchProperties = async () => {
      const base_url = import.meta.env.VITE_API_BASE_URL;
      try {
        const response = await axios.get(`${base_url}/api/v6/properties`, {
          withCredentials: true,  // Include credentials (cookies)
        });
        setproperty(response.data);  // Set the users data to state
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchProperties();
  }, []);

  const formatPrice = (value) => {
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

  const handlePropDelete = async (id, propertyType) => {
    const base_url = import.meta.env.VITE_API_BASE_URL;
    try {
      // Make the API call to delete the property by ID and type
      const response = await axios.delete(`${base_url}/api/v6/properties/${id}`, {
        data: { propertyType }, // Include the property type in the body if required
        withCredentials: true, // Include credentials (cookies)
      });

      if (response.status === 200) {
        toast.success(response.data.message || "Property deleted successfully");
        // Update the state to remove the deleted property from the list
        setproperty(prevProperties => prevProperties.filter(property => property._id !== id));
      }
    } catch (error) {
      toast.error('Error deleting property');
    }
  };

  const mchange = (e) => {
    const newValue = e.target.value * 10000000;
    setFilterdata((prevData) => ({
      ...prevData,
      budget: newValue, // Update the budget field
      rentBudget: 0,
    }));
  };

  const handlecityChange = (e) => {
    const { name, value } = e.target;
    setFilterdata((prevFilter) => ({
      ...prevFilter,
      [name]: value, // Dynamically set the value for the appropriate field
    }));
  };
  const handleClick = (proper) => {
    setFilterdata((prevState) => {
      const propertyType = [...prevState.propertyType];

      // If the amenity is not in the array, add it
      if (!propertyType.includes(proper)) {
        propertyType.push(proper);
      } else {
        // If it's already in the array, remove it (toggle effect)
        const index = propertyType.indexOf(proper);
        propertyType.splice(index, 1);
      }

      return { ...prevState, propertyType };
    });
  }
  const handleStatusClick = (value) => {
    setFilterdata((prevState) => ({
      ...prevState,
      status: value
    }));
  }
  const achange = (e) => {
    const newValue = e.target.value;
    setFilterdata((prevData) => ({
      ...prevData,
      area: newValue, // Update the budget field
    }));
  }

  const handlepropSearch = async () => {
    const base_url = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.get(`${base_url}/api/v6/properties`, {
        params: filterdata, // Send the filterdata object as query parameters
        withCredentials: true,
      });
      setproperty(response.data); // This will contain the filtered properties
    } catch (error) {
      toast.error('Error fetching filtered properties');
    }
  }

  const handlePropEdit = (property) => {
    navigate(`/admin/edit-property`, { state: property });
  };
  
  const handleStatus = async (id, currentStatus, type) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    const data = {status:newStatus,propertyType:type};
    const base_url = import.meta.env.VITE_API_BASE_URL;
    try {
      // Make the API call to delete the property by ID and type
      const response = await axios.put(`${base_url}/api/v4/property-status/${id}`,data,{ withCredentials: true, });

      if (response.data.message) {
        setproperty(prevProperties =>  prevProperties.map((prop) => prop._id === id ? { ...prop, status: newStatus } : prop));
      }
    } catch (error) {
      toast.error('Error changing property status');
    }
  };
  
  return (
    <div>
      <div className='user-bar d-flex justify-content-center align-items-center p-2'>
        <div className="input-group w-50">
          <button className="btn btn-outline-secondary dropdown-toggle drop-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">{filterdata.type || "Type"}</button>
          <ul className="dropdown-menu drop-item" style={{ cursor: 'pointer' }}>
            <li><a className="dropdown-item" onClick={() => setFilterdata((prev) => ({ ...prev, type: 'Sell' }))}>Sell</a></li>
            <li><a className="dropdown-item" onClick={() => setFilterdata((prev) => ({ ...prev, type: 'Rent' }))}>Rent</a></li>
            <li><a className="dropdown-item" onClick={() => setFilterdata((prev) => ({ ...prev, type: 'PG' }))}>PG</a></li>
            <li><a className="dropdown-item" onClick={() => setFilterdata((prev) => ({ ...prev, type: 'Plot/Land' }))}>Plot/Land</a></li>
            <li><a className="dropdown-item" onClick={() => setFilterdata((prev) => ({ ...prev, type: 'Commercial' }))}>Commercial</a></li>
          </ul>
          <input type="text" className="form-control user-input" name='city'
            value={filterdata.city}
            onChange={handlecityChange}
            placeholder='PropertyID/City' />
        </div>
        <button className='search-btn text-white ms-2' onClick={handlepropSearch}>search</button>
      </div>
      <div className='d-flex'>
        <div className='p-4'>
          <div className='bg-white p-3 filter-box'>
            <h4>Apply Filters</h4>
            <div className="accordion accordion-flush" id="accordionFlushExample">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                    Price
                  </button>
                </h2>
                <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                  <div className="accordion-body">
                    <div>
                      <div className="d-flex justify-content-between">
                        <div className="mrange">0</div>
                        <div className="mrange">{filterdata.budget / 10000000}&nbsp;crores</div>
                      </div>
                      <input
                        type="range" className="form-range" min="0" max="5" step="0.5" id="buyBudgetRange"
                        value={filterdata.budget / 10000000}
                        onChange={mchange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                    Monthly Rent
                  </button>
                </h2>
                <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                  <div className="accordion-body">
                    <div>
                      <div className="d-flex justify-content-between">
                        <div className="mrange">0</div>
                        <div className="mrange">{filterdata.rentBudget / 1000}&nbsp;K</div>
                      </div>
                      <input
                        type="range" className="form-range" min="0" max="100000" step="1000" id="rentBudgetRange"
                        value={filterdata.rentBudget} // Default value if not set
                        onChange={(e) => setFilterdata({ ...filterdata, rentBudget: e.target.value, budget: 0 })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                    Property Type
                  </button>
                </h2>
                <div id="flush-collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                  <div className="accordion-body">
                    <button className='btn btn-light type-btn mt-2' onClick={() => handleClick("1 RK/Studio Apartment")}
                      style={filterdata.propertyType.includes('1 RK/Studio Apartment') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+1 RK/Studio Apartment</button>
                    <button className='btn btn-light type-btn mt-2' onClick={() => handleClick("Office")}
                      style={filterdata.propertyType.includes('Office') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>+ Office</button>
                    <button className='btn btn-light type-btn mt-2 ms-1' onClick={() => handleClick("Penthouse")}
                      style={filterdata.propertyType.includes('Penthouse') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>+ Penthouse</button>
                    <button className='btn btn-light type-btn mt-2' onClick={() => handleClick("Flat")}
                      style={filterdata.propertyType.includes('Flat') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>+ Flat</button>
                    <button className='btn btn-light type-btn mt-2 ms-1' onClick={() => handleClick("House Villa")}
                      style={filterdata.propertyType.includes('House Villa') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>+ House Villa</button>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseThree">
                    Area
                  </button>
                </h2>
                <div id="flush-collapseFour" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                  <div className="accordion-body">
                    <div className='d-flex justify-content-between'>
                      <div className='mrange w-25'>0&nbsp;sq.ft</div>
                      <div className='mrange'>{filterdata.area}&nbsp;sq.ft</div>
                    </div><input type="range" className="form-range" min="0" max="4000" step="500" id="customRange2"
                      value={filterdata.area} onChange={achange} />
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFive" aria-expanded="false" aria-controls="flush-collapseThree">
                    Status
                  </button>
                </h2>
                <div id="flush-collapseFive" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                  <div className="accordion-body">
                    <button className='btn btn-light type-btn mt-2' onClick={() => handleStatusClick("Active")}
                      style={filterdata.status === 'Active' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>+ Active</button>
                    <button className='btn btn-light type-btn mt-2 ms-1' onClick={() => handleStatusClick("Inactive")}
                      style={filterdata.status === 'Inactive' ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>+ Inactive</button>
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-2'>
              <button className='btn apply-btn' onClick={handlepropSearch}>Apply Filter</button>
            </div>
          </div>
        </div>
        <div className='d-flex flex-column align-items-center'>
          <table className="table table-striped table-bordered w-auto mt-4">
            <thead>
              <tr>
                <th>Image</th>
                <th>Property type</th>
                <th>City</th>
                <th>Society/Project Name</th>
                <th>Area (Sq.ft)</th>
                <th>Price (in Rs)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {property.map((property, index) => (
                <tr key={index}>
                  <td><img src={property.images[0]} alt="img" className='prop-img' /></td>
                  <td>{property.type === 'Plot' ? 'Plot' : property.propertyType}</td>
                  <td>{property.city}</td>
                  <td>{property.type === 'sell' ? property.society : property.type === 'Commercial' ? property.projectName : property.societyName}</td>
                  <td>{property.type === 'Plot' ? property.plotArea : property.carpetArea}</td>
                  <td>{property.type === 'PG' || property.type === 'Rent' ? `${formatPrice(property.monthlyRent)}/Month` : formatPrice(property.price)}</td>
                  <td>
                    {permissions.canEdit &&
                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() => handlePropEdit(property)}
                      >
                        Edit
                      </button>
                    }
                    {permissions.canDelete &&
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handlePropDelete(property._id, property.type)}
                      >
                        Delete
                      </button>
                    }
                    <button className={`btn ${property.status === 'Active' ? 'btn-success' : 'btn-secondary'} btn-sm ms-1`} onClick={()=>handleStatus(property._id, property.status,property.type)}>{property.status === 'Active' ? 'Active' : 'Inactive'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Property
