export default function PageTransition() {
  return (
    <div id="page-transition">
      <div className="blackhole-core" />
      <div className="blackhole-stars" />
      <svg className="penguin-runner" viewBox="0 0 160 140" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="80" cy="80" rx="30" ry="42" fill="#0b0b0b" />
        <ellipse cx="85" cy="88" rx="20" ry="30" fill="#f5f5f5" />
        <circle cx="105" cy="40" r="18" fill="#0b0b0b" />
        <circle cx="110" cy="38" r="3" fill="#fff" />
        <polygon points="120,42 135,48 120,54" fill="#facc15" />
        <ellipse cx="55" cy="85" rx="8" ry="24" fill="#080808" />
        <ellipse cx="75" cy="90" rx="9" ry="26" fill="#0b0b0b" />
        <ellipse cx="70" cy="128" rx="10" ry="5" fill="#facc15" />
        <ellipse cx="90" cy="128" rx="10" ry="5" fill="#facc15" />
      </svg>
    </div>
  );
}
