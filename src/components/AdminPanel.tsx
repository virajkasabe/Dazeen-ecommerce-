import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PRODUCTS } from "../data";
import { Product } from "../types";
import { Plus, Trash2, Edit2, CheckCircle2, ShieldCheck, RefreshCw, Layers, Layout, Image, PlusCircle, AlertTriangle, Check, ArrowRight } from "lucide-react";

interface AdminPanelProps {
  currentUser: any;
  onProductsUpdated?: (products: Product[]) => void;
  heroImages?: { src: string; bg: string; panel: string }[];
  onHeroImagesUpdated?: (images: { src: string; bg: string; panel: string }[]) => void;
}

export default function AdminPanel({ currentUser, onProductsUpdated, heroImages, onHeroImagesUpdated }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "hero">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Hero carousel edit form states
  const [slide1Url, setSlide1Url] = useState("");
  const [slide1Bg, setSlide1Bg] = useState("");
  const [slide2Url, setSlide2Url] = useState("");
  const [slide2Bg, setSlide2Bg] = useState("");
  const [slide3Url, setSlide3Url] = useState("");
  const [slide3Bg, setSlide3Bg] = useState("");
  const [slide4Url, setSlide4Url] = useState("");
  const [slide4Bg, setSlide4Bg] = useState("");

  useEffect(() => {
    if (heroImages && heroImages.length === 4) {
      setSlide1Url(heroImages[0].src);
      setSlide1Bg(heroImages[0].bg);
      setSlide2Url(heroImages[1].src);
      setSlide2Bg(heroImages[1].bg);
      setSlide3Url(heroImages[2].src);
      setSlide3Bg(heroImages[2].bg);
      setSlide4Url(heroImages[3].src);
      setSlide4Bg(heroImages[3].bg);
    }
  }, [heroImages]);

  const handleSaveHero = (e: FormEvent) => {
    e.preventDefault();
    const updated = [
      { src: slide1Url, bg: slide1Bg, panel: slide1Bg },
      { src: slide2Url, bg: slide2Bg, panel: slide2Bg },
      { src: slide3Url, bg: slide3Bg, panel: slide3Bg },
      { src: slide4Url, bg: slide4Bg, panel: slide4Bg },
    ];
    localStorage.setItem("dazeen_hero_images_v1", JSON.stringify(updated));
    if (onHeroImagesUpdated) {
      onHeroImagesUpdated(updated);
    }
    triggerNotif("Successfully updated Hero Carousel Images & Backgrounds!");
  };

  const handleResetHero = () => {
    const defaultImages = [
      { src: "https://kommodo.ai/i/jLktjgtoIAYIfU0kG88j", bg: "#F4845F", panel: "#F79B7F" },
      { src: "https://kommodo.ai/i/VJoWZ2NV2Ot6pkP0uheV", bg: "#6BBF7A", panel: "#85CC92" },
      { src: "https://kommodo.ai/i/jLktjgtoIAYIfU0kG88j", bg: "#F4845F", panel: "#F79B7F" },
      { src: "https://kommodo.ai/i/VJoWZ2NV2Ot6pkP0uheV", bg: "#6BBF7A", panel: "#85CC92" },
    ];
    setSlide1Url(defaultImages[0].src);
    setSlide1Bg(defaultImages[0].bg);
    setSlide2Url(defaultImages[1].src);
    setSlide2Bg(defaultImages[1].bg);
    setSlide3Url(defaultImages[2].src);
    setSlide3Bg(defaultImages[2].bg);
    setSlide4Url(defaultImages[3].src);
    setSlide4Bg(defaultImages[3].bg);
    
    localStorage.setItem("dazeen_hero_images_v1", JSON.stringify(defaultImages));
    if (onHeroImagesUpdated) {
      onHeroImagesUpdated(defaultImages);
    }
    triggerNotif("Reset Hero Carousel to standard brand showcases.");
  };

  // Form State for creating/editing products
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productTagline, setProductTagline] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productPrice, setProductPrice] = useState<number>(449);
  const [productImage, setProductImage] = useState("");
  const [productRoast, setProductRoast] = useState<Product["roastLevel"]>("Medium");
  const [productOrigin, setProductOrigin] = useState("Chikmagalur Hills, Karnataka");
  const [productProcess, setProductProcess] = useState("Caffeine-Free Method, 100% Arabica");
  const [productCaffeine, setProductCaffeine] = useState("0.0% Caffeine");

  const triggerNotif = (text: string, type: "success" | "error" = "success") => {
    setNotif({ text, type });
    setTimeout(() => setNotif(null), 5000);
  };

  // 1. Fetch Orders from local storage
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const cached = localStorage.getItem("dazeen_placed_orders_v1");
      let fetched: any[] = [];
      if (cached) {
        fetched = JSON.parse(cached);
      } else {
        // Initialize with default demo orders for local testing
        const defaultOrders = [
          {
            id: "DAZ-782194",
            userId: "cust-445566",
            userEmail: "rahul@dazeen.com",
            fullName: "Rahul K.",
            phoneNumber: "+91 98765 43210",
            streetAddress: "MG Road, Bengaluru, Karnataka - 560001",
            cart: [
              {
                product: PRODUCTS[0],
                quantity: 2
              }
            ],
            totals: { itemsCount: 2, subtotal: 898, discount: 0, finalAmount: 898 },
            status: "Shipped",
            shippingEstimate: "3-4 Days",
            createdAt: new Date(Date.now() - 48000000).toISOString(),
            updatedAt: new Date(Date.now() - 24000000).toISOString(),
          },
          {
            id: "DAZ-412893",
            userId: "usr-demo",
            userEmail: "shree@dazeen.com",
            fullName: "Shree Deshmukh",
            phoneNumber: "+91 90123 45678",
            streetAddress: "Kothrud, Pune, Maharashtra - 411038",
            cart: [
              {
                product: PRODUCTS[1],
                quantity: 1
              }
            ],
            totals: { itemsCount: 1, subtotal: 499, discount: 50, finalAmount: 449 },
            status: "Processing",
            shippingEstimate: "2-3 Days",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ];
        localStorage.setItem("dazeen_placed_orders_v1", JSON.stringify(defaultOrders));
        fetched = defaultOrders;
      }

      // Sort client-side by date
      fetched.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setOrders(fetched);
    } catch (e) {
      console.error(e);
      triggerNotif("Could not fetch orders. Re-initializing cache.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const savedProds = localStorage.getItem("dazeen_products_cache_v1");
      if (savedProds) {
        const parsed = JSON.parse(savedProds);
        setProductsList(parsed);
        if (onProductsUpdated) onProductsUpdated(parsed);
      } else {
        localStorage.setItem("dazeen_products_cache_v1", JSON.stringify(PRODUCTS));
        setProductsList(PRODUCTS);
        if (onProductsUpdated) onProductsUpdated(PRODUCTS);
      }
    } catch (e) {
      console.error(e);
      setProductsList(PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  // 3. Seed Default Products
  const handleSeedProducts = async () => {
    setLoading(true);
    try {
      localStorage.setItem("dazeen_products_cache_v1", JSON.stringify(PRODUCTS));
      setProductsList(PRODUCTS);
      if (onProductsUpdated) onProductsUpdated(PRODUCTS);
      triggerNotif("Successfully seeded/reset standard coffee blends configuration!");
    } catch (error) {
      triggerNotif("Storage access failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 4. Update Order tracking status
  const handleUpdateStatus = async (order: any, newStatus: string) => {
    setLoading(true);
    const updatedOrder = {
      ...order,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    try {
      const cached = localStorage.getItem("dazeen_placed_orders_v1");
      const parsed = cached ? JSON.parse(cached) : [];
      const updated = parsed.map((o: any) => (o.id === order.id ? { ...updatedOrder } : o));
      localStorage.setItem("dazeen_placed_orders_v1", JSON.stringify(updated));
      
      // Update local state
      setOrders(updated);

      triggerNotif(`Updated Order ${order.id} status to ${newStatus}`);
    } catch (error) {
      console.error(error);
      triggerNotif("Failed to update status on storage.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 5. Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to remove Order ${orderId}?`)) return;
    setLoading(true);
    try {
      const cached = localStorage.getItem("dazeen_placed_orders_v1");
      const parsed = cached ? JSON.parse(cached) : [];
      const updated = parsed.filter((o: any) => o.id !== orderId);
      localStorage.setItem("dazeen_placed_orders_v1", JSON.stringify(updated));
      setOrders(updated);

      triggerNotif(`Removed Order ${orderId}`);
    } catch (error) {
      console.error(error);
      triggerNotif("Failed to remove order from storage.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 6. Delete Product
  const handleDeleteProduct = async (pId: string) => {
    if (!window.confirm(`Are you sure you want to delete coffee id "${pId}"?`)) return;
    setLoading(true);
    try {
      const remaining = productsList.filter((p) => p.id !== pId);
      localStorage.setItem("dazeen_products_cache_v1", JSON.stringify(remaining));
      
      setProductsList(remaining);
      if (onProductsUpdated) onProductsUpdated(remaining);
      triggerNotif(`Deleted product ${pId}`);
    } catch (error) {
      console.error(error);
      triggerNotif("Failed to delete product.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 7. Open Form for Adding
  const openAddForm = () => {
    setEditingProduct(null);
    setProductId(`dazeen-custom-${Math.floor(100 + Math.random() * 900)}`);
    setProductName("");
    setProductTagline("");
    setProductDesc("");
    setProductPrice(449);
    setProductImage("https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600");
    setProductRoast("Medium");
    setProductOrigin("Chikmagalur Hills, Karnataka");
    setProductProcess("Caffeine-Free Process, Premium Arabica");
    setProductCaffeine("0.0% Caffeine");
    setIsFormOpen(true);
  };

  // 8. Open Form for Editing
  const openEditForm = (p: Product) => {
    setEditingProduct(p);
    setProductId(p.id);
    setProductName(p.name);
    setProductTagline(p.tagline);
    setProductDesc(p.description);
    setProductPrice(p.price);
    setProductImage(p.image);
    setProductRoast(p.roastLevel);
    setProductOrigin(p.origin || "Chikmagalur Hills");
    setProductProcess(p.process || "Caffeine-Free Method");
    setProductCaffeine(p.caffeineCount || "0.0% Caffeine");
    setIsFormOpen(true);
  };

  // 9. Save Form Product
  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!productName || !productId || !productImage) return;

    setLoading(true);
    const newProduct: Product = {
      id: productId,
      name: productName,
      tagline: productTagline || "Finely balanced flavor profiles",
      description: productDesc || "Freshly decaffeinated with Pure Mountain Water.",
      price: Number(productPrice),
      rating: editingProduct ? editingProduct.rating : 4.8,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 5,
      image: productImage,
      roastLevel: productRoast,
      aromaProfile: editingProduct ? editingProduct.aromaProfile : ["Vanilla Pod", "Deep Cocoa"],
      benefits: editingProduct ? editingProduct.benefits : ["Zero Jitters", "100% Sleep-Safe"],
      origin: productOrigin,
      process: productProcess,
      caffeineCount: productCaffeine,
    };

    try {
      // Update local lists
      let updatedList: Product[] = [];
      if (editingProduct) {
        updatedList = productsList.map((p) => (p.id === productId ? newProduct : p));
      } else {
        updatedList = [...productsList, newProduct];
      }
      localStorage.setItem("dazeen_products_cache_v1", JSON.stringify(updatedList));

      setProductsList(updatedList);
      if (onProductsUpdated) onProductsUpdated(updatedList);

      setIsFormOpen(false);
      triggerNotif(`Successfully saved product "${productName}"`);
    } catch (error) {
      console.error(error);
      triggerNotif("Failed to write to products storage.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Count helper
  const pendingOrders = orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      
      {/* Header Info */}
      <div className="p-6 bg-white border border-coffee-200/60 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="p-3 bg-amber-50 text-accent-darkgold rounded-2xl border border-amber-200">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#B4942B] font-bold bg-[#FAF6F0] px-2.5 py-0.5 border border-coffee-150 rounded-full">
                ADMIN CONSOLE
              </span>
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 border border-emerald-150 rounded-full text-[10px] font-bold">
                Online Active
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-coffee-950 mt-1">Dazeen Decaf Portal</h2>
            <p className="text-xs text-coffee-500">Logged in as prime manager: <strong className="font-mono text-coffee-800">{currentUser?.email}</strong></p>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex gap-2.5 self-stretch md:self-auto justify-end">
          <button
            onClick={handleSeedProducts}
            disabled={loading}
            className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-accent-darkgold border border-amber-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            title="Populate your Firestore DB automatically with starting coffee collection beans"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sync Default Menu
          </button>
          
          <button
            onClick={() => { fetchOrders(); fetchProducts(); }}
            className="p-2.5 bg-[#FAF6F0] hover:bg-coffee-100 border border-coffee-200 rounded-xl cursor-pointer"
            title="Reload Server Data"
          >
            <RefreshCw className="w-4 h-4 text-coffee-700" />
          </button>
        </div>
      </div>

      {notif && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 shadow-xs text-left ${
          notif.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
            : "bg-rose-50 text-rose-800 border-rose-250"
        }`}>
          <Check className="w-4 h-4" /> {notif.text}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-coffee-200">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-5 py-3.5 font-bold text-xs uppercase tracking-wider border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === "orders"
              ? "border-coffee-950 text-coffee-950 font-extrabold"
              : "border-transparent text-coffee-400 hover:text-coffee-700"
          }`}
        >
          <Layout className="w-4 h-4" /> Live Customer Orders {pendingOrders > 0 && (
            <span className="p-1 px-1.5 h-4 bg-accent-gold text-coffee-950 text-[9px] rounded-full flex items-center justify-center font-black animate-bounce">
              {pendingOrders}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-5 py-3.5 font-bold text-xs uppercase tracking-wider border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === "products"
              ? "border-coffee-950 text-coffee-950 font-extrabold"
              : "border-transparent text-coffee-400 hover:text-coffee-700"
          }`}
        >
          <Layers className="w-4 h-4" /> Menu Inventory Manager ({productsList.length})
        </button>
        <button
          onClick={() => setActiveTab("hero")}
          className={`px-5 py-3.5 font-bold text-xs uppercase tracking-wider border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === "hero"
              ? "border-coffee-950 text-coffee-950 font-extrabold"
              : "border-transparent text-coffee-400 hover:text-coffee-700"
          }`}
        >
          <Image className="w-4 h-4" /> Hero Carousel Banner
        </button>
      </div>

      {/* Tabs View Content */}
      <div className="min-h-[400px]">
        
        {/* Tab 1: Orders Status Management */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl border border-coffee-200/60 shadow-xl overflow-hidden text-left">
            <div className="p-4 sm:p-6 border-b border-coffee-100 flex justify-between items-center bg-[#FAF6F0]/40">
              <h3 className="font-serif text-lg font-bold text-coffee-950">Active Orders ({orders.length})</h3>
            </div>

            {orders.length === 0 ? (
              <div className="py-20 text-center text-coffee-400 space-y-2">
                <p className="text-sm">No orders have been submitted yet.</p>
                <p className="text-[11px] text-coffee-500">Go to blends, place a test order via shopping checkout cart!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-[#FAF6F0] text-coffee-750 uppercase tracking-widest font-mono text-[10px] border-b border-coffee-150">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Package Contents</th>
                      <th className="p-4">Paid Total</th>
                      <th className="p-4">Order Track Status</th>
                      <th className="p-4 text-center">Deletions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b border-coffee-100 hover:bg-coffee-50/40 transition-colors">
                        {/* ID */}
                        <td className="p-4 font-mono font-bold text-coffee-950">{o.id}</td>
                        {/* Customer */}
                        <td className="p-4 space-y-0.5">
                          <p className="font-bold text-coffee-900">{o.fullName}</p>
                          <p className="text-[10px] text-coffee-500">{o.phoneNumber}</p>
                          <p className="text-[10px] text-coffee-500 leading-tight max-w-[180px]">{o.streetAddress}, PIN {o.pinCode}</p>
                        </td>
                        {/* Contents */}
                        <td className="p-4">
                          <div className="space-y-1">
                            {o.items?.map((item: any, i: number) => (
                              <p key={i} className="text-[11px] font-mono text-coffee-600">
                                {item.product.name} <strong className="text-coffee-900">x{item.quantity}</strong>
                              </p>
                            ))}
                          </div>
                        </td>
                        {/* Total */}
                        <td className="p-4 font-bold text-coffee-950 text-sm">₹{o.totalPrice}</td>
                        {/* Active Status Selector */}
                        <td className="p-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateStatus(o, e.target.value)}
                            disabled={loading}
                            className={`p-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${
                              o.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : o.status === "Cancelled"
                                ? "bg-rose-50 text-rose-900 border-rose-220"
                                : "bg-amber-50 text-accent-darkgold border-amber-200"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Ready for dispatch">Ready for dispatch</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for delivery">Out for delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        {/* Actions */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteOrder(o.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Menu Inventory Manager */}
        {activeTab === "products" && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex justify-between items-center text-left">
              <div>
                <h3 className="font-serif text-lg font-bold text-coffee-950">Active Coffee Beans Inventory ({productsList.length})</h3>
                <p className="text-xs text-coffee-500">Configure photo URLs, descriptions, caffeine levels, and pricing grids.</p>
              </div>

              <button
                onClick={openAddForm}
                className="px-4 py-2.5 bg-coffee-950 text-amber-150 rounded-xl text-xs font-bold font-mono uppercase cursor-pointer hover:bg-coffee-900 transition-colors flex items-center gap-1.5 active:scale-95 shadow-lg shadow-coffee-950/10"
              >
                <PlusCircle className="w-4 h-4" /> Add Product
              </button>
            </div>

            {/* Grid display */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {productsList.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-coffee-200/60 rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm relative group"
                >
                  {/* Photo with Edit overlay shortcut */}
                  <div className="h-44 bg-coffee-100 overflow-hidden relative">
                    <img
                      src={p.image}
                      referrerPolicy="no-referrer"
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-coffee-950/80 backdrop-blur-md rounded-full text-[9px] font-bold text-accent-gold uppercase font-mono tracking-wider">
                      {p.roastLevel} Roast
                    </span>

                    <button
                      onClick={() => openEditForm(p)}
                      className="absolute top-2.5 right-2.5 p-2 bg-coffee-950 text-accent-gold rounded-full transition-all cursor-pointer shadow hover:scale-110"
                      title="Quick Edit Product Details & Photo"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between text-left space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono leading-none tracking-wider text-accent-darkgold uppercase font-bold">{p.id}</p>
                      <h4 className="font-serif text-base font-bold text-coffee-900 leading-snug">{p.name}</h4>
                      <p className="text-[11px] text-coffee-500 leading-tight line-clamp-2">{p.tagline}</p>
                    </div>

                    <div className="pt-3 border-t border-coffee-100 flex items-center justify-between">
                      <span className="text-base font-bold text-coffee-950 font-mono">₹{p.price}</span>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditForm(p)}
                          className="px-2.5 py-1.5 bg-[#FAF6F0] hover:bg-coffee-100 text-coffee-800 rounded-xl transition font-bold font-mono text-[10px] uppercase cursor-pointer"
                        >
                          Modify
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1 px-2.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Tab 3: Hero Carousel Banner Customizer */}
        {activeTab === "hero" && (
          <div className="bg-white rounded-3xl border border-coffee-200/60 shadow-xl overflow-hidden p-6 sm:p-8 space-y-8 text-left">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-[#B4942B] font-bold bg-[#FAF6F0] px-2.5 py-0.5 border border-coffee-150 rounded-full">
                HOMEPAGE MANAGER
              </span>
              <h3 className="font-serif text-2xl font-bold text-coffee-950 mt-2">Homepage Hero Carousel Config</h3>
              <p className="text-xs text-coffee-500 mt-1 leading-relaxed">
                Configure the fluid 3D-style slide assets here. The Hero section operates as a 4-slot carousel loop. You can override each slide's high-definition direct product image URLs and their smooth transition background palette.
              </p>
            </div>

            <form onSubmit={handleSaveHero} className="space-y-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* SLIDE 1 */}
                <div className="p-5 bg-[#FAF6F0]/40 rounded-2xl border border-coffee-200/60 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#F4845F] text-white text-[10px] font-black flex items-center justify-center font-mono">1</span>
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-coffee-900">Slide 1 Showcase</h4>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-coffee-600 font-bold uppercase tracking-wider font-mono">Direct Product Photo URL</label>
                    <input
                      type="text"
                      required
                      value={slide1Url}
                      onChange={(e) => setSlide1Url(e.target.value)}
                      placeholder="/images/dazeen-1.png or https://..."
                      className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-coffee-200 outline-none focus:border-accent-gold block font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-coffee-600 font-bold uppercase tracking-wider font-mono">Background Soft Pastel Color (HEX)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={slide1Bg}
                        onChange={(e) => setSlide1Bg(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        required
                        value={slide1Bg}
                        onChange={(e) => setSlide1Bg(e.target.value)}
                        placeholder="#F4845F"
                        className="flex-grow text-xs px-3 py-1.5 bg-white rounded-xl border border-coffee-200 outline-none focus:border-accent-gold block font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* SLIDE 2 */}
                <div className="p-5 bg-[#FAF6F0]/40 rounded-2xl border border-coffee-200/60 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#6BBF7A] text-white text-[10px] font-black flex items-center justify-center font-mono">2</span>
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-coffee-900">Slide 2 Showcase</h4>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-coffee-600 font-bold uppercase tracking-wider font-mono">Direct Product Photo URL</label>
                    <input
                      type="text"
                      required
                      value={slide2Url}
                      onChange={(e) => setSlide2Url(e.target.value)}
                      placeholder="/images/dazeen-2.png or https://..."
                      className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-coffee-200 outline-none focus:border-accent-gold block font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-coffee-600 font-bold uppercase tracking-wider font-mono">Background Soft Pastel Color (HEX)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={slide2Bg}
                        onChange={(e) => setSlide2Bg(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        required
                        value={slide2Bg}
                        onChange={(e) => setSlide2Bg(e.target.value)}
                        placeholder="#6BBF7A"
                        className="flex-grow text-xs px-3 py-1.5 bg-white rounded-xl border border-coffee-200 outline-none focus:border-accent-gold block font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* SLIDE 3 */}
                <div className="p-5 bg-[#FAF6F0]/40 rounded-2xl border border-coffee-200/60 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-white text-[10px] font-black flex items-center justify-center font-mono">3</span>
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-coffee-900">Slide 3 Showcase</h4>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-coffee-600 font-bold uppercase tracking-wider font-mono">Direct Product Photo URL</label>
                    <input
                      type="text"
                      required
                      value={slide3Url}
                      onChange={(e) => setSlide3Url(e.target.value)}
                      placeholder="/images/dazeen-3.png or https://..."
                      className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-coffee-200 outline-none focus:border-accent-gold block font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-coffee-600 font-bold uppercase tracking-wider font-mono">Background Soft Pastel Color (HEX)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={slide3Bg}
                        onChange={(e) => setSlide3Bg(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        required
                        value={slide3Bg}
                        onChange={(e) => setSlide3Bg(e.target.value)}
                        placeholder="#F4845F"
                        className="flex-grow text-xs px-3 py-1.5 bg-white rounded-xl border border-coffee-200 outline-none focus:border-accent-gold block font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* SLIDE 4 */}
                <div className="p-5 bg-[#FAF6F0]/40 rounded-2xl border border-coffee-200/60 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center font-mono">4</span>
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-coffee-900">Slide 4 Showcase</h4>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-coffee-600 font-bold uppercase tracking-wider font-mono">Direct Product Photo URL</label>
                    <input
                      type="text"
                      required
                      value={slide4Url}
                      onChange={(e) => setSlide4Url(e.target.value)}
                      placeholder="/images/dazeen-4.png or https://..."
                      className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-coffee-200 outline-none focus:border-accent-gold block font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-coffee-600 font-bold uppercase tracking-wider font-mono">Background Soft Pastel Color (HEX)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={slide4Bg}
                        onChange={(e) => setSlide4Bg(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        required
                        value={slide4Bg}
                        onChange={(e) => setSlide4Bg(e.target.value)}
                        placeholder="#85CC92"
                        className="flex-grow text-xs px-3 py-1.5 bg-white rounded-xl border border-coffee-200 outline-none focus:border-accent-gold block font-mono"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-coffee-100 flex flex-wrap gap-3 justify-end text-xs">
                <button
                  type="button"
                  onClick={handleResetHero}
                  className="px-5 py-2.5 bg-white hover:bg-coffee-50 border border-coffee-200 rounded-xl text-coffee-700 font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                >
                  Reset to Defaults
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-coffee-950 hover:bg-coffee-900 text-[#FAF6F0] font-bold rounded-xl shadow-lg cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Save Carousel Changes
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

      {/* Slide-over Overlay for Edit Form */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark veil */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-coffee-950"
            />

            {/* Dialog Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-coffee-200/80 shadow-2xl overflow-hidden w-full max-w-xl max-h-[90vh] overflow-y-auto relative z-10 text-left p-6 sm:p-8 space-y-6"
            >
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-coffee-950">
                  {editingProduct ? "Modify Decaf Blend Details" : "Introduce New Decaf Blend"}
                </h3>
                <p className="text-xs text-coffee-500">Specify precise data matching Cloud Firestore schemas.</p>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-medium text-coffee-800">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="block text-coffee-900 font-bold uppercase tracking-wider font-mono text-[9px]">ID Identifier (Immutable-like)</label>
                    <input
                      type="text"
                      required
                      disabled={!!editingProduct}
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      placeholder="e.g., dazeen-vanilla"
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-coffee-200 outline-none focus:border-accent-gold font-mono disabled:opacity-60 block"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="block text-coffee-900 font-bold uppercase tracking-wider font-mono text-[9px]">Price (INR)</label>
                    <input
                      type="number"
                      required
                      value={productPrice}
                      onChange={(e) => setProductPrice(Number(e.target.value))}
                      placeholder="449"
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-coffee-200 outline-none focus:border-accent-gold font-mono block"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-coffee-900 font-bold uppercase tracking-wider font-mono text-[9px]">Product Name (Showcase Title)</label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Classic Vanilla Velvet Decaf"
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-coffee-200 outline-none focus:border-accent-gold block"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-coffee-900 font-bold uppercase tracking-wider font-mono text-[9px]">Product Tagline</label>
                  <input
                    type="text"
                    required
                    value={productTagline}
                    onChange={(e) => setProductTagline(e.target.value)}
                    placeholder="Rich creamy vanilla pods glaze for deep sweet comfort without insomnia."
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-coffee-200 outline-none focus:border-accent-gold block"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-coffee-900 font-bold uppercase tracking-wider font-mono text-[9px]">Full Description</label>
                  <textarea
                    rows={3}
                    value={productDesc}
                    onChange={(e) => setProductDesc(e.target.value)}
                    placeholder="Provide full heritage notes & decaffeination details..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-coffee-200 outline-none focus:border-accent-gold block text-xs"
                  />
                </div>

                {/* Photo Input (Asked specifically by user: Change product photos) */}
                <div className="space-y-1.5">
                  <label className="block text-coffee-900 font-bold uppercase tracking-wider font-mono text-[9px] flex items-center gap-1">
                    <Image className="w-3 h-3 text-accent-darkgold" /> Product Photo URL
                  </label>
                  <input
                    type="text"
                    required
                    value={productImage}
                    onChange={(e) => setProductImage(e.target.value)}
                    placeholder="Paste clean direct Unsplash image URL..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-coffee-200 outline-none focus:border-accent-gold font-mono block"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="block text-coffee-900 font-bold uppercase tracking-wider font-mono text-[9px]">Roast Level</label>
                    <select
                      value={productRoast}
                      onChange={(e) => setProductRoast(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-coffee-200 outline-none focus:border-accent-gold block"
                    >
                      <option value="Light">Light Roast</option>
                      <option value="Medium">Medium Roast</option>
                      <option value="Medium-Dark">Medium-Dark Roast</option>
                      <option value="Dark">Dark Roast</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="block text-coffee-900 font-bold uppercase tracking-wider font-mono text-[9px]">Anxiety/Caffeine Status</label>
                    <input
                      type="text"
                      value={productCaffeine}
                      onChange={(e) => setProductCaffeine(e.target.value)}
                      placeholder="0.0% Caffeine"
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-coffee-200 outline-none focus:border-accent-gold block"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="block text-coffee-900 font-bold uppercase tracking-wider font-mono text-[9px]">Sourcing Estate Origin</label>
                    <input
                      type="text"
                      value={productOrigin}
                      onChange={(e) => setProductOrigin(e.target.value)}
                      placeholder="Chikmagalur Hills, Karnataka"
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-coffee-200 outline-none focus:border-accent-gold block"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="block text-coffee-900 font-bold uppercase tracking-wider font-mono text-[9px]">Decaffeination Process</label>
                    <input
                      type="text"
                      value={productProcess}
                      onChange={(e) => setProductProcess(e.target.value)}
                      placeholder="Caffeine-Free Process, chemical free"
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-coffee-200 outline-none focus:border-accent-gold block"
                    />
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="pt-4 border-t border-coffee-100 flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2.5 bg-white hover:bg-coffee-50 border border-coffee-200 rounded-xl text-coffee-700 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-coffee-950 hover:bg-coffee-900 text-[#FAF6F0] font-bold rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-1 animate-pulse"
                  >
                    {loading ? "Writing to database..." : "Save Product Settings"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
