// const { signInURL, signTransactionsURL } = window.walletAPI;
const { InMemorySigner } = window.nearApi;
const { PublicKey, KeyPair } = window.nearApi.utils;
const { parseNearAmount } = window.nearApi.utils.format;
const { base_decode, base_encode } = window.nearApi.utils.serialize;
const { BrowserLocalStorageKeyStore } = window.nearApi.keyStores;
const { createAccount, addKey, fullAccessKey, transfer, deployContract, functionCall, signTransaction, Transaction } = window.nearApi.transactions;

function submitDeployForm(event) {
    event.preventDefault();

    const accountInput = event.target.querySelector('input[name=accountId]');
    const accountId = accountInput.value;
    submitDeployFormAsync({ accountId }).catch(console.error);
}

async function submitDeployFormAsync({ accountId }) {
    const contractId = `web4.${accountId}`;
    const NETWORK_ID = 'default';
    const WALLET_URL = 'https://wallet.near.org';
    const FAST_NEAR_URL = 'https://rpc.web4.near.page';
    // TODO: Refactor to use /web4/account call to self when it's setup in prod
    const contractWasm = Buffer.from(await (await fetch(`${FAST_NEAR_URL}/account/${CONTRACT_NAME}/contract`)).arrayBuffer());

    // Retrieve the key pair from local storage or create a new one
    const keyStore = new BrowserLocalStorageKeyStore(window.localStorage, 'deploy');
    let keyPair = await keyStore.getKey(NETWORK_ID, contractId);

    if (!keyPair) {
        keyPair = KeyPair.fromRandom('ed25519');
        await keyStore.setKey(NETWORK_ID, contractId, keyPair);

        // Create account with necessary access key
        window.location = signTransactionsURL({ walletUrl: WALLET_URL, transactions: [
            new Transaction({
                signerId: accountId,
                publicKey: new PublicKey({ type: 0, data: Buffer.from(new Array(32))}),
                nonce: 0,
                blockHash: Buffer.from(new Array(32)),
                receiverId: contractId,
                actions: [
                    createAccount(),
                    transfer(parseNearAmount('0.5')),
                    addKey(keyPair.publicKey, fullAccessKey()),
                ]
            })
        ], callbackUrl: window.location.href });

        return;
    }

    const keyResponse = await fetch(`${FAST_NEAR_URL}/account/${contractId}/key/${keyPair.publicKey}`);

    if (keyResponse.status === 404) {
        // Acccount exists but doesn't have access key
    // TODO: Report message to user? Add key through wallet if possible?
        throw new Error(`Account ${accountId} exists but doesn't have access key`);
    }

    if (keyResponse.status !== 200) {
        throw new Error(`Unexpected status code ${keyResponse.status}`);
    }

    const nonce = parseInt((await keyResponse.json()).nonce) + 1;
    const blockHash = base_decode((await (await fetch(`${FAST_NEAR_URL}/status`)).json()).sync_info.latest_block_hash);
    const staticUrl = await (await fetch(`${FAST_NEAR_URL}/account/${CONTRACT_NAME}/view/web4_getStaticUrl`)).json();

    // Create transaction to deploy contract
    const transaction = new Transaction({
        signerId: contractId,
        publicKey: keyPair.publicKey,
        nonce,
        blockHash,
        receiverId: contractId,
        actions: [
            deployContract(contractWasm),
            functionCall('setOwner', { accountId }, 10000000000000, '0'),
            functionCall('web4_setStaticUrl', { url: staticUrl }, 10000000000000, '0'),
            functionCall('setConfig', { config: {
                name: accountId,
                bio: '',
                links: [
                    { type: 'twitter' },
                    { type: 'github' }
                ]
            } }, 10000000000000, '0'),
        ]
    });

    // Sign transaction
    const signer = new InMemorySigner(keyStore);
    const [, signedTransaction] = await signTransaction(transaction, signer, contractId, NETWORK_ID);
    console.log('signedTransaction', signedTransaction);

    // Post transaction
    const response = await fetch(FAST_NEAR_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'dontcare',
            method: 'broadcast_tx_commit',
            params: [signedTransaction.encode().toString('base64')],
        }),
    });
    const result = await response.json();
    console.log('result', result);
}