export default function FrostPanel({ className = '', children, style: callerStyle, ...rest }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: 'rgba(255,240,225,0.06)',
        backdropFilter: 'blur(6px) saturate(1.15)',
        WebkitBackdropFilter: 'blur(6px) saturate(1.15)',
        border: '1px solid rgba(255,236,214,0.18)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)',
        // caller style merges last so it can extend (sizing/layout) without wiping the glass recipe
        ...callerStyle,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
