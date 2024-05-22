import Image from "next/image";
import ImageLogo from "../../assets/imgs/maskot3.webp";
import Link from "next/link";

export default function Header() {
  return (
    <div>
      <div className="w-full flex">
        <a className="logoImg">
          <Image src={ImageLogo} alt="logo" className="w-[64px] h-[64px]" />
          <span className="logod-name">Xeon Protocol</span>
        </a>

        <button className="mobile-nav-toggle" aria-controls="navbar">
          <span className="sr-only" aria-expanded="false">
            Menu
          </span>
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </button>

        <nav id="navbar" className="">
          <ul>
            <li>
              <Link href="/">Silkroad</Link>
            </li>
            <li>
              <Link href="/wallet">Wallet</Link>
            </li>
            <li>
              <Link href="analytics">Analytics</Link>
            </li>
            <li>
              <a href="guide.html">Guide</a>
            </li>
            <li>
              <a href="testnet.html">Testing</a>
            </li>
            <li>
              <a
                href="https://neon-hedge.gitbook.io/xeon-protocol-documentation/"
                target="_blank"
              >
                Docs
              </a>
            </li>
          </ul>
          <div className="account">
            <button className="btn-cta blockstatehold" id="blockstatehold">
              <div className="showingshold">
                <div className="wallets wallet_connect">Connect Wallet</div>
              </div>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
