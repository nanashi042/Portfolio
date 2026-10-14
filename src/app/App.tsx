import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Film,
  Instagram,
  Linkedin,
  Mail,
  Menu,
  Phone,
  Play,
  Sparkles,
  X,
  Youtube,
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import profileImage from '../imports/image-3.png';

type Video = {
  id: string;
  title: string;
  creator: string;
  videoUrl: string;
  views: string;
  platform: 'instagram' | 'youtube';
  category: 'short' | 'long' | 'personal';
  tone: string;
};

const videos: Video[] = [
  {
    id: '1',
    title: 'Viral Reel Edit',
    creator: 'Jhansi Way',
    videoUrl: 'https://www.instagram.com/p/DGbO4NpSWle/embed',
    views: '18.2M',
    platform: 'instagram',
    category: 'short',
    tone: 'from-fuchsia-500/80 via-violet-500/60 to-cyan-400/70',
  },
  {
    id: '2',
    title: 'High Energy Content',
    creator: 'Aditya TTP',
    videoUrl: 'https://www.instagram.com/p/DQo47I2iEOY/embed',
    views: '15.7M',
    platform: 'instagram',
    category: 'short',
    tone: 'from-orange-400/80 via-rose-500/70 to-purple-600/80',
  },
  {
    id: '3',
    title: 'Educational Banger',
    creator: 'Vidhan TTP',
    videoUrl: 'https://www.instagram.com/p/DQeeeS0CH9-/embed',
    views: '12.4M',
    platform: 'instagram',
    category: 'short',
    tone: 'from-cyan-300/80 via-blue-500/60 to-indigo-700/80',
  },
  {
    id: '4',
    title: 'Long Form Series',
    creator: 'The Top Percentile',
    videoUrl: 'https://www.youtube.com/embed/BTBjd2IsPCs',
    views: '8.9M',
    platform: 'youtube',
    category: 'long',
    tone: 'from-violet-500/80 via-indigo-700/80 to-slate-950',
  },
  {
    id: '5',
    title: 'YouTube Deep Dive',
    creator: 'Ask Life With Anmol',
    videoUrl: 'https://www.youtube.com/embed/Nrap3wNH7_Y',
    views: '6.3M',
    platform: 'youtube',
    category: 'long',
    tone: 'from-emerald-400/70 via-cyan-500/60 to-blue-700/80',
  },
  {
    id: '7',
    title: 'Long Form Feature',
    creator: 'Nikhil | Editor',
    videoUrl: 'https://drive.google.com/file/d/1JkJknSUic8oL-tKUW12NmRbLO_PQvZWj/preview',
    views: 'Featured',
    platform: 'youtube',
    category: 'long',
    tone: 'from-cyan-300/70 via-violet-500/70 to-indigo-900/90',
  },
  {
    id: '8',
    title: 'YouTube Feature Cut',
    creator: 'Nikhil | Editor',
    videoUrl: 'https://www.youtube.com/embed/xv63OV3tGZg',
    views: 'Featured',
    platform: 'youtube',
    category: 'long',
    tone: 'from-rose-400/70 via-orange-500/60 to-violet-700/90',
  },
  {
    id: '6',
    title: 'Story Arc Edit',
    creator: 'Vidhan TTP',
    videoUrl: 'https://www.instagram.com/p/DQHTeoLiN5l/embed',
    views: '9.8M',
    platform: 'instagram',
    category: 'short',
    tone: 'from-pink-400/70 via-orange-400/70 to-yellow-300/60',
  },
];

