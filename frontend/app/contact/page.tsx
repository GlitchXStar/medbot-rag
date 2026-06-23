"use client";

import { motion } from "framer-motion";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <section className="min-h-[80vh] flex items-center justify-center py-[120px]">
          <div className="mx-auto max-w-[480px] w-full px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className="text-center mb-12"
            >
              <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-accent-primary mb-4">
                Contact
              </p>
              <h1 className="text-[2.5rem] font-bold tracking-[-0.03em] text-text-primary">
                Get in Touch
              </h1>
              <p className="mt-4 text-text-secondary text-[15px]">
                Have questions about MedBot? We&apos;d love to hear from you.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.15,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              onSubmit={(e) => e.preventDefault()}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-[13px] font-medium text-text-secondary mb-2"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  className="w-full h-12 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-text-primary text-[14px] placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary/40 transition-colors duration-200"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-[13px] font-medium text-text-secondary mb-2"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-12 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-text-primary text-[14px] placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary/40 transition-colors duration-200"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-[13px] font-medium text-text-secondary mb-2"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Tell us what you're looking for..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-text-primary text-[14px] placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary/40 transition-colors duration-200 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 text-[14px] font-medium text-white bg-accent-primary hover:bg-accent-primary/90 rounded-full transition-all duration-250 hover:-translate-y-[1px] hover:shadow-[0_6px_24px_rgba(37,99,235,0.35)]"
              >
                Send Message
              </button>
            </motion.form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
