import { Link } from "wouter";
import { MapPin, Phone, Mail, Clock, GraduationCap } from "lucide-react";
import schoolLogo from "@assets/school_1764669401414.jpg";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sidebar text-sidebar-foreground border-t border-sidebar-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={schoolLogo} 
                alt="Al-Furqan Logo" 
                className="h-14 w-14 rounded-full object-cover border-2 border-sidebar-primary"
              />
              <div>
                <h3 className="text-xl font-bold text-sidebar-foreground">Al-Furqan</h3>
                <p className="text-sm text-sidebar-foreground/70">Group of Schools</p>
              </div>
            </div>
            <p className="text-sm text-sidebar-foreground/80 leading-relaxed mb-4">
              "Knowledge at childhood is like an inscription on a stone."
            </p>
            <p className="text-sm text-sidebar-foreground/70">
              Government Approved institution providing sound qualitative, quantitative and moral uprightness.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-sidebar-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/alumni", label: "Our Alumni" },
                { href: "/teachers", label: "Our Teachers" },
                { href: "/registration", label: "Registration" },
                { href: "/login", label: "Portal Login" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-sidebar-foreground">Academic Levels</h4>
            <ul className="space-y-2">
              {["Nursery School", "Primary School", "Junior Secondary", "Senior Secondary"].map((level) => (
                <li key={level} className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
                  <GraduationCap className="h-4 w-4 text-sidebar-primary" />
                  {level}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-sidebar-foreground">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-sidebar-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-sidebar-foreground/80">
                  Airforce Road GbaGba,<br />Ilorin, Kwara State, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-sidebar-primary flex-shrink-0" />
                <span className="text-sm text-sidebar-foreground/80">+234 XXX XXX XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-sidebar-primary flex-shrink-0" />
                <span className="text-sm text-sidebar-foreground/80">info@alfurqanschools.edu.ng</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-sidebar-primary flex-shrink-0" />
                <span className="text-sm text-sidebar-foreground/80">Mon - Fri: 8:00 AM - 4:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-sidebar-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-sidebar-foreground/60">
              &copy; {currentYear} Al-Furqan Group of Schools. All rights reserved.
            </p>
            <p className="text-xs text-sidebar-foreground/50">
              Established 1993 | Government Approved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