const personalVideos: Video[] = [
  {
    id: 'P1',
    title: 'Personal Edit 01',
    creator: 'Nikhil',
    videoUrl: 'https://www.instagram.com/p/DeN_ILuRRYt/embed',
    views: 'Personal',
    platform: 'instagram',
    category: 'personal',
    tone: 'from-cyan-300/80 via-blue-500/60 to-indigo-700/80',
  },
  {
    id: 'P2',
    title: 'Personal Edit 02',
    creator: 'Nikhil',
    videoUrl: 'https://www.instagram.com/p/DeBWh0cPvXh/embed',
    views: 'Personal',
    platform: 'instagram',
    category: 'personal',
    tone: 'from-fuchsia-500/80 via-violet-500/60 to-cyan-400/70',
  },
  {
    id: 'P3',
    title: 'Personal Edit 03',
    creator: 'Nikhil',
    videoUrl: 'https://www.instagram.com/p/DcyOKDNB4ID/embed',
    views: 'Personal',
    platform: 'instagram',
    category: 'personal',
    tone: 'from-orange-400/80 via-rose-500/70 to-purple-600/80',
  },
  {
    id: 'P4',
    title: 'Personal Edit 04',
    creator: 'Nikhil',
    videoUrl: 'https://www.instagram.com/p/DblFjQ2ASXV/embed',
    views: 'Personal',
    platform: 'instagram',
    category: 'personal',
    tone: 'from-pink-400/70 via-orange-400/70 to-yellow-300/60',
  },
  {
    id: 'P5',
    title: 'Personal Edit 05',
    creator: 'Nikhil',
    videoUrl: 'https://www.instagram.com/p/DQo7l9ggIrt/embed',
    views: 'Personal',
    platform: 'instagram',
    category: 'personal',
    tone: 'from-violet-500/80 via-indigo-700/80 to-slate-950',
  },
];

const shortBlogs = [
  ['01', 'The 3-second test', 'Why your opening frame is the real thumbnail.', '3 min read'],
  ['02', 'Cut on the feeling', 'A practical rhythm guide for editors who want momentum.', '4 min read'],
  ['03', 'Design for the loop', 'Small details that make short-form content replayable.', '5 min read'],
];

const longBlogs = [
  ['01', 'A visual language for creators', 'Building a recognizable system across every format, platform, and story.', '12 min read'],
  ['02', 'The retention edit', 'How I turn a rough talking-head recording into a journey people finish.', '15 min read'],
];

function VideoCard({ video, onOpen }: { video: Video; onOpen: (video: Video) => void }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -8, rotateX: 3, rotateY: -3 }}
      transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      onClick={() => onOpen(video)}
      className="group glass-card video-card text-left"
    >
      <div className={`video-art bg-gradient-to-br ${video.tone}`}>
        <div className="video-depth video-depth-one" />
        <div className="video-depth video-depth-two" />
        <div className="video-grid" />
        <span className="video-number">{video.id}</span>
        <span className="video-play"><Play size={16} fill="currentColor" /></span>
        <span className="video-platform">
          {video.platform === 'instagram' ? <Instagram size={14} /> : <Youtube size={14} />}
          {video.platform}
        </span>
      </div>
      <div className="video-copy">
        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow">{video.category === 'short' ? 'Short form' : video.category === 'long' ? 'Long form' : 'Personal video'}</span>
          <span className="views">{video.views} views</span>
        </div>
        <h3>{video.title}</h3>
        <p>{video.creator}</p>
      </div>
    </motion.button>
  );
}

