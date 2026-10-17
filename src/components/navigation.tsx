"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { chapters } from "@/lib/chapters";
export function Navigation() {
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const path = usePathname();
  const active = (href: string) =>
    href === "/" ? path === href : path === href || path.startsWith(href + "/");
  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="Sanket Mohanty home">
          <span className="brand-mark">
            sm<span>.</span>
          </span>
          <span className="brand-name">
            Sanket Mohanty<small>AI & SOFTWARE ENGINEERING</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {chapters.slice(1).map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={active(href) ? "active" : ""}
              aria-current={active(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle color theme"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <Sun className="sun-icon" size={18} />
            <Moon className="moon-icon" size={18} />
          </Button>
          <Link className="nav-resume" href="/resume">
            Resume <ArrowUpRight size={15} />
          </Link>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <Button
                className="mobile-menu-button"
                variant="ghost"
                size="icon"
                aria-label="Open navigation"
              >
                <Menu size={23} />
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay" />
              <Dialog.Content className="mobile-nav">
                <Dialog.Title className="mobile-nav-title">
                  The portfolio.
                </Dialog.Title>
                <Dialog.Description>
                  Choose a chapter to explore.
                </Dialog.Description>
                <Dialog.Close asChild>
                  <Button
                    className="dialog-close"
                    variant="ghost"
                    size="icon"
                    aria-label="Close navigation"
                  >
                    <X />
                  </Button>
                </Dialog.Close>
                <nav aria-label="Mobile navigation">
                  {chapters.map(({ label, href, number }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={active(href) ? "page" : undefined}
                    >
                      <span>
                        <span
                          className="mobile-chapter-number"
                          aria-hidden="true"
                        >
                          {number}
                        </span>
                        {label}
                      </span>
                      <ArrowUpRight size={18} />
                    </Link>
                  ))}
                  <Link href="/resume" onClick={() => setOpen(false)}>
                    Resume
                    <ArrowUpRight size={18} />
                  </Link>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
