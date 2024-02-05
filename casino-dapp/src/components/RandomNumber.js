import React, { useState } from 'react';
import { ethers } from 'ethers';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'


const casinoAbi = require("../abis/casino_ABI.json");
const casinoAddress = "0x331643e9db0c28bcbeeea4958054737594afc5b7";


function RandomNumber() {
  const [randomNumber, setRandomNumber] = useState('');

  const fetchRandomNumber = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request account access if needed
      const contract = new ethers.Contract(casinoAddress, casinoAbi, provider);

      const number = await contract.random();
      setRandomNumber(number.toString());
    } catch (error) {
      console.error(error);
      alert('Failed to fetch random number');
    }
  };

  return (
    <div className='d-inline'>
      <button type='button' className='btn btn-info btn-sm' onClick={fetchRandomNumber}>Show Random</button>
      {randomNumber && <p className='d-inline ms-2'>{randomNumber}</p>}
    </div>
  );
}

export default RandomNumber;
