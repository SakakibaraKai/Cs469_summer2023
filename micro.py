from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import secrets

app = Flask(__name__)
CORS(app)

def is_prime(n):
    if n <= 1:
        return False
    elif n <= 3:
        return True
    elif n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True


def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a


def multiplicative_inverse(e, phi):
    def extended_gcd(a, b):
        if a == 0:
            return b, 0, 1
        else:
            gcd, x, y = extended_gcd(b % a, a)
            return gcd, y - (b // a) * x, x

    gcd, x, y = extended_gcd(e, phi)
    if gcd == 1:
        return x % phi
    else:
        raise ValueError("The multiplicative inverse does not exist.")
    

def generate_random_prime():
    while True:
        num = random.randint(100, 1000)  # Adjust the range as needed
        if is_prime(num):
            return num


def generate_keypair():
    p = generate_random_prime()
    q = generate_random_prime()
    
    n = p * q
    phi = (p - 1) * (q - 1)

    e = random.randrange(1, phi)
    while gcd(e, phi) != 1:
        e = random.randrange(1, phi)

    d = multiplicative_inverse(e, phi)

    return (e, n), (d, n), p, q

def encrypt(message, public_key):
        e, n = public_key
        encrypted_message = [pow(ord(char), e, n) for char in message]
        return encrypted_message


def decrypt(encrypted_message, private_key):
        d, n = private_key
        decrypted_message = [chr(pow(char, d, n)) for char in encrypted_message]
        return "".join(decrypted_message)


@app.route('/rsa/encrypt', methods=['POST'])
def rsa_encrypt():
        data = request.get_json()
        message = data['message']   
        #p = data['p']
        #q = data['q']
        global private_key
        public_key, private_key, p, q = generate_keypair()
        encrypted_message = encrypt(message, public_key)
        return jsonify({'encrypted_message': encrypted_message, 'public_key': public_key})


@app.route('/rsa/decrypt', methods=['POST'])
def rsa_decrypt():
        data = request.get_json()
        encrypted_message = data['encrypted_message']
        decrypted_message = decrypt(encrypted_message, private_key)
        return jsonify({'decrypted_message': decrypted_message})


if __name__ == '__main__':
        app.run(host='0.0.0.0', port=5000)