// SPDX-License-Identifier: GNU
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import "../src/interfaces/IConnector.sol";

import {Strategy} from "../src/strategy.sol";
import {Oracle} from "../src/oracle.sol";
import {Engine} from "../src/engine.sol";

// connectors
import {KineticConnector} from "../src/connectors/lending/Kinetic.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Engine engine = new Engine();
        Strategy strategy = new Strategy(address(engine));

        Oracle oracle = new Oracle();

        KineticConnector kineticConnector = new KineticConnector(
            "Kinetic Connector", IConnector.ConnectorType.LENDING, address(strategy), address(engine), address(oracle)
        );

        vm.stopBroadcast();
    }
}
