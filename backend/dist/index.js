"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const semester_route_1 = __importDefault(require("./routes/semester.route"));
const subject_route_1 = __importDefault(require("./routes/subject.route"));
const enrollment_route_1 = __importDefault(require("./routes/enrollment.route"));
const exam_route_1 = __importDefault(require("./routes/exam.route"));
const question_route_1 = __importDefault(require("./routes/question.route"));
const marks_route_1 = __importDefault(require("./routes/marks.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/v1/semesters', semester_route_1.default);
app.use('/api/v1/subjects', subject_route_1.default);
app.use('/api/v1/enrollments', enrollment_route_1.default);
app.use('/api/v1/exams', exam_route_1.default);
app.use('/api/v1/questions', question_route_1.default);
app.use('/api/v1/marks', marks_route_1.default);
app.use('/api/v1/users', user_route_1.default);
app.use('/api/v1/course', course_route_1.default);
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
