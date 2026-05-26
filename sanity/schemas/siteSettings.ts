const siteSettings = {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Site Title",
      type: "string",
    },
    {
      name: "description",
      title: "Site Description",
      type: "object",
      fields: [
        { name: "pl", title: "Polish", type: "text" },
        { name: "en", title: "English", type: "text" },
      ],
    },
    {
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
    },
    {
      name: "email",
      title: "Contact Email",
      type: "string",
    },
    {
      name: "github",
      title: "GitHub URL",
      type: "url",
    },
    {
      name: "linkedin",
      title: "LinkedIn URL",
      type: "url",
    },
  ],
};

export default siteSettings;
