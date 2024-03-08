"use client";
import { scrapeAndStoreProduct } from "@/lib/actions";
import { load } from "cheerio";
import { FormEvent, useState } from "react";
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
const isValidAmazonProductURL = (url:string) =>{
try {
  const parseURL = new URL(url);
  const hostname = parseURL.hostname;
  if(
    hostname.includes('amazon.com') || hostname.includes('amazon.in') || hostname.includes('amazon.') ||
    hostname.includes('amzn.eu') || hostname.endsWith('amazon')
  ) return true;
  else return false;
} catch (error:any) {
  return false;
}
}
const SearchBar = () => {
  
  const toastPosition = "top-right";
  const [searchInput,setSaerchInput] = useState('')
  const [loading,setLoading] = useState(false);

  const handleSubmit = async (event:FormEvent<HTMLFormElement>) => {
    setLoading(true);
    //preventing the default refresh behaviour of the form 
    event.preventDefault();    
    //check for link is valid or not 
    const isValidLink = isValidAmazonProductURL(searchInput);
    if(!isValidLink){
      toast.error('Invalid link, Please provide a valid link', {
        position: toastPosition,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      setSaerchInput("")
    }else{
      setLoading(true);
      toast.success('Searching for product ...', {
        position: toastPosition,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
        setLoading(false);
    }

    //fetching data from the website

    try {
      setLoading(true);
      //scrap product page
      const product = await scrapeAndStoreProduct(searchInput);
      console.log(product)
      
      
      toast.success('Product searched Successfully ...', {
        position: toastPosition,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
        setLoading(false);


    } catch (error) {      
      setLoading(false);
      toast.error('something went wrong...', {
        position: toastPosition,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }finally{
      setLoading(false);
    }
  };
  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        value={searchInput}
        onChange={(e) => setSaerchInput(e.target.value)}
        placeholder="Enter product link ..."
        type="text"
        name="searchItems"
        id="search_items"
        className="searchbar-input text-white-200"
      />
      <button disabled={searchInput === '' || loading} className="searchbar-btn" type="submit">
       {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};

export default SearchBar;
