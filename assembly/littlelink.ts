import { Context } from "near-sdk-as";

@nearBindgen
export class LinksConfig {
    name: string;
    bio: string;
    links: LinkItem[] = [];
}

@nearBindgen
export class LinkItem {
    type: string;
    text: string;
    href: string;
}

export function skeleton(head: string, inner: string): string {
    return `
<!DOCTYPE html>
<html lang="en">

<head>

  <!-- Page Information
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <meta charset="utf-8">

  <!-- Mobile Specific Metas
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- FONT
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800&display=swap" rel="stylesheet">


  <!-- CSS
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <link rel="stylesheet" href="css/normalize.css">

  <!-- Themes:
         Auto:   css/skeleton-auto.css
         Light:  css/skeleton-light.css
         Dark:   css/skeleton-dark.css
  -->
  <link rel="stylesheet" href="css/skeleton-auto.css">

  <link rel="stylesheet" href="css/brands.css">


  <!-- Favicon
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <link rel="icon" type="image/png" href="images/avatar.png">

  ${head}
</head>

<body>

  <!-- Primary Page Layout
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <div class="container">
    <div class="row">
      <div class="column" style="margin-top: 10%">
        ${inner}
      </div>
    </div>
  </div>

  <!-- End Document
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
</body>

</html>
    `;

}

export function littlelink(config: LinksConfig, inner: string): string {
    return skeleton(`
        <title>${config.name}</title>
        <meta name="description" content="${config.bio}">
        <meta name="author" content="${config.name}">
    `, `
        ${inner}

        <br>
        <p>
            Build your own page <a href="/deploy">here</a>.
            <br>Based on <a href="https://github.com/vgrichina/web4-littlelink/" target="_blank" rel="noopener">web4-littlelink</a>.
        </p>
    `);
}

// TODO: Use some util to escape HTML strings

export function profile(config: LinksConfig): string {
    return `
        <!-- Your Image Here -->
        <img src="images/avatar.png" class="avatar" srcset="images/avatar@2x.png 2x" alt="LittleLink Logo">

        <!-- Title -->
        <h1>${config.name}</h1>

        <!-- Short Bio -->
        <p>${config.bio}</p>

        ${links(config.links)}
    `;
}

function linkButton(link: LinkItem): string {
    let buttonClass = link.type;
    if (link.type.startsWith('cashapp_')) {
        buttonClass = 'cashapp';
    }
    if (['email', 'email_alt', 'blog', 'littlelink'].includes(link.type)) {
        buttonClass = 'default';
    }
    return `
        <a class="button button-${buttonClass}" href="${link.href}" target="_blank" rel="noopener">
            <img class="icon" src="images/icons/${link.type}.svg">${link.text.trim() != '' ? link.text : link.type}</a>
        <br>
    `;
}

export function links(linkItems: LinkItem[]): string {
    let parts: string[] = [];
    for (let i = 0; i < linkItems.length; i++) {
        if (linkItems[i].href.trim() != '') {
            parts.push(linkButton(linkItems[i]));
        }
    }
    return parts.join('\n');
}

export function profileEdit(config: LinksConfig, accountId: string | null): string {
    return `
        <div class="container-left">
            <form method="POST" action="/web4/contract/${Context.contractName}/setConfig">
                ${accountId ? `
                    <label for="name">Name</label>
                    <input class="u-full-width" type="text" placeholder="John Doe" name="config.name" value="${config.name}">

                    <label for="bio">Bio</label>
                    <textarea class="u-full-width" name="config.bio">${config.bio}</textarea>

                    <h2>Links</h2>

                    ${linksEdit(config.links)}

                    <input class="button-primary" type="submit" value="Save">`
                    : `
                    <p><a href="/web4/login?web4_contract_id=${Context.contractName}">Sign in</a> to edit your profile.</p>`
                }
            </form>
        </div>
    `;
}

const LINK_TYPES = ['twitter', 'github'];
function typeOptions(selectedType: string): string {
    let parts: string[] = [];
    for (let i = 0; i < LINK_TYPES.length; i++) {
        const type = LINK_TYPES[i];
        parts.push(`<option value="${type}" ${type == selectedType ? 'selected' : ''}>${type}</option>`);
    }
    return parts.join('\n');
}

export function linksEdit(linkItems: LinkItem[]): string {
    let parts: string[] = [];
    for (let i = 0; i < linkItems.length; i++) {
        let link = linkItems[i];
        // TODO: Have array of types
        parts.push(`
            <div class="row">
                <div class="six columns">
                    <label>Type</label>
                    <select class="u-full-width" name="config.links[${i}].type">
                        ${typeOptions(link.type)}
                    </select>
                </div>
                <div class="six columns">
                    <label>Text</label>
                    <input class="u-full-width" type="text" placeholder="Twitter" name="config.links[${i}].text" value="${link.text}">
                </div>
            </div>
            <label>URL</label>
            <input class="u-full-width" type="url" placeholder="http://twitter.com" name="config.links[${i}].href" value="${link.href}">
        `);
    }
    return parts.join('\n');
}