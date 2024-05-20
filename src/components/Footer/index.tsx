import Image from "next/image";
import ImageMaskot from "../../assets/imgs/maskot3.webp";

export default function Footer() {
  return (
    <footer>
      <div className="container grid footerContainer" data-aos="fade-up">
        <div className="badgeLeft">
          <a className="footermaskot" href="./" title="Xeon Protocol">
            <Image src={ImageMaskot} alt="logo" />
          </a>
          <p className="mb-1">
            Xeon Protocol.
            <br />
            ERC20 Hedging & Lending Ecosystem.
          </p>

          <ul className="inline-list">
            <li>
              <a
                href="https://twitter.com/XeonProtocol"
                target="_self"
                title="Follow us on Twitter"
              >
                <i className="fa-brands fa-twitter"></i>
              </a>
            </li>
            <li>
              <a
                href="https://t.me/xeon_protocol"
                target="_self"
                title="Join us on Telegram"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Read</h4>
          <ul>
            <li>
              <a
                href="https://neon-hedge.gitbook.io/xeon-protocol/"
                target="_blank"
              >
                Documentation
              </a>
            </li>
            <li>
              <a href="./WHITEPAPER V1 - XEON Protocol.pdf" target="_blank">
                Whitepaper
              </a>
            </li>
            <li>
              <a href="https://medium.com/@xeonprotocol" target="_blank">
                Medium
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Engineering</h4>
          <ul>
            <li>
              <a href="https://github.com/neonhedge" target="_blank">
                GitHub Repo
              </a>
            </li>
            <li>
              <a
                href="https://app.gitbook.com/o/CdRqVKZQ8jcIiQELVhpJ/s/SiJYDrcI9KUv1DeX8YqX/mechanics/development/deployments"
                target="_blank"
              >
                Smart Contracts
              </a>
            </li>
            <li>
              <a
                href="https://app.gitbook.com/o/CdRqVKZQ8jcIiQELVhpJ/s/SiJYDrcI9KUv1DeX8YqX/mechanics/development/security-audits"
                target="_blank"
              >
                Security Audits
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Revenue Sharing</h4>
          <ul>
            <li>
              <a
                href="https://app.gitbook.com/o/CdRqVKZQ8jcIiQELVhpJ/s/SiJYDrcI9KUv1DeX8YqX/real-yield/protocol-income"
                target="_blank"
              >
                Protocol Fees
              </a>
            </li>
            <li>
              <a
                href="https://app.gitbook.com/o/CdRqVKZQ8jcIiQELVhpJ/s/SiJYDrcI9KUv1DeX8YqX/earn-with-us/how-to-earn"
                target="_blank"
              >
                Ways to Earn
              </a>
            </li>
            <li>
              <a
                href="https://app.gitbook.com/o/CdRqVKZQ8jcIiQELVhpJ/s/SiJYDrcI9KUv1DeX8YqX/earn-with-us/hedge-mining"
                target="_blank"
              >
                Miner Program
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Join Us</h4>
          <ul>
            <li>
              <a href="https://twitter.com/xeon_protocol" target="_blank">
                X – App
              </a>
            </li>
            <li>
              <a href="https://t.me/xeon_protocol" target="_blank">
                Telegram
              </a>
            </li>
            <li>
              <a href="mailto:info@xeon-protocol.io">E-Mail</a>
            </li>
          </ul>
        </div>

        <p>
          Xeon Protocol &copy;<span id="#thisYear"></span>. All Rights Reserved.
          2024.
        </p>
      </div>
    </footer>
  );
}
