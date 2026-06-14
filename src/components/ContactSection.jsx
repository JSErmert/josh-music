// ContactSection — contact footer with email + booking note.
// Visual CSS ported from #contact in the B3 mockup.
// Mobile: reduced horizontal and bottom padding.

const contactStyles = `
  .contact-section { padding: 60px 64px 160px; text-align: center; }
  @media (max-width: 768px) {
    .contact-section { padding: 40px 20px 100px; }
  }
`

export default function ContactSection() {
  return (
    <section id="contact" className="contact-section">
      <style>{contactStyles}</style>
      <div style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
      }}>
        <p style={{
          fontFamily: 'system-ui, Arial, sans-serif',
          fontSize: '9px',
          letterSpacing: '0.40em',
          textTransform: 'uppercase',
          color: 'rgba(200,137,58,0.50)',
          fontWeight: 300,
        }}>
          Contact
        </p>

        {/* TODO — Josh: replace with your real contact email (href + text below). */}
        <a
          href="mailto:hello@example.com"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: '1.05rem',
            fontWeight: 400,
            color: '#c8893a',
            textDecoration: 'none',
            letterSpacing: '0.08em',
            transition: 'color 0.3s',
            wordBreak: 'break-all',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#e8b060' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#c8893a' }}
        >
          TODO — add contact email
        </a>

        <p style={{
          fontSize: '12px',
          color: 'rgba(138,122,104,0.38)',
          letterSpacing: '0.08em',
          fontStyle: 'italic',
          fontFamily: "Georgia, 'Times New Roman', serif",
          maxWidth: '280px',
          textAlign: 'center',
        }}>
          For bookings, collaborations, and anything else.
        </p>
      </div>
    </section>
  )
}
