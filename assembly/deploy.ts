

// TODO: HTML page which allows user to deploy own profile page contract
// User can input account name and start the process

import { Context } from "near-sdk-as";

// If user gives account.near, contract gets deployed at web4.account.near
export function deployView(accountId: string | null): string {
    return `
        <script src="./near-api-js.js"></script>
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
            ${!accountId || Context.contractName == `web4.${accountId!}`
                ? ` <p><a href="/web4/login">Login</a> with your <code>.near</code> account to deploy your own LittleLink profile page.</p>`
                : ` <form method="POST" onsubmit="submitDeployForm(event)">
                        <label for="accountId">Current account</label>
                        <input class="u-full-width" type="text" disabled placeholder="account.near" name="accountId" value="${accountId!}">
                        <div class="deploy-step create-account">
                            <p>Account <code>web4.${accountId!}</code> doesn't exist yet. Please create it to proceed.</p>
                            <input class="button-primary" type="submit" value="Create web4 account">
                        </div>
                        <div class="deploy-step missing-access-key">
                            <p>Account <code>web4.${accountId!}</code> is missing access key for this app. Please add access key to continue.</p>
                        </div>
                        <div class="deploy-step deploy-contract">
                            <p><code>web4.${accountId!}</code> account was created succesfully.</b>
                            <p>Please deploy contract immediately to make sure <code>${accountId!}</code> keeps access to it.</p>
                            <input class="button-primary" type="submit" value="Deploy contract">
                        </div>
                        <div class="deploy-step edit-config">
                            <p>Contract deployed to <code>web4.${accountId!}</code>.
                                <br>
                                <a href="https://${accountId!}.page/">View in browser</a>.
                                <a href="https://${accountId!}.page/edit">Edit config</a>.
                            </p>
                            <p><a href="/web4/login">Login</a> with your <code>.near</code> account to deploy another profile page.</p>
                        </div>
                    </form>`
            }
        </div>
        <script>
            updateUI();
        </script>
    `;
}
