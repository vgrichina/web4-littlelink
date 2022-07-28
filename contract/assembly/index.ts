
import { context, logging, storage, util } from 'near-sdk-as'
import { littlelink } from './littlelink';
import { bodyUrl, htmlResponse, status, Web4Request, Web4Response } from './web4';

function assertOwner(): void {
    // NOTE: Can change this check to alow different owners
    assert(context.sender == context.contractName);
}

const WEB4_STATIC_URL_KEY = 'web4:staticUrl';

// Updates current static content URL in smart contract storage
export function web4_setStaticUrl(url: string): void {
    assertOwner();

    storage.set(WEB4_STATIC_URL_KEY, url);
}

export function web4_get(request: Web4Request): Web4Response {
    if (request.path == "/") {
        return htmlResponse(littlelink([]));
    }

    // Serve stylesheets from ipfs for now
    if (request.path.endsWith('.css') || request.path.endsWith('.svg') || request.path.endsWith('.png')) {
        return bodyUrl(`${storage.getString(WEB4_STATIC_URL_KEY)!}${request.path}`);
    }

    // By default return 404 Not Found
    return status(404);
}