'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
} from "lucide-react";
import { ContactCard } from "./ui/contact-card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { notificationService } from "../utils/notifications";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      notificationService.send("⚠️ Incomplete Form", "Please fill in your Name, Email and Message first.");
      return;
    }
    setIsSubmittingContact(true);
    setTimeout(() => {
      notificationService.send(
        "Query Sent Successfully! ☕✨", 
        `Thank you ${contactName}, we've received your request! Our representative will call or mail back soon.`
      );
      setIsSubmittingContact(false);
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactMessage("");
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-stone-950/85 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            className="relative max-w-4xl w-full shadow-3xl max-h-[90vh] overflow-y-auto rounded-3xl"
          >
            {/* Floating Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-stone-900 border border-stone-800 hover:border-amber-500 hover:bg-stone-850 flex items-center justify-center text-stone-200 transition-all cursor-pointer z-50 shadow-md"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            <ContactCard
              title="Get in touch"
              description="If you have any questions regarding our Boutique Coffees, Custom Grind requests, or need bulk ordering support, fill out the form here. We do our best to respond within 1 business day."
              contactInfo={[
                {
                  icon: Mail,
                  label: 'Email Support',
                  value: 'support@dazeen.in',
                },
                {
                  icon: Phone,
                  label: 'Call / WhatsApp',
                  value: '+91 98345 00977',
                },
                {
                  icon: MapPin,
                  label: 'Address HQ',
                  value: 'Kurkumbh, backside of Bank of Maharashtra, Daund, Pune, Maharashtra',
                  className: 'col-span-1 md:col-span-2 lg:col-span-1',
                }
              ]}
            >
              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="flex flex-col gap-1.5 text-left">
                  <Label htmlFor="modal-contact-name" className="text-stone-300 text-xs font-semibold font-mono tracking-wider">
                    Name *
                  </Label>
                  <Input 
                    id="modal-contact-name"
                    type="text" 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your Name" 
                    className="bg-stone-900 border-stone-800 focus:border-amber-500 rounded-xl"
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-1.5 text-left">
                  <Label htmlFor="modal-contact-email" className="text-stone-300 text-xs font-semibold font-mono tracking-wider">
                    Email address *
                  </Label>
                  <Input 
                    id="modal-contact-email"
                    type="email" 
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="you@domain.com" 
                    className="bg-stone-900 border-stone-800 focus:border-amber-500 rounded-xl"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <Label htmlFor="modal-contact-phone" className="text-stone-300 text-xs font-semibold font-mono tracking-wider">
                    Phone Number (Optional)
                  </Label>
                  <Input 
                    id="modal-contact-phone"
                    type="tel" 
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX" 
                    className="bg-stone-900 border-stone-800 focus:border-amber-500 rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <Label htmlFor="modal-contact-message" className="text-stone-300 text-xs font-semibold font-mono tracking-wider">
                    Message / Request *
                  </Label>
                  <Textarea 
                    id="modal-contact-message"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="How can we assist you with our Premium Coffees?" 
                    className="bg-stone-900 border-stone-800 focus:border-amber-500 min-h-[90px] rounded-xl"
                    required
                  />
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black tracking-widest uppercase py-3 rounded-xl cursor-pointer shadow-lg transition-transform hover:scale-[1.01]" 
                  type="submit"
                  disabled={isSubmittingContact}
                >
                  {isSubmittingContact ? "Sending..." : "Submit Inquiry"}
                </Button>
              </form>
            </ContactCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
