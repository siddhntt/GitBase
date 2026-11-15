const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const uri = process.env.MONGODB_URI;

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("GitBase");

    // Clear existing data
    await db.collection("users").deleteMany({});
    await db.collection("repositories").deleteMany({});
    await db.collection("issues").deleteMany({});
    console.log("Cleared old data");

    // ── Users ──
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash("password123", salt);

    const usersResult = await db.collection("users").insertMany([
      {
        username: "siddhant",
        email: "siddhant@gmail.com",
        password: hashedPw,
        repositories: [],
        followedUsers: [],
        starRepos: [],
      },
      {
        username: "arjun",
        email: "arjun@gmail.com",
        password: hashedPw,
        repositories: [],
        followedUsers: [],
        starRepos: [],
      },
      {
        username: "priya",
        email: "priya@gmail.com",
        password: hashedPw,
        repositories: [],
        followedUsers: [],
        starRepos: [],
      },
    ]);

    const userIds = Object.values(usersResult.insertedIds);
    const [siddhantId, arjunId, priyaId] = userIds;
    console.log(`Inserted ${userIds.length} users`);

    // ── Repositories ──
    const reposResult = await db.collection("repositories").insertMany([
      // Siddhant's repos
      {
        name: "react-todo-app",
        description: "A minimal todo app with drag-and-drop, dark mode, and localStorage persistence.",
        content: ["index.html", "App.jsx", "TodoList.jsx", "styles.css", "package.json"],
        visibility: true,
        owner: siddhantId,
        issues: [],
      },
      {
        name: "express-auth-starter",
        description: "Boilerplate for Express apps with JWT authentication, bcrypt hashing, and MongoDB.",
        content: ["index.js", "routes/auth.js", "middleware/auth.js", "models/User.js", ".env.example", "package.json"],
        visibility: false,
        owner: siddhantId,
        issues: [],
      },
      {
        name: "portfolio-v2",
        description: "Personal portfolio with project showcase, contact form, and blog section.",
        content: ["index.html", "style.css", "main.js", "assets/"],
        visibility: true,
        owner: siddhantId,
        issues: [],
      },
      {
        name: "markdown-previewer",
        description: "Live markdown editor with GFM tables, syntax highlighting, and export to HTML/PDF.",
        content: ["src/App.tsx", "src/Editor.tsx", "src/Preview.tsx", "src/parser.ts", "package.json"],
        visibility: true,
        owner: siddhantId,
        issues: [],
      },
      // Arjun's repos
      {
        name: "node-rate-limiter",
        description: "Express middleware for API rate limiting with sliding window and Redis support.",
        content: ["index.js", "lib/limiter.js", "lib/store.js", "test/limiter.test.js", "README.md"],
        visibility: true,
        owner: arjunId,
        issues: [],
      },
      {
        name: "css-grid-generator",
        description: "Visual drag-and-drop tool for generating CSS Grid layouts with live code output.",
        content: ["src/App.tsx", "src/Grid.tsx", "src/CodePanel.tsx", "src/styles.css"],
        visibility: true,
        owner: arjunId,
        issues: [],
      },
      {
        name: "chat-socket-app",
        description: "Real-time chat rooms using Socket.io, Express, and React. Supports typing indicators.",
        content: ["server.js", "client/App.jsx", "client/Chat.jsx", "client/RoomList.jsx"],
        visibility: true,
        owner: arjunId,
        issues: [],
      },
      // Priya's repos
      {
        name: "mongo-seeder",
        description: "CLI tool to seed MongoDB collections with realistic fake data using Faker.js.",
        content: ["bin/cli.js", "lib/seeder.js", "lib/schemas.js", "README.md", "package.json"],
        visibility: true,
        owner: priyaId,
        issues: [],
      },
      {
        name: "react-form-hooks",
        description: "Lightweight form validation hooks for React. Supports async validation and custom rules.",
        content: ["src/useForm.ts", "src/useField.ts", "src/validators.ts", "src/index.ts"],
        visibility: true,
        owner: priyaId,
        issues: [],
      },
      {
        name: "budget-tracker",
        description: "Monthly expense tracker with charts, categories, and CSV export.",
        content: ["src/App.jsx", "src/Dashboard.jsx", "src/AddExpense.jsx", "src/Chart.jsx"],
        visibility: false,
        owner: priyaId,
        issues: [],
      },
    ]);

    const repoIds = Object.values(reposResult.insertedIds);
    console.log(`Inserted ${repoIds.length} repositories`);

    // ── Issues ──
    // Issues on react-todo-app (repo 0)
    const issuesResult = await db.collection("issues").insertMany([
      {
        title: "Todo items lose order after page refresh",
        description: "When you reorder items with drag-and-drop and refresh the page, the order resets to the original insertion order instead of the saved order. Looks like localStorage saves the array but not the sort index.",
        status: "open",
        repository: repoIds[0],
      },
      {
        title: "Add due dates to tasks",
        description: "It would be useful to set a due date on each task and show overdue items in red. Could use a simple date picker.",
        status: "open",
        repository: repoIds[0],
      },
      {
        title: "Dark mode toggle doesn't persist",
        description: "Clicking the dark mode button works, but it resets to light mode when you open a new tab. Need to save the preference in localStorage.",
        status: "closed",
        repository: repoIds[0],
      },
      // Issues on express-auth-starter (repo 1)
      {
        title: "Token expiry returns 500 instead of 401",
        description: "When the JWT expires, the auth middleware throws an unhandled error and the client gets a 500 response. Should catch TokenExpiredError and return 401 with a clear message.",
        status: "open",
        repository: repoIds[1],
      },
      {
        title: "Add refresh token flow",
        description: "Currently users get logged out after 1 hour when the access token expires. Need a refresh token endpoint that issues a new access token without re-entering credentials.",
        status: "open",
        repository: repoIds[1],
      },
      // Issues on portfolio-v2 (repo 2)
      {
        title: "Contact form sends blank emails",
        description: "Submitting the contact form works but the email body is empty. The form data isn't being passed to the email template correctly.",
        status: "open",
        repository: repoIds[2],
      },
      // Issues on node-rate-limiter (repo 4)
      {
        title: "Memory leak with default in-memory store",
        description: "When running for more than a few hours under load, the in-memory store grows without bound because expired entries aren't cleaned up. Need a periodic cleanup or use a TTL map.",
        status: "open",
        repository: repoIds[4],
      },
      {
        title: "Support for custom key generators",
        description: "Currently rate limiting is per-IP. It should accept a custom function to generate the rate limit key, e.g., per-user or per-API-key.",
        status: "closed",
        repository: repoIds[4],
      },
      // Issues on chat-socket-app (repo 6)
      {
        title: "Messages duplicate when reconnecting",
        description: "If the WebSocket disconnects and reconnects, the client receives the last few messages again. Need to track message IDs and deduplicate on the client side.",
        status: "open",
        repository: repoIds[6],
      },
      // Issues on react-form-hooks (repo 8)
      {
        title: "Async validators don't show loading state",
        description: "When using async validation (like checking if a username is taken), there's no way to know validation is in progress. The hook should expose an isValidating flag per field.",
        status: "open",
        repository: repoIds[8],
      },
    ]);

    const issueIds = Object.values(issuesResult.insertedIds);
    console.log(`Inserted ${issueIds.length} issues`);

    // Link issues back to repos
    await db.collection("repositories").updateOne(
      { _id: repoIds[0] },
      { $set: { issues: [issueIds[0], issueIds[1], issueIds[2]] } }
    );
    await db.collection("repositories").updateOne(
      { _id: repoIds[1] },
      { $set: { issues: [issueIds[3], issueIds[4]] } }
    );
    await db.collection("repositories").updateOne(
      { _id: repoIds[2] },
      { $set: { issues: [issueIds[5]] } }
    );
    await db.collection("repositories").updateOne(
      { _id: repoIds[4] },
      { $set: { issues: [issueIds[6], issueIds[7]] } }
    );
    await db.collection("repositories").updateOne(
      { _id: repoIds[6] },
      { $set: { issues: [issueIds[8]] } }
    );
    await db.collection("repositories").updateOne(
      { _id: repoIds[8] },
      { $set: { issues: [issueIds[9]] } }
    );

    // Link repos back to users
    await db.collection("users").updateOne(
      { _id: siddhantId },
      { $set: { repositories: [repoIds[0], repoIds[1], repoIds[2], repoIds[3]] } }
    );
    await db.collection("users").updateOne(
      { _id: arjunId },
      { $set: { repositories: [repoIds[4], repoIds[5], repoIds[6]] } }
    );
    await db.collection("users").updateOne(
      { _id: priyaId },
      { $set: { repositories: [repoIds[7], repoIds[8], repoIds[9]] } }
    );

    console.log("Linked issues to repos and repos to users");
    console.log("\n✅ Seed complete!");
    console.log("\n── Login credentials (all users) ──");
    console.log("  siddhant@gmail.com / password123");
    console.log("  arjun@gmail.com   / password123");
    console.log("  priya@gmail.com   / password123");

  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seed();

