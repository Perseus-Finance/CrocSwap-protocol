import { CrocPolicy, TimelockAccepts } from "../../../../typechain";
import { initChain, refContract } from "../../../libs/chain";
import { populateTimelockCalls } from "../../../libs/governance";
import { fetchTimelockDelay } from "../../../libs/timelockDelay";
import { task } from "hardhat/config";


/**
 * @notice This script is used to transfer goverance to the timelock contracts.
 *
 * @dev These calls can be batched if the delay is currently set to 0.
 * 
 * @requires multisigTreasury to be the tx origin
 * @requires multisigTreasury to be the treasuryAuth
 * 
 * @requires process.env.CHAIN_ID to be exposed to the script
 * @requires process.env.INFURA_API_KEY to be exposed to the script
 * @requires process.env.WALLET_KEY to be exposed to the script
 * 
 * @requires addrs.govern.timelockOps to not be null
 * @requires addrs.govern.timelockTreasury to not be null
 * @requires addrs.govern.timelockEmergency to not be null
 * 
 * @readonly Tx Flow:
 * - multisigTreasury -> timelockTreasury
 * - timelockTreasury -> CrocPolicy.sol
 *
 * @example usage: npx hardhat transferGoverance --network <network>
 */

task("transferGoverance", "Transfer goverance to the timelock contracts.")
  .setAction(async () => {
    const { addrs } = initChain();
    await transferGoverance(
      addrs.govern.timelockOps,
      addrs.govern.timelockTreasury,
      addrs.govern.timelockEmergency
    );
  });

const transferGoverance = async (
  timelockOps: string,
  timelockTreasury: string,
  timelockEmergency: string
): Promise<void> => {
  const { addrs, wallet: authority } = initChain();

  const multisigAddr = addrs.govern.multisigTreasury;
  const timelockAddr = addrs.govern.timelockTreasury;

  /**
   * @notice Fetch the current time-lock min delay
   * 
   * @dev If this return 0, then the calls can be batched
   */
  const currentDelay = await fetchTimelockDelay(timelockAddr, authority);

   /**
   * @notice Prepare contract instances
   */
  const policy = (await refContract(
    "CrocPolicy",
    addrs.policy,
    authority
  )) as CrocPolicy;

  const timelock = (await refContract(
    "TimelockAccepts",
    timelockAddr,
    authority
  )) as TimelockAccepts;


/**
   * @notice Generate the calldata for the transferGoverance method
   */
  const transferGoveranceCall =
    await policy.populateTransaction.transferGovernance(
      timelockOps,
      timelockTreasury,
      timelockEmergency
    );

  
    /**
   * @notice Prepare the resolution Instructions
   *
   * @dev We are not calling the `treasuryResolution` function because it will prepare and forward calls to a chosen proxy. We are calling `populateTimelockCalls` to generate the calldata that will be called directly on the `CrocPolicy` contract
   */
  const timelockCalls = await populateTimelockCalls(
    timelock,
    addrs.policy,
    transferGoveranceCall.data as string,
    currentDelay
  );

  console.log("----");
  console.log("Presenting instructions for transfering governance");
  console.log();
  console.log(
    `Description: Transfers governance to the provided. timelock contracts. Ops: ${timelockOps}, Treasury: ${timelockTreasury}, Emergency: ${timelockEmergency}`
  );
  console.log(`Execution instructions`);
  console.log();
  console.log(`Step 1: Use the Gnosis Safe at ${multisigAddr}`);
  console.log(`Transaction to timelock contract at ${timelockAddr}`);
  console.log(`(Message value: 0)`);
  console.log(`With the following calldata: `);
  console.log(timelockCalls.scheduleCalldata);
  console.log();
  console.log(`Step 2: Wait at least ${timelockCalls.delay}`);
  console.log(`Use same Gnosis Safe at ${multisigAddr}`);
  console.log(
    `Transaction to timelock contract at ${timelockCalls.timelockAddr}`
  );
  console.log(`(Message value: 0)`);
  console.log(`With the following calldata: `);
  console.log(timelockCalls.execCalldata);
  console.log("-----");
};
