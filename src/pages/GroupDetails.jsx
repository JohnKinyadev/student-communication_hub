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

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
}

function GroupDetails() {
  const { groupId } = useParams();
  const { currentUser } = useAuth();
  const {
    getGroupById,
    posts,
    resources,
    tasks,
    addPost,
    addResource,
    addTask,
    markTaskComplete,
    reopenTask,
    joinGroup,
    leaveGroup,
    reviewJoinRequest,
  } = useHub();

  const group = getGroupById(groupId);
  const [postContent, setPostContent] = useState("");
  const [resourceForm, setResourceForm] = useState({
    title: "",
    type: "Link",
    link: "",
    content: "",
    file: null,
  });
  const [taskForm, setTaskForm] = useState({
    title: "",
    dueDate: "",
  });
  const [taskError, setTaskError] = useState("");
  const [groupMessage, setGroupMessage] = useState("");
  const [resourceError, setResourceError] = useState("");
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
    () =>
      groupTasks.filter(
        (task) => task.status !== "done" && !isPastDate(task.dueDate)
      ),
    [groupTasks]
  );
  const pastGroupTasks = useMemo(
    () =>
      groupTasks.filter(
        (task) => task.status !== "done" && isPastDate(task.dueDate)
      ),
    [groupTasks]
  );
  const completedGroupTasks = useMemo(
    () => groupTasks.filter((task) => task.status === "done"),
    [groupTasks]
  );
  const isLeader = group?.leaderId === currentUser.id;
  const isMember = group?.memberIds.includes(currentUser.id);
  const hasPendingRequest = group?.joinRequests?.some(
    (request) => request.userId === currentUser.id
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

  const handleResourceSubmit = async (event) => {
    event.preventDefault();

    if ((resourceForm.type === "Image" || resourceForm.type === "Video") && !resourceForm.file) {
      setResourceError(`Please choose a ${resourceForm.type.toLowerCase()} file first.`);
      return;
    }

    if (resourceForm.type === "Note" && !resourceForm.content.trim()) {
      setResourceError("Please add note content before saving.");
      return;
    }

    try {
      let fileData = "";
      let fileName = "";

      if (resourceForm.file) {
        fileData = await readFileAsDataUrl(resourceForm.file);
        fileName = resourceForm.file.name;
      }

      addResource({
        title: resourceForm.title,
        type: resourceForm.type,
        link: resourceForm.link,
        content: resourceForm.content,
        fileData,
        fileName,
        groupId,
        subject: group.subject,
        user: currentUser,
      });

      setResourceError("");
      setResourceForm({
        title: "",
        type: "Link",
        link: "",
        content: "",
        file: null,
      });
    } catch (error) {
      setResourceError("Unable to upload that file right now.");
    }
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

  const handleJoinGroup = () => {
    const result = joinGroup({ groupId, user: currentUser });
    setGroupMessage(result.message);
  };

  const handleLeaveGroup = () => {
    const result = leaveGroup({ groupId, user: currentUser });
    setGroupMessage(result.message);
  };

  const handleReviewRequest = (requesterId, approve) => {
    const result = reviewJoinRequest({ groupId, requesterId, approve });
    setGroupMessage(result.message);
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
          <span className={`access-pill ${group.accessType}`}>{group.accessType}</span>
          <span className="status-pill done">{group.memberIds.length} members</span>
          <span className="status-pill in-progress">Lead: {group.leaderName}</span>
          {!isMember && !hasPendingRequest ? (
            <button type="button" className="secondary-button" onClick={handleJoinGroup}>
              {group.accessType === "private" ? "Request to join" : "Join group"}
            </button>
          ) : null}
          {hasPendingRequest ? (
            <span className="status-pill in-progress">Request pending</span>
          ) : null}
          {isMember && !isLeader ? (
            <button type="button" className="ghost-button" onClick={handleLeaveGroup}>
              Leave group
            </button>
          ) : null}
        </div>
      </section>

      {groupMessage ? <p className="group-feedback">{groupMessage}</p> : null}

      {isLeader ? (
        <section className="panel">
          <div className="panel-heading">
            <h3>Join requests</h3>
          </div>

          <ExpandableCollection
            items={group.joinRequests}
            className="list-stack"
            emptyMessage="No pending join requests right now."
            renderItem={(request) => (
              <div key={request.userId} className="list-card request-card">
                <div>
                  <strong>{request.userName}</strong>
                  <p>
                    Requested{" "}
                    {new Date(request.requestedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <div className="button-row">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => handleReviewRequest(request.userId, true)}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => handleReviewRequest(request.userId, false)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}
          />
        </section>
      ) : null}

      <section className="content-grid triple-grid">
        <article className="panel">
          <div className="panel-heading">
            <h3>Discussion board</h3>
          </div>

          {isMember ? (
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
          ) : (
            <p className="group-feedback">Join this group to post on the discussion board.</p>
          )}

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

          {isMember ? (
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
                  onChange={(event) => {
                    setResourceError("");
                    setResourceForm((previous) => ({
                      ...previous,
                      type: event.target.value,
                      link: "",
                      content: "",
                      file: null,
                    }));
                  }}
                >
                  <option>Link</option>
                  <option>PDF</option>
                  <option>Note</option>
                  <option>Image</option>
                  <option>Video</option>
                </select>
              </label>

              {resourceForm.type === "Link" || resourceForm.type === "PDF" ? (
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
              ) : null}

              {resourceForm.type === "Note" ? (
                <label>
                  Note content
                  <textarea
                    rows="5"
                    value={resourceForm.content}
                    onChange={(event) =>
                      setResourceForm((previous) => ({
                        ...previous,
                        content: event.target.value,
                      }))
                    }
                    required
                  />
                </label>
              ) : null}

              {resourceForm.type === "Image" || resourceForm.type === "Video" ? (
                <label>
                  Upload {resourceForm.type.toLowerCase()}
                  <input
                    type="file"
                    accept={resourceForm.type === "Image" ? "image/*" : "video/*"}
                    onChange={(event) => {
                      setResourceError("");
                      setResourceForm((previous) => ({
                        ...previous,
                        file: event.target.files?.[0] || null,
                      }));
                    }}
                    required
                  />
                </label>
              ) : null}

              {resourceError ? <p className="form-error">{resourceError}</p> : null}

              <button type="submit" className="secondary-button full-width">
                Add resource
              </button>
            </form>
          ) : (
            <p className="group-feedback">Join this group to share resources.</p>
          )}

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
                  {resource.type === "Note" && resource.content ? (
                    <p className="resource-snippet">{resource.content}</p>
                  ) : null}
                  {resource.type === "Image" && resource.fileData ? (
                    <img
                      src={resource.fileData}
                      alt={resource.title}
                      className="resource-preview-image"
                    />
                  ) : null}
                  {resource.type === "Video" && resource.fileData ? (
                    <video
                      src={resource.fileData}
                      controls
                      className="resource-preview-video"
                    />
                  ) : null}
                </div>
                {resource.link ? (
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                  >
                    Open
                  </a>
                ) : resource.fileName ? (
                  <span className="resource-file-name">{resource.fileName}</span>
                ) : (
                  <span className="status-pill done">Saved</span>
                )}
              </div>
            )}
          />
        </article>

        <article className="panel">
          <div className="panel-heading">
            <h3>Group tasks</h3>
          </div>

          {isMember ? (
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
          ) : (
            <p className="group-feedback">Join this group to add tasks.</p>
          )}

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
                <div className="button-row">
                  <span className={`status-pill ${task.status}`}>{task.status}</span>
                  {isLeader ? (
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => markTaskComplete(task.id)}
                    >
                      Mark complete
                    </button>
                  ) : null}
                </div>
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
                <div className="button-row">
                  <span className="status-pill overdue">Past due</span>
                  {isLeader ? (
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => markTaskComplete(task.id)}
                    >
                      Mark complete
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          />

          <div className="subsection-heading">
            <h4>Completed tasks</h4>
          </div>

          <ExpandableCollection
            items={completedGroupTasks}
            className="list-stack"
            emptyMessage="No completed tasks in this group yet."
            renderItem={(task) => (
              <div key={task.id} className="list-card">
                <div>
                  <strong>{task.title}</strong>
                  <p>Due {formatDate(task.dueDate)}</p>
                </div>
                <div className="button-row">
                  <span className="status-pill done">Completed</span>
                  {isLeader ? (
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => reopenTask(task.id)}
                    >
                      Reopen
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          />
        </article>
      </section>
    </div>
  );
}

export default GroupDetails;
