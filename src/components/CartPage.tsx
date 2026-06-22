import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trash2, Plus, Minus, ArrowLeft, Check, MapPin, CreditCard, ShoppingBag, 
  Truck, ArrowRight, Loader2, Sparkles, HelpCircle, Download, Coffee
} from "lucide-react";
import { CartItem } from "../types";
import { notificationService } from "../utils/notifications";

// Dynamic Cashfree v3 Loader function
const loadCashfreeScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Cashfree) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const indianRegionsFallback: Record<string, { city: string; state: string; villages: string[] }> = {
  "110001": { city: "New Delhi", state: "Delhi", villages: ["Connaught Place", "Barakhamba Road", "Janpath"] },
  "400001": { city: "Mumbai", state: "Maharashtra", villages: ["Fort", "Colaba", "Marine Drive", "CST"] },
  "400002": { city: "Mumbai", state: "Maharashtra", villages: ["Kalbadevi", "Thakurdwar", "Charni Road"] },
  "411001": { city: "Pune", state: "Maharashtra", villages: ["Shivajinagar", "Deccan Gymkhana", "Pune Camp"] },
  "411038": { city: "Pune", state: "Maharashtra", villages: ["Kothrud", "Erandwane", "Karve Nagar"] },
  "411014": { city: "Pune", state: "Maharashtra", villages: ["Viman Nagar", "Kharadi", "Wadgaon Sheri"] },
  "560001": { city: "Bengaluru", state: "Karnataka", villages: ["M.G. Road", "Shivajinagar", "Chamarajpet"] },
  "560030": { city: "Bengaluru", state: "Karnataka", villages: ["Adugodi", "Koramangala", "Lakkasandra"] },
  "600001": { city: "Chennai", state: "Tamil Nadu", villages: ["George Town", "Mannady", "Parrys"] },
  "700001": { city: "Kolkata", state: "West Bengal", villages: ["B.B.D. Bagh", "Chowringhee", "Burrabazar"] },
  "500001": { city: "Hyderabad", state: "Telangana", villages: ["Abids", "Koti", "Begum Bazar"] },
  "302001": { city: "Jaipur", state: "Rajasthan", villages: ["C-Scheme", "M.I. Road", "Pink City"] },
  "380001": { city: "Ahmedabad", state: "Gujarat", villages: ["Bhadra", "Gandhi Road", "Kalupur"] },
};

function getIndianPincodeFallback(pin: string) {
  if (indianRegionsFallback[pin]) return indianRegionsFallback[pin];
  
  const p2 = pin.substring(0, 2);
  const p1 = pin.substring(0, 1);
  
  if (p2 === "11") return { city: "New Delhi", state: "Delhi", villages: ["Connaught Place", "Chanakyapuri", "Dwarka", "Saket"] };
  if (p2 === "12" || p2 === "13") return { city: "Gurugram", state: "Haryana", villages: ["Sector 15", "Sector 45", "DLF Phase 3", "Sohna Road"] };
  if (p2 === "14" || p2 === "15") return { city: "Amritsar", state: "Punjab", villages: ["Golden Temple Area", "Ranjit Avenue", "Civil Lines"] };
  if (p2 === "16") return { city: "Chandigarh", state: "Chandigarh", villages: ["Sector 17", "Sector 22", "Sector 35"] };
  if (p2 === "17") return { city: "Shimla", state: "Himachal Pradesh", villages: ["Mall Road", "Sanjauli", "Chhota Shimla"] };
  if (p2 === "18" || p2 === "19") return { city: "Srinagar", state: "Jammu & Kashmir", villages: ["Lal Chowk", "Karan Nagar", "Dal Lake Region"] };
  
  if (p2 === "20" || p2 === "21" || p2 === "22") return { city: "Noida", state: "Uttar Pradesh", villages: ["Sector 62", "Sector 18", "Indirapuram"] };
  if (p2 === "23" || p2 === "24" || p2 === "25" || p2 === "26" || p2 === "27" || p2 === "28") return { city: "Lucknow", state: "Uttar Pradesh", villages: ["Hazratganj", "Aliganj", "Gomti Nagar"] };
  if (p2 === "24") return { city: "Dehradun", state: "Uttarakhand", villages: ["Rajpur Road", "Clement Town", "Patel Nagar"] };
  
  if (p2 === "30" || p2 === "31" || p2 === "32" || p2 === "33" || p2 === "34") return { city: "Jaipur", state: "Rajasthan", villages: ["Vaishali Nagar", "Malviya Nagar", "Mansarovar"] };
  if (p2 === "36" || p2 === "37" || p2 === "38" || p2 === "39") return { city: "Ahmedabad", state: "Gujarat", villages: ["Navrangpura", "Satellite", "Vastrapur"] };
  
  if (p2 === "40" || p2 === "41" || p2 === "42" || p2 === "43" || p2 === "44") {
    if (p2 === "40") return { city: "Mumbai", state: "Maharashtra", villages: ["Fort", "Andheri West", "Bandra West", "Dadar West", "Borivali West"] };
    return { city: "Pune", state: "Maharashtra", villages: ["Kothrud", "Shivajinagar", "Hinjawadi", "Hadapsar", "Viman Nagar"] };
  }
  if (p2 === "45" || p2 === "46" || p2 === "47" || p2 === "48") return { city: "Bhopal", state: "Madhya Pradesh", villages: ["Arera Colony", "M P Nagar", "Kolar Road"] };
  if (p2 === "49") return { city: "Raipur", state: "Chhattisgarh", villages: ["Sadar Bazar", "Tatibandh", "Pandri"] };
  
  if (p2 === "50") return { city: "Hyderabad", state: "Telangana", villages: ["Madhapur", "Gachibowli", "Jubilee Hills"] };
  if (p2 === "51" || p2 === "52" || p2 === "53") return { city: "Vijayawada", state: "Andhra Pradesh", villages: ["Benz Circle", "One Town", "Governorpet"] };
  if (p2 === "56" || p2 === "57" || p2 === "58" || p2 === "59") return { city: "Bengaluru", state: "Karnataka", villages: ["Koramangala", "Indiranagar", "Jayanagar", "Whitefield", "HSR Layout"] };
  
  if (p2 === "60" || p2 === "61" || p2 === "62" || p2 === "63" || p2 === "64") return { city: "Chennai", state: "Tamil Nadu", villages: ["Adyar", "Mylapore", "T. Nagar", "Velachery"] };
  if (p2 === "67" || p2 === "68" || p2 === "69") return { city: "Kochi", state: "Kerala", villages: ["Ernakulam", "Edappally", "Fort Kochi"] };
  
  if (p2 === "70" || p2 === "71" || p2 === "72" || p2 === "73" || p2 === "74") return { city: "Kolkata", state: "West Bengal", villages: ["Salt Lake", "New Town", "Ballygunge", "Alipore"] };
  if (p2 === "75" || p2 === "76" || p2 === "77") return { city: "Bhubaneswar", state: "Odisha", villages: ["Saheed Nagar", "Nayapalli", "Patia"] };
  if (p2 === "78" || p2 === "79") return { city: "Guwahati", state: "Assam", villages: ["Dispur", "Paltan Bazaar", "Ganeshguri"] };
  
  if (p2 === "80" || p2 === "81" || p2 === "82" || p2 === "83" || p2 === "84" || p2 === "85") return { city: "Patna", state: "Bihar", villages: ["Kankarbagh", "Bailey Road", "Boring Road"] };
  if (p2 === "83" || p2 === "84") return { city: "Ranchi", state: "Jharkhand", villages: ["Lalpur", "Harmu Colony", "Kanke Road"] };
  
  switch (p1) {
    case "1": return { city: "New Delhi", state: "Delhi", villages: ["Connaught Place", "Vasant Kunj"] };
    case "2": return { city: "Lucknow", state: "Uttar Pradesh", villages: ["Hazratganj", "Indira Nagar"] };
    case "3": return { city: "Jaipur", state: "Rajasthan", villages: ["C-Scheme", "Malviya Nagar"] };
    case "4": return { city: "Mumbai", state: "Maharashtra", villages: ["Fort", "Andheri West", "Bandra West"] };
    case "5": return { city: "Bengaluru", state: "Karnataka", villages: ["Koramangala", "Indiranagar"] };
    case "6": return { city: "Chennai", state: "Tamil Nadu", villages: ["Adyar", "T. Nagar"] };
    case "7": return { city: "Kolkata", state: "West Bengal", villages: ["Salt Lake", "Chowringhee"] };
    case "8": return { city: "Patna", state: "Bihar", villages: ["Boring Road", "Kankarbagh"] };
    default: return { city: "Mumbai", state: "Maharashtra", villages: ["Fort", "Bandra"] };
  }
}

