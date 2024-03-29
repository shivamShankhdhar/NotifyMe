"use client"
import {FormEvent, Fragment, useRef, useState} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { addUserEmailToProduct } from '@/lib/actions'

import { toast } from 'react-toastify';

interface Props{
  productId:string
}
const Modal = ({ productId }:Props) => {
  let [isOpen, setIsOpen] = useState(false)
  const [isSubmitting,setIsSubmitting] = useState(false);

  const [emailInputData,setEmailInputData] = useState("");

  const handleOnSubmit = async (event:FormEvent<HTMLFormElement>) =>{
    setIsSubmitting(true);
    event.preventDefault();
    let isUserAdded = false;

    await addUserEmailToProduct(productId, emailInputData).then((res) => {
      if(res == "User already exists") {isUserAdded = false}
      else{isUserAdded = true}}).catch((err) => console.log(err));

    if(isUserAdded) {
      toast.success("Your email has been added to track this item ...", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      setIsSubmitting(false);
      setEmailInputData("");
      setIsOpen(false);
    }else{
      toast.success("Your email has been added to track this item ...", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      setIsSubmitting(false);
      setEmailInputData(emailInputData);
      setIsOpen(true);
    }
    
  }
  return (
    <>
      <button type='button' className='btn max-w-50 max-h-50 text-center' onClick={() => setIsOpen(true)}>Track</button>
      <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="dialog-container" onClose={() => setIsOpen(false)}>
      <div className="min-h-screen px-4 text-center">
        <Transition.Child
        as={Fragment}
        enter='ease-out duration-300'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='ease-in duration-200'
        leaveFrom='opacity-100'
        leaveTo='opacity-0' 
        >
          <Dialog.Overlay className="fixed inset-0" />
        </Transition.Child>
        <span
        className='inline-block h-screen align-middle'
        aria-hidden="true"
        ></span>
        <Transition.Child
        as={Fragment}
        enter='ease-out duration-300'
        enterFrom='opacity-0 scale-95'
        enterTo='opacity-100 scale-100'
        leave='ease-in duration-200'
        leaveFrom='opacity-100 scale-100'
        leaveTo='opacity-0 scale-95'
        >
<div className="dialog-content">
 <div className="flex flex-col">
  <div className="flex justify-between">
    <div className="p-3 border border-gray-200">
      <Image src="/assets/icons/logo.svg" alt="logo" width={24} height={24} />
    </div>
    <Image src="/assets/icons/x-close.svg" alt="close" 
    width={24} 
    height={24} 
    className='cursor-pointer'
    onClick={() => setIsOpen(false)}/>
  </div>
  <h4 className='dialog-head_text'>Stay updated with product pricing alerts right in your inbox! </h4>
  <p className='text-sm text-gray-600 mt-2'>Never miss a bargain again with our timely alerts!</p>
 </div>
<form onSubmit={handleOnSubmit} className="flex flex-col mt-5">
  <label htmlFor="email" className="text-sm font-medium text-gray-700">
    Email Address
  </label>
  <div className="dialog-input_container">
    <Image src="/assets/icons/mail.svg" alt="email"
    width={18}
    height={18}
    />
    <input 
    value={emailInputData}
    onChange={(e) => setEmailInputData(e.target.value)}
    required
    id="email"
    placeholder="Enter your email"
    className="dialog-input"
    type="email" />
  </div>
  <button className="dialog-btn">
    {isSubmitting ? "Submitting..." : "Track"}</button>
</form>
</div>
        </Transition.Child>
      </div>
    </Dialog>
    </Transition>
    </>
  )
}

export default Modal
