import { NextRequest, NextResponse } from 'next/server';

/**
 * API route handler for PO report generation
 * Proxies requests to the backend API for PDF generation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string; batchId: string } }
) {
  try {
    const { courseId, batchId } = params;
    
    // Proxy to your backend API
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5000'; // Set your actual backend URL in env
    const response = await fetch(
      `${backendUrl}/api/reports/po/${courseId}/${batchId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers if needed
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to generate report' },
        { status: response.status }
      );
    }

    // Get the PDF data
    const pdfData = await response.arrayBuffer();
    
    // Return the PDF with appropriate headers
    return new NextResponse(pdfData, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=PO_Report_${courseId}_${batchId}.pdf`,
      },
    });
  } catch (error) {
    console.error('Error generating PO report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}