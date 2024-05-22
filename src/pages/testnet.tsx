import VersionReleases from "@/components/Testnet/VersionReleases";
import Welcome from "@/components/Testnet/Welcome";

export default function Testnet() {
  return (
    <div>
      <h1 className="testnetH neon-blue">Neon Testnet Guide</h1>
      <div id="testnetWelcome">
        <div className="testnetIntro">
          Welcome to the Instruction Portal for the
          <a
            href="./ecosystem.html"
            target="_blank"
            title="ERC20 - Equity Swaps, Call Options, Put Options"
          >
            Neon Hedge
          </a>
          test platform.
        </div>

        <div className="rewardsInformer">
          <small>Welcome to Testnet..</small>
          <br />
          <small>This page contains all testnet requirements and guides.</small>
        </div>
        <canvas></canvas>
        <div className="testnetWindow">
          <Welcome />
          <VersionReleases />
        </div>
      </div>
    </div>
  );
}
