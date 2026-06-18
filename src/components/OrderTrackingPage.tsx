import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, Calendar, Clock, ShoppingBag, ArrowRight, Truck, Package, HelpCircle, CheckCircle, Download, FileText } from "lucide-react";
import { Product } from "../types";

interface TrackingProps {
  currentUser: any;
  onOpenLogin: () => void;
}

export default function OrderTrackingPage({ currentUser, onOpenLogin }: TrackingProps) {
  const [searchId, setSearchId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorRec, setErrorRec] = useState<string | null>(null);

  // Status mapping to helper steps
  const STATUS_STEPS = [
    { label: "Pending", status: "Pending", description: "Order received & payment confirmed", icon: Package },
    { label: "Ready", status: "Ready for dispatch", description: "Freshly packaged & sealed in-house", icon: HelpCircle },
    { label: "Shipped", status: "Shipped", description: "In transit via courier partner", icon: Truck },
    { label: "Out for Delivery", status: "Out for delivery", description: "Arriving at your location today", icon: Truck },
    { label: "Delivered", status: "Delivered", description: "Delivered safely! Savor the aroma", icon: CheckCircle },
  ];

  // Load orders for current logged-in user from local storage
  const loadUserOrders = async () => {
    if (!currentUser) return;
    setLoading(true);
    setErrorRec(null);
    try {
      const cached = localStorage.getItem("dazeen_placed_orders_v1");
      if (cached) {
        const parsed = JSON.parse(cached);
        const filtered = parsed.filter((o: any) => o.userId === currentUser.uid);
        // Sort client-side by date
        filtered.sort((a: any, b: any) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setUserOrders(filtered);
      } else {
        setUserOrders([]);
      }
    } catch (err: any) {
      console.error(err);
      setErrorRec("Unable to fetch orders from storage.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch individual tracked order by ID from local storage
  const handleSearchOrder = async (orderIdToTrack: string) => {
    const formattedId = orderIdToTrack.trim();
    if (!formattedId) return;

    setLoading(true);
    setErrorRec(null);
    setTrackedOrder(null);
    try {
      const cached = localStorage.getItem("dazeen_placed_orders_v1");
      if (cached) {
        const parsed = JSON.parse(cached);
        const found = parsed.find((o: any) => o.id.toLowerCase() === formattedId.toLowerCase());
        if (found) {
          setTrackedOrder(found);
          setLoading(false);
          return;
        }
      }
      setErrorRec("Order ID not found. Verify code and try again.");
    } catch (err: any) {
      console.error(err);
      setErrorRec("Failed to search. Check storage permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserOrders();
  }, [currentUser]);

  // Determine active status index
  const getActiveStepIndex = (status: string) => {
    if (status === "Cancelled") return -1;
    return STATUS_STEPS.findIndex((step) => step.status === status);
  };

  const activeStepIdx = trackedOrder ? getActiveStepIndex(trackedOrder.status) : -1;

  // Render timestamp helper
  const formatTime = (ts: any) => {
    if (!ts) return "Recently";
    if (ts.seconds) {
      return new Date(ts.seconds * 1000).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    }
    return new Date(ts).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleDownloadInvoice = (order: any) => {
    if (!order) return;
    
    const invoiceContent = `
============================================================
                     DAZEEN COFFEE CO.                       
                   OFFICIAL TAX INVOICE                     
============================================================
Order ID        : ${order.id}
Date Placed     : ${formatTime(order.createdAt)}
Payment Mode    : Credit Card / UPI / NetBanking
Order Status    : ${order.status}
------------------------------------------------------------
CUSTOMER DETAILS:
Name            : ${order.fullName}
Shipping Address: ${order.streetAddress}
PIN Code        : ${order.pinCode || "Custom"}
Phone/Mobile    : ${order.phoneNumber}
------------------------------------------------------------
ORDERED ITEMS DETAIL:
------------------------------------------------------------
${order.items?.map((item: any, idx: number) => {
  const itemPrice = item.price || item.product.price || 449;
  const subTotal = itemPrice * item.quantity;
  return `[${idx + 1}] ${item.product.name}
    Roast Level: ${item.product.roastLevel}
    Quantity   : ${item.quantity} Unit(s)
    Unit Price : ₹${itemPrice}
    Subtotal   : ₹${subTotal}
------------------------------------------------------------`;
}).join("\n")}

SUMMARY OF CHARGES:
Total Item Qtys : ${order.items?.reduce((s: number, i: any) => s + i.quantity, 0)} Units
Subtotal        : ₹${order.totalPrice}
Coupon Discounts: ₹0 (No active vouchers applied)
IGST (Included) : Estimated 5.0%
Delivery Fee    : ₹0 (FREE Priority Tracked Shipping)
------------------------------------------------------------
Grand Net Total : ₹${order.totalPrice}
============================================================
Thank you for choosing India's finest craft coffee beans.
Savor the rich complex aromas of our estates, sleep perfectly!
            Contact: support@dazeen.in | +91 98345 00977
============================================================
`;

    const blob = new Blob([invoiceContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice-${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12 bg-white">
      
      {/* Page Title */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-mono tracking-widest text-[#B4942B] font-bold">
          Dazeen Logistics Desk
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-black text-stone-900">
          Live Order Tracking System
        </h2>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Trace your gourmet coffee packages from the high-altitude premium estates to your coffee mug.
        </p>
      </div>

      {/* Main Grid: Search & Live Tracker */}
      <div className="grid md:grid-cols-12 gap-12 items-start bg-white">
        
        {/* Left Side: Search & User's Orders */}
        <div className="md:col-span-5 space-y-10 bg-white">
          <div className="bg-white space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-[#B4942B]" /> Search Order Directly
            </h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter ID e.g., DAZ-382910"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-grow px-4 py-3 bg-stone-50 rounded-xl text-xs border border-transparent text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-stone-100"
              />
              <button
                onClick={() => handleSearchOrder(searchId)}
                disabled={loading}
                className="px-5 py-3 bg-stone-900 hover:bg-stone-850 text-white rounded-xl text-xs font-mono font-semibold cursor-pointer transition-all"
              >
                Track
              </button>
            </div>

            {errorRec && (
              <p className="text-xs text-rose-700 font-medium bg-rose-50/50 p-2.5 rounded-xl">
                ⚠️ {errorRec}
              </p>
            )}
          </div>

          {/* User Order List (Only if logged in) */}
          <div className="bg-white space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B4942B]" /> Your Past Placements
            </h3>

            {!currentUser ? (
              <div className="py-8 text-center space-y-3 bg-stone-50/30 rounded-2xl">
                <p className="text-xs text-stone-500">Sign in to view all details and order histories.</p>
                <button
                  onClick={onOpenLogin}
                  className="px-4 py-2 bg-stone-900 rounded-xl font-bold font-mono text-[10px] text-white uppercase cursor-pointer hover:bg-stone-850 transition-colors"
                >
                  Sign In Now
                </button>
              </div>
            ) : loading ? (
              <p className="text-xs text-stone-400 py-4 text-center animate-pulse">Loading orders list...</p>
            ) : userOrders.length === 0 ? (
              <p className="text-xs text-stone-500 py-6 text-center">No placed orders found for your profile.</p>
            ) : (
              <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1">
                {userOrders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setTrackedOrder(o);
                      setErrorRec(null);
                    }}
                    className={`w-full text-left py-3 px-2 text-xs transition-all flex justify-between items-center cursor-pointer border-b border-stone-100 ${
                      trackedOrder?.id === o.id
                        ? "text-stone-950 font-black bg-stone-50 rounded-lg px-3"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-50/50 rounded-lg"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <p className="font-mono font-bold">{o.id}</p>
                      <p className={`text-[10px] font-semibold ${trackedOrder?.id === o.id ? "text-stone-700" : "text-[#B4942B]"}`}>
                        ₹{o.totalPrice} • {o.items?.reduce((s: number, i: any) => s + i.quantity, 0)} Items
                      </p>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                        o.status === "Delivered" 
                          ? "bg-emerald-50 text-emerald-800" 
                          : o.status === "Cancelled" 
                          ? "bg-rose-50 text-rose-800" 
                          : "bg-amber-50 text-amber-800"
                      }`}>
                        {o.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Active Timeline Display */}
        <div className="md:col-span-7 bg-white">
          <AnimatePresence mode="wait">
            {trackedOrder ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white space-y-8"
              >
                {/* ID Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-100">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#B4942B] font-bold">
                      Currently Tracking
                    </span>
                    <h3 className="text-2xl font-mono font-bold text-stone-900">{trackedOrder.id}</h3>
                    <p className="text-[11px] text-stone-500">Placed: {formatTime(trackedOrder.createdAt)}</p>
                  </div>

                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    trackedOrder.status === "Delivered"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                      : trackedOrder.status === "Cancelled"
                      ? "bg-rose-50 text-rose-900 border border-rose-100"
                      : "bg-stone-50 text-[#B4942B] border border-stone-100"
                  }`}>
                    Status: {trackedOrder.status}
                  </span>
                </div>

                {/* Tracking Progress Timeline */}
                {trackedOrder.status === "Cancelled" ? (
                  <div className="text-rose-800 py-5 text-center space-y-2">
                    <p className="font-bold text-sm">❌ Order Cancelled</p>
                    <p className="text-xs">This order has been cancelled and refunded. If you have questions, contact us.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h4 className="font-serif text-sm font-bold text-stone-900">Shipment Timeline</h4>
                    <div className="relative pl-6 border-l-2 border-stone-200 space-y-8 py-2">
                      {STATUS_STEPS.map((step, idx) => {
                        const isCompleted = idx <= activeStepIdx;
                        const isCurrent = idx === activeStepIdx;
                        const IconComponent = step.icon;
                        
                        return (
                           <div key={idx} className="relative">
                            {/* Marker Icon Dot */}
                            <div className={`absolute -left-[35px] top-0.5 p-1.5 rounded-full border-2 transition-all ${
                              isCompleted 
                                ? "bg-stone-900 text-amber-200 border-stone-900" 
                                : "bg-white text-stone-300 border-stone-200"
                            }`}>
                              <IconComponent className="w-3.5 h-3.5" />
                            </div>

                            {/* Text detail */}
                            <div className="space-y-0.5 text-left">
                              <p className={`text-xs font-bold leading-none ${
                                isCurrent 
                                  ? "text-stone-950 text-sm font-extrabold" 
                                  : isCompleted 
                                  ? "text-stone-900" 
                                  : "text-stone-400"
                              }`}>
                                {step.label}
                                {isCurrent && (
                                  <span className="ml-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-150 uppercase tracking-widest animate-pulse">
                                    Active
                                  </span>
                                )}
                              </p>
                              <p className={`text-[10px] ${isCompleted ? "text-stone-600" : "text-stone-400"}`}>
                                {step.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Delivery Information details - FLAT and borderless */}
                <div className="grid sm:grid-cols-2 gap-8 text-left text-xs text-stone-850 py-6 border-t border-stone-100">
                  <div className="space-y-2">
                    <p className="font-serif font-bold text-stone-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#B4942B]" /> Shipping Destination
                    </p>
                    <div className="text-[11px] leading-relaxed text-stone-600 font-semibold space-y-0.5">
                      <p className="text-stone-900 font-bold">{trackedOrder.fullName}</p>
                      <p>{trackedOrder.streetAddress}</p>
                      <p>PIN: {trackedOrder.pinCode}</p>
                      <p>Phone: {trackedOrder.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="font-serif font-bold text-stone-900 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#B4942B]" /> Package Contents
                    </p>
                    <div className="max-h-[100px] overflow-y-auto space-y-1.5 pr-2">
                      {trackedOrder.items?.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-[11px] font-mono text-stone-600">
                          <span className="truncate max-w-[130px]">{item.product.name}</span>
                          <span className="font-bold flex-shrink-0">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-stone-100 flex justify-between font-bold text-stone-900">
                      <span>Paid Total:</span>
                      <span>₹{trackedOrder.totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Document / Invoice Action Area */}
                <div className="pt-3 flex flex-col sm:flex-row gap-3 items-center justify-between text-left border-t border-stone-100">
                  <div className="text-xs text-stone-500">
                    <p className="font-bold flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-[#B4942B]" /> Need an official copy of this receipt?</p>
                    <p className="text-[10px] text-stone-400">Contains GST breakdown, courier partner references, & sourcing data.</p>
                  </div>
                  <button
                    onClick={() => handleDownloadInvoice(trackedOrder)}
                    className="w-full sm:w-auto px-5 py-3 bg-stone-900 hover:bg-stone-850 text-white text-xs font-mono font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all duration-200"
                  >
                    <Download className="w-4.5 h-4.5 text-[#B4942B]" /> Download Invoice
                  </button>
                </div>

              </motion.div>
            ) : (
              <div className="h-full bg-white p-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center text-stone-400">
                  <Truck className="w-8 h-8 text-[#B4942B]" />
                </div>
                <div className="max-w-xs space-y-1">
                  <h4 className="font-serif text-lg font-bold text-stone-900">No Order Selected</h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Search an order code on the left, or select a previous order on your account to display the shipping roadmap.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
