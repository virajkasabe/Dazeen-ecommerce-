import React from 'react';
import { RadioGroup3D } from "./3d-radio-group";

export default function Demo3D() {
  const [step, setStep] = React.useState<"cart" | "address" | "payment">("cart");

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-stone-950 rounded-3xl border border-stone-850 shadow-2xl max-w-sm mx-auto my-6 select-none">
      <h4 className="text-xs font-bold font-mono tracking-widest text-[#B4942B] uppercase mb-5">
        Checkout Flow Stepper
      </h4>
      <RadioGroup3D value={step} onChange={setStep} />
    </div>
  );
}
