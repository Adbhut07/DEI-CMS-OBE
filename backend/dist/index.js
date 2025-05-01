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
const faculty_route_1 = __importDefault(require("./routes/faculty/faculty.route"));
const enrollment_route_1 = __importDefault(require("./routes/enrollment/enrollment.route"));
const exam_route_1 = __importDefault(require("./routes/exam/exam.route"));
const marks_route_1 = __importDefault(require("./routes/marks/marks.route"));
const batch_route_1 = __importDefault(require("./routes/batch/batch.route"));
const programOutcome_route_1 = __importDefault(require("./routes/programOutcome/programOutcome.route"));
const course_subject_mapping_route_1 = __importDefault(require("./routes/course/course-subject-mapping.route"));
const courseOutcome_route_1 = __importDefault(require("./routes/course/courseOutcome.route"));
const poAttainment_routes_1 = __importDefault(require("./routes/programOutcome/poAttainment.routes"));
const student_route_1 = __importDefault(require("./routes/student/student.route"));
const semester_route_1 = __importDefault(require("./routes/semester/semester.route"));
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
app.use('/api/v1/batch', batch_route_1.default);
app.use('/api/v1/faculty', faculty_route_1.default);
app.use('/api/v1/enrollments', enrollment_route_1.default);
app.use('/api/v1/exams', exam_route_1.default);
app.use('/api/v1/marks', marks_route_1.default);
app.use('/api/v1/program-outcomes', programOutcome_route_1.default);
app.use('/api/v1/courseOutcome', courseOutcome_route_1.default);
app.use('/api/v1/course-subject-mapping', course_subject_mapping_route_1.default);
app.use('/api/v1/po-attainment', poAttainment_routes_1.default);
app.use('/api/v1/student', student_route_1.default);
app.use('/api/v1/semester', semester_route_1.default);
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// model Marks {
//   id            Int       @id @default(autoincrement())
//   student       User      @relation("StudentMarks", fields: [studentId], references: [id]) // ✅ Named Relation
//   studentId     Int
//   exam          Exam      @relation(fields: [examId], references: [id])
//   examId        Int
//   question      Question? @relation(fields: [questionId], references: [id]) // Nullable for DHA, AA, ATT
//   questionId    Int?
//   subject       Subject   @relation(fields: [subjectId], references: [id])
//   subjectId     Int
//   marksObtained Int
//   uploadedBy    User      @relation("UploadedMarks", fields: [uploadedById], references: [id]) // ✅ Named Relation
//   uploadedById  Int
//   createdAt     DateTime  @default(now())
//   updatedAt     DateTime  @updatedAt
//   @@unique([studentId, examId, questionId]) // ✅ Unique if question-wise
//   @@unique([studentId, examId, subjectId]) // ✅ Unique if subject-wise (DHA, AA, ATT)
// }
