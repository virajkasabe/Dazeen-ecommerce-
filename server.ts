import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Fast2SMS OTP Senders
  app.post("/api/sms/send-otp", async (req, res) => {
    const { phone, otp, otpValue } = req.body;
    const resolvedOtpValue = otpValue || (otp ? `${otp}|` : "");

    if (!phone || !resolvedOtpValue) {
      return res.status(400).json({ success: false, error: "Missing phone or OTP" });
    }

    const url = "https://www.fast2sms.com/dev/bulkV2";
    const fallbackAuth = "14eYp2D6nfUcWLTyxmVtq97JaAzHbi3FjX8sGuvZElRdKoOCrkuyLcNgESHKsbtYhz1DrinmqpxoZTvP";
    const authKey = process.env.AUTHORIZATION || fallbackAuth;

    console.log("DEBUG_URL:", `${url}?authorization=${authKey}&route=dlt&sender_id=DAZEEN&message=214505&variables_values=${encodeURIComponent(resolvedOtpValue)}&numbers=${phone}`);

    try {
      const response = await axios.get(url, {
        params: {
          authorization: authKey,
          route: "dlt",
          sender_id: "DAZEEN",
          message: "214505",
          variables_values: resolvedOtpValue,
          numbers: phone
        }
      });

      // Check if Fast2SMS returned an explicit error block from the gateway inside 200 OK
      if (response.data && response.data.return === false) {
        return res.status(200).json({
          success: false,
          error: response.data.message || "Failed to deliver SMS. Check if Fast2SMS balance is active or credentials are valid.",
          details: response.data
        });
      }

      return res.status(200).json({
        success: true,
        ...response.data
      });
    } catch (error: any) {
      if (error.response) {
        // Server se kya error aaya (Status 404, 403, etc.)
        console.error("Fast2SMS API Error Response:", error.response.data);
        return res.status(500).json({
          success: false,
          error: `API Error (Status ${error.response.status})`,
          data: error.response.data,
          status: error.response.status
        });
      } else {
        console.error("Fast2SMS Connection/Network Error:", error.message);
        return res.status(500).json({
          success: false,
          error: "Network Error",
          message: error.message
        });
      }
    }
  });

  // API Route for Cashfree order creation
  app.post("/api/cashfree/create-order", async (req, res) => {
    try {
      const { orderId, amount, customerName, customerEmail, customerPhone } = req.body;
      
      const appId = (process.env.CASHFREE_APP_ID || "12821375de78fc2e2c8d6fefc657312821c").trim();
      const secretKey = (process.env.CASHFREE_SECRET_KEY || "cfsk_ma_prod_b796c278fa2180b98a4bad64d416d12b_223824f9").trim();
      
      if (!appId || !secretKey) {
        return res.status(200).json({
          success: false,
          error: "Cashfree API keys (CASHFREE_APP_ID & CASHFREE_SECRET_KEY) are not configured in the environment variables. Please add them in the env settings."
        });
      }
      
      // Determine if keys are sandbox or production based on secret key prefix
      const isProduction = secretKey.startsWith("cfsk_ma_prod_");
      const url = isProduction 
        ? "https://api.cashfree.com/pg/orders" 
        : "https://sandbox.cashfree.com/pg/orders";
      
      console.log(`Initiating Cashfree order ${orderId} of ₹${amount}. Mode: ${isProduction ? "Production" : "Sandbox/Test"}`);

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

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": appId,
          "x-client-secret": secretKey,
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
