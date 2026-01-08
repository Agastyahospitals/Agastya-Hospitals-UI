import React, { useContext } from "react";
import { Grid } from "react-feather";
import CustomizerContext from "../../_helper/Customizer";

const SidebarLogo = () => {
  const { toggleSidebar, toggleIcon, layout } = useContext(CustomizerContext);

  const openCloseSidebar = () => {
    toggleSidebar(!toggleIcon);
  };

  const layout1 = localStorage.getItem("sidebar_layout") || layout;

  return (
    <div className='logo-wrapper'>
      {/* {layout1 !== "compact-wrapper dark-sidebar" && layout1 !== "compact-wrapper color-sidebar" && mixLayout && ( */}
       <h5>Agastya Hospitals</h5>
      <div className='back-btn' onClick={() => openCloseSidebar()}>
        <i className='fa fa-angle-left'></i>
      </div>
      <div className='toggle-sidebar' onClick={openCloseSidebar}>
        <Grid className='status_toggle middle sidebar-toggle' />
      </div>
    </div>
  );
};

export default SidebarLogo;
