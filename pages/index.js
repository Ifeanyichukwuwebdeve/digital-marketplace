import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modle from 'web3modal'
import { nftAddress, nftMarketAddress} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';


export default function Home() {
  return (
    <div className="text-3xl font-bold underline">
      <h1>Home</h1>
    </div>
  )
}
