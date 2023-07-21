import React from 'react'


const Divider = ({ color }) => {
    const styles = {
      borderBottom: `1px solid ${color}`,
      margin: '8px 0',
    };
  
    return <div style={styles}></div>;
  };
  
  export default Divider;