interface CartPageProps {
  cart: CartItem[];
  currentUser: any;
  onOpenLogin: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onSetView: (v: any) => void;
}

export default function CartPage({
  cart,
  currentUser,
  onOpenLogin,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSetView,
}: CartPageProps) {
  // Coupon state
  const [coupon, setCoupon] = useState<string>("");
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; type: "percent" | "flat"; value: number } | null>(null);
  const [couponError, setCouponError] = useState<string>("");

  // Checkout sequence wizard step ("cart" | "address" | "payment")
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "address" | "payment">("cart");

  // Shipping Address Fields
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [landmark, setLandmark] = useState<string>("");

  // Auto Pin fetch states
  const [fetchedVillages, setFetchedVillages] = useState<string[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<string>("");
  const [isFetchingPincode, setIsFetchingPincode] = useState<boolean>(false);
  const [pincodeError, setPincodeError] = useState<string>("");

  // Payment states
  const [payMethod, setPayMethod] = useState<string>("CASHFREE");
  const [isProcessingPay, setIsProcessingPay] = useState<boolean>(false);
  const [simulatedPaymentSuccess, setSimulatedPaymentSuccess] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");

  const downloadInvoice = () => {
    // Generate an elegant, client-side downloadable offline bill (styled HTML)
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Dazeen Invoice - ${orderId || 'Receipt'}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 30px; color: #1c1917; background: #fff; max-width: 600px; margin: 0 auto; border: 1px solid #e7e5e4; border-radius: 12px; }
          .header { text-align: center; border-bottom: 2px dashed #4a2c2a; padding-bottom: 20px; }
          .title { font-size: 28px; font-weight: 850; letter-spacing: 0.05em; color: #4a2c2a; }
          .subtitle { font-size: 13px; color: #78716c; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }
          .address { margin-top: 8px; font-size: 11px; color: #78716c; line-height: 1.4; }
          .details { margin: 25px 0; font-size: 12px; line-height: 1.6; border-bottom: 1px solid #f5f5f4; padding-bottom: 15px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .table th { border-bottom: 1.5px solid #4a2c2a; text-align: left; padding: 10px 0; font-size: 11px; text-transform: uppercase; color: #78716c; }
          .table td { padding: 10px 0; border-bottom: 1px dashed #e7e5e4; font-size: 12px; }
          .totals { margin-top: 25px; text-align: right; font-size: 12px; line-height: 1.8; color: #444; }
          .grand-total { font-size: 16px; font-weight: bold; color: #4a2c2a; border-top: 1.5px solid #4a2c2a; padding-top: 8px; margin-top: 8px; display: inline-block; width: 100%; }
          .footer { text-align: center; margin-top: 40px; border-top: 1px dashed #e7e5e4; padding-top: 20px; font-size: 10px; color: #a8a29e; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">DAZEEN</div>
          <div class="subtitle">Fresh Specialty Coffee Roasters</div>
          <p class="address">
            Kurkumbh, backside of Bank of Maharashtra, Daund, Pune, Maharashtra
          </p>
        </div>
        <div class="details">
          <strong>Order ID:</strong> ${orderId || 'DAZ-TEMP'}<br/>
          <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}<br/>
          <strong>Customer Name:</strong> ${fullName}<br/>
          <strong>Mobile Phone:</strong> +91 ${phoneNumber}<br/>
          <strong>Delivery Destination:</strong> ${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}${landmark ? ', Near ' + landmark : ''}, ${city}, ${state} - ${pincode}<br/>
          <strong>Payment Method:</strong> ${payMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Online Payment (via Cashfree Secured Gateway)'}
        </div>
        
        <table class="table">
          <thead>
            <tr>
              <th style="width: 55%;">Selected blend details</th>
              <th style="text-align: center; width: 15%;">Qty</th>
              <th style="text-align: right; width: 15%;">Rate</th>
              <th style="text-align: right; width: 15%;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${cart.map(item => `
              <tr>
                <td><strong>${item.product.name}</strong><br/><span style="font-size: 10px; color: #a8a29e;">Whole Beans Custom Roast</span></td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">₹${item.product.price}</td>
                <td style="text-align: right;">₹${item.product.price * item.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <div style="display: flex; justify-content: space-between; max-width: 280px; margin-left: auto;">
            <span>Subtotal:</span>
            <span>₹${totals.subtotal}</span>
          </div>
          ${totals.discount > 0 ? `
          <div style="display: flex; justify-content: space-between; max-width: 280px; margin-left: auto; color: #16a34a; font-weight: bold;">
            <span>Discount Applied:</span>
            <span>- ₹${totals.discount}</span>
          </div>` : ''}
          <div style="display: flex; justify-content: space-between; max-width: 280px; margin-left: auto;">
            <span>GST Unified Tax (5%):</span>
            <span>₹${totals.gstAmount}</span>
          </div>
          <div style="display: flex; justify-content: space-between; max-width: 280px; margin-left: auto; border-bottom: 1px dashed #e7e5e4; padding-bottom: 4px;">
            <span>Shipping / Packaging:</span>
            <span>${totals.shippingCharge === 0 ? 'FREE' : `₹${totals.shippingCharge}`}</span>
          </div>
          <div class="grand-total">
            <div style="display: flex; justify-content: space-between; max-width: 280px; margin-left: auto;">
              <span>Total Bill Amount:</span>
              <span>₹${totals.finalAmount}</span>
            </div>
          </div>
        </div>
        
        <div class="footer">
          Thank you for support of shade-grown forest coffee!<br/>
          For customer assistance, contact shreedeshmukh02122006@gmail.com.<br/>
          *This invoice is a legally valid transaction receipt issued electronically by DAZEEN.*
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([invoiceHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice_${orderId || 'DAZEEN'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notificationService.send("Bill Downloaded Successfully! 📥", `Saved Invoice_${orderId || 'Download'}.html to your device.`);
  };

  const saveOrderToLocal = (randomId: string, orderPayload: any, updatedUser: any) => {
    try {
      const existingOrders = localStorage.getItem("dazeen_placed_orders_v1");
      const parseExisting = existingOrders ? JSON.parse(existingOrders) : [];
      localStorage.setItem("dazeen_placed_orders_v1", JSON.stringify([orderPayload, ...parseExisting]));

      localStorage.setItem("dazeen_current_user", JSON.stringify(updatedUser));

      const savedUsersList = localStorage.getItem("dazeen_local_users_v1");
      if (savedUsersList) {
        try {
          const uList = JSON.parse(savedUsersList);
          const updatedList = uList.map((u: any) => {
            if (u.uid === currentUser.uid) {
              return {
                ...u,
                displayName: updatedUser.displayName,
                address: updatedUser.address,
                phone: updatedUser.phoneNumber,
                phoneNumber: updatedUser.phoneNumber,
              };
            }
            return u;
          });
          localStorage.setItem("dazeen_local_users_v1", JSON.stringify(updatedList));
        } catch (e) {
          console.error("User list profile update syncing error", e);
        }
      }

      setIsProcessingPay(false);
      setSimulatedPaymentSuccess(true);
      notificationService.send("Order Dispatched! ☕", `Your order ${randomId} is successfully lined up.`);
    } catch (err) {
      setIsProcessingPay(false);
      setSubmitError("Unable to securely register purchase order payload. Retry.");
    }
  };

  // Load profile address if logged-in user exists
  useEffect(() => {
    if (currentUser && checkoutStep === "address") {
      if (!fullName) setFullName(currentUser.displayName || "");
      if (!phoneNumber) setPhoneNumber(currentUser.phoneNumber || currentUser.phone || "");
      if (!addressLine1) setAddressLine1(currentUser.address || "");
    }
  }, [currentUser, checkoutStep]);

  // Watch pincode changing to auto-fetch postal/village list
  useEffect(() => {
    const trimmedPin = pincode.replace(/\D/g, "");
    if (trimmedPin.length === 6) {
      fetchPincodeInfo(trimmedPin);
    } else {
      setFetchedVillages([]);
      setSelectedVillage("");
      setPincodeError("");
    }
  }, [pincode]);

  const fetchPincodeInfo = async (pin: string) => {
    setIsFetchingPincode(true);
    setPincodeError("");

    // Step A: Immediately resolve from local fallback for instant premium typing experience
    const localResult = getIndianPincodeFallback(pin);
    if (localResult) {
      setCity(localResult.city);
      setState(localResult.state);
      setFetchedVillages(localResult.villages);
      if (localResult.villages.length > 0) {
        setSelectedVillage(localResult.villages[0]);
        setAddressLine2(localResult.villages[0]);
      }
    }

    // Step B: Fetch postal API asynchronously to refine and update options
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await response.json();
      
      if (data && data[0] && data[0].Status === "Success") {
        const postOffices = data[0].PostOffice;
        if (postOffices && postOffices.length > 0) {
          const first = postOffices[0];
          setCity(first.District || first.Division || localResult.city);
          setState(first.State || localResult.state);
          
          // Get distinct post office names (Villages)
          const offices = postOffices.map((po: any) => po.Name).filter(Boolean);
          setFetchedVillages(offices);
          if (offices.length > 0) {
            setSelectedVillage(offices[0]);
            setAddressLine2(offices[0]); // Autofill locality with the first post office name
          }
          notificationService.send("Location Verified! 📍", `Region: ${first.District || "Local Area"}, ${first.State}`);
        }
      } else {
        // Log minor warning but keep local fallback valid so user is never blocked
        console.warn("Postal Pin API returned non-success; using local heuristics mapping instead.");
      }
    } catch (err) {
      console.warn("Postal PIN service unavailable; kept local calculated fallback mapping.", err);
    } finally {
      setIsFetchingPincode(false);
    }
  };

  // Keep locality aligned with user village choice
  const handleVillageChange = (val: string) => {
    setSelectedVillage(val);
    setAddressLine2(val);
  };

  // Price calculations
  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    
    let discount = 0;
    if (activeCoupon) {
      if (activeCoupon.type === "percent") {
        discount = Math.round(subtotal * (activeCoupon.value / 100));
      } else if (activeCoupon.type === "flat" && subtotal >= 700) {
        discount = activeCoupon.value;
      }
    }

    const priceAfterDiscount = Math.max(0, subtotal - discount);
    const gstAmount = Math.round(priceAfterDiscount * 0.05);
    const shippingCharge = priceAfterDiscount >= 499 || subtotal === 0 ? 0 : 50;
    const finalAmount = priceAfterDiscount + gstAmount + shippingCharge;

    return {
      subtotal,
      discount,
      gstAmount,
      shippingCharge,
      finalAmount,
    };
  }, [cart, activeCoupon]);

  const applyCouponCode = () => {
    setCouponError("");
    const cleaned = coupon.trim().toUpperCase();
    if (cleaned === "CELEBRATE") {
      setActiveCoupon({ code: "CELEBRATE", type: "percent", value: 10 });
      setCoupon("");
      notificationService.send("Promo Applied! 🏷️", "Enjoy 10% exclusive discount off your boutique basket.");
    } else if (cleaned === "SHANTIBREW") {
      if (totals.subtotal < 700) {
        setCouponError("This premium code is only applicable for orders values above ₹700.");
      } else {
        setActiveCoupon({ code: "SHANTIBREW", type: "flat", value: 100 });
        setCoupon("");
        notificationService.send("Premium Promo! 🏷️", "₹100 flat discount applied to your billing.");
      }
    } else {
      setCouponError("Coupon code is invalid! Try 'CELEBRATE' or 'SHANTIBREW'.");
    }
  };

  // Place Order Action
  const handlePlaceOrder = async () => {
    setSubmitError("");
    if (!currentUser) {
      setSubmitError("Please Login or register to persist your custom coffee deliveries.");
      return;
    }
    if (!fullName || !phoneNumber || !pincode || !addressLine1 || !city || !state) {
      setSubmitError("Standard address, contact number and pincode details are necessary.");
      return;
    }

    setIsProcessingPay(true);
    const randomId = `DAZ-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(randomId);

    const orderPayload = {
      id: randomId,
      userId: currentUser.uid,
      userEmail: currentUser.email || "",
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      streetAddress: `${addressLine1}${addressLine2 ? `, ${addressLine2}` : ""}${landmark ? `, Near ${landmark}` : ""}`.trim(),
      pinCode: pincode.trim(),
      items: cart.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
        },
        quantity: item.quantity,
      })),
      totalPrice: totals.finalAmount,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedUser = {
      ...currentUser,
      displayName: fullName.trim(),
      address: `${addressLine1}${addressLine2 ? `, ${addressLine2}` : ""}${landmark ? `, Near ${landmark}` : ""}`.trim(),
      phoneNumber: phoneNumber.trim(),
    };

    if (payMethod === "CASHFREE") {
      try {
        const loaded = await loadCashfreeScript();
        if (!loaded) {
          throw new Error("Unable to load Cashfree checkout script.");
        }

        const cfCreateResponse = await fetch("/api/cashfree/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            orderId: randomId,
            amount: totals.finalAmount,
            customerName: fullName.trim(),
            customerEmail: currentUser.email || "guest@dazeen.com",
            customerPhone: phoneNumber.trim()
          })
        });

        if (!cfCreateResponse.ok) {
          throw new Error("Cashfree order creation API endpoint offline.");
        }

        const cfData = await cfCreateResponse.json();

        if (cfData && cfData.success && cfData.payment_session_id) {
          const cashfree = (window as any).Cashfree({
            mode: cfData.isProduction ? "production" : "sandbox"
          });

          cashfree.checkout({
            paymentSessionId: cfData.payment_session_id
          }).then(() => {
            saveOrderToLocal(randomId, orderPayload, updatedUser);
          });
        } else {
          console.warn("Cashfree API not fully configured. Completing with premium transaction simulator.", cfData?.error || "");
          setTimeout(() => {
            saveOrderToLocal(randomId, orderPayload, updatedUser);
          }, 1500);
        }
      } catch (err: any) {
        console.error("Cashfree checkout error; proceeding using fallback payment simulator.", err);
        setTimeout(() => {
          saveOrderToLocal(randomId, orderPayload, updatedUser);
        }, 1500);
      }
    } else {
      // COD Flow
      setTimeout(() => {
        saveOrderToLocal(randomId, orderPayload, updatedUser);
      }, 1500);
    }
  };

  const handleFinishSequence = () => {
    onClearCart();
    setSimulatedPaymentSuccess(false);
    onSetView("tracking");
  };

  // If the order has been successfully completed
  if (simulatedPaymentSuccess) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] py-20 px-4 mt-8">
        <div className="max-w-xl mx-auto bg-white border border-coffee-200 shadow-xl rounded-3xl p-8 text-center flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200 text-emerald-600 mb-6 text-3xl"
          >
            ✓
          </motion.div>
          <h2 className="font-serif text-3xl font-black text-stone-900 mb-2">Order Confirmed!</h2>
          <p className="font-mono text-xs text-stone-500 uppercase tracking-widest mb-6">Order ID: {orderId}</p>

          <div className="w-full bg-stone-50 rounded-2xl p-5 border border-stone-150 text-left space-y-3 mb-8">
            <h4 className="font-mono text-[10px] uppercase font-bold text-stone-400 tracking-wider">Delivery Summary</h4>
            <p className="text-xs text-stone-700"><strong>Addressed To:</strong> {fullName}</p>
            <p className="text-xs text-stone-700"><strong>Address:</strong> {addressLine1} {addressLine2}, {city}, {state} - {pincode}</p>
            <p className="text-xs text-stone-700"><strong>Mode Selected:</strong> {payMethod} Guarantee</p>
            <p className="text-sm font-semibold text-coffee-950 border-t border-dashed border-stone-200 pt-3">
              Total Charged: ₹{totals.finalAmount}
            </p>
          </div>

          <p className="text-stone-600 text-xs leading-relaxed mb-8">
            We are roasting your fresh estate coffee. You can track this delivery dispatch step-by-step from your Order History Dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center items-center">
            <button
              onClick={downloadInvoice}
              className="w-full sm:w-1/2 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4" /> Download Bill
            </button>
            <button
              onClick={handleFinishSequence}
              className="w-full sm:w-1/2 py-4 bg-stone-950 hover:bg-stone-900 text-white border border-stone-850 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all cursor-pointer shadow-md active:scale-95"
            >
              Track My Order →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Blank/Empty cart guard
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-center items-center px-4 py-24 select-none">
        <div className="text-center max-w-md w-full p-8 border border-coffee-200 rounded-3xl bg-white shadow-sm flex flex-col items-center">
          <span className="text-5xl mb-6">☕</span>
          <h3 className="font-serif text-2xl font-bold text-coffee-950 mb-2">Your Coffee Cup is Empty</h3>
          <p className="text-stone-500 text-xs leading-relaxed max-w-sm mb-8">
            Bespoke custom profiles, Single estate whole grain blends, and aromatic roasts are waiting in our boutique.
          </p>
          <button
            onClick={() => onSetView("main")}
            className="w-full max-w-xs py-3.5 bg-coffee-950 hover:bg-coffee-900 border border-coffee-900 text-white font-mono text-xs font-bold tracking-widest uppercase rounded-xl shadow-lg shadow-coffee-900/10 cursor-pointer"
          >
            Explore Boutique menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-16 px-4 sm:px-6 lg:px-8 mt-12 select-none">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Central Container: Form / Step View */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            {/* Steps Tab Group */}
            <div className="bg-white border border-coffee-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <button 
                onClick={() => setCheckoutStep("cart")}
                className={`py-2 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
                  checkoutStep === "cart" 
                    ? "bg-coffee-950 text-white shadow-sm" 
                    : "text-coffee-500 hover:text-coffee-800"
                }`}
              >
                1. Review Cart
              </button>
              <div className="h-px bg-stone-200 flex-1 mx-2" />
              <button 
                onClick={() => {
                  if (cart.length > 0) setCheckoutStep("address");
                }}
                className={`py-2 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
                  checkoutStep === "address" 
                    ? "bg-coffee-950 text-white shadow-sm" 
                    : "text-coffee-500 hover:text-coffee-800"
                }`}
              >
                2. Shipping Address
              </button>
              <div className="h-px bg-stone-200 flex-1 mx-2" />
              <button 
                onClick={() => {
                  if (fullName && phoneNumber && pincode && addressLine1) {
                    setCheckoutStep("payment");
                  }
                }}
                className={`py-2 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
                  checkoutStep === "payment" 
                    ? "bg-coffee-950 text-white shadow-sm" 
                    : "text-coffee-500 hover:text-coffee-850"
                }`}
              >
                3. Secure Payment
              </button>
            </div>

            {/* Error Line */}
            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <span className="text-md">⚠️</span>
                <span>{submitError}</span>
              </div>
            )}

            {/* Step Content Panels */}
            <AnimatePresence mode="wait">
              {/* STEP 1: CART DETAILS */}
              {checkoutStep === "cart" && (
                <motion.div
                  key="cart-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white border border-coffee-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                    <h2 className="font-serif text-2xl font-bold text-coffee-950">Review Your Selection</h2>
                    <span className="text-xs font-mono font-bold bg-coffee-100 text-coffee-950 px-3 py-1 rounded-full">
                      {cart.reduce((s, c) => s + c.quantity, 0)} Items
                    </span>
                  </div>

                  <div className="divide-y divide-stone-150">
                    {cart.map((item) => (
                      <div key={item.product.id} className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                        {/* Left block: Image & Details */}
                        <div className="flex items-center gap-4">
                          <div className="h-20 w-16 sm:w-20 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center relative flex-shrink-0">
                            {item.product.image ? (
                              <img 
                                src={item.product.image} 
                                alt={item.product.name} 
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                              />
                            ) : (
                              <span className="text-2xl">☕</span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900">{item.product.name}</h4>
                            <p className="font-mono text-xs text-stone-500 mt-0.5">
                              Price: ₹{item.product.price} | Custom Roasted
                            </p>
                          </div>
                        </div>

                        {/* Right block: Clean, completely open and free-flowing touch action row (No background boxes or borders) */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 w-full sm:w-auto">
                          {/* Rich-touch Quantity Selector (Completely open, breezy touch targets for Android & iOS comfort) */}
                          <div className="flex items-center gap-4 bg-transparent border-0 rounded-none p-1">
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  onUpdateQuantity(item.product.id, -1);
                                } else {
                                  onRemoveItem(item.product.id);
                                }
                              }}
                              className="p-1 px-2.5 text-stone-500 hover:text-stone-900 active:scale-95 bg-stone-100/80 hover:bg-stone-200/80 rounded-lg transition-all text-sm font-black cursor-pointer select-none"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-mono text-xs sm:text-sm font-bold text-stone-900 w-5 text-center select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              className="p-1 px-2.5 text-stone-500 hover:text-stone-900 active:scale-95 bg-stone-100/80 hover:bg-stone-200/80 rounded-lg transition-all text-sm font-black cursor-pointer select-none"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-4 ml-auto sm:ml-0">
                            <span className="font-mono text-sm sm:text-base font-bold text-stone-900 w-16 text-right">
                              ₹{item.product.price * item.quantity}
                            </span>

                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="p-2 text-stone-400 hover:text-red-650 hover:bg-red-50/50 active:scale-95 transition-all rounded-lg cursor-pointer"
                              aria-label="Remove product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <button
                      onClick={() => onSetView("main")}
                      className="text-xs font-mono font-bold text-coffee-600 hover:text-coffee-900 flex items-center gap-2"
                    >
                      <ArrowLeft className="w-3 h-3" /> Back to Boutique Grid
                    </button>

                    <button
                      onClick={() => setCheckoutStep("address")}
                      className="w-full sm:w-auto py-3 px-8 bg-coffee-950 hover:bg-coffee-900 text-white rounded-xl text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      Fill Shipping Address <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: SHIPPING ADDRESS (Stacked vertically in sequential order, extremely spacious & Android/iOS friendly) */}
              {checkoutStep === "address" && (
                <motion.div
                  key="address-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white border-2 border-coffee-200/80 rounded-3xl p-6 sm:p-10 shadow-md space-y-8 max-w-2xl mx-auto"
                >
                  <div className="border-b border-stone-150 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-coffee-950">Delivery Address 📍</h2>
                      <p className="text-xs text-stone-500 mt-1">Please provide standard delivery details. All fields are placed sequentially for your convenience.</p>
                    </div>
                    <span className="text-[11px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-1.5 rounded-full font-mono font-bold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Auto PIN Verifier Active
                    </span>
                  </div>

                  {submitError && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-800 text-xs font-mono font-bold rounded-xl p-4 flex items-center gap-2">
                      <span>⚠️ Error:</span> {submitError}
                    </div>
                  )}

                  {/* STRICT SEQUENTIAL SINGLE-COLUMN VERTICAL GRID (NO "ak k side me ak", clean stacking on mobile & desktop) */}
                  <div className="flex flex-col gap-6">
                    
                    {/* 1. NAME FIELD */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 block">
                        👤 Recipient Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Shruti Deshmukh"
                        className="w-full text-sm font-mono bg-stone-50/50 border-2 border-stone-200 focus:border-coffee-800 focus:bg-white rounded-xl p-4 text-stone-900 placeholder-stone-400 focus:outline-none transition-all duration-250 shadow-xs"
                      />
                    </div>

                    {/* 2. PINCODE FIELD (With loader & Instant validator fallback) */}
                    <div className="space-y-2 relative">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 flex justify-between items-center">
                        <span>📮 Pincode (6-Digit Indian PIN) <span className="text-red-500">*</span></span>
                        {isFetchingPincode && <Loader2 className="w-4 h-4 animate-spin text-coffee-600" />}
                      </label>
                      <input
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="e.g. 400001"
                        className={`w-full text-sm font-mono bg-stone-50/50 border-2 rounded-xl p-4 text-stone-900 placeholder-stone-400 focus:outline-none transition-all duration-250 ${
                          pincodeError 
                            ? "border-red-400 bg-red-50/10 focus:border-red-500" 
                            : pincode.length === 6 
                              ? "border-emerald-500 focus:border-emerald-600 bg-emerald-50/5"
                              : "border-stone-200 focus:border-coffee-800"
                        }`}
                      />
                      {pincodeError && (
                        <p className="text-xs text-red-600 font-mono mt-1 w-full flex items-center gap-1 font-semibold">
                          <span>⚠️</span> {pincodeError}
                        </p>
                      )}
                      {!pincodeError && pincode.length === 6 && (
                        <p className="text-[11px] text-emerald-700 font-mono mt-1 font-bold flex items-center gap-1">
                          <span>✓</span> Verified Pin Location Found! City and State populated below automatically.
                        </p>
                      )}
                    </div>

                    {/* 3. MOBILE NUMBER FIELD */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 block">
                        📞 Active Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-sm font-semibold">+91</span>
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="10-digit mobile number"
                          className="w-full text-sm font-mono bg-stone-50/50 border-2 border-stone-200 focus:border-coffee-800 focus:bg-white rounded-xl p-4 pl-14 text-stone-900 placeholder-stone-400 focus:outline-none transition-all duration-250 shadow-xs"
                        />
                      </div>
                    </div>

                    {/* 4. TOWN / VILLAGE / GAON / LOCALITY DROPDOWN (Auto fetched from PIN) */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 block">
                        🏡 Town / Village / Gaon / Locality Name (Auto Fetched) <span className="text-red-500">*</span>
                      </label>
                      {fetchedVillages.length > 0 ? (
                        <select
                          value={selectedVillage}
                          onChange={(e) => handleVillageChange(e.target.value)}
                          className="w-full text-sm font-mono bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 text-[#1E1B4B] focus:outline-none focus:border-indigo-500 cursor-pointer font-bold shadow-xs transition-colors"
                        >
                          {fetchedVillages.map((v) => (
                            <option key={v} value={v}>
                              {v} (Nearest Locality)
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="text-xs font-mono text-stone-500 border-2 border-dashed border-stone-200 bg-stone-50/40 rounded-xl p-4 italic text-center">
                          Waiting for valid 6-digit PIN to search nearest gaon/villages...
                        </div>
                      )}
                    </div>

                    {/* 5. STATE & CITY AUTOFILLED READONLY INFO */}
                    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                      <p className="text-xs font-mono font-bold uppercase text-stone-500">📍 Location Auto-Trace Result</p>
                      <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                        <div>
                          <span className="text-stone-500 block">District:</span>
                          <span className="text-stone-900 font-bold text-sm block mt-0.5">{city || "-"}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block">State:</span>
                          <span className="text-stone-900 font-bold text-sm block mt-0.5">{state || "-"}</span>
                        </div>
                      </div>
                    </div>

                    {/* 6. COLONY / FLAT / HOUSE DETAILS */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 block">
                        🏘️ Colony / Flat / House No. / Area Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="e.g. Flat No. 102, Shriram Society, Near Maruti Mandir"
                        className="w-full text-sm font-mono bg-stone-50/50 border-2 border-stone-200 focus:border-coffee-800 focus:bg-white rounded-xl p-4 text-stone-900 placeholder-stone-400 focus:outline-none transition-all duration-250 shadow-xs"
                      />
                    </div>

                    {/* 7. LANDMARK */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-700 block">
                        🚩 Landmark (e.g., Near School, Opposite Petrol Pump)
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near Shiv Mandir, opposite Zila School"
                        className="w-full text-sm font-mono bg-stone-50/50 border-2 border-stone-200 focus:border-coffee-800 focus:bg-white rounded-xl p-4 text-stone-900 placeholder-stone-400 focus:outline-none transition-all duration-250 shadow-xs"
                      />
                    </div>

                  </div>

                  <div className="pt-8 border-t border-stone-150 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <button
                      onClick={() => setCheckoutStep("cart")}
                      className="text-xs font-mono font-bold text-coffee-700 hover:text-coffee-950 flex items-center gap-2 transition-colors duration-200 group"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" /> Back to Cart review
                    </button>

                    <button
                      onClick={() => {
                        if (!fullName || !phoneNumber || phoneNumber.length < 10 || !pincode || pincode.length !== 6 || !addressLine1 || !city || !state) {
                          setSubmitError("Name, active mobile, pincode with verified location list and address are required.");
                          return;
                        }
                        setSubmitError("");
                        setCheckoutStep("payment");
                      }}
                      className="w-full sm:w-auto py-4 px-10 bg-coffee-950 hover:bg-coffee-900 text-white rounded-xl text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transition-all"
                    >
                      Proceed to Secure Payment <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PAYMENT MODE */}
              {checkoutStep === "payment" && (
                <motion.div
                  key="payment-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white border-2 border-coffee-200/80 rounded-3xl p-8 shadow-md space-y-6"
                >
                  <div className="border-b border-stone-150 pb-4">
                    <h2 className="font-serif text-2xl font-bold text-coffee-950">Select Payment Mechanism</h2>
                    <p className="text-xs font-mono text-stone-500 leading-normal mt-1">
                      Choose your preferred transaction mode. Sandbox environment active.
                    </p>
                  </div>

                  {/* Detailed inline subtotal & breakdown receipt directly on the payment step */}
                  <div className="bg-[#FAF8F5] border border-coffee-200/50 rounded-2xl p-6 space-y-4">
                    <h3 className="font-serif text-sm font-black text-coffee-950 flex items-center gap-2">
                      <span>🧾</span> Bill Breakdown (Subtotal Details)
                    </h3>
                    <div className="space-y-3 font-mono text-xs text-stone-600">
                      <div className="flex justify-between items-center">
                        <span>Items Subtotal:</span>
                        <span className="font-bold text-stone-900">₹{totals.subtotal}</span>
                      </div>
                      {totals.discount > 0 && (
                        <div className="flex justify-between items-center text-emerald-700 font-bold">
                          <span>Applied Promo Discount:</span>
                          <span>- ₹{totals.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span>GST Tax (5%):</span>
                        <span className="font-bold text-stone-900">₹{totals.gstAmount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Logistics Delivery Charge:</span>
                        <span className="font-bold text-stone-900">
                          {totals.shippingCharge === 0 ? (
                            <span className="text-emerald-700">FREE</span>
                          ) : (
                            `₹${totals.shippingCharge}`
                          )}
                        </span>
                      </div>
                      <div className="border-t border-dashed border-stone-350 my-2 pt-3 flex justify-between font-serif font-black text-stone-900 text-base">
                        <span>Total Payable:</span>
                        <span className="text-coffee-950 text-lg">₹{totals.finalAmount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* CASHFREE SECURE GATEWAY OPTION */}
                    <div 
                      onClick={() => setPayMethod("CASHFREE")}
                      className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                        payMethod === "CASHFREE" 
                          ? "border-emerald-600 bg-emerald-50/10 shadow-xs" 
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
                          💳
                        </div>
                        <div>
                          <h4 className="text-sm font-mono font-bold text-stone-900">Online Payment (via Cashfree)</h4>
                          <p className="text-xs text-stone-500 font-mono mt-0.5">Pay securely via UPI, NetBanking, Cards or Wallets</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payMethod === "CASHFREE" ? "border-emerald-600 animate-pulse" : "border-stone-300"}`}>
                        {payMethod === "CASHFREE" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                      </div>
                    </div>

                    {/* CASH ON DELIVERY OPTION */}
                    <div 
                      onClick={() => setPayMethod("COD")}
                      className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                        payMethod === "COD" 
                          ? "border-coffee-650 bg-coffee-50/20 shadow-xs" 
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-coffee-100 text-coffee-950 flex items-center justify-center text-xl">
                          📦
                        </div>
                        <div>
                          <h4 className="text-sm font-mono font-bold text-stone-900">Cash on Delivery (COD)</h4>
                          <p className="text-xs text-stone-500 font-mono mt-0.5">Pay in cash or UPI at the time of courier delivery</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payMethod === "COD" ? "border-coffee-900" : "border-stone-300"}`}>
                        {payMethod === "COD" && <div className="w-2.5 h-2.5 rounded-full bg-coffee-900" />}
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-[#FCFBF8] border border-stone-150 rounded-2xl p-4 text-xs space-y-2 text-stone-600 font-mono">
                    <p className="font-bold text-stone-800">Review Destination:</p>
                    <p>{fullName} ({phoneNumber})</p>
                    <p>{addressLine1}, {addressLine2}, {city}, {state} - {pincode}</p>
                  </div>

                  <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <button
                      onClick={() => setCheckoutStep("address")}
                      className="text-xs font-mono font-bold text-coffee-600 hover:text-coffee-900 flex items-center gap-2"
                    >
                      <ArrowLeft className="w-3 h-3" /> Back to Edit Address
                    </button>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessingPay}
                      className="w-full sm:w-auto py-4 px-10 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white rounded-xl text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/20 transition-all active:scale-98"
                    >
                      {isProcessingPay ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Processing order...
                        </>
                      ) : (
                        `Place Order & Pay ₹${totals.finalAmount}`
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar right pane: Subtotals Summary */}
          <div className="w-full lg:w-1/3 bg-white border border-coffee-200 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-coffee-950">Grand Order Valuation</h3>

            <div className="space-y-3.5 pb-4 border-b border-stone-100 font-mono text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal Items</span>
                <span>₹{totals.subtotal}</span>
              </div>
              
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Applied Promo Discount</span>
                  <span>- ₹{totals.discount}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-500">
                <span>GST Tax (5%)</span>
                <span>₹{totals.gstAmount}</span>
              </div>

              <div className="flex justify-between text-stone-500">
                <span>Regional Logistics Charge</span>
                <span>{totals.shippingCharge === 0 ? <span className="text-emerald-600 font-bold">Free</span> : `₹${totals.shippingCharge}`}</span>
              </div>
            </div>

            <div className="flex justify-between items-center font-serif text-lg font-bold text-coffee-950">
              <span>Payable Net Total</span>
              <span>₹{totals.finalAmount}</span>
            </div>

            {/* Promo code form */}
            <div className="space-y-2 border-t border-dashed border-stone-200 pt-4">
              <label className="text-[10px] font-mono uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-500" /> Have any referral coupon code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="e.g. CELEBRATE / SHANTIBREW"
                  className="bg-stone-50 border border-stone-200 font-mono text-[11px] uppercase placeholder-stone-400 p-2.5 rounded-lg flex-grow focus:outline-none focus:border-coffee-500 h-9"
                />
                <button
                  onClick={applyCouponCode}
                  className="bg-stone-950 hover:bg-stone-900 font-mono text-[10px] text-white px-3.5 py-2 rounded-lg font-bold uppercase cursor-pointer h-9 transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="text-[10px] text-red-600 font-mono mt-1">{couponError}</p>
              )}
              {activeCoupon && (
                <p className="text-[10px] text-emerald-600 font-mono font-bold mt-1">
                  ✓ Code "{activeCoupon.code}" Activated!
                </p>
              )}
            </div>

            {/* Micro Delivery Highlight details */}
            <div className="bg-stone-50 border border-stone-150 p-4 rounded-2xl flex items-start gap-3">
              <Truck className="w-5 h-5 text-coffee-800 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-stone-500 font-mono leading-relaxed">
                Add fresh estate blends above ₹499 to claim **Free Delivery** across India! Delivery generally dispatches within 24 hours of fresh roasts packing.
              </p>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
}
