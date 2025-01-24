import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-purple-50 text-gray-800">
      {/* Hero Section */}
      <header className="bg-purple-950 text-white py-10">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-5xl font-extrabold mb-4 animate-bounce">
            JSON Schema Builder
          </h1>
          <p className="text-lg max-w-2xl mx-auto">
            A UI for JSON Schema Building makes schema creation faster, more
            accurate, and accessible to everyone, improving collaboration,
            reducing errors, and streamlining integration with tools like AJV.
            It transforms a tedious, error-prone task into an intuitive and
            efficient process.
          </p>
        </div>
      </header>

      <section className="flex items-center justify-center bg-purple-50 mt-8">
        <div className="text-center mb-8">
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-transform transform hover:-translate-y-2">
            <h3 className="text-2xl font-bold text-purple-700 mb-2">
              Schema Builder
            </h3>
            <p className="text-gray-600 mb-4">
              Simple UI to create AJV JSON Schema
            </p>
            <Link
              to="/app"
              className="bg-purple-950 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition"
            >
              Try Now
            </Link>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="container mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-purple-700 mb-2">
            Connect with Me
          </h2>
          <p className="text-gray-600">
            Discover my work and stay connected on popular platforms.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Medium Card */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-transform transform hover:-translate-y-2">
            <h3 className="text-2xl font-bold text-purple-700 mb-2">Medium</h3>
            <p className="text-gray-600 mb-4">
              Read our blogs and articles on Medium.
            </p>
            <a
              href="https://medium.com/@santosh-shinde"
              className="bg-purple-950 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition"
            >
              Visit Medium
            </a>
          </div>

          {/* GitHub Card */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-transform transform hover:-translate-y-2">
            <h3 className="text-2xl font-bold text-purple-700 mb-2">GitHub</h3>
            <p className="text-gray-600 mb-4">
              Explore our open-source projects.
            </p>
            <a
              href="https://github.com/santoshshinde2012"
              className="bg-purple-950 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition"
            >
              Visit GitHub
            </a>
          </div>

          {/* LinkedIn Card */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-transform transform hover:-translate-y-2">
            <h3 className="text-2xl font-bold text-purple-700 mb-2">
              LinkedIn
            </h3>
            <p className="text-gray-600 mb-4">
              Connect with us professionally on LinkedIn.
            </p>
            <a
              href="https://www.linkedin.com/in/shindesantosh/"
              className="bg-purple-950 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition"
            >
              Visit LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* More Descriptions */}
      <section className="bg-purple-100 py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-purple-700 mb-4">About me</h2>
          <h2 className="text-4xl text-center mb-2">
            Hi 👋, I'm Santosh Shinde
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            As a seasoned full-stack engineer, I am committed to creating
            technology-driven solutions that tackle intricate problems. I have
            honed my skills in various aspects of software development, and I
            take pride in contributing to the tech community by sharing my work
            and assisting others. Currently, I'm actively involved in various
            open-source projects, where I collaborate with other developers to
            build and improve tools that make a difference. In addition, I'm
            working on a new project aimed at helping the technical community
            get started with their own ventures. My goal is to provide
            resources, guidance, and support to enable others to kickstart their
            projects with confidence. Passionate about continuous learning and
            technological innovation, I consistently seek opportunities to
            broaden my expertise and devise creative solutions. I actively share
            my insights and experiences through my blog, as well as contribute
            to open-source projects. I believe in the power of community and
            open-source collaboration, and I'm always eager to connect with
            like-minded individuals. Let's build something amazing together!
          </p>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="container mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-purple-700 mb-2">
            Technology Stack
          </h2>
          <p className="text-gray-600">
            Built with state-of-the-art tools to ensure reliability and
            performance.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8"></div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-950 text-white py-4 text-center">
        <p>&copy; 2025. Made with passion by santoshshinde.com</p>
      </footer>
    </div>
  );
};

export default HomePage;
