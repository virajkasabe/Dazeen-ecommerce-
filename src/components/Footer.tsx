interface FooterProps {
  onNavigate?: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="site-footer" id="site_footer">
      {/* Dynamic Keyframes and Core Selectors Injected Securely */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes footerDotsMove {
          from { transform: translate3d(0, -50%, 0); }
          to   { transform: translate3d(-50%, -50%, 0); }
        }
        .site-footer {
          position: relative;
          z-index: 100;
          overflow: hidden;
          background-color: #000000;
          color: #ffffff;
          font-family: "Geist", "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: geometricPrecision;
          width: 100%;
        }
        .site-footer a {
          color: inherit;
          text-decoration: none;
        }
        .footer-dots {
          position: relative;
          height: 120px;
          overflow: hidden;
          background-color: #000000;
        }
        .footer-dots__line {
          position: absolute;
          left: 0;
          top: 50%;
          width: 200%;
          height: 70px;
          opacity: 0.75;
          transform: translateY(-50%);
          background-image: 
            radial-gradient(circle, rgb(255 255 255 / 0.55) 1.5px, transparent 2px),
            radial-gradient(circle, rgb(255 255 255 / 0.35) 1px, transparent 1.5px),
            radial-gradient(circle, rgb(255 255 255 / 0.45) 1.2px, transparent 1.8px);
          background-position: 0 8px, 24px 22px, 48px 14px;
          background-size: 72px 38px, 110px 44px, 160px 52px;
          animation: footerDotsMove 18s linear infinite;
        }
        .site-footer__inner {
          --hero-max-width: 1820px;
          width: min(100% - 96px, var(--hero-max-width));
          margin: 0 auto;
          padding: clamp(34px, 4vw, 66px) 0 clamp(18px, 2vw, 34px);
        }
        .site-footer__top {
          display: grid;
          grid-template-columns: minmax(320px, 1.25fr) repeat(3, minmax(150px, 0.42fr));
          gap: clamp(28px, 4vw, 76px);
          min-height: clamp(220px, 24vw, 330px);
        }
        .site-footer__nav {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: clamp(14px, 1.35vw, 22px);
        }
        .site-footer__nav a {
          color: rgb(255 255 255 / 0.88);
          font-size: 16px;
          font-weight: 650;
          line-height: 1.1;
          transition: color 180ms ease, transform 180ms ease;
        }
        .site-footer__nav a:hover {
          color: #ffffff;
          transform: translateX(3px);
        }
        .site-footer__brand-row {
          width: 100%;
          margin-top: clamp(18px, 3vw, 46px);
        }
        .site-footer__brand {
          display: flex;
          align-items: center;
          width: 100%;
          color: #ffffff;
        }
        .site-footer__mark {
          position: relative;
          flex: 0 0 clamp(58px, 6.1vw, 118px);
          aspect-ratio: 1;
          margin-right: clamp(14px, 1.6vw, 28px);
          overflow: hidden;
          border-radius: 50%;
          background-color: #ffffff;
        }
        .site-footer__mark::before {
          content: "";
          position: absolute;
          inset: -18%;
          background-color: #000000;
          clip-path: polygon(0 20%, 100% 8%, 100% 19%, 0 31%, 0 43%, 100% 31%, 100% 42%, 0 54%, 0 66%, 100% 54%, 100% 65%, 0 77%);
        }
        .site-footer__brand span:last-child {
          display: block;
          flex: 1 1 auto;
          min-width: 0;
          font-size: clamp(58px, 11.1vw, 214px);
          font-weight: 760;
          letter-spacing: -0.055em;
          line-height: 0.78;
          white-space: nowrap;
        }
        .site-footer__legal {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: flex-start;
          gap: 8px 18px;
          margin-top: clamp(14px, 1.4vw, 24px);
          color: rgb(255 255 255 / 0.52);
          font-size: 9px;
          line-height: 1.35;
        }
        .site-footer__legal a {
          color: inherit;
          transition: color 150ms ease;
        }
        .site-footer__legal a:hover {
          color: #ffffff;
        }

        /* RESPONSIVE BREAKPOINTS */
        @media (max-width: 980px) {
          .site-footer__inner {
            width: min(100% - 48px, var(--hero-max-width));
          }
          .site-footer__top {
            grid-template-columns: 1fr 1fr;
          }
          .site-footer__top h2 {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 560px) {
          .site-footer__inner {
            width: min(100% - 32px, var(--hero-max-width));
          }
          .site-footer__top {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .site-footer__nav a {
            font-size: 15px;
          }
          .site-footer__mark {
            flex-basis: clamp(38px, 12vw, 58px);
          }
          .site-footer__brand span:last-child {
            font-size: clamp(45px, 18vw, 84px);
          }
        }
      `}} />

      {/* 2. ANIMATED DOTS STRIP */}
      <div className="footer-dots" aria-hidden="true" id="footer_dots">
        <div className="footer-dots__line"></div>
      </div>

      {/* 3. FOOTER INNER */}
      <div className="site-footer__inner" id="footer_inner">
        
        {/* 4. TOP GRID */}
        <div className="site-footer__top" id="footer_top_grid">
          {/* H2 */}
          <h2 style={{
            maxWidth: "680px",
            margin: 0,
            color: "#ffffff",
            fontSize: "clamp(34px, 3.5vw, 62px)",
            fontWeight: 220,
            letterSpacing: 0,
            lineHeight: 1.06
          }}>
            Proven Advanced Propulsion Technology
          </h2>

          {/* Nav columns (three .site-footer__nav elements) */}
          <nav className="site-footer__nav" aria-label="Footer navigation">
            <a href="#company">Company</a>
            <a href="#technology">Technology</a>
            <a href="#solutions">Solutions</a>
            <a href="#our-edge">Our Edge</a>
            <a href="#investors">Investors</a>
          </nav>

          <nav className="site-footer__nav" aria-label="Company links">
            <a href="#our-team">Our Team</a>
            <a href="#news">News</a>
            <a href="#careers">Careers</a>
            <a href="#contact">Contact Us</a>
          </nav>

          <nav className="site-footer__nav" aria-label="Social links">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://x.com" target="_blank" rel="noreferrer">Follow Us on X</a>
          </nav>
        </div>

        {/* 5. BRAND ROW */}
        <div className="site-footer__brand-row" id="footer_brand_row">
          <a href="/" className="site-footer__brand" aria-label="EngineTech home">
            {/* Brand mark */}
            <div className="site-footer__mark" aria-hidden="true"></div>
            {/* Brand wordmark */}
            <span>EngineTech</span>
          </a>
        </div>

        {/* 6. LEGAL LINE */}
        <div className="site-footer__legal" id="footer_legal_line">
          <p>© 2026 EngineTech. All rights reserved.</p>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Use</a>
        </div>

      </div>
    </footer>
  );
}
