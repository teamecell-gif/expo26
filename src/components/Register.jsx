import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { validateForm } from "../FormValidation";
import { registerUser } from "../Api";
import "./Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    startUpSector: "",
    headquarter: "",
    linkedin: "",
    description: "",
    challan: "",
  });

  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    
    const validationErrors = validateForm(formData);
    if (!checkboxChecked) validationErrors.declaration = "Please accept the declaration.";
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await registerUser(formData); 
      
      setShowSuccess(true);
      setFormData({ name: "", email: "", startUpSector: "", headquarter: "", linkedin: "", description: "", challan: "" });
      setCheckboxChecked(false);
    } catch (error) {
      setStatusMessage(error.message || "Connection to port 5000 failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="reg" className="bg-black w-full flex flex-col justify-center items-center pb-24 px-4 relative min-h-screen">
      <h1 className="text-5xl text-brand mt-10 font-bold uppercase tracking-tighter">Register Now</h1>

      <motion.div className="flex flex-col mt-10 w-full max-w-3xl glass p-8 text-white rounded-3xl shadow-2xl relative">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2">Startup Name *</label>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. VNIT Tech" className="input-style text-black" required />
            {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name}</span>}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2">Email *</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="contact@startup.com" className="input-style text-black" required />
            {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email}</span>}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2">Startup Sector *</label>
            <input name="startUpSector" value={formData.startUpSector} onChange={handleChange} placeholder="e.g. FinTech" className="input-style text-black" required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2">Headquarter *</label>
            <input name="headquarter" value={formData.headquarter} onChange={handleChange} placeholder="e.g. Nagpur" className="input-style text-black" required />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-semibold mb-2">LinkedIn / Website *</label>
            <input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/company/..." className="input-style text-black" required />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-semibold mb-2">Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="input-style text-black" placeholder="Briefly describe your startup..." required />
          </div>

          {/* --- STEP 2 TEXT & LINK ADDED BACK --- */}
          <div className="md:col-span-2">
            <div className="mb-2 mt-2 text-white text-lg">
              Step 2:{" "}
              <a
                className="text-[#4a4adf] underline text-lg font-bold"
                href="https://pay.vnit.ac.in/event"
                target="_blank"
                rel="noopener noreferrer"
              >
                Generate Challan
              </a>
              <p className="mb-4 mt-2 px-1 text-slate-300 text-sm md:text-base leading-relaxed">
                Please visit the link above, complete the payment, and then copy and
                paste the Challan number from the official VNIT payment site into the field below.
              </p>
            </div>

            <label className="text-sm font-semibold mb-2">Challan Number *</label>
            <input 
              name="challan" 
              value={formData.challan} 
              onChange={handleChange} 
              className="input-style text-black border-brand/50" 
              placeholder="Paste your VNIT Challan ID here" 
              required 
            />
          </div>

          <div className="md:col-span-2 flex items-start gap-3 py-2">
            <input type="checkbox" checked={checkboxChecked} onChange={() => setCheckboxChecked(!checkboxChecked)} className="mt-1" />
            <p className="text-xs text-slate-300">I declare that the details furnished above are correct to my knowledge.</p>
          </div>
          
          <div className="md:col-span-2 flex justify-center mt-4">
            <button type="submit" disabled={loading} className="w-full md:w-auto rounded-full py-4 px-12 text-lg font-bold text-white btn-gradient hover:scale-105 disabled:opacity-50 transition-all">
              {loading ? "REGISTERING..." : "SUBMIT TO EXPO"}
            </button>
          </div>
        </form>
        {statusMessage && <p className="text-red-500 mt-4 text-center text-sm font-medium">{statusMessage}</p>}
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-900 border border-brand/20 p-8 rounded-3xl text-center max-w-sm shadow-2xl">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckIcon className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Registration Received!</h3>
              <p className="text-slate-400 text-sm mb-6">Your data has been saved to the central repository. See you at the Expo!</p>
              <button onClick={() => setShowSuccess(false)} className="w-full py-3 bg-brand text-white font-bold rounded-xl transition-all">CLOSE</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
    </svg>
  );
}