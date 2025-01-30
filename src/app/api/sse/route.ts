import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "../../../lib/db"
import item from "../../../models/item"

export async function GET(req: NextRequest) {
  const responseStream = new TransformStream()
  const writer = responseStream.writable.getWriter()
  const encoder = new TextEncoder()

  // Connect to the database
  await dbConnect()

  // Set up change stream
  const changeStream = item.watch()

  changeStream.on("change", async (change) => {
    if (change.operationType === "insert") {
      const newItem = change.fullDocument
      await writer.write(encoder.encode(`data: ${JSON.stringify(newItem)}\n\n`))
    }
  })

  // Keep the connection alive
  const keepAlive = setInterval(async () => {
    await writer.write(encoder.encode(": keepalive\n\n"))
  }, 30000)

  req.signal.addEventListener("abort", () => {
    clearInterval(keepAlive)
    changeStream.close()
    writer.close()
  })

  return new NextResponse(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

