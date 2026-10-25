// Scrolling ribbon of cities under the hero.
export function Ticker({ items }: { items: string[] }) {
  if (items.length === 0) return null
  const group = Array.from({ length: Math.max(1, Math.ceil(14 / items.length)) }, () => items).flat()
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <div className="ticker-group" key={copy}>
            {group.map((item, i) => (
              <span key={i}>
                {item}
                <i>{"✦"}</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
