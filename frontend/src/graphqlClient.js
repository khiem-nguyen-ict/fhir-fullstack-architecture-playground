const BFF_URL = `${import.meta.env.VITE_BFF_URL || window.location.origin}/graphql`;

export async function graphqlRequest(query, variables = {}) {
  const res = await fetch(BFF_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }

  return json.data;
}
