import ImageTwitterIcon from "../../assets/imgs/twitter.svg";
import ImageTelegramIcon from "../../assets/imgs/telegram.svg";
import Image from "next/image";

export default function LeftSidebar() {
  return (
    <div>
      <div className="left-paner-parent">
        <div id="leftpaner">
          <div className="clubSinnage neon-blue">
            <h4 title="P2P options market place">OTC_Silkroad</h4>
          </div>
          <div className="asideNavs">
            <div
              className="asideNavsinside"
              id="erc20Options"
              title="create - buy - discover and track OTC ERC20 Call & Put Options"
            >
              Options
            </div>
          </div>
          <div className="asideNavs">
            <div
              className="asideNavsinside"
              id="equitySwaps"
              title="create - buy - discover and track OTC Put Options"
            >
              Equity Swaps
            </div>
          </div>
          <div className="asideNavs">
            <div
              className="asideNavsinside"
              id="erc20Loans"
              title="create - buy - discover and track OTC ERC20 Loans. Borrow or lend any token."
            >
              Loans (coming..)
            </div>
          </div>
          <div className="asideNavs">
            <div className="asideNavsinside" id="socialstream">
              Social
            </div>
          </div>
          <section id="footerSideNavs">
            <div className="contacts_cont">
              <br />
              <a
                className="our_social_links"
                href="https://twitter.com/XeonProtocol"
                target="_blank"
                title="Go to Twitter page"
              >
                <Image src={ImageTwitterIcon} alt="" width={32} />
              </a>
              <a
                className="our_social_links"
                href="https://t.me/neonhedge"
                target="_blank"
                title="Go to Telegram group"
              >
                <Image src={ImageTelegramIcon} alt="" width={32} />
              </a>
              <br />
              <span>reach us:</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
