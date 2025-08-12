import { InterviewQuestionsResponse } from '../services/geminiService';

export const sampleQuestions: InterviewQuestionsResponse = {
  beginner: [
    {
      id: 'b1',
      question: 'What is the DOM and how is it manipulated?',
      answer: 'The DOM is a tree-like representation of HTML documents where each element is a node. I manipulate it using JavaScript methods like getElementById, querySelector, and createElement. For example, I can change text content with innerHTML, add event listeners, or dynamically create new elements and append them to the page.',
      category: 'beginner',
      field: 'Information Technology',
      subfield: 'Frontend Developer'
    },
    {
      id: 'b2',
      question: 'Explain the difference between HTML, CSS, and JavaScript.',
      answer: 'HTML creates the structure and content of a webpage - like the foundation and walls of a house. CSS handles all the styling, colors, and layout - like the paint and furniture. JavaScript adds interactivity and dynamic behavior - like the electricity and plumbing that makes everything functional.',
      category: 'beginner',
      field: 'Information Technology',
      subfield: 'Frontend Developer'
    },
    {
      id: 'b3',
      question: 'What are semantic HTML tags and why are they important?',
      answer: 'Semantic tags like <header>, <nav>, <main>, <section>, <article>, and <footer> give meaning to content structure. They help screen readers understand the page layout, improve SEO by clearly indicating content purpose, and make code more readable for other developers.',
      category: 'beginner',
      field: 'Information Technology',
      subfield: 'Frontend Developer'
    },
    {
      id: 'b4',
      question: 'Describe the box model in CSS.',
      answer: 'The CSS box model has four parts: content (the actual content), padding (space inside the border), border (the line around the element), and margin (space outside the border). I use this to control spacing and layout precisely, often setting box-sizing to border-box for easier calculations.',
      category: 'beginner',
      field: 'Information Technology',
      subfield: 'Frontend Developer'
    },
    {
      id: 'b5',
      question: 'What are inline, block, and inline-block elements?',
      answer: 'Inline elements like <span> flow with text and don\'t create line breaks. Block elements like <div> take full width and create line breaks. Inline-block elements flow with text but can have width and height set, like <img> tags.',
      category: 'beginner',
      field: 'Information Technology',
      subfield: 'Frontend Developer'
    },
    {
      id: 'b6',
      question: 'Explain the difference between == and === in JavaScript.',
      answer: '== performs type coercion, converting types before comparison, while === checks both value and type without conversion. I always use === because it\'s more predictable and prevents bugs from unexpected type conversions.',
      category: 'beginner',
      field: 'Information Technology',
      subfield: 'Frontend Developer'
    },
    {
      id: 'b7',
      question: 'What is event handling in JavaScript?',
      answer: 'Event handling is responding to user interactions like clicks, key presses, or form submissions. I use addEventListener to attach functions to events, and I can remove listeners when they\'re no longer needed to prevent memory leaks.',
      category: 'beginner',
      field: 'Information Technology',
      subfield: 'Frontend Developer'
    },
    {
      id: 'b8',
      question: 'What is responsive design?',
      answer: 'Responsive design makes websites work well on all devices by using flexible grids, relative units, and CSS media queries. I start with mobile-first design, use percentages and rem units instead of fixed pixels, and test across different screen sizes.',
      category: 'beginner',
      field: 'Information Technology',
      subfield: 'Frontend Developer'
    }
  ],
  intermediate: [
    {
      id: 'i1',
      question: 'Explain closures in JavaScript.',
      answer: 'A closure is a function that remembers and accesses variables from its outer scope even after the outer function has finished executing. I use them to create private variables and maintain state in functions. For example, I can create a counter function that keeps track of its count between calls.',
      category: 'intermediate',
      field: 'Information Technology',
      subfield: 'Frontend Developer'
    },
    {
      id: 'i2',
      question: 'What is the event loop in JavaScript?',
      answer: 'The event loop is what allows JavaScript to handle asynchronous operations despite being single-threaded. It continuously checks if the call stack is empty and then moves callbacks from the task queue to the stack. This is why setTimeout and promises work without blocking the main thread.',
      category: 'intermediate',
      field: 'Information Technology',
      subfield: 'Frontend Developer'
    },
    {
      id: 'i3',
      question: 'Explain CSS Grid vs Flexbox.',
      answer: 'CSS Grid is for two-dimensional layouts with rows and columns, perfect for overall page structure. Flexbox is for one-dimensional layouts, either rows or columns, great for component layouts. I use Grid for page layouts and Flexbox for navigation bars, card layouts, and component alignment.',
      category: 'intermediate',
      field: 'Information Technology',
      subfield: 'Frontend Developer'
    },
         {
       id: 'i4',
       question: 'What are JavaScript Promises?',
       answer: 'Promises are objects representing the eventual completion or failure of an asynchronous operation. I use them to handle async operations like API calls and file operations. They provide a cleaner alternative to callback-based code and help avoid callback hell by using .then() and .catch() methods.',
       category: 'intermediate',
       field: 'Information Technology',
       subfield: 'Frontend Developer'
     },
         {
       id: 'i5',
       question: 'Explain CSS specificity.',
       answer: 'CSS specificity determines which CSS rules are applied when multiple rules target the same element. I calculate it by counting ID selectors (highest priority), class selectors, and element selectors. This helps me avoid conflicts and debug styling issues by understanding which rules will take precedence.',
       category: 'intermediate',
       field: 'Information Technology',
       subfield: 'Frontend Developer'
     },
         {
       id: 'i6',
       question: 'What is the Virtual DOM?',
       answer: 'The Virtual DOM is a lightweight copy of the actual DOM that React uses to optimize rendering. I understand it as React\'s way of batching DOM updates by comparing the Virtual DOM with the real DOM and only applying the necessary changes. This significantly improves performance by minimizing expensive DOM manipulations.',
       category: 'intermediate',
       field: 'Information Technology',
       subfield: 'Frontend Developer'
     },
         {
       id: 'i7',
       question: 'Explain CORS (Cross-Origin Resource Sharing).',
       answer: 'CORS is a security feature that controls which web pages can access resources from a different origin. I implement it on the server side by setting appropriate headers like Access-Control-Allow-Origin. It prevents malicious websites from making unauthorized requests to other domains and is essential for building secure web applications.',
       category: 'intermediate',
       field: 'Information Technology',
       subfield: 'Frontend Developer'
     },
     {
       id: 'i8',
       question: 'What is the difference between let, const, and var?',
       answer: 'var has function scope and is hoisted, let has block scope and is not hoisted, and const has block scope, is not hoisted, and cannot be reassigned. I use const by default for values that won\'t change, let when I need to reassign variables, and avoid var entirely in modern JavaScript to prevent scope-related bugs.',
       category: 'intermediate',
       field: 'Information Technology',
       subfield: 'Frontend Developer'
     }
  ],
  expert: [
         {
       id: 'e1',
       question: 'Explain the concept of progressive enhancement.',
       answer: 'Progressive enhancement is a design philosophy that starts with a basic, functional experience and progressively adds advanced features for users with more capable browsers or devices. I implement this by building a solid HTML foundation first, then layering CSS for presentation, and finally adding JavaScript enhancements. This ensures my applications work for everyone, regardless of their technology constraints.',
       category: 'expert',
       field: 'Information Technology',
       subfield: 'Frontend Developer'
     },
         {
       id: 'e2',
       question: 'How would you implement a custom hook for form validation in React?',
       answer: 'I would create a custom hook that manages form state, validation rules, and error messages using useState for form data and useEffect for validation. The hook would return the form state, validation functions, and error handling, making it reusable across different forms. I\'d also implement debounced validation for performance and consider using a reducer for complex state management.',
       category: 'expert',
       field: 'Information Technology',
       subfield: 'Frontend Developer'
     },
     {
       id: 'e3',
       question: 'Explain the concept of code splitting and lazy loading.',
       answer: 'Code splitting divides your bundle into smaller chunks that can be loaded on demand, while lazy loading defers the loading of non-critical resources until they\'re needed. I implement this using React.lazy() for component-level splitting and route-based splitting for different pages. This significantly improves initial page load performance by reducing the initial bundle size.',
       category: 'expert',
       field: 'Information Technology',
       subfield: 'Frontend Developer'
     },
     {
       id: 'e4',
       question: 'How would you implement a custom state management solution?',
       answer: 'I would create a centralized store using Context API or a custom event system with actions, reducers, and middleware for handling complex state updates. I\'d implement immutability patterns and performance optimizations like selective re-rendering. For complex state relationships, I might use a pub/sub pattern and consider using immer for immutable updates.',
       category: 'expert',
       field: 'Information Technology',
       subfield: 'Frontend Developer'
     },
     {
       id: 'e5',
       question: 'Explain the concept of micro-frontends.',
       answer: 'Micro-frontends is an architectural style where frontend applications are composed of independent, deployable micro-applications. I implement this using Module Federation for sharing dependencies and ensure a consistent design system across micro-apps. Each team can work independently on different parts while maintaining shared authentication and user context.',
       category: 'expert',
       field: 'Information Technology',
       subfield: 'Frontend Developer'
     },
     {
       id: 'e6',
       question: 'How would you optimize a React application for performance?',
       answer: 'I use React.memo, useMemo, and useCallback to prevent unnecessary re-renders and implement virtualization for long lists. I also use code splitting with React.lazy(), optimize bundle size, and implement proper key props for lists. I profile the application with React DevTools Profiler to identify bottlenecks and implement windowing for large datasets.',
       category: 'expert',
       field: 'Information Technology',
       subfield: 'Frontend Developer'
     },
     {
       id: 'e7',
       question: 'Explain the concept of accessibility (a11y) in web development.',
       answer: 'Accessibility ensures that web applications are usable by people with disabilities through proper semantic HTML, ARIA labels, keyboard navigation, screen reader support, and color contrast compliance. I implement this by using semantic HTML elements, proper ARIA labels and roles, ensuring keyboard navigation works for all interactive elements, and testing with screen readers and keyboard-only navigation while following WCAG guidelines.',
       category: 'expert',
       field: 'Information Technology',
       subfield: 'Frontend Developer'
     },
     {
       id: 'e8',
       question: 'How would you implement a design system?',
       answer: 'I would create a component library with consistent design tokens for colors, typography, and spacing, along with reusable components, comprehensive documentation, and versioning. I\'d use Storybook for component development and testing, implement CSS custom properties for theming, and create component variants and states. The goal is to ensure consistency and accelerate development across teams.',
       category: 'expert',
       field: 'Information Technology',
       subfield: 'Frontend Developer'
     }
  ]
};

export default sampleQuestions;
