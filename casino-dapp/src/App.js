import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
const genericErc20Abi = require("./abis/ERC20_abi.json");
const casinoAbi = require("./abis/casino_ABI.json");

function App() {

  const casinoAddress = "0x331643e9db0c28bcbeeea4958054737594afc5b7";

  const USDCAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
  const DAIAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const [USDCAmount, setUSDCAmount] = useState("");
  const [DAIAmount, setDAIAmount] = useState("");

  const [enteredUSDCAmount, setEnteredUSDCAmount] = useState('');

  const [provider, setProvider] = useState(null);

  const [log, setLog] = useState(null);

  let updateTokenBalances = async () => {
    setUSDCAmount(await getERC20Amount(USDCAddress));
  }

  let getERC20Amount = async (tokenAddr) => {
    if (provider != null) {
      const signer = await provider.getSigner();

      const USDCContract = new ethers.Contract(tokenAddr, genericErc20Abi, provider);
      let USDCBalance = await USDCContract.balanceOf(await signer.getAddress());

      return USDCBalance.toString();
      //return ethers.formatUnits(USDCBalance, 6);
    }
  }

  const betUSDC = async () => {

    let amount = Number(enteredUSDCAmount);

    // Make sure amount is valid
    if (amount <= 0) {
      alert('Bet amount must be positive!');
      return;
    }

    if (amount > await getERC20Amount(USDCAddress)) {
      alert('You don\'t have enought funds!');
      return;
    }

    // Make the tx...
    const signer = await provider.getSigner();

    const casinoContract = new ethers.Contract(casinoAddress, casinoAbi, provider)
      .connect(signer);

    try {
      let tx = await casinoContract.bet(amount, USDCAddress);
      setLog(`${tx}`);
    } catch (e) {
      setLog(`${e}`);
    }

    updateTokenBalances();

  }

  useEffect(() => {
    const initializeProvider = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
      }
    };

    initializeProvider();
  }, []);

  useEffect(() => {
    updateTokenBalances();
  }, [provider]);

  return (
    <div>
      <h1>Casino App</h1>

      <h3> USDC (Token Address: {USDCAddress}) </h3>
      <p> Your current USDC balance: {USDCAmount}</p>
      <input
        value={enteredUSDCAmount}
        onChange={(e) => {
          const re = /^[0-9\b]+$/;
          if (e.target.value === '' || re.test(e.target.value)) {
            setEnteredUSDCAmount(e.target.value)
          }
        }
        }
      />
      <button onClick={betUSDC}> Bet USDC! </button>



      {log && (<div><h3> LOG: </h3> <p> {log} </p> <button onClick={() => { setLog(null) }}>Clear log </button> </div>)}

    </div>
  );
}

export default App;
