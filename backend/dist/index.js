"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_route_1 = __importDefault(require("./routes/user/auth.route"));
const user_route_1 = __importDefault(require("./routes/user/user.route"));
const course_route_1 = __importDefault(require("./routes/course/course.route"));
const subject_route_1 = __importDefault(require("./routes/subject/subject.route"));
const unit_route_1 = __importDefault(require("./routes/unit/unit.route"));
const courseOutcome_route_1 = __importDefault(require("./routes/course/courseOutcome.route"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const corsOptions = {
    origin: ['http://localhost:3000', 'https://your-production-domain.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/api/v1/auth', auth_route_1.default);
app.use('/api/v1/users', user_route_1.default);
app.use('/api/v1/courses', course_route_1.default);
app.use('/api/v1/subjects', subject_route_1.default);
app.use('/api/v1/units', unit_route_1.default);
app.use('/api/v1/course-outcomes', courseOutcome_route_1.default);
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
