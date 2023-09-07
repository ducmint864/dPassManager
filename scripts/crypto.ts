/**
 * @notice Script encrypt tham khảo
 */


import { timeStamp } from "console";
import crypto, { publicDecrypt } from "crypto";
import { ethers, network } from "hardhat";
// import { PasswordManager } from "../typechain-types";

// Optionally, convert the keys to hexadecimal strings for easier storage or transmission
// const publicKeyHex = publicKey.toString('hex');
// const privateKeyHex = privateKey.toString('hex');

// console.log('ECDH Public Key:', publicKeyHex);
// console.log('ECDH Private Key:', privateKeyHex);


export function encryptData(dataToEncrypt: any, publicKeyHex: string)
    : string | Buffer {
    const publicKeyBuffer: Buffer = Buffer.from(publicKeyHex, 'hex');
    const encryptedDataBuffer = crypto.publicEncrypt(
        {
            key: publicKeyBuffer,
            // padding: crypto.constants.RSA_PKCS1_OAEP_PADDING 
        },
        Buffer.from(dataToEncrypt)
    );
    // return encryptedDataBuffer.toString('base64');
    return encryptedDataBuffer;
}

export function decryptData(encryptedDataHex: string, privateKeyHex: string)
    : string {
    const privateKeyBuffer: Buffer = Buffer.from(privateKeyHex);
    const decryptedData: Buffer = publicDecrypt(
        {
            key: privateKeyBuffer,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        },
        Buffer.from(encryptedDataHex)
    )
    return decryptedData.toString('base64');
}

const MAX_ITERATIONS = 10000;
const KEY_LENGTH = 32;

export function registerKeyPair(passphrase: string)
    : boolean | void {
    // Generate a public and private key pair for user 
    const curveName = 'secp256k1';
    const ecdh = crypto.createECDH(curveName);
    ecdh.generateKeys('hex', 'compressed');
    const publicKeyHex: string = ecdh.getPublicKey('hex', 'compressed');
    const privateKeyHex: string = ecdh.getPrivateKey('hex');

    const timestamp: number = Date.now();
    const salt: Buffer = crypto.randomBytes(16);

    crypto.pbkdf2(passphrase, salt, MAX_ITERATIONS, KEY_LENGTH, 'sha256', async (err: unknown, derivedKey: Buffer) => {
        if (err) {
            console.error('Key derivation error: ', err);
            return false;
        }

        // Encrypt Key Pair using the user's secret passphrase
        const iv = crypto.randomBytes(16); // 16 bytes for AES-256
        const cipher: crypto.Cipher = crypto.createCipheriv('aes-256-cbc', derivedKey, iv);

        // Encrypt the public key
        let encryptedPublicKey: string = cipher.update(publicKeyHex, 'utf8', 'hex');
        encryptedPublicKey += cipher.final('hex');

        // Create a new Cipher for the private key
        const cipherPrivateKey: crypto.Cipher = crypto.createCipheriv('aes-256-cbc', derivedKey, iv);

        // Encrypt the private key
        let encryptedPrivateKey: string = cipherPrivateKey.update(privateKeyHex, 'utf8', 'hex');
        encryptedPrivateKey += cipherPrivateKey.final('hex');

        // Save encrypted Key Pair and 'iv' in the smart contract
        return true;
    });
}

// Testing
const passphrase: string = "iloveu";
registerKeyPair(passphrase)