interface InputProps {
  label: string
  type?: 'text' | 'email' | 'password'
  value: string
  onChange: (val: string) => void
  placeholder?: string
  error?: string
  disabled?: boolean
}

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
}: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>

      {/* Label */}
      <label style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.82rem',
        color: '#ffffff50',
        fontWeight: 400,
        letterSpacing: '0.01em',
      }}>
        {label}
      </label>

      {/* Input */}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          background: '#ffffff06',
          border: `1px solid ${error ? '#ff5f5660' : '#ffffff15'}`,
          borderRadius: '8px',
          padding: '0.7rem 1rem',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.95rem',
          color: '#ffffff',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s ease',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
        }}
        onFocus={e => {
          if (!error) e.currentTarget.style.borderColor = '#CBFF5E60'
        }}
        onBlur={e => {
          if (!error) e.currentTarget.style.borderColor = '#ffffff15'
        }}
      />

      {/* Error */}
      {error && (
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.78rem',
          color: '#ff5f56',
          marginTop: '2px',
        }}>
          {error}
        </span>
      )}

    </div>
  )
}