import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Cashfree order creation
  app.post("/api/cashfree/create-order", async (req, res) => {
    try {
      const { orderId, amount, customerName, customerEmail, customerPhone } = req.body;
      
      const appId = (process.env.CASHFREE_APP_ID 12821375de78fc2e2c8d6fefc657312821|| "").trim();
      const secretKey = (process.env.CASHFREE_SECRET_KEY cfsk_ma_prod_b796c278fa2180b98a4bad64d416d12b_223824f9|| "").trim();
      
      if (!appId || !secretKey) {
        return res.status(200).json({
          success: false,
          error: "Cashfree API keys (CASHFREE_APP_ID & CASHFREE_SECRET_KEY) are not configured in the environment variables. Please add them in the env settings."
        });
      }
      
      // const cashfree = Cashfree({ mode: "production" });
      
      const isProduction = secretKey.startsWith("cfsk_ma_prod_");
      const url = "https://api.cashfree.com/pg/orders"; 
      
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
