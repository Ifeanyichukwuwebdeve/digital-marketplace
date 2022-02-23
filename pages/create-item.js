import { ethers } from 'ethers'
import { useState } from 'react'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modle from 'web3modal'

import image from 'next/image';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import { nftAddress, nftMarketAddress } from '../config'

import NFT from '../contracts/NFT.json'
import Market from '../contracts/NFTMarket.json'

export default function CreateItem () {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
        )
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        setFileUrl(url)
    } catch (error) {
      console.log(error)
    }
  }

  async function createItem() {
    const { price, name, description } = formInput

    if(!name || !price || !description || !fileUrl) return
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    
    console.log('Fired')
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      createSale(url)
    } catch (error) {
      console.log('Error uploading file:', error)
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modle()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    let contract = new ethers.Contract(nftAddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    const tx = await transaction.wait()

    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()

    const price = ethers.utils.parseUnits(formInput.price, 'ether')

    contract = new ethers.Contract(nftMarketAddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(
      nftAddress, tokenId, price, { value: listingPrice }
    )
    await transaction.wait()
    router.push('/')
  }

  return (
    <div className='flex justify-center'>
      <div className='w-1/2 flex flex-col pb-12'>
        <input
          placeholder='Asset Name'
          className='mt-8 border rounded p-4'
          onChange={e => updateFormInput({ ...formInput, name: e.target.value})}
        />
        <textarea
          placeholder='Asset Description'
          className='mt-8 border rounded p-4'
          onChange={e => updateFormInput({ ...formInput, description: e.target.value})}
        />
        <input
          placeholder='Asset price in Matic'
          className='mt-8 border rounded p-4'
          onChange={e => updateFormInput({ ...formInput, price: e.target.value})}
        />
        <input
          type='file'
          placeholder='Asset'
          className='my-4'
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className='rounded mt-4' width='350' src={fileUrl} alt='Test img' />
            // <img className='rounded' />
          )
        }
        <button
          onClick={createItem}
          className='font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg'
        >
          Create Digital Asset
        </button>
      </div>
    </div>
  )
}