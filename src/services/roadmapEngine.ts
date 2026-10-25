import type { SkillRoadmap, MissingSkill } from '../types';

const ROADMAP_DATABASE: Record<string, SkillRoadmap> = {
  TypeScript: {
    skillName: 'TypeScript',
    category: 'Languages',
    learn: {
      coreConcepts: [
        'Interfaces vs Type Aliases & Intersection Types',
        'Generics, Constraints & Utility Types (Partial, Pick, Record, Omit)',
        'Strict Null Checks & Narrowing (type guards, discriminated unions)',
        'TypeScript compiler configuration (`tsconfig.json` best practices)',
      ],
      resources: [
        {
          title: 'TypeScript Handbook: The Basics & Everyday Types',
          type: 'documentation',
          url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html',
          timeEstimate: '3 hours',
          provider: 'Official TypeScript Documentation',
        },
        {
          title: 'Total TypeScript Beginner Tutorials',
          type: 'interactive',
          url: 'https://www.totaltypescript.com/tutorials',
          timeEstimate: '4 hours',
          provider: 'Total TypeScript (Matt Pocock)',
        },
        {
          title: 'freeCodeCamp TypeScript Full Guide',
          type: 'free_course',
          url: 'https://www.freecodecamp.org/news/learn-typescript-beginners-guide/',
          timeEstimate: '5 hours',
          provider: 'freeCodeCamp',
        },
      ],
    },
    build: {
      projectTitle: 'Type-Safe Task & Budget Board with Local Persistence',
      projectDescription: 'Build an end-to-end type-safe Kanban and expense tracking SPA with strict interfaces, custom generic hooks, and zero `any` types.',
      deliverables: [
        'Custom generic `useLocalStorage<T>` hook with error boundary validation',
        'Discriminated union state machine for task status changes',
        'Strict type validation for JSON imports using Zod or custom predicates',
        'Clean README with architecture diagram demonstrating type flow',
      ],
      estimatedHours: 8,
    },
    practice: {
      interviewQuestions: [
        'What is the difference between an `interface` and a `type` alias in TypeScript?',
        'How does TypeScript handle type erasure during compilation?',
        'Explain discriminated unions and when to prefer them over optional properties.',
        'What is the difference between `any` and `unknown`, and why is `unknown` preferred?',
      ],
      codingChallenges: [
        'Implement a custom generic utility type `MyPick<T, K>` from scratch.',
        'Write a type guard function `isApiResponse<T>` that safely validates an unknown object.',
      ],
      keyTakeaway: 'In junior interviews, emphasizing type narrowing, discriminated unions, and refusing to use `any` will immediately set you apart.',
    },
  },

  React: {
    skillName: 'React',
    category: 'Frontend',
    learn: {
      coreConcepts: [
        'Component lifecycle, JSX expressions, and pure functions',
        'State management with `useState`, `useReducer`, and Context API',
        'Side-effect synchronization with `useEffect` (cleanups, dependency arrays)',
        'React performance fundamentals (memoization with `useMemo`, `useCallback`)',
      ],
      resources: [
        {
          title: 'React Official Documentation: Describing the UI & Managing State',
          type: 'documentation',
          url: 'https://react.dev/learn',
          timeEstimate: '4 hours',
          provider: 'Official React Documentation',
        },
        {
          title: 'freeCodeCamp React for Beginners Course',
          type: 'free_course',
          url: 'https://www.freecodecamp.org/news/tag/react/',
          timeEstimate: '6 hours',
          provider: 'freeCodeCamp',
        },
      ],
    },
    build: {
      projectTitle: 'Interactive Data Filtering Dashboard with Custom Hooks',
      projectDescription: 'Construct a responsive job analytics explorer featuring faceted search filters, client-side pagination, optimistic UI updates, and local storage synchronization.',
      deliverables: [
        'Reusable compound components (Card, Modal, Badge, FilterBar)',
        'Custom hook `useDebounce` for search inputs to prevent excessive re-renders',
        'Clean state management without prop-drilling using Context or reducer pattern',
      ],
      estimatedHours: 8,
    },
    practice: {
      interviewQuestions: [
        'How does the Virtual DOM diffing algorithm work, and why are keys important in lists?',
        'What are the primary differences between `useEffect` and `useLayoutEffect`?',
        'When should you use `useCallback` and `useMemo`, and when is it premature optimization?',
        'What causes an infinite re-render loop in React and how do you debug it?',
      ],
      codingChallenges: [
        'Build a debounced search input component that cancels pending requests on rapid keystrokes.',
        'Implement a custom `useFetch` hook with loading, error, and cached states.',
      ],
      keyTakeaway: 'Demonstrating a clear grasp of unidirectional data flow and clean cleanup functions in `useEffect` impresses frontend interviewers.',
    },
  },

  'Node.js': {
    skillName: 'Node.js',
    category: 'Backend',
    learn: {
      coreConcepts: [
        'Event Loop, libuv, Microtasks vs Macrotasks queue',
        'Node.js Streams, Buffers, and File System (fs) asynchronous I/O',
        'Express routing, middleware execution order, and error handling',
        'Asynchronous patterns: Callbacks, Promises, async/await with try-catch',
      ],
      resources: [
        {
          title: 'Node.js Official Documentation: Learn & Getting Started',
          type: 'documentation',
          url: 'https://nodejs.org/en/learn',
          timeEstimate: '3 hours',
          provider: 'Official Node.js Guide',
        },
        {
          title: 'MDN Web Docs: Express / Node Web Development',
          type: 'documentation',
          url: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs',
          timeEstimate: '5 hours',
          provider: 'Mozilla Developer Network',
        },
      ],
    },
    build: {
      projectTitle: 'Scalable REST API with Rate Limiting & JWT Authentication',
      projectDescription: 'Design a production-style RESTful API with route validation, JWT auth middleware, logging with Winston, and error sanitization.',
      deliverables: [
        'Modular Express router architecture with controller & service separation',
        'JWT token issuance with refresh token rotation and bcrypt password hashing',
        'Custom rate-limiting middleware utilizing memory store or Redis',
        'Comprehensive Postman collection export for API testing',
      ],
      estimatedHours: 10,
    },
    practice: {
      interviewQuestions: [
        'Explain how the single-threaded Node.js event loop handles heavy non-blocking I/O.',
        'What is the difference between `process.nextTick()` and `setImmediate()`?',
        'How would you handle uncaught exceptions and unhandled promise rejections in production?',
        'What is the difference between CommonJS (`require`) and ES Modules (`import`)?',
      ],
      codingChallenges: [
        'Create a middleware that measures API response latency and logs slow endpoints (>500ms).',
        'Implement a stream-based file upload pipeline that processes large CSV files chunk by chunk without blowing memory.',
      ],
      keyTakeaway: 'Focus on explaining non-blocking I/O and async error handling; interviewers look for real understanding of how Node handles concurrency.',
    },
  },

  PostgreSQL: {
    skillName: 'PostgreSQL',
    category: 'Database',
    learn: {
      coreConcepts: [
        'ACID properties and Transaction Isolation Levels',
        'Complex Joins (INNER, LEFT, FULL, CROSS) and Subqueries',
        'B-tree indexing strategies, EXPLAIN ANALYZE query planning',
        'Foreign key constraints, CASCADE triggers, and Database Normalization (1NF, 2NF, 3NF)',
      ],
      resources: [
        {
          title: 'PostgreSQL Official Documentation: Queries & Indexing',
          type: 'documentation',
          url: 'https://www.postgresql.org/docs/current/queries.html',
          timeEstimate: '3 hours',
          provider: 'PostgreSQL Global Development Group',
        },
        {
          title: 'SQLBolt: Interactive Lessons on SQL and Joins',
          type: 'interactive',
          url: 'https://sqlbolt.com/',
          timeEstimate: '3 hours',
          provider: 'SQLBolt',
        },
      ],
    },
    build: {
      projectTitle: 'E-Commerce Schema Design with Optimized Reporting Queries',
      projectDescription: 'Architect a relational PostgreSQL database with realistic mock data, normalized schemas, composite indexes, and complex aggregation queries.',
      deliverables: [
        'Normalized SQL schema migration scripts with foreign key cascading and constraints',
        'Benchmark analysis comparing query execution times with and without B-Tree indexes using EXPLAIN ANALYZE',
        'Complex window function query calculating monthly rolling revenue and top customer rankings',
      ],
      estimatedHours: 7,
    },
    practice: {
      interviewQuestions: [
        'What is the difference between clustered and non-clustered indexes in relational databases?',
        'Explain the ACID properties and describe what a "dirty read" is.',
        'When would you choose PostgreSQL over MongoDB, and vice versa?',
        'How does `EXPLAIN ANALYZE` help you debug slow queries?',
      ],
      codingChallenges: [
        'Write a SQL query using Window Functions (`DENSE_RANK()`) to find the 2nd highest salary in each department.',
        'Write a transaction script that safely transfers balance between two user accounts without race conditions.',
      ],
      keyTakeaway: 'Knowing how to read `EXPLAIN ANALYZE` output and justifying why you chose a composite index makes freshers stand out in DB rounds.',
    },
  },

  Docker: {
    skillName: 'Docker',
    category: 'Cloud & DevOps',
    learn: {
      coreConcepts: [
        'Containers vs Virtual Machines & Linux Namespaces/cgroups',
        'Dockerfile directives (FROM, RUN, COPY, CMD vs ENTRYPOINT)',
        'Multi-stage builds to optimize image size and security',
        'Docker Compose for multi-container orchestration (App + DB + Redis)',
      ],
      resources: [
        {
          title: 'Docker Official Get Started Tutorial',
          type: 'documentation',
          url: 'https://docs.docker.com/get-started/',
          timeEstimate: '3 hours',
          provider: 'Docker Official Documentation',
        },
        {
          title: 'Docker Curriculum: Comprehensive Hands-on Guide',
          type: 'free_course',
          url: 'https://docker-curriculum.com/',
          timeEstimate: '4 hours',
          provider: 'Docker Curriculum',
        },
      ],
    },
    build: {
      projectTitle: 'Multi-Container Microservice Environment with Docker Compose',
      projectDescription: 'Containerize a React frontend and Node/Express backend with a PostgreSQL database, setting up automated health checks and persistent volume storage.',
      deliverables: [
        'Optimized multi-stage Dockerfile producing a lean Alpine Linux production build (<50MB)',
        '`docker-compose.yml` linking frontend, backend API, and Postgres with healthchecks',
        'Persistent volume configuration to ensure database survives container reboots',
      ],
      estimatedHours: 6,
    },
    practice: {
      interviewQuestions: [
        'What is the difference between `CMD` and `ENTRYPOINT` in a Dockerfile?',
        'How do multi-stage Docker builds reduce image size and improve security?',
        'What is the purpose of Docker volumes and bind mounts?',
        'How does Docker isolate processes compared to traditional Hypervisor VMs?',
      ],
      codingChallenges: [
        'Write an optimized 2-stage Dockerfile for a React Vite application with an Nginx reverse proxy.',
        'Compose a YAML file running a Node.js server that waits for a PostgreSQL container to become healthy before starting.',
      ],
      keyTakeaway: 'Being able to explain multi-stage builds and container networking shows practical engineering maturity beyond basic school tutorials.',
    },
  },

  'Jest / Unit Testing': {
    skillName: 'Jest / Unit Testing',
    category: 'Tools & Methods',
    learn: {
      coreConcepts: [
        'Testing Pyramid: Unit, Integration, and End-to-End (E2E) testing',
        'Writing tests with Arrange-Act-Assert (AAA) pattern',
        'Mocking functions, modules, and API responses with `jest.fn()` and `jest.mock()`',
        'Testing React components with `@testing-library/react` (accessibility queries, user-event)',
      ],
      resources: [
        {
          title: 'Jest Official Getting Started Guide',
          type: 'documentation',
          url: 'https://jestjs.io/docs/getting-started',
          timeEstimate: '2 hours',
          provider: 'Jest Official Documentation',
        },
        {
          title: 'Testing Library Guiding Principles and Queries',
          type: 'documentation',
          url: 'https://testing-library.com/docs/guiding-principles',
          timeEstimate: '2 hours',
          provider: 'Testing Library Official Documentation',
        },
      ],
    },
    build: {
      projectTitle: 'Automated Test Suite for Critical Business Logic & Forms',
      projectDescription: 'Create a comprehensive test suite for an e-commerce checkout flow with 90%+ branch coverage, testing form validations and simulated payment edge cases.',
      deliverables: [
        'Unit tests for discount calculation and cart total algorithms',
        'Component tests mocking network requests with Mock Service Worker (MSW)',
        'GitHub Actions CI workflow that fails pull requests if test coverage drops below 80%',
      ],
      estimatedHours: 6,
    },
    practice: {
      interviewQuestions: [
        'Why does React Testing Library prioritize querying by user-facing text and ARIA roles over test-ids or class names?',
        'What is the difference between a mock, a stub, and a spy?',
        'What is code coverage, and why is 100% test coverage not always a guarantee of bug-free software?',
      ],
      codingChallenges: [
        'Write a Jest test verifying that an async user search input debounces correctly and triggers only one network request.',
      ],
      keyTakeaway: 'Emphasize that you test user behavior rather than implementation details.',
    },
  },

  'FastAPI': {
    skillName: 'FastAPI',
    category: 'Backend',
    learn: {
      coreConcepts: [
        'Python type hints and Pydantic schemas for data validation and serialization',
        'Asynchronous request handling with Python `async def` and event loop',
        'Dependency Injection system (`Depends`) for authentication and database sessions',
        'Automatic OpenAPI (Swagger) documentation generation',
      ],
      resources: [
        {
          title: 'FastAPI Official Interactive Tutorial',
          type: 'documentation',
          url: 'https://fastapi.tiangolo.com/tutorial/',
          timeEstimate: '4 hours',
          provider: 'Official FastAPI Documentation',
        },
      ],
    },
    build: {
      projectTitle: 'High-Performance Asynchronous ML Inference API',
      projectDescription: 'Build an asynchronous REST microservice using FastAPI, SQLAlchemy async session, and Pydantic validation that predicts student opportunity match scores.',
      deliverables: [
        'Async CRUD endpoints with Pydantic request & response models',
        'Dependency-injected auth middleware and SQLite/Postgres connection pooling',
        'Auto-generated interactive Swagger UI documentation at `/docs`',
      ],
      estimatedHours: 8,
    },
    practice: {
      interviewQuestions: [
        'How does FastAPI leverage Python type annotations for both validation and serialization?',
        'Explain the `Depends` function in FastAPI and how dependency injection works.',
        'When should you use `async def` vs regular `def` endpoints in FastAPI?',
      ],
      codingChallenges: [
        'Create a Pydantic model with custom field validators ensuring salary cannot be negative.',
      ],
      keyTakeaway: 'FastAPI demonstrates modern, type-safe Python backend skills that startups love.',
    },
  },

  Python: {
    skillName: 'Python',
    category: 'Languages',
    learn: {
      coreConcepts: [
        'Data types, list comprehensions, generators, and iterators',
        'Object-oriented programming (classes, inheritance, dunder methods)',
        'Virtual environments (`venv`), package management with `pip`',
        'File I/O, context managers (`with` statement), and exception handling',
      ],
      resources: [
        {
          title: 'The Python Tutorial (Official Python 3.12+ Documentation)',
          type: 'documentation',
          url: 'https://docs.python.org/3/tutorial/',
          timeEstimate: '4 hours',
          provider: 'Python Software Foundation',
        },
        {
          title: 'freeCodeCamp Python for Beginners Course',
          type: 'free_course',
          url: 'https://www.freecodecamp.org/news/python-for-beginners/',
          timeEstimate: '5 hours',
          provider: 'freeCodeCamp',
        },
      ],
    },
    build: {
      projectTitle: 'Automated Job Market Telemetry & Text Scraper',
      projectDescription: 'Create a command-line script in Python that parses structured job listings, calculates keyword frequency, and exports clean CSV summaries.',
      deliverables: [
        'Modular Python package structure with `argparse` CLI interface',
        'Clean error handling for network timeouts and malformed JSON schemas',
        'Pytest unit tests verifying text extraction regex logic',
      ],
      estimatedHours: 6,
    },
    practice: {
      interviewQuestions: [
        'What is the Python GIL (Global Interpreter Lock) and how does it affect CPU-bound threading?',
        'What is the difference between mutable and immutable types in Python?',
        'Explain list comprehensions vs generator expressions in terms of memory efficiency.',
      ],
      codingChallenges: [
        'Write a custom context manager class that logs execution time of a code block.',
      ],
      keyTakeaway: 'Write idiomatic PEP-8 Python code and demonstrate understanding of memory efficiency with generators.',
    },
  },

  'AWS (S3, EC2, Lambda)': {
    skillName: 'AWS (S3, EC2, Lambda)',
    category: 'Cloud & DevOps',
    learn: {
      coreConcepts: [
        'Core AWS Architecture: Regions, Availability Zones, and VPC fundamentals',
        'Amazon S3: Buckets, access control lists (ACLs), presigned URLs, and lifecycle policies',
        'Amazon EC2: Instances, security groups, key pairs, and IAM roles',
        'AWS Lambda: Serverless execution model, cold starts, and API Gateway integration',
      ],
      resources: [
        {
          title: 'AWS Getting Started Resource Center',
          type: 'documentation',
          url: 'https://aws.amazon.com/getting-started/',
          timeEstimate: '3 hours',
          provider: 'Amazon Web Services',
        },
        {
          title: 'AWS Free Tier Hands-On Labs',
          type: 'interactive',
          url: 'https://aws.amazon.com/free/',
          timeEstimate: '4 hours',
          provider: 'AWS Training',
        },
      ],
    },
    build: {
      projectTitle: 'Serverless Resume PDF Storage and Thumbnail Generator',
      projectDescription: 'Build an AWS serverless workflow: upload resume PDFs to an S3 bucket which triggers an AWS Lambda function to generate metadata and store details.',
      deliverables: [
        'S3 bucket configured with least-privilege IAM policies and CORS rules',
        'Python Lambda function triggered by `s3:ObjectCreated:*` events',
        'CloudWatch logs configuration for automated debugging',
      ],
      estimatedHours: 7,
    },
    practice: {
      interviewQuestions: [
        'What is an IAM role and how does it differ from an IAM user?',
        'How do AWS Lambda cold starts occur, and how can they be minimized?',
        'What is the difference between an S3 bucket policy and an IAM user policy?',
      ],
      codingChallenges: [
        'Write an IAM JSON policy granting read-only access to a specific S3 bucket.',
      ],
      keyTakeaway: 'Emphasize security and IAM least-privilege principles when discussing AWS in technical interviews.',
    },
  },

  JavaScript: {
    skillName: 'JavaScript',
    category: 'Languages',
    learn: {
      coreConcepts: [
        'Closures, Lexical Scope, and Hoisting',
        'Asynchronous JS: Event Loop, Microtask Queue, Promises, async/await',
        'ES6+ Features: Destructuring, Spread/Rest, Modules, Optional Chaining',
        'DOM Manipulation and Event Bubbling/Delegation',
      ],
      resources: [
        {
          title: 'MDN Web Docs: JavaScript Guide & Reference',
          type: 'documentation',
          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
          timeEstimate: '4 hours',
          provider: 'Mozilla Developer Network',
        },
        {
          title: 'The Modern JavaScript Tutorial',
          type: 'interactive',
          url: 'https://javascript.info/',
          timeEstimate: '6 hours',
          provider: 'javascript.info',
        },
      ],
    },
    build: {
      projectTitle: 'Vanilla JS Interactive Data Grid with Sorting and Pagination',
      projectDescription: 'Construct a zero-dependency interactive tabular dashboard using modern vanilla ES6+ with custom event emitters, virtual scrolling, and local storage caching.',
      deliverables: [
        'Clean, modular ES6 class or module architecture',
        'Client-side search and multi-column sorting without external libraries',
        'Debounced search input handling with zero lag on 1,000+ item dataset',
      ],
      estimatedHours: 6,
    },
    practice: {
      interviewQuestions: [
        'Explain the JavaScript event loop and how macro-tasks differ from micro-tasks.',
        'What is closure in JavaScript and what is a practical real-world use case?',
        'What is the difference between `==` and `===`, and what is type coercion?',
        'How does prototypical inheritance differ from classical inheritance?',
      ],
      codingChallenges: [
        'Write a custom implementation of `Array.prototype.myReduce` from scratch.',
        'Implement a debounce and throttle utility function.',
      ],
      keyTakeaway: 'Mastering asynchronous JavaScript execution order and prototype mechanics is standard for any technical interview.',
    },
  },

  SQL: {
    skillName: 'SQL',
    category: 'Database',
    learn: {
      coreConcepts: [
        'Relational Data Modeling and Table Normalization (1NF, 2NF, 3NF)',
        'Complex Multi-Table Joins (INNER, LEFT, RIGHT, FULL OUTER, CROSS)',
        'Aggregate Functions and GROUP BY with HAVING filtering',
        'Window Functions (ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD)',
      ],
      resources: [
        {
          title: 'SQLBolt - Interactive Lessons on SQL Queries',
          type: 'interactive',
          url: 'https://sqlbolt.com/',
          timeEstimate: '3 hours',
          provider: 'SQLBolt',
        },
        {
          title: 'W3Schools SQL Tutorial & Reference',
          type: 'documentation',
          url: 'https://www.w3schools.com/sql/',
          timeEstimate: '4 hours',
          provider: 'W3Schools',
        },
      ],
    },
    build: {
      projectTitle: 'E-Commerce Analytics & Aggregation Query Suite',
      projectDescription: 'Write and test a set of analytics queries on a multi-table database schema (users, orders, products, payments) simulating real business intelligence reports.',
      deliverables: [
        'Schema DDL scripts with primary and foreign key constraints',
        'Query calculating Monthly Active Users (MAU) and month-over-month retention rates',
        'Top 5 products per category query using window functions',
      ],
      estimatedHours: 5,
    },
    practice: {
      interviewQuestions: [
        'What is the difference between WHERE and HAVING in SQL?',
        'Explain the difference between UNION and UNION ALL.',
        'How do clustered and non-clustered indexes improve query performance?',
      ],
      codingChallenges: [
        'Write a query to find the second-highest salary without using LIMIT or TOP.',
        'Find all customers who made a purchase in 2024 but no purchases in 2025.',
      ],
      keyTakeaway: 'Demonstrate fluency in window functions and writing clean, readable CTEs (Common Table Expressions).',
    },
  },

  'Tailwind CSS': {
    skillName: 'Tailwind CSS',
    category: 'Frontend',
    learn: {
      coreConcepts: [
        'Utility-First CSS Philosophy and responsive design breakpoints',
        'State variants (hover, focus, active, dark mode, group-hover)',
        'Theme configuration (`tailwind.config.js`) and custom color scales',
        'Reusability patterns: component extraction vs utility composition',
      ],
      resources: [
        {
          title: 'Tailwind CSS Official Documentation & Core Concepts',
          type: 'documentation',
          url: 'https://tailwindcss.com/docs',
          timeEstimate: '2 hours',
          provider: 'Tailwind Labs',
        },
        {
          title: 'freeCodeCamp Tailwind CSS Crash Course',
          type: 'free_course',
          url: 'https://www.freecodecamp.org/news/tag/tailwind-css/',
          timeEstimate: '3 hours',
          provider: 'freeCodeCamp',
        },
      ],
    },
    build: {
      projectTitle: 'Responsive SaaS Landing Page with Dark Mode',
      projectDescription: 'Build an ultra-polished, responsive SaaS marketing and pricing page with Tailwind CSS, micro-interactions, mobile navigation drawer, and theme toggling.',
      deliverables: [
        'Mobile-first responsive layout matching Figma design tokens',
        'Custom color palette configured in Tailwind theme',
        'Fluid dark/light mode toggle with persistent state',
      ],
      estimatedHours: 5,
    },
    practice: {
      interviewQuestions: [
        'What are the advantages and trade-offs of utility-first CSS compared to BEM or CSS Modules?',
        'How does Tailwind CSS keep production bundle sizes small?',
        'Explain how the `group-hover` and `peer` modifiers work.',
      ],
      codingChallenges: [
        'Create a responsive card grid with responsive columns (1 col mobile, 2 col tablet, 4 col desktop).',
      ],
      keyTakeaway: 'Emphasize fast development velocity and consistent design systems achieved through utility design tokens.',
    },
  },

  'C++': {
    skillName: 'C++',
    category: 'Languages',
    learn: {
      coreConcepts: [
        'Memory management: Stack vs Heap, pointers, references, smart pointers (unique_ptr, shared_ptr)',
        'Object-Oriented C++: RAII, constructors, destructors, rule of three/five/zero',
        'Standard Template Library (STL): vectors, maps, iterators, and algorithms',
        'Move semantics and rvalue references (std::move, std::forward)',
      ],
      resources: [
        {
          title: 'LearnCpp.com - Free Comprehensive C++ Tutorial',
          type: 'documentation',
          url: 'https://www.learncpp.com/',
          timeEstimate: '6 hours',
          provider: 'LearnCpp',
        },
        {
          title: 'cppreference.com - C++ Standard Library Reference',
          type: 'documentation',
          url: 'https://en.cppreference.com/w/',
          timeEstimate: '4 hours',
          provider: 'cppreference',
        },
      ],
    },
    build: {
      projectTitle: 'High-Performance In-Memory Cache with LRU Eviction',
      projectDescription: 'Implement an in-memory key-value cache in modern C++ (C++17/20) with least-recently-used (LRU) eviction and thread-safe operations.',
      deliverables: [
        'O(1) get and put operations using std::unordered_map and std::list',
        'Thread safety using std::shared_mutex (read/write lock)',
        'Comprehensive unit tests using Google Test or Catch2',
      ],
      estimatedHours: 8,
    },
    practice: {
      interviewQuestions: [
        'What is RAII (Resource Acquisition Is Initialization) and why is it foundational in modern C++?',
        'What is the difference between `std::unique_ptr` and `std::shared_ptr`?',
        'Explain virtual functions, vtables, and how dynamic dispatch works in C++.',
      ],
      codingChallenges: [
        'Implement a custom vector-like dynamic array class with automatic resizing.',
      ],
      keyTakeaway: 'In systems interviews, never use raw `new`/`delete`; always explain smart pointers and RAII.',
    },
  },

  Go: {
    skillName: 'Go',
    category: 'Languages',
    learn: {
      coreConcepts: [
        'Goroutines, Channels, and CSP (Communicating Sequential Processes) concurrency model',
        'Error handling idioms: explicit error returns, custom error types, wrapping',
        'Interfaces in Go: implicit implementation and duck typing',
        'Structs, slices, maps, memory pointers, and garbage collection behavior',
      ],
      resources: [
        {
          title: 'A Tour of Go - Official Interactive Tutorial',
          type: 'interactive',
          url: 'https://go.dev/tour/welcome/1',
          timeEstimate: '3 hours',
          provider: 'The Go Authors',
        },
        {
          title: 'Go by Example - Hands-on Code Snippets',
          type: 'documentation',
          url: 'https://gobyexample.com/',
          timeEstimate: '3 hours',
          provider: 'Go by Example',
        },
      ],
    },
    build: {
      projectTitle: 'Concurrent Web Scraper and URL Health Checker',
      projectDescription: 'Build a concurrent CLI tool in Go that polls a list of target URLs, checks HTTP response codes, and streams real-time latency statistics using worker pools and channels.',
      deliverables: [
        'Worker pool pattern limiting concurrency to N simultaneous workers',
        'Graceful shutdown on SIGINT/SIGTERM with `sync.WaitGroup` and contexts',
        'Formatted tabular output summarizing HTTP status rates',
      ],
      estimatedHours: 6,
    },
    practice: {
      interviewQuestions: [
        'How do Go goroutines differ from OS threads in terms of memory and scheduling?',
        'What is the difference between buffered and unbuffered channels in Go?',
        'How does context cancellation work across goroutines?',
      ],
      codingChallenges: [
        'Implement a worker pool using Go channels that processes jobs concurrently.',
      ],
      keyTakeaway: 'Demonstrate deep understanding of channel synchronization and the `sync` package.',
    },
  },

  Kubernetes: {
    skillName: 'Kubernetes',
    category: 'Cloud & DevOps',
    learn: {
      coreConcepts: [
        'K8s Architecture: Control Plane (API server, etcd, scheduler) vs Worker Nodes (kubelet, kube-proxy)',
        'Core Primitives: Pods, Deployments, ReplicaSets, and Services (ClusterIP, NodePort, LoadBalancer)',
        'ConfigMaps and Secrets for decoupled configuration management',
        'Ingress Controllers, Horizontal Pod Autoscaling (HPA), and Health Probes (Liveness/Readiness)',
      ],
      resources: [
        {
          title: 'Kubernetes Official Basics & Tutorials',
          type: 'documentation',
          url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/',
          timeEstimate: '4 hours',
          provider: 'The Kubernetes Authors',
        },
        {
          title: 'Kubernetes Official Interactive Katacoda Labs',
          type: 'interactive',
          url: 'https://kubernetes.io/docs/tutorials/',
          timeEstimate: '4 hours',
          provider: 'Kubernetes Documentation',
        },
      ],
    },
    build: {
      projectTitle: 'Production-Grade Microservice Deployment on Minikube / K3s',
      projectDescription: 'Deploy a multi-tier web application (frontend + API + database) to a local Minikube cluster with declarative YAML manifests, persistent volumes, and secret management.',
      deliverables: [
        'Declarative YAML manifests for Deployment, Service, ConfigMap, and Secret',
        'Configured readiness and liveness HTTP probes with failure thresholds',
        'HorizontalPodAutoscaler manifest autoscaling pods based on simulated CPU load',
      ],
      estimatedHours: 7,
    },
    practice: {
      interviewQuestions: [
        'What happens when a pod fails a liveness probe vs a readiness probe?',
        'Explain the difference between a ClusterIP, NodePort, and LoadBalancer service.',
        'What is an Ingress Controller and how does it route external HTTP traffic to internal services?',
      ],
      codingChallenges: [
        'Write a Kubernetes Deployment YAML for an Nginx container with 3 replicas and resource limits.',
      ],
      keyTakeaway: 'Know the core control loop (current state vs desired state) and health probe behavior.',
    },
  },
};

