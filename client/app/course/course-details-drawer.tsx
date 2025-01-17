import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Course } from './types'

interface CourseDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  course: Course | null
}

export default function CourseDetailsDrawer({
  isOpen,
  onClose,
  course,
}: CourseDetailsDrawerProps) {
  if (!course) return null

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{course.name}</DrawerTitle>
          <DrawerDescription>Course Code: {course.code}</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <h3 className="font-semibold mb-2">Course Description</h3>
          <p className="text-sm text-gray-600 mb-4">{course.description || 'No description available.'}</p>
          
          <h3 className="font-semibold mb-2">Faculty Details</h3>
          <p className="text-sm text-gray-600">Name: {course.faculty}</p>
          <p className="text-sm text-gray-600">Email: {course.faculty.toLowerCase().replace(' ', '.')}@university.edu</p>
          <p className="text-sm text-gray-600 mb-4">Phone: (555) 123-4567</p>
          
          <h3 className="font-semibold mb-2">Student List</h3>
          <ul className="text-sm text-gray-600 list-disc list-inside">
            <li>John Smith</li>
            <li>Emma Johnson</li>
            <li>Michael Brown</li>
            <li>Sophia Davis</li>
            <li>William Wilson</li>
          </ul>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

