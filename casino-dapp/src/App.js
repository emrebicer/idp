import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import ApproveToken from './components/ApproveToken';
import RandomNumber from './components/RandomNumber';

import { Container, Navbar, Nav, Button, OverlayTrigger, Tooltip, NavItem, NavLink } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



const genericErc20Abi = require("./abis/ERC20_abi.json");
const casinoAbi = require("./abis/casino_ABI.json");

function App() {

  const casinoAddress = "0x331643e9db0c28bcbeeea4958054737594afc5b7";

  const USDCAddress = "0x603Cff7a7FfB80a770176E548997Ca9DD85Ca0C4";
  const DAIAddress = "0xE74b53d0f49Dac9e648331E3B721f7e99433d063";

  const [USDCAmount, setUSDCAmount] = useState("");
  const [DAIAmount, setDAIAmount] = useState("");
  const [CasinoAmount, setCasinoAmount] = useState("");

  const [enteredUSDCAmount, setEnteredUSDCAmount] = useState('');

  const [provider, setProvider] = useState(null);

  const [log, setLog] = useState(null);

  let updateTokenBalances = async () => {
    let balance = await getERC20Amount(USDCAddress) || [0, 0];
    setUSDCAmount(balance[0]);
    setCasinoAmount(balance[1]);
  }

  let getERC20Amount = async (tokenAddr) => {
    if (provider != null) {
      const signer = await provider.getSigner();

      const USDCContract = new ethers.Contract(tokenAddr, genericErc20Abi, provider);
      let USDCBalance = await USDCContract.balanceOf(await signer.getAddress());
      let casinoBalance = await USDCContract.balanceOf(casinoAddress);
      const data = {
        signer: USDCBalance.toString(),
        casino: casinoBalance.toString()
      }

      return [USDCBalance.toString(), casinoBalance.toString()]
      //return ethers.formatUnits(USDCBalance, 6);
    }
  }
  // let casinoBalance = async (tokenAddr) => {
  //   const USDCContract = new ethers.Contract(tokenAddr, genericErc20Abi);
  //   let USDCBalance = await USDCContract.balanceOf(casinoAddress);

  //   return USDCBalance.toString();
  // }

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
      console.log(`bet amound: ${amount}, token addr: ${USDCAddress}`);
      console.log({ RandomNumber });
      let tx = await casinoContract.bet(amount, USDCAddress);
      let res = await tx.wait();
      setLog(`TX: ${tx} \n\n\nRes: ${res}`);
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

  const USDCAddrTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      USDC (Token Address: {USDCAddress})
    </Tooltip>
  );

  return (
    /*
    ------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------
    // HTML BURDAN BASLIYOR
    ------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------
*/


    <div className='bg-dark text-white h-100'>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container >
          <Navbar.Brand>Casino Emre</Navbar.Brand>
          <Nav className="me-auto">
            <NavLink><ApproveToken tokenAddress={USDCAddress} spenderAddress={casinoAddress} /></NavLink>
          </Nav>
          <OverlayTrigger
            placement="right"
            overlay={USDCAddrTooltip}>
            <button type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top" className="btn btn-warning position-relative fw-bold">
              💰{USDCAmount}
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                USDC
              </span>
            </button>

          </OverlayTrigger>
        </Container>
      </Navbar>



      <Container className="flex-grow-1 mt-5">
        <Row className='pt-5'>
          <Col className='text-center mt-5'><h2>W  E  L C  O  M  E</h2> T O</Col>
        </Row>
        <Row>
          <Col className='text-center  '> <img src="https://raw.githubusercontent.com/emrebicer/idp/main/casino-dapp/src/assets/logo.png" alt="logo" width={300} /></Col>
        </Row>

        <Row className='mt-5'>
          <Col className='text-center '> </Col>
          <Col className='text-center mt-5'>
            <div class="input-group mb-3">
              <input type="text" class="form-control form-control-lg" placeholder="Your Bet Amount" aria-label="Your Bet Amount" aria-describedby="basic-addon2"
                value={enteredUSDCAmount}
                onChange={(e) => {
                  const re = /^[0-9\b]+$/;
                  if (e.target.value === '' || re.test(e.target.value)) {
                    setEnteredUSDCAmount(e.target.value)
                  }
                }
                }
              />
              <span class="input-group-text bg-danger fw-bold text-light" id="basic-addon2">USDC</span>

            </div>
            <div className='d-grid'>
              <button type="button" className="btn btn-warning fw-bold " onClick={betUSDC}> Bet USDC! </button>

            </div>
          </Col>
          <Col className='text-center '> </Col>

        </Row>

        <Row className='mt-5 '>
          <Col>{log && (

            <div class="alert alert-warning alert-dismissible fade show" role="alert">
              <strong>Hey! </strong> Here is the log of the transaction!
              <hr />
              <p className='text-break'> {log} </p>
              <button onClick={() => { setLog(null) }} type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>


          )}</Col>
        </Row>




        <h3 className='invisible '> USDC (Token Address: {USDCAddress}) </h3>
      </Container>

      <footer className="mt-5 py-3 bg-dark text-white ">
        <hr />
        <Container className='mt-5 mb-4'>
          <Row>
            <Col className='text-start'>
              <button type="button" className="btn btn-secondary fw-bold">
                Casino Balance: {CasinoAmount} <span className="badge rounded-pill bg-danger">USDC</span>
              </button>
            </Col>
            <Col className='text-end'><RandomNumber /></Col>
          </Row>
        </Container>
      </footer>

    </div>


  );


}

export default App;
