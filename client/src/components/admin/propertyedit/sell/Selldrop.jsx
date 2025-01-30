import React, { useState,useEffect } from 'react'
import "../Propertyedit.css";

const Selldrop = ({label,options, value, onChange}) => {

    const [filteredOptions, setFilteredOptions] = useState(options); // Filtered options
    const [inputValue, setInputValue] = useState(value); // Input field value
    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        setInputValue(value); // Update inputValue when value changes
    }, [value]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        onChange(value);

        // Filter options based on user input
        if (value) {
            const filtered = options.filter((option) =>
                option.toString().includes(value)
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions(options);
        }

        setDropdownVisible(true); // Show dropdown while typing
    };

    // Handle option selection
    const handleOptionClick = (option) => {
        setInputValue(option); // Set selected value to input
        onChange(option);
        setDropdownVisible(false); // Hide dropdown
    };

    // Hide dropdown when input loses focus
    const handleBlur = () => {
        setTimeout(() => setDropdownVisible(false), 300); // Delay to allow option click
    };
    return (
        <div>
            <div>{label}</div>
            <div className="w-100">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Type Value"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setDropdownVisible(true)}
                    onBlur={handleBlur}
                />
                {dropdownVisible && (
                    <ul className="list-group list-drop-menu w-100 mt-1 shadow" style={{ zIndex: 1000 }}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <li
                                    key={index}
                                    className="list-group-item list-group-item-action"
                                    onClick={() => handleOptionClick(option)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {option}
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item text-muted">No options found</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default Selldrop