export type ContactSubmission = {
  name: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  message: FormDataEntryValue | null;
};

export async function submitContact(
  submission: ContactSubmission,
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  const response = await fetcher("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
      ...submission,
      subject: `[leszekpawlak.dev] Wiadomość od ${submission.name}`,
    }),
  });
  const data = await response.json();

  return data.success === true;
}
