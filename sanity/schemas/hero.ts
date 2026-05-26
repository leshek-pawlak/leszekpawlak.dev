const hero = {
  name: "hero",
  title: "Hero Section",
  type: "document",
  fields: [
    {
      name: "greeting",
      title: "Greeting",
      type: "object",
      fields: [
        { name: "pl", title: "Polish", type: "string" },
        { name: "en", title: "English", type: "string" },
      ],
    },
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        { name: "pl", title: "Polish", type: "string" },
        { name: "en", title: "English", type: "string" },
      ],
    },
    {
      name: "subtitle",
      title: "Subtitle",
      type: "object",
      fields: [
        { name: "pl", title: "Polish", type: "text" },
        { name: "en", title: "English", type: "text" },
      ],
    },
    {
      name: "image",
      title: "Profile Image",
      type: "image",
      options: { hotspot: true },
    },
  ],
};

export default hero;
