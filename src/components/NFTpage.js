import Navbar from "./Navbar";  // Import the Navbar component
import axie from "../tile.jpeg";  // Import an image (axie)
import { useLocation, useParams } from 'react-router-dom';  // Import useLocation and useParams from react-router-dom
import MarketplaceJSON from "../Marketplace.json";  // Import Marketplace JSON data
import axios from "axios";  // Import the axios library for HTTP requests
import { useState } from "react";  // Import the useState hook from React

export default function NFTPage(props) {

    const [data, updateData] = useState({});  // State to store NFT data
    const [dataFetched, updateDataFetched] = useState(false);  // State to track if data has been fetched
    const [message, updateMessage] = useState("");  // State to display messages
    const [currAddress, updateCurrAddress] = useState("0x");  // State to store the user's wallet address

    // Function to get NFT data for a specific tokenId
    async function getNFTData(tokenId) {
        const ethers = require("ethers");  // Import the ethers library
        const provider = new ethers.providers.Web3Provider(window.ethereum);  // Get the Web3Provider
        const signer = provider.getSigner();  // Get the signer
        const addr = await signer.getAddress();  // Get the user's Ethereum address

        // Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);

        // Get tokenURI and listedToken data
        const tokenURI = await contract.tokenURI(tokenId);
        const listedToken = await contract.getListedTokenForId(tokenId);
        let meta = await axios.get(tokenURI);
        meta = meta.data;
        console.log(listedToken);

        let item = {
            price: meta.price,
            tokenId: tokenId,
            seller: listedToken.seller,
            owner: listedToken.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        };
        console.log(item);
        updateData(item);  // Update the NFT data state
        updateDataFetched(true);  // Update the data fetched state
        console.log("address", addr);
        updateCurrAddress(addr);  // Update the user's Ethereum address state
    }

    // Function to buy an NFT
    async function buyNFT(tokenId) {
        try {
            const ethers = require("ethers");  // Import ethers library
            const provider = new ethers.providers.Web3Provider(window.ethereum);  // Get the Web3Provider
            const signer = provider.getSigner();  // Get the signer

            // Pull the deployed contract instance
            let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
            const salePrice = ethers.utils.parseUnits(data.price, 'ether');  // Parse the price

            updateMessage("Buying the NFT... Please Wait (Upto 5 mins)");  // Display a message

            // Run the executeSale function to buy the NFT
            let transaction = await contract.executeSale(tokenId, { value: salePrice });
            await transaction.wait();  // Wait for the transaction to complete

            alert('You successfully bought the NFT!');  // Display a success message
            updateMessage("");  // Clear the message
        }
        catch (e) {
            alert("Upload Error" + e);  // Display an error message
        }
    }

    const params = useParams();  // Get the parameters from the URL
    const tokenId = params.tokenId;

    // If data has not been fetched yet, call the getNFTData function
    if (!dataFetched) {
        getNFTData(tokenId);
    }

    return (
        <div style={{ "min-height": "100vh" }}>
            <Navbar></Navbar>  // Render the Navbar component
            <div className="flex ml-20 mt-20">
                <img src={data.image} alt="" className="w-2/5" />  // Display the NFT image
                <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
                    <div>
                        Name: {data.name}  // Display the NFT name
                    </div>
                    <div>
                        Description: {data.description}  // Display the NFT description
                    </div>
                    <div>
                        Price: <span className="">{data.price + " ETH"}</span>  // Display the NFT price in ETH
                    </div>
                    <div>
                        Owner: <span className="text-sm">{data.owner}</span>  // Display the NFT owner
                    </div>
                    <div>
                        Seller: <span className="text-sm">{data.seller}</span>  // Display the NFT seller
                    </div>
                    <div>
                        {currAddress == data.owner || currAddress == data.seller ?
                            <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => buyNFT(tokenId)}>Buy this NFT</button>
                            : <div className="text-emerald-700">You are the owner of this NFT</div>
                        }
                    </div>
                    <div className="text-green text-center mt-3">{message}</div>
                </div>
            </div>
        </div>
    )
}
