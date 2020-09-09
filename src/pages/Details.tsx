import React from 'react';
import { useParams } from "react-router-dom";

function Details() {
    const { symbol } = useParams();
    return (
        <div>This is Details for { symbol }.</div>
    );
}

export default Details;
