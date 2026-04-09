import { Link } from "react-router-dom";
import "../pages-styling/landing.css";

function Landing() {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-copy fade-up">
          <p className="eyebrow">Capstone-ready React project</p>
          <h1>One workspace for study groups, shared notes, and deadlines.</h1>
          <p className="hero-text">
            Student Collaboration Hub brings scattered class coordination into
            one dashboard so teams can discuss, share, and actually stay on
            schedule.
          </p>
        

          <div className="hero-actions">
            <Link to="/register" className="primary-button">
              Start the Project
            </Link>
            <Link to="/login" className="secondary-button">
              Use Demo Login
            </Link>
          </div>
        </div>

        <div className="hero-panel fade-up delay-1">
          <div className="hero-card">
            <span>Active groups</span>
            <strong>Frontend, DB, UI</strong>
            <p>Organize discussions around real classes instead of random chats.</p>
          </div>

          <div className="hero-illustration">
            <div className="book-scene">
              <div className="book-glow"></div>
              <div className="book-base"></div>
              <div className="open-book">
                <div className="book-page page-left">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="book-spine"></div>
                <div className="book-page page-right">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="pen">
                <div className="pen-cap"></div>
                <div className="pen-body"></div>
                <div className="pen-tip"></div>
              </div>
              <div className="spark spark-one"></div>
              <div className="spark spark-two"></div>
              <div className="spark spark-three"></div>
              <div className="hero-illustration-title">
                <span>Student's</span>
                <span>Communication</span>
                <span>Hub</span>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <span>Shared resources</span>
            <strong>Notes, links, PDFs</strong>
            <p>Keep revision material searchable and attached to the right group.</p>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="section-heading">
          <p className="eyebrow">Why it works</p>
          <h2>A realistic app story with features your team can actually ship.</h2>
        </div>

        <div className="feature-grid">
          <article className="info-card">
            <h3>Create and join study groups for each subject</h3>
            <p>
              Enables students to form focused class communities and work
              together in a more organized way.
            </p>
          </article>

          <article className="info-card">
            <h3>Share links, notes, and revision resources in one place</h3>
            <p>
              Enables students to keep all their study materials organized and
              easily accessible without digging through scattered messages.
            </p>
          </article>

          <article className="info-card">
            <h3>Post questions and keep discussion attached to the right group</h3>
            <p>
              Enables students to ask questions and have discussions organized around the right class and group, instead of lost in random chats.
            </p>
          </article>

          <article className="info-card">
            <h3>Track assignments, deadlines, and team progress</h3>
            <p>
              Enables students to stay on top of their work and coordinate with their team without the chaos of scattered messages and lost links.
            </p>
          </article>

          <article className="info-card">
            <h3>Reduce the chaos of scattered messages and lost links</h3>
              <p>
              Enables students to keep all their study coordination organized and attached to the right class and group, instead of lost in random chats.
              </p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Landing;
