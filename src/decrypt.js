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

    const decryptButton = document.querySelector('#decryptButton');

    const urlParams = new URLSearchParams(window.location.search);
    const encryptedMessage = urlParams.get('encryptedMessage');
    const encryptedMessageArray = encryptedMessage.split(' ').map(Number);

    if (!encryptedMessage) {
        console.error('No encrypted message provided.');
        return; 
    }

    console.log('Raw encryptedMessage:', urlParams.get('encryptedMessage'));

    decryptButton.addEventListener('click', function() {
    
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                encrypted_message: encryptedMessageArray // Split the string into an array of integers
            })  
        };
        fetch('http://localhost:5000/rsa/decrypt', requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const decryptedMessage = data.decrypted_message;
            window.location.href = `explain_decrypt.html?decryptedMessage=${encodeURIComponent(decryptedMessage)}`;
            //console.log('Decrypted Message:', decryptedMessage);
            // Perform actions with the decrypted message, such as displaying it on the page
        })
        .catch(error => console.error('Error:', error));
    });    
});

