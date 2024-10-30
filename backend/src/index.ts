import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';

import semesterRoutes from './routes/semester.route';
import subjectRoutes from './routes/subject.route';
import enrollmentRoutes from './routes/enrollment.route';
import examRoutes from './routes/exam.route';
import questionRoutes from './routes/question.route';
import marksRoutes from './routes/marks.route';
import userRoutes from './routes/user.route';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/semesters', semesterRoutes);
app.use('/api/v1/subjects', subjectRoutes);
app.use('/api/v1/enrollments', enrollmentRoutes);
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/marks', marksRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/exam', examRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});