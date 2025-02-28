import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'default-key';

export const encryptMessage = (message: string): string => {
  return CryptoJS.AES.encrypt(message, ENCRYPTION_KEY).toString();
};

export const decryptMessage = (encryptedMessage: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}; 