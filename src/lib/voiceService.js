// Voice service using ElevenLabs API or browser Speech Synthesis as fallback

let currentAudio = null;
let currentUtterance = null;
let speechResolve = null;
let speechReject = null;

export async function speakText(text) {
  // Stop any currently playing audio
  stopSpeaking();

  const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  
  if (apiKey) {
    try {
      // Use ElevenLabs API
      await speakWithElevenLabs(text, apiKey);
      return;
    } catch (error) {
      // Silent error - falling back to browser TTS
    }
  }

  // Fallback to browser Speech Synthesis API
  return speakWithBrowserTTS(text);
}

async function speakWithElevenLabs(text, apiKey) {
  try {
    // Default voice ID - you can change this to any ElevenLabs voice
    // Popular voices: "21m00Tcm4TlvDq8ikWAM" (Rachel), "EXAVITQu4vr4xnSDxMaL" (Bella)
    const voiceId = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`ElevenLabs API error: ${errorData.detail?.message || response.statusText}`);
  }

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  currentAudio = new Audio(audioUrl);
    
    return new Promise((resolve, reject) => {
      currentAudio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        resolve();
      };
      
      currentAudio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        reject(error);
      };
      
      currentAudio.play().catch(reject);
    });
  } catch (error) {
    // Silent error - fallback to browser TTS if ElevenLabs fails
    return speakWithBrowserTTS(text);
  }
}

function speakWithBrowserTTS(text) {
  return new Promise((resolve, reject) => {
  if (typeof window !== "undefined" && 'speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

      // Function to set voice (voices may not be loaded immediately)
      const setVoice = () => {
    const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
    const preferredVoice = voices.find(
            (voice) => voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Samantha')
          ) || voices.find(voice => voice.lang.startsWith('en'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
          }
        }
      };

      // Try to set voice immediately
      setVoice();

      // If voices aren't loaded yet, wait for them
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        const originalHandler = window.speechSynthesis.onvoiceschanged;
        window.speechSynthesis.onvoiceschanged = () => {
          setVoice();
          if (originalHandler) originalHandler();
        };
    }

    utterance.onend = () => {
        currentUtterance = null;
        currentAudio = null;
        speechResolve = null;
        speechReject = null;
        resolve();
      };

      utterance.onerror = (event) => {
        // Silent error handling
        currentUtterance = null;
      currentAudio = null;
        speechResolve = null;
        speechReject = null;
        reject(event);
    };

      currentUtterance = utterance;
      speechResolve = resolve;
      speechReject = reject;
    window.speechSynthesis.speak(utterance);
  } else {
      // Speech synthesis not supported - handled gracefully
      reject(new Error('Speech synthesis not supported'));
  }
  });
}

export function stopSpeaking() {
  // Stop browser TTS
  if (typeof window !== "undefined" && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  // Stop audio playback
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  // Resolve any pending promise
  if (speechResolve) {
    speechResolve();
    speechResolve = null;
    speechReject = null;
  }

  currentUtterance = null;
}
