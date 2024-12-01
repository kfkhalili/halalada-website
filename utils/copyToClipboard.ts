export async function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    // Use the Clipboard API
    try {
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Handle the error as needed
    }
  } else {
    // Clipboard API not available or insecure context
    // Notify the user
    alert(
      "Copying to clipboard is not supported in this browser. Please copy the text manually."
    );
  }
}
