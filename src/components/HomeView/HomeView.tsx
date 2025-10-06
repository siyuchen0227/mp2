import React from "react";
import './HomeView.css';

const HomeView = () => {
     const references = [
    // API
    {
      name: "The Meal DB API",
      url: "https://www.themealdb.com/api.php",
      category: "API"
    },
    
    // Frameworks and Libraries
    {
      name: "React Official Documentation",
      url: "https://reactjs.org/docs/getting-started.html",
      category: "Framework"
    },
    {
      name: "React Router",
      url: "https://reactrouter.com/en/main",
      category: "Library"
    },
    {
      name: "TypeScript Documentation",
      url: "https://www.typescriptlang.org/docs/",
      category: "Language"
    },
    {
      name: "Axios Documentation",
      url: "https://axios-http.com/docs/intro",
      category: "Library"
    },
    
    // Tutorial Websites
    {
      name: "freeCodeCamp",
      url: "https://www.freecodecamp.org/",
      category: "Tutorial"
    },
    
    {
      name: "The Net Ninja",
      url: "https://www.youtube.com/c/TheNetNinja",
      category: "Tutorial"
    },
    {
      name: "Traversy Media",
      url: "https://www.youtube.com/c/TraversyMedia",
      category: "Tutorial"
    },
    {
      name: "React TypeScript Cheatsheet",
      url: "https://react-typescript-cheatsheet.netlify.app/",
      category: "Reference"
    },
    
    // CSS and Design
    {
      name: "CSS Grid Layout - MDN",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout",
      category: "CSS"
    },
    {
      name: "Flexbox Layout - MDN",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout",
      category: "CSS"
    },
    {
      name: "Responsive Design - MDN",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries",
      category: "CSS"
    },
    {
      name: "CSS-Tricks",
      url: "https://css-tricks.com/",
      category: "CSS"
    },
    
    // Development Tools
    {
      name: "Create React App",
      url: "https://create-react-app.dev/",
      category: "Tool"
    },
    
    // Best Practices
    {
      name: "Thinking in React",
      url: "https://reactjs.org/docs/thinking-in-react.html",
      category: "Best Practice"
    }
  ];
  return <div className="home-view">
      <h1>Project References</h1>
      <p className="intro">
        This project was developed with reference to the following resources. 
      </p>
      
      {references.map((ref, index) => (
        <div key={index} className="reference-card">
          <a 
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            className="reference-link"
          >
            <span className="reference-name">{ref.name}</span>
            <span className="reference-category">{ref.category}</span>
            <span className="reference-url">{new URL(ref.url).hostname}</span>
          </a>
        </div>
      ))}
  </div>;
};
export default HomeView;