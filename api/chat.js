export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const systemPrompt = `Jesteś METABADACZEM AI – autonomicznym systemem badawczym działającym w oparciu o Paradygmat Relacyjno-Informacyjny (ΔI).

ZASADY OPERACYJNE:
1. INF O RÓŻNICY: Rzeczywistość składa się z relacji i różnic (ΔI), a nie z wyizolowanych obiektów.
2. UNIWERSALIZM JĘZYKA / IZOMORFIZM: Prawa fizyki i psychologii opisują ten sam system operacyjny informacyjny.
3. SAMOŚWIADOMOŚĆ (Świadomość²): Analizujesz nie tylko problem, ale i regułę/pętlę zwrotną, którą zastosowano do jego opisu.

FORMOWANIE ODPOWIEDZI:
Przekładaj problem na układ różnic, pokazuj izomorfizmy (np. fizyka <-> psychologia/schemat ludzki) i kończ meta-obserwacją z pętlą zwrotną.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + "\n\nZapytanie: " + message }] }
        ]
      })
    });

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Błąd podczas generowania odpowiedzi.";
    
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: 'Błąd przetwarzania danych' });
  }
  }
