import * as React from "react";
import { X, Printer, Download, Receipt } from "lucide-react";
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
    if (!dateInput) return "21-06-2026";
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

  const handlePrint = () => {
    // 1. Direct standard window.print() trigger (works well in direct non-iframe tabs)
    try {
      const style = document.createElement("style");
      style.id = "print-invoice-styles";
      style.innerHTML = `
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          body > * {
            display: none !important;
          }
          #print-invoice-area {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            border: none !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `;
      document.head.appendChild(style);
      window.print();
      // Cleanup style after print dialog closes
      setTimeout(() => {
        const el = document.getElementById("print-invoice-styles");
        if (el) el.remove();
      }, 1000);
    } catch (e) {
      console.warn("Direct print restricted by sandbox constraints. Downloading raw invoice document...");
    }

    // 2. Unconditional physical file download bypass
    // Generates a crisp vector HTML Invoice file. When opened offline, it auto-initiates the browser print-to-PDF flow.
    const dateStr = formatDate(order.createdAt);
    const invoiceId = order.id || "ORD-" + Math.floor(Date.now() / 1000);
    const customerName = order.fullName || "Customer Name";
    const address = order.streetAddress || "Address Line 1";
    const phone = order.phoneNumber || "+91 XXXXX XXXXX";
    const pin = order.pinCode ? `PIN: ${order.pinCode} | ` : "";
    const totalAmount = order.totalPrice || subtotal;

    const itemsHTML = items.map((item: any) => {
      const name = item.product?.name || "Dazeen Coffee (250g)";
      const qty = item.quantity || 1;
      const price = item.price || item.product?.price || 499;
      return `
        <tr>
          <td>${name}</td>
          <td style="text-align: center;">${qty}</td>
          <td style="text-align: right;">₹${price}</td>
          <td style="text-align: right;">₹${qty * price}</td>
        </tr>
      `;
    }).join("");

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Dazeen Invoice - ${invoiceId}</title>
    <style>
        body { font-family: 'Arial', sans-serif; margin: 40px; color: #333; background-color: #fff; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); border-radius: 8px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #555; padding-bottom: 20px; align-items: flex-start; }
        .brand { font-size: 28px; font-weight: bold; color: #4a2c2a; } /* Coffee color */
        .info { margin-top: 25px; line-height: 1.6; }
        .info h3 { font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 6px; color: #4a2c2a; letter-spacing: 0.05em; }
        .info p { font-size: 13px; color: #444; margin: 0; line-height: 1.5; }
        table { width: 100%; border-collapse: collapse; margin-top: 30px; }
        th { background: #f8f8f8; text-align: left; padding: 12px 10px; border-bottom: 1px solid #ddd; font-size: 12px; text-transform: uppercase; color: #555; letter-spacing: 0.05em; }
        td { padding: 12px 10px; border-bottom: 1px solid #eee; font-size: 13px; color: #444; }
        .total { font-weight: bold; font-size: 18px; text-align: right; margin-top: 25px; color: #4a2c2a; }
        .footer-note { margin-top: 50px; text-align: center; font-size: 11px; color: #777; border-top: 1px dashed #eee; padding-top: 15px; }
        .action-bar { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        .print-btn { background: #4a2c2a; color: white; padding: 10px 20px; border: none; cursor: pointer; font-weight: bold; border-radius: 6px; font-size: 13px; transition: background 0.2s; }
        .print-btn:hover { background: #3d2422; }
        @media print {
            .action-bar { display: none; }
            body { margin: 20px; }
            .invoice-box { border: none; box-shadow: none; padding: 0; }
        }
    </style>
</head>
<body>

<div class="invoice-box">
    <div class="header">
        <div>
            <div class="brand">DAZEEN</div>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #555;">Premium Caffeine-Free Coffee Powder</p>
        </div>
        <div style="text-align: right;">
            <strong>GSTIN:</strong> 27MTNPK7433F1Z4<br>
            <strong>Invoice ID:</strong> ${invoiceId}<br>
            <strong>Date:</strong> ${dateStr}
        </div>
    </div>

    <div class="info">
        <h3>Bill To:</h3>
        <p>
            <strong>${customerName}</strong><br>
            ${address}, Pune<br>
            ${pin}Phone: ${phone}
        </p>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 55%;">Item Description</th>
                <th style="width: 15%; text-align: center;">Qty</th>
                <th style="width: 15%; text-align: right;">Price</th>
                <th style="width: 15%; text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>
            ${itemsHTML}
        </tbody>
    </table>

    <p class="total">Grand Total: ₹${totalAmount}</p>
    
    <div class="action-bar">
        <button class="print-btn" onclick="window.print()">Download / Print PDF</button>
    </div>

    <div class="footer-note">
        <p>Thank you for shopping with Dazeen! Savor the decaf perfection.</p>
        <p style="margin-top: 4px;">Contact: support@dazeen.in | +91 98345 00977</p>
    </div>
</div>

<script>
    window.onload = function() {
        setTimeout(function() {
            window.print();
        }, 500);
    };
</script>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Dazeen_Invoice_${invoiceId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const items = order.items || [
    {
      product: { name: "Dazeen Coffee (250g)" },
      quantity: 1,
      price: order.totalPrice || 499
    }
  ];

  const subtotal = items.reduce((sum: number, item: any) => {
    const price = item.price || item.product?.price || 499;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
        <DialogContent className="fixed left-[50%] top-[50%] z-[101] w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] outline-none p-0 bg-white shadow-2xl rounded-2xl overflow-hidden border border-stone-200">
          
          {/* Controls Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-stone-50 border-b border-stone-200 no-print">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#4a2c2a]" />
              <span className="font-serif font-black text-stone-900 text-sm">
                Official Tax Invoice • {order.id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4a2c2a] hover:bg-[#3d2422] text-white rounded-lg text-xs font-mono font-medium tracking-wide transition-all cursor-pointer shadow-sm shadow-[#4a2c2a]/20"
              >
                <Printer className="w-3.5 h-3.5" /> Print / PDF
              </button>
              <button
                onClick={onClose}
                className="p-1 px-2 text-stone-550 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Invoice Body (Matches user's required HTML structure & styles perfectly) */}
          <div className="p-8 md:p-12 overflow-y-auto max-h-[80vh] bg-white text-[#333] font-sans" id="print-invoice-area">
            {/* Embedded Invoice Style */}
            <style dangerouslySetInnerHTML={{__html: `
              .invoice-container {
                font-family: 'Arial', sans-serif;
                color: #333;
                background: #fff;
              }
              .invoice-box-inner {
                max-width: 800px;
                margin: auto;
              }
              .invoice-header {
                display: flex;
                justify-content: space-between;
                border-bottom: 2px solid #555;
                padding-bottom: 20px;
                align-items: flex-start;
              }
              .invoice-brand {
                font-size: 28px;
                font-weight: bold;
                color: #4a2c2a;
                font-family: inherit;
                line-height: 1.1;
              }
              .invoice-brand-sub {
                font-size: 13px;
                color: #555;
                margin-top: 4px;
              }
              .invoice-meta {
                text-align: right;
                font-size: 13px;
                line-height: 1.6;
              }
              .invoice-info {
                margin-top: 25px;
                line-height: 1.6;
              }
              .invoice-info h3 {
                font-size: 14px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: 6px;
                color: #4a2c2a;
              }
              .invoice-info p {
                font-size: 13px;
                color: #444;
                margin: 0;
              }
              .invoice-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 30px;
              }
              .invoice-table th {
                background: #f8f8f8;
                text-align: left;
                padding: 12px 10px;
                border-bottom: 1px solid #ddd;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: #555;
              }
              .invoice-table td {
                padding: 12px 10px;
                border-bottom: 1px solid #eee;
                font-size: 13px;
                color: #444;
              }
              .invoice-total {
                font-weight: bold;
                font-size: 18px;
                text-align: right;
                margin-top: 25px;
                color: #4a2c2a;
              }
              .invoice-footer-note {
                margin-top: 45px;
                text-align: center;
                font-size: 11px;
                color: #777;
                border-t: 1px dashed #eee;
                padding-top: 15px;
              }
            `}} />

            <div className="invoice-container">
              <div className="invoice-box-inner">
                <div className="invoice-header">
                  <div>
                    <div className="invoice-brand">DAZEEN</div>
                    <p className="invoice-brand-sub">Premium Caffeine-Free Coffee Powder</p>
                  </div>
                  <div className="invoice-meta">
                    <strong>GSTIN:</strong> 27MTNPK7433F1Z4<br />
                    <strong>Invoice:</strong> {order.id}<br />
                    <strong>Date:</strong> {formatDate(order.createdAt)}
                  </div>
                </div>

                <div className="invoice-info">
                  <h3>Bill To:</h3>
                  <p>
                    <strong>{order.fullName || "Customer Name"}</strong><br />
                    {order.streetAddress || "Address Line 1"}, Pune<br />
                    {order.pinCode && `PIN: ${order.pinCode} | `}Phone: {order.phoneNumber || "+91 XXXXX XXXXX"}
                  </p>
                </div>

                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th style={{ width: "55%" }}>Item Description</th>
                      <th style={{ width: "15%", textAlign: "center" }}>Qty</th>
                      <th style={{ width: "15%", textAlign: "right" }}>Price</th>
                      <th style={{ width: "15%", textAlign: "right" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: any, index: number) => {
                      const name = item.product?.name || "Dazeen Coffee (250g)";
                      const qty = item.quantity || 1;
                      const price = item.price || item.product?.price || 499;
                      return (
                        <tr key={index}>
                          <td>{name}</td>
                          <td style={{ textAlign: "center" }}>{qty}</td>
                          <td style={{ textAlign: "right" }}>₹{price}</td>
                          <td style={{ textAlign: "right" }}>₹{qty * price}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <p className="invoice-total">Grand Total: ₹{order.totalPrice || subtotal}</p>

                <div className="invoice-footer-note no-print">
                  <p>Thank you for shopping with Dazeen! Savor the decaf perfection.</p>
                  <p style={{ marginTop: "4px" }}>Contact: support@dazeen.in | +91 98345 00977</p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom actions for interactive view (No-print) */}
          <div className="flex justify-end gap-3 px-6 py-4 bg-stone-50 border-t border-stone-100 no-print">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-stone-200 hover:bg-stone-150 text-stone-700 rounded-xl text-xs font-mono font-medium tracking-wide transition-all cursor-pointer"
            >
              Close Receipt
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-[#4a2c2a] hover:bg-[#3d2422] text-white rounded-xl text-xs font-mono font-medium tracking-wide transition-all cursor-pointer"
            >
              Download / Print Invoice
            </button>
          </div>

        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
