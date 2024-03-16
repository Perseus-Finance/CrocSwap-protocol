# Commands: Table of Contents

1. [General](./general/)
2. [Ops Timelock](./ops-timelock/)
3. [Treasury Timelock](./treasury-timelock/)

---

---

---

## General Commands

1. [Fetch Operational Status](./general/fetchOperationalStatus.ts)

### 1. Fetch Operational Status

Script to fetch the status of the hot path and safe mode after performing either an emergency halt or restoring operations. It captures the state of the hot path and safe mode by:

- Fetching the event logs
- Parsing the events
- Sorting the events by block number
- Printing the results to the console

#### Usage

To run the script, use the following command:

- Replace `<startingBlock>` with the block number from which you want to start fetching the events.
- Replace `<network>` with the network on which you want to fetch the operational status.

```bash
npx hardhat fetchOperationalStatus --from <startingBlock> --network <network>
```

---

---

---

## Ops Timelock Commands

1. [Update Delay](./ops-timelock/updateOpsTimelockDelay.ts)

### 1. Update Delay

Script to update the delay of the timelock contract. The delay is the time it takes for a transaction to be executed after it has been queued.

#### Usage

To run the script, use the following command:

- Replace `<newDelayInSeconds>` with the new delay in seconds.
- Replace `<network>` with the network on which you want to update the delay.

```bash
npx hardhat updateOpsTimelockDelay --delay <newDelayInSeconds> --network <network>
```

---

---

---

## Treasury Timelock Commands

1. [Transfer Goverance](./treasury-timelock/transferGovernance.ts)
2. [Emergency Halt](./treasury-timelock/emergencyHalt.ts)
3. [Restore Operations](./treasury-timelock/restoreOperations.ts)
4. [Update Delay](./treasury-timelock/updateDelay.ts)

### 1. Transfer Governance

Script to transfer the governance to the provided timelock addresses found in the [addrs](../../constants/addrs.ts) object.

#### Usage

- Replace `<network>` with the network on which you want to transfer the governance.

To run the script, use the following command:

```bash
npx hardhat transferGoverance --network <network>
```

### 2. Emergency Halt

The Emergency Halt is an out-of-band measure implemented to safeguard funds within the CrocSwapDex contract in the event of a security issue. It functions by disabling all proxy contracts in CrocSwapDex, along with disabling swap operations in the hot path, except for the "warm path" proxy. The warm path specifically includes functionality for simple actions like minting, burning, and harvesting tokens. By triggering an emergency halt, LPs (Liquidity Providers) can withdraw their capital at rest, while simultaneously reducing the attack surface by disabling swaps and more complex order executions.

#### Usage

- Replace `<reason>` with the reason for the emergency halt.
- Replace `<network>` with the network on which you want to perform the emergency halt.

To run the script, use the following command:

```bash
npx hardhat emergencyHalt --reason <reason> --network <network>
```

### 3. Restore Operations

Script to revert the actions perform by the emergency halt. It will enable the hotpath and disable the safemode.

#### Usage

- Replace `<network>` with the network on which you want to restore operations.

To run the script, use the following command:

```bash
npx hardhat restoreOperations --network <network>
```

### 4. Update Delay

Script to update the delay of the timelock contract. The delay is the time it takes for a transaction to be executed after it has been queued.

#### Usage

To run the script, use the following command:

- Replace `<delay>` with the new delay in seconds.
- Replace `<network>` with the network on which you want to update the delay.

```bash
npx hardhat updateTreasuryTimelockDelay --delay <newDelayInSeconds> --network <network>
```

---

---

---
