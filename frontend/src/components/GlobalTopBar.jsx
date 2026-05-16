import ProfileMenu from './profile/ProfileMenu';

/** Sticky top bar for dashboard / protected layouts */
export default function GlobalTopBar({ title }) {
  return (
    <header className="global-top-bar">
      <div className="global-top-bar-inner">
        {title ? <h1 className="global-top-bar-title">{title}</h1> : <span />}
        <ProfileMenu />
      </div>
    </header>
  );
}
