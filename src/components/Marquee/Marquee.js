import React from 'react'

const Marquee = (props) => {
    const {description} = props;
    return (
        <div style={{ display: 'inline'}}>
            <div style={{ float: 'left', display: 'block', width: '80%'}}><h3>{'Bag Index 💰'}</h3><p styles={{ fontSize: '10px'}}>{description}</p></div>
            
        </div>
    )
}

export default Marquee
