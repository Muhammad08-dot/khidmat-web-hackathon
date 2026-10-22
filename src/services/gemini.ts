import { getDistanceKm, type LocationCoords } from '../utils/location';
import type { PriceEstimateResult } from '../types';
export type { PriceEstimateResult };

export interface ParsedIntent {
  category: string;
  urgency: 'low' | 'medium' | 'high';
  summary: string;
}

export interface RankedProviderResult {
  userId: string;
  reason: string;
}

export const SPECIALTIES = [
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "AC Technician",
  "House Cleaner",
  "Appliance Repair",
  "Mechanic",
  "Gardener",
  "Movers & Packers",
  "Pest Control",
  "CCTV Technician",
  "Welder",
  "Mason",
  "Handyman",
  "Photographer",
  "Videographer",
  "Event Decorator",
  "DJ",
  "Caterer",
  "Waiter/Server"
];

// Open-Weight Gemma 4 Model Configuration (Apache 2.0 License)
export const GEMMA_MODELS = {
  default: import.meta.env.VITE_GEMMA_MODEL || import.meta.env.VITE_GEMINI_MODEL || "gemma-4-26b-a4b-it",
  fast: "gemma-4-26b-a4b-it",
  balanced: "gemma-4-26b-a4b-it",
  pro: "gemma-4-31b-it"
} as const;

/**
 * Extracts and sanitizes JSON payload from model response,
 * removing any markdown code blocks or surrounding text.
 */
const safeParseJson = <T>(text: string, fallback: T): T => {
  try {
    const trimmed = text.trim();
    // 1. Check for standard markdown code block
    const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    const candidate = codeBlockMatch ? codeBlockMatch[1].trim() : trimmed;

    // 2. Direct parse attempt
    return JSON.parse(candidate) as T;
  } catch (err) {
    // 3. Fallback: search for first '{' or '[' to last '}' or ']'
    try {
      const firstCurly = text.indexOf('{');
      const lastCurly = text.lastIndexOf('}');
      const firstSquare = text.indexOf('[');
      const lastSquare = text.lastIndexOf(']');

      if (firstCurly !== -1 && lastCurly !== -1 && (firstSquare === -1 || firstCurly < firstSquare)) {
        return JSON.parse(text.substring(firstCurly, lastCurly + 1)) as T;
      }
      if (firstSquare !== -1 && lastSquare !== -1) {
        return JSON.parse(text.substring(firstSquare, lastSquare + 1)) as T;
      }
    } catch {
      // ignore
    }

    // 4. Regex extraction for intent if model responded with plain text/markdown bullets
    if (fallback && typeof fallback === 'object' && 'category' in (fallback as any)) {
      const fb = fallback as unknown as ParsedIntent;
      const lower = text.toLowerCase();
      const matchedCat = SPECIALTIES.find(s => lower.includes(s.toLowerCase()));
      if (matchedCat) {
        let urg: 'low' | 'medium' | 'high' = fb.urgency;
        if (lower.includes('high') || lower.includes('urgent')) urg = 'high';
        else if (lower.includes('medium') || lower.includes('normal')) urg = 'medium';
        return {
          category: matchedCat,
          urgency: urg,
          summary: fb.summary
        } as unknown as T;
      }
    }

    console.warn("[Gemma] JSON parsing failed, using fallback state:", err);
    return fallback;
  }
};

/**
 * Fallback parser using intelligent keyword analysis.
 * Ensures the app works seamlessly offline or when no API key is provided.
 */
