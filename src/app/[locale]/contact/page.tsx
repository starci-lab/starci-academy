"use client";
import { motion } from "framer-motion";
import { Clock, Mail, Phone, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              Get in Touch
            </h1>
            <p className="text-white/50 text-lg mb-12 leading-relaxed">
              Have questions about our courses or need help with your learning
              journey? Our team is here to support you.
            </p>

            <div className="space-y-8">
              {[
                {
                  icon: Mail,
                  label: "Email Us",
                  value: "hello@starci.academy",
                  desc: "We usually respond within 24 hours.",
                },
                {
                  icon: Phone,
                  label: "Call Us",
                  value: "+(84) 969 998 024",
                  desc: "Mon-Fri from 9am to 6pm.",
                },
                // {
                //   icon: MapPin,
                //   label: "Visit Us",
                //   value: "123 Tech Avenue",
                //   desc: "Silicon Valley, CA 94043",
                // },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="bg-brand-blue/10 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-brand-blue/20 group-hover:bg-brand-blue group-hover:border-brand-blue transition-all duration-300">
                    <item.icon className="w-6 h-6 text-brand-blue group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{item.label}</h4>
                    <p className="text-white font-medium mb-1">{item.value}</p>
                    <p className="text-white/40 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 p-8 glass rounded-3xl border-white/5">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-green-500" />
                </div>
                <h4 className="font-bold">Support Hours</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-white/50">Monday - Friday</div>
                <div className="text-right">9:00 AM - 6:00 PM</div>
                <div className="text-white/50">Saturday</div>
                <div className="text-right">10:00 AM - 4:00 PM</div>
                <div className="text-white/50">Sunday</div>
                <div className="text-right text-white/30 italic">Closed</div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="glass p-8 md:p-12 rounded-[40px] border-white/10"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/60 ml-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-blue transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/60 ml-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-blue transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/60 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-blue transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/60 ml-1">
                  Subject
                </label>
                <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-blue transition-colors appearance-none">
                  <option className="bg-brand-dark">General Inquiry</option>
                  <option className="bg-brand-dark">Course Support</option>
                  <option className="bg-brand-dark">Partnership</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/60 ml-1">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-blue transition-colors resize-none"
                ></textarea>
              </div>

              <button className="w-full bg-brand-blue hover:bg-blue-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-blue-500/20 active:scale-[0.98]">
                Send Message
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
