export type ContactSubmission = {
  name: string;
  email: string;
  message: string;
};

export async function submitContact(
  submission: ContactSubmission,
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  const configResponse = await fetcher("/api/contact", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!configResponse.ok) return false;

  const config = (await configResponse.json()) as { accessKey?: unknown };
  if (typeof config.accessKey !== "string" || config.accessKey.length === 0) {
    return false;
  }

  const response = await fetcher("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: config.accessKey,
      ...submission,
      subject: `[leszekpawlak.dev] Wiadomość od ${submission.name}`,
      botcheck: false,
    }),
  });
  if (!response.ok) return false;

  const data = (await response.json()) as { success?: unknown };
  return data.success === true;
}
