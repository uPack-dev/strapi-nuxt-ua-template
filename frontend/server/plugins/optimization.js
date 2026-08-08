// style preloads
const stylesheetLinkRegexp = /<link rel="stylesheet" href="(?<href>[^"]+)">/gm;

function getPreloadLink(href) {
  return `<link rel="preload" as="style" href="${href}">`;
}

// script preloads
const scriptPreloadRegexp =
  /<link rel="modulepreload" as="script" crossorigin href="(?<href>[^"]+)">\n?/gm;

// any prefetches
const prefetchRegexp =
  /<link rel="prefetch" as="((script)|(style))" (crossorigin )?href="(?<href>[^"]+)">\n?/gm;

// script with src
const scriptWithSrcRegexp =
  /<script type="module" src="(?<href>[^"]+)" crossorigin>/gm;

// init scripts
const scriptInitCode = `
<script type="text/javascript">
  const lazyLoadTimeout = 1000; // ms
  const userInteractionEvents = ['mousemove', 'scroll', 'keydown', 'click', 'touchstart', 'wheel'];
  const loadScriptsTimer = setTimeout(loadScripts, lazyLoadTimeout);

  let lastClickEvent = null;
  function handleClick(event) {
    lastClickEvent = event;
  }
  window.addEventListener('click', handleClick);

  async function loadScripts() {
    const loadPromises = Array.from(document.querySelectorAll("script[lazy-src]")).map((elem) => {
      return new Promise((resolve, reject) => {
        elem.setAttribute("src", elem.getAttribute("lazy-src"));
        elem.removeAttribute("lazy-src");

        elem.onload = resolve;
        elem.onerror = reject;
      });
    });
    await Promise.allSettled(loadPromises);
    document.body.classList.remove("loading");

    if (window.useNuxtApp) {
      window.useNuxtApp().hooks.hookOnce('page:finish', () => {
         window.removeEventListener('click', handleClick);
         if (lastClickEvent?.target) lastClickEvent.target.dispatchEvent(lastClickEvent)
      });
    } else {
      window.removeEventListener('click', handleClick);
    }
  }

  userInteractionEvents.forEach((event) => {
    window.addEventListener(event, triggerScriptLoader, { passive: true });
  });
  function triggerScriptLoader() {
    loadScripts();
    clearTimeout(loadScriptsTimer);
    userInteractionEvents.forEach((event) => {
      window.removeEventListener(event, triggerScriptLoader, { passive: true });
    });
  }
</script>
`;

export default defineNitroPlugin((nitroApp) => {
  const {
    public: { isDev },
  } = useRuntimeConfig();

  if (isDev) return;

  nitroApp.hooks.hook('render:html', (html) => {
    const [headContent] = html.head;
    let headContentLocal = headContent;

    // add style preloads
    const stylesheetMatches = headContent.matchAll(stylesheetLinkRegexp);

    for (const stylesheetMatch of stylesheetMatches) {
      const { href } = stylesheetMatch.groups;
      const preloadLink = getPreloadLink(href);

      headContentLocal = `${preloadLink}${headContentLocal}`;
    }

    // remove preload scripts
    headContentLocal = headContentLocal.replace(scriptPreloadRegexp, '');

    // remove prefetches
    headContentLocal = headContentLocal.replace(prefetchRegexp, '');

    // replace scripts src
    headContentLocal = headContentLocal.replace(
      scriptWithSrcRegexp,
      '<script type="module" lazy-src="$<href>" crossorigin>',
    );

    html.head[0] = headContentLocal;

    // add scripts init code
    html.body.push(scriptInitCode);
  });
});
