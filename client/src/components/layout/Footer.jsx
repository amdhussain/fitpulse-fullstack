import { Link } from "react-router-dom";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Container, Logo } from "../ui";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/login", label: "Login" },
  { to: "/dashboard", label: "Dashboard" },
];

const socialLinks = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-base-200/50 border-t border-base-300/50">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-base-content/45 text-sm leading-relaxed max-w-xs">
              Your ultimate fitness booking platform. Book classes, connect
              with trainers, and achieve your fitness goals.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-base-300/50 flex items-center justify-center
                    text-base-content/40 hover:bg-blue-500 hover:text-white
                    transition-all duration-300 hover:scale-110"
                >
                  <social.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-base-content uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to + link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-base-content/45 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-base-content uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-base-content/45">
                <FiMapPin className="mt-0.5 shrink-0 text-blue-400" size={16} />
                <span>123 Fitness Street, Wellness City, FC 12345</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-base-content/45">
                <FiPhone className="shrink-0 text-blue-400" size={16} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-base-content/45">
                <FiMail className="shrink-0 text-blue-400" size={16} />
                <span>info@fitbookpro.com</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-base-300/50">
        <Container className="py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-base-content/35">
            <p>&copy; {year} FitBookPro. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="hover:text-blue-400 transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-blue-400 transition-colors cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
