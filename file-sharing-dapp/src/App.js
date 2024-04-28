import React, { useEffect, useState } from "react";
import Web3 from "web3";
import FileSharing from "./FileSharing.json"; // Truffle artifact for the FileSharing smart contract
import "./App.css";

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [fileName, setFileName] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

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

  const handleSignup = async () => {
    if (contract && account && !isRegistered) {
      await contract.methods.signup().send({ from: account });
      setIsRegistered(true);
    }
  };

  const handleFileUpload = async () => {
    if (contract && isRegistered && fileName && ipfsHash) {
      await contract.methods
        .uploadFile(fileName, ipfsHash)
        .send({ from: account });
      alert("File uploaded successfully!");
    } else {
      alert("Please enter a file name and IPFS hash.");
    }
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleIpfsHashChange = (e) => {
    setIpfsHash(e.target.value);
  };

  const loadUploadedFiles = async () => {
    if (contract && isRegistered) {
      const fileCount = await contract.methods.fileCount().call();
      const files = [];
      for (let i = 1; i <= fileCount; i++) {
        const file = await contract.methods.files(i).call();
        if (file.uploader === account) {
          files.push(file);
        }
      }
      setUploadedFiles(files);
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
                  type="text"
                  placeholder="File name"
                  value={fileName}
                  onChange={handleFileNameChange}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="IPFS Hash"
                  value={ipfsHash}
                  onChange={handleIpfsHashChange}
                  className="input-field"
                />
                <button onClick={handleFileUpload} className="primary-button">
                  Upload File
                </button>
              </div>
              <button onClick={loadUploadedFiles} className="primary-button">
                Load My Uploaded Files
              </button>
              <ul>
                {uploadedFiles.map((file, index) => (
                  <li key={index}>
                    {file.name} - IPFS Hash: {file.hash}
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
