import logo from '../logo_3.png';  // Import the logo image
import fullLogo from '../full_logo.png';  // Import the full logo image
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";  // Import necessary components from react-router-dom
import { useEffect, useState } from 'react';  // Import useEffect and useState from React
import { useLocation } from 'react-router';  // Import useLocation from react-router

function Navbar() {

  const [connected, toggleConnect] = useState(false);  // State to track connection status
  const location = useLocation();  // Get the current location from react-router
  const [currAddress, updateAddress] = useState('0x');  // State to store the current Ethereum address

  // Function to get the Ethereum address when connected
  async function getAddress() {
    const ethers = require("ethers");  // Import ethers library
    const provider = new ethers.providers.Web3Provider(window.ethereum);  // Create a Web3Provider
    const signer = provider.getSigner();  // Get the signer
    const addr = await signer.getAddress();  // Get the Ethereum address
    updateAddress(addr);  // Update the address state
  }

  // Function to update the "Connect Wallet" button to "Connected"
  function updateButton() {
    const ethereumButton = document.querySelector('.enableEthereumButton');
    ethereumButton.textContent = "Connected";
    ethereumButton.classList.remove("hover:bg-blue-70");
    ethereumButton.classList.remove("bg-blue-500");
    ethereumButton.classList.add("hover:bg-green-70");
    ethereumButton.classList.add("bg-green-500");
  }

  // Function to connect to the website and Ethereum
  async function connectWebsite() {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });  // Get the Ethereum chain ID
    if (chainId !== '0x5') {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x5' }],
      });  // Switch the Ethereum network to Rinkeby
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        updateButton();  // Update the button to "Connected"
        console.log("here");
        getAddress();  // Get the Ethereum address
        window.location.replace(location.pathname);  // Reload the page
      });
  }

  // Use the useEffect hook for component lifecycle and Ethereum account changes
  useEffect(() => {
    let val = window.ethereum.isConnected();  // Check if the user is already connected
    if (val) {
      console.log("here");
      getAddress();  // Get the Ethereum address
      toggleConnect(val);  // Update the connection state
      updateButton();  // Update the button to "Connected"
    }

    // Listen for Ethereum account changes
    window.ethereum.on('accountsChanged', function(accounts){
      window.location.replace(location.pathname);  // Reload the page when the account changes
    });
  });

  return (
    <div className="">
      <nav className="w-screen">
        <ul className='flex items-end justify-between py-3 bg-transparent text-white pr-5'>
          <li className='flex items-end ml-5 pb-2'>
            <Link to="/">
              <img src={fullLogo} alt="" width={120} height={120} className="inline-block -mt-2"/>
              <div className='inline-block font-bold text-xl ml-2'>
                App Avengers
              </div>
            </Link>
          </li>
          <li className='w-2/6'>
            <ul className='lg:flex justify-between font-bold mr-10 text-lg'>
              {location.pathname === "/" ? 
              <li className='border-b-2 hover:pb-0 p-2'>
                <Link to="/">Marketplace</Link>
              </li>
              :
              <li className='hover:border-b-2 hover:pb-0 p-2'>
                <Link to="/">Marketplace</Link>
              </li>              
              }
              {location.pathname === "/sellNFT" ? 
              <li className='border-b-2 hover:pb-0 p-2'>
                <Link to="/sellNFT">List My NFT</Link>
              </li>
              :
              <li className='hover:border-b-2 hover:pb-0 p-2'>
                <Link to="/sellNFT">List My NFT</Link>
              </li>              
              }              
              {location.pathname === "/profile" ? 
              <li className='border-b-2 hover:pb-0 p-2'>
                <Link to="/profile">Profile</Link>
              </li>
              :
              <li className='hover:border-b-2 hover:pb-0 p-2'>
                <Link to="/profile">Profile</Link>
              </li>              
              }  
              <li>
                <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={connectWebsite}>{connected? "Connected":"Connect Wallet"}</button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div className='text-white text-bold text-right mr-10 text-sm'>
        {currAddress !== "0x" ? "Connected to":"Not Connected. Please login to view NFTs"} {currAddress !== "0x" ? (currAddress.substring(0,15)+'...'):""}
      </div>
    </div>
  );
}

export default Navbar;
