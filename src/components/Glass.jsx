export default function Glass({ children, as: AsComponent = 'div', radius = 40, style = {}, ...rest }) {
  const Tag = AsComponent
  return (
    <Tag
      style={{
        borderRadius: radius,
        border: '1px solid rgba(255,236,214,0.18)',
        background: 'rgba(255,240,225,0.06)',
        backdropFilter: 'blur(6px) saturate(1.15)',
        WebkitBackdropFilter: 'blur(6px) saturate(1.15)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
