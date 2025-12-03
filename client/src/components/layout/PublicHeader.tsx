import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun, GraduationCap } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useState } from "react";
import schoolLogo from "@assets/school_1764669401414.jpg";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/alumni", label: "Alumni" },
  { href: "/teachers", label: "Teachers" },
  { href: "/registration", label: "Registration" },
];

export function PublicHeader() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 hover-elevate rounded-md p-1">
            <img 
              src={schoolLogo} 
              alt="Al-Furqan Logo" 
              className="h-10 w-10 rounded-full object-cover border-2 border-primary"
              data-testid="img-school-logo"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground leading-tight" data-testid="text-school-name">
                Al-Furqan
              </h1>
              <p className="text-xs text-muted-foreground leading-tight">Group of Schools</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={location === link.href ? "secondary" : "ghost"}
                  className="text-sm font-medium"
                  data-testid={`link-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Link href="/login" className="hidden sm:block">
              <Button data-testid="button-portal-login">
                <GraduationCap className="h-4 w-4 mr-2" />
                Portal Login
              </Button>
            </Link>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={schoolLogo} 
                      alt="Al-Furqan Logo" 
                      className="h-12 w-12 rounded-full object-cover border-2 border-primary"
                    />
                    <div>
                      <h2 className="font-bold text-foreground">Al-Furqan</h2>
                      <p className="text-sm text-muted-foreground">Group of Schools</p>
                    </div>
                  </div>
                  
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <Button
                        variant={location === link.href ? "secondary" : "ghost"}
                        className="w-full justify-start text-base"
                        onClick={() => setIsOpen(false)}
                        data-testid={`link-mobile-${link.label.toLowerCase()}`}
                      >
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <Link href="/login">
                      <Button className="w-full" onClick={() => setIsOpen(false)} data-testid="button-mobile-portal">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Portal Login
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
