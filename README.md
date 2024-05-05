# Decentralized File Sharing DApp

## Overview

The Decentralized File Sharing DApp is a blockchain-based application built on the Ethereum blockchain, allowing users to securely upload and download files using the InterPlanetary File System (IPFS). The goal is to create a decentralized platform for file sharing, enhancing data security, privacy, and resistance to censorship.


## Project Components

The DApp consists of several key components:

+ Ethereum Smart Contract: A Solidity-based contract that manages user registration and stores file metadata, such as file names and IPFS hashes.
+ IPFS: A decentralized storage system used for file storage and retrieval.
React Front-End: A user interface built with React, enabling interaction with the smart contract and IPFS.

## Features
### User Registration

Users can register with the DApp to gain access to uploading and downloading files.

+ Smart contract function to register users.
+ React component with a "Sign Up" button to trigger the registration process.

### File Upload

Registered users can upload files to the DApp, which are stored on IPFS.

+ File upload function that uploads files to IPFS and stores metadata in the smart contract.
+ React component with a file input and an "Upload" button to upload files.

### File Download

Users can download files from IPFS using the IPFS hash.

+ A list of uploaded files with download links, allowing users to download files via their IPFS hash.
+ React component that retrieves the list of uploaded files from the smart contract.

### Search and Filter

The DApp allows users to search and filter files.

+ A search function in the React front-end to filter files based on user input.
+  React component with a search input field and a "Search" button to initiate the search.

### Technical Stack

+ Smart Contract: Solidity, Ethereum, Truffle
+ Decentralized Storage: IPFS
+ Front-End: React, Web3.js, IPFS HTTP Client
+ Development Environment: Ganache for local Ethereum network simulation
