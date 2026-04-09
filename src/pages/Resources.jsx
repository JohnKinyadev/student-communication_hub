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
    const matchesSearch = `${resource.title} ${resource.subject} ${resource.uploadedBy} ${
      resource.content || ""
    }`
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
          <h2>Search notes, media, links, and PDFs across your study hub.</h2>
          <p>
            Keep revision material, pictures, short videos, and study notes
            attached to the right subject so classmates can find useful content fast.
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
              <option>Image</option>
              <option>Video</option>
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
                {resource.type === "Note" && resource.content ? (
                  <p className="resource-note-preview">{resource.content}</p>
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
                {resource.link ? (
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noreferrer"
                    className="primary-button full-width"
                  >
                    Open resource
                  </a>
                ) : resource.fileName ? (
                  <span className="resource-file-name">{resource.fileName}</span>
                ) : (
                  <span className="status-pill done">Saved note</span>
                )}
              </article>
            );
          }}
        />
      </section>
    </div>
  );
}

export default Resources;
