import React, { useEffect, useState } from "react";
import Web3 from "web3";
import FileSharing from "./FileSharing.json"; // Truffle artifact for the FileSharing smart contract
import { create as ipfsHttpClient } from "ipfs-http-client"; // IPFS client
import "./App.css";

// Connect to the local IPFS node
const ipfs = ipfsHttpClient({
  host: "127.0.0.1",
  port: 5001,
  protocol: "http",
});

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // New state variable for search query

  // Initialize Web3
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          setWeb3(web3);
        } catch (error) {
          console.error("User denied account access");
        }
      }
    };

    initWeb3();
  }, []);

  // Initialize the Contract
  useEffect(() => {
    const initContract = async () => {
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = FileSharing.networks[networkId];
        if (deployedNetwork) {
          const contract = new web3.eth.Contract(
            FileSharing.abi,
            deployedNetwork.address
          );
          setContract(contract);
        }
      }
    };

    initContract();
  }, [web3]);

  // Check if User is Registered
  useEffect(() => {
    const checkRegistration = async () => {
      if (contract && account) {
        const registered = await contract.methods
          .registeredUsers(account)
          .call();
        setIsRegistered(registered);
      }
    };

    checkRegistration();
  }, [contract, account]);

  // Sign Up Function
  const handleSignup = async () => {
    if (contract && account && !isRegistered) {
      await contract.methods.signup().send({ from: account });
      setIsRegistered(true);
    }
  };

  // File Upload Function
  const handleFileUpload = async () => {
    if (contract && isRegistered && selectedFile) {
      try {
        // Upload the selected file to IPFS
        const added = await ipfs.add(selectedFile);
        const ipfsHash = added.path;

        // Store file metadata in the smart contract
        await contract.methods
          .uploadFile(selectedFile.name, ipfsHash)
          .send({ from: account });

        // Refresh uploaded files
        loadUploadedFiles();

        console.log("File uploaded successfully!");
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      console.error("No file selected or not registered.");
    }
  };

  // Handle File Selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Load Uploaded Files
  const loadUploadedFiles = async () => {
    if (contract && isRegistered) {
      const fileCount = await contract.methods.fileCount().call();
      const files = [];
      for (let i = 1; i <= fileCount; i++) {
        const file = await contract.methods.files(i).call();
        files.push(file);
      }
      setUploadedFiles(files);
    }
  };

  // Handle Search
  const handleSearch = async () => {
    if (contract && isRegistered) {
      const fileCount = await contract.methods.fileCount().call();
      const filteredFiles = [];
      for (let i = 1; i <= fileCount; i++) {
        const file = await contract.methods.files(i).call();
        if (file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          filteredFiles.push(file);
        }
      }
      setUploadedFiles(filteredFiles); // Update displayed files based on search
    }
  };

  return (
    <div className="main-container">
      {account ? (
        <div className="account-section">
          <h2>Connected to Ethereum with account: {account}</h2>
          {isRegistered ? (
            <div>
              <div className="input-group">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="input-field"
                />
                <button onClick={handleFileUpload} className="primary-button">
                  Upload File
                </button>
              </div>
              <div className="search-section">
                {" "}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                  className="input-field"
                  placeholder="Search by file name"
                />
                <button onClick={handleSearch} className="primary-button">
                  Search
                </button>
              </div>
              <button onClick={loadUploadedFiles} className="primary-button">
                Load All Files
              </button>
              <ul>
                {uploadedFiles.map((file, index) => (
                  <li key={index}>
                    {file.name} -
                    <a
                      href={`http://127.0.0.1:8080/ipfs/${file.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <button onClick={handleSignup} className="primary-button">
              Signup
            </button>
          )}
        </div>
      ) : (
        <div>Connecting to Ethereum...</div>
      )}
    </div>
  );
}

export default App;
