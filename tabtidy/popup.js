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

  chrome.runtime.sendMessage({ action, scope, actions });
  window.close();
});