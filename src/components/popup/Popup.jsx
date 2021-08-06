import React from 'react'
import './popup.css'
export default function Popup(props) {
    return(props.trigger)? (
        <div className="popup" id="popup2">
                {props.children}
        </div>
    ):"";
}
