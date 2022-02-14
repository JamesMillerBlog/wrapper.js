import styled, { StyledComponent } from 'styled-components';
import Greeter from '../../web3/src/artifacts/contracts/Greeter.sol/Greeter.json';
import { ethers } from 'ethers';
import { useState } from 'react';
import Token from '../../web3/src/artifacts/contracts/ERC20.sol/FFToken.json'
import { isLive } from './../../utils/index.js';

const localGreeterAddress = '0x35bfD7c0e1504dABB2189791575dBCc5b2995A9a';
const localERC20Address = '0xAe1FBC77721f08664A8527AAf8170746E7469895';

const greeterAddress = (isLive == true) ? process.env.greeter_smart_contract_address : localGreeterAddress;
const tokenAddress = (isLive == true) ? process.env.erc20_smart_contract_address : localERC20Address;

const ERC20 = () => {
    const [greeting, setGreetingValue] = useState()
    const [userAccount, setUserAccount] = useState()
    const [amount, setAmount] = useState()

    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    async function fetchGreeting() {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            console.log({ provider })
            const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
            try {
                const data = await contract.greet()
                console.log('data: ', data)
            } catch (err) {
                console.log("Error: ", err)
            }
        }    
    }

    async function getBalance() {
        if (typeof window.ethereum !== 'undefined') {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
        const balance = await contract.balanceOf(account);
        console.log("Balance: ", balance.toString());
        }
    }

    async function setGreeting() {
        if (!greeting) return
        if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log({ provider })
        const signer = provider.getSigner()
        const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
        const transaction = await contract.setGreeting(greeting)
        await transaction.wait()
        fetchGreeting()
        }
    }

    async function sendCoins() {
        if (typeof window.ethereum !== 'undefined') {
        await requestAccount()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
        const transation = await contract.transfer(userAccount, amount);
        await transation.wait();
        console.log(`${amount} Coins successfully sent to ${userAccount}`);
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <button onClick={fetchGreeting}>Fetch Greeting</button>
                <button onClick={setGreeting}>Set Greeting</button>
                <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />

                <br />
                <button onClick={getBalance}>Get Balance</button>
                <button onClick={sendCoins}>Send Coins</button>
                <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
                <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
            </header>
        </div>
    );
}

export default ERC20
