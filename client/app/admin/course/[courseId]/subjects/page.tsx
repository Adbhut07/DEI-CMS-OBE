'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusCircle, Edit, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'

interface Subject {
  id: number;
  subjectName: string;
  subjectCode: string;
  createdAt: string;
  updatedAt: string;
}

interface Batch {
  id: number;
  batchYear: number;
  courseId: number;
  createdAt: string;
  updatedAt: string;
}

interface CourseSubjectMapping {
  id: number;
  courseId: number;
  subjectId: number;
  semester: number;
  facultyId: number | null;
  batchId: number;
  subject: Subject;
}

interface MapSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mapping: { subjectId: number; semester: number; batchId: number }) => void;
  subjects: Subject[];
  batches: Batch[];
}

export default function SubjectsPage() {
  const params = useParams();
  const courseId = parseInt(params.courseId as string);
  const [courseSubjects, setCourseSubjects] = useState<CourseSubjectMapping[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMappingLoading, setIsMappingLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (courseId) {
      fetchCourseSubjects();
      fetchAllSubjects();
      fetchBatches();
    }
  }, [courseId]);

  const fetchCourseSubjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/courses/getAllCourses`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch course subjects');
      const result = await response.json();
      if (result.success) {
        const course = result.data.find((c: any) => c.id === courseId);
        if (course) {
          setCourseSubjects(course.subjects || []);
        } else {
          throw new Error('Course not found');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch course subjects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllSubjects = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/subjects/getAllSubjects', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch subjects');
      const result = await response.json();
      if (result.success) {
        setAllSubjects(result.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch all subjects. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/batch/course/${courseId}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch batches');
      const result = await response.json();
      if (result.success) {
        setBatches(result.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch batches. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMapSubject = () => {
    setIsModalOpen(true);
  };

  const handleSaveMapping = async (mapping: { subjectId: number; semester: number; batchId: number }) => {
    setIsMappingLoading(true);
    try {
      const payload = {
        courseId,
        subjectId: mapping.subjectId,
        semester: mapping.semester,
        batchId: mapping.batchId
      };
      
      const response = await fetch('http://localhost:8000/api/v1/course-subject-mapping/map', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to map subject');
      }
      
      await fetchCourseSubjects();
      setIsModalOpen(false);
      
      toast({
        title: "Success",
        description: "Subject mapped successfully to the course.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to map subject. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMappingLoading(false);
    }
  };

  const handleDeleteMapping = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this subject from the course?')) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/v1/course-subject-mapping/unmap/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to remove subject mapping');
        }
        
        await fetchCourseSubjects();
        
        toast({
          title: "Success",
          description: "Subject mapping removed successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to remove subject mapping. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Get already mapped subject IDs to filter out from available subjects
  const mappedSubjectIds = courseSubjects.map(cs => cs.subjectId);
  const availableSubjects = allSubjects.filter(subject => !mappedSubjectIds.includes(subject.id));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Course Subjects</h1>
      
      <Button 
        onClick={handleMapSubject} 
        className="mb-4" 
        disabled={isLoading || availableSubjects.length === 0 || batches.length === 0}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Map Subject to Course
      </Button>
      
      {batches.length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>No batches available for this course. Please create a batch first.</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : courseSubjects.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-gray-500">No subjects mapped to this course yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject Code</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseSubjects.map((mapping) => (
                <TableRow key={mapping.id}>
                  <TableCell>{mapping.subject.subjectCode}</TableCell>
                  <TableCell>{mapping.subject.subjectName}</TableCell>
                  <TableCell>Semester {mapping.semester}</TableCell>
                  <TableCell>
                    {batches.find(b => b.id === mapping.batchId)?.batchYear || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteMapping(mapping.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <MapSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMapping}
        subjects={availableSubjects}
        batches={batches}
      />
    </div>
  );
}

function MapSubjectModal({ isOpen, onClose, onSave, subjects, batches }: MapSubjectModalProps) {
  const [formData, setFormData] = useState({
    subjectId: 0,
    semester: 1,
    batchId: 0,
  });

  useEffect(() => {
    // Reset form or set initial values when modal opens
    if (isOpen) {
      setFormData({
        subjectId: subjects.length > 0 ? subjects[0].id : 0,
        semester: 1,
        batchId: batches.length > 0 ? batches[0].id : 0,
      });
    }
  }, [isOpen, subjects, batches]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.subjectId === 0) {
      alert('Please select a subject');
      return;
    }
    
    if (formData.batchId === 0) {
      alert('Please select a batch');
      return;
    }
    
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Map Subject to Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="subject">Subject</label>
              <Select
                value={formData.subjectId.toString()}
                onValueChange={(value) => handleChange('subjectId', parseInt(value))}
                disabled={subjects.length === 0}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.subjectCode} - {subject.subjectName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="semester">Semester</label>
              <Input
                id="semester"
                type="number"
                min="1"
                max="8"
                value={formData.semester}
                onChange={(e) => handleChange('semester', parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="batch">Batch</label>
              <Select
                value={formData.batchId.toString()}
                onValueChange={(value) => handleChange('batchId', parseInt(value))}
                disabled={batches.length === 0}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id.toString()}>
                      {batch.batchYear}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={subjects.length === 0 || batches.length === 0}>
              Map Subject
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}