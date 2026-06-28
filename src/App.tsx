 import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Language = "ENG" | "HIN-ENG" | "MAR";
type Archetype = "ARCHETYPE_A" | "ARCHETYPE_B" | "ARCHETYPE_C";

export default function App() {
const [language, setLanguage] = useState<Language>("ENG");
const [archetype, setArchetype] = useState<Archetype>("ARCHETYPE_A");
const [query, setQuery] = useState("");
const [response, setResponse] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

async function handleGenerate() {
if (!query.trim()) return;
setLoading(true);
setError(null);
setResponse(null);

try {
  const res = await fetch("/api/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, language, archetype }),
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  const data: { response: string } = await res.json();
  setResponse(data.response);
} catch (err) {
  setError(err instanceof Error ? err.message : "An unexpected error occurred.");
} finally {
  setLoading(false);
}

}

return (
<div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
<header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth={2}>
<path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
</svg>
</div>
<div>
<h1 className="text-xl font-bold tracking-tight text-white">ScienceSpark AI</h1>
<p className="text-xs text-gray-400">AI-powered science exploration</p>
</div>
</header>

  <div className="flex flex-1 overflow-hidden">
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-5 flex flex-col gap-6">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Language</h2>
        <div className="flex flex-col gap-2">
          {(["ENG", "HIN-ENG", "MAR"] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                language === lang
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {lang === "ENG" ? "English" : lang === "HIN-ENG" ? "Hindi + English" : "Marathi"}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Response Mode</h2>
        <div className="flex flex-col gap-2">
          {([
            ["ARCHETYPE_A", "Concise"],
            ["ARCHETYPE_B", "Detailed"],
            ["ARCHETYPE_C", "Exploratory"],
          ] as [Archetype, string][]).map(([arch, label]) => (
            <button
              key={arch}
              onClick={() => setArchetype(arch)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                archetype === arch
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {label}
              <span className="block text-xs font-normal opacity-60">{arch}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-auto bg-gray-800 rounded-lg p-3 text-xs text-gray-400 space-y-1">
        <div className="flex justify-between">
          <span>Language</span>
          <span className="text-gray-200 font-medium">{language}</span>
        </div>
        <div className="flex justify-between">
          <span>Mode</span>
          <span className="text-gray-200 font-medium">{archetype}</span>
        </div>
      </div>
    </aside>
    <main className="flex-1 flex flex-col p-6 gap-4 overflow-auto">
      <div className="flex flex-col gap-2">
        <label htmlFor="query" className="text-sm font-medium text-gray-300">
          Your Question
        </label>
        <textarea
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a science question…"
          rows={4}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              void handleGenerate();
            }
          }}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Ctrl+Enter to submit</span>
          <button
            onClick={() => void handleGenerate()}
            disabled={loading || !query.trim()}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Generating…
              </>
            ) : (
              "Generate"
            )}
          </button>
        </div>
      </div>
      {error && (
        <div className="bg-red-950 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          <span className="font-semibold">Error: </span>{error}
        </div>
      )}
      <div className="flex-1 bg-gray-900 border border-gray-800 rounded-lg p-5 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
            <svg className="animate-spin w-10 h-10 text-indigo-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span className="text-sm">Generating response…</span>
          </div>
        ) : response !== null ? (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    code({ className, children }) {
      return (
        <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto my-4">
          <code className={className}>
            {children}
          </code>
        </pre>
      );
    },
  }}
>
  {response}
</ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center text-gray-500">
            <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 text-gray-700" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-400">Welcome to ScienceSpark AI</p>
              <p className="text-xs mt-1">Choose your language and response mode, then ask a science question.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  </div>
</div>

);
}