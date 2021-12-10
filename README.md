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