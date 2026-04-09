import { useState } from "react";
import { Link } from "react-router-dom";
import ExpandableCollection from "../components/ExpandableCollection";
import { useAuth } from "../context/AuthContext";
import { useHub } from "../context/HubContext";
import "../pages-styling/groups.css";

function Groups() {
  const { currentUser } = useAuth();
  const { groups, createGroup, joinGroup, leaveGroup } = useHub();
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description: "",
    accessType: "public",
  });

  const filteredGroups = groups.filter((group) =>
    `${group.name} ${group.subject} ${group.description}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleCreateGroup = (event) => {
    event.preventDefault();
    createGroup({ ...formData, user: currentUser });
    setFeedback(
      formData.accessType === "private"
        ? "Private group created successfully."
        : "Public group created successfully."
    );
    setFormData({
      name: "",
      subject: "",
      description: "",
      accessType: "public",
    });
  };

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Study groups</p>
          <h2>Create a team or join one already working.</h2>
          <p>
            Search by subject, open a group workspace, and keep collaboration
            tied to a real class or project.
          </p>
        </div>
      </section>

      <section className="content-grid">
        <article className="panel find-groups-panel">
          <div className="panel-heading">
            <h3>Find groups</h3>
          </div>

          {feedback ? <p className="group-feedback">{feedback}</p> : null}

          <label className="full-width">
            Search
            <input
              type="search"
              placeholder="Search the group you want to join..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <ExpandableCollection
            items={filteredGroups}
            className="card-grid"
            emptyMessage="No groups match your search yet."
            renderItem={(group) => {
              const isMember = group.memberIds.includes(currentUser.id);
              const isLeader = group.leaderId === currentUser.id;
              const hasPendingRequest = group.joinRequests?.some(
                (request) => request.userId === currentUser.id
              );

              const handleJoinAction = () => {
                const result = joinGroup({ groupId: group.id, user: currentUser });
                setFeedback(result.message);
              };

              const handleLeaveAction = () => {
                const result = leaveGroup({ groupId: group.id, user: currentUser });
                setFeedback(result.message);
              };

              return (
                <article key={group.id} className="info-card">
                  <p className="eyebrow">{group.subject}</p>
                  <h3>{group.name}</h3>
                  <p>{group.description}</p>
                  <div className="meta-row">
                    <span className={`access-pill ${group.accessType}`}>
                      {group.accessType}
                    </span>
                    <span>{group.memberIds.length} members</span>
                    <span>Lead: {group.leaderName}</span>
                    {isLeader && group.joinRequests.length > 0 ? (
                      <span>{group.joinRequests.length} pending</span>
                    ) : null}
                  </div>
                  <div className="button-row">
                    {!isMember && !hasPendingRequest ? (
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={handleJoinAction}
                      >
                        {group.accessType === "private" ? "Request to join" : "Join group"}
                      </button>
                    ) : null}

                    {hasPendingRequest ? (
                      <span className="status-pill in-progress">Request pending</span>
                    ) : null}

                    {isLeader ? (
                      <span className="status-pill done">Admin</span>
                    ) : null}

                    {isMember && !isLeader ? (
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={handleLeaveAction}
                      >
                        Leave group
                      </button>
                    ) : (
                      isMember && !hasPendingRequest ? (
                        <span className="status-pill done">Member</span>
                      ) : null
                    )}
                    <Link to={`/groups/${group.id}`} className="text-link">
                      Open group
                    </Link>
                  </div>
                </article>
              );
            }}
          />
        </article>

        <article className="panel create-group-panel">
          <div className="panel-heading">
            <h3>Create a new group</h3>
          </div>

          <form className="form-stack" onSubmit={handleCreateGroup}>
            <label>
              Group name
              <input
                type="text"
                value={formData.name}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
                required
              />
            </label>

            <label>
              Subject
              <input
                type="text"
                value={formData.subject}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    subject: event.target.value,
                  }))
                }
                required
              />
            </label>

            <label>
              Description
              <textarea
                rows="4"
                value={formData.description}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                required
              />
            </label>

            <label>
              Group access
              <select
                value={formData.accessType}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    accessType: event.target.value,
                  }))
                }
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </label>

            <button type="submit" className="primary-button full-width">
              Create group
            </button>
          </form>
        </article>
      </section>
    </div>
  );
}

export default Groups;
