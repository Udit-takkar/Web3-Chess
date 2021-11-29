import React, { useContext, useEffect } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import Logo from '../assets/x-logo.png';
import { NavLink } from 'react-router-dom';
import { getAccountString } from '../utils/helpers';

function Header() {
  const { connectAccount, loading, account, disconnect, client } =
    useContext(Web3Context);

  return (
    <nav className="fixed top-0 left-0 select-none bg-nav  w-full min-h-20 h-20">
      <div className="flex flex-no-shrink justify-between h-full items-center ">
        <div className=" m-1.5 flex items-center">
          <img alt="web3-chess-logo" className="h-14 w-14 mx-2" src={Logo} />
          <h2 className="text-navFont text-2xl mx-2 font-montserrat font-bold">
            Web3 Chess
          </h2>
        </div>
        <div className="flex justify-around">
          <NavLink
            to="/"
            className="text-navFont font-montserrat text-md font-bold mx-3 tracking-wide"
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className="text-navFont font-montserrat text-md font-bold mx-3 tracking-wide"
          >
            Dashboard
          </NavLink>
          <p className="text-navFont font-montserrat text-md font-bold mx-3 tracking-wide">
            {loading ? (
              <div className="flex items-center justify-center ">
                <div className="w-8 h-8 border-b-2 border-white rounded-full animate-spin"></div>
              </div>
            ) : (
              getAccountString(account)
            )}
          </p>
        </div>
      </div>
    </nav>
  );
}

export default Header;
