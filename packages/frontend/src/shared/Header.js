import React from 'react';
import Logo from '../assets/x-logo.png';
import { NavLink } from 'react-router-dom';
import { getAccountString } from '../utils/helpers';
import { useMoralis } from 'react-moralis';
import { useMoralisDapp } from '../contexts/MoralisDappProvider';

function Header() {
  const { walletAddress } = useMoralisDapp();
  const { authenticate, isAuthenticated, isAuthenticating } = useMoralis();

  const handleConnect = async () => {
    await authenticate();
  };
  return (
    <nav className="fixed top-0 left-0 select-none bg-nav  w-full min-h-20 h-20 z-10">
      <div className="flex flex-no-shrink justify-between h-full items-center ">
        <div className=" m-1.5 flex items-center">
          <img alt="web3-chess-logo" className="h-14 w-14 mx-2" src={Logo} />
          <h2 className="text-navFont text-2xl mx-2 font-montserrat font-bold">
            Web3 Chess
          </h2>
        </div>
        <div className="flex justify-around">
          {[
            { name: 'Home', route: '/' },
            { name: 'Dashboard', route: '/dashboard' },
            { name: 'MarketPlace', route: '/market' },
          ].map(({ name, route }) => {
            return (
              <NavLink
                to={route}
                key={name}
                className="text-navFont font-montserrat text-md font-bold mx-3 tracking-wide"
              >
                {name}
              </NavLink>
            );
          })}

          <p className="text-navFont font-montserrat text-md font-bold mx-3 tracking-wide">
            {isAuthenticating ? (
              <Loader />
            ) : (
              isAuthenticated &&
              walletAddress &&
              getAccountString(walletAddress)
            )}
            {!isAuthenticated && !isAuthenticating && (
              <button className="cursor-pointer" onClick={handleConnect}>
                Connect
              </button>
            )}
          </p>
        </div>
      </div>
    </nav>
  );
}

const Loader = () => {
  return (
    <div className="flex items-center justify-center ">
      <div className="w-8 h-8 border-b-2 border-white rounded-full animate-spin"></div>
    </div>
  );
};

export default Header;
