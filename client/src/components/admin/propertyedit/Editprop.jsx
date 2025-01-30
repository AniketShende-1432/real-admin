import React from 'react';
import { useLocation } from 'react-router-dom';
import Sell from './sell/Sell';
import Rent from './rent/Rent';
import Plot from './plot/Plot';
import PG from './pg/PG';
import Commercial from './commercial/Commercial';

const Editprop = () => {
    const location = useLocation();
    const property = location.state || {};
    return (
        <div>
            {property.type === "sell" ? (
                <Sell property={property} />
            ) : property.type === "Rent" ? (
                <Rent property={property} />
            ) : property.type === 'Plot' ? (
                <Plot property={property} />
            ): property.type === 'PG' ? (
                <PG property={property} />
            ):(
                <Commercial property={property} />
            )}
        </div>
    )
}

export default Editprop