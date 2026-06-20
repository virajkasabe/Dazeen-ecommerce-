"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useState, useEffect } from "react";
import {
  CreditCard,
  Truck,
  Shield,
  MapPin,
  User,
  Mail,
  Phone,
  Lock,
  ShoppingBag,
  Check,
  ChevronLeft,
  Percent,
  X,
  Smartphone,
  Building2,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  discount?: number;
}

interface CheckoutSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  nameOnCard: string;
}

export default function Checkout() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    nameOnCard: "",
  });
  const [selectedPaymentType, setSelectedPaymentType] =
    useState<string>("card");
  const [appliedPromo, setAppliedPromo] = useState<string>("SAVE10");
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const [orderCompleted, setOrderCompleted] = useState<boolean>(false);

  const sampleOrderItems: OrderItem[] = [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      price: 89.99,
      originalPrice: 129.99,
      image:
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1165&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quantity: 2,
      discount: 31,
    },
    {
      id: "2",
      name: "Minimalist Desk Lamp",
      price: 45.99,
      image:
        "https://images.unsplash.com/photo-1617363020293-62faac14783d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      quantity: 1,
    },
    {
      id: "3",
      name: "Organic Coffee Beans",
      price: 24.99,
      originalPrice: 29.99,
      image:
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
      quantity: 3,
      discount: 17,
    },
  ];

  const shippingMethods = [
    {
      id: "standard",
      name: "Standard Shipping",
      price: 9.99,
      time: "5-7 business days",
    },
    {
      id: "express",
      name: "Express Shipping",
      price: 19.99,
      time: "2-3 business days",
    },
    {
      id: "overnight",
      name: "Overnight Shipping",
      price: 39.99,
      time: "Next business day",
    },
  ];

  const [selectedShipping, setSelectedShipping] = useState("standard");

  useEffect(() => {
    const loadCheckout = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setOrderItems(sampleOrderItems);
      setIsLoading(false);
    };

    loadCheckout();
  }, []);

  const calculateSummary = (): CheckoutSummary => {
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discount = appliedPromo === "SAVE10" ? subtotal * 0.1 : 0;
    const shipping =
      selectedShipping === "standard"
        ? 9.99
        : selectedShipping === "express"
        ? 19.99
        : 39.99;
    const tax = (subtotal - discount) * 0.08; // 8% tax
    const total = subtotal - discount + shipping + tax;

    return {
      subtotal,
      discount,
      shipping,
      tax,
      total,
    };
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePaymentChange = (field: keyof PaymentMethod, value: string) => {
    setPaymentMethod((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          shippingAddress.firstName &&
          shippingAddress.lastName &&
          shippingAddress.email &&
          shippingAddress.address &&
          shippingAddress.city &&
          shippingAddress.state &&
          shippingAddress.zipCode
        );
      case 2:
        if (selectedPaymentType === "card") {
          return !!(
            paymentMethod.cardNumber &&
            paymentMethod.expiryMonth &&
            paymentMethod.expiryYear &&
            paymentMethod.cvv &&
            paymentMethod.nameOnCard
          );
        }
        return !!selectedPaymentType;
      case 3:
        return agreeToTerms;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const removePromo = () => {
    setAppliedPromo("");
  };

  const handlePlaceOrderComplete = () => {
    setOrderCompleted(true);
  };

  const summary = calculateSummary();

  const CheckoutSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col gap-4">
            <Skeleton className="h-6 w-24" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const OrderSummaryCard = () => (
    <Card className="flex flex-col gap-5">
      <CardHeader>
        <h3 className="font-semibold flex items-center gap-2 text-stone-900 dark:text-stone-100">
          <ShoppingBag className="h-4 w-4 text-[#B4942B]" />
          Order Summary
        </h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Order Items */}
        <div className="flex flex-col gap-4 max-h-[240px] overflow-y-auto pr-1">
          {orderItems.map((item) => (
            <div key={item.id} className="flex gap-3 items-center">
              <div className="relative w-12 h-12 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-md"
                />
                <Badge
                  className="absolute -top-1.5 -right-1.5 text-[10px] min-w-5 h-5 flex items-center justify-center bg-stone-900 text-white rounded-full p-1"
                >
                  {item.quantity}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 truncate">{item.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100">${item.price}</span>
                  {item.originalPrice && (
                    <span className="text-[10px] text-stone-400 line-through">
                      ${item.originalPrice}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        {/* Applied Promo */}
        {appliedPromo && (
          <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
            <div className="flex items-center gap-2">
              <Percent className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium text-emerald-850 dark:text-emerald-300">
                Code {appliedPromo} Applied!
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removePromo}
              className="h-6 w-6 p-0 hover:bg-transparent text-emerald-650 hover:text-emerald-800"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}{" "}
        {/* Pricing Breakdown */}
        <div className="flex flex-col gap-2 border-t pt-4">
          <div className="flex justify-between text-xs text-stone-500">
            <span>Subtotal</span>
            <span className="font-mono text-stone-900 dark:text-stone-100">${summary.subtotal.toFixed(2)}</span>
          </div>
          {summary.discount > 0 && (
            <div className="flex justify-between text-xs text-emerald-600">
              <span>Promo Saving</span>
              <span className="font-mono">-${summary.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-xs text-stone-500">
            <span>Shipping</span>
            <span className="font-mono text-stone-900 dark:text-stone-100">${summary.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-stone-500">
            <span>Tax (8%)</span>
            <span className="font-mono text-stone-900 dark:text-stone-100">${summary.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm border-t border-dashed border-stone-200 dark:border-stone-800 pt-2.5 text-stone-900 dark:text-stone-100">
            <span>Total Payable</span>
            <span className="font-mono text-[#B4942B] text-base">${summary.total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6 flex flex-col gap-6 font-sans">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-32" />
        </div>
        <CheckoutSkeleton />
      </div>
    );
  }

  if (orderCompleted) {
    return (
      <div className="w-full max-w-md mx-auto p-6 flex flex-col items-center justify-center min-h-[400px] text-center bg-white dark:bg-stone-950/40 rounded-3xl border border-stone-200/60 dark:border-stone-800 shadow-xl font-sans">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 text-emerald-500">
          <Check className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Order Placed Successfully!</h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 max-w-xs leading-relaxed">
          Thank you for your purchase from Dazeen Coffee Store! Your shipping address is logged and your shipment is ready for transit.
        </p>
        <Button
          onClick={() => {
            window.location.reload();
          }}
          className="mt-6 w-full h-11 rounded-2xl bg-[#B4942B] text-white hover:bg-[#B4942B]/90 font-semibold"
        >
          Back to Store
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6 flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4 flex-col">
          {" "}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-1 text-stone-500 hover:text-stone-900 text-xs"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Cart
          </Button>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl sm:text-2xl font-serif font-black flex items-center gap-2 text-stone-900 dark:text-stone-100">
              Checkout
            </h1>
            <p className="text-stone-500 text-xs">
              Complete your purchase securely
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1.5 text-[10px] bg-stone-100 text-stone-605">
          <Shield className="h-3.5 w-3.5 text-emerald-500" />
          SSL Secured
        </Badge>
      </div>{" "}
      {/* Progress Steps */}
      <div className="flex items-center justify-start gap-4 sm:gap-6 py-4 border-b border-stone-100 dark:border-stone-900">
        {[
          { step: 1, label: "Shipping", icon: Truck },
          { step: 2, label: "Payment", icon: CreditCard },
          { step: 3, label: "Review", icon: Check },
        ].map(({ step, label, icon: Icon }, index) => (
          <div key={step} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors text-xs font-bold",
                  currentStep >= step
                    ? "bg-stone-900 border-stone-900 text-white dark:bg-stone-100 dark:border-stone-100 dark:text-[#B4942B]"
                    : "border-stone-200 text-stone-400"
                )}
              >
                {currentStep > step ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold hidden sm:block",
                  currentStep >= step
                    ? "text-stone-900 dark:text-stone-100"
                    : "text-stone-400"
                )}
              >
                {label}
              </span>
            </div>
            {index < 2 && (
              <div
                className={cn(
                  "w-8 h-0.5",
                  currentStep > step
                    ? "bg-stone-900 dark:bg-stone-100"
                    : "bg-stone-200 dark:bg-stone-800"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Step 1: Shipping Information */}
          {currentStep === 1 && (
            <Card className="flex flex-col gap-6">
              <CardHeader>
                <h2 className="text-lg font-bold flex items-center gap-2 text-stone-900 dark:text-stone-100">
                  <MapPin className="h-4 w-4 text-[#B4942B]" />
                  Shipping Information
                </h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="firstName">First Name *</Label>{" "}
                    <Input
                      id="firstName"
                      size="lg"
                      placeholder="John"
                      value={shippingAddress.firstName}
                      onChange={(e) =>
                        handleAddressChange("firstName", e.target.value)
                      }
                      leftIcon={<User className="h-4 w-4" />}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lastName">Last Name *</Label>{" "}
                    <Input
                      id="lastName"
                      size="lg"
                      placeholder="Doe"
                      value={shippingAddress.lastName}
                      onChange={(e) =>
                        handleAddressChange("lastName", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email *</Label>{" "}
                    <Input
                      id="email"
                      size="lg"
                      type="email"
                      placeholder="john@example.com"
                      value={shippingAddress.email}
                      onChange={(e) =>
                        handleAddressChange("email", e.target.value)
                      }
                      leftIcon={<Mail className="h-4 w-4" />}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">Phone *</Label>{" "}
                    <Input
                      id="phone"
                      size="lg"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        handleAddressChange("phone", e.target.value)
                      }
                      leftIcon={<Phone className="h-4 w-4" />}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="address">Address *</Label>{" "}
                  <Input
                    id="address"
                    size="lg"
                    placeholder="123 Main Street"
                    value={shippingAddress.address}
                    onChange={(e) =>
                      handleAddressChange("address", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="city">City *</Label>{" "}
                    <Input
                      id="city"
                      size="lg"
                      placeholder="New York"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="state">State *</Label>
                    <Select
                      value={shippingAddress.state}
                      onValueChange={(value) =>
                        handleAddressChange("state", value)
                      }
                    >
                      <SelectTrigger size="lg">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>{" "}
                    <Input
                      id="zipCode"
                      size="lg"
                      placeholder="10001"
                      value={shippingAddress.zipCode}
                      onChange={(e) =>
                        handleAddressChange("zipCode", e.target.value)
                      }
                    />
                  </div>
                </div>{" "}
                {/* Shipping Methods */}
                <div className="flex flex-col gap-3 border-t border-stone-100 dark:border-stone-900 pt-4">
                  <Label>Shipping Method</Label>
                  <div className="flex flex-col gap-4">
                    {shippingMethods.map((method) => (
                      <div
                        key={method.id}
                        className={cn(
                          "p-4 border rounded-xl cursor-pointer transition-colors bg-white dark:bg-stone-950/20",
                          selectedShipping === method.id
                            ? "border-[#B4942B] bg-[#B4942B]/5"
                            : "border-stone-200 hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-900"
                        )}
                        onClick={() => setSelectedShipping(method.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full border-2 transition-colors",
                                selectedShipping === method.id
                                  ? "border-[#B4942B] bg-[#B4942B]"
                                  : "border-stone-300 dark:border-stone-700"
                              )}
                            />
                            <div>
                              <div className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                                {method.name}
                              </div>
                              <div className="text-[10px] text-stone-500">
                                {method.time}
                              </div>
                            </div>
                          </div>
                          <div className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                            ${method.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 border-t border-stone-100 dark:border-stone-900 pt-4">
                <Button
                  size="lg"
                  onClick={nextStep}
                  disabled={!validateStep(1)}
                  className="flex items-center gap-2 cursor-pointer bg-stone-900 text-white hover:bg-stone-850 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-stone-250 font-bold uppercase tracking-wider text-xs px-5 h-10 rounded-xl"
                >
                  Continue to Payment
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Payment options */}
          {currentStep === 2 && (
            <Card className="flex flex-col gap-6">
              <CardHeader>
                <h2 className="text-lg font-bold flex items-center gap-2 text-stone-900 dark:text-stone-100">
                  <CreditCard className="h-4 w-4 text-[#B4942B]" />
                  Payment Method
                </h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { id: "card", name: "Credit/Debit Card", icon: CreditCard },
                    { id: "upi", name: "UPI / QR", icon: Smartphone },
                    { id: "netbanking", name: "Net Banking", icon: Building2 },
                    { id: "cod", name: "Cash on Delivery", icon: Truck },
                  ].map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedPaymentType(type.id)}
                        className={cn(
                          "p-4 border rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center bg-white dark:bg-stone-950/20",
                          selectedPaymentType === type.id
                            ? "border-[#B4942B] bg-[#B4942B]/10 text-[#B4942B] font-bold"
                            : "border-stone-200 hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-900 text-stone-500"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-[10px] uppercase font-bold tracking-wide">{type.name}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedPaymentType === "card" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex flex-col gap-2 col-span-2">
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        size="lg"
                        placeholder="XXXX XXXX XXXX XXXX"
                        value={paymentMethod.cardNumber}
                        onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
                        leftIcon={<CreditCard className="h-4 w-4" />}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="expiryMonth">Expiry *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          id="expiryMonth"
                          size="lg"
                          placeholder="MM"
                          value={paymentMethod.expiryMonth}
                          onChange={(e) => handlePaymentChange("expiryMonth", e.target.value)}
                        />
                        <Input
                          id="expiryYear"
                          size="lg"
                          placeholder="YY"
                          value={paymentMethod.expiryYear}
                          onChange={(e) => handlePaymentChange("expiryYear", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        size="lg"
                        placeholder="123"
                        type="password"
                        maxLength={4}
                        value={paymentMethod.cvv}
                        onChange={(e) => handlePaymentChange("cvv", e.target.value)}
                        leftIcon={<Lock className="h-4 w-4" />}
                      />
                    </div>
                    <div className="flex flex-col gap-2 col-span-2">
                      <Label htmlFor="nameOnCard">Name on Card *</Label>
                      <Input
                        id="nameOnCard"
                        size="lg"
                        placeholder="John Doe"
                        value={paymentMethod.nameOnCard}
                        onChange={(e) => handlePaymentChange("nameOnCard", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {selectedPaymentType !== "card" && (
                  <div className="mt-4 p-4 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50 dark:bg-stone-900/30 text-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="font-bold text-stone-900 dark:text-stone-100 capitalize">{selectedPaymentType} Selected</span>
                    </div>
                    <p className="text-stone-500 dark:text-stone-400 text-[11px] leading-relaxed">
                      Please click continue. You can finalize this payment on the review step.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between gap-3 border-t border-stone-100 dark:border-stone-900 pt-4">
                <Button variant="ghost" onClick={prevStep} className="flex items-center gap-1.5 cursor-pointer text-xs text-stone-605">
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  size="lg"
                  onClick={nextStep}
                  disabled={!validateStep(2)}
                  className="flex items-center gap-2 cursor-pointer bg-stone-900 text-white hover:bg-stone-850 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-stone-250 font-bold uppercase tracking-wider text-xs px-5 h-10 rounded-xl"
                >
                  Continue to Review
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Review Order details */}
          {currentStep === 3 && (
            <Card className="flex flex-col gap-6">
              <CardHeader>
                <h2 className="text-lg font-bold flex items-center gap-2 text-stone-900 dark:text-stone-100">
                  <Check className="h-4 w-4 text-[#B4942B]" />
                  Review & Confirm Order
                </h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                {/* Delivery info & payment info review */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2">
                    <h3 className="font-bold text-xs flex items-center gap-1.5 text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                      <MapPin className="h-4 w-4 text-[#B4942B]" />
                      Shipping Address
                    </h3>
                    <div className="text-xs space-y-1 text-stone-500 dark:text-stone-400 leading-relaxed">
                      <p className="font-bold text-stone-900 dark:text-stone-100">
                        {shippingAddress.firstName} {shippingAddress.lastName}
                      </p>
                      <p>{shippingAddress.phone}</p>
                      <p>{shippingAddress.email}</p>
                      <p className="text-stone-705 dark:text-stone-300 font-medium">
                        {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zipCode}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-xl space-y-2">
                    <h3 className="font-bold text-xs flex items-center gap-1.5 text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                      <CreditCard className="h-4 w-4 text-[#B4942B]" />
                      Payment Method
                    </h3>
                    <div className="text-xs space-y-1 text-stone-500 dark:text-stone-400 leading-relaxed">
                      <p className="font-extrabold text-[#B4942B] uppercase text-[10px] tracking-widest">{selectedPaymentType}</p>
                      {selectedPaymentType === "card" ? (
                        <>
                          <p>Card Ending in •••• {paymentMethod.cardNumber.slice(-4) || "XXXX"}</p>
                          <p>Expiry: {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}</p>
                        </>
                      ) : (
                        <p>Selected payment channel: {selectedPaymentType}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* T&C checkbox */}
                <div className="flex items-start gap-3 mt-4">
                  <Checkbox
                    id="agreeToTerms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="agreeToTerms" className="text-xs font-semibold cursor-pointer text-stone-900 dark:text-stone-100 select-none">
                      I agree to the terms of service and refund policies *
                    </Label>
                    <p className="text-[10px] text-stone-405 leading-relaxed">
                      By checking this box, you authorize Dazeen Coffee store to place your secure transaction.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-3 border-t border-stone-100 dark:border-stone-900 pt-4">
                <Button variant="ghost" onClick={prevStep} className="flex items-center gap-1.5 cursor-pointer text-xs text-stone-605">
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  size="lg"
                  onClick={handlePlaceOrderComplete}
                  disabled={!agreeToTerms}
                  className="flex items-center gap-2 cursor-pointer bg-[#B4942B] text-white hover:bg-[#B4942B]/90 font-bold uppercase tracking-wider text-xs px-6 h-10 rounded-xl border border-[#B4942B] disabled:opacity-50"
                >
                  Place Order
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <OrderSummaryCard />
        </div>
      </div>
    </div>
  );
}
