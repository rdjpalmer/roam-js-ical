# Sync iCal with Roam

1. Create a block in Roam with the content `{{[[roam/js]]}}`.
2. Nest the following code under it:

```javascript
var ICAL_URL = "...";

const script = document.createElement("script");
script.src = "https://roam-js-ical.vercel.app/bundle.min.js";
document.head.appendChild(script);
```

3. Press "Yes, I know what I'm doing"
4. You'll see a **Sync Cal** button appear next to the sidebar button.
5. Press this button to sync todays events.

**Note: The process can be quite slow, for example if you're syncing Google Calendar via iCal as we fetch ALL events over ALL time. This is a limitation of iCal technology**.

## Using with Google Calendar

To circumvent CORS issues when using with Google Calendar's iCal links your iCal link needs to be proxied via an additional service. By default this is proxied by `https://gcal-cors-proxy.vercel.app`. This is open source and the code can be found at at [rdjpalmer/gcal-cors-proxy](https://github.com/rdjpalmer/gcal-cors-proxy). The service is hosted on Vercel and has zero logging aside from Vercel provide out of the box.

If you'd like additional control over this proxy, please deploy your own instance of the service to Vercel (see the [README](https://github.com/rdjpalmer/gcal-cors-proxy/blob/ac3424e58b96b4012d00e01ddbb744777b1b8d2b/README.md) for more information).

Once you have done this, add the following to the code snippet above:

```
var ICAL_URL = "...";
var PROXY_OVERRIDE_URL = "your vercel deployment url here";
```
