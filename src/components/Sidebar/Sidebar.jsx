import React, { useContext }  from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const SideBar = () => {
  const { newChat } = useContext(Context);

  return (
    <div className="sidebar">
      <div className="top">
        <img className="menu" src={assets.menu_icon} alt="" />
        <div onClick={()=>newChat()} className="new-chat">
          <img src={assets.plus_icon} alt="" />
          <p>Novo Chat</p>
        </div>
      </div>
      
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="" />
          <p>Ajuda</p> 
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          <p>Configurações</p>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
