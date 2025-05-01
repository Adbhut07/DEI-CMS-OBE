// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// /**
//  * API handler to fetch all courses
//  */
// export async function GET(request: NextRequest) {
//   try {
//     const courses = await prisma.course.findMany({
//       select: {
//         id: true,
//         courseName: true,
//       },
//       orderBy: {
//         courseName: 'asc',
//       },
//     });

//     return NextResponse.json(courses);
//   } catch (error) {
//     console.error('Error fetching courses:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch courses' },
//       { status: 500 }
//     );
//   }
// }