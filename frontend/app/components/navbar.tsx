"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Login" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out",
          scrolled
            ? "glass-strong"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="flex h-[72px] items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-accent-primary group-hover:shadow-[0_0_12px_rgba(37,99,235,0.6)] transition-shadow duration-300" />
                <span className="text-[17px] font-semibold tracking-[-0.02em] text-text-primary">
                  MedBot
                </span>
                <span className="text-[17px] font-light tracking-[-0.02em] text-text-secondary">
                  AI
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/register"
                className="text-[13px] font-medium text-white bg-accent-primary hover:bg-accent-primary/90 px-5 py-2 rounded-full transition-all duration-250 hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(37,99,235,0.3)]"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-bg-primary/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-xl font-medium text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-white bg-accent-primary px-8 py-3 rounded-full"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
