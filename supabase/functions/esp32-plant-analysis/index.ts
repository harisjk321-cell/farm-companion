import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, analysisType } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    let prompt = "";
    
    if (analysisType === "quick") {
      prompt = `You will be shown an image. Reply ONLY with valid JSON (no surrounding text) in this exact schema:

{"is_plant": <true|false>, "confidence": <0-100 number>, "notes": "short note or empty string"}

Use the image as the only evidence. Answer concisely.`;
    } else {
      prompt = `You are an expert plant diagnostician. Given the image supplied, reply in valid JSON only (no extra text) following this EXACT schema:

{
  "species": { "name": "<common or scientific name or 'unknown'>", "confidence": "<0-100 percentage as number>" },
  "weeds_present": { "value": <true|false>, "confidence": "<0-100 percentage as number>", "notes": "<short note or empty string>" },
  "growth_level": "<0-100 percentage as number>",
  "pest_level": "<0-100 percentage as number>",
  "diseases_visible": { "value": <true|false>, "confidence": "<0-100 percentage as number>", "notes": ["short explanation strings if any symptoms are seen"] },
  "estimated_NPK": { "nitrogen": "<value or 'unknown'>", "phosphorous": "<value or 'unknown'>", "potassium": "<value or 'unknown'>", "confidence": "<0-100 percentage as number>" },
  "explanations": "<one short paragraph summarizing the evidence behind the above (max 2 sentences)>"
}

Rules:
- Return ONLY valid JSON. No backticks. No explanations outside JSON.
- Use numbers 0-100 where required.
- If not identifiable, put 'unknown' with confidence 0.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      throw new Error(`AI analysis failed: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content;

    if (!analysisText) {
      throw new Error("No analysis returned from AI");
    }

    // Extract JSON from the response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in esp32-plant-analysis:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
