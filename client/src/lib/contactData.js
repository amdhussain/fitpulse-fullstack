const contactInfo = [
  {
    id: 1,
    icon: "phone",
    title: "Phone Number",
    value: "+1 (555) 123-4567",
    description: "Mon - Fri, 8AM - 8PM",
    accentColor: "red",
    href: "tel:+15551234567",
  },
  {
    id: 2,
    icon: "email",
    title: "Email Address",
    value: "info@fitnesspro.com",
    description: "We reply within 24 hours",
    accentColor: "blue",
    href: "mailto:info@fitnesspro.com",
  },
  {
    id: 3,
    icon: "location",
    title: "Our Location",
    value: "123 Fitness Street, Downtown",
    description: "New York, NY 10001",
    accentColor: "emerald",
    href: "#map",
  },
  {
    id: 4,
    icon: "clock",
    title: "Working Hours",
    value: "Mon - Sat: 5AM - 11PM",
    description: "Sunday: 7AM - 9PM",
    accentColor: "amber",
    href: null,
  },
  {
    id: 5,
    icon: "emergency",
    title: "Emergency Contact",
    value: "+1 (555) 999-0000",
    description: "24/7 Emergency Line",
    accentColor: "rose",
    href: "tel:+15559990000",
  },
];

const socialLinks = [
  {
    id: 1,
    platform: "Facebook",
    url: "https://facebook.com/fitnesspro",
    icon: "facebook",
    color: "blue",
  },
  {
    id: 2,
    platform: "Instagram",
    url: "https://instagram.com/fitnesspro",
    icon: "instagram",
    color: "pink",
  },
  {
    id: 3,
    platform: "LinkedIn",
    url: "https://linkedin.com/company/fitnesspro",
    icon: "linkedin",
    color: "blue",
  },
  {
    id: 4,
    platform: "YouTube",
    url: "https://youtube.com/@fitnesspro",
    icon: "youtube",
    color: "red",
  },
  {
    id: 5,
    platform: "WhatsApp",
    url: "https://wa.me/15551234567",
    icon: "whatsapp",
    color: "green",
  },
];

const whyContactData = [
  {
    id: 1,
    icon: "trainers",
    title: "Certified Trainers",
    description: "Our team of certified professionals is ready to guide you on your fitness journey with personalized expertise.",
  },
  {
    id: 2,
    icon: "response",
    title: "Quick Response",
    description: "We guarantee a response within 24 hours. Your questions and concerns are our top priority.",
  },
  {
    id: 3,
    icon: "support",
    title: "Friendly Support",
    description: "Our support team is warm, welcoming, and always ready to help you with anything you need.",
  },
  {
    id: 4,
    icon: "guidance",
    title: "Professional Guidance",
    description: "Get expert advice on training programs, nutrition plans, and membership options tailored to your goals.",
  },
];

const ctaData = {
  heading: "Ready to Start Your Fitness Journey?",
  description: "Join thousands of members who have transformed their lives with our expert guidance. Your first consultation is completely free.",
  primaryButton: { label: "Join Now", href: "/booking" },
  secondaryButton: { label: "Call Us", href: "tel:+15551234567" },
};

const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095943055!2d-74.00425878428698!3d40.74076794379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sGoogle%20New%20York!5e0!3m2!1sen!2sus!4v1234567890";

const pageMetadata = {
  title: "Get In Touch",
  subtitle: "Contact Us",
  description: "Have questions about our programs, membership, or facilities? We are here to help. Reach out to us anytime.",
  heroImage: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&h=800&fit=crop&auto=format&q=80",
};

export function getContactInfo() {
  return contactInfo;
}

export function getSocialLinks() {
  return socialLinks;
}

export function getWhyContactData() {
  return whyContactData;
}

export function getCtaData() {
  return ctaData;
}

export function getMapEmbedUrl() {
  return mapEmbedUrl;
}

export function getPageMetadata() {
  return pageMetadata;
}
