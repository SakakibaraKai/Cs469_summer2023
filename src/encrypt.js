document.addEventListener("DOMContentLoaded", function() {
  function makeHttpRequest(url, method, data) {
      return fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
  }

  function displayError(message) {
    const errorElement = document.getElementById('error');
    errorElement.innerText = message;
    errorElement.style.display = 'block';
  }

  function encryptMessage() {
    const message = document.querySelector('#messageInput').value;
    
    if (!message) {
      displayError('Please provide valid input.');
      return;
    }
    
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
        })
      };
      console.log('HI');
      fetch('http://localhost:5000/rsa/encrypt', requestOptions)
        .then(response => response.json())
        .then(data => {
          const encryptedMessage = data.encrypted_message.join(' ');
          //document.getElementById('encryptedResult').innerText = encryptedMessage;
          window.location.href = `explain_encrypt.html?encryptedMessage=${encodeURIComponent(encryptedMessage)}`;
          //console.log('Encrypted Message:', encryptedMessage);
        })
        .catch(error => console.error('Error:', error));
  }

  document.getElementById('confirmButton').addEventListener('click', function(e) {
    e.preventDefault();
    encryptMessage();
  });
})