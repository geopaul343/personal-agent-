import { useEffect, useRef, useState } from 'react'
import './App.css'

const features = [
  {
    title: 'Daily planning',
    description:
      'Turn rough goals into a realistic plan with focus blocks, priorities, and quick next actions.',
  },
  {
    title: 'Smart capture',
    description:
      'Drop in ideas, notes, and reminders. The agent helps organize them into clear, usable tasks.',
  },
  {
    title: 'Agent support',
    description:
      'Ask for summaries, rewrites, breakdowns, and momentum when your workload starts to feel noisy.',
  },
]

const initialMessages = [
  {
    role: 'You',
    text: 'Plan my day around a product demo at 2 PM, two deep-work blocks, and inbox cleanup.',
  },
  {
    role: 'Agent',
    text: 'Morning: deep work on demo polish. Midday: inbox triage and stakeholder follow-ups. Afternoon: demo, then a short wrap-up block with tomorrow’s top 3 priorities.',
  },
  {
    role: 'You',
    text: 'Also remind me to prepare three talking points for the demo.',
  },
]

function App() {
  const previewRef = useRef(null)
  const [isPreviewActive, setIsPreviewActive] = useState(false)
  const [chatMessages, setChatMessages] = useState(initialMessages)
  const [prompt, setPrompt] = useState('')
  const [isThinking, setIsThinking] = useState(false)

  useEffect(() => {
    document.title = 'FocusFlow'
  }, [])

  const handleSeeDemo = () => {
    setIsPreviewActive(true)
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    window.setTimeout(() => setIsPreviewActive(false), 1600)
  }

  const buildAgentReply = (value) => {
    const normalized = value.toLowerCase()

    if (normalized.includes('plan') || normalized.includes('day')) {
      return 'Here is a quick plan: pick your top 3 priorities, block one focused work session first, then batch smaller tasks after your most important work is done.'
    }

    if (normalized.includes('task') || normalized.includes('todo')) {
      return 'I would group that into urgent, important, and later. Start with the one task that unblocks the most progress.'
    }

    if (normalized.includes('meeting') || normalized.includes('demo')) {
      return 'Before the meeting, prepare your goal, three talking points, and one clear next step you want from the conversation.'
    }

    return 'I can help you break that down into next actions, summarize the goal, or turn it into a focused plan for today.'
  }

  const handleSend = (event) => {
    event.preventDefault()

    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt || isThinking) {
      return
    }

    setChatMessages((current) => [
      ...current,
      { role: 'You', text: trimmedPrompt },
    ])
    setPrompt('')
    setIsThinking(true)

    window.setTimeout(() => {
      setChatMessages((current) => [
        ...current,
        { role: 'Agent', text: buildAgentReply(trimmedPrompt) },
      ])
      setIsThinking(false)
    }, 500)
  }

  return (
    <main className="app-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">AI productivity agent</p>
          <h1>Plan faster, focus longer, finish the work that matters.</h1>
          <p className="hero-text">
            FocusFlow is a React web app concept for people who want one place
            to think, organize, and chat with an agent that helps move work
            forward.
          </p>

          <div className="hero-actions">
            <button type="button" className="primary-btn">
              Start planning
            </button>
            <button type="button" className="secondary-btn" onClick={handleSeeDemo}>
              See agent demo
            </button>
          </div>

          <div className="stats">
            <div>
              <strong>3x</strong>
              <span>clearer task breakdowns</span>
            </div>
            <div>
              <strong>1 hub</strong>
              <span>notes, prompts, and priorities</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>agent support when you get stuck</span>
            </div>
          </div>
        </div>

        <div
          ref={previewRef}
          className={`preview-card ${isPreviewActive ? 'preview-card-active' : ''}`}
          aria-label="Agent chat preview"
        >
          <div className="preview-header">
            <div>
              <p className="preview-label">Today</p>
              <h2>Workspace assistant</h2>
            </div>
            <span className="status-pill">Online</span>
          </div>

          <div className="message-list">
            {chatMessages.map((message) => (
              <article
                key={`${message.role}-${message.text.slice(0, 16)}`}
                className={`message-bubble ${message.role === 'Agent' ? 'agent' : 'user'}`}
              >
                <span>{message.role}</span>
                <p>{message.text}</p>
              </article>
            ))}

            {isThinking ? (
              <article className="message-bubble agent">
                <span>Agent</span>
                <p>Thinking...</p>
              </article>
            ) : null}
          </div>

          <form className="prompt-bar" onSubmit={handleSend}>
            <input
              type="text"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask your agent to plan, summarize, or prioritize..."
              aria-label="Message the productivity agent"
            />
            <button type="submit" disabled={!prompt.trim() || isThinking}>
              Send
            </button>
          </form>
        </div>
      </section>

      <section className="feature-section">
        <div className="section-heading">
          <p className="eyebrow">Built for momentum</p>
          <h2>Everything centers around an agent that helps you do the next useful thing.</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
