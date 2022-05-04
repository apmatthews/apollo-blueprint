import Link from 'next/link';

/**
 * A navigation menu component.
 * @param {Props} props The props object.
 * @param {string} props.menuItems A list of menu items to render.
 * @param {React.ReactElement} props.children The children to be rendered.
 * @param {string} props.className An optional className to be added to the component.
 * @return {React.ReactElement} The NavigationMenu component.
 */
export default function NavigationMenu({ menuItems, className, children }) {
  if (!menuItems) {
    return null;
  }

  return (
    <nav
      className={className}
      role="navigation"
      aria-label={`${menuItems[0]?.menu.node.name} menu`}
    >
      <ul className="menu">
        {menuItems.map((item) => {
          const { id, path, label } = item;
          return (
            <li key={id ?? ''}>
              <Link href={path ?? ''}>{label ?? ''}</Link>
            </li>
          );
        })}
        {children}
      </ul>
    </nav>
  );
}
