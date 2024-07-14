import { Image } from "@chakra-ui/react";
import React from "react";
import Lottie from "react-lottie-player";
import lottieJson2 from "@/assets/animations/blue_planet.json";
function ScrollCard() {
  return (
    <div className="flex flex-col-reverse relative mt-10 lg:mt-20 md:flex-row-reverse lg:flex-row gap-6 md:gap-12 justify-between items-start px-8 pt-8 max-w-screen-2xl mx-auto">
      <div className="w-full md:w-[100%] lg:w-full lg:px-10 relative">
        <div className="lg:border-2 md:text-justify border-[#6c6c6c] rounded-3xl text-grey md:p-4">
          <p className="text-grey text-lg md:mt-5 md:w-[85%]">
            Manage risk & liquidity on any ERC20 tokens you own. This platform
            enables you to unlock liquidity and manage risk on any ERC20 tokens
            you own, without selling.
          </p>
          <p className="text-light-purple text-lg mt-5 md:w-[85%]">
            Xeon Protocol helps you manage your ERC20s:
          </p>
          <ol className="text-grey text-lg mt-5 md:w-[85%]">
            <li>
              1. Hedge Risk - cover your ERC20 tokens against price drops.
            </li>
            <li>2. Speculate - on future token prices, to accumulate more.</li>
            <li>
              3. Leverage Capital - buyers are paying for higher exposure.
            </li>
            <li>
              4. Unlock Liquidity - get a loan from your ERC20 token holdings.
              Withdraw the liquidity to buy more tokens.
            </li>
          </ol>
          <p className="text-light-purple text-lg mt-5 md:w-[85%]">
            Scenarios X - imagine this
          </p>
          <p className="text-lime text-lg mt-5 md:w-[85%]">Factors</p>
          <p className="text-grey text-lg mt-5 md:w-[85%]">
            AI SEASON IS TRENDING
          </p>
          <p className="text-grey text-lg mt-5 md:w-[85%]">
            AI COINS ARE PUMPING 20X
          </p>
          <p className="text-grey text-lg mt-5 md:w-[85%]">
            NEW COIN LAUNCHES - $NEWAI
          </p>

          <p className="text-light-purple text-lg mt-5 md:w-[85%]">
            Scenario Simulation...
          </p>
          <p className="text-grey text-lg mt-5 md:w-[85%]">
            1. Capo sees 20x opportunity in $NEWAI
          </p>
          <p className="text-grey text-lg mt-5 md:w-[85%]">
            2. Buys $NEWAI tokens worth $200
          </p>
          <p className="text-grey text-lg mt-5 md:w-[85%]">
            3. Capo creates a call option using the deposited tokens: duration 6
            months and charges $400 as cost, with a strike price 5X away from
            current price.
          </p>
          <p className="text-grey text-lg mt-5 md:w-[85%]">
            4. DegenX sees the OTC deal from Capo. He figures AI tokens will 20x
            in 6 months time since its a bull season. Even if the cost is double
            the current value of the $NEWAI bags, the strike price which is just
            5X away can leave room for profit. DegenX sees a good chance to
            pocket all gains when the token price for $NEWAI goes above the
            strike price.
          </p>
          <p className="text-grey text-lg mt-5 md:w-[85%]">
            5. DegenX pays $400 to Capo for the call option on the $NEWAI bags.
            Capo receives that money, withdraws and uses it as extra liquidity
            to buy more $NEWAI tokens on Uniswap.
          </p>
          <p className="text-grey text-lg mt-5 md:w-[85%]">
            6. In 6 months time, $NEWAI is now 30X. The bags are now worth
            $6000. DegenX paid only $400 for the call option, all gains from the
            time the strike price was crossed, to current price, belong to
            DegenX. Capo only gets the difference and the $400 cost paid when
            hedge was bought.
          </p>
          <p className="text-grey text-lg mt-5 md:w-[85%]">
            7. Capo on the other hand had received $400 when his call option was
            bought, and used it as extra liquidity to buy more $NEWAI tokens.
            That $400 also increased in value 30X.
          </p>
          <p className="text-lime text-lg mt-5 md:w-[85%]">
            Win-win for DegenX and Capo.
          </p>
        </div>
      </div>
      <div className="w-full md:w-[40%] lg:mt-20 lg:w-full md:sticky md:top-3/4 md:transform md:-translate-y-1/2">
        <h1 className="text-grey md:text-lg lg:text-xl">{`{ O4 }`}</h1>
        <h1 className="text-grey text-3xl md:text-5xl lg:text-7xl">
          Use
          <span className="text-light-purple md:hidden"> Cases</span>
        </h1>
        <h1 className="text-light-purple text-3xl md:text-5xl lg:text-7xl ml-1 md:ml-10 hidden md:block">
          {" "}
          Cases
        </h1>
        <Lottie
          className="w-[40%] md:md:absolute top-[-55px] right-[5%] hidden opacity-20 lg:block"
          loop
          animationData={lottieJson2}
          play
        />
      </div>
    </div>
  );
}

export default ScrollCard;
