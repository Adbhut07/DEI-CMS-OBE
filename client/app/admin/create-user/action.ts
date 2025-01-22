"use server"

interface UserData {
  name: string
  email: string
  password: string
  role: string
}

export async function createUser(userData: UserData) {
  const response = await fetch("http://localhost:8000/api/v1/users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    throw new Error("Failed to create user")
  }

  return await response.json()
}

