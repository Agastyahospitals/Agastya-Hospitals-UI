import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import cubaimg from "../../assets/images/logo/logo-icon.png"
// import cubaimg from "https://res.cloudinary.com/sdk28cdn/image/upload/v1758560336/agastya/logo-icon.png"
// import cubaimg from '../../assets/images/logo/'
import CustomizerContext from '../../_helper/Customizer';

const SidebarIcon = () => {
  const { layoutURL } = useContext(CustomizerContext);
  return (
    <div className="logo-icon-wrapper">
      <Link to={`/dashboard`}>
        <img
          className="img-fluid"
          src={cubaimg}
          alt=""
        />
      </Link>
    </div>
  );
};

export default SidebarIcon;