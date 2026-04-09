import { useEffect, useState } from "react";

function ExpandableCollection({
  items,
  renderItem,
  className,
  emptyMessage,
  limit = 3,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [items.length]);

  const visibleItems = isExpanded ? items : items.slice(0, limit);

  return (
    <div className="expandable-section">
      <div className={className}>
        {visibleItems.length > 0 ? (
          visibleItems.map((item, index) => renderItem(item, index))
        ) : (
          <p className="empty-state">{emptyMessage}</p>
        )}
      </div>

      {items.length > limit ? (
        <button
          type="button"
          className="ghost-button see-more-button"
          onClick={() => setIsExpanded((previous) => !previous)}
        >
          {isExpanded ? "See less" : "See more"}
        </button>
      ) : null}
    </div>
  );
}

export default ExpandableCollection;
