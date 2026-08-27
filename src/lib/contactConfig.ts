type ContactEnvironment = {
  [key: string]: string | undefined;
  WEB3FORMS_ACCESS_KEY?: string;
  NEXT_PUBLIC_WEB3FORMS_KEY?: string;
};

export function resolveWeb3FormsAccessKey(
  environment: ContactEnvironment = process.env,
): string | null {
  const accessKey =
    environment.WEB3FORMS_ACCESS_KEY ??
    environment.NEXT_PUBLIC_WEB3FORMS_KEY ??
    "";

  return accessKey.trim() || null;
}
