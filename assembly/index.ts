
import { context, logging, storage, util } from 'near-sdk-as'
import { LinksConfig, littlelink, profile, profileEdit } from './littlelink';
import { bodyUrl, htmlResponse, status, Web4Request, Web4Response } from './web4';

// TODO: Change contract to be deployed into subaccount like web4.vlad.near
// TODO: This would require ownership to be managed by vlad.near still
// TODO: Owner should also be able to add full access keys

function assertOwner(): void {
    // NOTE: Can change this check to alow different owners
    assert(context.sender == context.contractName);
}


const WEB4_STATIC_URL_KEY = 'web4:staticUrl';
const LINKS_CONFIG_KEY = 'config';

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
    if (request.path == "/") {
        let config = storage.getSome<LinksConfig>(LINKS_CONFIG_KEY);
        return htmlResponse(littlelink(config, profile(config)));
    }

    if (request.path == "/edit") {
        let config = storage.getSome<LinksConfig>(LINKS_CONFIG_KEY);
        return htmlResponse(littlelink(config, profileEdit(config)));
    }

    // Serve stylesheets and images from ipfs for now
    if (request.path.endsWith('.css') || request.path.endsWith('.svg') || request.path.endsWith('.png')) {
        return bodyUrl(`${storage.getString(WEB4_STATIC_URL_KEY)!}${request.path}`);
    }

    // By default return 404 Not Found
    return status(404);
}