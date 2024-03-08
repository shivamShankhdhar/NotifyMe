"use client"
import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css";

const heroImages = [
  {imgUrl:"/assets/images/hero-1.svg", alt:'smartwatch'},
  {imgUrl:"/assets/images/hero-2.svg", alt:'bag'},
  {imgUrl:"/assets/images/hero-3.svg", alt:'lamp'},
  {imgUrl:"/assets/images/hero-4.svg", alt:'air fryer'},
  {imgUrl:"/assets/images/hero-5.svg", alt:'chair'},

]

import { Carousel } from 'react-responsive-carousel';

import Image from 'next/image';
const HeroCarousel = () => {
  return (
    <div className='hero-carousel'>
      <Carousel 
      showThumbs={false}
      autoPlay
      infiniteLoop
      interval={1000}
      showArrows={false}
      showStatus={false}>
          {heroImages.map((img)=><Image className='object-contain' key={img.alt} src={img.imgUrl} alt={img.alt} width={300} height={300}/>)}
        </Carousel>
       
    </div>
  )
}

export default HeroCarousel
