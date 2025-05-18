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
import studentRoutes from './routes/student/student.route';
import semesterRoutes from './routes/semester/semester.route';

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:3000', 'https://cognitia.asdevx.com'];

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // enable preflight
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
app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/semester', semesterRoutes);


app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});






