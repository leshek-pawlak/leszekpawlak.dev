const service = {
  name: "service",
  title: "Service",
  type: "document",
  fields: [
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
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        { name: "pl", title: "Polish", type: "text" },
        { name: "en", title: "English", type: "text" },
      ],
    },
    {
      name: "icon",
      title: "Icon name",
      type: "string",
      description:
        "Icon identifier (e.g. consulting, estimation, development, ai)",
    },
    {
      name: "order",
      title: "Display Order",
      type: "number",
    },
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
};

export default service;
