import React, { useRef, useEffect, useState } from 'react'
import selectedObjectStore from '../../stores/selectedObject';

const withAnalytics = (BaseComponent) => (props) => {
    const { selectedObject } = selectedObjectStore();
    let VADR = window.VADR;
    
    useEffect(()=> {
        if(VADR) {
            let { position, username, objectname } = selectedObject;
            if(props.name == objectname) {
                let { x, y, z} = position;
                VADR.registerEvent('XR Object Interaction', [x,y,z], {'object': objectname, 'user': username});
            }
        }
    },[selectedObject])

    return ( 
        <BaseComponent 
            {...props} 
        />
    )
}

export default withAnalytics;

