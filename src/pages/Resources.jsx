import { useState } from "react";
import ExpandableCollection from "../components/ExpandableCollection";
import { useHub } from "../context/HubContext";
import "../pages-styling/resources.css";

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Resources() {
  const { resources, groups } = useHub();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = `${resource.title} ${resource.subject} ${resource.uploadedBy}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || resource.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Resources</p>
          <h2>Search notes, links, and PDFs across your study hub.</h2>
          <p>
            Keep revision material attached to the right subject and make it easy
            for classmates to find useful content fast.
          </p>
        </div>
      </section>

      <section className="panel">
        <div className="filter-row">
          <label className="full-width">
            Search
            <input
              type="search"
              placeholder="Accessibility, React, SQL..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <label>
            Type
            <select
              value={filterType}
              onChange={(event) => setFilterType(event.target.value)}
            >
              <option>All</option>
              <option>Link</option>
              <option>PDF</option>
              <option>Note</option>
            </select>
          </label>
        </div>

        <ExpandableCollection
          items={filteredResources}
          className="card-grid"
          emptyMessage="No resources match this search yet."
          renderItem={(resource) => {
            const group = groups.find((item) => item.id === resource.groupId);

            return (
              <article key={resource.id} className="info-card">
                <p className="eyebrow">
                  {resource.type} - {group?.name || "General"}
                </p>
                <h3>{resource.title}</h3>
                <p>{resource.subject}</p>
                <div className="meta-row">
                  <span>By {resource.uploadedBy}</span>
                  <span>{formatDate(resource.createdAt)}</span>
                </div>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noreferrer"
                  className="primary-button full-width"
                >
                  Open resource
                </a>
              </article>
            );
          }}
        />
      </section>
    </div>
  );
}

export default Resources;
