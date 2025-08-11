# React TypeScript Tailwind CSS App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) using the TypeScript template and configured with Tailwind CSS and Zustand for state management.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Technologies Used

- **React 18** - A JavaScript library for building user interfaces
- **TypeScript** - Typed JavaScript for better development experience
- **Tailwind CSS** - A utility-first CSS framework for rapid UI development
- **Zustand** - A small, fast and scalable state management solution
- **Create React App** - Toolchain for React application development

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── App.tsx          # Main application component
│   ├── index.tsx        # Application entry point
│   ├── index.css        # Global styles with Tailwind directives
│   ├── store/
│   │   └── useStore.ts  # Zustand store configuration
│   └── components/
│       └── Counter.tsx  # Example component using Zustand
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## Tailwind CSS Configuration

The project is configured with Tailwind CSS for styling. The configuration includes:

- Content paths for React components (`./src/**/*.{js,jsx,ts,tsx}`)
- PostCSS processing for Tailwind and Autoprefixer
- Utility-first CSS classes for rapid development

## Zustand State Management

This project uses Zustand for state management. Here's how it's set up:

### Store Configuration (`src/store/useStore.ts`)

```typescript
import { create } from 'zustand'

interface AppState {
  count: number
  name: string
  increment: () => void
  decrement: () => void
  setName: (name: string) => void
  reset: () => void
}

export const useStore = create<AppState>((set) => ({
  count: 0,
  name: 'React + TypeScript + Tailwind + Zustand',
  
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setName: (name: string) => set({ name }),
  reset: () => set({ count: 0, name: 'React + TypeScript + Tailwind + Zustand' }),
}))
```

### Using the Store in Components

```typescript
import { useStore } from './store/useStore';

function MyComponent() {
  const { count, increment, decrement } = useStore();
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

### Key Features of Zustand

- **Lightweight** - No providers or complex setup
- **TypeScript Support** - Full type safety
- **Shared State** - Multiple components can access the same state
- **Simple API** - Easy to learn and use
- **Performance** - Only re-renders components that use changed state

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

To learn Tailwind CSS, visit the [Tailwind CSS documentation](https://tailwindcss.com/docs).

To learn TypeScript, check out the [TypeScript documentation](https://www.typescriptlang.org/docs/).

To learn Zustand, visit the [Zustand documentation](https://github.com/pmndrs/zustand).
