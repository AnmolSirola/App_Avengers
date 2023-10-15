import Navbar from "./Navbar";  // Import the Navbar component
import NFTTile from "./NFTTile";  // Import the NFTTile component
import MarketplaceJSON from "../Marketplace.json";  // Import Marketplace JSON data
import axios from "axios";  // Import the axios library for HTTP requests
import { useState } from "react";  // Import the useState hook from React

export default function Marketplace() {
    const sampleData = [  // Sample NFT data
        {
            "name": "NFT#1",
            "description": "My First NFT",
            "website": "http://axieinfinity.io",
            "image": "https://gateway.pinata.cloud/ipfs/QmaS4bBsTeDxfQQMpfgy2QghAMsSqeH6ba8cQvZiA3Lgox",
            "price": "0.03ETH",
            "currentlySelling": "True",
            "address": "0xf5C2232A42B89Ff64cCE52BB6f5A0a2beB3F73f0",
        },
        {
            "name": "NFT#2",
            "description": "My Second NFT",
            "website": "http://axieinfinity.io",
            "image": "https://gateway.pinata.cloud/ipfs/QmaS4bBsTeDxfQQMpfgy2QghAMsSqeH6ba8cQvZiA3Lgox",
            "price": "0.03ETH",
            "currentlySelling": "True",
            "address": "0xf5C2232A42B89Ff64cCE52BB6f5A0a2beB3F73f0",
        },
        {
            "name": "NFT#3",
            "description": "My Third NFT",
            "website": "http://axieinfinity.io",
            "image": "https://gateway.pinata.cloud/ipfs/QmaS4bBsTeDxfQQMpfgy2QghAMsSqeH6ba8cQvZiA3Lgox",
            "price": "0.03ETH",
            "currentlySelling": "True",
            "address": "0xf5C2232A42B89Ff64cCE52BB6f5A0a2beB3F73f0",
        },
    ];

    const [data, updateData] = useState(sampleData);  // State to store NFT data
    const [dataFetched, updateFetched] = useState(false);  // State to track if data has been fetched

    // Function to get all NFTs
    async function getAllNFTs() {
        const ethers = require("ethers");  // Import the ethers library
        const provider = new ethers.providers.Web3Provider(window.ethereum);  // Get the Web3Provider
        const signer = provider.getSigner();  // Get the signer

        // Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);

        // Get all NFTs from the contract
        let transaction = await contract.getAllNFTs();

        // Fetch details of every NFT from the contract and display
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
            return item;
        });

        updateFetched(true);  // Update the data fetched state
        updateData(items);  // Update the NFT data state
    }

    // If data has not been fetched yet, call the getAllNFTs function
    if (!dataFetched) {
        getAllNFTs();
    }

    return (
        <div>
            <Navbar></Navbar>  // Render the Navbar component
            <div className="flex flex-col place-items-center mt-20">
                <div className="md:text-xl font-bold text-white">
                    Top NFTs
                </div>
                <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                    {data.map((value, index) => {
                        return <NFTTile data={value} key={index}></NFTTile>;  // Render NFTTile components
                    })}
                </div>
            </div>
        </div>
    );
}
