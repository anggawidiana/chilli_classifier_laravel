import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { Facebook, Instagram, Twitter, Youtube, Star, Leaf, Cpu, ScanLine, LineChart } from 'lucide-react';

const HERO_IMG = '/hero-bg.jpg';
const FARMER_IMG =
    'https://images.unsplash.com/photo-1605664041152-4f2e9ec64b97?auto=format&fit=crop&w=900&q=80';
const HARVEST_IMG =
    'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80';
const FIELD_VIDEO_IMG =
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80';
const CTA_BG_IMG = '/cta-bg.jpg';

const PRODUCT_HEALTHY = '/diseases/healthy.jpg';
const PRODUCT_CURL = '/diseases/curl-virus.jpg';
const PRODUCT_BACTERIAL = '/diseases/bacterial-spot.jpg';

const TECH_1 = '/tech/tech-1.jpg';
const TECH_2 = '/tech/tech-2.jpg';
const TECH_3 = '/tech/tech-3.jpg';
const TECH_4 = '/tech/tech-4.jpg';

const AVATAR_1 = 'https://i.pravatar.cc/80?img=12';
const AVATAR_2 = 'https://i.pravatar.cc/80?img=13';
const AVATAR_3 = 'https://i.pravatar.cc/80?img=14';
const AVATAR_4 = 'https://i.pravatar.cc/80?img=15';
const AVATAR_5 = 'https://i.pravatar.cc/80?img=33';

