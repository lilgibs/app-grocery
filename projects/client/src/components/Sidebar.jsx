// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
// import { faHouse, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";

function Sidebar({ setSelectedComponent, menuItems }) {
  const dispatch = useDispatch();

  return (
    <div className="bg-teal-500 text-white font-semibold min-h-screen h-full p-4 my-5 ml-5 flex flex-col justify-between w-60 rounded">
      <div>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li>
              <button
                onClick={() => setSelectedComponent(item)}
                className="block px-4 py-2 rounded hover:bg-teal-700 w-full text-left"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
