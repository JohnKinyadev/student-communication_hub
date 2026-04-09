import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { seedGroups, seedPosts, seedResources, seedTasks } from "../data/mockData";
import { isPastDate } from "../utils/date";

const HubContext = createContext(null);

const GROUPS_KEY = "sch_groups";
const POSTS_KEY = "sch_posts";
const RESOURCES_KEY = "sch_resources";
const TASKS_KEY = "sch_tasks";

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
  const [groups, setGroups] = useState(() => getStoredValue(GROUPS_KEY, seedGroups));
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
      createGroup: ({ name, subject, description, user }) => {
        const group = {
          id: `grp-${Date.now()}`,
          name,
          subject,
          description,
          leaderName: user.name,
          memberIds: [user.id],
          createdAt: new Date().toISOString(),
        };

        setGroups((previousGroups) => [group, ...previousGroups]);
        return group;
      },
      joinGroup: ({ groupId, user }) => {
        setGroups((previousGroups) =>
          previousGroups.map((group) => {
            if (group.id !== groupId || group.memberIds.includes(user.id)) {
              return group;
            }

            return {
              ...group,
              memberIds: [...group.memberIds, user.id],
            };
          })
        );
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
      addResource: ({ title, type, link, groupId, subject, user }) => {
        const resource = {
          id: `res-${Date.now()}`,
          title,
          type,
          link,
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
      advanceTaskStatus: (taskId) => {
        const nextStatus = {
          todo: "in-progress",
          "in-progress": "done",
          done: "todo",
        };

        setTasks((previousTasks) =>
          previousTasks.map((task) =>
            task.id === taskId
              ? { ...task, status: nextStatus[task.status] }
              : task
          )
        );
      },
      getGroupById: (groupId) => groups.find((group) => group.id === groupId),
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
