import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trash2, Plus, Minus, Ticket, CreditCard, Sparkles, 
  MapPin, Truck, Check, ChevronLeft, ChevronRight, AlertCircle, ShoppingBag, Landmark, Home, Briefcase
} from "lucide-react";
import { CartItem } from "../types";
import { notificationService } from "../utils/notifications";
import CheckoutForm from "./ui/checkout-form";
import { RadioGroup3D } from "./ui/3d-radio-group";

declare global {
  interface Window {
    Cashfree?: any;
  }
}

interface CartPageProps {
  cart: CartItem[];
  currentUser: any;
  onOpenLogin: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onSetView: (v: "main" | "login" | "tracking" | "admin" | "cart") => void;
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

  // Checkout sequence wizard state
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "address" | "payment">("cart");
  const [fetchedVillages, setFetchedVillages] = useState<string[]>([]);
  const [isFetchingPincode, setIsFetchingPincode] = useState<boolean>(false);

  // Flipkart & Amazon style Delivery address fields
  const [fullName, setFullName] = useState<string>(currentUser?.displayName || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(currentUser?.phoneNumber || "");
  const [pincode, setPincode] = useState<string>("");
  const [addressLine1, setAddressLine1] = useState<string>(""); // Flat, House no., Building, Company, Apartment
  const [addressLine2, setAddressLine2] = useState<string>(""); // Area, Colony, Street, Sector, Village
  const [landmark, setLandmark] = useState<string>(""); // Optional
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [addressType, setAddressType] = useState<"Home" | "Work">("Home");

  // Error validations
  const [submitError, setSubmitError] = useState<string>("");

  // Cashfree PG loading & flow state
  const [isProcessingPay, setIsProcessingPay] = useState<boolean>(false);
  const [cashfreeError, setCashfreeError] = useState<string>("");
  const [showSimulatedGateway, setShowSimulatedGateway] = useState<boolean>(false);
  const [simulatedCardNo, setSimulatedCardNo] = useState<string>("");
  const [simulatedExpiry, setSimulatedExpiry] = useState<string>("");
  const [simulatedCvv, setSimulatedCvv] = useState<string>("");
  const [simulatedPaymentSuccess, setSimulatedPaymentSuccess] = useState<boolean>(false);
  const [placedOrderId, setPlacedOrderId] = useState<string>("");
  const [simulatedGatewayError, setSimulatedGatewayError] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");

  // Pre-fill fields if user exists
  useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.displayName || "");
      if (!phoneNumber) setPhoneNumber(currentUser.phoneNumber || currentUser.phone || "");
    }
  }, [currentUser]);

  // Load Cashfree SDK dynamically
  useEffect(() => {
    if (!window.Cashfree) {
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Price Calculation with exactly 5% GST
  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    
    // Coupon Discount
    let discount = 0;
    if (activeCoupon) {
      if (activeCoupon.type === "percent") {
        discount = Math.round(subtotal * (activeCoupon.value / 100));
      } else if (activeCoupon.type === "flat" && subtotal > 700) {
        discount = activeCoupon.value;
      }
    }

    const priceAfterDiscount = Math.max(0, subtotal - discount);
    
    // Exactly 5% GST (niche price 5% gst k sath)
    const gstAmount = Math.round(priceAfterDiscount * 0.05);

    // Shipping charges (Free delivery above ₹499 post-discount, else ₹50)
    const shippingCharge = priceAfterDiscount > 499 || subtotal === 0 ? 0 : 50;

    const finalAmount = priceAfterDiscount + gstAmount + shippingCharge;

    return {
      subtotal,
      discount,
      priceAfterDiscount,
      gstAmount,
      shippingCharge,
      finalAmount,
    };
  }, [cart, activeCoupon]);

  // Handle coupon application
  const handleApplyCoupon = () => {
    setCouponError("");
    const codeCleaned = coupon.trim().toUpperCase();
    if (codeCleaned === "CELEBRATE") {
      setActiveCoupon({ code: "CELEBRATE", type: "percent", value: 10 });
      setCoupon("");
    } else if (codeCleaned === "SHANTIBREW") {
      if (totals.subtotal < 700) {
        setCouponError("This coupon is only applicable for orders values above ₹700.");
      } else {
        setActiveCoupon({ code: "SHANTIBREW", type: "flat", value: 100 });
        setCoupon("");
      }
    } else if (codeCleaned) {
      setCouponError("Invalid coupon code! Try 'CELEBRATE' or 'SHANTIBREW'.");
    }
  };

  // Quick State/City Autopopulate on Pincode (Indian standard search - dynamically fetches real town/gaw/state)
  useEffect(() => {
    let active = true;
    if (pincode.length === 6) {
      setIsFetchingPincode(true);
      setSubmitError("");
      fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then((res) => res.json())
        .then((data) => {
          if (!active) return;
          if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice) {
            const offices = data[0].PostOffice;
            const stateVal = offices[0]?.State || "";
            // Use District or Taluk/Division for Town/City
            const districtVal = offices[0]?.District || offices[0]?.Taluk || "";
            
            setState(stateVal);
            setCity(districtVal);
            
            // Extract village/gaw names
            const villages = offices.map((post: any) => post.Name).filter(Boolean);
            setFetchedVillages(villages);
            if (villages.length > 0) {
              setAddressLine2(villages[0]);
            }
          } else {
            // Fallback for mock prefix when API doesn't find the pincode
            const pinPrefix = pincode.substring(0, 3);
            if (pinPrefix === "560" || pinPrefix === "561" || pinPrefix === "562") {
              setCity("Bengaluru");
              setState("Karnataka");
            } else if (pinPrefix === "577") {
              setCity("Chikmagalur");
              setState("Karnataka");
            } else if (pinPrefix === "400") {
              setCity("Mumbai");
              setState("Maharashtra");
            } else if (pinPrefix === "110") {
              setCity("New Delhi");
              setState("Delhi");
            } else if (pinPrefix === "600") {
              setCity("Chennai");
              setState("Tamil Nadu");
            } else if (pinPrefix === "700") {
              setCity("Kolkata");
              setState("West Bengal");
            } else if (pinPrefix === "500") {
              setCity("Hyderabad");
              setState("Telangana");
            } else if (pinPrefix === "411") {
              setCity("Pune");
              setState("Maharashtra");
            } else {
              setCity("");
              setState("");
            }
            setFetchedVillages([]);
          }
        })
        .catch((err) => {
          console.error("Pincode fetch failed, fallback applied:", err);
          setFetchedVillages([]);
        })
        .finally(() => {
          if (active) setIsFetchingPincode(false);
        });
    } else {
      setFetchedVillages([]);
    }
    return () => {
      active = false;
    };
  }, [pincode]);

  // Pay trigger via Cashfree Gateway
  const handlePayNow = async () => {
    setSubmitError("");
    setCashfreeError("");

    // Standard Address Validations
    if (!fullName) {
      setSubmitError("Please fill in the Full Name field.");
      document.getElementById("full_name")?.focus();
      return;
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      setSubmitError("Please enter a valid 10-digit mobile number.");
      document.getElementById("phone_number")?.focus();
      return;
    }
    if (!pincode || pincode.length !== 6) {
      setSubmitError("Please enter a valid 6-digit Indian Pincode.");
      document.getElementById("pincode")?.focus();
      return;
    }
    if (!addressLine1) {
      setSubmitError("Please fill in your Flat, House number or Building details.");
      document.getElementById("address_line1")?.focus();
      return;
    }
    if (!addressLine2) {
      setSubmitError("Please specify your Area, Colony or Street.");
      document.getElementById("address_line2")?.focus();
      return;
    }
    if (!city) {
      setSubmitError("Please enter your Town or City.");
      document.getElementById("city_field")?.focus();
      return;
    }
    if (!state) {
      setSubmitError("Please select/enter your State.");
      document.getElementById("state_field")?.focus();
      return;
    }

    if (!currentUser) {
      setSubmitError("Please sign up or login first to complete your transaction.");
      onOpenLogin();
      return;
    }

    setIsProcessingPay(true);
    const uniqueOrderId = `DAZ-${Math.floor(100000 + Math.random() * 900000)}`;
    setPlacedOrderId(uniqueOrderId);

    try {
      // Call our secure Express API endpoint
      const response = await fetch("/api/cashfree/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: uniqueOrderId,
          amount: totals.finalAmount,
          customerName: fullName,
          customerEmail: currentUser.email || `${phoneNumber}@dazeen.com`,
          customerPhone: phoneNumber,
        }),
      });

      const serverResult = await response.json();

      if (serverResult.success === true && window.Cashfree) {
        // Initialize real SDK and checkout
        try {
          const isProd = String(serverResult.order_status || "").length > 0;
          const cashfree = window.Cashfree({ mode: isProd ? "production" : "sandbox" });
          setIsProcessingPay(false);
          
          cashfree.checkout({
            paymentSessionId: serverResult.payment_session_id,
            returnUrl: `${window.location.origin}/?order_id=${uniqueOrderId}&payment_status=success`
          });
        } catch (sdkError: any) {
          console.error("SDK initialization crashed:", sdkError);
          setSubmitError(`Cashfree SDK Error: ${sdkError?.message || sdkError || "SDK initialization failed."}`);
          setIsProcessingPay(false);
        }
      } else {
        // Server rejected or keys failed - explicitly output the real error on screen for the developer/user!
        const errMsg = serverResult.error || "Failed to initiate Cashfree order. Verify credentials configured in environment variables.";
        setSubmitError(`Cashfree Payment Gateway Error: ${errMsg}`);
        setIsProcessingPay(false);
      }
    } catch (apiError: any) {
      console.warn("Express server connection issue during pay setup: ", apiError);
      setSubmitError(`Local API connection failed: ${apiError?.message || apiError}`);
      setIsProcessingPay(false);
    }
  };

  // Place COD Order directly
  const handlePlaceCodOrder = () => {
    setSubmitError("");
    setCashfreeError("");

    if (!fullName) {
      setSubmitError("Please fill in the Full Name field.");
      document.getElementById("full_name")?.focus();
      return;
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      setSubmitError("Please enter a valid 10-digit mobile number.");
      document.getElementById("phone_number")?.focus();
      return;
    }
    if (!pincode || pincode.length !== 6) {
      setSubmitError("Please enter a valid 6-digit Indian Pincode.");
      document.getElementById("pincode")?.focus();
      return;
    }
    if (!addressLine1) {
      setSubmitError("Please fill in your Flat, House number or Building details.");
      document.getElementById("address_line1")?.focus();
      return;
    }
    if (!addressLine2) {
      setSubmitError("Please specify your Area, Colony or Street.");
      document.getElementById("address_line2")?.focus();
      return;
    }
    if (!city) {
      setSubmitError("Please enter your Town or City.");
      document.getElementById("city_field")?.focus();
      return;
    }
    if (!state) {
      setSubmitError("Please select/enter your State.");
      document.getElementById("state_field")?.focus();
      return;
    }

    if (!currentUser) {
      setSubmitError("Please sign up or login first to complete your transaction.");
      onOpenLogin();
      return;
    }

    setIsProcessingPay(true);
    const uniqueOrderId = `DAZ-${Math.floor(100000 + Math.random() * 900000)}`;
    setPlacedOrderId(uniqueOrderId);

    setTimeout(() => {
      setIsProcessingPay(false);
      setSimulatedPaymentSuccess(true);

      const orderPayload = {
        id: uniqueOrderId,
        userId: currentUser?.uid || "guest_uid",
        userEmail: currentUser?.email || "guest@dazeen.com",
        fullName,
        phoneNumber,
        pincode,
        landmark,
        addressLine1,
        addressLine2,
        city,
        state,
        addressType,
        items: cart,
        totals,
        paymentStatus: "cash_on_delivery",
        paymentMethod: "cod",
        orderDate: new Date().toISOString(),
        status: "Processing",
      };

      const existingOrders = localStorage.getItem("dazeen_placed_orders_v1");
      const parseExisting = existingOrders ? JSON.parse(existingOrders) : [];
      localStorage.setItem("dazeen_placed_orders_v1", JSON.stringify([orderPayload, ...parseExisting]));

      // Notify user about their fresh coffee order placement
      notificationService.send(
        "COD Order Placed successfully! 📦🚚",
        `Your order ${uniqueOrderId} is logged! Savor the wait, cash of ₹${totals.finalAmount} is payable on delivery.`
      );

      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          displayName: fullName.trim(),
          address: `${addressLine1}, ${addressLine2}`,
          phoneNumber: phoneNumber.trim(),
        };
        localStorage.setItem("dazeen_current_user", JSON.stringify(updatedUser));
      }

      setTimeout(() => {
        onClearCart();
        setSimulatedPaymentSuccess(false);
        onSetView("tracking");
      }, 2500);

    }, 1500);
  };

  // Process Simulated Payment Confirmation
  const submitSimulatedPayment = () => {
    setSimulatedGatewayError("");
    if (simulatedCardNo.replace(/\s+/g, "").length < 16) {
      setSimulatedGatewayError("Please enter a valid 16-digit card number.");
      return;
    }
    setIsProcessingPay(true);

    setTimeout(() => {
      setIsProcessingPay(false);
      setSimulatedPaymentSuccess(true);
      
      const finalOrderId = placedOrderId || `DAZ-${Math.floor(100000 + Math.random() * 900000)}`;
      if (!placedOrderId) {
        setPlacedOrderId(finalOrderId);
      }
      
      // Store checkout order in localStorage database
      const orderPayload = {
        id: finalOrderId,
        userId: currentUser?.uid || "guest_uid",
        userEmail: currentUser?.email || "guest@dazeen.com",
        fullName,
        phoneNumber,
        streetAddress: `${addressLine1}, ${addressLine2}${landmark ? ", " + landmark : ""}`,
        city,
        state,
        pinCode: pincode,
        addressType,
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

      const existingOrders = localStorage.getItem("dazeen_placed_orders_v1");
      const parseExisting = existingOrders ? JSON.parse(existingOrders) : [];
      
      const exists = parseExisting.some((o: any) => o.id === finalOrderId);
      if (!exists) {
        localStorage.setItem("dazeen_placed_orders_v1", JSON.stringify([orderPayload, ...parseExisting]));
        
        // Notify user about their fresh coffee order placement
        notificationService.send(
          "Order Placed successfully! 🎉☕",
          `Your order ${finalOrderId} is logged! Savor the wait, we are preparing it freshness-first.`
        );
      }

      // Save user profile details
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          displayName: fullName.trim(),
          address: `${addressLine1}, ${addressLine2}`,
          phoneNumber: phoneNumber.trim(),
        };
        localStorage.setItem("dazeen_current_user", JSON.stringify(updatedUser));
      }

      // Finish order placement & trigger cart clear
      setTimeout(() => {
        onClearCart();
        setShowSimulatedGateway(false);
        onSetView("tracking");
      }, 3000);

    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-6 text-coffee-900 border border-coffee-200">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-coffee-950">Your Cart is Currently Empty</h2>
        <p className="text-coffee-600 mt-2 text-sm max-w-md mx-auto">
          Explore our boutique high-altitude coffee selections and customize your coffee routine without caffeine interruptions.
        </p>
        <button
          onClick={() => onSetView("main")}
          className="mt-8 px-6 py-3 bg-[#5E0ED7] hover:bg-[#5E0ED7]/90 text-white text-xs font-bold font-mono tracking-widest uppercase rounded-full transition-all cursor-pointer shadow-lg shadow-[#5E0ED7]/15"
        >
          GO TO SHOPPING
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 selection:bg-[#5E0ED7]/10 selection:text-coffee-950">
      
      {/* Back to Shopping Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <button
          onClick={() => {
            if (checkoutStep === "payment") {
              setCheckoutStep("address");
            } else if (checkoutStep === "address") {
              setCheckoutStep("cart");
            } else {
              onSetView("main");
            }
          }}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-coffee-800 hover:text-[#5E0ED7] transition-all cursor-pointer bg-white border border-coffee-200 px-4 py-2.5 rounded-xl shadow-sm hover:shadow"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>
            {checkoutStep === "payment"
              ? "Back to Address"
              : checkoutStep === "address"
              ? "Back to Cart"
              : "Continue Shopping"}
          </span>
        </button>

        {/* Display clear custom store header */}
        <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-coffee-500 uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-[#5E0ED7]" />
          <span>Shanti Brew Premium Store • ₹ INR</span>
        </div>
      </div>

      {/* Checkout Wizard Progression Steps Timeline */}
      <div className="max-w-xl mx-auto mb-10 bg-[#0c0a09] border border-stone-800/80 p-6 rounded-3xl shadow-2xl relative flex flex-col items-center">
        <RadioGroup3D 
          value={checkoutStep === "cart" ? "cart" : checkoutStep === "address" ? "address" : "payment"}
          onChange={(newStep) => {
            setSubmitError("");
            if (newStep === "cart") {
              setCheckoutStep("cart");
            } else if (newStep === "address") {
              if (cart.length === 0) return;
              setCheckoutStep("address");
            } else if (newStep === "payment") {
              if (!fullName || !phoneNumber || phoneNumber.length < 10 || !pincode || pincode.length !== 6 || !addressLine1 || !addressLine2 || !city || !state) {
                setSubmitError("Please fill out and complete all address details first before proceeding to Payment.");
                return;
              }
              setCheckoutStep("payment");
            }
          }}
          disabledSteps={{
            cart: false,
            address: cart.length === 0,
            payment: cart.length === 0 || !fullName || pincode.length !== 6
          }}
        />
        {submitError && (
          <p className="text-red-500 font-medium text-xs mt-3 select-none text-center">
            ⚠️ {submitError}
          </p>
        )}
      </div>

      {/* Main interactive grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ==========================================
            STEP 1: SHOPPING CART PRODUCTS ROW 
            ========================================== */}
        {checkoutStep === "cart" && (
          <>
            {/* Left side column: Cart items */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-2xl border border-coffee-200 p-5 sm:p-6 shadow-sm">
                <h3 className="text-xl font-serif font-bold text-coffee-950 border-b border-coffee-100 pb-4 mb-5 flex items-center justify-between">
                  <span>Shopping Cart Items ({cart.length})</span>
                  <span className="text-[10px] font-mono font-bold bg-[#5E0ED7]/5 text-[#5E0ED7] px-2.5 py-1 rounded-md">
                    Freshness-sealed Batch
                  </span>
                </h3>

                <div className="divide-y divide-coffee-100 space-y-5">
                  {cart.map((item) => (
                    <div key={item.product.id} className="pt-5 first:pt-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      {/* Product Details Section */}
                      <div className="flex gap-4 items-center">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-16 h-16 rounded-xl object-cover border border-coffee-200"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-coffee-950">{item.product.name}</h4>
                          <p className="text-[11px] text-coffee-500 max-w-[280px] line-clamp-1 mt-0.5">{item.product.tagline}</p>
                          
                          {/* Chips */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[9px] font-mono font-bold bg-coffee-100 text-coffee-900 px-2 py-0.5 rounded-md uppercase">
                              {item.product.roastLevel} Roast
                            </span>
                            <span className="text-[9px] font-mono font-bold bg-purple-50 text-[#5E0ED7] px-2 py-0.5 rounded-md">
                              0.0% Caffeine
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Actions & Raw Price */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0">
                        <div className="flex items-center bg-coffee-50 border border-coffee-200 rounded-lg p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="px-2 py-1 text-coffee-700 hover:text-coffee-950 hover:bg-coffee-200 rounded-md transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3.5 text-xs font-bold font-mono text-coffee-950">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="px-2 py-1 text-coffee-700 hover:text-coffee-950 hover:bg-coffee-200 rounded-md transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold font-mono text-coffee-950">
                            ₹{item.product.price * item.quantity}
                          </p>
                          <p className="text-[10px] text-coffee-500">
                            (₹{item.product.price} / pack)
                          </p>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side column: Promo & Subtotal */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Promo Coupon Card */}
              <div className="bg-white rounded-2xl border border-coffee-200 p-5 shadow-sm">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#5E0ED7] flex items-center gap-1.5 mb-3.5">
                  <Ticket className="w-4 h-4 text-inherit" />
                  <span>Have a Discount Promo Coupon?</span>
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="CELEBRATE or SHANTIBREW"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-grow bg-coffee-50 border border-coffee-250 rounded-xl px-3.5 py-2.5 text-xs text-coffee-950 outline-none uppercase font-mono tracking-widest focus:border-[#5E0ED7] focus:bg-white transition-all"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-coffee-950 text-[#FAF6F0] hover:bg-coffee-900 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider cursor-pointer uppercase transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>

                {/* Hint buttons */}
                <div className="flex gap-2.5 mt-3 flex-wrap">
                  <button 
                    onClick={() => setCoupon("CELEBRATE")}
                    className="text-[9px] font-mono font-bold bg-purple-50 text-[#5E0ED7] hover:bg-[#5E0ED7]/10 transition-all border border-[#5E0ED7]/15 py-1 px-2 rounded-lg cursor-pointer align-middle"
                  >
                    CELEBRATE (10% OFF)
                  </button>
                  {totals.subtotal >= 700 && (
                    <button 
                      onClick={() => setCoupon("SHANTIBREW")}
                      className="text-[9px] font-mono font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 transition-all border border-amber-200 py-1 px-2 rounded-lg cursor-pointer align-middle"
                    >
                      SHANTIBREW (₹100 OFF)
                    </button>
                  )}
                </div>

                {couponError && (
                  <p className="text-[11px] font-medium text-red-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{couponError}</span>
                  </p>
                )}

                {activeCoupon && (
                  <div className="mt-3.5 p-3 rounded-xl bg-green-50 border border-green-200 flex justify-between items-center text-xs text-green-950">
                    <div className="flex items-center gap-1.5 font-semibold text-green-800">
                      <Check className="w-4 h-4 text-green-600 font-bold" />
                      <span>Coupon {activeCoupon.code} applied successfully!</span>
                    </div>
                    <button
                      onClick={() => setActiveCoupon(null)}
                      className="text-[10px] uppercase font-bold text-green-900 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Subtotal Order Summary Box & Proceed button */}
              <div className="bg-white rounded-2xl border border-coffee-200 p-5 sm:p-6 shadow-sm space-y-4 text-coffee-950">
                <h3 className="text-sm font-serif font-bold border-b border-coffee-100 pb-3 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-coffee-900" />
                  <span>Cart Subtotal Billing</span>
                </h3>

                <div className="space-y-3 text-xs text-coffee-800">
                  <div className="flex justify-between font-medium">
                    <span>Items Subtotal</span>
                    <span className="font-mono font-bold">₹{totals.subtotal}</span>
                  </div>

                  {totals.discount > 0 && (
                    <div className="flex justify-between text-green-700 font-semibold">
                      <span>Coupon Discount</span>
                      <span className="font-mono">- ₹{totals.discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-medium">
                    <span>GST Tax (exactly 5%)</span>
                    <span className="font-mono font-bold">₹{totals.gstAmount}</span>
                  </div>

                  <div className="flex justify-between font-medium">
                    <span>Delivery Charges</span>
                    <span className="font-mono font-bold">
                      {totals.shippingCharge === 0 ? "FREE" : `₹${totals.shippingCharge}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline border-t border-coffee-200 pt-4 text-sm font-serif font-bold text-coffee-950">
                    <span>Estimated Total</span>
                    <span className="font-mono text-lg text-[#5E0ED7] font-extrabold">₹{totals.finalAmount}</span>
                  </div>
                </div>

                {submitError && (
                  <p className="text-[11px] font-bold text-red-500 bg-red-50 p-2 rounded-lg border border-red-150 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </p>
                )}

                {/* Big Proceed Checkout CTA */}
                <button
                  onClick={() => {
                    if (!currentUser) {
                      setSubmitError("Please Login or Sign Up first to save your profile and shipping details.");
                      onOpenLogin();
                      return;
                    }
                    setSubmitError("");
                    setCheckoutStep("address");
                  }}
                  className="w-full py-4 bg-gradient-to-r from-[#5E0ED7] to-purple-600 hover:from-[#5E0ED7]/90 hover:to-purple-700 text-white rounded-xl text-xs font-bold font-mono tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#5E0ED7]/15 transition-all"
                >
                  <span>PROCEED TO SHIFTING ADDRESS</span>
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>

                <p className="text-[10px] text-center text-coffee-500 font-sans mt-2">
                  🛡️ Securely processed with Cashfree High-Security PG
                </p>
              </div>
            </div>
          </>
        )}

        {/* ==========================================
            STEP 2: MINIMAL ADAPTIVE DELIVERY ADDRESS 
            ========================================== */}
        {checkoutStep === "address" && (
          <>
            {/* Left column: proper address fields */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white rounded-2xl border border-coffee-200 p-5 sm:p-6 shadow-sm space-y-6">
                
                {/* Header info */}
                <div className="border-b border-coffee-100 pb-4">
                  <span className="text-[9px] font-mono font-bold text-[#5E0ED7] uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded-md">
                    Secure Delivery Dispatch
                  </span>
                  <h3 className="text-xl font-serif font-bold text-coffee-950 mt-1.5">
                    Shipping Address details
                  </h3>
                  <p className="text-xs text-coffee-600 mt-0.5">
                    Please provide Pincode to automatically populate village, town, and state details.
                  </p>
                </div>

                {submitError && (
                  <div className="bg-red-50 text-red-700 p-3.5 rounded-xl border border-red-150 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Pin Code input field FIRST */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-coffee-950 block" htmlFor="pincode">
                      6-Digit PIN Code <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="pincode"
                        type="text"
                        placeholder="e.g. 577101 (Automatically fetches location)"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-purple-50/20 border border-coffee-250 rounded-xl px-11 py-3 text-xs text-coffee-950 outline-none focus:border-[#5E0ED7] focus:bg-white transition-all font-mono font-bold focus:ring-1 focus:ring-[#5E0ED7]/15"
                      />
                      <MapPin className="w-4.5 h-4.5 text-[#5E0ED7] absolute left-4 top-1/2 -translate-y-1/2" />
                      {isFetchingPincode && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-xs text-[#5E0ED7] font-mono font-bold">
                          <span className="w-3.5 h-3.5 border-2 border-[#5E0ED7] border-t-transparent rounded-full animate-spin"></span>
                          <span>Fetching...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Village selection/Manual input */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-coffee-950 block" htmlFor="address_line2">
                      Village, Area, colony, street (Gaw Name) <span className="text-red-500">*</span>
                    </label>
                    {fetchedVillages.length > 0 ? (
                      <div className="space-y-2">
                        <select
                          id="address_line2_select"
                          value={addressLine2}
                          onChange={(e) => setAddressLine2(e.target.value)}
                          className="w-full bg-white border-2 border-coffee-200 rounded-xl px-3.5 py-3 text-xs text-coffee-950 font-medium outline-none focus:border-[#5E0ED7] transition-all"
                        >
                          <option value="">-- Choose Local Village/Area --</option>
                          {fetchedVillages.map((village, idx) => (
                            <option key={`${village}-${idx}`} value={village}>
                              {village}
                            </option>
                          ))}
                        </select>
                        <p className="text-[10px] text-coffee-500 italic block">
                          Or edit selected Village/Gaw details below:
                        </p>
                        <input
                          id="address_line2"
                          type="text"
                          placeholder="Or type village name manually..."
                          value={addressLine2}
                          onChange={(e) => setAddressLine2(e.target.value)}
                          className="w-full bg-coffee-50 border border-coffee-250 rounded-xl px-3.5 py-2.5 text-xs text-coffee-950 outline-none focus:border-[#5E0ED7] focus:bg-white transition-all font-sans"
                        />
                      </div>
                    ) : (
                      <input
                        id="address_line2"
                        type="text"
                        placeholder="e.g. Village name, Area, Colony, Street, Sector"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className="w-full bg-coffee-50 border border-coffee-250 rounded-xl px-3.5 py-2.5 text-xs text-coffee-950 outline-none focus:border-[#5E0ED7] focus:bg-white transition-all font-sans font-medium"
                      />
                    )}
                  </div>

                  {/* Town / City and State (Auto fetched but editable) */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-coffee-900 block" htmlFor="city_field">
                      Town / City <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="city_field"
                      type="text"
                      placeholder="Town / District"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-coffee-50 border border-coffee-250 rounded-xl px-3.5 py-2.5 text-xs text-coffee-950 outline-none focus:border-[#5E0ED7] focus:bg-white transition-all font-sans font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-coffee-900 block" htmlFor="state_field">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="state_field"
                      type="text"
                      placeholder="State name"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-coffee-50 border border-coffee-250 rounded-xl px-3.5 py-2.5 text-xs text-coffee-950 outline-none focus:border-[#5E0ED7] focus:bg-white transition-all font-sans font-medium"
                    />
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-coffee-950 block" htmlFor="full_name">
                      Consignee Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="full_name"
                      type="text"
                      placeholder="e.g. Vaidehi Deshmukh"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-coffee-50 border border-coffee-250 rounded-xl px-3.5 py-2.5 text-xs text-coffee-950 outline-none focus:border-[#5E0ED7] focus:bg-white transition-all font-sans font-medium"
                    />
                  </div>

                  {/* Mobile phone number */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-coffee-950 block" htmlFor="phone_number">
                      10-Digit Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-coffee-500 select-none">
                        +91
                      </span>
                      <input
                        id="phone_number"
                        type="tel"
                        placeholder="98765 43210"
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-coffee-50 border border-coffee-250 rounded-xl pl-12 pr-3.5 py-2.5 text-xs text-coffee-950 outline-none focus:border-[#5E0ED7] focus:bg-white transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Flat, House no. */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-coffee-950 block" htmlFor="address_line1">
                      Flat, House no., Building or Apartment Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="address_line1"
                      type="text"
                      placeholder="e.g. Flat 301, 3rd Floor, Shanti Residency"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="w-full bg-coffee-50 border border-coffee-250 rounded-xl px-3.5 py-2.5 text-xs text-coffee-950 outline-none focus:border-[#5E0ED7] focus:bg-white transition-all font-sans font-medium"
                    />
                  </div>

                  {/* Landmark - Optional */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-coffee-900 block" htmlFor="landmark">
                      Landmark <span className="text-coffee-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="landmark"
                      type="text"
                      placeholder="e.g. Near Central Post Office, Hanuman Mandir"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full bg-coffee-50 border border-coffee-250 rounded-xl px-3.5 py-2.5 text-xs text-coffee-950 outline-none focus:border-[#5E0ED7] focus:bg-white transition-all font-sans font-medium"
                    />
                  </div>

                </div>

                {/* Place Type (Home vs Work/Office) */}
                <div className="space-y-1.5 pt-2 border-t border-coffee-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-coffee-950 block">
                    Address Type / Location Category
                  </span>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setAddressType("Home")}
                      className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                        addressType === "Home"
                          ? "bg-coffee-900 text-[#FAF6F0] border-coffee-900 shadow-sm"
                          : "bg-white text-coffee-700 border-coffee-250 hover:bg-coffee-50"
                      }`}
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>Home (Delivery all day)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddressType("Work")}
                      className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                        addressType === "Work"
                          ? "bg-coffee-900 text-[#FAF6F0] border-coffee-900 shadow-sm"
                          : "bg-white text-coffee-700 border-coffee-250 hover:bg-coffee-50"
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Work / Office (10 AM - 5 PM)</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Right column: Cart review & next step */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Order Cart item display summary */}
              <div className="bg-white rounded-2xl border border-coffee-200 p-5 shadow-sm">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-coffee-900 border-b border-coffee-100 pb-2 mb-3">
                  Order Items Brief ({cart.length})
                </h4>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-2 items-center justify-between text-xs text-coffee-900">
                      <div className="flex items-center gap-2 truncate">
                        <img src={item.product.image} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="truncate font-semibold">{item.product.name} (x{item.quantity})</span>
                      </div>
                      <span className="font-mono font-bold shrink-0">₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtotal review and Proceed Button */}
              <div className="bg-white rounded-2xl border border-coffee-200 p-5 sm:p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#5E0ED7]">
                  Pricing Recap
                </h4>

                <div className="space-y-2 text-xs text-coffee-800">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-mono">₹{totals.subtotal}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-[#5E0ED7]">
                      <span>Coupon Saved</span>
                      <span className="font-mono font-bold">- ₹{totals.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-serif font-bold text-coffee-950 border-t border-coffee-100 pt-2.5">
                    <span>Final Payable (Estim.)</span>
                    <span className="font-mono text-[#5E0ED7]">₹{totals.finalAmount}</span>
                  </div>
                </div>

                {/* Big Next Step Trigger buttons */}
                <button
                  type="button"
                  onClick={() => {
                    setSubmitError("");
                    if (!fullName.trim()) {
                      setSubmitError("Please fill in Full Name.");
                      return;
                    }
                    if (!phoneNumber || phoneNumber.length < 10) {
                      setSubmitError("Please specify correct 10-Digit Mobile Number.");
                      return;
                    }
                    if (!pincode || pincode.length !== 6) {
                      setSubmitError("Please type correct 6-digit PIN code.");
                      return;
                    }
                    if (!addressLine2.trim()) {
                      setSubmitError("Please complete your Village or Street details.");
                      return;
                    }
                    if (!addressLine1.trim()) {
                      setSubmitError("Please complete your Flat or House details.");
                      return;
                    }
                    if (!city.trim()) {
                      setSubmitError("Please enter Town or City.");
                      return;
                    }
                    if (!state.trim()) {
                      setSubmitError("Please enter State.");
                      return;
                    }
                    setCheckoutStep("payment");
                  }}
                  className="w-full py-4 bg-gradient-to-r from-coffee-950 to-coffee-900 hover:from-coffee-900 hover:to-coffee-850 text-white rounded-xl text-xs font-bold font-mono tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                >
                  <span>NEXT: PROCEED TO PAYMENT</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </>
        )}

        {/* ==========================================
            STEP 3: SECURE PAYMENT SELECTION (COD/ONLINE) 
            ========================================== */}
        {checkoutStep === "payment" && (
          <div className="col-span-12">
            <CheckoutForm 
              currentUser={currentUser}
              cartItems={cart}
              onOrderPlaced={(order) => {
                setTimeout(() => {
                  onClearCart();
                  onSetView("tracking");
                }, 4000);
              }}
            />
          </div>
        )}

      </div>

      {/* CASFREE INTEGRATED OVERLAY DIALOG - Falls back elegantly if real server connection fails! */}
      <AnimatePresence>
        {showSimulatedGateway && (
          <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-99 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-coffee-200 shadow-2xl w-full max-w-md overflow-hidden text-coffee-950 font-sans"
            >
              
              {/* Cashfree PG Header branding */}
              <div className="bg-[#1f293d] p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-sky-500 rounded-lg flex items-center justify-center font-bold font-mono text-sm tracking-tighter text-white">
                    CF
                  </div>
                  <div>
                    <span className="font-sans font-extrabold text-sm block tracking-wide">cashfree payments</span>
                    <span className="text-[10px] text-slate-400 block -mt-1 font-mono">Secure Settlement Portal</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">App ID: 128213</span>
                  <span className="text-sm font-extrabold text-emerald-400 font-mono">₹{totals.finalAmount}</span>
                </div>
              </div>

              {/* Flow content */}
              <div className="p-6 space-y-4">
                
                {simulatedPaymentSuccess ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-1">
                      <Check className="w-9 h-9 font-bold" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-emerald-800">Payment Processed Successfully</h4>
                      <p className="text-xs text-coffee-600 mt-1 font-mono">Order ID: {placedOrderId}</p>
                    </div>
                    <p className="text-[11px] text-[#5E0ED7] font-mono animate-pulse">
                      Reflecting payment token ... Redirecting user back to Order Dashboard
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="p-3.5 bg-sky-50 border border-sky-100 rounded-2xl text-xs text-sky-950 space-y-1">
                      <p className="font-bold">Sandbox / Premium Backup Payment Gateway</p>
                      <p className="text-[11px] text-sky-800 leading-relaxed font-mono">
                        Client ID verified: 12821375... <br/>
                        Enter card details below to finalize ₹{totals.finalAmount} payment token secure validation.
                      </p>
                    </div>

                    <div className="space-y-3 pt-1">
                      {/* Card Number */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 block">
                          Card Number
                        </label>
                        <input
                          type="text"
                          maxLength={19}
                          placeholder="4111 2222 3333 4444"
                          value={simulatedCardNo}
                          onChange={(e) => {
                            const trimmed = e.target.value.replace(/\s+/g, "").replace(/\D/g, "");
                            const matches = trimmed.match(/.{1,4}/g);
                            setSimulatedCardNo(matches ? matches.join(" ") : trimmed);
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 outline-none font-mono focus:border-sky-500 focus:bg-white transition-all"
                        />
                      </div>

                      {/* Expiry and CVV */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 block">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            placeholder="12/28"
                            value={simulatedExpiry}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, "");
                              setSimulatedExpiry(v.length >= 2 ? `${v.slice(0, 2)}/${v.slice(2, 4)}` : v);
                            }}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 outline-none font-mono focus:border-sky-500 focus:bg-white transition-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 block">
                            CVV
                          </label>
                          <input
                            type="password"
                            maxLength={3}
                            placeholder="***"
                            value={simulatedCvv}
                            onChange={(e) => setSimulatedCvv(e.target.value.replace(/\D/g, ""))}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-950 outline-none font-mono focus:border-sky-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {simulatedGatewayError && (
                      <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl text-xs font-semibold text-rose-700 text-left">
                        ⚠️ {simulatedGatewayError}
                      </div>
                    )}

                    <div className="flex gap-3 pt-3">
                      <button
                        onClick={() => setShowSimulatedGateway(false)}
                        disabled={isProcessingPay}
                        className="flex-1 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold tracking-wider font-mono cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        CANCEL
                      </button>
                      <button
                        onClick={submitSimulatedPayment}
                        disabled={isProcessingPay || simulatedPaymentSuccess}
                        className="flex-grow py-3 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-[#FAF6F0] rounded-xl text-xs font-extrabold tracking-widest font-mono cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
                      >
                        {isProcessingPay ? "SETTLING..." : "CONFIRM & SETTLE"}
                      </button>
                    </div>
                  </>
                )}

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
