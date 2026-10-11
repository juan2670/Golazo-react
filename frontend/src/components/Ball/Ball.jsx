function Ball({ className, ...props }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <circle cx="50" cy="50" r="46" fill="#fff" stroke="#0c2414" strokeWidth="4" />
      <polygon points="50,30 69,44 62,66 38,66 31,44" fill="#0c2414" />
      <g
        stroke="#0c2414"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M50 30V6" />
        <path d="M69 44L93 36" />
        <path d="M62 66L77 87" />
        <path d="M38 66L23 87" />
        <path d="M31 44L7 36" />
      </g>
    </svg>
  )
}

export default Ball
