interface TiktokProfile {
  name?: string;
  username?: string;
  bio?: string;
  avatar?: string;
  last_modified_name?: string;
  is_private?: boolean;
  verified?: boolean;
  followers?: number;
  following?: number;
  videos?: number;
  likes?: number;
  friends?: number;
  joined?: string
}

async function getTiktokProfile(
  username: string
): Promise<TiktokProfile> {
  const response = await fetch(`/api/tiktok-profile?username=${username}`);
  if (!response.ok) {
    throw new Error("Failed to fetch Tiktok profile");
  }
  return response.json();
}

export async function roastTiktok(username: string, jsonData?: string) {
  let datas: TiktokProfile | null = null;

  if (jsonData) {
    try {
      datas = JSON.parse(jsonData);
    } catch (error) {
      console.log("Failed to parse JSON");
    }
  }

  if (!datas) {
    datas = await getTiktokProfile(username);
  }

  return datas;
}