function normaliseVideoUrl(rawUrl: string, platform: Video['platform']) {
  const url = rawUrl.trim();
  if (platform === 'instagram') {
    const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([^/?#]+)/i);
    return match ? `https://www.instagram.com/${url.includes('/reel/') ? 'reel' : 'p'}/${match[1]}/embed` : url;
  }
  const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([^?&#/]+)/i);
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  return driveMatch ? `https://drive.google.com/file/d/${driveMatch[1]}/preview` : url;
}

function autoplayVideoUrl(video: Video) {
  if (video.videoUrl.includes('drive.google.com')) {
    return video.videoUrl.replace(/\/view(?:\?.*)?$/, '/preview');
  }
  const separator = video.videoUrl.includes('?') ? '&' : '?';
  if (video.platform === 'youtube') {
    return `${video.videoUrl}${separator}autoplay=1&mute=1&playsinline=1&rel=0`;
  }
  return `${video.videoUrl}${separator}autoplay=1`;
}

function AddVideoPage({ onBack }: { onBack: () => void }) {
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [platform, setPlatform] = useState<Video['platform']>('youtube');
  const [category, setCategory] = useState<Video['category']>('short');
  const [views, setViews] = useState('');

  const addVideo = () => {
    if (!title.trim() || !sourceUrl.trim()) {
      toast.error('Add a title and a video link first.');
      return;
    }
    const video: Video = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      creator: creator.trim() || 'Featured creator',
      videoUrl: normaliseVideoUrl(sourceUrl, platform),
      views: views.trim() || 'New',
      platform,
      category,
      tone: platform === 'instagram'
        ? 'from-fuchsia-500/80 via-violet-500/60 to-cyan-400/70'
        : 'from-emerald-400/70 via-cyan-500/60 to-blue-700/80',
    };
    const saved = JSON.parse(localStorage.getItem('nimbuuz-videos') || '[]') as Video[];
    localStorage.setItem('nimbuuz-videos', JSON.stringify([video, ...saved]));
    toast.success('Video added to the homepage.');
    setTitle('');
    setCreator('');
    setSourceUrl('');
    setViews('');
  };

  return (
    <main className="site-shell add-page">
      <div className="ambient ambient-one" />
      <div className="grid-lines" />
      <nav className="site-nav container">
        <a href="/" className="brand"><span className="brand-mark">N</span><span>Nikhil <span className="brand-dot">|</span> Editor</span></a>
        <button className="button-quiet" onClick={onBack}>← Back to portfolio</button>
      </nav>
      <section className="container add-layout">
        <div className="add-intro">
          <span className="section-kicker">Studio dashboard / Add work</span>
          <h1>Put your next<br /><em>frame</em> online.</h1>
          <p>Add an Instagram post, YouTube video, or Google Drive file. The link is normalised for embedding and appears in the matching 3D work section on the homepage.</p>
          <div className="add-note"><Film size={18} /> Stored in this browser for now</div>
        </div>
        <div className="glass-card add-form">
          <div className="booking-top"><span>NEW FEATURED VIDEO</span><Sparkles size={17} /></div>
          <label>Project title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="The retention edit" /></label>
          <label>Creator / client<input value={creator} onChange={(event) => setCreator(event.target.value)} placeholder="Creator name" /></label>
          <label>Video link<input value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="Instagram, YouTube, or Drive URL" /></label>
          <div className="input-grid">
            <label>Platform<select value={platform} onChange={(event) => setPlatform(event.target.value as Video['platform'])}><option value="youtube">YouTube / Drive</option><option value="instagram">Instagram</option></select></label>
            <label>Format<select value={category} onChange={(event) => setCategory(event.target.value as Video['category'])}><option value="short">Short form / 9:16</option><option value="long">Long form / 16:9</option></select></label>
          </div>
          <label>Views <span className="muted-label">(optional)<input value={views} onChange={(event) => setViews(event.target.value)} placeholder="12.4M" /></span></label>
          <button type="button" className="button-primary submit-button" onClick={addVideo}>Add to selected work <ArrowUpRight size={18} /></button>
          <p className="form-note">Tip: YouTube watch links, youtu.be links, and Drive file links are converted automatically.</p>
        </div>
      </section>
      <Toaster theme="dark" position="bottom-right" />
    </main>
  );
}

function BlogRow({ item }: { item: string[] }) {
  return (
    <a href="#contact" className="blog-row group">
      <span className="blog-index">{item[0]}</span>
      <span className="flex-1">
        <strong>{item[1]}</strong>
        <small>{item[2]}</small>
      </span>
      <span className="blog-time">{item[3]}</span>
      <ArrowUpRight className="blog-arrow" size={20} />
    </a>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [customVideos] = useState<Video[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('nimbuuz-videos') || '[]') as Video[];
    } catch {
      return [];
    }
  });

  if (window.location.pathname === '/add') {
    return <AddVideoPage onBack={() => { window.location.href = '/'; }} />;
  }

  const allVideos = [...customVideos, ...videos];

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grid-lines" />

      <nav className="site-nav container">
        <a href="#" className="brand"><span className="brand-mark">N</span><span>Nikhil <span className="brand-dot">|</span> Editor</span></a>
        <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
          <a href="#work" onClick={() => setMenuOpen(false)}>Selected work</a>
          <a href="#journal" onClick={() => setMenuOpen(false)}>Journal</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </div>
        <div className="nav-actions"><a href="/add" className="nav-add">+ Add work</a><a href="#book" className="nav-cta">Book a call <ArrowUpRight size={16} /></a></div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
      </nav>

      <section className="hero container">
        <div className="hero-copy">
          <div className="status-pill"><span className="status-dot" /> Available for select projects <span className="status-line" /></div>
          <p className="hero-kicker">Independent editor / motion designer</p>
          <h1>I make stories<br /><em>move.</em></h1>
          <p className="hero-description">Cinematic edits, sharp motion, and ideas with a pulse. I help creators and ambitious teams turn raw footage into work people remember.</p>
          <div className="hero-actions">
            <a href="#work" className="button-primary">Explore the work <ArrowUpRight size={18} /></a>
            <a href="#about" className="button-quiet">The short version <span>↓</span></a>
          </div>
          <div className="hero-meta"><span>Based in New Delhi</span><span className="meta-rule" /><span>Working globally</span></div>
        </div>

        <div className="hero-stage" aria-label="Abstract 3D artwork">
          <div className="stage-ring ring-one" />
          <div className="stage-ring ring-two" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="stage-card stage-card-back" />
          <div className="stage-card stage-card-main">
            <div className="stage-card-top"><span>FRAME / 001</span><span>PLAY</span></div>
            <div className="stage-sphere"><div className="sphere-highlight" /></div>
            <div className="stage-card-bottom"><span>emotion</span><span>→</span></div>
          </div>
          <div className="float-label label-one">EDIT / 24</div>
          <div className="float-label label-two">∞ LOOP</div>
          <div className="stage-cross">+</div>
        </div>
      </section>

      <section className="signal-strip">
        <div className="container signal-inner"><span>Selected clients</span><span>Jhansi Way</span><span>The Top Percentile</span><span>Ask Life With Anmol</span><span>Aditya TTP</span></div>
      </section>

      <section id="work" className="section container">
        <div className="section-heading"><div><span className="section-kicker">01 / Selected work</span><h2>Made to be <span>felt.</span></h2></div><p>Every cut has a job: hold attention, sharpen an idea, or make someone press replay.</p></div>
        <div className="work-block">
          <div className="sub-heading"><div><span className="section-kicker">Fast, focused, replayable</span><h3>Short form <span>/</span> 9:16</h3></div><a href="#contact">See all shorts <ArrowUpRight size={16} /></a></div>
          <div className="video-grid-cards">{allVideos.filter((video) => video.category === 'short').map((video) => <VideoCard key={video.id} video={video} onOpen={setActiveVideo} />)}</div>
        </div>
        <div className="work-block long-work">
          <div className="sub-heading"><div><span className="section-kicker">Room for the story</span><h3>Long form <span>/</span> 16:9</h3></div><a href="#contact">See all films <ArrowUpRight size={16} /></a></div>
          <div className="long-grid">{allVideos.filter((video) => video.category === 'long').map((video) => <VideoCard key={video.id} video={video} onOpen={setActiveVideo} />)}</div>
        </div>
      </section>

      <section className="section personal-section">
        <div className="container">
          <div className="section-heading"><div><span className="section-kicker">01.5 / Personal corner</span><h2>Off the clock,<br /><span>still creating.</span></h2></div><p>A little space for experiments, visual notes, and edits made just because the idea would not leave me alone.</p></div>
          <div className="personal-grid">{personalVideos.map((video) => <VideoCard key={video.id} video={video} onOpen={setActiveVideo} />)}</div>
        </div>
      </section>

      <section id="about" className="section about-section">
        <div className="container about-grid">
          <div className="about-image-wrap"><img src={profileImage} alt="Nikhil, video editor" /><span className="image-tag">N / 1999</span></div>
          <div className="about-copy"><span className="section-kicker">02 / The short version</span><h2>Part editor,<br /><span>part antenna.</span></h2><p>I am Nikhil — a video editor and motion designer obsessed with the tiny choices that change how a story lands. I work with creators who have something to say and want the edit to say it louder.</p><div className="about-stats"><div><strong>2</strong><span>years making<br />things move</span></div><div><strong>150M+</strong><span>views across<br />selected work</span></div><div><strong>∞</strong><span>curiosity<br />remaining</span></div></div></div>
        </div>
      </section>

      <section id="journal" className="section container journal-section">
        <div className="section-heading"><div><span className="section-kicker">03 / Journal</span><h2>Notes from<br /><span>the timeline.</span></h2></div><p>Small observations and long-form breakdowns from the edit suite.</p></div>
        <div className="journal-columns"><div className="journal-column"><div className="journal-label"><span>Short reads</span><span>01—03</span></div>{shortBlogs.map((item) => <BlogRow item={item} key={item[0]} />)}</div><div className="journal-column"><div className="journal-label"><span>Deep dives</span><span>01—02</span></div>{longBlogs.map((item) => <BlogRow item={item} key={item[0]} />)}</div></div>
      </section>

      <section id="book" className="section booking-section">
        <div className="container contact-grid">
          <div>
            <span className="section-kicker">04 / Get in touch</span>
            <h2>Let&apos;s make<br /><span>something move.</span></h2>
            <p>For edits, collaborations, or a good conversation about a new idea, reach out directly.</p>
          </div>
          <div className="glass-card contact-card">
            <span className="booking-top">DIRECT CONTACT</span>
            <a className="contact-row" href="mailto:nikhmdia@gmail.com"><Mail size={20} /><span><small>Email</small><strong>nikhmdia@gmail.com</strong></span><ArrowUpRight size={18} /></a>
            <a className="contact-row" href="tel:+919891698051"><Phone size={20} /><span><small>Call / WhatsApp</small><strong>+91 9891698051</strong></span><ArrowUpRight size={18} /></a>
          </div>
        </div>
      </section>

      <footer id="contact" className="site-footer container"><div className="footer-main"><a href="#" className="brand"><span className="brand-mark">N</span><span>Nikhil <span className="brand-dot">|</span> Editor</span></a><h2>Let's make<br /><span>the next frame.</span></h2><a className="footer-email" href="mailto:nikhmdia@gmail.com">nikhmdia@gmail.com <ArrowUpRight size={20} /></a></div><div className="footer-bottom"><span>© 2025 Nikhil | Editor</span><span>Designed & edited with intent</span><div className="socials"><a href="https://instagram.com/nimbuuz.mov" aria-label="Instagram"><Instagram size={17} /></a><a href="https://www.youtube.com" aria-label="YouTube"><Youtube size={17} /></a><a href="https://linkedin.com" aria-label="LinkedIn"><Linkedin size={17} /></a></div></div></footer>

      {activeVideo && <div className="video-modal" role="dialog" aria-modal="true" onClick={() => setActiveVideo(null)}><div className="theater-stage"><div className={`video-modal-inner ${activeVideo.platform === 'instagram' ? 'portrait' : ''}`} onClick={(event) => event.stopPropagation()}><div className="theater-reflection" /><button className="modal-close" onClick={() => setActiveVideo(null)} aria-label="Close video"><X /></button><iframe src={autoplayVideoUrl(activeVideo)} title={activeVideo.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /><div className="theater-caption"><span>{activeVideo.category === 'personal' ? 'PERSONAL CORNER' : 'SELECTED WORK'}</span><strong>{activeVideo.title}</strong><small>{activeVideo.creator}</small></div></div></div></div>}
      <Toaster theme="dark" position="bottom-right" />
    </main>
  );
}
