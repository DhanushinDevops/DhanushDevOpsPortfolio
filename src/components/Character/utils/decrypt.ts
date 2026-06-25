async function generateAESKey(password: string): Promise<CryptoKey> {
  const passwordBuffer = new TextEncoder().encode(password);
  const hashedPassword = await crypto.subtle.digest("SHA-256", passwordBuffer);
  return crypto.subtle.importKey(
    "raw",
    hashedPassword.slice(0, 32),
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"]
  );
}

export const decryptFile = async (
  url: string,
  password: string
): Promise<ArrayBuffer> => {
  console.log(`Fetching encrypted file from: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch encrypted file: ${response.status} ${response.statusText}`);
  }
  const encryptedData = await response.arrayBuffer();
  console.log(`File fetched successfully, size: ${encryptedData.byteLength} bytes. Starting decryption...`);
  const iv = new Uint8Array(encryptedData.slice(0, 16));
  const data = encryptedData.slice(16);
  const key = await generateAESKey(password);
  const decryptedData = await crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, data);
  console.log("Decryption successful.");
  return decryptedData;
};
