import { useState } from "react";
import { Link } from "react-router-dom";
import ExpandableCollection from "../components/ExpandableCollection";
import { useAuth } from "../context/AuthContext";
import { useHub } from "../context/HubContext";
import "../pages-styling/groups.css";

function Groups() {
  const { currentUser } = useAuth();
  const { groups, createGroup, joinGroup } = useHub();
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description: "",
  });

  const filteredGroups = groups.filter((group) =>
    `${group.name} ${group.subject} ${group.description}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleCreateGroup = (event) => {
    event.preventDefault();
    createGroup({ ...formData, user: currentUser });
    setFormData({ name: "", subject: "", description: "" });
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

          <label className="full-width">
            Search
            <input
              type="search"
              placeholder="React, database, UI..."
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

              return (
                <article key={group.id} className="info-card">
                  <p className="eyebrow">{group.subject}</p>
                  <h3>{group.name}</h3>
                  <p>{group.description}</p>
                  <div className="meta-row">
                    <span>{group.memberIds.length} members</span>
                    <span>Lead: {group.leaderName}</span>
                  </div>
                  <div className="button-row">
                    {!isMember ? (
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => joinGroup({ groupId: group.id, user: currentUser })}
                      >
                        Join group
                      </button>
                    ) : (
                      <span className="status-pill done">Member</span>
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
