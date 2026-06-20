import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import https from "https";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Fast2SMS OTP Senders
  app.post("/api/sms/send-otp", async (req, res) => {
    const { phone, otp, otpValue } = req.body;
    let rawOtp = otpValue || otp || "";
    
    // Ensure the OTP value is formatted with '|' at the end for the DLT variable template
    let formattedOtpValue = rawOtp;
    if (formattedOtpValue && !formattedOtpValue.endsWith("|")) {
      formattedOtpValue = `${formattedOtpValue}|`;
    }

    if (!phone || !formattedOtpValue) {
      return res.status(400).json({ success: false, error: "Missing phone or OTP value" });
    }

    const authKey = process.env.AUTHORIZATION || "14eYp2D6nfUcWLTyxmVtq97JaAzHbi3FjX8sGuvZElRdKoOCrkuyLcNgESHKsbtYhz1DrinmqpxoZTvP";

    // URLSearchParams automatically handles variables_values encoding correctly
    const params = new URLSearchParams({
      authorization: authKey,
      route: "dlt",
      sender_id: "DAZEEN",
      message: "214505",
      variables_values: formattedOtpValue,
      numbers: phone,
      flash: "0",
      language: "english"
    });

    const url = `https://www.fast2sms.com/dev/bulkV2?${params.toString()}`;

    console.log("DEBUG_URL:", url); // Check server logs for this!

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "cache-control": "no-cache" }
      });
      const data = await response.json();
      
      console.log("Fast2SMS API Response data:", data);

      if (!response.ok || (data && data.return === false)) {
        return res.status(200).json({
          success: false,
          error: data.message || "Failed to deliver SMS. Check if Fast2SMS balance is active or the credentials are valid.",
          details: data
        });
      }

      res.status(200).json({
        success: true,
        ...data
      });
    } catch (error: any) {
      console.error("Fast2SMS Fetch API connection failed:", error);
      res.status(500).json({ success: false, error: "API Failed", message: error.message });
    }
  });

  app.post("/api/send-otp", async (req, res) => {
    const { phone, otpValue } = req.body;
    
    let rawOtp = otpValue || "";
    let formattedOtpValue = rawOtp;
    if (formattedOtpValue && !formattedOtpValue.endsWith("|")) {
      formattedOtpValue = `${formattedOtpValue}|`;
    }

    if (!phone || !formattedOtpValue) {
      return res.status(400).send("Error: Missing phone or otpValue");
    }

    const authKey = process.env.AUTHORIZATION || "14eYp2D6nfUcWLTyxmVtq97JaAzHbi3FjX8sGuvZElRdKoOCrkuyLcNgESHKsbtYhz1DrinmqpxoZTvP";
    
    // DEBUGGING: Ye line aapke Vercel Logs mein dikhegi
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${authKey}&route=dlt&sender_id=DAZEEN&message=214505&variables_values=${encodeURIComponent(formattedOtpValue)}&numbers=${phone}`;
    console.log("DEBUG_URL_BEING_SENT (POST):", url.replace(authKey, "HIDDEN_KEY"));

    try {
        const response = await fetch(url);
        const text = await response.text(); // JSON ke bajaye text lo
        console.log("RAW_RESPONSE_FROM_SERVER (POST):", text); // Ye log check karo
        
        res.send(text);
    } catch (e: any) {
        res.status(500).send("Error: " + e.message);
    }
  });

  app.get("/api/send-otp", async (req, res) => {
    const phone = req.query.phone;
    const otp = req.query.otpValue;
    const auth = process.env.AUTHORIZATION || "14eYp2D6nfUcWLTyxmVtq97JaAzHbi3FjX8sGuvZElRdKoOCrkuyLcNgESHKsbtYhz1DrinmqpxoZTvP";

    // Bilkul simple format
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${auth}&route=dlt&sender_id=DAZEEN&message=214505&variables_values=${otp}|&numbers=${phone}`;

    try {
      const response = await fetch(url);
      const text = await response.text();
      
      // Yahan debug karo ki kya URL ban raha hai
      console.log("DEBUG_URL:", url); 
      
      res.status(200).send(text);
    } catch (error: any) {
      res.status(500).send("Error: " + error.message);
    }
  });

  // API Route for Cashfree webhook
  app.all("/api/cashfree/webhook", async (req, res) => {
    // 1. Sirf POST request handle karo
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    // 2. CASHFREE ko turant OK bhejo (Handshake complete)
    // Iske bina "Endpoint did not respond" error aayega
    res.status(200).json({ status: "OK" });

    // 3. Ab background mein apna kaam karo (Database update, Email, etc.)
    try {
      const paymentData = req.body;
      console.log("CASHFREE_DATA (/api/cashfree/webhook):", JSON.stringify(paymentData, null, 2));
      
      // Yahan apna logic likho (jaise Order status update karna)
    } catch (error) {
      console.error("Webhook processing error:", error);
    }
  });

  app.all("/api/webhook", async (req, res) => {
    // 1. Sirf POST request handle karo
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    // 2. CASHFREE ko turant OK bhejo (Handshake complete)
    // Iske bina "Endpoint did not respond" error aayega
    res.status(200).json({ status: "OK" });

    // 3. Ab background mein apna kaam karo (Database update, Email, etc.)
    try {
      const paymentData = req.body;
      console.log("CASHFREE_DATA (/api/webhook):", JSON.stringify(paymentData, null, 2));
      
      // Yahan apna logic likho (jaise Order status update karna)
    } catch (error) {
      console.error("Webhook processing error:", error);
    }
  });

  // API Route for Cashfree order creation
  app.post("/api/cashfree/create-order", async (req, res) => {
    try {
      const { orderId, amount, customerName, customerEmail, customerPhone } = req.body;
      
      const appId = (process.env.CASHFREE_APP_ID || "12821375de78fc2e2c8d6fefc657312821").trim();
      const secretKey = (process.env.CASHFREE_SECRET_KEY || "cfsk_ma_prod_b796c278fa2180b98a4bad64d416d12b_223824f9").trim();
      
      if (!appId || !secretKey) {
        return res.status(200).json({
          success: false,
          error: "Cashfree API keys (CASHFREE_APP_ID & CASHFREE_SECRET_KEY) are not configured in the environment variables. Please add them in the env settings."
        });
      }
      
      // Determine if keys are sandbox or production based on secret key prefix
      const isProduction = secretKey.startsWith("cfsk_ma_prod_");
      const tokenUrl = isProduction 
        ? "https://api.cashfree.com/pg/token" 
        : "https://sandbox.cashfree.com/pg/token";
      const orderUrl = isProduction 
        ? "https://api.cashfree.com/pg/orders" 
        : "https://sandbox.cashfree.com/pg/orders";
      
      console.log(`Initiating Cashfree order ${orderId} of ₹${amount}. Mode: ${isProduction ? "Production" : "Sandbox/Test"}`);

      // 1. Pehle Token Request
      console.log(`Getting token from ${tokenUrl}...`);
      const tokenResponse = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "x-client-id": appId,
          "x-client-secret": secretKey,
          "x-api-version": "2023-08-01"
        }
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json().catch(() => ({}));
        console.error("Cashfree Token Request Failed:", errorData);
        return res.status(200).json({
          success: false,
          error: errorData.message || "Failed to generate Cashfree authentication token",
          details: errorData
        });
      }

      const tokenJson = await tokenResponse.json() as { token?: string; [key: string]: any };
      const token = tokenJson.token;
      
      if (!token) {
        console.error("Token missing in response:", tokenJson);
        return res.status(200).json({
          success: false,
          error: "Authentication token was empty or missing from Cashfree response."
        });
      }

      const requestBody = {
        order_id: orderId,
        order_amount: Number(amount),
        order_currency: "INR",
        customer_details: {
          customer_id: `cust_${Date.now()}`,
          customer_name: customerName || "Guest Customer",
          customer_email: customerEmail || "guest@dazeen.com",
          customer_phone: customerPhone || "9999999999",
        },
        order_meta: {
          return_url: `${req.headers.origin || "https://ais-dev-ru3wgxzh5uxdw7biorvslv-334152686838.asia-southeast1.run.app"}/?order_id={order_id}&payment_status=success`
        }
      };

      // 2. Ab is Token ko Header mein daal kar Order create karo
      console.log(`Creating order at ${orderUrl}...`);
      const response = await fetch(orderUrl, {
        method: "POST",
        headers: {
          "x-api-version": "2023-08-01",
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Cashfree API Order Creation Failed completely:", data);
        return res.status(200).json({
          success: false,
          error: data.message || "Failed to initiate Cashfree gateway session",
          details: data
        });
      }

      res.json({
        success: true,
        isProduction,
        ...data
      });
    } catch (err: any) {
      console.error("Connection error in Cashfree endpoint:", err);
      res.status(200).json({ 
        success: false,
        error: "Server timeout or endpoint unreachable. Please verify network configuration.", 
        message: err.message
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on ${port}`));
}

startServer();
