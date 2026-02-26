import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

const DEFAULT_GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"] as const

const MODEL_UNAVAILABLE_PATTERNS = [
  "no longer available",
  "not found for api version",
  "is not found",
  "404",
] as const

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
    const requestedModel = process.env.GEMINI_MODEL?.trim()
    const candidateModels = [requestedModel, ...DEFAULT_GEMINI_MODELS].filter(
      (modelName, index, all): modelName is string =>
        Boolean(modelName) && all.indexOf(modelName) === index
    )

    const prompt = `
Você é um coach de vendas analisando uma oportunidade de CRM. Retorne APENAS um objeto JSON válido, sem markdown e sem blocos de código.

Dados da oportunidade:
- Título: ${deal.title}
- Valor: $${deal.value ?? "não definido"}
- Etapa: ${deal.stage}
- Dias na etapa atual: ${deal.daysInStage}
- Última atividade: ${deal.lastActivityDate ?? "nunca"}
- Total de atividades registradas: ${deal.activityCount}
- Data prevista de fechamento: ${deal.expectedCloseDate ?? "não definida"}
- Prioridade: ${deal.priority}

Responda exatamente com esta estrutura JSON:
{
  "score": <número de 0 a 100>,
  "status": <"hot" | "on_track" | "at_risk" | "stalled">,
  "insight": <análise de 2 a 3 frases em português do Brasil>,
  "next_action": <próxima ação específica recomendada em português do Brasil>
}

Regras obrigatórias:
- Escreva os campos "insight" e "next_action" em português do Brasil (pt-BR).
- Não traduza as chaves do JSON.
- Não inclua texto fora do JSON.
`
    let lastError: unknown
    let result:
      | Awaited<ReturnType<ReturnType<typeof genAI.getGenerativeModel>["generateContent"]>>
      | undefined

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        result = await model.generateContent(prompt)
        break
      } catch (error) {
        lastError = error
        const message = (error instanceof Error ? error.message : String(error)).toLowerCase()
        const unavailableModel = MODEL_UNAVAILABLE_PATTERNS.some((pattern) => message.includes(pattern))

        if (!unavailableModel) {
          throw error
        }
      }
    }

    if (!result) {
      throw lastError instanceof Error
        ? lastError
        : new Error("Unable to generate analysis with any configured Gemini model")
    }

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