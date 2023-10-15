import Navbar from "./Navbar";  // Import the Navbar component
import { useLocation, useParams } from 'react-router-dom';  // Import useLocation and useParams from react-router-dom
import MarketplaceJSON from "../Marketplace.json";  // Import Marketplace JSON data
import axios from "axios";  // Import the axios library for HTTP requests
import { useState } from "react";  // Import the useState hook from React
import NFTTile from "./NFTTile";  // Import the NFTTile component

export default function Profile() {

    const [data, updateData] = useState([]);  // State to store NFT data
    const [dataFetched, updateFetched] = useState(false);  // State to track if data has been fetched
    const [address, updateAddress] = useState("0x");  // State to store the user's wallet address
    const [totalPrice, updateTotalPrice] = useState("0");  // State to store the total value of NFTs

    // Function to get NFT data for a specific tokenId
    async function getNFTData(tokenId) {
        const ethers = require("ethers");  // Import the ethers library
        let sumPrice = 0;

        // After adding your Hardhat network to your Metamask, this code gets providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();  // Get the user's Ethereum address

        // Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);

        // Create an NFT Token
        let transaction = await contract.getMyNFTs();

        // Process NFT data from the contract and tokenURI metadata
        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
            };
            sumPrice += Number(price);
            return item;
        });

        updateData(items);  // Update the NFT data state
        updateFetched(true);  // Update the data fetched state
        updateAddress(addr);  // Update the user's Ethereum address state
        updateTotalPrice(sumPrice.toPrecision(3));  // Update the total value state
    }

    const params = useParams();  // Get the parameters from the URL
    const tokenId = params.tokenId;

    // If data has not been fetched yet, call the getNFTData function
    if (!dataFetched) {
        getNFTData(tokenId);
    }

    return (
        <div className="profileClass" style={{"min-height": "100vh"}}>
            <Navbar></Navbar>  // Render the Navbar component
            <div className="profileClass">
                <div className="flex text-center flex-col mt-11 md:text-2xl text-white">
                    <div className="mb-5">
                        <h2 className="font-bold">Wallet Address</h2>
                        {address}  // Display the user's wallet address
                    </div>
                </div>
                <div className="flex flex-row text-center justify-center mt-10 md:text-2xl text-white">
                    <div>
                        <h2 className="font-bold">No. of NFTs</h2>
                        {data.length}  // Display the number of NFTs
                    </div>
                    <div className="ml-20">
                        <h2 className="font-bold">Total Value</h2>
                        {totalPrice} ETH  // Display the total value in ETH
                    </div>
                </div>
                <div className="flex flex-col text-center items-center mt-11 text-white">
                    <h2 className="font-bold">Your NFTs</h2>
                    <div className="flex justify-center flex-wrap max-w-screen-xl">
                        {data.map((value, index) => {
                            return <NFTTile data={value} key={index}></NFTTile>;  // Render NFTTile components
                        })}
                    </div>
                    <div className="mt-10 text-xl">
                        {data.length === 0 ? "Oops, No NFT data to display (Are you logged in?)" : ""}  // Display a message if there are no NFTs
                    </div>
                </div>
            </div>
        </div>
    )
};
