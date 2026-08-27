export type ContactSubmission = {
  name: string;
  email: string;
  message: string;
};

export async function submitContact(
  submission: ContactSubmission,
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  const response = await fetcher("/api/contact", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify(submission),
  });
  if (!response.ok) return false;

  const data = (await response.json()) as { success?: unknown };
  return data.success === true;
}
