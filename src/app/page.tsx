"use client"

import { useState, useEffect } from "react"
import { addItem } from "./actions"

export default function Home() {
  const [items, setItems] = useState<{ _id: string; name: string; createdAt: string }[]>([])
  const [newItemName, setNewItemName] = useState("")

  useEffect(() => {
    const eventSource = new EventSource("/api/sse")

    eventSource.onmessage = (event) => {
      const newItem = JSON.parse(event.data)
      setItems((prevItems) => [...prevItems, newItem])
    }

    return () => {
      eventSource.close()
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e:any) => {
    e.preventDefault()
    if (newItemName.trim()) {
      await addItem(newItemName)
      setNewItemName("")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Real-time Item List</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Enter item name"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Item
        </button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item._id} className="mb-2">
            {item.name} - {new Date(item.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  )
}

