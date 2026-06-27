const BFF_URL = `${window.__BFF_URL__ || window.location.origin}/graphql`;

/**
 * Checks if a string likely contains HTML content
 * @param {string} str - String to check
 * @returns {boolean} - True if string contains HTML tags
 */
function likelyContainsHTML(str) {
  if (typeof str !== 'string') return false;
  // Check for common HTML tags that would indicate an error page
  const htmlPattern = /<[^>]+>/;
  return htmlPattern.test(str);
}

export async function graphqlRequest(query, variables = {}) {
  const res = await fetch(BFF_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors && json.errors.length > 0) {
    // Process each error to provide user-friendly messages
    const processedErrors = json.errors.map((error) => {
      // If the error message looks like HTML (likely an error page from backend service)
      if (likelyContainsHTML(error.message)) {
        // Return a user-friendly message instead of the raw HTML
        return "Unable to connect to the service. Please try again later.";
      }
      // Otherwise, return the original error message
      return error.message;
    });
    
    throw new Error(processedErrors.join("; "));
  }

  return json.data;
}