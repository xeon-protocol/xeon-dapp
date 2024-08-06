import { http, createPublicClient, encodeFunctionData } from 'viem';
import { baseSepolia } from 'viem/chains';
import { createSmartAccountClient } from 'permissionless';
import { privateKeyToSimpleSmartAccount } from 'permissionless/accounts';
import { createPimlicoPaymasterClient } from 'permissionless/clients/pimlico';
import { ABI, Constants } from '@/abi/constants';

// Paymaster variables
const rpcUrl = process.env.RPC_URL_BASE_SEPOLIA_PAYMASTER;
const BASE_FACTORY_ADDRESS = '0x15Ba39375ee2Ab563E8873C8390be6f2E2F50232';
const BASE_ENTRYPOINT_V06 = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
const onboardingUtilsContractAddress =
  Constants.testnet.onboardingUtilsContractAddress;
const mockERC20FactoryContractAddress =
  Constants.testnet.MockERC20FactoryContractAddress;
const targetContracts = [
  onboardingUtilsContractAddress,
  mockERC20FactoryContractAddress,
];
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(rpcUrl),
});

async function setupPaymaster() {
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

  return { ABI, Constants, smartAccountClient, targetContracts, publicClient };
}

export default setupPaymaster;
