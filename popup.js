document.getElementById('saveCredentials').addEventListener('click', () => {
    const botToken = document.getElementById('botToken').value;
    const chatId = document.getElementById('chatId').value;
  
    if (botToken && chatId) {
      chrome.storage.sync.set({ botToken: botToken, chatId: chatId }, () => {
        document.getElementById('statusMessage').innerText = 'تنظیمات با موفقیت ذخیره شد!';
        document.getElementById('statusMessage').style.color = 'green';
      });
    } else {
      document.getElementById('statusMessage').innerText = 'لطفا توکن ربات و آیدی چت را وارد کنید.';
      document.getElementById('statusMessage').style.color = 'red';
    }
  });
  
  chrome.storage.sync.get(['botToken', 'chatId'], function(result) {
    if (result.botToken) {
      document.getElementById('botToken').value = result.botToken;
    }
    if (result.chatId) {
      document.getElementById('chatId').value = result.chatId;
    }
  });
  