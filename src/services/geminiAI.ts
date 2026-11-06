import { UserProfile } from '../types';

export interface AIResponse {
  text: string;
  isFallback: boolean;
  source?: string;
}

export async function askGeminiFitnessCoach(
  userPrompt: string,
  profile: UserProfile,
  conversationHistory: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<AIResponse> {
  // Call secure server proxy /api/ai/chat to hide API key completely from client
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userPrompt,
        profile,
        conversationHistory
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.text) {
        return {
          text: data.text,
          isFallback: Boolean(data.isFallback),
          source: data.source || 'Protected Server Vault'
        };
      }
    }
  } catch (err) {
    console.warn('Proxy chat request failed, engaging local emergency response:', err);
  }

  // Emergency client fallback heuristic
  const query = userPrompt.toLowerCase();

  if (query.includes('chest pain') || query.includes('dizziness') || query.includes('faint') || query.includes('severe pain') || query.includes('injury')) {
    return {
      text: `⚠️ **Important Medical & Safety Advisory:**\n\nPlease **stop your workout immediately**. If experiencing chest tightness, dizziness, shortness of breath, or joint injury, consult a qualified physician immediately. Your long-term health and safety must always come first.`,
      isFallback: true,
      source: 'FitTrack Clinical Safety Protocol'
    };
  }

  if (query.includes('taekwondo') || query.includes('poomsae') || query.includes('kick')) {
    return {
      text: `🥋 **Taekwondo Training Advice for ${profile.displayName}:**\n\n1. **Base Foot Pivot:** Ensure full 180° pivot on turning kicks (*Dollyo Chagi*) to protect standing knee ligaments.\n2. **Poomsae Stances:** Maintain sharp transitions between *Ap Seogi* (walking) and *Ap Kubi* (long stance).\n3. **Sparring Safety:** Always wear protective gear (headgear, hogu, mouthguard, shin guards) and practice under certified master supervision.`,
      isFallback: true,
      source: 'FitTrack Local Engine'
    };
  }

  return {
    text: `⚡ **FitTrack AI Coach Guidance:**\n\nHello ${profile.displayName}! For your profile (${profile.ageBand} age band, ${profile.experienceLevel} level, ${profile.foodPreference} diet):\n\n- **Progressive Overload:** Progress gradually by adding 1 rep or +1.5kg every 7-10 days.\n- **Protein Distribution:** Aim for 20-30g protein per meal (Paneer, dal, sprouts, eggs, or chicken).\n- **Joint Recovery:** Dedicate 10 minutes to hip mobility and recovery after training.`,
    isFallback: true,
    source: 'FitTrack Local Engine'
  };
}
