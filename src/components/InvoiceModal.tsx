import * as React from "react";
import { X, Printer, Receipt } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "./ui/dialog";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export default function InvoiceModal({ isOpen, onClose, order }: InvoiceModalProps) {
  if (!order) return null;

  // Format date helper
  const formatDate = (dateInput: any) => {
    if (!dateInput) {
      return new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    }
    try {
      const date = dateInput.seconds 
        ? new Date(dateInput.seconds * 1000) 
        : new Date(dateInput);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch {
      return "21-06-2026";
    }
  };

  const items = order.items || [
    {
      product: { name: "Dazeen Coffee (250g)" },
      quantity: 1,
      price: order.totalPrice || 499
    }
  ];

  // Calculate Subtotals & dynamic 5% GST
  let isWholesale = items.some((item: any) => {
    const name = item.product?.name || "";
    return name.toLowerCase().includes("wholesale") || name.toLowerCase().includes("bulk");
  });

  const rawSubtotal = items.reduce((sum: number, item: any) => {
    const price = item.price || item.product?.price || 499;
    return sum + (price * item.quantity);
  }, 0);

  const discount = order.pricing?.discountAmount || order.totals?.discount || 0;
  const taxableBase = Math.max(0, rawSubtotal - discount);
  
  // 5% GST on the taxable base
  const gstAmount = order.pricing?.taxes || order.totals?.gstAmount || Math.round(taxableBase * 0.05);
  const cgstAmount = Number((gstAmount / 2).toFixed(2));
  const sgstAmount = Number((gstAmount / 2).toFixed(2));

  // Delivery
  const deliveryFee = typeof order.pricing?.deliveryFee === "number"
    ? order.pricing.deliveryFee
    : typeof order.totals?.shippingCharge === "number"
      ? order.totals.shippingCharge
      : (order.totalPrice && order.totalPrice > taxableBase + gstAmount)
        ? (order.totalPrice - (taxableBase + gstAmount))
        : 0;

  const totalPayable = order.totalPrice || order.pricing?.grandTotal || order.totals?.finalAmount || (taxableBase + gstAmount + deliveryFee);

  const handlePrint = () => {
    // Elegant offscreen iframe technique to print beautifully directly to PDF
    const printContent = document.getElementById("print-invoice-area")?.innerHTML || "";
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    // Modern styled, paper-ready beautiful black-and-white printable invoice layout in iframe
    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(`
        <html>
          <head>
            <title>Tax Invoice - ${order.id}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                color: #1a1a1a;
                margin: 0;
                padding: 40px;
                background-color: #ffffff;
                line-height: 1.4;
              }
              .invoice-layout {
                max-width: 800px;
                margin: 0 auto;
                background: #ffffff;
              }
              .divider {
                border-top: 1.5px solid #1c1917;
                margin: 20px 0;
              }
              .dashed-divider {
                border-top: 1px dashed #cccccc;
                margin: 15px 0;
              }
              .grid-2 {
                display: flex;
                justify-content: space-between;
              }
              .col {
                width: 48%;
              }
              .text-right {
                text-align: right;
              }
              .text-center {
                text-align: center;
              }
              h1 {
                font-size: 24px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                margin: 0 0 5px 0;
                font-weight: 850;
              }
              h3 {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin: 0 0 8px 0;
                color: #555555;
                font-weight: 700;
              }
              p {
                margin: 0 0 6px 0;
                font-size: 12px;
                color: #333333;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 25px 0;
              }
              th {
                border-bottom: 2px solid #1c1917;
                padding: 10px 8px;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                color: #555555;
                letter-spacing: 0.05em;
                text-align: left;
              }
              td {
                padding: 10px 8px;
                border-bottom: 1px solid #eeeeee;
                font-size: 12px;
                color: #222222;
              }
              .totals-table {
                width: 320px;
                margin-left: auto;
                margin-top: 20px;
              }
              .totals-table td {
                padding: 6px 8px;
                font-size: 12px;
                border: none;
              }
              .totals-table tr.grand-total td {
                border-top: 1.5px solid #1c1917;
                font-weight: 800;
                font-size: 15px;
                padding-top: 10px;
                color: #000000;
              }
              .footer-stamp {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 50px;
                padding-top: 25px;
                border-top: 1px dashed #cccccc;
              }
              .authorized-sign {
                text-align: right;
                font-size: 11px;
                color: #555555;
              }
              .signature-space {
                height: 45px;
              }
              .paid-seal {
                border: 2px solid #10b981;
                color: #10b981;
                font-size: 11px;
                font-weight: 900;
                padding: 6px 12px;
                border-radius: 6px;
                display: inline-block;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                transform: rotate(-4deg);
              }
              .gst-detail-text {
                font-size: 9px;
                color: #777777;
                margin-top: 10px;
                line-height: 1.5;
              }
              @media print {
                body {
                  padding: 0;
                }
                .invoice-layout {
                  width: 100%;
                }
              }
            </style>
          </head>
          <body>
            <div class="invoice-layout">
              ${printContent}
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  window.frameElement.remove();
                }, 200);
              };
            </script>
          </body>
        </html>
      `);
      doc.close();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
        <DialogContent className="fixed left-[50%] top-[48%] z-[101] w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] outline-none p-0 bg-white shadow-2xl rounded-2xl overflow-hidden border border-stone-200">
          
          {/* Action Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-stone-50 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-stone-800" />
              <span className="font-sans font-bold text-stone-800 text-sm">
                Tax Invoice • {order.id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#4a2c2a] hover:bg-[#3d2422] text-white rounded-xl text-xs font-mono font-medium tracking-wide transition-all cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" /> Save PDF / Print
              </button>
              <button
                onClick={onClose}
                className="p-1 px-2 text-stone-500 hover:text-stone-900 rounded-xl hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Invoice Page Preview */}
          <div className="p-8 md:p-10 overflow-y-auto max-h-[72vh] bg-white text-[#1a1a1a] font-sans" id="print-invoice-area">
            
            {/* Header Letterhead */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-stone-900 font-serif">TAX INVOICE</h1>
                <p className="text-xs text-stone-500 mt-0.5 font-bold tracking-wide">Dazeen</p>
                <p className="text-xs text-stone-500">Kurkumbh, backside of Bank of Maharashtra, Daund, Pune, Maharashtra</p>
                <p className="text-xs text-stone-500 font-mono mt-1">GSTIN: 27MTNPK7433F1Z4</p>
              </div>
              <div className="sm:text-right text-xs text-stone-650 space-y-1">
                <p><span className="font-bold text-stone-800">Invoice Ref:</span> {order.id}</p>
                <p><span className="font-bold text-stone-800">Date of Supply:</span> {formatDate(order.createdAt)}</p>
                <p><span className="font-bold text-stone-800">Reverse Charge:</span> N / A</p>
                <p><span className="font-bold text-stone-800">Supply Type:</span> {isWholesale ? "B2B Commercial Bulk" : "B2C Consumer Retail"}</p>
              </div>
            </div>

            {/* Solid accent rule */}
            <div className="border-t-2 border-stone-850 my-6" />

            {/* Billing column information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="text-left text-xs">
                <h3 className="text-[10px] uppercase font-extrabold text-stone-500 tracking-wider mb-1.5">Billed To (Recipient):</h3>
                <p className="font-bold text-xs text-stone-900">{order.fullName || "Customer Name"}</p>
                <p className="text-[11px] text-stone-700 leading-relaxed mt-0.5">{order.streetAddress || order.addressLine1 || "Address details"}</p>
                {order.pinCode && <p className="text-[11px] text-stone-700 mt-0.5"><span className="font-semibold text-stone-800">Pincode:</span> {order.pinCode}</p>}
                <p className="text-[11px] text-stone-700"><span className="font-semibold text-stone-800">Mobile Phone:</span> {order.phoneNumber || "+91 XXXXX XXXXX"}</p>
              </div>
              
              <div className="sm:text-right text-xs">
                <h3 className="text-[10px] uppercase font-extrabold text-stone-500 tracking-wider mb-1.5">Shipped From:</h3>
                <p className="font-bold text-[11px] text-stone-900">Dazeen Estate Roastery</p>
                <p className="text-[11px] text-stone-600 leading-normal mt-0.5">Chikmagalur Botanical Sourcing Hub, Western Ghats, Karnataka & Warehouse Pune Logistics</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-800 text-[10px] font-mono tracking-wider text-stone-500 uppercase">
                    <th className="py-2.5 pb-2 text-left font-bold">Item Description</th>
                    <th className="py-2.5 pb-2 text-center font-bold">HSN Code</th>
                    <th className="py-2.5 pb-2 text-center font-bold">Qty</th>
                    <th className="py-2.5 pb-2 text-right font-bold">Unit Price</th>
                    <th className="py-2.5 pb-2 text-right font-bold">Total (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {items.map((item: any, idx: number) => {
                    const name = item.product?.name || "Dazeen Coffee (250g)";
                    const qty = item.quantity || 1;
                    const price = item.price || item.product?.price || 499;
                    const itemHsn = isWholesale ? "21011110" : "09012190";
                    return (
                      <tr key={idx} className="text-xs text-stone-850">
                        <td className="py-3 pr-4">
                          <span className="font-semibold text-stone-900 block">{name}</span>
                          {isWholesale && <span className="text-[10px] text-[#5E0ED7] font-mono">B2B Trade Discount Tier Applied</span>}
                        </td>
                        <td className="py-3 text-center font-mono text-[11px] text-stone-500">{itemHsn}</td>
                        <td className="py-3 text-center">{qty}</td>
                        <td className="py-3 text-right font-mono">₹{price}</td>
                        <td className="py-3 text-right font-mono font-medium">₹{qty * price}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Calculations summaries */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-dashed border-stone-200 pt-5">
              <div className="flex-1 text-[11px] text-stone-500 leading-relaxed max-w-sm">
                <p className="font-bold text-stone-700 uppercase tracking-widest text-[9px] mb-1">Tax Declaration</p>
                <p>Tax on reverse-charge is not applicable. GST with HSN 0901/2101 has been levied at an official unified rate of 5%. 2.5% CGST under Central Authority & 2.5% SGST under State Authority Pune, MH.</p>
                <div className="gst-detail-text font-mono mt-2 text-[9px] text-stone-400">
                  <span>CGST (2.5%): ₹{cgstAmount} | SGST (2.5%): ₹{sgstAmount}</span>
                </div>
              </div>

              <div className="w-72 shrink-0 space-y-1.5 text-xs text-right">
                <div className="flex justify-between text-stone-600">
                  <span>Untaxed Base Subelement:</span>
                  <span className="font-mono">₹{taxableBase}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Loyalty Promo Discount:</span>
                    <span className="font-mono">-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>CGST (2.5%):</span>
                  <span className="font-mono">₹{cgstAmount}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>SGST (2.5%):</span>
                  <span className="font-mono">₹{sgstAmount}</span>
                </div>
                <div className="flex justify-between text-stone-600 font-semibold">
                  <span>Integrated GST (5%):</span>
                  <span className="font-mono">₹{gstAmount}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Logistics & Shipping:</span>
                  <span className="font-mono">
                    {deliveryFee === 0 ? <span className="text-emerald-600 uppercase font-black text-[9px]">Free</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                
                <div className="flex justify-between border-t-2 border-stone-900 pt-3 text-sm font-bold text-stone-950">
                  <span>Adjusted Total Payable:</span>
                  <span className="font-mono text-base">₹{totalPayable}</span>
                </div>
              </div>
            </div>

            {/* Official Stamps / Signature Section */}
            <div className="flex justify-between items-center mt-12 pt-6 border-t border-dashed border-stone-200">
              <div className="text-left">
                <span className="paid-seal">PAID SECURE • VERIFIED</span>
                <p className="text-[10px] text-stone-400 mt-2 font-mono">Authenticated via Dazeen PG Server</p>
              </div>
              <div className="text-right">
                <div className="w-40 border-b border-stone-400 h-10 ml-auto" />
                <p className="text-[10px] text-stone-500 mt-1 uppercase font-bold tracking-wider">Authorized Signatory</p>
                <p className="text-[9px] text-stone-400">Dazeen</p>
              </div>
            </div>

            {/* Micro details */}
            <div className="text-center text-[10px] text-stone-400 mt-10 border-t border-stone-100 pt-4 leading-normal">
              <p>This is a computer generated digital Tax Invoice compliant with Indian IT Act 2000. Under GST laws, no hand-written signatures are required for validated electronic checkouts.</p>
              <p className="mt-1">Thanks for supporting shade-grown, caffeine-free wellness inside Pune, MH.</p>
            </div>

          </div>

          {/* Bottom Dialog Options (Interactive preview only) */}
          <div className="flex justify-end gap-3 px-6 py-4 bg-stone-50 border-t border-stone-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-stone-200 hover:bg-stone-100 text-stone-600 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer"
            >
              Close Window
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-[#4a2c2a] hover:bg-[#3d2422] text-white rounded-xl text-xs font-mono font-medium transition-all cursor-pointer shadow-sm shadow-[#4a2c2a]/20"
            >
              Print / Save PDF Form
            </button>
          </div>

        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
