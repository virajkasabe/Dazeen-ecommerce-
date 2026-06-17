import { useState, useMemo, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Trash2, Plus, Minus, Ticket, CreditCard, Sparkles, MapPin, Truck, Check, Smartphone } from "lucide-react";
import { CartItem } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currentUser: any;
  onOpenLogin?: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

const INDIAN_CITIES = [
  { name: "Bengaluru", days: 1, text: "Express Next-Day Delivery (Delhivery)" },
  { name: "Mumbai", days: 2, text: "Standard Air Shipping (BlueDart)" },
  { name: "Pune", days: 2, text: "Standard Air Shipping (BlueDart)" },
  { name: "New Delhi", days: 3, text: "Indian Premium Air Transit" },
  { name: "Hyderabad", days: 2, text: "Express Next-Day Delivery (Delhivery)" },
  { name: "Chennai", days: 2, text: "Standard Air Shipping (BlueDart)" },
  { name: "Kolkata", days: 3, text: "Secure National Courier Service" },
];

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  currentUser,
  onOpenLogin,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [coupon, setCoupon] = useState<string>("");
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; type: "percent" | "flat"; value: number } | null>(null);
  const [couponError, setCouponError] = useState<string>("");
  
  // Dynamic city delivery estimates
  const [deliveryCity, setDeliveryCity] = useState<string>("Bengaluru");
  const [pinCode, setPinCode] = useState<string>("");
  const [pinSuccess, setPinSuccess] = useState<string>("");

  // Checkout flows
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [payMethod, setPayMethod] = useState<string>("UPI");
  const [isOrderPlaced, setIsOrderPlaced] = useState<boolean>(false);
  const [isProcessingPay, setIsProcessingPay] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");

  // Save profile and checkout animation states
  const [saveToProfileOption, setSaveToProfileOption] = useState<boolean>(true);
  const [animPhase, setAnimPhase] = useState<"packing" | "checked" | "settled">("packing");

  // Automatically autofill shipping details from logged-in user profile
  useEffect(() => {
    if (currentUser && isCheckingOut) {
      if (!fullName) setFullName(currentUser.displayName || "");
      if (!phoneNumber) setPhoneNumber(currentUser.phoneNumber || currentUser.phone || "");
      if (!streetAddress) setStreetAddress(currentUser.address || "");
    }
  }, [currentUser, isCheckingOut]);

  // Handle cascading order confirmation sequence
  useEffect(() => {
    if (isOrderPlaced) {
      setAnimPhase("packing");
      
      // Phase 1 -> Phase 2 trigger after 2500ms
      const t1 = setTimeout(() => {
        setAnimPhase("checked");
      }, 2500);

      // Phase 2 -> Phase 3 trigger after 4000ms
      const t2 = setTimeout(() => {
        setAnimPhase("settled");
      }, 4000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isOrderPlaced]);

  // Subtotals
  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    
    let discount = 0;
    if (activeCoupon) {
      if (activeCoupon.type === "percent") {
        discount = Math.round(subtotal * (activeCoupon.value / 100));
      } else if (activeCoupon.type === "flat" && subtotal > 700) {
        discount = activeCoupon.value;
      }
    }

    const shippingCharge = subtotal > 499 || subtotal === 0 ? 0 : 50;
    const finalAmount = Math.max(0, subtotal - discount + shippingCharge);

    return {
      subtotal,
      discount,
      shippingCharge,
      finalAmount,
    };
  }, [cart, activeCoupon]);

  // Apply coupons
  const handleApplyCoupon = () => {
    setCouponError("");
    const cleaned = coupon.trim().toUpperCase();
    if (cleaned === "CELEBRATE") {
      setActiveCoupon({ code: "CELEBRATE", type: "percent", value: 10 });
      setCoupon("");
    } else if (cleaned === "SHANTIBREW") {
      if (totals.subtotal < 700) {
        setCouponError("This coupon is only applicable for orders values above ₹700.");
      } else {
        setActiveCoupon({ code: "SHANTIBREW", type: "flat", value: 100 });
        setCoupon("");
      }
    } else {
      setCouponError("Invalid coupon code! Try 'CELEBRATE' or 'SHANTIBREW'.");
    }
  };

  // Apply pincode
  const handlePinCodeCheck = (e: FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pinCode)) {
      setPinCode("");
      const randomCity = INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];
      setDeliveryCity(randomCity.name);
      setPinSuccess(`PIN matched! Shipping to ${randomCity.name} via ${randomCity.text}.`);
      setTimeout(() => setPinSuccess(""), 4000);
    } else {
      setPinSuccess("Please enter a valid 6-digit Indian PIN Code.");
    }
  };

  // Place real checkout order
  const handleCheckoutSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !streetAddress || !currentUser) return;
 
    setIsProcessingPay(true);
    
    const randomId = `DAZ-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(randomId);
 
    const totalPrice = totals.finalAmount;
    const orderPayload = {
      id: randomId,
      userId: currentUser.uid,
      userEmail: currentUser.email || "",
      fullName,
      phoneNumber,
      streetAddress,
      pinCode,
      items: cart.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
        },
        quantity: item.quantity,
      })),
      totalPrice,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
 
    // Save securely in local storage
    const existingOrders = localStorage.getItem("dazeen_placed_orders_v1");
    const parseExisting = existingOrders ? JSON.parse(existingOrders) : [];
    localStorage.setItem("dazeen_placed_orders_v1", JSON.stringify([orderPayload, ...parseExisting]));

    // Auto-save address and details to user profile if option is enabled
    if (saveToProfileOption && currentUser) {
      const updatedUser = {
        ...currentUser,
        displayName: fullName.trim(),
        address: streetAddress.trim(),
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
 
    setTimeout(() => {
      setIsProcessingPay(false);
      setIsOrderPlaced(true);
    }, 2000);
  };

  const handleCloseClear = () => {
    setIsCheckingOut(false);
    setIsOrderPlaced(false);
    onClearCart();
    onClose();
  };

  const currentCityEstimate = INDIAN_CITIES.find((c) => c.name === deliveryCity) || INDIAN_CITIES[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          
          {/* Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-coffee-950/50 backdrop-blur-xs"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-[#FAF6F0] text-coffee-950 shadow-2xl flex flex-col h-full border-l border-coffee-200"
            >
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-coffee-150 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛒</span>
                  <h3 className="font-serif text-xl font-bold text-coffee-950">
                    Your Coffee Cup Basket
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-coffee-500 hover:text-coffee-800 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* DYNAMIC CONTENT AREA */}
              {isOrderPlaced ? (
                /* ORDER COMPLETED CONFIRMATION */
                <div className="flex-1 overflow-x-hidden p-6 text-center flex flex-col justify-between items-center relative min-h-0 select-none">
                  
                  {/* Phase 1 & 2: Center Stage packing and verification transitions */}
                  {(animPhase === "packing" || animPhase === "checked") && (
                    <div className="flex-grow flex flex-col justify-center items-center w-full space-y-8 py-16">
                      
                      {animPhase === "packing" ? (
                        <div className="relative flex flex-col items-center justify-center space-y-6">
                          {/* Animated Falling Boxes / Drops */}
                          <div className="relative h-24 w-32 flex items-center justify-center">
                            <motion.span
                              initial={{ y: -45, scale: 0.5, opacity: 0 }}
                              animate={{ y: -5, scale: 1, opacity: [0, 1, 1, 0] }}
                              transition={{ duration: 1.2, repeat: Infinity, ease: "easeIn" }}
                              className="absolute top-2 text-2xl"
                            >
                              📦
                            </motion.span>
                            <motion.span
                              initial={{ y: -45, scale: 0.5, opacity: 0 }}
                              animate={{ y: -5, scale: 1, opacity: [0, 1, 1, 0] }}
                              transition={{ duration: 1.2, delay: 0.6, repeat: Infinity, ease: "easeIn" }}
                              className="absolute top-2 text-xl"
                            >
                              ☕
                            </motion.span>
                            {/* Bouncing Road-Travel Truck */}
                            <motion.div
                              animate={{ 
                                y: [0, -3, 0, -1, 0],
                                x: [-2, 2, -2, 1, -1]
                              }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                              className="text-coffee-950 mt-12"
                            >
                              <Truck className="w-16 h-16 stroke-[1.5]" />
                            </motion.div>
                          </div>

                          {/* Decorative Parallax Road line */}
                          <div className="w-36 h-0.5 border-t border-dashed border-coffee-400 opacity-60 overflow-hidden relative">
                            <motion.div
                              animate={{ x: [-80, 80] }}
                              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                              className="absolute top-0 left-0 w-20 h-full bg-coffee-800"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <h4 className="font-serif text-lg font-bold text-coffee-950 animate-pulse">
                              Order Pack Ho Raha Hai...
                            </h4>
                            <p className="text-xs text-coffee-600">
                              Dazeen Decaf packaging is being assembled organically.
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* Phase 2: Packing Success / Tick Transition */
                        <div className="relative flex flex-col items-center justify-center space-y-6">
                          <motion.div
                            initial={{ scale: 0.3, opacity: 0 }}
                            animate={{ scale: [0.3, 1.1, 1], rotateY: 180 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="h-20 w-20 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-600/20"
                          >
                            <Check className="w-10 h-10 stroke-[3]" />
                          </motion.div>

                          <div className="space-y-1">
                            <h4 className="font-serif text-xl font-bold text-emerald-800">
                              Order Verified! ✨
                            </h4>
                            <p className="text-xs text-coffee-600">
                              Verified with secure systems. Ready to fly!
                            </p>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Phase 3: Settled State (Tick flied up, details sequentially appear without boxes!) */}
                  {animPhase === "settled" && (
                    <div className="w-full flex-grow flex flex-col justify-start text-left space-y-6 pt-2 animate-fade-in">
                      
                      {/* Top Header with Fly Up Check Flip Tick & Order ID */}
                      <div className="flex items-center gap-3.5 pb-4 border-b border-coffee-200">
                        {/* Check flip flight animation */}
                        <motion.div
                          initial={{ 
                            y: 100, 
                            scale: 1.6, 
                            rotateY: 0,
                            x: 80
                          }}
                          animate={{ 
                            y: 0, 
                            scale: 1, 
                            rotateY: 360,
                            x: 0
                          }}
                          transition={{ 
                            duration: 0.85, 
                            ease: [0.16, 1, 0.3, 1] 
                          }}
                          className="h-10 w-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md shadow-emerald-500/10 flex-shrink-0"
                        >
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        </motion.div>

                        {/* Order ID fade-in beside */}
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                          className="flex flex-col text-left"
                        >
                          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-coffee-400 leading-none mb-0.5">
                            Order Successfully Booked
                          </span>
                          <span className="font-mono text-base font-extrabold text-coffee-950 flex items-center gap-1.5 leading-none">
                            ID: <span className="text-emerald-700">{orderId}</span>
                          </span>
                        </motion.div>
                      </div>

                      {/* Staggered Receipts Specs - Borderless & Flat design ("box me nahi rahega kuch") */}
                      <div className="space-y-4 py-2">
                        
                        {/* Dispatch block */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex justify-between items-baseline py-1 text-xs"
                        >
                          <span className="text-coffee-500 font-medium">Scheduled Dispatch</span>
                          <span className="font-mono text-coffee-900 font-bold">Within 4 Hours (Today)</span>
                        </motion.div>

                        {/* Delivery address details summary */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.65 }}
                          className="space-y-1.5 py-1"
                        >
                          <span className="text-coffee-500 font-medium text-xs block">Delivery Location</span>
                          <span className="text-coffee-900 text-xs font-bold font-sans block leading-relaxed">
                            {fullName} | {phoneNumber}
                          </span>
                          <span className="text-coffee-600 text-[11px] block leading-relaxed">
                            {streetAddress}
                          </span>
                        </motion.div>

                        {/* Courier Details */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          className="flex justify-between items-baseline py-1 text-xs border-t border-dashed border-coffee-200 pt-3"
                        >
                          <span className="text-coffee-500 font-medium">Active Transit Estimate</span>
                          <span className="text-indigo-700 font-bold text-right text-[11px]">
                            {currentCityEstimate.days} {currentCityEstimate.days === 1 ? "Day" : "Days"} ({currentCityEstimate.name} Hub)
                          </span>
                        </motion.div>

                        {/* Price payment summary */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.95 }}
                          className="flex justify-between items-baseline py-1 text-xs border-t border-dashed border-coffee-200 pt-3"
                        >
                          <span className="text-coffee-500 font-medium">Safe Pay Method</span>
                          <span className="font-mono text-coffee-900 font-bold">
                            {payMethod === "COD" ? "🚚 Cash on Delivery" : `📱 Instant UPI Gateway`}
                          </span>
                        </motion.div>

                        {/* Final paid summary amount */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1 }}
                          className="flex justify-between items-baseline pt-5"
                        >
                          <span className="text-coffee-900 font-extrabold text-sm font-sans uppercase tracking-wide">
                            Total Paid Amount
                          </span>
                          <span className="text-emerald-700 font-mono text-xl font-extrabold">
                            ₹{totals.finalAmount}
                          </span>
                        </motion.div>

                      </div>

                      {/* Decaf Community Promise */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3 }}
                        className="text-[11px] text-coffee-500 text-center italic pt-4 leading-relaxed border-t border-dashed border-coffee-200 mt-2"
                      >
                        "Dhanyawad! Dazeen decaf protects your deep restful sleep sleep-cycle and avoids caffeine crashes completely."
                      </motion.div>

                      {/* Close & Continue exploring button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.45 }}
                        className="pt-6 mt-auto w-full"
                      >
                        <button
                          onClick={handleCloseClear}
                          className="w-full py-4 bg-coffee-900 hover:bg-coffee-800 text-white rounded-xl text-xs font-bold font-mono tracking-wider transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-1"
                        >
                          Explore More Coffee Blends
                        </button>
                      </motion.div>

                    </div>
                  )}

                </div>
              ) : isCheckingOut ? (
                /* SECURE CHECKOUT SCREEN */
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-lg font-bold text-coffee-950">
                      🇮🇳 Shipping Details
                    </h4>
                    <button
                      onClick={() => setIsCheckingOut(false)}
                      className="text-xs text-accent-darkgold font-bold underline"
                    >
                      Back to Basket
                    </button>
                  </div>

                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    
                    {/* Full Name input */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-coffee-800 uppercase tracking-wide">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Deshmukh"
                        className="w-full p-3 rounded-lg border border-coffee-200 bg-white text-sm focus:outline-none focus:border-coffee-900 block"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-coffee-800 uppercase tracking-wide">
                        Contact Number (10-Digit) *
                      </label>
                      <input
                        type="tel"
                        required
                        pattern="^[6-9]\d{9}$"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full p-3 rounded-lg border border-coffee-200 bg-white text-sm focus:outline-none focus:border-coffee-900 block"
                      />
                    </div>

                    {/* Street Address */}
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-coffee-800 uppercase tracking-wide">
                        Complete Delivery Address *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="Apartment flat, colony, street, landmarks, city"
                        className="w-full p-3 rounded-lg border border-coffee-200 bg-white text-sm focus:outline-none focus:border-coffee-900 block resize-none"
                      />
                    </div>

                    {/* Shipping City Quick Badge */}
                    <div className="p-3 bg-white border border-coffee-150 rounded-xl space-y-1">
                      <p className="text-[11px] text-coffee-500 font-bold uppercase tracking-wider">
                        Active Shipping Hub
                      </p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-coffee-900">🎁 Delivery Destination: {deliveryCity}</span>
                        <span className="text-indigo-700 font-bold">{currentCityEstimate.days} {currentCityEstimate.days === 1 ? "Day" : "Days"}</span>
                      </div>
                    </div>

                    {/* Payment Mode Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-coffee-800 uppercase tracking-wide block text-left">
                        Secure Payment Method
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        
                        <button
                          type="button"
                          onClick={() => setPayMethod("UPI")}
                          className={`p-3 rounded-xl border flex items-center gap-2 justify-center transition-all cursor-pointer text-xs ${
                            payMethod === "UPI"
                              ? "bg-coffee-900 text-white border-coffee-900 shadow-sm"
                              : "bg-white text-coffee-700 border-coffee-200"
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" /> Instant UPI (GPay/PayMe)
                        </button>

                        <button
                          type="button"
                          onClick={() => setPayMethod("COD")}
                          className={`p-3 rounded-xl border flex items-center gap-2 justify-center transition-all cursor-pointer text-xs ${
                            payMethod === "COD"
                              ? "bg-coffee-900 text-white border-coffee-900 shadow-sm"
                              : "bg-white text-coffee-700 border-coffee-200"
                          }`}
                        >
                          🚚 Pay on Delivery (COD)
                        </button>

                      </div>
                    </div>

                    {/* Save to Profile Option Toggle */}
                    {currentUser && (
                      <div className="flex items-start gap-2.5 p-3 bg-coffee-100/50 border border-coffee-200/50 rounded-xl text-left select-none">
                        <input
                          id="save_profile_opt"
                          type="checkbox"
                          checked={saveToProfileOption}
                          onChange={(e) => setSaveToProfileOption(e.target.checked)}
                          className="mt-0.5 h-4 w-4 text-coffee-900 border-coffee-300 rounded focus:ring-0 cursor-pointer accent-coffee-900"
                        />
                        <label htmlFor="save_profile_opt" className="text-[11px] text-coffee-800 cursor-pointer leading-tight">
                          <strong className="text-coffee-950 font-bold block mb-0.5">Save shipping info to my profile</strong>
                          Automatically populate my profile with these delivery coordinates.
                        </label>
                      </div>
                    )}

                    {/* Order summary small print */}
                    <div className="border-t border-coffee-200 pt-4 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-coffee-600">Total payable amount:</span>
                        <strong className="text-coffee-950 font-mono text-sm">₹{totals.finalAmount}</strong>
                      </div>
                    </div>

                    {/* Submit checkout buttons */}
                    <button
                      type="submit"
                      disabled={isProcessingPay}
                      className="w-full py-4 bg-coffee-900 hover:bg-coffee-850 text-coffee-50 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider font-mono cursor-pointer disabled:opacity-50"
                    >
                      {isProcessingPay ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verifying Secure Gateways...</span>
                        </>
                      ) : (
                        `Place Safe Order (₹${totals.finalAmount})`
                      )}
                    </button>

                  </form>
                </div>
              ) : (
                /* STANDARD SHOPPING CART VIEW */
                <>
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                    {cart.length === 0 ? (
                      /* EMPTY BASKET */
                      <div className="text-center py-20 space-y-4">
                        <span className="text-5xl">☕💤</span>
                        <h4 className="font-serif text-lg font-bold text-coffee-900">
                          Your Coffee Cup is Empty
                        </h4>
                        <p className="text-xs text-coffee-500 max-w-xs mx-auto">
                          Add our premium caffeine-free gourmet blends. Start enjoying deep rest and zero anxious jitters.
                        </p>
                        <button
                          onClick={onClose}
                          className="px-5 py-2.5 bg-coffee-900 text-coffee-50 rounded-xl text-xs font-bold tracking-wider hover:bg-coffee-800 transition cursor-pointer"
                        >
                          Explore Blends
                        </button>
                      </div>
                    ) : (
                      /* ACTIVE CART ITEMS LIST */
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div
                            key={item.product.id}
                            className="bg-white p-3.5 rounded-2xl border border-coffee-150 flex gap-3 h-auto relative shadow-sm"
                          >
                            {/* Product mini-img */}
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-16 h-16 rounded-xl object-cover"
                              referrerPolicy="no-referrer"
                            />
                            
                            {/* Title & modifications */}
                            <div className="flex-grow flex flex-col justify-between">
                              <div>
                                <h5 className="font-serif font-bold text-[13px] text-coffee-950 leading-tight">
                                  {item.product.name}
                                </h5>
                                <p className="text-[10px] text-coffee-400 font-mono">
                                  Pack: 250g Jar | {item.product.caffeineCount}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-1">
                                <span className="font-mono text-xs font-bold text-coffee-900">
                                  ₹{item.product.price}
                                </span>

                                {/* Quantity Control button strip */}
                                <div className="flex items-center border border-coffee-200 bg-coffee-50/55 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                                    className="p-1 px-2 hover:bg-coffee-200 text-coffee-600 transition"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-2 font-mono text-[11px] font-bold text-coffee-900">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                                    className="p-1 px-2 hover:bg-coffee-200 text-coffee-600 transition"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Remove item absolute button */}
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="absolute top-2 right-2 text-coffee-300 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {/* Interactive local shipping estimate selector */}
                        <div className="p-4 bg-white rounded-2xl border border-coffee-150 space-y-3">
                          <div className="flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-accent-darkgold" />
                            <h5 className="text-xs font-bold text-coffee-900">
                              Indian Shipping City Estimate
                            </h5>
                          </div>
                          
                          <div className="flex gap-2">
                            <select
                              value={deliveryCity}
                              onChange={(e) => setDeliveryCity(e.target.value)}
                              className="flex-grow p-2 text-xs border border-coffee-200 bg-coffee-50 rounded-lg focus:outline-none"
                            >
                              {INDIAN_CITIES.map((c) => (
                                <option key={c.name} value={c.name}>
                                  {c.name} (Hub)
                                </option>
                              ))}
                            </select>
                            
                            <form onSubmit={handlePinCodeCheck} className="flex gap-1.5 max-w-[140px]">
                              <input
                                type="text"
                                maxLength={6}
                                value={pinCode}
                                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
                                placeholder="Pincode e.g. 400001"
                                className="w-full text-xs p-2 border border-coffee-200 bg-coffee-50 rounded-lg focus:outline-none font-mono"
                              />
                            </form>
                          </div>

                          <div className="text-[11px] text-coffee-600 text-left bg-coffee-50 p-2.5 rounded-lg">
                            {pinSuccess ? (
                              <span className="text-[#B4942B] font-semibold">{pinSuccess}</span>
                            ) : (
                              <span>Standard shipping to <strong>{deliveryCity}</strong> delivers in <strong>{currentCityEstimate.days} {currentCityEstimate.days === 1 ? "day" : "days"}</strong> via Express BlueDart Air.</span>
                            )}
                          </div>
                        </div>

                        {/* Coupon validation strip */}
                        <div className="bg-white rounded-2xl p-4 border border-coffee-150 space-y-2">
                          <div className="flex items-center gap-1.5">
                            <Ticket className="w-4 h-4 text-emerald-600" />
                            <h5 className="text-xs font-bold text-coffee-900">
                              Have a promo discount code?
                            </h5>
                          </div>

                          {activeCoupon ? (
                            <div className="flex justify-between items-center text-xs p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
                              <span className="font-semibold font-mono font-sans flex items-center gap-1">
                                <Check className="w-4 h-4" /> Applied: {activeCoupon.code} (-{activeCoupon.type === "percent" ? `${activeCoupon.value}%` : `₹${activeCoupon.value}`})
                              </span>
                              <button
                                onClick={() => setActiveCoupon(null)}
                                className="text-xs underline text-emerald-950 font-bold cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value)}
                                placeholder="Try CELEBRATE or SHANTIBREW"
                                className="flex-grow p-2 text-xs border border-coffee-200 bg-coffee-50 rounded-lg uppercase font-mono"
                              />
                              <button
                                onClick={handleApplyCoupon}
                                className="px-4 bg-coffee-900 text-coffee-50 text-xs rounded-lg font-bold hover:bg-coffee-800 transition cursor-pointer"
                              >
                                Apply
                              </button>
                            </div>
                          )}

                          {couponError && (
                            <p className="text-[11px] text-rose-600 text-left font-sans">{couponError}</p>
                          )}
                          <p className="text-[10px] text-coffee-400 italic">
                            * Use code <strong>CELEBRATE</strong> for 10% Off. Use <strong>SHANTIBREW</strong> for flat ₹100 Off (orders &gt; ₹700).
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DRAWER FOOTER: PRICING METRICS & CHECKOUT BUTTON */}
                  {cart.length > 0 && (
                    <div className="bg-white p-6 border-t border-coffee-150 space-y-4">
                      <div className="space-y-1.5 text-xs">
                        
                        <div className="flex justify-between">
                          <span className="text-coffee-600">Subtotal:</span>
                          <span className="font-mono font-medium text-coffee-950">₹{totals.subtotal}</span>
                        </div>

                        {totals.discount > 0 && (
                          <div className="flex justify-between text-emerald-700">
                            <span>Coupon Discount:</span>
                            <span className="font-mono font-medium">-₹{totals.discount}</span>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <span className="text-coffee-600">Standard Transit Fee:</span>
                          <span className="font-mono font-medium text-coffee-950">
                            {totals.shippingCharge === 0 ? (
                              <span className="text-emerald-700 font-bold uppercase tracking-wider text-[10px]">
                                Free (Orders &gt; ₹499)
                              </span>
                            ) : (
                              `₹${totals.shippingCharge}`
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between border-t border-coffee-100 pt-2.5 text-sm">
                          <strong className="text-coffee-950 font-semibold">Total Payable Box:</strong>
                          <strong className="font-mono text-coffee-950 text-lg">₹{totals.finalAmount}</strong>
                        </div>

                      </div>

                      {/* Trigger Checkout steps */}
                      {currentUser ? (
                        <button
                          onClick={() => setIsCheckingOut(true)}
                          className="w-full py-4 bg-coffee-900 hover:bg-coffee-800 text-[#FAF6F0] rounded-xl text-xs font-bold font-mono tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer uppercase"
                        >
                          <CreditCard className="w-4 h-4 text-accent-gold" />
                          <span>Secure Checkout (₹{totals.finalAmount})</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            onClose();
                            if (onOpenLogin) onOpenLogin();
                          }}
                          className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold font-mono tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer uppercase"
                        >
                          🔑 Sign In to Secure Checkout
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}

            </motion.div>
          </div>

        </div>
      )}
    </AnimatePresence>
  );
}
