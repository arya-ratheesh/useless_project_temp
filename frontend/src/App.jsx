import { useState } from "react";
import "./App.css";
import redditImage from "./assets/redditmaman.png";
import chechiImage from "./assets/chechi.png";
import upadeshiImage from "./assets/updeshi.png";

const API_BASE_URL = "http://localhost:8000";

function App() {
  const [page, setPage] = useState("dashboard");
  const [ignored, setIgnored] = useState("");
  const [problem, setProblem] = useState("");
  const [language, setLanguage] = useState("en");

  // Dynamic Backend States
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState([]);
  const [ragDebug, setRagDebug] = useState(null);
  const [argumentData, setArgumentData] = useState(null);
  const [isArgueLoading, setIsArgueLoading] = useState(false);

  const text = {
    en: {
      meet: "MEET YOUR ADVISORS",
      subtitle: "Three experts. Zero qualifications. Unlimited bad advice.",
      ready: "READY TO RUIN YOUR PROBLEM?",
      start: "🔥 GET THE WORST ADVICE",
    },
    ml: {
      meet: "നിങ്ങളുടെ ഉപദേശകരെ പരിചയപ്പെടൂ",
      subtitle: "മൂന്ന് വിദഗ്ധർ. യോഗ്യത പൂജ്യം. മോശം ഉപദേശം അനന്തം.",
      ready: "നിങ്ങളുടെ പ്രശ്നം നശിപ്പിക്കാൻ തയ്യാറാണോ?",
      start: "🔥 ഏറ്റവും മോശം ഉപദേശം നേടൂ",
    },
  };

  // 1. Fetch Bad Advice from Backend (/ask)
  const fetchBadAdvice = async () => {
    if (!problem.trim()) {
      alert("Please describe your problem first!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Sends both 'question' and 'query' to ensure schema match
        body: JSON.stringify({ 
          question: problem,
          query: problem 
        }),
      });

      if (!res.ok) throw new Error(`Server returned status: ${res.status}`);

      const data = await res.json();
      setResponses(data.responses || []);
      setRagDebug(data.rag_debug || null);
      setPage("advice");
    } catch (err) {
      console.error("Error fetching bad advice:", err);
      alert("Failed to connect to backend. Is uvicorn running on port 8000?");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fetch Cross-Character Roast (/argue)
  const triggerArgument = async () => {
    setIsArgueLoading(true);
    setPage("argument");

    const upadeshiCard = responses.find((r) => r.character === "upadeshi");
    const originalAdvice = upadeshiCard ? upadeshiCard.text : "പഠിക്കാൻ മടിയാണെങ്കിൽ വെറുതെ ഉറങ്ങുക.";

    try {
      const res = await fetch(`${API_BASE_URL}/argue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attacker: "reddit_maman",
          defender: "upadeshi",
          original_topic: problem || "general advice",
          original_advice: originalAdvice,
        }),
      });

      if (!res.ok) throw new Error(`Server returned status: ${res.status}`);

      const data = await res.json();
      setArgumentData(data);
    } catch (err) {
      console.error("Error generating argument:", err);
    } finally {
      setIsArgueLoading(false);
    }
  };

  // Helper to retrieve character response by character key
  const getChar = (id) => responses.find((r) => r.character === id) || {};

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <span className="skull">☠</span>
          <div>
            <div className="logo-title">
              <span>WORST</span> ADVICE
            </div>
            <small>COMMITTEE</small>
          </div>
        </div>

        <div className="nav-links">
          <button
            className={page === "dashboard" ? "active" : ""}
            onClick={() => setPage("dashboard")}
          >
            ⌂ Home
          </button>
          <button onClick={() => setPage("shame")}>☠ Hall of Shame</button>
          <button>⚙ Why this exists?</button>
          <button>ⓘ About</button>
        </div>

        <div className="nav-right">
          <button onClick={() => setLanguage(language === "en" ? "ml" : "en")}>
            {language === "en" ? "മലയാളം" : "English"}
          </button>
        </div>
      </nav>

      {/* DASHBOARD */}
      {page === "dashboard" && (
        <main className="dashboard">
          <div className="welcome-tag">☠ WELCOME TO THE COMMITTEE</div>

          <h1>
            {language === "ml" ? (
              <span>{text.ml.meet}</span>
            ) : (
              <>MEET YOUR <span>ADVISORS</span></>
            )}
          </h1>
          <p className="subtitle">
            Three experts. Zero qualifications. Unlimited bad advice.
          </p>

          <div className="characters">
            <div className="character-card chechi">
              <img className="character-image" src={chechiImage} alt="Chechi" />
              <div className="character-heading">
                <h2>CHECHI</h2>
                <span>— THE EMOTIONAL EXPERT</span>
              </div>
              <p className="quote">"Don't worry. I have a solution."</p>
              <div className="badness">☠ BADNESS: <strong>86%</strong></div>
            </div>

            <div className="character-card upadeshi">
              <img className="character-image" src={upadeshiImage} alt="Nattile Upadeshi" />
              <div className="character-heading">
                <h2>NATTILE UPADESHI</h2>
                <span>— THE UNSOLICITED EXPERT</span>
              </div>
              <p className="quote">"In my time, we had a solution for everything."</p>
              <div className="badness">☠ BADNESS: <strong>94%</strong></div>
            </div>

            <div className="character-card reddit">
              <img className="character-image" src={redditImage} alt="Reddit Maman" />
              <div className="character-heading">
                <h2>REDDIT MAMAN</h2>
                <span>— THE INTERNET EXPERT</span>
              </div>
              <p className="quote">"Bro, I saw this on Reddit."</p>
              <div className="badness">☠ BADNESS: <strong>99%</strong></div>
            </div>
          </div>

          <div className="start-section">
            <p>READY TO RUIN YOUR PROBLEM?</p>
            <button className="start-btn" onClick={() => setPage("chat")}>
              🔥 GET THE WORST ADVICE
            </button>
          </div>
        </main>
      )}

      {/* CHAT PAGE */}
      {page === "chat" && (
        <main className="chat-page">
          <div className="welcome-tag">☠ WORST ADVICE SESSION</div>
          <h1>WHAT'S <span>YOUR PROBLEM?</span></h1>
          <p className="subtitle">
            Tell the committee what's going wrong.<br />They promise absolutely nothing.
          </p>

          <div className="problem-box">
            <div className="input-label">🧠 YOUR PROBLEM</div>
            <textarea
              className="problem-input"
              placeholder="Tell us your problem... exam tomorrow, attendance short, relationship drama..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              maxLength={500}
            />
            <div className="input-footer">
              <span>⚠ Your problem will be made significantly worse.</span>
              <span>{problem.length} / 500</span>
            </div>
          </div>

          <button className="start-btn" onClick={fetchBadAdvice} disabled={isLoading}>
            {isLoading ? "💀 CONSULTING THE COMMITTEE..." : "💀 GIVE ME TERRIBLE ADVICE"}
          </button>

          <p className="warning">
            ⚠ WARNING: The committee accepts no responsibility for your decisions.
          </p>
        </main>
      )}

      {/* ADVICE PAGE */}
      {page === "advice" && (
        <main className="advice-page">
          <div className="welcome-tag">☠ THE COMMITTEE HAS SPOKEN</div>
          <h1>YOUR PROBLEM IS NOW <span>WORSE</span></h1>
          <p className="subtitle">Three experts. Three terrible solutions. Choose wisely.</p>

          <div className="worst-winner">
            🏆 CURRENT WORST ADVISOR: <strong>REDDIT MAMAN</strong>
          </div>

          <div className="advice-list">
            {/* CHECHI */}
            <div className={`advice-card chechi-advice ${ignored === "chechi" ? "ignored" : ""}`}>
              <img className="advice-character-image"  src={chechiImage} alt="Chechi" />
              <div className="advice-top">
                <h2>👩 CHECHI</h2>
                <span>BADNESS: {getChar("chechi").badness || 86}%</span>
              </div>
              <p>"{getChar("chechi").text || "കരയാതെ ഇരിക്ക്... വേറെന്തെങ്കിലും വലിയ പ്രശ്നം ഉണ്ടാക്കി ഇതിനെ മറക്കാം!"}"</p>
              
              {getChar("chechi").audio_url && (
                <div style={{ margin: "10px 0" }}>
                  <audio controls src={`${API_BASE_URL}${getChar("chechi").audio_url}`} />
                </div>
              )}

              <small>☠ EMOTIONAL EXPERT</small>
              <button
                className="ignore-btn"
                onClick={() => setIgnored(ignored === "chechi" ? "" : "chechi")}
              >
                {ignored === "chechi" ? "↩ UNDO" : "🚫 IGNORE CHECHI"}
              </button>
            </div>

            {/* UPADESHI */}
            <div className={`advice-card upadeshi-advice ${ignored === "upadeshi" ? "ignored" : ""}`}>
              <img className="advice-character-image" src={upadeshiImage} alt="Nattile Upadeshi" />
              <div className="advice-top">
                <h2>🧓 NATTILE UPADESHI</h2>
                <span>BADNESS: {getChar("upadeshi").badness || 94}%</span>
              </div>
              <p>"{getChar("upadeshi").text || "രാവിലെ 4 മണിക്ക് എഴുന്നേറ്റ് തുളസിത്തറയിൽ വെള്ളമൊഴിക്ക്, എല്ലാം ശരിയാകും!"}"</p>

              {getChar("upadeshi").audio_url && (
                <div style={{ margin: "10px 0" }}>
                  <audio controls src={`${API_BASE_URL}${getChar("upadeshi").audio_url}`} />
                </div>
              )}

              <small>☠ UNSOLICITED EXPERT</small>
              <button
                className="ignore-btn"
                onClick={() => setIgnored(ignored === "upadeshi" ? "" : "upadeshi")}
              >
                {ignored === "upadeshi" ? "↩ UNDO" : "🚫 IGNORE UPADESHI"}
              </button>
            </div>

            {/* REDDIT MAMAN */}
            <div className={`advice-card reddit-advice ${ignored === "reddit_maman" ? "ignored" : ""}`}>
              <img className="advice-character-image" src={redditImage} alt="Reddit Maman" />
              <div className="advice-top">
                <h2>🕶️ REDDIT MAMAN</h2>
                <span>BADNESS: {getChar("reddit_maman").badness || 99}%</span>
              </div>
              <p>"{getChar("reddit_maman").text || "Bro, just ghost everyone and move to Himalayas. Full scene settle!"}"</p>

              {getChar("reddit_maman").audio_url && (
                <div style={{ margin: "10px 0" }}>
                  <audio controls src={`${API_BASE_URL}${getChar("reddit_maman").audio_url}`} />
                </div>
              )}

              <small>☠ INTERNET EXPERT</small>
              <button
                className="ignore-btn"
                onClick={() => setIgnored(ignored === "reddit_maman" ? "" : "reddit_maman")}
              >
                {ignored === "reddit_maman" ? "↩ UNDO" : "🚫 IGNORE REDDIT MAMAN"}
              </button>
            </div>
          </div>

          <button className="argue-btn" onClick={triggerArgument}>
            ⚔️ MAKE THEM ARGUE
          </button>
          <button className="why-btn" onClick={() => setPage("why")}>
            🧠 WHY DID THEY SAY THIS?
          </button>

          <div className="advice-actions">
            <button className="start-btn" onClick={() => setPage("worse")}>
              🔥 MAKE IT WORSE
            </button>
            <button className="back-btn" onClick={() => setPage("chat")}>
              ← TRY ANOTHER PROBLEM
            </button>
          </div>
        </main>
      )}

      {/* ARGUMENT PAGE */}
      {page === "argument" && (
        <main className="argument-page">
          <div className="welcome-tag">⚔️ COMMITTEE CIVIL WAR</div>
          <h1>THEY'RE <span>ARGUING</span></h1>
          <p className="subtitle">
            Three terrible opinions. One extremely unnecessary argument.
          </p>

          {isArgueLoading ? (
            <p style={{ textAlign: "center", color: "#f97316", margin: "2rem" }}>
              ⚔️ The committee members are shouting at each other...
            </p>
          ) : (
            <div className="argument-box">
              <div className="argument-line">
                <strong>🧓 NATTILE UPADESHI:</strong>
                <p>"{getChar("upadeshi").text || "ഇതാണ് എന്റെ ശാശ്വതമായ ഉപദേശം."}"</p>
              </div>

              <div className="argument-line">
                <strong>🕶️ REDDIT MAMAN (COUNTER ROAST):</strong>
                <p>"{argumentData?.argument_text || "ഇതൊരു വല്ലാത്ത ഉപദേശമായിപ്പോയി, ഇതിലും ഭേദം ഒന്നും ചെയ്യാതിരിക്കുന്നതാണ്!"}"</p>
              </div>

              {argumentData?.audio_url && (
                <div style={{ margin: "1rem auto", textAlign: "center" }}>
                  <audio controls autoPlay src={`${API_BASE_URL}${argumentData.audio_url}`} />
                </div>
              )}

              <div className="argument-line final-argument">
                <strong>☠ COMMITTEE VERDICT:</strong>
                <p>Nobody won. Everyone became more confident.</p>
              </div>
            </div>
          )}

          <button className="back-btn" onClick={() => setPage("advice")}>
            ← BACK TO ADVICE
          </button>
        </main>
      )}

      {/* WORSE PAGE */}
      {page === "worse" && (
        <main className="worse-page">
          <div className="welcome-tag">☠ CONSEQUENCES DEPARTMENT</div>
          <h1>YOU MADE THE <span>WRONG CHOICE</span></h1>
          <p className="subtitle">Congratulations. Your problem has officially become worse.</p>

          <div className="chaos-box">
            <div className="chaos-title">💀 CONSEQUENCE CHAIN</div>
            <div className="consequence">
              <strong>STEP 1</strong>
              <p>You stop studying or working.</p>
            </div>
            <div className="arrow">↓</div>
            <div className="consequence">
              <strong>STEP 2</strong>
              <p>You become extremely confident for absolutely no reason.</p>
            </div>
            <div className="arrow">↓</div>
            <div className="consequence">
              <strong>STEP 3</strong>
              <p>You face the reality with nothing in your brain.</p>
            </div>
            <div className="arrow">↓</div>
            <div className="consequence final-consequence">
              <strong>☠ FINAL CONSEQUENCE</strong>
              <p>You write your name beautifully and consider that a good start.</p>
            </div>
          </div>

          <button className="back-btn" onClick={() => setPage("dashboard")}>
            ← BACK TO SAFETY
          </button>
        </main>
      )}

      {/* WHY PAGE */}
      {page === "why" && (
        <main className="why-page">
          <div className="welcome-tag">🧠 AI INVESTIGATION DEPARTMENT</div>
          <h1>WHY DID THEY <span>SAY THIS?</span></h1>
          <p className="subtitle">
            Retrieved directly from the RAG knowledge pipeline:
          </p>

          <div className="reason-box">
            <div className="reason">
              <strong>🔍 RETRIEVED BAD CONTEXT:</strong>
              {ragDebug?.retrieved_examples?.length > 0 ? (
                ragDebug.retrieved_examples.map((item, idx) => (
                  <p key={idx} style={{ marginTop: "5px" }}>• {item}</p>
                ))
              ) : (
                <p>No external knowledge base retrieved.</p>
              )}
            </div>

            <div className="reason">
              <strong>⚙️ PIPELINE STEPS EXECUTED:</strong>
              <p>{ragDebug?.pipeline?.join(" ➔ ") || "Embedding ➔ FAISS ➔ Groq LLM ➔ TTS"}</p>
            </div>

            <div className="reason final-reason">
              <strong>☠ AI CONCLUSION</strong>
              <p>The advice makes no sense. Therefore, it is perfect for this committee.</p>
            </div>
          </div>

          <button className="back-btn" onClick={() => setPage("advice")}>
            ← BACK TO ADVICE
          </button>
        </main>
      )}
    </div>
  );
}

export default App;
