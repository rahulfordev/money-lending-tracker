"use client";

import { useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import {
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  BookOpen,
  Video,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Users,
  Clock,
} from "lucide-react";

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ Data
  const faqCategories = [
    {
      id: "getting-started",
      name: "Getting Started",
      icon: BookOpen,
      faqs: [
        {
          id: 1,
          question: "How do I add my first borrower?",
          answer:
            "To add your first borrower, go to the Borrowers page and click the 'Add Borrower' button. Enter the borrower's name and save. You can then add loans and track repayments for this borrower.",
        },
        {
          id: 2,
          question: "How do I record a loan?",
          answer:
            "Navigate to the Loans page and click 'New Loan'. Select the borrower, enter the loan amount, date, and any description. The system will automatically track this loan and calculate balances.",
        },
        {
          id: 3,
          question: "Can I edit or delete a loan?",
          answer:
            "Yes, you can edit or delete loans from the Loans page. Click the 'Edit' button to modify loan details or 'Delete' to remove a loan (this will also delete associated repayments).",
        },
      ],
    },
    {
      id: "repayments",
      name: "Repayments",
      icon: Clock,
      faqs: [
        {
          id: 4,
          question: "How do I record a repayment?",
          answer:
            "Go to the Repayments page and click 'Record Payment'. Select the loan, enter the payment amount, date, and any notes. The system will update the remaining balance automatically.",
        },
        {
          id: 5,
          question: "Can I edit repayment records?",
          answer:
            "Yes, you can edit repayment records by clicking the 'Edit' button next to any repayment on the Repayments page. You can modify the amount, date, or notes.",
        },
        {
          id: 6,
          question: "How are balances calculated?",
          answer:
            "The system automatically calculates balances by subtracting total repayments from the original loan amount. You can see the current balance for each borrower on the Borrowers page.",
        },
      ],
    },
    {
      id: "analytics",
      name: "Analytics & Reports",
      icon: FileText,
      faqs: [
        {
          id: 7,
          question: "What analytics are available?",
          answer:
            "The Analytics page provides insights into total lending, recovery rates, monthly performance, borrower performance, and loan status distribution.",
        },
        {
          id: 8,
          question: "Can I export my data?",
          answer:
            "Yes, you can export your data from the Settings page under Data Management. Export options include loans, repayments, and complete data in CSV format.",
        },
        {
          id: 9,
          question: "How often is analytics data updated?",
          answer:
            "Analytics data updates in real-time. Any changes to loans or repayments are immediately reflected in the analytics dashboard.",
        },
      ],
    },
    {
      id: "account",
      name: "Account & Settings",
      icon: Users,
      faqs: [
        {
          id: 10,
          question: "How do I change my password?",
          answer:
            "Go to Settings → Security tab. Enter your current password and new password to update your account security.",
        },
        {
          id: 11,
          question: "Can I customize the app appearance?",
          answer:
            "Yes, in Settings → Appearance, you can change themes, language, currency format, and date format to suit your preferences.",
        },
        {
          id: 12,
          question: "How do I manage notifications?",
          answer:
            "Navigate to Settings → Notifications to configure email alerts, payment reminders, and other notification preferences.",
        },
      ],
    },
  ];

  // Contact methods
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email and we'll get back to you within 24 hours",
      contact: "support@moneytracker.com",
      action: "Send Email",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us during business hours for immediate assistance",
      contact: "+1 (555) 123-4567",
      action: "Call Now",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available 9 AM - 6 PM",
      action: "Start Chat",
    },
  ];

  // Quick guides
  const quickGuides = [
    {
      title: "Getting Started Guide",
      description: "Learn how to set up your account and start tracking loans",
      icon: BookOpen,
      link: "#",
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides for all features",
      icon: Video,
      link: "#",
    },
    {
      title: "Best Practices",
      description: "Tips for effective money lending management",
      icon: FileText,
      link: "#",
    },
  ];

  // Filter FAQs based on search
  const filteredFaqs = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.faqs.length > 0);

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-2">
            Get help, browse documentation, and contact support
          </p>
        </div>
      </div>

      {/* Search Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="text-center max-w-2xl mx-auto">
          <HelpCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            How can we help you?
          </h2>
          <p className="text-gray-600 mb-6">
            Search our knowledge base or browse common questions below
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </Card>

      {/* Quick Guides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickGuides.map((guide, index) => {
          const Icon = guide.icon;
          return (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {guide.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center"
                  >
                    Learn More
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* FAQ Categories Sidebar */}
        <Card className="lg:col-span-1 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
          <nav className="space-y-1">
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${
                      activeCategory === category.id
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {category.name}
                </button>
              );
            })}
          </nav>
        </Card>

        {/* FAQ Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Show all FAQs when searching, otherwise show by category */}
          {(searchTerm
            ? filteredFaqs
            : filteredFaqs.filter((cat) => cat.id === activeCategory)
          ).map((category) => (
            <Card key={category.id} className="p-6">
              <div className="flex items-center mb-6">
                <category.icon className="h-6 w-6 text-gray-700 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {category.name}
                </h2>
              </div>

              <div className="space-y-4">
                {category.faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 rounded-lg"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900 pr-4">
                        {faq.question}
                      </span>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>

                    {expandedFaq === faq.id && (
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {category.faqs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <HelpCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No questions found matching your search.</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Support Section */}
      <Card className="p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Still need help?
          </h2>
          <p className="text-gray-600">
            Our support team is here to assist you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {method.description}
                </p>
                <p className="text-lg font-medium text-gray-900 mb-4">
                  {method.contact}
                </p>
                <Button className="w-full">{method.action}</Button>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* Additional Resources */}
      <Card className="p-6 bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Resources
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="secondary" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              User Manual
            </Button>
            <Button variant="secondary" className="flex items-center">
              <Video className="h-4 w-4 mr-2" />
              Video Tutorials
            </Button>
            <Button variant="secondary" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              API Documentation
            </Button>
            <Button variant="secondary" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Community Forum
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
