import Africastalking from "africastalking";

export const connect = Africastalking({
  apiKey: process.env.sms_api_key,
  username: process.env.sms_username,
  enqueue: true
});
