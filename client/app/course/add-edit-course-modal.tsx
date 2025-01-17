import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { PlusCircle, Trash2 } from 'lucide-react'

// Assume we have a list of faculty members
const facultyMembers = [
  { id: 1, name: 'Dr. John Doe' },
  { id: 2, name: 'Prof. Jane Smith' },
  { id: 3, name: 'Dr. Bob Johnson' },
]

interface AddEditCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (course: any) => void
  course?: any
}

export default function AddEditCourseModal({
  isOpen,
  onClose,
  onSave,
  course,
}: AddEditCourseModalProps) {
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: course || {
      courseName: '', 
      semesters: [
        {
          name: 'Semester 1',
          subjects: [
            {
              subjectName: '',
            //   facultyId: '',
              units: [{ unitNumber: 1, description: '' }]
            }
          ]
        }
      ]
    }
  })

  const { fields: semesterFields, append: appendSemester, remove: removeSemester } = useFieldArray({
    control,
    name: "semesters"
  })

  useEffect(() => {
    if (course) {
      reset(course)
    }
  }, [course, reset])

  const onSubmit = (data: any) => {
    onSave(data)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{course ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="courseName" className="text-right">
                Course Name
              </Label>
              <Input
                id="courseName"
                {...register("courseName")}
                className="col-span-3"
              />
            </div>

            {semesterFields.map((semesterField, semesterIndex) => (
              <div key={semesterField.id} className="border p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Semester {semesterIndex + 1}</h3>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSemester(semesterIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  {...register(`semesters.${semesterIndex}.name`)}
                  placeholder="Semester Name"
                  className="mb-2"
                />
                <SubjectFields
                  nestIndex={semesterIndex}
                  {...{ control, register }}
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendSemester({ name: `Semester ${semesterFields.length + 1}`, subjects: [] })}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Semester
            </Button>
          </div>
          <DialogFooter>
            <Button type="submit">Save Course</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SubjectFields({ nestIndex, control, register }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `semesters.${nestIndex}.subjects`
  });

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} className="border-t pt-2 mt-2">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Subject {index + 1}</h4>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Input
            {...register(`semesters.${nestIndex}.subjects.${index}.subjectName`)}
            placeholder="Subject Name"
            className="mb-2"
          />
          {/* <Controller
            name={`semesters.${nestIndex}.subjects.${index}.facultyId`}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Faculty" />
                </SelectTrigger>
                <SelectContent>
                  {facultyMembers.map((faculty) => (
                    <SelectItem key={faculty.id} value={faculty.id.toString()}>
                      {faculty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          /> */}
          <UnitFields
            nestIndex={[nestIndex, index]}
            {...{ control, register }}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ subjectName: '', units: [] })}  //facultyId: ''
        className="mt-2"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Subject
      </Button>
    </div>
  );
}

function UnitFields({ nestIndex, control, register }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `semesters.${nestIndex[0]}.subjects.${nestIndex[1]}.units`
  });

  return (
    <div className="ml-4 mt-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2 mb-2">
          <Input
            {...register(`semesters.${nestIndex[0]}.subjects.${nestIndex[1]}.units.${index}.unitNumber`)}
            placeholder="Unit Number"
            className="w-20"
          />
          <Input
            {...register(`semesters.${nestIndex[0]}.subjects.${nestIndex[1]}.units.${index}.description`)}
            placeholder="Unit Description"
            className="flex-grow"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => remove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ unitNumber: fields.length + 1, description: '' })}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Unit
      </Button>
    </div>
  );
}

