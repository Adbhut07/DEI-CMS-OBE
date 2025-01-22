import CreateUserForm from "./create-user-form"

export default function CreateUserPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Create New User</h1>
      <CreateUserForm />
    </div>
  )
}

