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

  const { username, profile, language } = await request.json();
  if (!username || !profile) {
    return NextResponse.json(
      { message: "Username and profile data are required" },
      { status: 400 }
    );
  }
  delete profile.avatar
  const biodata = formatData(profile);

  try {
    let prompt = "";

    // Tentukan prompt berdasarkan bahasa yang dipilih
    switch (language) {
      case "indonesian":
        prompt = `Berikan roasting singkat dengan kejam, menyindir, serta menyakitkan dalam bahasa gaul untuk profile Tiktok berikut : ${username}. Berikut detailnya: ${biodata}`;
        prompt += `(berikan response dalam bahasa indonesia dan jangan berikan pujian atau saran)`;
        break;
      case "english":
        prompt = `Give a short and harsh roasting in a brutal, sarcastic, and hurtful manner for the following Tiktok profile: ${username}. Here are the details: ${biodata}`;
        prompt += `(provide the response in English and do not give any compliments or advice)`;
        break;
      case "mandarin":
        prompt = `请用中文为以下Tiktok个人资料进行简短而残酷、讽刺且尖锐的吐槽：${username}。以下是详细信息：${biodata}`;
        prompt += `(请用中文回答，不要给出任何赞美或建议)`;
        break;
      case "japanese":
        prompt = `次のTiktokプロフィールに対して、残酷で皮肉で痛烈な短いローストを日本語でしてください: ${username}。詳細はこちら: ${biodata}`;
        prompt += `(日本語で応答し、褒め言葉やアドバイスはしないでください)`;
        break;
      case "korean":
        prompt = `다음 Tiktok 프로필에 대해 짧고 가혹한 한국어로 잔인하고 비꼬며 상처 주는 로스트를 해주세요: ${username}。세부 정보는 다음과 같습니다: ${biodata}`;
        prompt += `(응답은 한국어로 제공하고 칭찬이나 조언은 하지 마세요)`;
        break;
      case "vietnamese":
        prompt = `Hãy đưa ra một lời nhận xét ngắn gọn nhưng tàn nhẫn, mỉa mai và gây tổn thương bằng tiếng Việt cho hồ sơ Tiktok sau: ${username}. Đây là chi tiết: ${biodata}`;
        prompt += `(cung cấp phản hồi bằng tiếng Việt và không đưa ra bất kỳ lời khen ngợi hoặc lời khuyên nào)`;
        break;
      case "filipino":
        prompt = `Magbigay ng maikli ngunit malupit, mapanuyang, at masakit na roasting sa Filipino para sa sumusunod na profile ng Tiktok: ${username}. Narito ang mga detalye: ${biodata}`;
        prompt += `(magbigay ng tugon sa Filipino at huwag magbigay ng anumang papuri o payo)`;
        break;
      default:
        prompt = `Berikan roasting singkat dengan kejam, menyindir, serta menyakitkan dalam bahasa gaul untuk profile Tiktok berikut : ${username}. Berikut detailnya: ${biodata}`;
        prompt += `(berikan response dalam bahasa indonesia dan jangan berikan pujian atau saran)`;
    }

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
