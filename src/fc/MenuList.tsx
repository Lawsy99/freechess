// A card of tappable rows (title, a line of detail, an arrow), for the quieter
// extras on Play and Profile, so they sit together without crowding the page.
import { ChevronIcon } from './icons'

export type MenuItem = { id: string; title: string; detail: string; onClick: () => void }

export function MenuList({ items, label }: { items: MenuItem[]; label?: string }) {
  return (
    <section className="fc-menu-section">
      {label && <h2 className="fc-menu-label">{label}</h2>}
      <ul className="fc-card fc-menu">
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" className="fc-menu-row" onClick={item.onClick}>
              <span className="fc-menu-text">
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </span>
              <ChevronIcon size={20} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
