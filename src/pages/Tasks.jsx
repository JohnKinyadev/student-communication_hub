import { useMemo, useState } from "react";
import ExpandableCollection from "../components/ExpandableCollection";
import { useAuth } from "../context/AuthContext";
import { useHub } from "../context/HubContext";
import { getTodayInputValue, isPastDate } from "../utils/date";
import "../pages-styling/tasks.css";

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Tasks() {
  const { currentUser } = useAuth();
  const { tasks, groups, addTask, markTaskComplete, reopenTask } = useHub();
  const [statusFilter, setStatusFilter] = useState("all");
  const [taskError, setTaskError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedGroup: groups[0]?.id || "",
  });
  const today = getTodayInputValue();

  const activeTasks = useMemo(
    () =>
      tasks.filter(
        (task) => task.status !== "done" && !isPastDate(task.dueDate)
      ),
    [tasks]
  );
  const pastTasks = useMemo(
    () =>
      tasks.filter(
        (task) => task.status !== "done" && isPastDate(task.dueDate)
      ),
    [tasks]
  );
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === "done"),
    [tasks]
  );
  const filteredActiveTasks = activeTasks.filter((task) =>
    statusFilter === "all" ? true : task.status === statusFilter
  );

  const canManageTask = (task) => {
    const assignedGroup = groups.find((group) => group.id === task.assignedGroup);
    return currentUser.role === "Admin" || assignedGroup?.leaderId === currentUser.id;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = addTask({ ...formData, user: currentUser });

    if (!result.success) {
      setTaskError(result.message);
      return;
    }

    setTaskError("");
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      assignedGroup: groups[0]?.id || "",
    });
  };

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Tasks & deadlines</p>
          <h2>Track assignments before they become last-minute stress.</h2>
          <p>
            Add due dates, connect them to a study group, and move work from todo
            to done as your team progresses.
          </p>
        </div>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-heading">
            <h3>Add a deadline</h3>
          </div>

          <form className="form-stack" onSubmit={handleSubmit}>
            <label>
              Task title
              <input
                type="text"
                value={formData.title}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    title: event.target.value,
                  }))
                }
                required
              />
            </label>

            <label>
              Description
              <textarea
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
              Due date
              <input
                type="date"
                min={today}
                value={formData.dueDate}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    dueDate: event.target.value,
                  }))
                }
                required
              />
            </label>

            {taskError ? <p className="form-error">{taskError}</p> : null}

            <label>
              Group
              <select
                value={formData.assignedGroup}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    assignedGroup: event.target.value,
                  }))
                }
              >
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </label>

            <button type="submit" className="primary-button full-width">
              Save task
            </button>
          </form>
        </article>

        <div className="panel-stack">
          <article className="panel">
            <div className="panel-heading">
              <h3>Active task board</h3>
              <label>
                Status
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="all">All</option>
                  <option value="todo">Todo</option>
                  <option value="in-progress">In progress</option>
                </select>
              </label>
            </div>

            <ExpandableCollection
              items={filteredActiveTasks}
              className="list-stack"
              emptyMessage="No active tasks match this filter."
              renderItem={(task) => {
                const group = groups.find((item) => item.id === task.assignedGroup);

                return (
                  <div key={task.id} className="list-card">
                    <div>
                      <strong>{task.title}</strong>
                      <p>
                        {group?.name || "No group"} - Due {formatDate(task.dueDate)}
                      </p>
                      <p className="task-description">{task.description || "No description provided."}</p>
                    </div>

                    <div className="button-row">
                      <span className={`status-pill ${task.status}`}>{task.status}</span>
                      {canManageTask(task) ? (
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
                );
              }}
            />
          </article>

          <article className="panel">
            <div className="panel-heading">
              <h3>Past tasks</h3>
            </div>

            <ExpandableCollection
              items={pastTasks}
              className="list-stack"
              emptyMessage="No past tasks yet."
              renderItem={(task) => {
                const group = groups.find((item) => item.id === task.assignedGroup);

                return (
                  <div key={task.id} className="list-card">
                    <div>
                      <strong>{task.title}</strong>
                      <p>
                        {group?.name || "No group"} - Due {formatDate(task.dueDate)}
                      </p>
                      <p className="task-description">{task.description}</p>
                    </div>
                    <div className="button-row">
                      <span className="status-pill overdue">Past due</span>
                      {canManageTask(task) ? (
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
                );
              }}
            />
          </article>

          <article className="panel">
            <div className="panel-heading">
              <h3>Completed tasks</h3>
            </div>

            <ExpandableCollection
              items={completedTasks}
              className="list-stack"
              emptyMessage="No completed tasks yet."
              renderItem={(task) => {
                const group = groups.find((item) => item.id === task.assignedGroup);

                return (
                  <div key={task.id} className="list-card">
                    <div>
                      <strong>{task.title}</strong>
                      <p>
                        {group?.name || "No group"} - Due {formatDate(task.dueDate)}
                      </p>
                      <p className="task-description">{task.description}</p>
                    </div>
                    <div className="button-row">
                      <span className="status-pill done">Completed</span>
                      {canManageTask(task) ? (
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
                );
              }}
            />
          </article>
        </div>
      </section>
    </div>
  );
}

export default Tasks;