const localFallbackParser = (text: string): ParsedIntent => {
  const lowercaseText = text.toLowerCase();
  
  let category = "Handyman";
  if (lowercaseText.match(/\b(wire|spark|electricity|meter|short|fan|switch|circuit|board|light)\b/)) {
    category = "Electrician";
  } else if (lowercaseText.match(/\b(leak|pipe|water|drain|plumb|basin|tap|commode|flush|sewer|toilet|sink)\b/)) {
    category = "Plumber";
  } else if (lowercaseText.match(/\b(wood|sofa|door|table|chair|bed|carpenter|cabinet|furniture|wardrobe)\b/)) {
    category = "Carpenter";
  } else if (lowercaseText.match(/\b(paint|wall|putty|distemper|brush|color|stain|weather|polish)\b/)) {
    category = "Painter";
  } else if (lowercaseText.match(/\b(ac|air conditioner|inverter|cooling|compressor|split|chiller|hvac)\b/)) {
    category = "AC Technician";
  } else if (lowercaseText.match(/\b(clean|sweep|dust|wash|broom|maid|mop|cleaner|vacuum|disinfect)\b/)) {
    category = "House Cleaner";
  } else if (lowercaseText.match(/\b(fridge|refrigerator|oven|microwave|washing|appliance|dryer|stove|freezer)\b/)) {
    category = "Appliance Repair";
  } else if (lowercaseText.match(/\b(car|bike|motorcycle|engine|brakes|mechanic|suspension|tire|puncture)\b/)) {
    category = "Mechanic";
  } else if (lowercaseText.match(/\b(garden|lawn|plant|flower|grass|tree|soil|pruning|seeds|nursery)\b/)) {
    category = "Gardener";
  } else if (lowercaseText.match(/\b(shift|pack|move|truck|carton|cargo|delivery|luggage|shifter)\b/)) {
    category = "Movers & Packers";
  } else if (lowercaseText.match(/\b(pest|termite|cockroach|insect|spray|bedbug|mosquito|fumigation|bugs)\b/)) {
    category = "Pest Control";
  } else if (lowercaseText.match(/\b(cctv|camera|dvr|ip camera|security camera|surveillance|nvr)\b/)) {
    category = "CCTV Technician";
  } else if (lowercaseText.match(/\b(weld|iron|gate|grill|railing|metal|fabricat|soldering)\b/)) {
    category = "Welder";
  } else if (lowercaseText.match(/\b(brick|mason|cement|plaster|concrete|marble|tile|slab|wall building)\b/)) {
    category = "Mason";
  } else if (lowercaseText.match(/\b(mount|hang|lock|drill|mirror|shelf|curtain|fixture|repair|installation)\b/)) {
    category = "Handyman";
  } else if (lowercaseText.match(/\b(photo|photography|shoot|portrait|lens|studio|camera shoot)\b/)) {
    category = "Photographer";
  } else if (lowercaseText.match(/\b(video|videography|drone|cinema|shoot|movie|reel|recording)\b/)) {
    category = "Videographer";
  } else if (lowercaseText.match(/\b(decor|decoration|stage|flower arrangements|balloon|theme|birthday|event|party)\b/)) {
    category = "Event Decorator";
  } else if (lowercaseText.match(/\b(dj|music|sound system|speakers|audio setup|party dj)\b/)) {
    category = "DJ";
  } else if (lowercaseText.match(/\b(cater|catering|food service|buffet|daawat|cooking service|biryani order)\b/)) {
    category = "Caterer";
  } else if (lowercaseText.match(/\b(waiter|serve|staff|table service|serving boy|hospitality)\b/)) {
    category = "Waiter/Server";
  }

  let urgency: 'low' | 'medium' | 'high' = 'low';
  if (lowercaseText.match(/\b(urgent|emergency|immediate|now|quick|flood|fire|spark|burst|danger|hazard|asap)\b/)) {
    urgency = 'high';
  } else if (lowercaseText.match(/\b(soon|tomorrow|broken|not working|damaged|repair|fix|leak|malfunction)\b/)) {
    urgency = 'medium';
  }

  let summary = `Requested ${category} service.`;
  if (text.length > 5) {
    const cleanText = text.replace(/[.\n]/g, ' ').trim();
    summary = cleanText.length > 60 ? cleanText.substring(0, 57) + '...' : cleanText;
  }

  return { category, urgency, summary };
};

/**
 * Call Open-Weight Google Gemma 2 model via Google Generative AI REST endpoint.
 */
