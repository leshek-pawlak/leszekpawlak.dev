const experience = {
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    {
      name: "company",
      title: "Company",
      type: "string",
    },
    {
      name: "role",
      title: "Role",
      type: "object",
      fields: [
        { name: "pl", title: "Polish", type: "string" },
        { name: "en", title: "English", type: "string" },
      ],
    },
    {
      name: "startDate",
      title: "Start Date",
      type: "date",
    },
    {
      name: "endDate",
      title: "End Date",
      type: "date",
      description: "Leave empty for current position",
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
      name: "techStack",
      title: "Tech Stack",
      type: "array",
      of: [{ type: "string" }],
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

export default experience;
