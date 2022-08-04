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

export function littlelink(config: LinksConfig, inner: string): string {
    return `
<!DOCTYPE html>
<html lang="en">

<head>

  <!-- Page Information
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <meta charset="utf-8">
  <title>${config.name}</title>
  <meta name="description" content="${config.bio}">
  <meta name="author" content="${config.name}">

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

</head>

<body>

  <!-- Primary Page Layout
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <div class="container">
    <div class="row">
      <div class="column" style="margin-top: 10%">

        ${inner}

        <br>
        <!--
            Footer:
            This includes a link to privacy.html page which can be setup for your Privacy Policy.
            This also includes a link to the LittleLink repository to make forking LittleLink easier.
            You can edit or remove anything here to make your own footer.
        -->
        <p><a href="privacy.html">Privacy Policy</a> | Build your own by forking <a href="https://littlelink.io" target="_blank" rel="noopener">LittleLink</a>.</p>

      </div>
    </div>
  </div>

  <!-- End Document
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
</body>

</html>
    `;
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

export function links(linkItems: LinkItem[]): string {
    let parts: string[] = [];
    for (let i = 0; i < linkItems.length; i++) {
        let link = linkItems[i];
        let buttonClass = link.type;
        if (link.type.startsWith('cashapp_')) {
            buttonClass = 'cashapp';
        }
        if (['email', 'email_alt', 'blog', 'littlelink'].includes(link.type)) {
            buttonClass = 'default';
        }
        parts.push(`
            <a class="button button-${buttonClass}" href="${link.href}" target="_blank" rel="noopener">
                <img class="icon" src="images/icons/${link.type}.svg">${link.text}</a>
            <br>
        `);
    }
    return parts.join('\n');
}

export function profileEdit(config: LinksConfig): string {
    // TODO: Edit stuff besides links
    // TODO: Submit form
    return `
        <!-- Your Image Here -->
        <img src="images/avatar.png" class="avatar" srcset="images/avatar@2x.png 2x" alt="LittleLink Logo">

        <!-- Title -->
        <h1>${config.name}</h1>

        <!-- Short Bio -->
        <p>${config.bio}</p>

        ${linksEdit(config.links)}
    `;
}

const LINK_TYPES = ['twitter', 'github'];
function typeOptions(selectedType: string): string {
    let parts: string[] = [];
    for (let i = 0; i < LINK_TYPES.length; i++) {
        const type = LINK_TYPES[i];
        parts.push(`<option value="twitter" ${type == selectedType ? 'selected' : ''}>${type}</option>`);
    }
    return parts.join('\n');
}

export function linksEdit(linkItems: LinkItem[]): string {
    let parts: string[] = [];
    parts.push('<form>');
    for (let i = 0; i < linkItems.length; i++) {
        let link = linkItems[i];
        // TODO: Have array of types
        parts.push(`
            <select class="u-full-width" name="type">
                ${typeOptions(link.type)}
            </select>
            <label for="href">URL</label>
            <input class="u-full-width" type="url" placeholder="http://twitter.com" name="href" value="${link.href}">
            <label for="href">Text</label>
            <input class="u-full-width" type="text" placeholder="Twitter" name="text" value="${link.text}">
        `);
    }
    parts.push('</form>');
    return parts.join('\n');
}