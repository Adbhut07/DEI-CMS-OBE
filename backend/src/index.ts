import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';

import authRoutes from './routes/user/auth.route';
import userRoutes from './routes/user/user.route';
import courseRoutes from './routes/course/course.route';
import subjectRoutes from './routes/subject/subject.route';
import unitRoutes from './routes/unit/unit.route';
import facultyRoutes from './routes/faculty/faculty.route';
import enrollmentRoutes from './routes/enrollment/enrollment.route';
import examRoutes from './routes/exam/exam.route';
import marksRoutes from './routes/marks/marks.route';
import batchRoutes from './routes/batch/batch.route';
import programOutcomeRoutes from './routes/programOutcome/programOutcome.route';
import courseSubjectMappingRoutes from './routes/course/course-subject-mapping.route';
import courseOutcomeRoutes from './routes/course/courseOutcome.route'
import poAttainmentRotes from './routes/programOutcome/poAttainment.routes';

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: ['http://localhost:3000', 'https://your-production-domain.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/subjects', subjectRoutes);
app.use('/api/v1/units', unitRoutes);
app.use('/api/v1/batch', batchRoutes);
app.use('/api/v1/faculty', facultyRoutes);
app.use('/api/v1/enrollments', enrollmentRoutes);
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/marks', marksRoutes);
app.use('/api/v1/program-outcomes', programOutcomeRoutes);
app.use('/api/v1/courseOutcome', courseOutcomeRoutes);
app.use('/api/v1/course-subject-mapping', courseSubjectMappingRoutes);
app.use('/api/v1/po-attainment', poAttainmentRotes);


app.get('/', (req: Request, res: Response) => {
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