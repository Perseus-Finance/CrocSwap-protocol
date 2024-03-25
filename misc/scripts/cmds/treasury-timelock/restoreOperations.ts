import { initChain } from "../../../libs/chain";
import { CrocProtocolCmd, treasuryResolution } from "../../../libs/governance";
import { SAFE_MODE_PROXY_PATH } from "../../../constants/addrs";
import { AbiCoder } from "@ethersproject/abi";
import { BytesLike } from "ethers";
import { fetchTimelockDelay } from "../../../libs/timelockDelay";
import { task } from "hardhat/config";

/**
 * @notice This script is used to restore operations on the CrocSwapDex.
 *
 * @summary This will revert the actions perform by the emergency halt. It will
 *          enable the hotpath and disable the safemode.
 *
 * @dev These calls can be batched if the delay is currently set to 0.
 *
 * @requires multisigTreasury to be the tx origin
 *
 * @requires process.env.CHAIN_ID to be exposed to the script
 * @requires process.env.INFURA_API_KEY to be exposed to the script
 * @requires process.env.WALLET_KEY to be exposed to the script
 *
 * @requires safeModePath.sol to be deployed and the proxy to be installed.
 *
 * @readonly Tx Flow:
 * - multisigTreasury -> timelockTreasury
 * - timelockTreasury -> safeModePath.sol
 *
 * @example usage: npx hardhat restoreOperations --network <network>
 *
 * @confirmation After restoring operations run:
 * - npx hardhat run misc/scripts/cmds/fetchOperationalStatus.ts --network sepolia.
 *
 */

task("restoreOperations", "Restore operations on the CrocSwapDex.").setAction(
  async () => {
    await restoreOperations();
  }
);

const restoreOperations = async (): Promise<void> => {
  const { addrs, wallet: authority } = initChain(); // Sepolia
  const abi = new AbiCoder();

  const timelockAddr = addrs.govern.timelockTreasury;

  const HOT_OPEN_CODE = 22;
  const SAFE_MODE_CODE = 23;

  const currentDelay = await fetchTimelockDelay(timelockAddr, authority);

  /**
   * @notice Encode the protocol cmds for the hotpath and safemode methods
   */
  const encodeHotPathCode = abi.encode(
    ["uint8", "bool"],
    [HOT_OPEN_CODE, true]
  ) as BytesLike;

  const encodeSafeModeCode = abi.encode(
    ["uint8", "bool"],
    [SAFE_MODE_CODE, false]
  ) as BytesLike;

  /**
   * @notice Prepare the resolution payloads
   */
  let hotPathResolution: CrocProtocolCmd = {
    protocolCmd: encodeHotPathCode,
    callpath: SAFE_MODE_PROXY_PATH,
    sudo: true,
  };

  let safeModeResolution: CrocProtocolCmd = {
    protocolCmd: encodeSafeModeCode,
    callpath: SAFE_MODE_PROXY_PATH,
    sudo: true,
  };

  /**
   * @notice Generate the resolution instructions
   */
  await treasuryResolution(
    addrs,
    hotPathResolution,
    currentDelay,
    "Enable Hot Path"
  );

  await treasuryResolution(
    addrs,
    safeModeResolution,
    currentDelay,
    "Disable Safe Mode"
  );
};
