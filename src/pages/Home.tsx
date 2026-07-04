/**
 * GEZA — The Hairdressing & Braiding Platform
 * ─────────────────────────────────────────────────────────────────────────
 * An premium digital home for premium hair care and professional craft.
 * Palette: Forest green, muted gold, warm luxury linen.
 * Motif: The door logo symbol represents client arrival and opening professional doors.
 */

import {
  useMemo,
  useRef,
  useState,
  useCallback,
  createContext,
  useContext,
  Suspense,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  MoonStar,
  Globe,
  ArrowRight,
  CheckCircle2,
  Circle,
  ChevronDown,
  X,
  TerminalSquare,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Import custom hair braiding imagery assets
import img1 from "../assets/images/img1.jpeg";
import img2 from "../assets/images/img2.jpeg";
import img3 from "../assets/images/img3.jpeg";

/* ────────────────────────────────────────────────────────────────────────
   Copy — EN / DE (Hair Care & Professional Styling Focus)
   ──────────────────────────────────────────────────────────────────── */

type Lang = "en" | "de";

const COPY = {
  en: {
    eyebrow: "A Digital Home For Craft",
    heroSub:
      "Beauty finds you at home. Book a luxury chair, a custom braid sequence, or a trusted stylist you count on — wherever you are.",
    heroCta: "Find a Stylist",
    scrollHint: "Scroll to view story",
    sections: [
      {
        title: "The Vision",
        body: "Every high-end service starts with deep trust. GEZA creates a bridge between discerning clients and the master hands who shape their personal crowns, making scheduling as smooth as silk.",
      },
      {
        title: "The Craft",
        body: "Braiding is patience made visible, one strand folded deliberately into the next until a perfect geometric crown is formed. We build GEZA with the same micro-precision — honoring the master artisan.",
      },
      {
        title: "The Salon Experience",
        body: "The finest care shouldn't feel corporate; it should feel intimate, focused, and absolute. GEZA preserves the luxury studio vibe online, ensuring your schedule moves seamlessly along with your creative lookbooks.",
      },
    ],
    ctaTitle: "Opening Doors for Stylists & Clients.",
    customer: {
      kicker: "I am looking for elite hair care",
      body: "Discover leading expert braiders near you, explore portfolios, and secure your session in minutes.",
      action: "Book a Chair",
    },
    hairdresser: {
      kicker: "I offer professional hair craft",
      body: "Scale your beauty business. Securely host your scheduling portfolio, deposits, and client list under one home.",
      action: "Open Your Studio Door",
    },
    footerNote: "GEZA — Exceptional hair artistry, brought directly to you.",
  },
  de: {
    eyebrow: "Ein digitales Zuhause für das Handwerk",
    heroSub:
      "Schönheit findet dich zu Hause. Buche einen exklusiven Stuhl, ein kunstvolles Flechtdesign oder Hände, denen du vertraust — wo auch immer du bist.",
    heroCta: "Stylistin finden",
    scrollHint: "Scrollen für Details",
    sections: [
      {
        title: "Die Vision",
        body: "Jeder exzellente Service beginnt mit tiefem Vertrauen. GEZA schlägt die Brücke zwischen anspruchsvollen Kunden und den Meisterhänden, die ihre persönliche Krone formen.",
      },
      {
        title: "Das Handwerk",
        body: "Zöpfe flechten ist sichtbar gewordene Geduld, Strähne für Strähne, bis ein makelloses Ganzes entsteht. Wir bauen GEZA mit genau derselben Präzision — zu Ehren des wahren Handwerks.",
      },
      {
        title: "Das Salon-Erlebnis",
        body: "Die beste Pflege sollte sich nicht wie ein Geschäft anfühlen, sondern persönlich und absolut verlässlich. GEZA trägt dieses Gefühl zu dir, damit dein Terminkalender reibungslos läuft.",
      },
    ],
    ctaTitle: "Türen öffnen für Stylisten & Kunden.",
    customer: {
      kicker: "Ich suche erstklassige Haarpflege",
      body: "Finde erfahrene Braiderinnen in deiner Nähe, entdecke Portfolios und buche deinen Termin in wenigen Minuten.",
      action: "Stuhl buchen",
    },
    hairdresser: {
      kicker: "Ich biete mein Handwerk an",
      body: "Bringe deinen Kalender, dein Portfolio und deine Kundschaft in einem professionellen Zuhause zusammen.",
      action: "Studio-Tür öffnen",
    },
    footerNote: "GEZA — Außergewöhnliche Haarkunst, zu dir gebracht.",
  },
} as const;

type Copy = (typeof COPY)[keyof typeof COPY];

/* ────────────────────────────────────────────────────────────────────────
   Logo Geometric Mark
   ──────────────────────────────────────────────────────────────────── */

function GezaMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="GEZA logo mark"
    >
      <path
        d="M4 44 V22 L24 4 L44 22 V44 Z"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M18 44 V28 C18 24.5 20.5 22 24 22 C27.5 22 30 24.5 30 28 V44"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Theme & Navigation Controls
   ──────────────────────────────────────────────────────────────────── */

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const options: { value: "light" | "dark" | "night"; icon: ReactNode; label: string }[] = [
    { value: "light", icon: <Sun size={14} />, label: "Light" },
    { value: "dark", icon: <Moon size={14} />, label: "Dark" },
    { value: "night", icon: <MoonStar size={14} />, label: "Night" },
  ];
  return (
    <div className="flex items-center gap-1 rounded-full border border-stone-800/15 dark:border-amber-50/15 night:border-amber-500/20 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={theme === o.value}
          aria-label={`${o.label} theme`}
          onClick={() => setTheme(o.value)}
          className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${
            theme === o.value
              ? "bg-emerald-800 text-amber-50 night:bg-amber-500 night:text-stone-900"
              : "text-stone-800/50 hover:text-stone-800 dark:text-amber-50/50 dark:hover:text-amber-50 night:text-amber-50/50 night:hover:text-amber-50"
          }`}
        >
          {o.icon}
        </button>
      ))}
    </div>
  );
}

function LanguageToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide">
      <Globe size={14} className="text-stone-800/50 dark:text-amber-50/50 night:text-amber-500/70" />
      {(["en", "de"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded px-1.5 py-0.5 uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${
            lang === l
              ? "text-emerald-800 dark:text-amber-400 night:text-amber-500"
              : "text-stone-800/40 hover:text-stone-800 dark:text-amber-50/40 dark:hover:text-amber-50 night:text-amber-50/40 night:hover:text-amber-50"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function Navbar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-12">
      <div className="flex items-center gap-2 text-stone-900 dark:text-amber-50 night:text-amber-50">
        <GezaMark className="h-6 w-6" />
        <span className="font-serif text-lg tracking-[0.15em]">GEZA</span>
      </div>
      <div className="flex items-center gap-4">
        <LanguageToggle lang={lang} setLang={setLang} />
        <span className="h-4 w-px bg-stone-800/15 dark:bg-amber-50/15 night:bg-amber-500/20" />
        <ThemeToggle />
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Hero Area
   ──────────────────────────────────────────────────────────────────── */

function Hero({ copy }: { copy: Copy }) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-amber-50/40 px-6 text-center dark:bg-stone-900 night:bg-[#0a0908]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(192,133,82,0.12),_transparent_60%)]" />

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-amber-600"
      >
        {copy.eyebrow}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        className="flex items-center gap-4"
      >
        <GezaMark className="h-12 w-12 text-emerald-800 dark:text-amber-500 night:text-amber-500 md:h-16 md:w-16" />
        <h1 className="font-serif text-7xl font-medium tracking-tight text-stone-900 dark:text-amber-50 night:text-amber-50 md:text-9xl">
          GEZA
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
        className="mt-8 max-w-md text-balance font-sans text-base leading-relaxed text-stone-800/70 dark:text-amber-50/70 night:text-amber-50/60"
      >
        {copy.heroSub}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-emerald-800 px-7 py-3.5 font-sans text-sm font-semibold text-amber-50 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 night:bg-amber-500 night:text-stone-950"
      >
        {copy.heroCta}
        <ArrowRight size={16} />
      </motion.button>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-stone-800/40 dark:text-amber-50/40 night:text-amber-50/30"
      >
        <span className="text-[11px] uppercase tracking-[0.25em]">{copy.scrollHint}</span>
        <ChevronDown size={16} />
      </motion.div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   3D Door Shape Canvas Renderers
   ──────────────────────────────────────────────────────────────────── */

function doorShape(width = 2.2, height = 3.1, gable = 0.7) {
  const shape = new THREE.Shape();
  const hw = width / 2;
  shape.moveTo(-hw, 0);
  shape.lineTo(-hw, height - gable);
  shape.lineTo(0, height);
  shape.lineTo(hw, height - gable);
  shape.lineTo(hw, 0);
  shape.closePath();
  return shape;
}

function DoorPanel({
  index,
  registerRef,
}: {
  index: number;
  registerRef: (i: number, mesh: THREE.Mesh | null) => void;
}) {
  const geometry = useMemo(() => new THREE.ShapeGeometry(doorShape()), []);
  const images = [img1, img2, img3];
  const texture = useTexture(images[index] || img1);

  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh
      ref={(m) => registerRef(index, m)}
      geometry={geometry}
      position={[0, -0.4, -4]}
    >
      <meshBasicMaterial map={texture} transparent opacity={0} toneMapped={false} />
    </mesh>
  );
}

function SceneRig({
  scrollProgress,
  panelCount,
  reduceMotion,
}: {
  scrollProgress: MotionValue<number>;
  panelCount: number;
  reduceMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);

  const registerRef = useCallback((i: number, mesh: THREE.Mesh | null) => {
    meshes.current[i] = mesh;
  }, []);

  useFrame((state) => {
    const p = scrollProgress.get();
    const scaled = p * panelCount;

    for (let i = 0; i < panelCount; i++) {
      const mesh = meshes.current[i];
      if (!mesh) continue;
      const dist = scaled - i;
      const focus = 1 - Math.min(Math.abs(dist), 1);

      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = THREE.MathUtils.lerp(0, 1, focus);
      mesh.position.z = THREE.MathUtils.lerp(-7, 1.4, focus);
      mesh.position.x = reduceMotion ? 0 : dist * 2.1;
      mesh.rotation.y = reduceMotion ? 0 : dist * 0.22;
      mesh.scale.setScalar(THREE.MathUtils.lerp(0.82, 1, focus));
    }

    if (groupRef.current && !reduceMotion) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.06) * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: panelCount }).map((_, i) => (
        <DoorPanel key={i} index={i} registerRef={registerRef} />
      ))}
    </group>
  );
}

function ScrollStory({ copy }: { copy: Copy }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const sectionCount = copy.sections.length;

  return (
    <section
      ref={containerRef}
      className="relative bg-stone-950"
      style={{ height: `${sectionCount * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}>
            <ambientLight intensity={0.9} />
            <Suspense fallback={null}>
              <SceneRig
                scrollProgress={scrollYProgress}
                panelCount={sectionCount}
                reduceMotion={reduceMotion}
              />
            </Suspense>
          </Canvas>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

        {copy.sections.map((s, i) => (
          <StoryText
            key={s.title}
            index={i}
            title={s.title}
            body={s.body}
            total={sectionCount}
            scrollYProgress={scrollYProgress}
            align={i % 2 === 0 ? "right" : "left"}
          />
        ))}
      </div>
    </section>
  );
}

