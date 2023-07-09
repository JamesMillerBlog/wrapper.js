import Greeter from "../../web3/src/artifacts/contracts/Greeter.sol/Greeter.json";
import { ethers } from "ethers";
import { useState } from "react";
import Token from "../../web3/src/artifacts/contracts/ERC20.sol/JMBToken.json";
import { isLive } from "./../../utils/index.js";
import contracts from "./../../web3/src/artifacts/contracts/addresses.json";
import { Html } from "@react-three/drei";

const { greeter, jmbToken } = contracts;
const greeterAddress = isLive == true ? process.env.greeter : greeter;

const tokenAddress = isLive == true ? process.env.jmbToken : jmbToken;

const greeterArtifact =
  isLive == true ? JSON.parse(process.env.greeterArtifact) : Greeter;

const jmbTokenArtifact =
  isLive == true ? JSON.parse(process.env.jmbTokenArtifact) : Token;

const ERC20 = (props) => {
  const [greeting, setGreetingValue] = useState();
  const [contractGreeting, setContractGreetingValue] = useState();
  const [userAccount, setUserAccount] = useState();
  const [amount, setAmount] = useState();
  const [contractAmmount, setCointractAmmountValue] = useState();
  const [userBalance, setUserBalance] = useState();

  async function requestAccount() {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (e) {
      console.log("Error: ", e);
    }
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const contract = new ethers.Contract(
        greeterAddress,
        greeterArtifact.abi,
        provider
      );
      try {
        const data = await contract.greet();
        setContractGreetingValue(`greeting is: ${data}`);
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  async function getBalance() {
    try {
      if (typeof window.ethereum !== "undefined") {
        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          tokenAddress,
          jmbTokenArtifact.abi,
          provider
        );
        const balance = await contract.balanceOf(account);
        console.log("Balance: ", balance.toString());
        setUserBalance(balance.toString());
      }
    } catch (e) {
      console.log("Error: ", e);
    }
  }

  async function setGreeting() {
    try {
      if (!greeting) return;
      if (typeof window.ethereum !== "undefined") {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log({ provider });
        const signer = provider.getSigner();
        console.log(signer);
        const contract = new ethers.Contract(
          greeterAddress,
          greeterArtifact.abi,
          signer
        );
        console.log(contract);
        const transaction = await contract.setGreeting(greeting);
        await transaction.wait();
        fetchGreeting();
      }
    } catch (e) {
      console.log("Error: ", e);
    }
  }

  async function sendCoins() {
    try {
      if (typeof window.ethereum !== "undefined") {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          tokenAddress,
          jmbTokenArtifact.abi,
          signer
        );
        const transation = await contract.transfer(userAccount, amount);
        await transation.wait();
        setCointractAmmountValue(
          `${amount} Coins successfully sent to ${userAccount}`
        );
        console.log(`${amount} Coins successfully sent to ${userAccount}`);
      }
    } catch (e) {
      console.log("Error: ", e);
    }
  }

  return (
    <Html castShadow receiveShadow occlude transform {...props}>
      <div>
        <header className="App-header">
          <button onClick={fetchGreeting}>Fetch Greeting</button>
          <button onClick={setGreeting}>Set Greeting</button>
          <input
            onChange={(e) => setGreetingValue(e.target.value)}
            placeholder="Set greeting"
          />
          <br />
          <p style={{ color: "red" }}>{contractGreeting}</p>
        </header>
      </div>
    </Html>
  );
};

export default ERC20;
