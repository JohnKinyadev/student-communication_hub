import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { seedGroups, seedPosts, seedResources, seedTasks } from "../data/mockData";
import { isPastDate } from "../utils/date";

const HubContext = createContext(null);

const GROUPS_KEY = "sch_groups";
const POSTS_KEY = "sch_posts";
const RESOURCES_KEY = "sch_resources";
const TASKS_KEY = "sch_tasks";

function normalizeGroup(group) {
  return {
    ...group,
    leaderId: group.leaderId || group.memberIds?.[0] || "",
    accessType: group.accessType || "public",
    joinRequests: Array.isArray(group.joinRequests) ? group.joinRequests : [],
    memberIds: Array.isArray(group.memberIds) ? group.memberIds : [],
  };
}

function getStoredValue(key, fallback) {
  const rawValue = localStorage.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return fallback;
  }
}

function sortByNewest(items) {
  return [...items].sort(
    (first, second) => new Date(second.createdAt) - new Date(first.createdAt)
  );
}

export function HubProvider({ children }) {
  const [groups, setGroups] = useState(() =>
    getStoredValue(GROUPS_KEY, seedGroups).map(normalizeGroup)
  );
  const [posts, setPosts] = useState(() => getStoredValue(POSTS_KEY, seedPosts));
  const [resources, setResources] = useState(() =>
    getStoredValue(RESOURCES_KEY, seedResources)
  );
  const [tasks, setTasks] = useState(() => getStoredValue(TASKS_KEY, seedTasks));

  useEffect(() => {
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const value = useMemo(
    () => ({
      groups: sortByNewest(groups),
      posts: sortByNewest(posts),
      resources: sortByNewest(resources),
      tasks: [...tasks].sort(
        (first, second) => new Date(first.dueDate) - new Date(second.dueDate)
      ),
      createGroup: ({ name, subject, description, accessType, user }) => {
        const group = {
          id: `grp-${Date.now()}`,
          name,
          subject,
          description,
          leaderName: user.name,
          leaderId: user.id,
          accessType,
          memberIds: [user.id],
          joinRequests: [],
          createdAt: new Date().toISOString(),
        };

        setGroups((previousGroups) => [group, ...previousGroups]);
        return group;
      },
      joinGroup: ({ groupId, user }) => {
        let outcome = {
          success: false,
          type: "none",
          message: "Unable to join this group right now.",
        };

        setGroups((previousGroups) =>
          previousGroups.map((item) => {
            const group = normalizeGroup(item);

            if (group.id !== groupId) {
              return group;
            }

            if (group.memberIds.includes(user.id)) {
              outcome = {
                success: false,
                type: "member",
                message: "You are already a member of this group.",
              };
              return group;
            }

            if (group.joinRequests.some((request) => request.userId === user.id)) {
              outcome = {
                success: false,
                type: "pending",
                message: "Your request is already waiting for approval.",
              };
              return group;
            }

            if (group.accessType === "private") {
              outcome = {
                success: true,
                type: "requested",
                message: "Join request sent. The group leader will review it.",
              };
              return {
                ...group,
                joinRequests: [
                  ...group.joinRequests,
                  {
                    userId: user.id,
                    userName: user.name,
                    requestedAt: new Date().toISOString(),
                  },
                ],
              };
            }

            outcome = {
              success: true,
              type: "joined",
              message: "You joined the group successfully.",
            };
            return {
              ...group,
              memberIds: [...group.memberIds, user.id],
            };
          })
        );

        return outcome;
      },
      leaveGroup: ({ groupId, user }) => {
        let outcome = {
          success: false,
          message: "Unable to leave this group right now.",
        };

        setGroups((previousGroups) =>
          previousGroups.map((item) => {
            const group = normalizeGroup(item);

            if (group.id !== groupId) {
              return group;
            }

            if (group.leaderId === user.id) {
              outcome = {
                success: false,
                message: "Group leaders cannot leave their own group.",
              };
              return group;
            }

            if (!group.memberIds.includes(user.id)) {
              outcome = {
                success: false,
                message: "You are not a member of this group.",
              };
              return group;
            }

            outcome = {
              success: true,
              message: "You left the group successfully.",
            };
            return {
              ...group,
              memberIds: group.memberIds.filter((memberId) => memberId !== user.id),
            };
          })
        );

        return outcome;
      },
      reviewJoinRequest: ({ groupId, requesterId, approve }) => {
        let outcome = {
          success: false,
          message: "Unable to review that request right now.",
        };

        setGroups((previousGroups) =>
          previousGroups.map((item) => {
            const group = normalizeGroup(item);

            if (group.id !== groupId) {
              return group;
            }

            const request = group.joinRequests.find(
              (entry) => entry.userId === requesterId
            );

            if (!request) {
              outcome = {
                success: false,
                message: "That join request no longer exists.",
              };
              return group;
            }

            outcome = {
              success: true,
              message: approve
                ? "Join request approved."
                : "Join request declined.",
            };

            return {
              ...group,
              memberIds: approve
                ? [...group.memberIds, requesterId]
                : group.memberIds,
              joinRequests: group.joinRequests.filter(
                (entry) => entry.userId !== requesterId
              ),
            };
          })
        );

        return outcome;
      },
      addPost: ({ groupId, content, user }) => {
        const post = {
          id: `post-${Date.now()}`,
          groupId,
          authorName: user.name,
          content,
          createdAt: new Date().toISOString(),
        };

        setPosts((previousPosts) => [post, ...previousPosts]);
      },
      addResource: ({
        title,
        type,
        link,
        content,
        fileData,
        fileName,
        groupId,
        subject,
        user,
      }) => {
        const resource = {
          id: `res-${Date.now()}`,
          title,
          type,
          link: link || "",
          content: content || "",
          fileData: fileData || "",
          fileName: fileName || "",
          subject,
          groupId,
          uploadedBy: user.name,
          createdAt: new Date().toISOString(),
        };

        setResources((previousResources) => [resource, ...previousResources]);
      },
      addTask: ({ title, dueDate, assignedGroup, user }) => {
        if (isPastDate(dueDate)) {
          return {
            success: false,
            message: "This task is already past due and cannot be added.",
          };
        }

        const task = {
          id: `task-${Date.now()}`,
          title,
          dueDate,
          status: "todo",
          assignedGroup,
          createdBy: user.name,
        };

        setTasks((previousTasks) => [task, ...previousTasks]);
        return { success: true };
      },
      markTaskComplete: (taskId) => {
        setTasks((previousTasks) =>
          previousTasks.map((task) =>
            task.id === taskId ? { ...task, status: "done" } : task
          )
        );
      },
      reopenTask: (taskId) => {
        setTasks((previousTasks) =>
          previousTasks.map((task) =>
            task.id === taskId ? { ...task, status: "todo" } : task
          )
        );
      },
      getGroupById: (groupId) =>
        groups.map(normalizeGroup).find((group) => group.id === groupId),
    }),
    [groups, posts, resources, tasks]
  );

  return <HubContext.Provider value={value}>{children}</HubContext.Provider>;
}

export function useHub() {
  const context = useContext(HubContext);

  if (!context) {
    throw new Error("useHub must be used within a HubProvider");
  }

  return context;
}
