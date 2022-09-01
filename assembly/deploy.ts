

// TODO: HTML page which allows user to deploy own profile page contract
// User can input account name and start the process

import { Context } from "near-sdk-as";

// If user gives account.near, contract gets deployed at web4.account.near
export function deployView(): string {
    return `
        <!-- near-api-js from IPFS -->
        <script src="https://ipfs.web4.near.page/ipfs/bafybeihkxymp52mq4j5nzasfuz2dwzpy6ihoigeu6acxhjlhgiwtkn6674"></script>
        <script src="./web-wallet-api.js"></script>
        <script>
            const CONTRACT_NAME = '${Context.contractName}';
        </script>
        <script src="./deploy.js"></script>
        <div class="container-left">
            <h1>Setup your own</h1>
            <p>Enter your <code>.near</code> account name to deploy your own LittleLink profile page.</p>
            <form method="POST" onsubmit="submitDeployForm(event)">
                <label for="accountId">Account ID</label>
                <input class="u-full-width" type="text" placeholder="account.near" name="accountId" value="">
                <input class="button-primary" type="submit" value="Deploy">
            </form>
        </div>
    `;
}