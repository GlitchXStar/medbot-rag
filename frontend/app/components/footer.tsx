import Link from "next/link";

const footerLinks = [
  { href: "/features", label: "Features" },
  { href: "/contact", label: "Contact" },
  { href: "#", label: "Privacy" },
  { href: "#", label: "Terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row items-center justify-between py-8 gap-4">
          {/* Left */}
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
            <span className="text-[12px] text-text-tertiary">
              © 2026 MedBot AI. All rights reserved.
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[12px] text-text-tertiary hover:text-text-secondary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
