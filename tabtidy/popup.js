let action = 'wakeup';
chrome.runtime.sendMessage({ action }, () => {
  if (chrome.runtime.lastError) {
    console.log('Service worker not responding:', chrome.runtime.lastError);
  }
});

document.getElementById('run').addEventListener('click', async () => {
  const action = 'run';
  const scope = document.querySelector('input[name="scope"]:checked').value;
  const actions = {
    split: document.getElementById('split').checked,
    sort: document.getElementById('sort').checked,
    dedupe: document.getElementById('dedupe').checked,
  };

  const currentWindow = await chrome.windows.getCurrent();
  chrome.runtime.sendMessage({ action, scope, windowId: currentWindow.id, actions });
  window.close();
});

document.getElementById('copy-tabs').addEventListener('click', async () => {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const tabList = tabs.map(tab => tab.url).join('\n');
  await navigator.clipboard.writeText(tabList);
  window.close();
});
