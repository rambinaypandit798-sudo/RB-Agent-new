// Fetch user settings to check for personal Gemini key
const { data: userSettings } = await supabase
  .from("user_settings")
  .select("gemini_api_key")
  .eq("user_id", user.id)
  .maybeSingle();

const aiCtx = { geminiKey: userSettings?.gemini_api_key };

// Pass aiCtx in the following function calls:
const vector = await embed(lastUser, aiCtx);

const extracted = await completeOnce(model, [...], aiCtx);

const memVector = await embed(extracted, aiCtx);

const upstream = await chatCompletion(model, messages, aiCtx);
