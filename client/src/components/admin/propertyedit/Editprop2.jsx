import React from 'react'
import { useLocation } from 'react-router-dom';
import Sell2 from './sell/Sell2'
import Rent2 from './rent/Rent2'
import Plot2 from './plot/Plot2';
import PG2 from './pg/PG2';
import Commercial2 from './commercial/Commercial2';

const Editprop2 = () => {
    const location = useLocation();
    const property = location.state || {};
    return (
        <div>
            {property.type === "sell" ? (
                <Sell2 />
            ) : property.type === "Rent" ? (
                <Rent2 />
            ) : property.type === "Plot" ? (
                <Plot2 />
            ) : property.type === "PG" ? (
                <PG2 />
            ) : (<Commercial2 />)}
        </div>
    )
}

export default Editprop2