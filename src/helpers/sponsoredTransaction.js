import { createSmartAccountClient } from 'permissionless';
import { baseSepolia } from 'viem/chains';
import { initializeSmartAccount, transport } from './smartAccount.js';
import { encodeFunctionData } from 'viem';
import { ABI, Constants } from '@/abi/constants';
import { cloudPaymaster } from './paymaster.js';

let smartAccountClient;

export async function sendTransaction(functionName, args) {
  if (!smartAccountClient) {
    const simpleAccount = await initializeSmartAccount();
    smartAccountClient = createSmartAccountClient({
      account: simpleAccount,
      chain: baseSepolia,
      bundlerTransport: transport,
      middleware: {
        sponsorUserOperation: cloudPaymaster.sponsorUserOperation,
      },
    });
  }

  console.log(
    `Sending transaction to ${Constants.testnet.OnboardingUtilsContractAddress} (Function: ${functionName})`
  );
  console.log('Waiting for transaction...');

  const callData = encodeFunctionData({
    abi: ABI.OnboardingUtilsABI,
    functionName,
    args,
  });

  const txHash = await smartAccountClient.sendTransaction({
    account: smartAccountClient.account,
    to: Constants.testnet.OnboardingUtilsContractAddress,
    data: callData,
    value: BigInt(0),
  });

  console.log(
    '\x1b[32m',
    `⛽ Successfully sponsored gas for ${functionName} transaction with Coinbase Developer Platform!`
  );
  console.log(
    '\x1b[36m',
    `🔍 View on Basescan: https://sepolia.basescan.org/tx/${txHash}`
  );

  return txHash;
}
