"use server"

interface UserData {
  name: string
  email: string
  password: string
  role: string
}

export async function createUser(userData: UserData) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/users/`, {
    credentials: "include",
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

