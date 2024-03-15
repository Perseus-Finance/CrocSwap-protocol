import { TimelockAccepts } from "../../../../typechain";
import { initChain, refContract } from "../../../libs/chain";
import { populateTimelockCalls } from "../../../libs/governance";

/**
 * @notice This script is used to update the delay in the Timelock Ops contract.
 * @dev Example usage: npx hardhat run misc/scripts/cmds/ops-timelock/updateDelay.ts --network sepolia
 */

const updateDelay = async (newDelay: number): Promise<void> => {
  const { addrs, wallet: authority } = initChain("0xaa36a7"); // Sepolia

  const multisigAddr = addrs.govern.multisigOps;
  const timelockAddr = addrs.govern.timelockOps;

  const tag = `${newDelay} seconds`;

  // Get the Timelock contract instance
  const timelock = (await refContract(
    "TimelockAccepts",
    timelockAddr,
    authority
  )) as TimelockAccepts;

  // Get the current delay from the timelock contract
  const oldDelay = (await timelock.callStatic.getMinDelay()).toNumber();

  // Returns the calldata for updating the delay
  const delayCall = await timelock.populateTransaction.updateDelay(newDelay);

  // Check if the new delay exceeds seven days
  if (newDelay > 7 * 3600 * 24) {
    throw new Error("Timelock delay exceeds seven days");
  }

  // Populate timelock calls
  const timelockCalls = await populateTimelockCalls(
    timelock,
    timelockAddr,
    delayCall.data as string,
    oldDelay
  );

  // Present instructions for setting timelock delay
  console.log("----");
  console.log("Presenting instructions for setting timelock delay");
  console.log();
  console.log(
    `Description: Change will the update timelock from ${oldDelay} to ${tag}`
  );
  console.log(`Execution instructions for updating timelock delay`);
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

const main = async () => {
  // Change this feild to change the new delay in seconds
  const newDelay = 0
  await updateDelay(newDelay);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
