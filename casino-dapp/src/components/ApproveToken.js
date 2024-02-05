import React, { useState } from 'react';
import { ethers } from 'ethers';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'

const tokenAbi = require("../abis/ERC20_abi.json");



function ApproveToken({ tokenAddress, spenderAddress }) {
  const [amount, setAmount] = useState('');
  const [tx, setTx] = useState('');

  const handleApprove = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request account access if needed
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

      const amountToApprove = await tokenContract.balanceOf(await signer.getAddress()); // Assuming the token uses 18 decimals
      const txResponse = await tokenContract.approve(spenderAddress, amountToApprove);
      setTx(txResponse.hash); // Optionally track the transaction hash
      await txResponse.wait(); // Wait for the transaction to be mined
      alert('Approval successful');
    } catch (error) {
      console.error(error);
      alert('Approval failed');
    }
  };

  return (
    <div>
      <button type='button' className='btn btn-success' onClick={handleApprove}>Approve</button>
      {tx && <p>Transaction Hash: {tx}</p>}
    </div>
  );
}

export default ApproveToken;


