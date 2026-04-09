import { Link } from "react-router-dom";
import ExpandableCollection from "../components/ExpandableCollection";
import { useAuth } from "../context/AuthContext";
import { useHub } from "../context/HubContext";
import { isPastDate } from "../utils/date";
import "../pages-styling/dashboard.css";

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Dashboard() {
  const { currentUser } = useAuth();
  const { groups, posts, resources, tasks } = useHub();

  const joinedGroups = groups.filter((group) =>
    group.memberIds.includes(currentUser.id)
  );
  const joinedGroupIds = joinedGroups.map((group) => group.id);
  const upcomingTasks = tasks.filter(
    (task) =>
      joinedGroupIds.includes(task.assignedGroup) &&
      task.status !== "done" &&
      !isPastDate(task.dueDate)
  );
  const personalResources = resources.filter(
    (resource) => resource.uploadedBy === currentUser.name
  );
  const personalPosts = posts.filter((post) => post.authorName === currentUser.name);
  const recentPosts = posts.filter((post) => joinedGroupIds.includes(post.groupId));
  const recentResources = resources.filter((resource) =>
    joinedGroupIds.includes(resource.groupId)
  );

  const stats = [
    {
      label: "Joined groups",
      value: joinedGroups.length,
    },
    {
      label: "Open tasks",
      value: upcomingTasks.length,
    },
    {
      label: "Shared resources",
      value: personalResources.length,
    },
    {
      label: "Discussion posts",
      value: personalPosts.length,
    },
  ];

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Welcome back, {currentUser.name.split(" ")[0]}.</h2>
          <p>
            Here is your study snapshot: groups you belong to, the next deadlines,
            and the latest shared updates.
          </p>
        </div>
        <Link to="/groups" className="primary-button">
          Explore Groups
        </Link>
      </section>

      <section className="stat-grid">
        {stats.map((stat) => (
          <article key={stat.label} className="stat-card fade-up">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel task-panel">
          <div className="panel-heading">
            <h3>Upcoming tasks</h3>
            <Link to="/tasks">View all</Link>
          </div>

          <ExpandableCollection
            items={upcomingTasks}
            className="list-stack"
            emptyMessage="No active tasks right now."
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
        </article>

        <article className="panel joined-groups-panel">
          <div className="panel-heading">
            <h3>Your groups</h3>
            <Link to="/groups">Manage</Link>
          </div>

          <ExpandableCollection
            items={joinedGroups}
            className="list-stack"
            emptyMessage="You have not joined any groups yet."
            renderItem={(group) => (
              <div key={group.id} className="list-card">
                <div>
                  <strong>{group.name}</strong>
                  <p>{group.subject}</p>
                </div>
                <Link to={`/groups/${group.id}`} className="text-link">
                  Open
                </Link>
              </div>
            )}
          />
        </article>
      </section>

      <section className="content-grid">
        <article className="panel discussion-panel">
          <div className="panel-heading">
            <h3>Recent discussions</h3>
            <Link to="/groups">Post in a group</Link>
          </div>

          <ExpandableCollection
            items={recentPosts}
            className="list-stack"
            emptyMessage="No discussion posts yet."
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

        <article className="panel resources-panel">
          <div className="panel-heading">
            <h3>Latest resources</h3>
            <Link to="/resources">Browse library</Link>
          </div>

          <ExpandableCollection
            items={recentResources}
            className="list-stack"
            emptyMessage="No resources shared yet."
            renderItem={(resource) => (
              <div key={resource.id} className="list-card">
                <div>
                  <strong>{resource.title}</strong>
                  <p>
                    {resource.type} - {resource.subject}
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
      </section>
    </div>
  );
}

export default Dashboard;
