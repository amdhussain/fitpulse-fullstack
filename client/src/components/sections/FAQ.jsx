import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { Container, SectionTitle, Skeleton } from "../ui";
import { staggerContainer, fadeUp } from "../../lib/animations";

const faqs = [
  {
    question: "How do I book a fitness class?",
    answer: "Simply create an account, browse available classes under the Services section, and click 'Book Now' on your preferred session. You'll receive an instant confirmation with all the details.",
  },
  {
    question: "What membership plans are available?",
    answer: "We offer flexible plans including Basic, Premium, and Elite memberships. Each plan provides different levels of access to classes, trainers, and facilities. Visit our Membership page to compare plans and pricing.",
  },
  {
    question: "Can I cancel or reschedule a booking?",
    answer: "Yes. You can cancel or reschedule any booking up to 4 hours before the session starts from your Dashboard under 'My Bookings'. Late cancellations may be subject to a fee depending on your membership plan.",
  },
  {
    question: "Are the trainers certified?",
    answer: "Absolutely. All our trainers hold nationally recognized certifications and undergo continuous professional development. Each trainer specializes in different areas such as strength training, cardio, yoga, and nutrition.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards, as well as digital wallets. All payments are securely processed with industry-standard encryption. You can manage your payment methods in your account settings.",
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! New members can try a complimentary introductory session to experience our facilities and meet a trainer. No commitment required — just sign up and book your free trial class.",
  },
  {
    question: "How do I contact support?",
    answer: "You can reach our support team through the Contact page on the website, via email, or through the in-app messaging system. Our team typically responds within a few hours during business days.",
  },
];

function AccordionItem({ faq, isOpen, onToggle, index }) {
  return (
    <motion.div variants={fadeUp} custom={index}>
      <div
        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
          isOpen
            ? "bg-base-200/80 border-blue-500/20 shadow-lg shadow-blue-500/5"
            : "bg-base-200/40 border-base-300/40 hover:border-base-300/60 hover:bg-base-200/50"
        }`}
      >
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-4 p-6 sm:p-7 text-left cursor-pointer"
          aria-expanded={isOpen}
        >
          <span className={`text-base sm:text-lg font-semibold transition-colors duration-200 tracking-tight ${isOpen ? "text-base-content" : "text-base-content/80"}`}>
            {faq.question}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200 ${
              isOpen ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500"
            }`}
          >
            <FiChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="px-6 sm:px-7 pb-6 sm:pb-7">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-[1.7]">
                  {faq.answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function FAQ() {
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-white dark:from-slate-900 dark:via-indigo-950/5 dark:to-slate-900">
        <Container>
          <div className="text-center space-y-3 mb-16">
            <Skeleton variant="shimmer" className="h-8 w-24 rounded-full mx-auto" />
            <Skeleton variant="shimmer" className="h-10 w-64 mx-auto" />
            <Skeleton variant="shimmer" className="h-5 w-80 mx-auto" />
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="p-7 rounded-2xl bg-base-200/40 border border-base-300/30">
                <Skeleton variant="shimmer" className="h-5 w-3/4" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
      <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-white dark:from-slate-900 dark:via-indigo-950/5 dark:to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-indigo-200/30 dark:bg-indigo-500/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 -right-40 w-[400px] h-[400px] bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center"
        >
          <motion.div variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-indigo-500" aria-hidden="true" />
              FAQ
            </span>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <SectionTitle
              title="Frequently Asked Questions"
              description="Got questions? We've got answers. Find everything you need to know about FitBookPro."
              accentColor="indigo"
              className="mt-7 mb-0"
            />
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-16 max-w-3xl mx-auto space-y-4"
        >
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

export default FAQ;
