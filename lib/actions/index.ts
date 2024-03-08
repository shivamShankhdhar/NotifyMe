"use server"
import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scrapper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import Error from "next/error";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl:string){
  if(!productUrl) return;
  try{
  connectToDB();
  const scrapedProduct = await scrapeAmazonProduct(productUrl);
  
  if(!scrapedProduct) return;
    let product = scrapedProduct;
    const existingProduct = await Product.findOne({url:scrapedProduct.url})

  if(existingProduct){
    const updatePriceHistory: any = [
      ...existingProduct.priceHistory,
      {price:scrapedProduct.currentPrice}
    ]
product = {
  ...scrapedProduct,
  priceHistory:updatePriceHistory,
  lowestPrice:getLowestPrice(updatePriceHistory),
  highestPrice:getHighestPrice(updatePriceHistory),
  averagePrice:getAveragePrice(updatePriceHistory)

}
  }

const newProduct = await Product.findOneAndUpdate({url:scrapedProduct.url},
product,
{upsert:true,new:true}
);
revalidatePath(`products/${newProduct._id}`);

  }catch(error:any){
    console.log(error.message);
  } 
}

export async function getProductById(productId:string){
try {
  connectToDB();
  const product = await Product.findOne({ _id:productId});
  if(!product) return null; 
  return product;

} catch (error:any) {
  console.log(error.message)
}
}

export async function getAllProducts(){
  try {
    connectToDB();
    const products = await Product.find();
    return products;
  }catch (error:any) {
    console.log(error.message)
  }
}
export async function getSimilarProducts(productId:string){
  try {
    connectToDB();
    const currentProduct = await Product.findById(productId);

    if(!currentProduct) return {};
    const similarProducts = await Product.find({_id:{$ne:productId}}).limit(3);
    return similarProducts;
  }catch (error:any) {
    console.log(error.message)
  }
}

export async function addUserEmailToProduct(productId:string,userEmail:string){
  try {
    // send our first email 
    const product = await Product.findById(productId);

    if(!product) return;

    const userExsists = product.users.some((user:User) => user.email === userEmail);
  
    if(!userExsists) product.users.push({email:userEmail});

    await product.save();

    const emailContent = generateEmailBody(product,"WELCOME")
 await sendEmail(emailContent,[userEmail]);

  } catch (error:any) {
    console.log(error.message);
  }
}