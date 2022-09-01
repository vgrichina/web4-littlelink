// const { signInURL, signTransactionsURL } = window.walletAPI;
const { PublicKey } = window.nearApi.utils;
const { createAccount, deployContract, functionCall, Transaction } = window.nearApi.transactions;

function submitDeployForm(event) {
    event.preventDefault();
    console.log('event', event);
    
    const accountInput = event.target.querySelector('input[name=accountId]');
    const accountId = accountInput.value;
    submitDeployFormAsync({ accountId }).catch(console.error);
}

async function submitDeployFormAsync({ accountId }) {
    const contractId = `web4.${accountId}`;
    const walletUrl = 'https://wallet.near.org';
    // TODO: Refactor to use /web4/account call to self when it's setup in prod
    const contractWasm = Buffer.from(await (await fetch(`https://rpc.web4.near.page/account/${CONTRACT_NAME}/contract`)).arrayBuffer());
    console.log('contractWasm', contractWasm);
    window.location = signTransactionsURL({ walletUrl, transactions: [
        new Transaction({ 
            signerId: accountId,
            publicKey: new PublicKey({ type: 0, data: Buffer.from(new Array(32))}),
            nonce: 0,
            blockHash: Buffer.from(new Array(32)),
            receiverId: contractId,
            actions: [
                createAccount(),
                deployContract(contractWasm),
                functionCall('setOwner', { accountId }, 10000000000000, '0'),
            ]
        })  
    ]});

}