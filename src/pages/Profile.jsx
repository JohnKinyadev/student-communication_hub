import { useAuth } from "../context/AuthContext";
import ExpandableCollection from "../components/ExpandableCollection";
import { useHub } from "../context/HubContext";
import { isPastDate } from "../utils/date";
import "../pages-styling/profile.css";

function Profile() {
  const { currentUser } = useAuth();
  const { groups, resources, posts, tasks } = useHub();

  const joinedGroups = groups.filter((group) =>
    group.memberIds.includes(currentUser.id)
  );
  const uploadedResources = resources.filter(
    (resource) => resource.uploadedBy === currentUser.name
  );
  const authoredPosts = posts.filter((post) => post.authorName === currentUser.name);
  const activeTasks = tasks.filter(
    (task) => task.status !== "done" && !isPastDate(task.dueDate)
  );

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Profile</p>
          <h2>{currentUser.name}</h2>
          <p>
            {currentUser.course} - {currentUser.role}
          </p>
        </div>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-heading">
            <h3>Account details</h3>
          </div>

          <div className="list-stack">
            <div className="list-card">
              <strong>Email</strong>
              <span>{currentUser.email}</span>
            </div>
            <div className="list-card">
              <strong>Course</strong>
              <span>{currentUser.course}</span>
            </div>
            <div className="list-card">
              <strong>Role</strong>
              <span>{currentUser.role}</span>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <h3>Your activity</h3>
          </div>

          <div className="list-stack">
            <div className="list-card">
              <strong>Joined groups</strong>
              <span>{joinedGroups.length}</span>
            </div>
            <div className="list-card">
              <strong>Resources shared</strong>
              <span>{uploadedResources.length}</span>
            </div>
            <div className="list-card">
              <strong>Discussion posts</strong>
              <span>{authoredPosts.length}</span>
            </div>
            <div className="list-card">
              <strong>Open tasks</strong>
              <span>{activeTasks.length}</span>
            </div>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h3>Groups you belong to</h3>
        </div>

        <ExpandableCollection
          items={joinedGroups}
          className="card-grid"
          emptyMessage="You have not joined any groups yet."
          renderItem={(group) => (
            <article key={group.id} className="info-card">
              <p className="eyebrow">{group.subject}</p>
              <h3>{group.name}</h3>
              <p>{group.description}</p>
            </article>
          )}
        />
      </section>
    </div>
  );
}

export default Profile;
