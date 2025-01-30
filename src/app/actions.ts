"use server"

import dbConnect from "../lib/db"
import Item from "../models/item"

export async function addItem(name: string) {
  await dbConnect()
  const newItem = new Item({ name })
  await newItem.save()
  return newItem
}

export async function getItems() {
  await dbConnect()
  const items = await Item.find().sort({ createdAt: -1 }).limit(50)
  return items
}

