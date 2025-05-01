// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// /**
//  * API handler to fetch batches for a specific course
//  */
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { courseId: string } }
// ) {
//   try {
//     const { courseId } = params;
    
//     if (!courseId || isNaN(parseInt(courseId))) {
//       return NextResponse.json(
//         { error: 'Invalid course ID' },
//         { status: 400 }
//       );
//     }

//     const batches = await prisma.batch.findMany({
//       where: {
//         courseId: parseInt(courseId),
//       },
//       select: {
//         id: true,
//         batchYear: true,
//       },
//       orderBy: {
//         batchYear: 'desc',
//       },
//     });

//     return NextResponse.json(batches);
//   } catch (error) {
//     console.error('Error fetching batches:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch batches' },
//       { status: 500 }
//     );
//   }
// }