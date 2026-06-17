import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, Calendar, Clock, ShoppingBag, ArrowRight, Truck, Package, HelpCircle, CheckCircle } from "lucide-react";
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
    { label: "Delivered", status: "Delivered", description: "Delivered safely! Savor the decaf", icon: CheckCircle },
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      
      {/* Page Title */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-mono tracking-widest text-accent-darkgold font-bold">
          Dazeen Logistics Desk
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-coffee-950">
          Live Order Tracking System 📦✈️
        </h2>
        <p className="text-xs text-coffee-600 max-w-md mx-auto">
          Trace your gourmet decaf packages from the high estates of Chikmagalur to your coffee mug.
        </p>
      </div>

      {/* Main Grid: Search & Live Tracker */}
      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Search & User's Orders */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-coffee-200/60 shadow-lg shadow-coffee-950/2 space-y-4">
            <h3 className="font-serif text-lg font-bold text-coffee-950 flex items-center gap-2">
              <Search className="w-5 h-5 text-accent-darkgold" /> Search Order Directly
            </h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter ID e.g., DAZ-382910"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-grow px-4 py-3 bg-[#FAF6F0] rounded-xl text-xs border border-coffee-200 text-coffee-900 placeholder-coffee-400 focus:outline-none focus:border-accent-gold"
              />
              <button
                onClick={() => handleSearchOrder(searchId)}
                disabled={loading}
                className="px-4 py-3 bg-coffee-950 hover:bg-coffee-900 text-amber-150 rounded-xl text-xs font-mono font-semibold cursor-pointer"
              >
                Track
              </button>
            </div>

            {errorRec && (
              <p className="text-xs text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-150">
                ⚠️ {errorRec}
              </p>
            )}
          </div>

          {/* User Order List (Only if logged in) */}
          <div className="bg-white p-6 rounded-3xl border border-coffee-200/60 shadow-lg shadow-coffee-950/2 space-y-4">
            <h3 className="font-serif text-lg font-bold text-coffee-950 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-accent-darkgold" /> Your Past Placements
            </h3>

            {!currentUser ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-xs text-coffee-500">Sign in to view all details and order histories.</p>
                <button
                  onClick={onOpenLogin}
                  className="px-4 py-2 bg-coffee-900 rounded-xl font-bold font-mono text-[10px] text-accent-amber uppercase cursor-pointer hover:bg-coffee-800 transition-colors"
                >
                  Sign In Now
                </button>
              </div>
            ) : loading ? (
              <p className="text-xs text-coffee-400 py-4 text-center animate-pulse">Loading orders list...</p>
            ) : userOrders.length === 0 ? (
              <p className="text-xs text-coffee-500 py-6 text-center">No placed orders found for your profile.</p>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {userOrders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setTrackedOrder(o);
                      setErrorRec(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all flex justify-between items-center cursor-pointer ${
                      trackedOrder?.id === o.id
                        ? "bg-coffee-900 text-white border-coffee-900 shadow-md"
                        : "bg-[#FAF6F0] text-coffee-900 hover:bg-coffee-100/50 border-coffee-150"
                    }`}
                  >
                    <div className="space-y-1">
                      <p className="font-mono font-bold">{o.id}</p>
                      <p className={`text-[10px] font-semibold ${trackedOrder?.id === o.id ? "text-amber-200" : "text-accent-darkgold"}`}>
                        ₹{o.totalPrice} • {o.items?.reduce((s: number, i: any) => s + i.quantity, 0)} Items
                      </p>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                        o.status === "Delivered" 
                          ? "bg-emerald-100 text-emerald-800" 
                          : o.status === "Cancelled" 
                          ? "bg-rose-100 text-rose-800" 
                          : "bg-amber-100 text-amber-800"
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
        <div className="md:col-span-7">
          <AnimatePresence mode="wait">
            {trackedOrder ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-coffee-200/60 shadow-xl shadow-coffee-950/2 space-y-8"
              >
                {/* ID Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-coffee-100">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#B4942B] font-bold">
                      Currently Tracking
                    </span>
                    <h3 className="text-2xl font-mono font-bold text-coffee-950">{trackedOrder.id}</h3>
                    <p className="text-[11px] text-coffee-500">Placed: {formatTime(trackedOrder.createdAt)}</p>
                  </div>

                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    trackedOrder.status === "Delivered"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : trackedOrder.status === "Cancelled"
                      ? "bg-rose-100 text-rose-900 border border-rose-200"
                      : "bg-amber-50 text-accent-darkgold border border-amber-200"
                  }`}>
                    Status: {trackedOrder.status}
                  </span>
                </div>

                {/* Tracking Progress Timeline */}
                {trackedOrder.status === "Cancelled" ? (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 p-5 rounded-2xl text-center space-y-2">
                    <p className="font-bold text-sm">❌ Order Cancelled</p>
                    <p className="text-xs">This order has been cancelled and refunded. If you have questions, contact us.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h4 className="font-serif text-sm font-bold text-coffee-900">Shipment Timeline</h4>
                    <div className="relative pl-6 border-l-2 border-coffee-150 space-y-8 py-2">
                      {STATUS_STEPS.map((step, idx) => {
                        const isCompleted = idx <= activeStepIdx;
                        const isCurrent = idx === activeStepIdx;
                        const IconComponent = step.icon;
                        
                        return (
                          <div key={idx} className="relative">
                            {/* Marker Icon Dot */}
                            <div className={`absolute -left-[35px] top-0.5 p-1.5 rounded-full border-2 transition-all ${
                              isCompleted 
                                ? "bg-coffee-900 text-accent-gold border-coffee-900 shadow-md shadow-coffee-900/10" 
                                : "bg-white text-coffee-300 border-coffee-150"
                            }`}>
                              <IconComponent className="w-3.5 h-3.5" />
                            </div>

                            {/* Text detail */}
                            <div className="space-y-0.5 text-left">
                              <p className={`text-xs font-bold leading-none ${
                                isCurrent 
                                  ? "text-coffee-950 text-sm font-extrabold" 
                                  : isCompleted 
                                  ? "text-coffee-900" 
                                  : "text-coffee-400"
                              }`}>
                                {step.label}
                                {isCurrent && (
                                  <span className="ml-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-150 uppercase tracking-widest animate-pulse">
                                    Active
                                  </span>
                                )}
                              </p>
                              <p className={`text-[10px] ${isCompleted ? "text-coffee-600" : "text-coffee-400"}`}>
                                {step.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Delivery Information details */}
                <div className="grid sm:grid-cols-2 gap-6 bg-[#FAF6F0] p-5 rounded-2xl border border-coffee-150 text-left text-xs text-coffee-800">
                  <div className="space-y-2">
                    <p className="font-serif font-bold text-coffee-950 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-accent-darkgold" /> Shipping Destination
                    </p>
                    <div className="text-[11px] leading-relaxed text-coffee-600 font-semibold space-y-0.5">
                      <p className="text-coffee-900 font-bold">{trackedOrder.fullName}</p>
                      <p>{trackedOrder.streetAddress}</p>
                      <p>PIN: {trackedOrder.pinCode}</p>
                      <p>Phone: {trackedOrder.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="font-serif font-bold text-coffee-950 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-accent-darkgold" /> Package Contents
                    </p>
                    <div className="max-h-[100px] overflow-y-auto space-y-1.5 pr-2">
                      {trackedOrder.items?.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-[11px] font-mono text-coffee-600">
                          <span className="truncate max-w-[130px]">{item.product.name}</span>
                          <span className="font-bold flex-shrink-0">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-coffee-200 flex justify-between font-bold text-coffee-900">
                      <span>Paid Total:</span>
                      <span>₹{trackedOrder.totalPrice}</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="h-full bg-white p-12 rounded-3xl border border-coffee-200/50 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center text-coffee-400 border border-coffee-100">
                  <Truck className="w-8 h-8 text-accent-gold" />
                </div>
                <div className="max-w-xs space-y-1">
                  <h4 className="font-serif text-lg font-bold text-coffee-950">No Order Selected</h4>
                  <p className="text-xs text-coffee-500 leading-relaxed">
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
