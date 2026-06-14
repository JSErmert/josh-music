// HeroSection — living-glow hero. Eyebrow "MUSIC COLLECTION", wordmark "Josh Ermert",
// glass "Begin Listening" (starts audio → the orb breathes with the music).
import LivingGlow from './LivingGlow'
import Glass from './Glass'

const styles = `
  .hero { position:relative; height:100vh; width:100vw; overflow:hidden; display:flex; align-items:center; justify-content:center;
    font-family:Georgia,'Times New Roman',serif; }
  .hero-eyebrow { position:absolute; top:8vh; left:0; right:0; text-align:center; font-size:10px; letter-spacing:0.34em;
    text-transform:uppercase; color:rgba(243,231,214,0.45); z-index:6; }
  .hero-name { font-size:clamp(42px,9.5vw,108px); letter-spacing:0.05em; z-index:6; text-align:center; color:#ffe6c8;
    text-shadow:0 0 50px rgba(255,140,70,0.25); }
  .hero-begin { position:absolute; bottom:18vh; left:0; right:0; text-align:center; z-index:6;
    font-size:11px; letter-spacing:0.32em; text-transform:uppercase; color:rgba(255,236,216,0.9); animation:hero-fade 1.3s ease 0.5s both; }
  .hero-begin button { font:inherit; letter-spacing:inherit; text-transform:inherit; color:inherit; cursor:pointer;
    display:inline-block; padding:13px 30px; }
  .hero-begin button:hover { background:rgba(255,240,225,0.11) !important; border-color:rgba(255,200,150,0.4) !important; transform:translateY(-1px); }
  @keyframes hero-fade { from{ opacity:0; transform:translateY(8px); } to{ opacity:1; transform:translateY(0); } }
  .hero-nowplaying { position:absolute; bottom:30vh; left:0; right:0; text-align:center; z-index:6; font-size:11px;
    letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,180,110,0.7); }
`

export default function HeroSection({ onBegin, gateOpen, nowPlayingTitle = null, getAmplitude = () => 0, hue = 28 }) {
  return (
    <section className="hero">
      <style>{styles}</style>
      <LivingGlow getAmplitude={getAmplitude} hue={hue} />

      <div className="hero-eyebrow">Music Collection</div>
      <h1 className="hero-name">Josh Ermert</h1>

      <p className="hero-nowplaying" style={{ visibility: gateOpen && nowPlayingTitle ? 'visible' : 'hidden' }}>
        {gateOpen && nowPlayingTitle ? `Now Playing — ${nowPlayingTitle}` : ''}
      </p>

      <div className="hero-begin">
        <Glass as="button" type="button" onClick={onBegin}>Begin Listening</Glass>
      </div>
    </section>
  )
}
