import { http, createPublicClient, encodeFunctionData } from 'viem';
import { baseSepolia } from 'viem/chains';
import { createSmartAccountClient } from 'permissionless';
import { privateKeyToSimpleSmartAccount } from 'permissionless/accounts';
import { createPimlicoPaymasterClient } from 'permissionless/clients/pimlico';
import { ABI, Constants } from '@/abi/constants';

if (
  !process.env.PRIVATE_KEY_PAYMASTER ||
  !process.env.RPC_URL_BASE_SEPOLIA_PAYMASTER
) {
  throw new Error(
    'Environment variables PRIVATE_KEY_PAYMASTER and RPC_URL_BASE_SEPOLIA_PAYMASTER must be defined'
  );
}

console.log('PRIVATE_KEY_PAYMASTER:', process.env.PRIVATE_KEY_PAYMASTER);
console.log(
  'RPC_URL_BASE_SEPOLIA_PAYMASTER:',
  process.env.RPC_URL_BASE_SEPOLIA_PAYMASTER
);

// Paymaster variables
const rpcUrl = process.env.RPC_URL_BASE_SEPOLIA_PAYMASTER;
const BASE_FACTORY_ADDRESS = '0x15Ba39375ee2Ab563E8873C8390be6f2E2F50232';
const BASE_ENTRYPOINT_V06 = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
const targetContract = Constants.testnet.OnboardingUtilsContractAddress;

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(rpcUrl),
});

async function setupPaymaster(referralAddress = null) {
  // Creating smart account
  const simpleAccount = await privateKeyToSimpleSmartAccount(publicClient, {
    privateKey: process.env.PRIVATE_KEY_PAYMASTER,
    factoryAddress: BASE_FACTORY_ADDRESS,
    entryPoint: BASE_ENTRYPOINT_V06,
  });

  // Create coinbase dev platform paymaster and plug into smart account client
  const cloudPaymaster = createPimlicoPaymasterClient({
    chain: baseSepolia,
    transport: http(rpcUrl),
    entryPoint: BASE_ENTRYPOINT_V06,
  });

  const smartAccountClient = createSmartAccountClient({
    account: simpleAccount,
    chain: baseSepolia,
    bundlerTransport: http(rpcUrl),
    middleware: {
      sponsorUserOperation: cloudPaymaster.sponsorUserOperation,
    },
  });

  const callData_claimInitial = encodeFunctionData({
    abi: ABI.OnboardingUtilsABI,
    functionName: 'claimInitial',
    args: [smartAccountClient.account.address],
  });

  const callData_claimInitialWithReferral = referralAddress
    ? encodeFunctionData({
        abi: ABI.OnboardingUtilsABI,
        functionName: 'claimInitialWithReferral',
        args: [smartAccountClient.account.address, referralAddress],
      })
    : null;

  const callData_claimTokens = encodeFunctionData({
    abi: ABI.OnboardingUtilsABI,
    functionName: 'claimTokens',
    args: [smartAccountClient.account.address],
  });

  async function sendTransactionFromSmartAccount(
    targetContract,
    callData,
    value
  ) {
    try {
      const txHash = await smartAccountClient.sendTransaction({
        account: smartAccountClient.account,
        to: targetContract,
        data: callData,
        value: value,
      });

      console.log('✅ Transaction successfully sponsored!');
      console.log(`🔍 View on Basescan: https://basescan.org/tx/${txHash}`);
    } catch (error) {
      console.error('Error sending transaction: ', error);
    }
  }

  return {
    ABI,
    Constants,
    smartAccountClient,
    targetContract,
    publicClient,
    sendTransactionFromSmartAccount,
    callData_claimInitial,
    callData_claimInitialWithReferral,
    callData_claimTokens,
  };
}

export { setupPaymaster };
