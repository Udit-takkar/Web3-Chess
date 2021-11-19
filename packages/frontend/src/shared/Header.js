import React, { useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import Logo from '../assets/logo.png';
import { NavLink } from 'react-router-dom';
import { getAccountString } from '../utils/helpers';

function Header() {
  const { connectAccount, loading, account, disconnect } =
    useContext(Web3Context);
  return (
    <nav className="fixed top-0 left-0 select-none bg-nav  w-full min-h-20 h-20">
      <div className="flex flex-no-shrink justify-between h-full items-center ">
        <div className=" m-1.5">
          <img alt="web3-chess-logo" className="h-14 w-14" src={Logo} />
        </div>
        <div className="flex justify-around">
          <NavLink to="/" className="text-navFont font-poppins font-bold mx-3">
            Home
          </NavLink>
          <NavLink
            to="/profile"
            className="text-navFont font-poppins font-bold mx-3"
          >
            My Profile
          </NavLink>
          <p className="text-navFont font-poppins font-bold mx-3">
            {loading ? (
              <div class="flex items-center justify-center ">
                <div class="w-8 h-8 border-b-2 border-white rounded-full animate-spin"></div>
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
