import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const { deal } = await req.json()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
You are a sales coach analyzing a CRM deal. Return ONLY a valid JSON object, no markdown, no code fences.

Deal data:
- Title: ${deal.title}
- Value: $${deal.value ?? "not set"}
- Stage: ${deal.stage}
- Days in current stage: ${deal.daysInStage}
- Last activity: ${deal.lastActivityDate ?? "never"}
- Total activities logged: ${deal.activityCount}
- Expected close date: ${deal.expectedCloseDate ?? "not set"}
- Priority: ${deal.priority}

Respond with exactly this JSON structure:
{
  "score": <number 0-100>,
  "status": <"hot" | "on_track" | "at_risk" | "stalled">,
  "insight": <2-3 sentence analysis>,
  "next_action": <specific recommended next step>
}
`
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    const parsed = JSON.parse(cleaned)

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("AI analyze error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze deal" },
      { status: 500 }
    )
  }
}