export function generateRoadmapsForMissingSkills(missingSkills: MissingSkill[]): SkillRoadmap[] {
  if (!missingSkills || missingSkills.length === 0) {
    return [];
  }

  const sorted = [...missingSkills].sort((a, b) => {
    if (a.importance === 'critical' && b.importance !== 'critical') return -1;
    if (a.importance !== 'critical' && b.importance === 'critical') return 1;
    return b.weight - a.weight;
  });

  const topSkillsToGenerate = sorted.slice(0, 3);

  return topSkillsToGenerate.map((skill) => {
    if (ROADMAP_DATABASE[skill.name]) {
      return ROADMAP_DATABASE[skill.name];
    }

    // High-yield fallback linking to authoritative MDN or DevDocs
    const canonicalDocsUrl = skill.category === 'Frontend' || skill.category === 'Languages'
      ? 'https://developer.mozilla.org/en-US/docs/Learn'
      : 'https://devdocs.io/';

    return {
      skillName: skill.name,
      category: skill.category,
      learn: {
        coreConcepts: [
          `Fundamental architecture, design patterns, and standard syntax of ${skill.name}`,
          `Industry best practices, common pitfalls, and memory/performance considerations`,
          `Standard integration patterns within the ${skill.category} ecosystem`,
          `Debugging techniques and systematic error inspection`,
        ],
        resources: [
          {
            title: `${skill.name} Developer Documentation Hub`,
            type: 'documentation',
            url: canonicalDocsUrl,
            timeEstimate: '3 hours',
            provider: 'Verified Developer Documentation',
          },
          {
            title: 'freeCodeCamp Developer Curriculum',
            type: 'free_course',
            url: 'https://www.freecodecamp.org/learn/',
            timeEstimate: '4 hours',
            provider: 'freeCodeCamp',
          },
        ],
      },
      build: {
        projectTitle: `${skill.name} Showcase & Integration Project`,
        projectDescription: `Construct an open-source demonstration application featuring ${skill.name} with clean separation of concerns, comprehensive documentation, and automated tests.`,
        deliverables: [
          `Well-structured GitHub repository with incremental commits and setup instructions`,
          `Practical implementation demonstrating core principles of ${skill.name}`,
          `Automated validation test suite and reproducible environment configuration`,
        ],
        estimatedHours: 8,
      },
      practice: {
        interviewQuestions: [
          `Can you describe the primary engineering problem that ${skill.name} solves?`,
          `What are the most common performance bottlenecks or anti-patterns when using ${skill.name}?`,
          `How would you structure a real-world enterprise system utilizing ${skill.name}?`,
        ],
        codingChallenges: [
          `Implement a modular component or service demonstrating clean architecture with ${skill.name}.`,
        ],
        keyTakeaway: `Focus on explaining engineering trade-offs and real problem-solving rather than rote syntax memorization.`,
      },
    };
  });
}
