import { Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const quickLinks = [
  { id: 'features', label: 'المميزات' },
  { id: 'how-it-works', label: 'كيف يعمل' },
  { id: 'pricing', label: 'الأسعار' },
  { id: 'faq', label: 'الأسئلة الشائعة' },
];

const supportLinks = [
  { label: 'مركز المساعدة', href: '#' },
  { label: 'تواصل معنا', href: '#' },
  { label: 'سياسة الخصوصية', href: '#' },
  { label: 'الشروط والأحكام', href: '#' },
];

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export default function Footer({ onScrollTo }) {
  return (
    <footer className="bg-navy-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-navy-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                أ
              </div>
              <span className="text-xl font-bold">أثر البداية</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              منصة اكتشاف الذات المهني للطلاب في المملكة العربية السعودية
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold mb-4">روابط سريعة</h4>
            <div className="space-y-2 text-gray-400">
              {quickLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onScrollTo?.(link.id)}
                  className="block hover:text-green-400 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4">الدعم</h4>
            <div className="space-y-2 text-gray-400">
              {supportLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block hover:text-green-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">تواصل معنا</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-400" />
                <span dir="ltr">info@athar-start.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-400" />
                <span dir="ltr">+966 50 000 0000</span>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex gap-3 mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 text-center text-gray-400">
          <p>&copy; 2025 أثر البداية. جميع الحقوق محفوظة. منتج من يونكس.</p>
        </div>
      </div>
    </footer>
  );
}
