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
  const isConnected = connectToDB();
  // console.log(isConnected)
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
  const isConnected = connectToDB();
  // console.log(isConnected)
  const product = await Product.findOne({ _id:productId});
  if(!product) return null; 
  return product;

} catch (error:any) {
  console.log(error.message)
}
}

export async function getAllProducts(){
  try {
     connectToDB().then(() => console.log("connected to db")).catch((error) => console.log(error));
  
    const products = await Product.find();
    return products;
  }catch (error:any) {
    console.log(error.message)
  }
}
export async function getSimilarProducts(productId:string){
  try {
    const isConnected = connectToDB();
  console.log(`get similar products : ${isConnected}`)
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

    const userExists = product.users.some((user:User) => user.email === userEmail);
  
    if(!userExists) product.users.push({email:userEmail});
    else return new Promise((resolve,reject) => reject("User already exists"));

    await product.save();

    const emailContent = await generateEmailBody(product,"WELCOME")
    await sendEmail(emailContent,[userEmail]);

   

  } catch (error:any) {
    return ;
  }
}