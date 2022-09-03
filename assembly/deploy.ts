

// TODO: HTML page which allows user to deploy own profile page contract
// User can input account name and start the process

import { Context } from "near-sdk-as";

// If user gives account.near, contract gets deployed at web4.account.near
export function deployView(accountId: string | null): string {
    return `
        <!-- near-api-js from IPFS -->
        <script src="https://ipfs.web4.near.page/ipfs/bafybeihkxymp52mq4j5nzasfuz2dwzpy6ihoigeu6acxhjlhgiwtkn6674"></script>
        <script src="./web-wallet-api.js"></script>
        <script>
            const CONTRACT_NAME = '${Context.contractName}';
        </script>
        <script src="./deploy.js"></script>
        <style type="text/css">
            .deploy-step {
                display: none;
            }
            .deploy-step.active {
                display: block;
            }
        </style>
        <div class="container-left">
            <h1>Setup your own</h1>
            ${!accountId 
                ? ` <p><a href="/web4/login">Login</a> with your <code>.near</code> account to deploy your own LittleLink profile page.</p>`
                : ` <form method="POST" onsubmit="submitDeployForm(event)">
                        <label for="accountId">Account ID</label>
                        <input class="u-full-width" type="text" disabled placeholder="account.near" name="accountId" value="${accountId!}">
                        <div class="deploy-step create-account">
                            <input class="button-primary" type="submit" value="Create subaccount">
                        </div>
                        <div class="deploy-step deploy-contract">
                            <input class="button-primary" type="submit" value="Deploy contract">
                        </div>
                        <div class="deploy-step edit-config">
                            <p>Contract deployed! <a href="https://${accountId!}.page/edit">Edit config</a>.</p>
                        </div>
                    </form>`
            }
        </div>
        <script>
            updateUI();
        </script>
    `;
}
