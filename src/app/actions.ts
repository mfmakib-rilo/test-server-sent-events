"use server"

import dbConnect from "../lib/db"
import item from "../models/item"

export async function addItem(name: string) {
  await dbConnect()
  const newItem = new item({ name })
  await newItem.save()
  return newItem
}

