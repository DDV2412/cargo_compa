const base64ToBlob = (base64: string, type: string) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type });
};

export const base64ToFile = (base64: string, filename: string) => {
  const arr = base64.split(",");
  const match = arr[0].match(/:(.*?);/);
  const mime = match ? match[1] : "";
  const blob = base64ToBlob(arr[1], mime);
  return new File([blob], filename, { type: mime });
};
