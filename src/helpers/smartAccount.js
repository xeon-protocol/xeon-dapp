import { privateKeyToSimpleSmartAccount } from 'permissionless/accounts';
import { http, createPublicClient } from 'viem';
import { baseSepolia } from 'viem/chains';

const rpcUrl = process.env.RPC_URL_BASE_SEPOLIA_PAYMASTER;
const privateKey = process.env.PRIVATE_KEY_PAYMASTER;
const factoryAddress = '0x15Ba39375ee2Ab563E8873C8390be6f2E2F50232';
const entryPoint = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';

export const transport = http(rpcUrl);

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport,
});

let simpleAccount;

export async function initializeSmartAccount() {
  simpleAccount = await privateKeyToSimpleSmartAccount(publicClient, {
    privateKey,
    factoryAddress,
    entryPoint,
  });
  return simpleAccount;
}
