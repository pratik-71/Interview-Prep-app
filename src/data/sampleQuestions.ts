import { InterviewQuestionsResponse } from '../services/geminiService';

export const sampleQuestions: InterviewQuestionsResponse = {
  beginner: [
    {
      id: 'b1',
      question: 'What is the DOM and how is it manipulated?',
      answer: 'The DOM (Document Object Model) is a programming interface for HTML and XML documents. It represents the page as a tree structure where each node represents an object. The DOM can be manipulated using JavaScript to dynamically change the content, structure, and styling of a webpage.',
      category: 'beginner',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'The DOM provides a way to interact with HTML elements as objects, allowing developers to create dynamic and interactive web applications.',
      tips: [
        'Use getElementById() for single elements',
        'Use querySelector() for CSS selector-based selection',
        'Always check if elements exist before manipulating them'
      ]
    },
    {
      id: 'b2',
      question: 'Explain the difference between HTML, CSS, and JavaScript.',
      answer: 'HTML provides the structure and content of a webpage, CSS handles the styling and layout, and JavaScript adds interactivity and dynamic behavior. HTML is like the skeleton, CSS is like the skin and clothes, and JavaScript is like the muscles that make everything move.',
      category: 'beginner',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'These three technologies work together to create modern, interactive web applications.',
      tips: [
        'HTML should focus on semantic structure',
        'CSS should handle all visual presentation',
        'JavaScript should enhance user experience without breaking functionality'
      ]
    },
    {
      id: 'b3',
      question: 'What are semantic HTML tags and why are they important?',
      answer: 'Semantic HTML tags like <header>, <nav>, <main>, <section>, <article>, and <footer> provide meaning to the content structure. They improve accessibility, SEO, and code readability by clearly indicating the purpose of each content section.',
      category: 'beginner',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'Semantic tags help screen readers and search engines understand your content better.',
      tips: [
        'Use <nav> for navigation menus',
        'Use <main> for the primary content area',
        'Use <article> for self-contained content pieces'
      ]
    },
    {
      id: 'b4',
      question: 'Describe the box model in CSS.',
      answer: 'The CSS box model consists of content, padding, border, and margin. Content is the actual content area, padding is the space between content and border, border is the line around the element, and margin is the space outside the border.',
      category: 'beginner',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'Understanding the box model is crucial for precise layout control in CSS.',
      tips: [
        'Use box-sizing: border-box for easier sizing calculations',
        'Remember that margins can collapse between adjacent elements',
        'Padding and borders are included in the element\'s total width/height'
      ]
    },
    {
      id: 'b5',
      question: 'What are inline, block, and inline-block elements?',
      answer: 'Inline elements flow with text and don\'t create line breaks (like <span>), block elements create line breaks and take full width (like <div>), and inline-block elements flow with text but can have width/height set (like <img>).',
      category: 'beginner',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'Understanding display properties helps control how elements flow and interact in the layout.',
      tips: [
        'Use inline for text-level elements',
        'Use block for container elements',
        'Use inline-block for elements that need both flow and sizing control'
      ]
    },
    {
      id: 'b6',
      question: 'Explain the difference between == and === in JavaScript.',
      answer: '== performs type coercion (converts types before comparison), while === performs strict equality (checks both value and type). === is generally preferred as it\'s more predictable and prevents unexpected type conversions.',
      category: 'beginner',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'Type coercion can lead to unexpected results, making === the safer choice.',
      tips: [
        'Always use === unless you specifically need type coercion',
        'Be careful with null and undefined comparisons',
        'Remember that 0 == false is true, but 0 === false is false'
      ]
    },
    {
      id: 'b7',
      question: 'What is event handling in JavaScript?',
      answer: 'Event handling is the process of responding to user interactions like clicks, key presses, or form submissions. JavaScript uses event listeners to detect these actions and execute code in response.',
      category: 'beginner',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'Event handling is fundamental to creating interactive web applications.',
      tips: [
        'Use addEventListener() instead of inline event handlers',
        'Remember to remove event listeners when they\'re no longer needed',
        'Use event delegation for dynamically created elements'
      ]
    },
    {
      id: 'b8',
      question: 'What is responsive design?',
      answer: 'Responsive design is an approach to web design that makes web pages render well on a variety of devices and window or screen sizes. It uses flexible grids, layouts, images, and CSS media queries to adapt the layout to different screen sizes.',
      category: 'beginner',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'Responsive design ensures a good user experience across all devices.',
      tips: [
        'Start with mobile-first design approach',
        'Use relative units (%, em, rem) instead of fixed pixels',
        'Test on multiple devices and screen sizes'
      ]
    }
  ],
  intermediate: [
    {
      id: 'i1',
      question: 'Explain closures in JavaScript.',
      answer: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. It creates a private scope for variables and maintains access to them.',
      category: 'intermediate',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'Closures are powerful for data privacy and creating factory functions.',
      tips: [
        'Closures can lead to memory leaks if not handled carefully',
        'Use closures to create private variables',
        'Be aware of the closure scope chain'
      ]
    },
    {
      id: 'i2',
      question: 'What is the event loop in JavaScript?',
      answer: 'The event loop is a mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. It continuously checks the call stack and callback queue, pushing callbacks to the stack when it\'s empty.',
      category: 'intermediate',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'Understanding the event loop is crucial for asynchronous programming.',
      tips: [
        'setTimeout(0) doesn\'t execute immediately',
        'Promises have higher priority than setTimeout',
        'The event loop processes microtasks before macrotasks'
      ]
    },
    {
      id: 'i3',
      question: 'Explain CSS Grid vs Flexbox.',
      answer: 'CSS Grid is a two-dimensional layout system for rows and columns, while Flexbox is a one-dimensional layout system for either rows or columns. Grid is better for overall page layouts, while Flexbox is better for component layouts.',
      category: 'intermediate',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'Choose the right tool based on your layout needs.',
      tips: [
        'Use Grid for page-level layouts',
        'Use Flexbox for component-level layouts',
        'You can combine both for complex layouts'
      ]
    },
    {
      id: 'i4',
      question: 'What are JavaScript Promises?',
      answer: 'Promises are objects representing the eventual completion or failure of an asynchronous operation. They provide a cleaner alternative to callback-based asynchronous code and help avoid callback hell.',
      category: 'intermediate',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'Promises make asynchronous code more readable and manageable.',
      tips: [
        'Always handle promise rejections',
        'Use async/await for cleaner promise syntax',
        'Promise.all() waits for all promises to resolve'
      ]
    },
    {
      id: 'i5',
      question: 'Explain CSS specificity.',
      answer: 'CSS specificity determines which CSS rules are applied when multiple rules target the same element. It\'s calculated based on the number of ID selectors, class selectors, and element selectors.',
      category: 'intermediate',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'Understanding specificity helps avoid CSS conflicts and debugging issues.',
      tips: [
        'ID selectors have highest specificity',
        'Use !important sparingly',
        'Inline styles have higher specificity than external CSS'
      ]
    },
    {
      id: 'i6',
      question: 'What is the Virtual DOM?',
      answer: 'The Virtual DOM is a lightweight copy of the actual DOM that React uses to optimize rendering. It allows React to batch DOM updates and only apply the necessary changes, improving performance.',
      category: 'intermediate',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'The Virtual DOM is key to React\'s performance optimization.',
      tips: [
        'React compares Virtual DOM with real DOM',
        'Only changed elements are re-rendered',
        'Keys help React identify which items have changed'
      ]
    },
    {
      id: 'i7',
      question: 'Explain CORS (Cross-Origin Resource Sharing).',
      answer: 'CORS is a security feature that controls which web pages can access resources from a different origin. It prevents malicious websites from making requests to other domains on behalf of users.',
      category: 'intermediate',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'CORS is essential for secure web applications.',
      tips: [
        'CORS is enforced by browsers, not servers',
        'Preflight requests are sent for complex requests',
        'Credentials require specific CORS configuration'
      ]
    },
    {
      id: 'i8',
      question: 'What is the difference between let, const, and var?',
      answer: 'var has function scope and is hoisted, let has block scope and is not hoisted, and const has block scope, is not hoisted, and cannot be reassigned. let and const are preferred in modern JavaScript.',
      category: 'intermediate',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'Understanding scope and hoisting is crucial for avoiding bugs.',
      tips: [
        'Use const by default',
        'Use let when you need to reassign variables',
        'Avoid var in modern JavaScript'
      ]
    }
  ],
  expert: [
    {
      id: 'e1',
      question: 'Explain the concept of progressive enhancement.',
      answer: 'Progressive enhancement is a design philosophy that starts with a basic, functional experience and progressively adds advanced features for users with more capable browsers or devices. It ensures accessibility and functionality for all users.',
      category: 'expert',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'This approach ensures your application works for everyone, regardless of their technology constraints.',
      tips: [
        'Start with semantic HTML as the foundation',
        'Add CSS for presentation and layout',
        'Enhance with JavaScript for interactivity',
        'Test with JavaScript disabled'
      ]
    },
    {
      id: 'e2',
      question: 'How would you implement a custom hook for form validation in React?',
      answer: 'Create a custom hook that manages form state, validation rules, and error messages. Use useState for form data, useEffect for validation, and return the form state, validation functions, and error handling.',
      category: 'expert',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'Custom hooks promote code reusability and separation of concerns.',
      tips: [
        'Use a reducer for complex form state management',
        'Implement debounced validation for performance',
        'Return a validation function that can be called on submit',
        'Consider using a validation library like Yup or Joi'
      ]
    },
    {
      id: 'e3',
      question: 'Explain the concept of code splitting and lazy loading.',
      answer: 'Code splitting divides your bundle into smaller chunks that can be loaded on demand. Lazy loading defers the loading of non-critical resources until they\'re needed, improving initial page load performance.',
      category: 'expert',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'These techniques are essential for optimizing large applications.',
      tips: [
        'Use React.lazy() for component-level code splitting',
        'Implement route-based code splitting',
        'Monitor bundle sizes with webpack-bundle-analyzer',
        'Consider the trade-off between bundle size and network requests'
      ]
    },
    {
      id: 'e4',
      question: 'How would you implement a custom state management solution?',
      answer: 'Create a centralized store using Context API or a custom event system. Implement actions, reducers, and middleware for handling complex state updates. Consider immutability and performance optimization.',
      category: 'expert',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'Custom state management gives you full control over your application\'s data flow.',
      tips: [
        'Use immer for immutable updates',
        'Implement middleware for logging and debugging',
        'Consider using a pub/sub pattern for complex state relationships',
        'Plan your state structure carefully to avoid unnecessary re-renders'
      ]
    },
    {
      id: 'e5',
      question: 'Explain the concept of micro-frontends.',
      answer: 'Micro-frontends is an architectural style where frontend applications are composed of independent, deployable micro-applications. Each team can work independently on different parts of the application.',
      category: 'expert',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'This approach scales development teams and enables independent deployments.',
      tips: [
        'Use Module Federation for sharing dependencies',
        'Implement a consistent design system across micro-apps',
        'Consider routing and state management strategies',
        'Plan for shared authentication and user context'
      ]
    },
    {
      id: 'e6',
      question: 'How would you optimize a React application for performance?',
      answer: 'Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders. Implement virtualization for long lists, use code splitting, optimize bundle size, and implement proper key props for lists.',
      category: 'expert',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'Performance optimization is crucial for user experience and business metrics.',
      tips: [
        'Profile your application with React DevTools Profiler',
        'Use React.lazy() for component-level code splitting',
        'Implement windowing for large datasets',
        'Consider using a state management library like Zustand or Redux Toolkit'
      ]
    },
    {
      id: 'e7',
      question: 'Explain the concept of accessibility (a11y) in web development.',
      answer: 'Accessibility ensures that web applications are usable by people with disabilities. This includes proper semantic HTML, ARIA labels, keyboard navigation, screen reader support, and color contrast compliance.',
      category: 'expert',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'Accessibility is not just a legal requirement but also improves usability for all users.',
      tips: [
        'Use semantic HTML elements',
        'Implement proper ARIA labels and roles',
        'Ensure keyboard navigation works for all interactive elements',
        'Test with screen readers and keyboard-only navigation',
        'Follow WCAG guidelines for compliance'
      ]
    },
    {
      id: 'e8',
      question: 'How would you implement a design system?',
      answer: 'Create a component library with consistent design tokens (colors, typography, spacing), reusable components, documentation, and versioning. Use Storybook for component development and testing, and implement a design token system.',
      category: 'expert',
      field: 'Information Technology',
      subfield: 'Frontend Developer',
      explanation: 'A design system ensures consistency and accelerates development across teams.',
      tips: [
        'Start with design tokens (colors, typography, spacing)',
        'Use CSS custom properties for theming',
        'Implement component variants and states',
        'Create comprehensive documentation and examples',
        'Consider using tools like Storybook or Chromatic'
      ]
    }
  ]
};

export default sampleQuestions;
