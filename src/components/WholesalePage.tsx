import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Coffee, 
  Package, 
  Plus, 
  Minus, 
  Check, 
  Truck, 
  ChevronRight, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Calculator, 
  Briefcase 
} from "lucide-react";
import { Product, CartItem } from "../types";
import { PRODUCTS } from "../data";

interface WholesalePageProps {
  onBackToHome: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

// Zone Mapping (Simplified Pin Code ranges)
function getZone(pincode: string): 'Local' | 'Zonal' | 'Metro' | 'National 1' | 'National 2' {
  if (!pincode || pincode.length < 2) return 'National 2';
  const code = parseInt(pincode.substring(0, 2), 10);
  if (isNaN(code)) return 'National 2';
  if (code >= 40 && code <= 44) return 'Local'; // Pune/Maharashtra region
  if (code >= 40 && code <= 49) return 'Zonal'; // Other Maharashtra
  if (code >= 11 && code <= 11) return 'Metro'; // Delhi
  if (code >= 50 && code <= 69) return 'National 1';
  return 'National 2';
}

// Shipping Rates (Using the 'High-End' of your provided range for safety)
const rates: Record<'Local' | 'Zonal' | 'Metro' | 'National 1' | 'National 2', Record<number, number>> = {
  'Local': { 1: 55, 2: 80, 5: 150 },
  'Zonal': { 1: 75, 2: 110, 5: 220 },
  'Metro': { 1: 90, 2: 140, 5: 300, 300: 300 },
  'National 1': { 1: 100, 2: 160, 5: 350 },
  'National 2': { 1: 130, 2: 200, 5: 480 }
};

function calculateShippingCost(weight: number, pincode: string): number {
  const zone = getZone(pincode);
  let shippingCost = 0;

  // Weight Logic
  if (weight <= 1) shippingCost = rates[zone][1];
  else if (weight <= 2) shippingCost = rates[zone][2];
  else shippingCost = rates[zone][5] || rates[zone][300] || 300;

  return shippingCost;
}

export default function WholesalePage({ onBackToHome, onAddToCart }: WholesalePageProps) {
  // Configured blends from the standard products list
  const [selectedBlend, setSelectedBlend] = useState<Product>(PRODUCTS[0]);
  const [wholesaleType, setWholesaleType] = useState<"packets" | "bulk">("packets");
  
  // Quantities
  const [packetsCount, setPacketsCount] = useState<number>(5); // Min 5
  const [bulkKg, setBulkKg] = useState<number>(5); // Min 1kg range 1-100

  // Pin Code entry state
  const [pincode, setPincode] = useState<string>("");

  // Quick success toaster/message state
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  // Calculate pricing
  // Retail price is e.g. Rp 449 / packet
  // Wholesale packets has a discount tier
  // 10-24 packets: 20% off
  // 25-49 packets: 28% off
  // 50-99 packets: 35% off
  // 100+ packets: 42% off
  const getPacketDiscount = (count: number) => {
    if (count >= 100) return 0.42;
    if (count >= 50) return 0.35;
    if (count >= 25) return 0.28;
    if (count >= 10) return 0.20;
    return 0;
  };

  const discountRate = getPacketDiscount(packetsCount);
  const retailPacketValue = selectedBlend.price * packetsCount;
  const wholesalePacketTotal = Math.round(retailPacketValue * (1 - discountRate));
  const wholesalePerPacketPrice = Math.round(selectedBlend.price * (1 - discountRate));

  // Bulk weight is priced per kg (Retail is usually 1 packet of 100g = Retail equivalent weight is ₹450 / 100g = ₹4500 per kg)
  // Let's price Wholesale loose beans/powder per kg:
  // 1 - 9 kg: ₹1300 per kg
  // 10 - 24 kg: ₹1150 per kg
  // 25 - 49 kg: ₹999 per kg
  // 50 - 100 kg: ₹849 per kg (insanely good bulk deal!)
  const getBulkPricePerKg = (kg: number) => {
    if (kg >= 50) return 849;
    if (kg >= 25) return 999;
    if (kg >= 10) return 1150;
    return 1300;
  };

  const currentBulkPerKgPrice = getBulkPricePerKg(bulkKg);
  const wholesaleBulkTotal = Math.round(bulkKg * currentBulkPerKgPrice);
  const retailBulkValue = Math.round(bulkKg * (selectedBlend.price * 10)); // approx retail per kg equivalence

  const activeTotal = wholesaleType === "packets" ? wholesalePacketTotal : wholesaleBulkTotal;
  const originalTotalValue = wholesaleType === "packets" ? retailPacketValue : retailBulkValue;
  const savingsAmount = originalTotalValue - activeTotal;

  // Shipping dynamic computation
  const isPincodeValid = /^\d{6}$/.test(pincode.trim());
  const totalWeightInKg = wholesaleType === "packets" ? (packetsCount * 0.10) : bulkKg;
  const identifiedZone = isPincodeValid ? getZone(pincode.trim()) : null;
  const shippingCharge = isPincodeValid ? calculateShippingCost(totalWeightInKg, pincode.trim()) : 0;
  const wholesaleGst = Math.round(activeTotal * 0.05);
  const grandTotalValue = activeTotal + shippingCharge + wholesaleGst;

  const handleOrderSubmit = () => {
    if (!isPincodeValid) return;

    // Generate virtual Product representation for the shopping cart
    const wholesaleId = `wholesale-${selectedBlend.id}-${wholesaleType}-${wholesaleType === "packets" ? packetsCount : bulkKg}`;
    const wholesaleName = `Wholesale - ${selectedBlend.name} (${wholesaleType === "packets" ? `${packetsCount} Packets` : `${bulkKg}kg Bulk Bag`}) [PIN: ${pincode}]`;
    
    const virtualProduct: Product = {
      ...selectedBlend,
      id: wholesaleId,
      name: wholesaleName,
      price: wholesaleType === "packets" ? wholesalePerPacketPrice : currentBulkPerKgPrice, // Set correct unit price
      tagline: `Wholesale Direct Estate dispatch • Zone: ${identifiedZone} • PIN: ${pincode}`,
      description: `Wholesale standard order batch. Type: ${wholesaleType === "packets" ? "Pre-packed 100g retail packets" : "Sealed double-wall barrier wholesale sack containing roasted coffee beans"} (Weight: ${totalWeightInKg}kg)`
    };

    const cartAddQuantity = wholesaleType === "packets" ? packetsCount : bulkKg;

    // Call state callback to add to central cart
    onAddToCart(virtualProduct, cartAddQuantity);

    // Show visual confirmation toast
    setAddedMessage(`Successfully added ${wholesaleName} directly to your shopping checkout cart!`);
    setTimeout(() => {
      setAddedMessage(null);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] selection:bg-[#5E0ED7]/5 text-stone-900 pb-24 md:pb-32 pt-28 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Breadcrumbs / Header Action Button */}
        <div className="mb-8">
          <button 
            onClick={onBackToHome}
            className="group flex items-center gap-2 text-xs font-mono font-black uppercase text-stone-500 hover:text-stone-900 transition-colors bg-stone-100 hover:bg-stone-200/80 px-4 py-2 rounded-full cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Retail Store</span>
          </button>
        </div>

        {/* Visual Title Header Section */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-[#5E0ED7] mb-1 font-mono text-[10px] font-extrabold uppercase tracking-widest">
            <Briefcase className="w-4 h-4" />
            <span>Premium B2B Boutique Wholesale Service</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight text-stone-950 mt-1">
            Bulk Coffee Sourcing Direct from Estate
          </h1>
          <p className="text-stone-500 text-sm sm:text-base mt-2 leading-relaxed">
            Configure direct dispatch logs to your cafe, boutique, or office. Minimum 10 retail packets or 1kg up to 100kg loose bags under certified high-purity seal filters.
          </p>
        </div>

        {/* Added message banner */}
        <AnimatePresence>
          {addedMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-sans font-bold rounded-2xl flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{addedMessage}</span>
              </div>
              <button 
                onClick={() => setAddedMessage(null)}
                className="text-[10px] uppercase font-mono tracking-wider text-emerald-600 hover:text-emerald-950 px-2 py-1 bg-white/40 rounded-lg"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main interactive grid splitting controls and quote */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7 COLUMNS: Step selectors */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* STEP 1: Select Blend */}
            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#5E0ED7] text-white font-mono text-[10px] font-bold flex items-center justify-center">1</span>
                  <h3 className="text-sm font-sans font-extrabold uppercase tracking-wide text-stone-850">Select Specialty Blend</h3>
                </div>
                <span className="text-[10px] font-mono text-stone-400">Pure Water Processed</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PRODUCTS.map((blend) => {
                  const isSelected = selectedBlend.id === blend.id;
                  return (
                    <button
                      key={blend.id}
                      onClick={() => setSelectedBlend(blend)}
                      className={`text-left p-4 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                        isSelected 
                          ? "border-[#5E0ED7] bg-[#5E0ED7]/[0.015] ring-2 ring-[#5E0ED7]/20" 
                          : "border-stone-200/70 hover:border-stone-300 bg-white"
                      }`}
                    >
                      <div>
                        {/* Blend image & tag */}
                        <div className="relative w-full h-24 rounded-xl overflow-hidden mb-3 bg-stone-100">
                          <img src={blend.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={blend.name} />
                          <div className="absolute top-2 right-2 px-2 py-0.5 bg-stone-900/80 text-white font-mono text-[8px] uppercase tracking-wider rounded-md font-bold">
                            {blend.roastLevel} Roast
                          </div>
                        </div>

                        <h4 className="font-extrabold text-[#12100E] text-xs leading-snug sm:text-sm">{blend.name}</h4>
                        <p className="text-[10px] text-stone-500 line-clamp-2 mt-1 mb-2 leading-relaxed h-[30px]">
                          {blend.tagline}
                        </p>
                      </div>

                      <div className="border-t border-stone-100/80 pt-2.5 mt-2 flex items-center justify-between">
                        <span className="font-mono text-xs text-stone-850 font-black">
                          ₹{blend.price} <span className="text-[10px] text-stone-400 font-normal">/ packet</span>
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#5E0ED7] flex items-center justify-center text-white scale-110">
                            <Check className="w-2.5 h-2.5 stroke-[4]" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Choose Order Method (Packets vs Kilograms) */}
            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#5E0ED7] text-white font-mono text-[10px] font-bold flex items-center justify-center">2</span>
                  <h3 className="text-sm font-sans font-extrabold uppercase tracking-wide text-stone-850">Choose Packaging Type</h3>
                </div>
                <span className="text-[10px] font-mono text-stone-400">Select order scale</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setWholesaleType("packets")}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    wholesaleType === "packets"
                      ? "border-[#5E0ED7] bg-stone-950 text-white shadow-md shadow-stone-950/10"
                      : "border-stone-200/70 hover:border-stone-300 text-stone-700 bg-white hover:bg-stone-50"
                  }`}
                >
                  <Package className={`w-5 h-5 mx-auto mb-2 ${wholesaleType === "packets" ? "text-[#a3e635]" : "text-stone-500"}`} />
                  <h4 className="text-xs font-black uppercase tracking-wider">Retail Packets</h4>
                  <p className={`text-[9px] mt-1 ${wholesaleType === "packets" ? "text-stone-300" : "text-stone-400"}`}>
                    Min 5 Pre-packaged packs (100g)
                  </p>
                </button>

                <button
                  onClick={() => setWholesaleType("bulk")}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    wholesaleType === "bulk"
                      ? "border-[#5E0ED7] bg-stone-950 text-white shadow-md shadow-stone-950/10"
                      : "border-stone-200/70 hover:border-stone-300 text-stone-700 bg-white hover:bg-stone-50"
                  }`}
                >
                  <Coffee className={`w-5 h-5 mx-auto mb-2 ${wholesaleType === "bulk" ? "text-amber-400" : "text-stone-500"}`} />
                  <h4 className="text-xs font-black uppercase tracking-wider">Bulk Loose Weights</h4>
                  <p className={`text-[9px] mt-1 ${wholesaleType === "bulk" ? "text-stone-300" : "text-stone-400"}`}>
                    1kg to 100kg vacuum sealed bags
                  </p>
                </button>
              </div>
            </div>

            {/* STEP 3: Quantity configuration */}
            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#5E0ED7] text-white font-mono text-[10px] font-bold flex items-center justify-center">3</span>
                  <h3 className="text-sm font-sans font-extrabold uppercase tracking-wide text-stone-850">Adjust Quantity Selector</h3>
                </div>
                <span className="text-[10px] font-mono text-[#5E0ED7] font-bold">Slide to view progressive discounts</span>
              </div>

              {wholesaleType === "packets" ? (
                /* packets control */
                <div className="space-y-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="block text-[9px] font-mono text-stone-400 uppercase tracking-widest font-black">Order Size</span>
                      <p className="text-2xl font-black font-mono text-stone-900 mt-1">
                        {packetsCount} <span className="text-xs text-stone-400 font-normal">Packets (100g each)</span>
                      </p>
                      <span className="text-[10px] text-emerald-600 block leading-tight mt-0.5 font-bold">
                        Total net volume: {(packetsCount * 0.10).toFixed(1)}kg
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        disabled={packetsCount <= 5}
                        onClick={() => setPacketsCount(prev => Math.max(5, prev - 5))}
                        className="w-10 h-10 rounded-xl border border-stone-250 flex items-center justify-center hover:bg-stone-50 hover:border-stone-400 transition-colors cursor-pointer group active:scale-95 disabled:hover:bg-white disabled:opacity-40"
                      >
                        <Minus className="w-4 h-4 text-stone-600 group-hover:text-stone-950" />
                      </button>
                      <button 
                        onClick={() => setPacketsCount(prev => Math.min(250, prev + 5))}
                        className="w-10 h-10 rounded-xl border border-stone-250 flex items-center justify-center hover:bg-stone-50 hover:border-stone-400 transition-colors cursor-pointer group active:scale-95"
                      >
                        <Plus className="w-4 h-4 text-stone-600 group-hover:text-stone-950" />
                      </button>
                    </div>
                  </div>

                  {/* Slider Control */}
                  <div className="space-y-1">
                    <input 
                      type="range"
                      min="5"
                      max="250"
                      step="5"
                      value={packetsCount}
                      onChange={(e) => setPacketsCount(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#5E0ED7]"
                    />
                    <div className="flex justify-between font-mono text-[9px] text-stone-400">
                      <span>Min: 5 packs</span>
                      <span>Max: 250 packs</span>
                    </div>
                  </div>

                  {/* Discount indicator box */}
                  <div className="p-3 bg-stone-50 border border-stone-150 rounded-xl flex items-center justify-between text-xs font-sans">
                    <span className="text-stone-500 font-bold">Active bundle scale:</span>
                    <span className="font-mono bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-100 font-extrabold">
                      {Math.round(discountRate * 100)}% Direct Factory Off
                    </span>
                  </div>
                </div>
              ) : (
                /* bulk kilograms control */
                <div className="space-y-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="block text-[9px] font-mono text-stone-400 uppercase tracking-widest font-black">Total Weight</span>
                      <p className="text-2xl font-black font-mono text-stone-900 mt-1">
                        {bulkKg} <span className="text-xs text-stone-400 font-normal">Kilograms (kg)</span>
                      </p>
                      <span className="text-[10px] text-[#5E0ED7] block leading-tight mt-0.5 font-bold">
                        Packaged in heat-barrier bulk freshness sacks
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        disabled={bulkKg <= 1}
                        onClick={() => setBulkKg(prev => Math.max(1, prev - 1))}
                        className="w-10 h-10 rounded-xl border border-stone-250 flex items-center justify-center hover:bg-stone-50 hover:border-stone-400 transition-colors cursor-pointer group active:scale-95 disabled:hover:bg-white disabled:opacity-40"
                      >
                        <Minus className="w-4 h-4 text-stone-600 group-hover:text-stone-950" />
                      </button>
                      <button 
                        onClick={() => setBulkKg(prev => Math.min(100, prev + 1))}
                        className="w-10 h-10 rounded-xl border border-stone-250 flex items-center justify-center hover:bg-stone-50 hover:border-stone-400 transition-colors cursor-pointer group active:scale-95"
                      >
                        <Plus className="w-4 h-4 text-stone-600 group-hover:text-stone-950" />
                      </button>
                    </div>
                  </div>

                  {/* Slider Control */}
                  <div className="space-y-1">
                    <input 
                      type="range"
                      min="1"
                      max="100"
                      step="1"
                      value={bulkKg}
                      onChange={(e) => setBulkKg(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-900"
                    />
                    <div className="flex justify-between font-mono text-[9px] text-stone-400">
                      <span>Min: 1 kg</span>
                      <span>10 kg (Save 11%)</span>
                      <span>25 kg (Save 23%)</span>
                      <span>50 kg (Save 34%)</span>
                      <span>Max: 100 kg</span>
                    </div>
                  </div>

                  {/* Pricing tier details */}
                  <div className="p-3 bg-stone-50 border border-stone-150 rounded-xl flex items-center justify-between text-xs font-sans">
                    <span className="text-stone-500 font-bold">Weight Class Rate:</span>
                    <span className="font-mono bg-stone-900 text-white px-2.5 py-1 rounded-lg font-extrabold text-[11px]">
                      ₹{currentBulkPerKgPrice} / kg
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 4: Shipping Destination Pincode */}
            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#5E0ED7] text-white font-mono text-[10px] font-bold flex items-center justify-center">4</span>
                  <h3 className="text-sm font-sans font-extrabold uppercase tracking-wide text-stone-850">Shipping Destination Pincode</h3>
                </div>
                <span className="text-[10px] font-mono text-stone-400">Pincode Required</span>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-[10px] font-mono text-stone-400 uppercase tracking-widest font-black mb-1.5">
                    Enter 6-Digit Delivery Pincode *
                  </label>
                  <input 
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Allow digits only
                      setPincode(value);
                    }}
                    placeholder="e.g. 411001 (Pune)"
                    className={`w-full px-4 py-3.5 rounded-2xl border text-sm font-mono tracking-widest placeholder:text-stone-300 focus:outline-none focus:ring-2 transition-all ${
                      isPincodeValid
                        ? "border-emerald-500 bg-emerald-50/10 focus:ring-emerald-500/20"
                        : pincode.length === 6
                          ? "border-rose-300 bg-rose-50/5 focus:ring-rose-250"
                          : "border-stone-250 focus:border-[#5E0ED7] focus:ring-[#5E0ED7]/20"
                    }`}
                  />
                  {isPincodeValid && (
                    <span className="absolute right-4 bottom-3 text-emerald-600 font-mono text-[10px] font-black uppercase flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 select-none">
                      <Check className="w-3 h-3 stroke-[3]" /> Verified {identifiedZone}
                    </span>
                  )}
                </div>

                {isPincodeValid ? (
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-stone-500">
                      <span>Identified Logistics Region:</span>
                      <span className="font-mono text-stone-850 font-black uppercase tracking-wider">{identifiedZone}</span>
                    </div>
                    <div className="flex justify-between items-center text-stone-500">
                      <span>Calculated Package Weight:</span>
                      <span className="font-mono text-stone-800 font-bold">{totalWeightInKg.toFixed(2)} kg</span>
                    </div>
                    <div className="flex justify-between items-center text-stone-500">
                      <span>Standard GST (5%):</span>
                      <span className="font-mono text-stone-800 font-bold">₹{wholesaleGst}</span>
                    </div>
                    <div className="flex justify-between items-center text-stone-900 pt-1.5 border-t border-stone-200/65 font-bold">
                      <span className="flex items-center gap-1 text-[#5E0ED7]"><Truck className="w-3.5 h-3.5" /> Est. Dynamic Shipping charge:</span>
                      <span className="font-mono text-stone-900">₹{shippingCharge}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-[#FFF6F6] text-[#A84A4A] text-[11px] leading-relaxed border border-[#EAA2A2]/30 flex items-start gap-2.5">
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    <p>Please enter a valid <strong>6-digit numeric pincode</strong> inside this field. Shipping cost logic and checkout cart entries are strictly locked until a valid pincode is supplied.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sourcing logistics info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-stone-200 bg-stone-50/40 rounded-2xl flex gap-3 text-left">
                <Truck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Direct Factory Sourcing</h4>
                  <p className="text-[10px] text-stone-500 leading-normal mt-0.5">We dispatch from the shade-grown estates straight to Pune within 24 hours of roasting logs.</p>
                </div>
              </div>
              <div className="p-4 border border-stone-200 bg-stone-50/40 rounded-2xl flex gap-3 text-left">
                <ShieldCheck className="w-5 h-5 text-[#5E0ED7] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Quality Certified Seal</h4>
                  <p className="text-[10px] text-stone-500 leading-normal mt-0.5">Every bag comes vacuum stabilized under carbon filtration. Lab certified 0% heavy residue.</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 5 COLUMNS: Wholesale Quote Invoice Slip */}
          <div className="lg:col-span-5 static lg:sticky lg:top-28">
            <div className="bg-stone-900 border border-stone-805 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-stone-800 rounded-full blur-3xl opacity-30 select-none pointer-events-none" />
              
              {/* Slip Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-stone-400">Order Quote Slip</span>
                </div>
                <span className="px-2 py-0.5 bg-stone-800 rounded text-[9px] font-mono text-amber-400 uppercase tracking-widest font-black">
                  Active Live B2B Rates
                </span>
              </div>

              {/* Quote configuration list */}
              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block select-none">Selected Blend</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-sans font-extrabold text-stone-200">{selectedBlend.name}</span>
                    <span className="text-xs font-mono text-stone-400">{selectedBlend.roastLevel} Roast</span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block select-none">Quantity Structure</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-sans font-extrabold text-white">
                      {wholesaleType === "packets" ? `${packetsCount} Packets of 100g` : `${bulkKg} Kilograms (kg)`}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-extrabold">
                      {wholesaleType === "packets" ? `${Math.round(discountRate * 100)}% Volume Off` : "Bulk Loose Rate"}
                    </span>
                  </div>
                </div>

                {isPincodeValid ? (
                  <div className="border-t border-stone-800 pt-4 space-y-2">
                    <div className="flex justify-between text-xs font-sans text-stone-400">
                      <span>Regular Retail Equivalent</span>
                      <span className="font-mono line-through">₹{originalTotalValue}</span>
                    </div>
                    
                    <div className="flex justify-between text-xs font-sans text-stone-400 items-center">
                      <span>Wholesale Sourced Base</span>
                      <span className="font-mono text-stone-200 font-medium">₹{activeTotal}</span>
                    </div>

                    <div className="flex justify-between text-xs font-sans text-stone-400 items-center">
                      <span>Dynamic Shipping ({identifiedZone})</span>
                      <span className="font-mono text-stone-200 font-medium">₹{shippingCharge}</span>
                    </div>

                    <div className="flex justify-between text-xs font-sans text-stone-400 items-center">
                      <span>Standard GST (5%)</span>
                      <span className="font-mono text-stone-200 font-medium">₹{wholesaleGst}</span>
                    </div>

                    <div className="flex justify-between text-xs font-sans text-emerald-400 font-bold items-center pt-2 border-t border-stone-800/60">
                      <span>Absolute Profit Savings</span>
                      <span className="font-mono text-emerald-400">- ₹{savingsAmount} ({Math.round((savingsAmount / originalTotalValue) * 100)}% saved)</span>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-stone-800 pt-4">
                    <div className="p-3.5 bg-stone-950/80 border border-stone-800/50 rounded-2xl text-center text-xs text-amber-400">
                      <p className="font-mono text-[10px] uppercase font-bold tracking-wider mb-1">⚠️ PINCODE REQUIRED</p>
                      <p className="text-[10px] text-stone-400 leading-normal">Enter a 6-digit delivery pincode on the left to estimate regional shipping charges and subtotal values.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Invoice Total Display */}
              <div className="p-4 bg-stone-950 border border-stone-800/60 rounded-2xl space-y-1.5 text-left mb-6">
                <span className="text-[8px] font-mono text-stone-500 uppercase tracking-widest font-black block">Total Custom Wholesale Quote</span>
                {isPincodeValid ? (
                  <div className="flex items-baseline justify-between">
                    <div className="font-mono text-2xl sm:text-3xl font-black text-white">
                      ₹{grandTotalValue}
                      <span className="text-[10px] text-stone-500 font-normal ml-1">fully processed</span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 font-extrabold flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3" /> Includes Shipping
                    </span>
                  </div>
                ) : (
                  <div className="font-mono text-lg font-bold text-stone-500 italic py-1">
                    Locked • Waiting PIN
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  disabled={!isPincodeValid}
                  onClick={handleOrderSubmit}
                  className={`w-full py-4 px-4 text-xs sm:text-sm font-sans font-black uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 ${
                    isPincodeValid
                      ? "bg-emerald-500 hover:bg-emerald-600 text-stone-950 active:scale-[0.98] shadow-lg shadow-emerald-950/20 cursor-pointer"
                      : "bg-stone-800 text-stone-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  <Package className="w-4 h-4 fill-stone-950" />
                  <span>{isPincodeValid ? "Log Direct Wholesale Order" : "Valid PIN Required to Order"}</span>
                </button>

                <button
                  onClick={onBackToHome}
                  className="w-full py-3.5 px-4 bg-transparent border border-stone-800 hover:bg-stone-800 hover:text-white active:scale-[0.98] text-stone-300 text-[11px] font-mono font-bold uppercase tracking-widest rounded-2xl transition-all cursor-pointer"
                >
                  Configure Retail packs instead
                </button>
              </div>

              <p className="text-[9px] text-stone-500 text-center mt-4 uppercase tracking-widest font-mono">
                Quote is dynamic & calculated logs are secured offline.
              </p>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
