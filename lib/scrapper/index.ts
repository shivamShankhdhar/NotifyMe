import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";
export async function scrapeAmazonProduct(url:string){
  if(url){
    //brightdata proxy configuration
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const PORT = 22225 || process.env.BRIGHT_DATA_PORT;
    const session_id = (1000000 * Math.random()) || 0;
    const options = {
      auth:{
        username:`${username}-session-${session_id}`,
        password,
      },
      host:'brd.superproxy.io',
      PORT,
      rejectUnauthorized:false,
    }
try {
  const response = await axios.get(url,options);  
  // console.log(response.data)
  const $ = cheerio.load(response.data);

  //extract the product price
  const title = $('#productTitle').text().trim();
  //extract the product price
  const currentPrice = extractPrice(
    $('.priceToPay span.a-price-whole'),
    $('.a.size.base.a-color-price'),
    $('.a-price .a-color-base'),
    $('.a-price-whole .a-color-base'),
  );

  const originalPrice = extractPrice(
    $('#priceblock_ourprice'),
    $('.a-price.a-text-price span.a-offscreen'),
    $('#listprice'),
    $('.a-size-base.a-color-price')
  )

  const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';
// console.log({outOfStock})

const images = $('#imgBlkFront').attr('data-a-dynamic-image') ||  $('#landingImage').attr('data-a-dynamic-image') || '{}'; 
const imageUrls =  Object.keys(JSON.parse(images));
// console.log({imageUrls})

const currency = extractCurrency($('.a-price-symbol'))

// console.log({currency})

const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");

//construct data object with scraped information
const description = extractDescription($)
const data = {
  url,
  currency,
  image:imageUrls[0],
  title,
  currentPrice:Number(currentPrice) || Number(originalPrice),
  originalPrice:Number(originalPrice) || Number(currentPrice) ,
  discountRate:Number(discountRate),
  priceHistory:[], 
  /*
  category:"",
  reviewsCount:100,
  stars:4.5,
  */
 isOutOfStock:outOfStock,
 description,
 lowestPrice:Number(currentPrice) || Number(originalPrice),
 highestPrice:Number(originalPrice) || Number(currentPrice),
 averagePrice:Number(currentPrice) || Number(originalPrice),
}

return data;
} catch (error:any) {
  console.log(error.message)
}
  }
}