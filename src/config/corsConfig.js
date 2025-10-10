const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://intelligent-cv-backend.onrender.com",
  "https://verbose-barnacle-979jx97qg9ggcpw74-5173.app.github.dev",
  "intelligent-cv-t7lw.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS: Unauthorized domain"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export default corsOptions;
