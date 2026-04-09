import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ExpandableCollection from "../components/ExpandableCollection";
import { useAuth } from "../context/AuthContext";
import { useHub } from "../context/HubContext";
import { getTodayInputValue, isPastDate } from "../utils/date";
import "../pages-styling/group-details.css";

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function GroupDetails() {
  const { groupId } = useParams();
  const { currentUser } = useAuth();
  const { getGroupById, posts, resources, tasks, addPost, addResource, addTask } =
    useHub();

  const group = getGroupById(groupId);
  const [postContent, setPostContent] = useState("");
  const [resourceForm, setResourceForm] = useState({
    title: "",
    type: "Link",
    link: "",
  });
  const [taskForm, setTaskForm] = useState({
    title: "",
    dueDate: "",
  });
  const [taskError, setTaskError] = useState("");
  const today = getTodayInputValue();

  const groupPosts = useMemo(
    () => posts.filter((post) => post.groupId === groupId),
    [groupId, posts]
  );
  const groupResources = useMemo(
    () => resources.filter((resource) => resource.groupId === groupId),
    [groupId, resources]
  );
  const groupTasks = useMemo(
    () => tasks.filter((task) => task.assignedGroup === groupId),
    [groupId, tasks]
  );
  const activeGroupTasks = useMemo(
    () => groupTasks.filter((task) => !isPastDate(task.dueDate)),
    [groupTasks]
  );
  const pastGroupTasks = useMemo(
    () => groupTasks.filter((task) => isPastDate(task.dueDate)),
    [groupTasks]
  );

  if (!group) {
    return (
      <section className="panel">
        <h2>Group not found</h2>
        <p>The group may have been removed or the link is incorrect.</p>
        <Link to="/groups" className="text-link">
          Back to groups
        </Link>
      </section>
    );
  }

  const handlePostSubmit = (event) => {
    event.preventDefault();
    addPost({ groupId, content: postContent, user: currentUser });
    setPostContent("");
  };

  const handleResourceSubmit = (event) => {
    event.preventDefault();
    addResource({
      ...resourceForm,
      groupId,
      subject: group.subject,
      user: currentUser,
    });
    setResourceForm({ title: "", type: "Link", link: "" });
  };

  const handleTaskSubmit = (event) => {
    event.preventDefault();
    const result = addTask({
      title: taskForm.title,
      dueDate: taskForm.dueDate,
      assignedGroup: groupId,
      user: currentUser,
    });

    if (!result.success) {
      setTaskError(result.message);
      return;
    }

    setTaskError("");
    setTaskForm({ title: "", dueDate: "" });
  };

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">{group.subject}</p>
          <h2>{group.name}</h2>
          <p>{group.description}</p>
        </div>
        <div className="meta-badge-row">
          <span className="status-pill done">{group.memberIds.length} members</span>
          <span className="status-pill in-progress">Lead: {group.leaderName}</span>
        </div>
      </section>

      <section className="content-grid triple-grid">
        <article className="panel">
          <div className="panel-heading">
            <h3>Discussion board</h3>
          </div>

          <form className="form-stack compact-form" onSubmit={handlePostSubmit}>
            <label>
              Ask a question or share an update
              <textarea
                rows="4"
                value={postContent}
                onChange={(event) => setPostContent(event.target.value)}
                required
              />
            </label>
            <button type="submit" className="primary-button full-width">
              Post update
            </button>
          </form>

          <ExpandableCollection
            items={groupPosts}
            className="list-stack"
            emptyMessage="No posts in this group yet."
            renderItem={(post) => (
              <div key={post.id} className="list-card">
                <div>
                  <strong>{post.authorName}</strong>
                  <p>{post.content}</p>
                </div>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            )}
          />
        </article>

        <article className="panel">
          <div className="panel-heading">
            <h3>Shared resources</h3>
          </div>

          <form className="form-stack compact-form" onSubmit={handleResourceSubmit}>
            <label>
              Resource title
              <input
                type="text"
                value={resourceForm.title}
                onChange={(event) =>
                  setResourceForm((previous) => ({
                    ...previous,
                    title: event.target.value,
                  }))
                }
                required
              />
            </label>

            <label>
              Type
              <select
                value={resourceForm.type}
                onChange={(event) =>
                  setResourceForm((previous) => ({
                    ...previous,
                    type: event.target.value,
                  }))
                }
              >
                <option>Link</option>
                <option>PDF</option>
                <option>Note</option>
              </select>
            </label>

            <label>
              URL
              <input
                type="url"
                value={resourceForm.link}
                onChange={(event) =>
                  setResourceForm((previous) => ({
                    ...previous,
                    link: event.target.value,
                  }))
                }
                required
              />
            </label>

            <button type="submit" className="secondary-button full-width">
              Add resource
            </button>
          </form>

          <ExpandableCollection
            items={groupResources}
            className="list-stack"
            emptyMessage="No resources added to this group yet."
            renderItem={(resource) => (
              <div key={resource.id} className="list-card">
                <div>
                  <strong>{resource.title}</strong>
                  <p>
                    {resource.type} - by {resource.uploadedBy}
                  </p>
                </div>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-link"
                >
                  Open
                </a>
              </div>
            )}
          />
        </article>

        <article className="panel">
          <div className="panel-heading">
            <h3>Group tasks</h3>
          </div>

          <form className="form-stack compact-form" onSubmit={handleTaskSubmit}>
            <label>
              Task title
              <input
                type="text"
                value={taskForm.title}
                onChange={(event) =>
                  setTaskForm((previous) => ({
                    ...previous,
                    title: event.target.value,
                  }))
                }
                required
              />
            </label>

            <label>
              Due date
              <input
                type="date"
                min={today}
                value={taskForm.dueDate}
                onChange={(event) =>
                  setTaskForm((previous) => ({
                    ...previous,
                    dueDate: event.target.value,
                  }))
                }
                required
              />
            </label>

            {taskError ? <p className="form-error">{taskError}</p> : null}

            <button type="submit" className="secondary-button full-width">
              Add task
            </button>
          </form>

          <div className="subsection-heading">
            <h4>Active tasks</h4>
          </div>

          <ExpandableCollection
            items={activeGroupTasks}
            className="list-stack"
            emptyMessage="No active tasks in this group yet."
            renderItem={(task) => (
              <div key={task.id} className="list-card">
                <div>
                  <strong>{task.title}</strong>
                  <p>Due {formatDate(task.dueDate)}</p>
                </div>
                <span className={`status-pill ${task.status}`}>{task.status}</span>
              </div>
            )}
          />

          <div className="subsection-heading">
            <h4>Past tasks</h4>
          </div>

          <ExpandableCollection
            items={pastGroupTasks}
            className="list-stack"
            emptyMessage="No past tasks in this group."
            renderItem={(task) => (
              <div key={task.id} className="list-card">
                <div>
                  <strong>{task.title}</strong>
                  <p>Due {formatDate(task.dueDate)}</p>
                </div>
                <span className="status-pill overdue">Past due</span>
              </div>
            )}
          />
        </article>
      </section>
    </div>
  );
}

export default GroupDetails;
