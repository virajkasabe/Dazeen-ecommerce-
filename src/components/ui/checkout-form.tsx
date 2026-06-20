"use client";

import * as React from "react";
import { CreditCard, MapPin, Tag, Landmark, CheckCircle, Ticket, ArrowRight, Truck } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./card";
import { Separator } from "./separator";
import { cn } from "../../lib/utils";

export interface CheckoutFormProps {
  currentUser?: any;
  cartItems?: {
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
      roastLevel?: string;
    };
    quantity: number;
  }[];
  onOrderPlaced?: (order: any) => void;
  initialFullName?: string;
  initialPhoneNumber?: string;
  initialPincode?: string;
  initialAddressLine1?: string;
  initialAddressLine2?: string;
  initialCity?: string;
  initialState?: string;
}

export default function CheckoutForm({ 
  currentUser, 
  cartItems = [], 
  onOrderPlaced,
  initialFullName,
  initialPhoneNumber,
  initialPincode,
  initialAddressLine1,
  initialAddressLine2,
  initialCity,
  initialState
}: CheckoutFormProps) {
  // Address State
  const [fullName, setFullName] = React.useState(initialFullName || currentUser?.displayName || "Vaidehi Deshmukh");
  const [phoneNumber, setPhoneNumber] = React.useState(initialPhoneNumber || currentUser?.phoneNumber || currentUser?.phone || "9876543210");
  const [pincode, setPincode] = React.useState(initialPincode || "577101");
  const [addressLine1, setAddressLine1] = React.useState(initialAddressLine1 || (currentUser?.address ? currentUser.address.split(",")[0] : "Flat 301, 3rd Floor, Shanti Residency"));
  const [addressLine2, setAddressLine2] = React.useState(initialAddressLine2 || (currentUser?.address && currentUser.address.split(",").length > 1 ? currentUser.address.split(",").slice(1).join(", ").trim() : "Chikmagalur Main Town"));
  const [city, setCity] = React.useState(initialCity || "Chikmagalur");
  const [state, setState] = React.useState(initialState || "Karnataka");

  // Sync state if initial values or currentUser changes
  React.useEffect(() => {
    if (initialFullName) setFullName(initialFullName);
    if (initialPhoneNumber) setPhoneNumber(initialPhoneNumber);
    if (initialPincode) setPincode(initialPincode);
    if (initialAddressLine1) setAddressLine1(initialAddressLine1);
    if (initialAddressLine2) setAddressLine2(initialAddressLine2);
    if (initialCity) setCity(initialCity);
    if (initialState) setState(initialState);
  }, [initialFullName, initialPhoneNumber, initialPincode, initialAddressLine1, initialAddressLine2, initialCity, initialState]);

  React.useEffect(() => {
    if (currentUser && !initialFullName) {
      if (currentUser.displayName) setFullName(currentUser.displayName);
      const phoneVal = currentUser.phoneNumber || currentUser.phone;
      if (phoneVal) setPhoneNumber(phoneVal);
      if (currentUser.address) {
        const parts = currentUser.address.split(",");
        setAddressLine1(parts[0] || "");
        if (parts.length > 1) {
          setAddressLine2(parts.slice(1).join(", ").trim());
        }
      }
    }
  }, [currentUser, initialFullName]);

  // Discount/Promo State
  const [promoCode, setPromoCode] = React.useState("");
  const [discountAmount, setDiscountAmount] = React.useState(0);
  const [appliedPromo, setAppliedPromo] = React.useState<string | null>(null);
  const [promoError, setPromoError] = React.useState<string | null>(null);

  // Payment Method State - strictly 2 choices: "ONLINE" and "COD"
  const [paymentMethod, setPaymentMethod] = React.useState<"ONLINE" | "COD">("ONLINE");
  const [error, setError] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);

  // Order Submission State
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = React.useState<any>(null);

  // Fallback items if none passed (demo mode)
  const activeItems = cartItems.length > 0 ? cartItems : [
    {
      product: {
        id: "p1",
        name: "Premium Chikmagalur Arabica",
        price: 349.00,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=250&h=250&fit=crop",
        roastLevel: "Medium",
      },
      quantity: 1,
    }
  ];

  // Price Calculations
  const itemTotal = React.useMemo(() => {
    return activeItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [activeItems]);

  const deliveryFee = itemTotal > 499 ? 0 : 49.00;
  const taxes = Number((itemTotal * 0.05).toFixed(2)); // Standard 5% GST
  const grandTotal = Number((itemTotal - discountAmount + deliveryFee + taxes).toFixed(2));

  // Auto layout on pincode change
  React.useEffect(() => {
    if (pincode === "577101") {
      setCity("Chikmagalur");
      setState("Karnataka");
    } else if (pincode === "560001") {
      setCity("Bengaluru");
      setState("Karnataka");
    } else if (pincode === "400001") {
      setCity("Mumbai");
      setState("Maharashtra");
    } else if (pincode === "110001") {
      setCity("New Delhi");
      setState("Delhi");
    }
  }, [pincode]);

  // Handle Promo Code application
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoCode.trim().toUpperCase();

    if (code === "CELEBRATE") {
      const discount = Number((itemTotal * 0.1).toFixed(2));
      setDiscountAmount(discount);
      setAppliedPromo("CELEBRATE (10% OFF)");
      setPromoCode("");
    } else if (code === "SHANTIBREW") {
      if (itemTotal < 500) {
        setPromoError("This code requires a minimum purchase of ₹500.");
      } else {
        setDiscountAmount(100.00);
        setAppliedPromo("SHANTIBREW (₹100 OFF)");
        setPromoCode("");
      }
    } else {
      setPromoError("Invalid code. Try 'CELEBRATE' or 'SHANTIBREW'.");
    }
  };

  // Submit Order / Place Order
  const handlePlaceOrder = async () => {
    setError(null);

    // Standard Client-side Form Validation
    if (!fullName.trim()) {
      setError("Please fill in your Full Name.");
      return;
    }
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!pincode || pincode.trim().length !== 6) {
      setError("Please enter a valid 6-digit pin code.");
      return;
    }
    if (!addressLine1.trim()) {
      setError("Please complete your Flat/House details.");
      return;
    }
    if (!addressLine2.trim()) {
      setError("Please complete your Area/Colony/Street details.");
      return;
    }
    if (!city.trim()) {
      setError("Please specify Town/City.");
      return;
    }
    if (!state.trim()) {
      setError("Please specify/select State.");
      return;
    }

    const uniqueOrderId = `DAZ-${Math.floor(100000 + Math.random() * 900000)}`;

    const finalOrder = {
      id: uniqueOrderId,
      userId: currentUser?.uid || "guest_uid",
      userEmail: currentUser?.email || `${phoneNumber.trim()}@dazeen.com`,
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      streetAddress: `${addressLine1}, ${addressLine2}`,
      city,
      state,
      pinCode: pincode,
      paymentMethod,
      paymentDetails: paymentMethod === "ONLINE" ? "Cashfree Payments Secure Gateway" : "Cash on Delivery",
      items: activeItems,
      pricing: {
        itemTotal,
        discountAmount,
        deliveryFee,
        taxes,
        grandTotal,
      },
      status: "Processing",
      createdAt: new Date().toISOString(),
    };

    // Construct full tracking payload matching tracking standards
    const fullOrderPayload = {
      ...finalOrder,
      totalPrice: grandTotal,
      addressType: "Home",
      items: activeItems.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          roastLevel: item.product.roastLevel || "Medium"
        },
        quantity: item.quantity,
      }))
    };

    if (paymentMethod === "ONLINE") {
      setIsProcessing(true);
      try {
        const response = await fetch("/api/cashfree/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: uniqueOrderId,
            amount: grandTotal,
            customerName: fullName.trim(),
            customerEmail: currentUser?.email || `${phoneNumber.trim()}@dazeen.com`,
            customerPhone: phoneNumber.trim(),
          }),
        });

        const serverResult = await response.json();

        if (serverResult.success === true && (window as any).Cashfree) {
          // Store order in localStorage before redirecting so the history is preserved
          const existingOrders = localStorage.getItem("dazeen_placed_orders_v1");
          const parsedOrders = existingOrders ? JSON.parse(existingOrders) : [];
          localStorage.setItem("dazeen_placed_orders_v1", JSON.stringify([fullOrderPayload, ...parsedOrders]));

          // Sync credentials
          if (currentUser) {
            const updatedUser = {
              ...currentUser,
              displayName: fullName.trim(),
              address: `${addressLine1}, ${addressLine2}`.trim(),
              phoneNumber: phoneNumber.trim(),
            };
            localStorage.setItem("dazeen_current_user", JSON.stringify(updatedUser));
          }

          const isProd = serverResult.isProduction || String(serverResult.order_status || "").length > 0;
          const cashfree = (window as any).Cashfree({ mode: isProd ? "production" : "sandbox" });
          
          setIsProcessing(false);

          cashfree.checkout({
            paymentSessionId: serverResult.payment_session_id,
            returnUrl: `${window.location.origin}/?order_id=${uniqueOrderId}&payment_status=success`
          });
        } else {
          const errMsg = serverResult.error || "Failed to initiate Cashfree order. Choose COD or retry.";
          setError(`Cashfree Error: ${errMsg}`);
          setIsProcessing(false);
          console.error("Cashfree order creation rejected:", serverResult);
        }
      } catch (err: any) {
        console.error("Cashfree gateway crash:", err);
        setError(`Local API connection failed: ${err?.message || err}`);
        setIsProcessing(false);
      }
    } else {
      // COD directly places order
      setIsProcessing(true);
      
      // Save order database securely in localStorage to keep Order Tracking Page synced
      const existingOrders = localStorage.getItem("dazeen_placed_orders_v1");
      const parsedOrders = existingOrders ? JSON.parse(existingOrders) : [];
      localStorage.setItem("dazeen_placed_orders_v1", JSON.stringify([fullOrderPayload, ...parsedOrders]));

      // Auto-save address and details to user profile if logged in
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          displayName: fullName.trim(),
          address: `${addressLine1}, ${addressLine2}`.trim(),
          phoneNumber: phoneNumber.trim(),
        };
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
            console.error("Could not sync profile values", e);
          }
        }
      }

      // Notify user about their fresh coffee order placement
      const { notificationService } = await import("../../utils/notifications");
      notificationService.send(
        "COD Order Placed successfully! 📦🚚",
        `Your order ${uniqueOrderId} is logged! Savor the wait, cash of ₹${grandTotal.toFixed(2)} is payable on delivery.`
      );

      setTimeout(() => {
        setIsProcessing(false);
        setPlacedOrderDetails(fullOrderPayload);
        setIsSubmitted(true);
        if (onOrderPlaced) {
          onOrderPlaced(fullOrderPayload);
        }
      }, 1500);
    }
  };

  if (isSubmitted && placedOrderDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-white dark:bg-stone-900 p-4 sm:p-6 rounded-3xl border border-stone-200/60 dark:border-stone-850 shadow-xl max-w-md w-full mx-auto">
        <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 text-emerald-500">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-serif font-black text-stone-900 dark:text-stone-100 text-center mb-1">
          Order Placed Successfully!
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 text-center mb-6">
          Your fresh-made artisanal coffee package has been logged.
        </p>

        <Card className="w-full bg-stone-50/50 dark:bg-stone-950/20 border border-stone-100 dark:border-stone-800 shadow-none mb-6">
          <CardHeader className="p-4 pb-2 border-b border-stone-100 dark:border-stone-800/80">
            <CardTitle className="text-xs font-mono font-bold uppercase tracking-widest text-[#B4942B]">
              Order Summary Invoice
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs">
            {/* Delivery Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-200 text-[11px] uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Shipping Address</span>
              </div>
              <p className="text-stone-600 dark:text-stone-400 font-medium pl-5 leading-relaxed">
                {placedOrderDetails.fullName} • +91 {placedOrderDetails.phoneNumber}<br />
                {placedOrderDetails.streetAddress}, {placedOrderDetails.city}, {placedOrderDetails.state} - {placedOrderDetails.pinCode}
              </p>
            </div>

            <Separator className="bg-stone-100 dark:bg-stone-800/60" />

            {/* Payment Method Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-200 text-[11px] uppercase tracking-wider">
                <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                <span>Billing Summary</span>
              </div>
              <p className="text-stone-700 dark:text-stone-300 font-mono pl-5 font-bold">
                Method Selected: {placedOrderDetails.paymentMethod}
              </p>
              <p className="text-stone-500 dark:text-stone-400 pl-5">
                Details: {placedOrderDetails.paymentDetails}
              </p>
            </div>

            <Separator className="bg-stone-100 dark:bg-stone-800/60" />

            {/* Item summaries list */}
            <div className="space-y-1">
              <span className="font-bold text-stone-800 dark:text-stone-200 text-[11px] uppercase tracking-wider">
                Items Selected
              </span>
              <div className="space-y-1 pl-1 mt-1">
                {placedOrderDetails.items.map((item: any) => (
                  <div key={item.product.id} className="flex justify-between font-medium text-stone-600 dark:text-stone-400">
                    <span>{item.product.name} (x{item.quantity})</span>
                    <span className="font-mono">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-stone-100 dark:bg-stone-800/60" />

            {/* Final amounts */}
            <div className="space-y-1.5 pt-1 text-stone-600 dark:text-stone-400">
              <div className="flex justify-between">
                <span>Cart Subtotal:</span>
                <span className="font-mono">₹{placedOrderDetails.pricing.itemTotal.toFixed(2)}</span>
              </div>
              {placedOrderDetails.pricing.discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Saved Discount:</span>
                  <span className="font-mono">- ₹{placedOrderDetails.pricing.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Standard taxes (5% GST):</span>
                <span className="font-mono">₹{placedOrderDetails.pricing.taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping charge:</span>
                <span className="font-mono">{placedOrderDetails.pricing.deliveryFee === 0 ? "FREE" : `₹${placedOrderDetails.pricing.deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-stone-900 dark:text-stone-100 font-extrabold font-serif text-sm border-t border-dashed border-stone-200 dark:border-stone-800 pt-2.5">
                <span>Grand Total Paid:</span>
                <span className="font-mono text-[#B4942B] text-base">₹{placedOrderDetails.pricing.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={() => {
            // Force tracking page view
            window.location.reload();
          }}
          className="w-full h-11 rounded-2xl bg-amber-500 hover:bg-amber-400 dark:bg-amber-500 dark:hover:bg-amber-600 text-stone-950 font-semibold text-xs tracking-wider uppercase cursor-pointer"
        >
          Track Step-by-Step Delivery
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-transparent py-4 font-sans">
      <Card className="w-full max-w-md shadow-xl border border-stone-200/60 dark:border-stone-800 rounded-3xl bg-white dark:bg-stone-950/40">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base sm:text-lg font-serif font-black tracking-tight text-stone-900 dark:text-stone-100">
            Secure Summary Checkout
          </CardTitle>
          <CardDescription className="text-xs text-stone-500">
            Complete your shipping details and choose a payment mode.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-5">
          
          {/* Shipping Input Form */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
              <MapPin className="h-4 w-4 text-[#B4942B]" />
              <span className="text-xs font-serif font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Shipping Information
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 select-none">
                <span className="text-[10px] grid font-mono font-bold text-stone-400 uppercase tracking-widest">
                  Recipient Name
                </span>
                <Input 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Vaidehi Deshmukh"
                  className="h-8.5 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1 select-none">
                <span className="text-[10px] grid font-mono font-bold text-stone-400 uppercase tracking-widest">
                  Phone Number
                </span>
                <Input 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="9876543210"
                  className="h-8.5 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-1 col-span-2 select-none">
                <span className="text-[10px] grid font-mono font-bold text-stone-400 uppercase tracking-widest">
                  Flat, House / Building Detail
                </span>
                <Input 
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Flat No, House / Building detail"
                  className="h-8.5 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1 select-none">
                <span className="text-[10px] grid font-mono font-bold text-stone-400 uppercase tracking-widest">
                  Village, colony, Street
                </span>
                <Input 
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Village, colony or street name"
                  className="h-8.5 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1 select-none">
                <span className="text-[10px] grid font-mono font-bold text-stone-400 uppercase tracking-widest">
                  Postal PIN Code
                </span>
                <Input 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="577101"
                  className="h-8.5 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-stone-100 dark:bg-stone-850" />

          {/* Payment Method Selector Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
              <CreditCard className="h-4 w-4 text-[#B4942B]" />
              <span className="text-xs font-serif font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Payment Method
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Online Payment via Cashfree */}
              <button
                type="button"
                onClick={() => setPaymentMethod("ONLINE")}
                className={cn(
                  "py-3 px-2 rounded-xl text-[11px] font-bold tracking-wide uppercase transition-all flex flex-col items-center gap-1.5 cursor-pointer border",
                  paymentMethod === "ONLINE"
                    ? "bg-[#B4942B]/10 text-[#B4942B] border-[#B4942B]/50 font-extrabold shadow-sm"
                    : "bg-stone-50 dark:bg-stone-900/40 text-stone-500 border-stone-200/50 dark:border-stone-800 hover:bg-stone-100/50"
                )}
              >
                <CreditCard className="w-4 h-4 text-inherit" />
                <span>Online Payment</span>
              </button>

              {/* COD option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={cn(
                  "py-3 px-2 rounded-xl text-[11px] font-bold tracking-wide uppercase transition-all flex flex-col items-center gap-1.5 cursor-pointer border",
                  paymentMethod === "COD"
                    ? "bg-[#B4942B]/10 text-[#B4942B] border-[#B4942B]/50 font-extrabold shadow-sm"
                    : "bg-stone-50 dark:bg-stone-900/40 text-stone-500 border-stone-200/50 dark:border-stone-800 hover:bg-stone-100/50"
                )}
              >
                <Truck className="w-4 h-4 text-inherit" />
                <span>Cash on Delivery</span>
              </button>
            </div>

            {/* Dynamic context inputs */}
            <div className="mt-3 bg-stone-50/50 dark:bg-stone-900/30 p-4 rounded-xl border border-stone-100 dark:border-stone-800/80">
              {paymentMethod === "ONLINE" ? (
                <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span>Cashfree Gateway Integrated</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Pay securely using secure channels: Netbanking, Debit/Credit Card, UPI, WhatsApp, or Google Pay.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                  <div className="flex items-center gap-1.5 font-bold text-[#B4942B]">
                    <span>📦 Standard Direct Dispatch</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Order places immediately. cash or mobile UPI QR scanner payment is payable to rider upon safe delivery.
                  </p>
                </div>
              )}
            </div>

            {/* Error alerts display */}
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium text-left leading-normal">
                ⚠️ {error}
              </div>
            )}
          </div>

          <Separator className="bg-stone-100 dark:bg-stone-850" />

          {/* Promo Code Section */}
          <div className="space-y-2 px-1">
            <span className="text-[11px] font-mono font-bold text-stone-400 uppercase tracking-widest block">
              Apply Promo Discount
            </span>
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <Input 
                value={promoCode} 
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter CELEBRATE / SHANTIBREW" 
                className="flex-1 h-8 rounded-lg text-xs" 
              />
              <Button type="submit" variant="secondary" className="h-8 px-4 text-xs rounded-lg bg-stone-105 hover:bg-stone-150 border border-stone-200">
                Redeem
              </Button>
            </form>
            {promoError && (
              <p className="text-[10px] text-red-500 font-medium pl-1">{promoError}</p>
            )}
            {appliedPromo && (
              <div className="bg-green-500/10 text-green-700 dark:text-green-400 p-2 rounded-lg text-[10px] font-semibold flex justify-between items-center">
                <span>Code {appliedPromo} Applied!</span>
                <button type="button" onClick={() => { setDiscountAmount(0); setAppliedPromo(null); }} className="underline font-bold">Remove</button>
              </div>
            )}
          </div>

          <Separator className="bg-stone-100 dark:bg-stone-850" />

          {/* Payment Summary */}
          <div>
            <span className="text-xs font-serif font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Payment Summary Invoice
            </span>
            <div className="grid grid-cols-2 gap-y-2 text-xs mt-2 pl-1 select-none">
              <span className="text-stone-500">Cart Item Total:</span>
              <span className="text-right font-semibold font-mono text-stone-900 dark:text-stone-100">₹{itemTotal.toFixed(2)}</span>
              
              {discountAmount > 0 && (
                <>
                  <span className="text-green-600 font-bold">Coupon saved:</span>
                  <span className="text-right font-extrabold font-mono text-green-700 dark:text-green-400">- ₹{discountAmount.toFixed(2)}</span>
                </>
              )}

              <span className="text-stone-500">Express Courier Delivery:</span>
              <span className="text-right font-semibold font-mono text-stone-900 dark:text-stone-100">
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(2)}`}
              </span>

              <span className="text-stone-500">Standard levies (5% GST):</span>
              <span className="text-right font-semibold font-mono text-stone-900 dark:text-stone-100">₹{taxes.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Checkout Summary */}
      <div className="w-full max-w-md mt-4 flex items-center justify-between rounded-2xl border border-stone-200/60 dark:border-stone-800 px-5 py-3.5 bg-stone-50/60 dark:bg-stone-950/20 shadow-lg">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-mono font-bold text-stone-400 tracking-widest block leading-none">
            Payable Amount
          </span>
          <span className="text-lg font-serif font-black text-[#B4942B] font-mono leading-none">
            ₹{grandTotal.toFixed(2)}
          </span>
        </div>
        <Button 
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="px-6 h-10 rounded-xl bg-stone-900 hover:bg-stone-850 text-white dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-950 text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
}
