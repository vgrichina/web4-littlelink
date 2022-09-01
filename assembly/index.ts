
import { context, ContractPromiseBatch, logging, storage, u128, util } from 'near-sdk-as'
import { deployView } from './deploy';
import { LinksConfig, littlelink, profile, profileEdit, skeleton } from './littlelink';
import { bodyUrl, htmlResponse, status, Web4Request, Web4Response } from './web4';

// TODO: Change contract to be deployed into subaccount like web4.vlad.near
// TODO: This would require ownership to be managed by vlad.near still
// TODO: Owner should also be able to add full access keys


const WEB4_STATIC_URL_KEY = 'web4:staticUrl';
const WEB4_OWNER_KEY = 'web4:owner';
const LINKS_CONFIG_KEY = 'config';

function assertOwner(): void {
    // NOTE: Can change this check to alow different owners
    assert(context.sender == context.contractName || context.sender == getOwner(), 'Only owner can call this method');
}

export function getOwner(): string {
    return (storage.getString(WEB4_OWNER_KEY) || context.contractName)!;
}

export function setOwner(accountId: string): void {
    assertOwner();

    storage.setString(WEB4_OWNER_KEY, accountId);
}

export function addAccessKey(publicKey: Uint8Array): ContractPromiseBatch {
    assertOwner();

    return ContractPromiseBatch.create(context.contractName).add_full_access_key(publicKey);
}

export function setConfig(config: LinksConfig): void {
    assertOwner();

    storage.set(LINKS_CONFIG_KEY, config);
}

// Updates current static content URL in smart contract storage
export function web4_setStaticUrl(url: string): void {
    assertOwner();

    storage.set(WEB4_STATIC_URL_KEY, url);
}

export function web4_get(request: Web4Request): Web4Response {
    if (request.path == '/') {
        let config = storage.getSome<LinksConfig>(LINKS_CONFIG_KEY);
        return htmlResponse(littlelink(config, profile(config)));
    }

    if (request.path == '/edit') {
        let config = storage.getSome<LinksConfig>(LINKS_CONFIG_KEY);
        return htmlResponse(littlelink(config, profileEdit(config)));
    }

    if (request.path == '/deploy') {
        return htmlResponse(skeleton(`
            <title>Deploy your own LittleLink</title>
        `, deployView()));
    }

    // Serve stylesheets and images from ipfs for now
    const STATIC_FILES = ['.css', '.png', '.svg', '.js'];
    for (let i = 0; i < STATIC_FILES.length; i++) {
        const suffix = STATIC_FILES[i];
        if (request.path.endsWith(suffix)) {
            return bodyUrl(`${storage.getString(WEB4_STATIC_URL_KEY)!}${request.path}`);
        }
    }

    // By default return 404 Not Found
    return status(404);
}