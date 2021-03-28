import "module-alias/register";
import "reflect-metadata";

import { Proxy } from "./services/proxy"

async function main() {

  async function sendSMS() {
    try{
       // @ts-ignore
    const d = await Proxy.sms({
      message: "This is a test message from Oluwatobi. It works"
    }, {
      phone_number: "+2349043841434"
    })

    return d
    }catch(error){
      console.log(error)
    }
  }

  console.log(await sendSMS())
} main()