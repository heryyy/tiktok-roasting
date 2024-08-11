import { NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { RateLimiterMemory } from "rate-limiter-flexible";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Konfigurasi Rate Limiter
const rateLimiter = new RateLimiterMemory({
  points: 5, // Number of requests
  duration: 720, // seconds
});

const formatData = (objs: {}) => {
  let biodata = ""
  const obj = objs as { [key: string]: any };
  Object.keys(obj).forEach(key => {
    const title = key.replace(/_/g, ' ')
    let value = `${obj[key]}`
    if (title){
      biodata += `${title[0].toUpperCase()+title.slice(1)}: ${value}`
    } else {
      biodata += `${title}: ${value}`
    }
    biodata += "\n"
  });
  return biodata
}

export async function POST(request: Request) {
  // Rate Limiting
  const clientIp = request.headers.get("x-forwarded-for");
  if (clientIp) {
    try {
      await rateLimiter.consume(clientIp);
    } catch (error) {
      return NextResponse.json(
        { message: "Too many requests, please try again later." },
        { status: 429 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Invalid client IP." },
      { status: 400 }
    );
  }

  const { username, profile } = await request.json();
  if (!username || !profile) {
    return NextResponse.json(
      { message: "Username and profile data are required" },
      { status: 400 }
    );
  }
  delete profile.avatar
  const biodata = formatData(profile)
  try {
    // let prompt = `berikan roasting singkat dengan kejam, menyindir, serta menyakitkan dalam bahasa gaul untuk profile Tiktok berikut : ${username}. Berikut detailnya: ${JSON.stringify(
    //   profile
    // )}`;
    // if (profile.bio && !/[^\u0000-\u007F]/.test(profile.bio)) {
    //   prompt = `give a short and harsh roasting for the following Tiktok profile: ${username}. Here are the details: ${JSON.stringify(
    //     profile
    //   )}`;
    // }
    // if (profile.bio && /[^\u0000-\u007F]/.test(profile.bio)) {
    let prompt = `berikan roasting singkat dengan kejam, menyindir, serta menyakitkan dalam bahasa gaul untuk profile Tiktok berikut : ${username}. Berikut detailnya: ${biodata}`;
    prompt += `(berikan response dalam bahasa indonesia dan jangan berikan pujian atau saran)`;
    // } else {
    //   prompt += `. (provide the response in English and do not provide praise or advice)`;
    // }

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings,
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return NextResponse.json({ roasting: response.text() });
  } catch (error) {
    console.error("Error generating roast:", error);
    return NextResponse.json(
      { message: "Error generating roast" },
      { status: 500 }
    );
  }
}
