import React from 'react';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="highlight">GPT Production</span>
            </h1>
            <p className="hero-subtitle">
              Your AI-Powered Journey Starts Here
            </p>
            <p className="hero-description">
              Experience the future of AI-driven conversations and insights
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary">Get Started</button>
              <button className="btn btn-secondary">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose GPT Production?</h2>
            <p className="section-subtitle">
              Discover the power of next-generation AI technology
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3 className="feature-title">Smart Conversations</h3>
              <p className="feature-description">
                Engage with AI-powered chat that understands context and provides intelligent responses
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Vector Search</h3>
              <p className="feature-description">
                Find relevant information quickly with advanced semantic search capabilities
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Real-time Updates</h3>
              <p className="feature-description">
                Get instant responses and live updates for seamless user experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to get started?</h2>
            <p className="cta-description">
              Join thousands of users already experiencing the future of AI
            </p>
            <div className="cta-actions">
              <button className="btn btn-primary btn-large">Get Started Now</button>
              <button className="btn btn-outline btn-large">View Demo</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
