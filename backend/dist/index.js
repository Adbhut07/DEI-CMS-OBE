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
// import courseOutcomeRoutes from './routes/course/courseOutcome.route';
const faculty_route_1 = __importDefault(require("./routes/faculty/faculty.route"));
const enrollment_route_1 = __importDefault(require("./routes/enrollment/enrollment.route"));
const exam_route_1 = __importDefault(require("./routes/exam/exam.route"));
const marks_route_1 = __importDefault(require("./routes/marks/marks.route"));
const semester_route_1 = __importDefault(require("./routes/semester/semester.route"));
const batch_route_1 = __importDefault(require("./routes/batch/batch.route"));
const programOutcome_route_1 = __importDefault(require("./routes/programOutcome/programOutcome.route"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
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
// app.use('/api/v1/course-outcomes', courseOutcomeRoutes);
app.use('/api/v1/batche', batch_route_1.default);
app.use('/api/v1/semesters', semester_route_1.default);
app.use('/api/v1/faculty', faculty_route_1.default);
app.use('/api/v1/enrollments', enrollment_route_1.default);
app.use('/api/v1/exams', exam_route_1.default);
app.use('/api/v1/marks', marks_route_1.default);
app.use('/api/v1/program-outcomes', programOutcome_route_1.default);
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