const callGemmaAPI = async (prompt: string, model: string = GEMMA_MODELS.default): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMMA_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('API key missing or placeholder.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Add 4-second timeout so remote API latency never freezes the UI
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemma API (${model}) returned HTTP status ${response.status}`);
    }

    const result = await response.json();
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      throw new Error(`Empty response from Gemma (${model}) model.`);
    }

    return responseText.trim();
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Parses user input using Open-Weight Google Gemma (gemma-2-9b-it)
 */
export const parseServiceIntent = async (userInput: string): Promise<ParsedIntent> => {
  const fallback = localFallbackParser(userInput);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMMA_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn(`[Gemma] API Key missing. Using local fallback for model: ${GEMMA_MODELS.default}`);
    await new Promise(resolve => setTimeout(resolve, 1200));
    return fallback;
  }

  try {
    const prompt = `You are the AI Intent Parser for "Khidmat", an on-demand home services marketplace in Pakistan running on the Google Gemma 2 open-weight model.
Analyze the following user service request: "${userInput}".

Valid service categories:
${SPECIALTIES.join(", ")}

Task:
1. Select exactly one category from the valid categories list.
2. Determine urgency: "low", "medium", or "high".
3. Provide a one-line concise job summary.

Respond ONLY with valid JSON in this exact structure without extra commentary:
{
  "category": "exact category from the list",
  "urgency": "low" | "medium" | "high",
  "summary": "concise description"
}`;

    const rawResponse = await callGemmaAPI(prompt, GEMMA_MODELS.default);
    const parsed = safeParseJson<ParsedIntent>(rawResponse, fallback);

    if (!SPECIALTIES.includes(parsed.category)) {
      parsed.category = fallback.category;
    }

    return parsed;
  } catch (error) {
    console.error(`[Gemma: ${GEMMA_MODELS.default}] API call failed, falling back to local matrix. Error:`, error);
    return fallback;
  }
};

/**
 * Provider ranking using Open-Weight Gemma 2
 */
export const rankProvidersWithAI = async (
  category: string,
  userCoords: LocationCoords,
  providersList: any[]
): Promise<RankedProviderResult[]> => {
  // 1. Prepare local ranking matrix
  const localRanked = providersList
    .map(p => {
      const distance = getDistanceKm(userCoords.lat, userCoords.lng, p.location.lat, p.location.lng);
      let score = (p.rating * 15) - (distance * 2);
      if (p.tier === 'Platinum') score += 10;
      else if (p.tier === 'Gold') score += 6;
      else if (p.tier === 'Silver') score += 3;
      score += (p.totalJobs * 0.1);

      let reason = `${p.name} is recommended with a solid ${p.rating} rating and is located only ${distance} km away.`;
      if (p.tier === 'Platinum') {
        reason = `Top Choice: ${p.name} is a Platinum worker located ${distance} km away with an outstanding ${p.rating} rating and ${p.totalJobs} completed jobs.`;
      } else if (p.tier === 'Gold') {
        reason = `Expert match: ${p.name} holds a Gold tier status and offers reliable services just ${distance} km from your pinned location.`;
      } else if (distance < 1.5) {
        reason = `Nearby option: ${p.name} is located only ${distance} km away, ensuring rapid arrival.`;
      }

      return {
        userId: p.userId,
        score,
        reason
      };
    })
    .sort((a, b) => b.score - a.score)
    .map(item => ({ userId: item.userId, reason: item.reason }));

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMMA_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || providersList.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return localRanked.slice(0, 5);
  }

  try {
    const simplifiedProviders = providersList.slice(0, 10).map(p => {
      const dist = getDistanceKm(userCoords.lat, userCoords.lng, p.location.lat, p.location.lng);
      return {
        userId: p.userId,
        name: p.name,
        rating: p.rating,
        totalJobs: p.totalJobs,
        tier: p.tier,
        basePrice: p.basePrice,
        bio: p.bio,
        distanceKm: dist
      };
    });

    const prompt = `You are the Provider Matcher AI for "Khidmat" powered by Google Gemma 2 open-weight model.
Customer seeking "${category}" service at lat: ${userCoords.lat}, lng: ${userCoords.lng}.

Available providers:
${JSON.stringify(simplifiedProviders)}

Rank the top 3-5 providers based on proximity, rating, tier, and jobs. Write a friendly, conversational reason for each.
Respond ONLY with a valid JSON array in this exact format:
[
  {
    "userId": "provider_userId_here",
    "reason": "explanation sentence mentioning distance and rating"
  }
]`;

    const rawResponse = await callGemmaAPI(prompt, GEMMA_MODELS.default);
    const parsed = safeParseJson<RankedProviderResult[]>(rawResponse, localRanked.slice(0, 5));
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : localRanked.slice(0, 5);
  } catch (error) {
    console.error(`[Gemma: ${GEMMA_MODELS.default}] Provider ranking failed, using local matrix. Error:`, error);
    return localRanked.slice(0, 5);
  }
};

/**
 * Job Price Estimation using Gemma 2
 */
export const estimateJobPriceWithAI = async (
  category: string,
  jobSummary: string,
  distanceKm: number
): Promise<PriceEstimateResult> => {
  const baseCategoryRates: Record<string, { min: number; max: number; hours: number }> = {
    "Electrician": { min: 600, max: 1800, hours: 1.5 },
    "Plumber": { min: 500, max: 1500, hours: 1.5 },
    "Carpenter": { min: 800, max: 2500, hours: 2.5 },
    "Painter": { min: 1000, max: 3500, hours: 4.0 },
    "AC Technician": { min: 1200, max: 3500, hours: 2.0 },
    "House Cleaner": { min: 800, max: 2200, hours: 3.0 },
    "Appliance Repair": { min: 700, max: 2000, hours: 1.5 },
    "Mechanic": { min: 800, max: 3000, hours: 2.0 },
    "Gardener": { min: 500, max: 1500, hours: 2.0 },
    "Movers & Packers": { min: 3000, max: 10000, hours: 5.0 },
    "Pest Control": { min: 1500, max: 4500, hours: 2.0 },
    "CCTV Technician": { min: 1000, max: 3000, hours: 2.5 },
    "Welder": { min: 800, max: 2500, hours: 2.0 },
    "Mason": { min: 1200, max: 4000, hours: 4.0 },
    "Handyman": { min: 500, max: 1500, hours: 1.5 },
    "Photographer": { min: 3000, max: 15000, hours: 3.0 },
    "Videographer": { min: 4000, max: 20000, hours: 4.0 },
    "Event Decorator": { min: 5000, max: 25000, hours: 4.0 },
    "DJ": { min: 5000, max: 20000, hours: 4.0 },
    "Caterer": { min: 5000, max: 30000, hours: 5.0 },
    "Waiter/Server": { min: 1000, max: 3000, hours: 5.0 }
  };

  const defaults = baseCategoryRates[category] || { min: 600, max: 1800, hours: 1.5 };
  const travelAllowance = Math.round(100 + Math.max(0, distanceKm - 1) * 20);
  const estimatedMin = defaults.min + travelAllowance;
  const estimatedMax = defaults.max + travelAllowance;

  const localPriceEstimate: PriceEstimateResult = {
    minPrice: Math.round(estimatedMin / 50) * 50,
    maxPrice: Math.round(estimatedMax / 50) * 50,
    avgPrice: Math.round(((estimatedMin + estimatedMax) / 2) / 50) * 50,
    estimatedHours: defaults.hours,
    complexity: 'medium',
    explanation: `Calculated from typical PKR market rates for ${category} tasks and includes a Rs. ${travelAllowance} travel allowance for a ${distanceKm} km trip.`
  };

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMMA_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    await new Promise(resolve => setTimeout(resolve, 600));
    return localPriceEstimate;
  }

  try {
    const prompt = `You are the Pricing Specialist AI for "Khidmat" powered by Google Gemma 2 open-weight model.
Estimate a realistic price range in PKR (Pakistani Rupees):
- Category: "${category}"
- Details: "${jobSummary}"
- Distance: ${distanceKm} km (Travel fee: Rs. ${travelAllowance})

Respond ONLY with valid JSON in this exact structure:
{
  "minPrice": 800,
  "maxPrice": 1500,
  "avgPrice": 1150,
  "estimatedHours": 1.5,
  "complexity": "simple" | "medium" | "complex",
  "explanation": "concise explanation sentence"
}`;

    const rawResponse = await callGemmaAPI(prompt, GEMMA_MODELS.default);
    const parsed = safeParseJson<PriceEstimateResult>(rawResponse, localPriceEstimate);
    return parsed;
  } catch (error) {
    console.error(`[Gemma: ${GEMMA_MODELS.default}] Price estimation failed, using local calculation. Error:`, error);
    return localPriceEstimate;
  }
};

/**
 * Supervise Site Agent Response using Gemma 2
 */
export const superviseSiteAgentResponse = async (question: string, proposedResponse: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMMA_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return proposedResponse;
  }

  try {
    const prompt = `You are the Supervisor Agent for "Khidmat" running on Google Gemma 2.
Inspect the user question and the proposed answer to ensure it only addresses Khidmat services (Cash on delivery, 21 local home service categories, tiers, bookings).

User Question: "${question}"
Proposed Answer: "${proposedResponse}"

If the proposed answer is appropriate and accurate, return it as is. If off-topic or contains unsupported claims, provide a corrected polite answer.`;

    const response = await callGemmaAPI(prompt, GEMMA_MODELS.default);
    return response || proposedResponse;
  } catch (error) {
    console.error(`[Gemma: ${GEMMA_MODELS.default}] Supervisor agent failed:`, error);
    return proposedResponse;
  }
};

/**
 * Site Agent Q&A powered by Gemma 2
 */
export const askSiteAgent = async (question: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMMA_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    await new Promise(resolve => setTimeout(resolve, 800));
    return "I am currently running on Khidmat's local fallback knowledge base. Please configure your Gemma API key in .env to enable live open-weight Gemma 2 inference!";
  }

  try {
    const prompt = `You are the AI Assistant for "Khidmat", an on-demand marketplace for home and labor services in Pakistan.
Model: Google Gemma 2 (${GEMMA_MODELS.default}).

Platform details:
- Matches users with 21 local worker categories (Electrician, Plumber, AC Repair, Mason, Welder, etc.).
- Pricing in PKR with automatic distance travel allowance (Rs 100 base + Rs 20/km).
- Payments are currently Cash on Delivery (COD).
- Features real-time chat, tier rankings (Bronze, Silver, Gold, Platinum).

Question from user: "${question}"
Respond helpfully, politely, and concisely in the same language or script (English, Urdu, or Roman Urdu).`;

    const rawResponse = await callGemmaAPI(prompt, GEMMA_MODELS.default);
    return rawResponse;
  } catch (error) {
    console.error(`[Gemma: ${GEMMA_MODELS.default}] Site Agent call failed:`, error);
    return "Sorry, I am having trouble connecting to the Gemma service right now. Please try again shortly.";
  }
};