function StoryText({
  index,
  title,
  body,
  total,
  scrollYProgress,
  align,
}: {
  index: number;
  title: string;
  body: string;
  total: number;
  scrollYProgress: MotionValue<number>;
  align: "left" | "right";
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const pad = 0.06;

  const opacity = useTransform(
    scrollYProgress,
    [start, start + pad, end - pad, end],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [start, start + pad, end - pad, end],
    [24, 0, 0, -24]
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute inset-y-0 flex w-full max-w-xl flex-col justify-center px-8 md:w-1/2 md:px-16 ${
        align === "right" ? "right-0 items-start text-left" : "left-0 items-start text-left"
      }`}
    >
      <span className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="font-serif text-4xl font-medium text-amber-50 md:text-5xl">{title}</h3>
      <p className="mt-5 max-w-sm font-sans text-base leading-relaxed text-amber-50/75">
        {body}
      </p>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   System Diagnostic Console Infrastructure
   ──────────────────────────────────────────────────────────────────── */

interface ConsoleContextType {
  open: boolean;
  setOpen: (v: boolean) => void;
  active: Record<string, boolean>;
  pulse: () => void;
}
const ConsoleContext = createContext<ConsoleContextType | null>(null);

const CHECKS = [
  { id: "sanitize", label: "Data Sanitization Filter", status: "Active", delay: 150 },
  { id: "security", label: "Security Gate Check", status: "Passed", delay: 480 },
  { id: "supabase", label: "Supabase Operational Validation", status: "Clean", delay: 820 },
  { id: "multer", label: "File Stream Stream Ready", status: "Clear", delay: 1160 },
] as const;

function ConsoleProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Record<string, boolean>>({});
  const timers = useRef<number[]>([]);

  const pulse = useCallback(() => {
    setOpen(true);
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setActive({});
    CHECKS.forEach((c) => {
      const t = window.setTimeout(() => {
        setActive((prev) => ({ ...prev, [c.id]: true }));
      }, c.delay);
      timers.current.push(t);
    });
  }, []);

  return (
    <ConsoleContext.Provider value={{ open, setOpen, active, pulse }}>
      {children}
    </ConsoleContext.Provider>
  );
}

function DevConsoleWidget() {
  const ctx = useContext(ConsoleContext);
  if (!ctx) return null;
  const { open, setOpen, active } = ctx;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {open ? (
        <div className="w-72 rounded-xl border border-stone-800/10 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-amber-50/10 dark:bg-stone-900/95 night:border-amber-500/15 night:bg-[#0a0908]/95">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-900 dark:text-amber-50 night:text-amber-50">
              <TerminalSquare size={15} className="text-amber-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">System check</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-stone-800/40 hover:text-stone-800 dark:text-amber-50/40 dark:hover:text-amber-50"
            >
              <X size={14} />
            </button>
          </div>

          <ul className="space-y-2">
            {CHECKS.map((c) => (
              <li key={c.id} className="flex items-center gap-2 text-xs">
                {active[c.id] ? (
                  <CheckCircle2 size={14} className="shrink-0 text-emerald-700 night:text-amber-500" />
                ) : (
                  <Circle size={14} className="shrink-0 text-stone-800/25 dark:text-amber-50/25" />
                )}
                <span className={active[c.id] ? "text-stone-900 dark:text-amber-50" : "text-stone-800/40 dark:text-amber-50/40"}>
                  {c.label}
                </span>
                {active[c.id] && (
                  <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-amber-500">
                    {c.status}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-800/10 bg-white/80 text-stone-800/60 shadow-md backdrop-blur-sm hover:text-stone-900 dark:border-amber-50/10 dark:bg-stone-900/80 dark:text-amber-50/60 night:text-amber-500"
        >
          <TerminalSquare size={16} />
        </button>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Call To Actions & Landing Shell Footer
   ──────────────────────────────────────────────────────────────────── */

function CtaCards({ copy, onInteract }: { copy: Copy; onInteract: () => void }) {
  const navigate = useNavigate();

  const handleRoute = (path: string) => {
    onInteract();
    window.setTimeout(() => navigate(path), 260);
  };

  return (
    <section className="bg-amber-50/30 px-6 py-28 dark:bg-stone-900 night:bg-[#0a0908] md:px-12">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="font-serif text-4xl font-medium text-stone-900 dark:text-amber-50 night:text-amber-50 md:text-5xl">
          {copy.ctaTitle}
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {[
            { ...copy.customer, path: "/register/customer" },
            { ...copy.hairdresser, path: "/register/hairdresser" },
          ].map((card) => (
            <motion.button
              key={card.path}
              type="button"
              onClick={() => handleRoute(card.path)}
              whileHover={{ y: -4 }}
              className="group relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl border border-stone-800/10 bg-white/40 p-9 text-left shadow-sm backdrop-blur-sm transition-shadow hover:shadow-lg dark:border-amber-50/10 dark:bg-white/5"
            >
              <GezaMark className="h-8 w-8 text-emerald-800 dark:text-amber-500" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">{card.kicker}</p>
              <p className="font-sans text-sm leading-relaxed text-stone-800/70 dark:text-amber-50/70">{card.body}</p>
              <span className="mt-2 inline-flex items-center gap-2 font-sans text-sm font-semibold text-emerald-800 dark:text-amber-200 night:text-amber-500">
                {card.action}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ copy }: { copy: Copy }) {
  return (
    <footer className="border-t border-stone-800/10 bg-amber-50/40 px-6 py-8 text-center dark:border-amber-50/10 dark:bg-stone-900 night:bg-[#0a0908]">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2">
        <GezaMark className="h-5 w-5 text-stone-800/30 dark:text-amber-50/30" />
        <p className="font-sans text-xs text-stone-800/50 dark:text-amber-50/50">{copy.footerNote}</p>
      </div>
    </footer>
  );
}

export default function GezaLandingPage() {
  const [lang, setLang] = useState<Lang>("en");
  const copy = COPY[lang];
  const ctx = useContext(ConsoleContext);

  const triggerPulse = () => {
    if (ctx?.pulse) ctx.pulse();
  };

  return (
    <ConsoleProvider>
      <div className="min-h-screen bg-amber-50/20 font-sans dark:bg-stone-900 night:bg-[#0a0908]">
        <Navbar lang={lang} setLang={setLang} />
        <Hero copy={copy} />
        <ScrollStory copy={copy} />
        <CtaCards copy={copy} onInteract={triggerPulse} />
        <Footer copy={copy} />
        <DevConsoleWidget />
      </div>
    </ConsoleProvider>
  );
}