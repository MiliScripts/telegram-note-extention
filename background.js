// Create context menus for selection, image, link, and page
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "sendTextToTelegram",
      title: "ارسال متن به تلگرام",
      contexts: ["selection"]
    });
  
    chrome.contextMenus.create({
      id: "sendImageToTelegram",
      title: "ارسال تصویر به تلگرام",
      contexts: ["image"]
    });
  
    chrome.contextMenus.create({
      id: "sendLinkToTelegram",
      title: "ارسال لینک به تلگرام",
      contexts: ["link"]
    });
  
    chrome.contextMenus.create({
      id: "sendPageToTelegram",
      title: "ارسال صفحه به تلگرام",
      contexts: ["page"]
    });
  });
  
  // Handle the context menu click for sending text, images, links, or the page URL
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.storage.sync.get(['botToken', 'chatId'], function(result) {
      const botToken = result.botToken;
      const chatId = result.chatId;
  
      if (!botToken || !chatId) {
        showToast("لطفا توکن ربات و آیدی چت را تنظیم کنید.", false, tab.id);
        return;
      }
  
      let messageToSend = '';
  
      if (info.menuItemId === "sendTextToTelegram" && info.selectionText) {
        // Handle selected text with proper newlines
        messageToSend = info.selectionText.replace(/\n/g, '\n');
      } else if (info.menuItemId === "sendImageToTelegram" && info.srcUrl) {
        messageToSend = `تصویر: ${info.srcUrl}`;
      } else if (info.menuItemId === "sendLinkToTelegram" && info.linkUrl) {
        messageToSend = `لینک: ${info.linkUrl}`;
      } else if (info.menuItemId === "sendPageToTelegram") {
        // Handle sending the page URL
        messageToSend = `صفحه: ${info.pageUrl}`;
      }
  
      if (messageToSend) {
        sendToTelegram(botToken, chatId, messageToSend, tab.id);
      } else {
        showToast("هیچ محتوایی برای ارسال یافت نشد.", false, tab.id);
      }
    });
  });
  
  // Function to send text, image, link, or page URL to Telegram
  function sendToTelegram(botToken, chatId, message, tabId) {
    const apiUrl = `https://tg.milaadfarzian.workers.dev/bot${botToken}/sendMessage`;
    const payload = {
      chat_id: chatId,
      text: message
    };
  
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        showToast("پیام با موفقیت ارسال شد!", true, tabId);
      } else {
        showToast("ارسال پیام ناموفق بود: " + data.description, false, tabId);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showToast("ارسال پیام ناموفق بود.", false, tabId);
    });
  }
  
  // Function to show a toast notification
  function showToast(message, success, tabId) {
    chrome.scripting.executeScript({
      target: {tabId: tabId},
      func: (message, success) => {
        const toast = document.createElement('div');
        toast.innerText = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = success ? '#28a745' : '#dc3545';
        toast.style.color = '#fff';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '8px';
        toast.style.fontFamily = 'YekanBakh, sans-serif';
        toast.style.fontSize = '14px';
        toast.style.zIndex = '10000';
        toast.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        document.body.appendChild(toast);
  
        setTimeout(() => {
          toast.remove();
        }, 3000);
      },
      args: [message, success]
    });
  }
  