function runExtension () {
  const sectioning = [
    'article',
    'aside',
    'body',
    'footer',
    'header',
    'main',
    'nav',
    'section'
  ];

  function getPath (elem) {
    // Finds the secionable path
    let path = [];

    let parent = elem.parentElement;

    while (parent) {
      const elemType = parent.tagName.toLowerCase();

      if (sectioning.includes(elemType)) {
        path.push(elemType);
      }

      parent = parent.parentElement;
    }

    path.reverse();

    return `"${path.join(' > ')}"`;
  }

  function sanitise(str) {
    // Strips problem characters from the CSV
    return str
      .replace(/"/g, '')
      .replace(/\r\n/g, '')
      .replace(/\n/g, '');
  }

  // Find all anchors
  const anchors = Array.prototype.slice.call(document.querySelectorAll('a'));
  console.log(`Found ${anchors.length} anchors`);

  // Convert into a CSV format
  const anchorData = anchors.map(item => [getPath(item), `"${sanitise(item.innerText)}"`, `"${sanitise(item.href)}"`]);
  const csvData = 'Section Path,Link Text,Destination\n' + anchorData.join('\n');

  // Download a CSV file containing the data
  const filename = 'linkreport-' + document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 20) + '.csv';
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('download', filename);
  a.click()
};

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: runExtension
  });
});