export const seedGroups = [
  {
    id: "grp-react",
    name: "React Revision Circle",
    subject: "Frontend Development",
    description:
      "Weekly check-ins for component design, hooks practice, and capstone support.",
    leaderName: "Amina Hassan",
    leaderId: "user-2",
    accessType: "private",
    memberIds: ["user-demo", "user-2", "user-3"],
    joinRequests: [],
    createdAt: "2026-04-01T09:00:00.000Z",
  },
  {
    id: "grp-db",
    name: "Database Design Lab",
    subject: "Database Systems",
    description:
      "Share ERD feedback, SQL exercises, and clean schema notes before submissions.",
    leaderName: "Brian Otieno",
    leaderId: "user-3",
    accessType: "private",
    memberIds: ["user-3", "user-4"],
    joinRequests: [
      {
        userId: "user-demo",
        userName: "Demo Student",
        requestedAt: "2026-04-08T09:10:00.000Z",
      },
    ],
    createdAt: "2026-03-28T11:30:00.000Z",
  },
  {
    id: "grp-ui",
    name: "UI Critique Studio",
    subject: "Product Design",
    description:
      "Peer review flows, improve accessibility, and prepare polished demo screens.",
    leaderName: "Demo Student",
    leaderId: "user-demo",
    accessType: "private",
    memberIds: ["user-demo", "user-4"],
    joinRequests: [
      {
        userId: "user-2",
        userName: "Amina Hassan",
        requestedAt: "2026-04-09T08:20:00.000Z",
      },
    ],
    createdAt: "2026-04-03T14:15:00.000Z",
  },
];

export const seedPosts = [
  {
    id: "post-1",
    groupId: "grp-react",
    authorName: "Amina Hassan",
    content:
      "Can someone explain when to lift state up versus keeping form state local in React?",
    createdAt: "2026-04-05T07:45:00.000Z",
  },
  {
    id: "post-2",
    groupId: "grp-react",
    authorName: "Demo Student",
    content:
      "I shared a cheatsheet on props drilling alternatives. Context works well for shared auth and theme state.",
    createdAt: "2026-04-06T10:20:00.000Z",
  },
  {
    id: "post-3",
    groupId: "grp-ui",
    authorName: "Linet Njeri",
    content:
      "Please review the new dashboard wireframe before Thursday. Focus on spacing and mobile layout.",
    createdAt: "2026-04-07T16:10:00.000Z",
  },
];

export const seedResources = [
  {
    id: "res-1",
    title: "React Routing Summary",
    type: "Link",
    link: "https://reactrouter.com/en/main/start/overview",
    content: "",
    fileData: "",
    fileName: "",
    subject: "Frontend Development",
    groupId: "grp-react",
    uploadedBy: "Amina Hassan",
    createdAt: "2026-04-04T09:15:00.000Z",
  },
  {
    id: "res-2",
    title: "Normalization Notes",
    type: "PDF",
    link: "https://example.com/normalization-notes.pdf",
    content: "",
    fileData: "",
    fileName: "",
    subject: "Database Systems",
    groupId: "grp-db",
    uploadedBy: "Brian Otieno",
    createdAt: "2026-04-02T12:00:00.000Z",
  },
  {
    id: "res-3",
    title: "Accessibility Checklist",
    type: "Note",
    link: "",
    content:
      "Check color contrast, heading structure, button labels, keyboard navigation, and responsive spacing before demo day.",
    fileData: "",
    fileName: "",
    subject: "Product Design",
    groupId: "grp-ui",
    uploadedBy: "Demo Student",
    createdAt: "2026-04-07T08:00:00.000Z",
  },
];

export const seedTasks = [
  {
    id: "task-1",
    title: "Finalize landing page hero section",
    description: "Refine the hero copy, update CTA styling, and ensure mobile spacing is polished.",
    dueDate: "2026-04-10",
    status: "in-progress",
    assignedGroup: "grp-ui",
    createdBy: "Demo Student",
  },
  {
    id: "task-2",
    title: "Submit SQL indexing exercise",
    description: "Complete the assignment on query performance and submit the report before deadline.",
    dueDate: "2026-04-12",
    status: "todo",
    assignedGroup: "grp-db",
    createdBy: "Brian Otieno",
  },
  {
    id: "task-3",
    title: "Review protected routes implementation",
    description: "Check route guards, authentication redirects, and role-based access for the new dashboard pages.",
    dueDate: "2026-04-09",
    status: "todo",
    assignedGroup: "grp-react",
    createdBy: "Amina Hassan",
  },
  {
    id: "task-4",
    title: "Compile usability feedback notes",
    description: "Summarize the user testing feedback and share key improvements with the UI team.",
    dueDate: "2026-04-08",
    status: "done",
    assignedGroup: "grp-ui",
    createdBy: "Demo Student",
  },
];
