import Product from "@/lib/models/product.model"
import { connectToDB } from "@/lib/mongoose"
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scrapper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(){
  try {
    connectToDB()

    const products = await Product.find({});

    if(!products) throw new Error("No products found");

    //crone job

    //1.scrap latest product and update DB

    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);
        if(!scrapedProduct) throw Error("No Product found");

        const updatePriceHistory: any = [
          ...currentProduct.priceHistory,
          {price:scrapedProduct.currentPrice}
        ]
   const  product = {
      ...scrapedProduct,
      priceHistory:updatePriceHistory,
      lowestPrice:getLowestPrice(updatePriceHistory),
      highestPrice:getHighestPrice(updatePriceHistory),
      averagePrice:getAveragePrice(updatePriceHistory)
    
    }
      
    
    const updateProduct = await Product.findOneAndUpdate({url:scrapedProduct.url},
    product,
    {upsert:true,new:true}
    );

    //2. check each product status and send email

    const emailNotiType = getEmailNotifType(scrapedProduct,currentProduct);

if(emailNotiType && updateProduct.users.length > 0){
  const productInfo = {
    title:updateProduct.title,
    url:updateProduct.url,
  }

  const emailContent = await generateEmailBody(productInfo,emailNotiType);

  const userEmails = updateProduct.users.map((user:any) => user.email);

  await sendEmail(emailContent,userEmails);
}
return updateProduct
      })
    )

    return  NextResponse.json(
      {
        message:'OK',
        data:updatedProducts,
      }
    )
  } catch (error:any) {
    throw new Error(`Error in GET : ${error.message}`)
  }
}