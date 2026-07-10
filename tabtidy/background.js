chrome.runtime.onMessage.addListener(({ action, scope, windowId, actions }, sender, sendResponse) => {
  if (action === 'wakeup') {
    sendResponse();
    return;
  }

  (async () => {
    const tabs = await chrome.tabs.query(scope === 'current' ? { windowId } : {});

    let workingTabs = [...tabs];

    if (actions.dedupe) {
      const seenUrls = new Set();
      const filteredTabs = [];
      for (const tab of workingTabs) {
        if (seenUrls.has(tab.url)) {
          chrome.tabs.remove(tab.id);
        } else {
          seenUrls.add(tab.url);
          filteredTabs.push(tab);
        }
      }
      workingTabs = filteredTabs;
    }

    if (actions.sort) {
      workingTabs.sort((a, b) => a.url.localeCompare(b.url));
    }

    if (actions.sort && !actions.split) {
      const windowGroups = {};

      for (const tab of workingTabs) {
        if (!windowGroups[tab.windowId]) {
          windowGroups[tab.windowId] = [];
        }
        windowGroups[tab.windowId].push(tab);
      }

      for (const tabs of Object.values(windowGroups)) {
        tabs.sort((a, b) => a.url.localeCompare(b.url));
        const tabIds = tabs.map(tab => tab.id);

        for (let i = 0; i < tabIds.length; i++) {
          await chrome.tabs.move(tabIds[i], { index: i });
        }
      }
    }

    if (actions.split) {
      const domainMap = {};
      for (const tab of workingTabs) {
        try {
          const domain = new URL(tab.url).hostname.replace(/^www\\./, '');
          if (!domainMap[domain]) domainMap[domain] = [];
          domainMap[domain].push(tab);
        } catch {
          if (!domainMap[tab.url]) domainMap[tab.url] = [];
          domainMap[tab.url].push(tab);
        }
      }

      for (const tabs of Object.values(domainMap)) {
        const [firstTab, ...rest] = tabs;
        const win = await chrome.windows.create({ tabId: firstTab.id });
        for (const tab of rest) {
          await chrome.tabs.move(tab.id, { windowId: win.id, index: -1 });
        }
      }
    }
  })();
});
