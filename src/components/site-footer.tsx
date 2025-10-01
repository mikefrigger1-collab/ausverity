import Link from "next/link"
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section - Takes 2 columns on XL screens */}
          <div className="md:col-span-2 xl:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">AusVerity</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
              Australia's most trusted legal directory connecting clients with verified lawyers and law firms. 
              Find expert legal representation with confidence.
            </p>
            <div className="flex items-start space-x-4">
              <div className="bg-slate-800 p-3 rounded-lg">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-1">Email</p>
                <p className="text-sm text-slate-400">support@ausverity.com.au</p>
              </div>
            </div>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">
              For Clients
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/search" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Find Lawyers
                </Link>
              </li>
              <li>
                <Link href="/practice-areas" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Practice Areas
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/reviews/submit" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Write a Review
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* For Lawyers */}
          <div>
            <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">
              For Lawyers
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/register" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Join AusVerity
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/lawyer/dashboard" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Lawyer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/firm/dashboard" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Firm Dashboard
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Help Centre
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">
              Company
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Footer */}
      <Separator className="bg-slate-700" />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-slate-400 text-center">
            <p>&copy; 2025 AusVerity Pty Ltd. All rights reserved.</p>
            <span className="hidden sm:inline text-slate-600">•</span>
            <p>ABN: 123 456 789 012</p>
          </div>
          
        </div>
      </div>
    </footer>
  )
}