const BRAND = 'ChiliLab';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Smart Chilli Disease Detection" />

            <div className="min-h-screen bg-white font-sans text-[#1b1b18] antialiased">
                {/* ============== HERO ============== */}
                <section className="relative w-full overflow-hidden">
                    {/* Background image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${HERO_IMG}')` }}
                    />
                    {/* Top fade for nav legibility + bottom fade for content legibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60" />

                    {/* Header */}
                    <header className="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                            <span className="text-lg font-bold tracking-wide text-white">
                                ChiliLab
                            </span>
                        </div>

                        <nav className="hidden items-center gap-8 text-sm font-medium text-white md:flex">
                            <a href="#home" className="underline-offset-4 hover:underline">Home</a>
                            <a href="#about" className="opacity-90 hover:opacity-100">About Us</a>
                            <a href="#detection" className="opacity-90 hover:opacity-100">Smart Detection</a>
                            <a href="#diseases" className="opacity-90 hover:opacity-100">Diseases</a>
                            <a href="#contact" className="opacity-90 hover:opacity-100">Contact</a>
                        </nav>

                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#1b1b18] shadow-sm hover:bg-white/90"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#1b1b18] shadow-sm hover:bg-white/90"
                            >
                                Try Detection
                            </Link>
                        )}
                    </header>

                    {/* Giant brand text — sits in the upper half, between header and content */}
                    <div className="pointer-events-none relative z-10 mx-auto mt-4 flex max-w-7xl px-6 lg:px-10">
                        <h2 className="select-none whitespace-nowrap text-[14vw] leading-[0.85] font-extrabold tracking-tight text-white/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
                            {BRAND}
                        </h2>
                    </div>

                    {/* Hero content — sits at the bottom of the hero */}
                    <div className="relative z-20 mx-auto max-w-7xl px-6 pt-20 pb-20 lg:px-10 lg:pt-32 lg:pb-28">
                        <div className="grid items-end gap-10 lg:grid-cols-2">
                            <h1 className="max-w-2xl text-4xl leading-[1.05] font-bold text-white drop-shadow-md sm:text-5xl lg:text-6xl">
                                Smart Chilli Disease
                                <br />
                                Detection Powered by AI.
                            </h1>
                            <div className="flex flex-col gap-6 lg:items-start lg:pl-6">
                                <p className="max-w-md text-base leading-relaxed text-white drop-shadow">
                                    ChiliLab combines deep learning and modern computer vision
                                    to identify chilli leaf diseases in seconds — giving farmers
                                    healthier crops, smarter decisions, and bigger harvests.
                                </p>
                                <Link
                                    href={auth.user ? dashboard() : register()}
                                    className="inline-flex w-fit items-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#1b1b18] shadow-md hover:bg-white/90"
                                >
                                    Start Detecting
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============== GROWING BETTER FOOD ============== */}
                <section id="about" className="bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div>
                                <h2 className="text-3xl font-bold leading-tight text-[#1b1b18] sm:text-4xl lg:text-5xl">
                                    Growing Healthier Chillies
                                    <br />
                                    Through Smart AI Detection
                                </h2>
                                <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#5b5b58]">
                                    At ChiliLab, we combine convolutional neural networks,
                                    image-based leaf analysis, and real-time severity scoring to
                                    detect chilli diseases instantly — without lab tests. From
                                    early-stage symptoms to advanced infections, every prediction
                                    is precise, fast, and consistent.
                                </p>
                                <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#5b5b58]">
                                    Whether you upload one leaf or scan an entire crop, you
                                    experience the future of plant disease diagnostics first-hand.
                                </p>

                                <div className="mt-8 flex flex-wrap gap-3">
                                    <FeatureChip icon={<Cpu className="h-4 w-4" />} label="AI Model" />
                                    <FeatureChip icon={<ScanLine className="h-4 w-4" />} label="Instant Scan" />
                                    <FeatureChip icon={<Leaf className="h-4 w-4" />} label="Leaf Analysis" />
                                    <FeatureChip icon={<LineChart className="h-4 w-4" />} label="Severity Score" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <img
                                    src={FARMER_IMG}
                                    alt="Chilli farmer"
                                    className="aspect-[3/4] h-full w-full rounded-2xl object-cover"
                                />
                                <img
                                    src={HARVEST_IMG}
                                    alt="Fresh chillies"
                                    className="mt-10 aspect-[3/4] h-full w-full rounded-2xl object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============== DISEASES WE DETECT ============== */}
                <section id="diseases" className="bg-green-50/70">
                    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
                        <div className="mx-auto max-w-xl text-center">
                            <h2 className="text-3xl font-bold text-[#1b1b18] sm:text-4xl">
                                Common Diseases We Detect
                            </h2>
                            <p className="mt-4 text-sm text-[#5b5b58]">
                                Our AI is trained on thousands of chilli leaf images across multiple
                                disease classes — providing accurate identification and severity
                                analysis for every scan.
                            </p>
                        </div>

                        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <DiseaseCard
                                image={PRODUCT_HEALTHY}
                                title="Healthy"
                                subtitle="Strong, vibrant leaves showing no signs of disease."
                                tags={['Optimal', 'Low Risk']}
                            />
                            <DiseaseCard
                                image={PRODUCT_CURL}
                                title="Curl Virus"
                                subtitle="Curled and deformed leaves caused by viral infection."
                                tags={['Viral', 'Severe']}
                            />
                            <DiseaseCard
                                image={PRODUCT_BACTERIAL}
                                title="Bacterial Spot"
                                subtitle="Dark lesions on leaves caused by bacterial infection."
                                tags={['Bacterial', 'Treatable']}
                            />
                        </div>

                    </div>
                </section>

                {/* ============== EXPLORE / TABS ============== */}
                <section id="detection" className="bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
                        <div
                            className="relative h-[360px] overflow-hidden rounded-2xl bg-cover bg-center sm:h-[480px]"
                            style={{ backgroundImage: `url('${FIELD_VIDEO_IMG}')` }}
                        >
                            <div className="absolute inset-0 bg-black/10" />
                        </div>

                        <div className="mt-10 grid gap-8 sm:grid-cols-3">
                            <TabBlock
                                title="Explore the Fields"
                                body="Browse through real chilli farms using sample images and see how our AI works on live captures from farm to leaf."
                            />
                            <TabBlock
                                title="Learn the Tech"
                                body="Discover the convolutional neural network behind ChiliLab — and how transfer learning powers fast, accurate disease detection."
                            />
                            <TabBlock
                                title="Meet the Team"
                                body="Chat with our researchers, share use-cases, and learn how universities and farmers collaborate on smarter agriculture."
                            />
                        </div>

                    </div>
                </section>

                {/* ============== POWERED BY MODERN AI ============== */}
                <section className="bg-white">
                    <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold text-[#1b1b18] sm:text-4xl">
                                Powered by Modern
                                <br />
                                AI Innovation
                            </h2>
                            <p className="mt-4 text-sm text-[#5b5b58]">
                                ChiliLab uses advanced deep learning models and modern image
                                pipelines to improve crop health, reduce loss, and boost
                                productivity for farmers everywhere.
                            </p>
                        </div>

                        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <FeatureCard
                                image={TECH_1}
                                title="Precision Detection"
                                bullets={[
                                    'High-accuracy CNN model',
                                    'Multi-class predictions',
                                    'Severity percent scoring',
                                ]}
                            />
                            <FeatureCard
                                image={TECH_2}
                                title="Automated Analysis"
                                bullets={[
                                    'Real-time leaf scanning',
                                    'Auto-cropping & resizing',
                                    'Confidence scoring',
                                ]}
                            />
                            <FeatureCard
                                image={TECH_3}
                                title="Field-Ready"
                                bullets={[
                                    'Works on phone photos',
                                    'No lab equipment needed',
                                    'Offline-capable design',
                                ]}
                            />
                            <FeatureCard
                                image={TECH_4}
                                title="Farm Analytics"
                                bullets={[
                                    'Detection history log',
                                    'Daily & weekly trends',
                                    'Exportable reports',
                                ]}
                            />
                        </div>

                    </div>
                </section>

                {/* ============== TESTIMONIALS ============== */}
                <section className="bg-white">
                    <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
                        <h2 className="text-center text-3xl font-bold text-[#1b1b18] sm:text-4xl">
                            What Our Farmers Say
                        </h2>

                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <Testimonial
                                avatar={AVATAR_1}
                                name="EDGAR"
                                role="Chilli Grower"
                                body="Detection is instant and surprisingly accurate. I scan my whole field every morning before sunrise."
                            />
                            <Testimonial
                                avatar={AVATAR_2}
                                name="EDWIN"
                                role="Smallholder Farmer"
                                body="The process is simple and the predictions match what an agronomist confirmed days later."
                            />
                            <Testimonial
                                avatar={AVATAR_3}
                                name="SINDU"
                                role="Agritech Engineer"
                                body="Our yields are noticeably more consistent because we catch leaf disease early. ChiliLab pays for itself."
                            />
                            <Testimonial
                                avatar={AVATAR_4}
                                name="ANGGA"
                                role="Farm Manager"
                                body="I've tried many tools. ChiliLab's consistency and transparency are unmatched. My team keeps using it."
                            />
                            <Testimonial
                                avatar={AVATAR_5}
                                name="MATIUS"
                                role="Crop Researcher"
                                body="Seeing the model and pipeline in action gave me real ideas for improving my own farming workflow."
                            />
                        </div>

                    </div>
                </section>

                {/* ============== CTA BANNER ============== */}
                <section className="bg-white px-6 pb-16 lg:px-10">
                    <div className="mx-auto max-w-7xl">
                        <div
                            className="relative overflow-hidden rounded-2xl bg-cover bg-center px-8 py-16 sm:px-14 sm:py-24"
                            style={{ backgroundImage: `url('${CTA_BG_IMG}')` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
                            <div className="relative max-w-lg text-white">
                                <h3 className="text-3xl font-bold leading-tight sm:text-4xl">
                                    Healthier Crops Start With
                                    <br />
                                    Smarter Detection
                                </h3>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Link
                                        href={auth.user ? dashboard() : register()}
                                        className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#1b1b18] hover:bg-white/90"
                                    >
                                        Start Detection
                                    </Link>
                                    <a
                                        href="#contact"
                                        className="rounded-full border border-white px-7 py-3 text-sm font-semibold text-white hover:bg-white hover:text-[#1b1b18]"
                                    >
                                        Book Farm Visit
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============== FOOTER ============== */}
                <footer id="contact" className="relative overflow-hidden bg-[#0a0a0a] text-white">
                    <div className="mx-auto max-w-7xl px-6 pt-20 pb-10 lg:px-10">
                        <div className="grid gap-10 lg:grid-cols-[2fr_1fr_1fr]">
                            <div>
                                <div className="flex items-center gap-2">
                                    <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                                    <span className="text-lg font-bold tracking-wide">ChiliLab</span>
                                </div>
                                <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
                                    Smart chilli disease detection powered by deep learning. We help
                                    farmers grow healthier crops using modern AI, responsible
                                    research, and a commitment to transparency.
                                </p>
                                <div className="mt-6 flex items-center gap-3 text-white/80">
                                    <SocialIcon><Facebook className="h-4 w-4" /></SocialIcon>
                                    <SocialIcon><Instagram className="h-4 w-4" /></SocialIcon>
                                    <SocialIcon><Twitter className="h-4 w-4" /></SocialIcon>
                                    <SocialIcon><Youtube className="h-4 w-4" /></SocialIcon>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-white">Classes</h4>
                                <ul className="mt-4 space-y-2 text-sm text-white/70">
                                    {['Bacterial Spot', 'Cercospora Leaf Spot', 'Curl Virus', 'Healthy Leaf', 'Nutrition Deficiency', 'White Spot'].map((c) => (
                                        <li key={c}>{c}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white">Contact Info</h4>
                                <ul className="mt-4 space-y-2 text-sm text-white/70">
                                    <li>Singaraja, Bali, Indonesia</li>
                                    <li>+62 813 0000 0000</li>
                                    <li>08.00 AM – 18.00 PM</li>
                                    <li>support@chililab.id</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50">
                            <span>© {new Date().getFullYear()} ChiliLab. All rights reserved.</span>
                            <div className="flex gap-6">
                                <a href="#" className="hover:text-white">Privacy Policy</a>
                                <a href="#" className="hover:text-white">Terms &amp; Conditions</a>
                            </div>
                        </div>
                    </div>

                    {/* giant brand text */}
                    <div className="pointer-events-none flex justify-center pb-2">
                        <span className="select-none text-[20vw] leading-none font-extrabold tracking-tight text-white/10">
                            {BRAND}
                        </span>
                    </div>
                </footer>
            </div>
        </>
    );
}

/* ---------- helpers ---------- */

function FeatureChip({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-[#e3e3e0] bg-white px-3 py-1.5 text-xs font-medium text-[#1b1b18]">
            {icon}
            {label}
        </span>
    );
}

function DiseaseCard({
    image,
    title,
    subtitle,
    tags,
}: {
    image: string;
    title: string;
    subtitle: string;
    tags: string[];
}) {
    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div
                className="h-44 w-full bg-cover bg-center"
                style={{ backgroundImage: `url('${image}')` }}
            />
            <div className="p-5">
                <h3 className="text-lg font-semibold text-[#1b1b18]">{title}</h3>
                <p className="mt-1 text-xs text-[#5b5b58]">{subtitle}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((t) => (
                        <span
                            key={t}
                            className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-medium text-green-700"
                        >
                            {t}
                        </span>
                    ))}
                </div>
                <button className="mt-5 w-full rounded-full bg-[#1b1b18] py-2 text-xs font-semibold text-white hover:bg-black">
                    Get A Scan
                </button>
            </div>
        </div>
    );
}

function TabBlock({ title, body }: { title: string; body: string }) {
    return (
        <div>
            <h4 className="text-base font-semibold text-[#1b1b18]">{title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-[#5b5b58]">{body}</p>
        </div>
    );
}

function FeatureCard({
    image,
    title,
    bullets,
}: {
    image: string;
    title: string;
    bullets: string[];
}) {
    return (
        <div className="rounded-2xl border border-[#e3e3e0] bg-white p-4">
            <div
                className="h-32 w-full rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url('${image}')` }}
            />
            <h4 className="mt-4 text-base font-semibold text-[#1b1b18]">{title}</h4>
            <ul className="mt-3 space-y-1.5 text-xs text-[#5b5b58]">
                {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-green-500" />
                        <span>{b}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Testimonial({
    avatar,
    name,
    role,
    body,
}: {
    avatar: string;
    name: string;
    role: string;
    body: string;
}) {
    return (
        <div className="rounded-2xl border border-[#e3e3e0] bg-white p-6">
            <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#5b5b58]">"{body}"</p>
            <div className="mt-4 flex items-center gap-3">
                <img src={avatar} alt={name} className="h-9 w-9 rounded-full object-cover" />
                <div>
                    <p className="text-xs font-semibold tracking-wide text-[#1b1b18]">{name}</p>
                    <p className="text-[10px] text-[#5b5b58]">{role}</p>
                </div>
            </div>
        </div>
    );
}

function SocialIcon({ children }: { children: React.ReactNode }) {
    return (
        <a
            href="#"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"
        >
            {children}
        </a>
    );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
    return (
        <div>
            <h4 className="text-sm font-semibold text-white">{title}</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
                {items.map((item) => (
                    <li key={item}>
                        <a href="#" className="hover:text-white">
                            {item}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
