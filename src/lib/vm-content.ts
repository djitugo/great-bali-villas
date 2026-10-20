// Villa Management page content (EN / ID), from "Draft Website GBV.docx".
// Structured copy lives here; the page sections pick the active language.

type Item = { t: string; d: string };
type Division = { name: string; role: string };
type Solution = { title: string; tagline?: string; lead: string; label: string; items: string[]; closing?: string; highlight?: string };
type Pkg = { name: string; period: string; fee?: string; feeIdr?: number; feeNote: string; best: string; featured?: boolean };

export type VmContent = {
  about: { eyebrow: string; title: string; p1: string; portfolioLabel: string; portfolio: string[]; p2: string; commit: string; tailored: string };
  expertise: { eyebrow: string; title: string; items: Item[] };
  why: { eyebrow: string; title: string; hub: string; items: Item[] };
  team: { eyebrow: string; title: string; intro: string; top: string; office: string; site: string; officeDivisions: Division[]; siteDivisions: Division[] };
  solutions: { eyebrow: string; title: string; items: Solution[] };
  cta: { title: string; sub: string; button: string };
  pricing: {
    eyebrow: string;
    title: string;
    from: string;
    enquire: string;
    packages: Pkg[];
    tableTitle: string;
    tableHead: string;
    rows: { label: string; on: [boolean, boolean, boolean] }[];
    exclusion: string;
    requirements: string;
  };
};

// [Exclusive Marketing, Full Management, Property Care]
const ROWS_ON: [boolean, boolean, boolean][] = [
  [false, true, true], // property care & maintenance
  [false, true, false], // property set up
  [false, true, true], // full operational oversight
  [false, true, true], // guest hospitality service
  [false, true, true], // human resources management
  [false, true, false], // review monitoring
  [true, true, false], // channel manager
  [true, true, false], // PMS
  [false, true, false], // guest service agent & concierge
  [true, true, false], // reservation management
  [true, true, false], // OTA management
  [true, true, false], // pricing strategy
  [true, true, false], // digital marketing strategy
  [false, true, false], // google business
  [false, true, false], // marketing tools
  [false, true, true], // payment distribution
  [false, true, true], // expenses & financial controller
  [false, true, false], // financial report
  [true, false, false], // booking list report
  [false, true, false], // government tax report
];

const rows = (labels: string[]) => labels.map((label, i) => ({ label, on: ROWS_ON[i] }));

const en: VmContent = {
  about: {
    eyebrow: "About us",
    title: "Over a decade of Bali villa expertise",
    p1: "Great Bali Villas Management and Marketing, under PT. Great Bali Hebat, is an independent hospitality management company with over 10 years of proven experience in Bali's villa rental and property management industry.",
    portfolioLabel: "We manage and market an extensive portfolio of",
    portfolio: ["Private pool villas, from budget to high-end luxury estates", "Resorts", "Guest houses", "Cottages and glamping"],
    p2: "With a strong focus on personalised service, operational excellence and innovative marketing, we are dedicated to maximising both guest satisfaction and owner profitability.",
    commit:
      "We are committed to seamless property management that enhances the unique value of every villa. By blending local expertise with exceptional hospitality standards, we deliver unforgettable guest experiences and sustainable returns for villa owners.",
    tailored:
      "Our tailored management and marketing solutions are designed to fit every property level. From operations to marketing, we maximise your villa's performance and create sustainable investment value.",
  },
  expertise: {
    eyebrow: "Our expertise",
    title: "Four pillars of care",
    items: [
      { t: "Management", d: "We manage villas across Bali and look after your home end to end, from staff handling to maintenance and everything in between." },
      { t: "Marketing", d: "Our professional team promotes your property across leading OTAs to maximise revenue all year round." },
      { t: "Concierge", d: "A wide, personalised range of services and activities for every guest staying at your property." },
      { t: "Maintenance", d: "Our dedicated technicians are ready to resolve any technical issue your property may encounter." },
    ],
  },
  why: {
    eyebrow: "Why partner with us",
    title: "Why partner with Great Bali Villas?",
    hub: "Your villa",
    items: [
      { t: "Professional management", d: "Seamless villa operations with a dedicated team and exceptional standards across operations, marketing, guest relations and property maintenance." },
      { t: "Higher profits, added value", d: "Strategic management that optimises revenue while growing your property's long-term investment value." },
      { t: "Fair and transparent fees", d: "Honest partnerships with competitive rates, no hidden costs and no unnecessary fees." },
      { t: "Complete transparency", d: "Monitor performance any time. Every booking, expense and report is accessible through your owner dashboard." },
      { t: "Market-driven approach", d: "Data-driven strategies that reach every market segment, maximise occupancy and boost your villa's visibility across platforms." },
      { t: "Creative and dedicated team", d: "A passionate marketing and operations team creating engaging content and impactful promotions that elevate your property's brand." },
    ],
  },
  team: {
    eyebrow: "Our team",
    title: "Our dedicated management team",
    intro:
      "A professional, dedicated team covering every aspect of villa operations and marketing. Each division keeps your property managed efficiently, profitably and in line with industry standards.",
    top: "Great Bali Villas",
    office: "Head office",
    site: "On site at your villa",
    officeDivisions: [
      { name: "Business Development", role: "Strategic growth and partnerships" },
      { name: "Human Resources", role: "Recruitment and staff training" },
      { name: "Sales and Marketing", role: "Boosting bookings and occupancy" },
      { name: "Content Creator", role: "Professional photo and video production" },
      { name: "Reservation", role: "Guest enquiries and booking management" },
      { name: "Accounting and Administration", role: "Daily records and reporting" },
      { name: "Finance and Taxation", role: "Cash flow and compliance" },
      { name: "Legality and Licence", role: "Permits and regulatory compliance" },
    ],
    siteDivisions: [
      { name: "Villa Coordinator", role: "Overseeing daily operations" },
      { name: "Technician", role: "Maintenance and troubleshooting" },
      { name: "Housekeeper", role: "Cleanliness and guest comfort" },
    ],
  },
  solutions: {
    eyebrow: "Our services",
    title: "Comprehensive management solutions",
    items: [
      {
        title: "Villa Management Service",
        lead: "Owning a villa in Bali should be rewarding, not stressful. We handle your property professionally, from day-to-day operations to guest satisfaction, combining proven strategies with data-driven solutions to maximise its performance.",
        label: "Our scope includes",
        items: [
          "Full operational oversight (operation controller, SOPs, job descriptions and property readiness)",
          "Guest hospitality service",
          "Property care and maintenance",
          "Property management software for seamless operations and real-time updates",
          "Revenue and OTA optimisation (Airbnb, Booking.com, Expedia and more)",
          "Review management to build trust and brand value",
          "Accurate bookkeeping, transparent reports and full clarity",
        ],
        closing:
          "One complete solution for your villa. We handle everything it needs, from maintenance and upkeep to smart marketing and guest services, so your property stays in excellent condition while consistently generating optimal revenue.",
      },
      {
        title: "Property Marketing Service",
        tagline: "Smart marketing to unlock your villa's full potential.",
        lead: "Our dedicated sales and marketing team specialises in both online and offline strategies, giving your property maximum visibility and guest engagement.",
        label: "What we deliver",
        items: [
          "Comprehensive quality control to ensure your villa meets hospitality standards",
          "Property management software for seamless operations and real-time updates",
          "Dynamic pricing (yield management) to optimise rates and boost occupancy",
          "Revenue and OTA optimisation (Airbnb, Booking.com, Expedia and more)",
          "Reputation management, including guest review handling",
        ],
        highlight: "Best of all, our marketing package is risk free: you only pay when your villa is successfully rented.",
      },
      {
        title: "Property Care Service",
        lead: "For owners who choose not to rent out their villa, we keep it secure, clean and well maintained, so it is always ready for your personal stay.",
        label: "This service covers",
        items: [
          "Regular housekeeping and operational checks",
          "Managing and recording expenses for full transparency",
          "Distributing supplies and handling property needs",
          "Preventive and ongoing maintenance to preserve quality",
        ],
        closing:
          "Enjoy peace of mind knowing your property is professionally cared for, whether it stays vacant or is used occasionally for personal stays.",
      },
    ],
  },
  cta: {
    title: "Let's grow your villa together",
    sub: "Talk to our team about your property. The first consultation is free.",
    button: "Book a free consultation",
  },
  pricing: {
    eyebrow: "Pricing and value",
    title: "Choose your package",
    from: "From",
    enquire: "Enquire",
    packages: [
      {
        name: "Exclusive Marketing",
        period: "6-month contract",
        fee: "10%",
        feeNote: "of gross revenue, before OTA commission",
        best: "For owners focused on revenue growth while handling operations independently.",
      },
      {
        name: "Full Management",
        period: "1-year contract",
        fee: "20%",
        feeNote: "of gross revenue, before OTA commission",
        best: "Perfect for owners wanting stress-free, end-to-end villa care.",
        featured: true,
      },
      {
        name: "Property Care Service",
        period: "6-month contract",
        feeIdr: 3000000,
        feeNote: "flat monthly fee",
        best: "Ideal for owners seeking seamless care, from upkeep to reporting, keeping the property pristine and always guest-ready.",
      },
    ],
    tableTitle: "Summary of inclusions",
    tableHead: "Inclusions",
    rows: rows([
      "Property care and maintenance",
      "Property set up",
      "Full operational oversight",
      "Guest hospitality service",
      "Human resources management (recruitment, training, review and contracting)",
      "Review monitoring and management",
      "Channel manager set up",
      "Property management software (PMS)",
      "Guest service agent and concierge",
      "Reservation management",
      "OTA management and distribution",
      "Pricing strategy",
      "Digital marketing strategy",
      "Google Business set up",
      "Marketing tools (flyer, descriptions, video content)",
      "Payment distribution",
      "Expenses and financial controller",
      "Financial report (expenses, booking list, profit and loss)",
      "Booking list report",
      "Government tax report (based on NPWPD, if any)",
    ]),
    exclusion:
      "All management services exclude staff salaries, government taxes and other operational expenses, which remain the responsibility of the villa owner.",
    requirements:
      "Basic requirements for rental packages: villa operation licences (IMB/PBG, SLF, NIB, NPWPD and Pondok Wisata if any), excellent photography, complete property staff (housekeeper, pool and gardener), and standard amenities and facilities.",
  },
};

const id: VmContent = {
  about: {
    eyebrow: "Tentang kami",
    title: "Lebih dari satu dekade keahlian vila di Bali",
    p1: "Great Bali Villas Management and Marketing, di bawah PT. Great Bali Hebat, adalah perusahaan manajemen hospitality independen dengan pengalaman lebih dari 10 tahun di industri penyewaan dan pengelolaan properti vila di Bali.",
    portfolioLabel: "Kami mengelola dan memasarkan beragam portofolio",
    portfolio: ["Vila dengan kolam renang pribadi, dari kelas budget hingga estate mewah", "Resor", "Guest house", "Cottage dan glamping"],
    p2: "Dengan fokus kuat pada layanan personal, keunggulan operasional, dan strategi pemasaran yang inovatif, kami berkomitmen memaksimalkan kepuasan tamu sekaligus keuntungan pemilik.",
    commit:
      "Kami berkomitmen menghadirkan pengelolaan properti yang mulus dan meningkatkan nilai unik setiap vila. Dengan memadukan keahlian lokal dan standar hospitality yang tinggi, kami menghadirkan pengalaman menginap yang berkesan bagi tamu serta imbal hasil berkelanjutan bagi pemilik vila.",
    tailored:
      "Solusi manajemen dan pemasaran kami dirancang untuk setiap kelas properti. Dari operasional hingga pemasaran, kami memaksimalkan kinerja vila Anda dan menciptakan nilai investasi yang berkelanjutan.",
  },
  expertise: {
    eyebrow: "Keahlian kami",
    title: "Empat pilar layanan",
    items: [
      { t: "Manajemen", d: "Kami mengelola vila di seluruh Bali dan merawat properti Anda secara menyeluruh, mulai dari pengelolaan staf hingga perawatan dan semua hal di antaranya." },
      { t: "Pemasaran", d: "Tim profesional kami mempromosikan properti Anda di berbagai OTA terkemuka untuk memaksimalkan pendapatan sepanjang tahun." },
      { t: "Concierge", d: "Beragam layanan dan aktivitas yang dipersonalisasi untuk setiap tamu yang menginap di properti Anda." },
      { t: "Perawatan", d: "Tim teknisi kami siap menangani setiap masalah teknis yang mungkin terjadi pada properti Anda." },
    ],
  },
  why: {
    eyebrow: "Mengapa bermitra dengan kami",
    title: "Mengapa bermitra dengan Great Bali Villas?",
    hub: "Vila Anda",
    items: [
      { t: "Manajemen profesional", d: "Operasional vila yang mulus bersama tim khusus dengan standar tinggi di bidang operasional, pemasaran, hubungan tamu, dan perawatan properti." },
      { t: "Keuntungan lebih tinggi, nilai bertambah", d: "Manajemen strategis yang mengoptimalkan pendapatan sekaligus meningkatkan nilai investasi jangka panjang properti Anda." },
      { t: "Biaya adil dan transparan", d: "Kemitraan yang jujur dengan tarif kompetitif, tanpa biaya tersembunyi maupun biaya yang tidak perlu." },
      { t: "Transparansi penuh", d: "Pantau kinerja kapan saja. Setiap pemesanan, pengeluaran, dan laporan dapat diakses melalui dashboard pemilik." },
      { t: "Pendekatan berbasis pasar", d: "Strategi berbasis data untuk menjangkau semua segmen pasar, memaksimalkan tingkat hunian, dan meningkatkan visibilitas vila Anda di berbagai platform." },
      { t: "Tim kreatif dan berdedikasi", d: "Tim pemasaran dan operasional yang bersemangat, menghasilkan konten menarik dan promosi berdampak untuk memperkuat citra properti Anda." },
    ],
  },
  team: {
    eyebrow: "Tim kami",
    title: "Tim manajemen kami",
    intro:
      "Tim profesional dan berdedikasi yang menangani setiap aspek operasional dan pemasaran vila. Setiap divisi memastikan properti Anda dikelola secara efisien, menguntungkan, dan sesuai standar industri.",
    top: "Great Bali Villas",
    office: "Kantor pusat",
    site: "Di lokasi vila Anda",
    officeDivisions: [
      { name: "Pengembangan Bisnis", role: "Pertumbuhan strategis dan kemitraan" },
      { name: "Sumber Daya Manusia", role: "Rekrutmen dan pelatihan staf" },
      { name: "Penjualan dan Pemasaran", role: "Meningkatkan pemesanan dan tingkat hunian" },
      { name: "Kreator Konten", role: "Produksi foto dan video profesional" },
      { name: "Reservasi", role: "Pertanyaan tamu dan pengelolaan pemesanan" },
      { name: "Akuntansi dan Administrasi", role: "Pencatatan harian dan pelaporan" },
      { name: "Keuangan dan Perpajakan", role: "Arus kas dan kepatuhan" },
      { name: "Legalitas dan Perizinan", role: "Perizinan dan kepatuhan regulasi" },
    ],
    siteDivisions: [
      { name: "Koordinator Vila", role: "Mengawasi operasional harian" },
      { name: "Teknisi", role: "Perawatan dan penanganan masalah teknis" },
      { name: "Housekeeping", role: "Kebersihan dan kenyamanan tamu" },
    ],
  },
  solutions: {
    eyebrow: "Layanan kami",
    title: "Solusi manajemen menyeluruh",
    items: [
      {
        title: "Layanan Manajemen Vila",
        lead: "Memiliki vila di Bali seharusnya menguntungkan, bukan merepotkan. Kami mengelola properti Anda secara profesional, mulai dari operasional harian hingga kepuasan tamu, dengan memadukan strategi yang terbukti dan solusi berbasis data untuk memaksimalkan kinerjanya.",
        label: "Cakupan layanan",
        items: [
          "Pengawasan operasional penuh (operation controller, SOP, deskripsi kerja, dan kesiapan properti)",
          "Layanan hospitality untuk tamu",
          "Perawatan dan pemeliharaan properti",
          "Property management software untuk operasional yang lancar dan pembaruan real-time",
          "Optimalisasi pendapatan dan OTA (Airbnb, Booking.com, Expedia, dan lainnya)",
          "Pengelolaan ulasan untuk membangun kepercayaan dan nilai merek",
          "Pembukuan akurat, laporan transparan, dan kejelasan penuh",
        ],
        closing:
          "Satu solusi lengkap untuk vila Anda. Kami menangani semua kebutuhannya, dari perawatan hingga pemasaran cerdas dan layanan tamu, sehingga properti Anda tetap dalam kondisi prima sekaligus menghasilkan pendapatan optimal secara konsisten.",
      },
      {
        title: "Layanan Pemasaran Properti",
        tagline: "Pemasaran cerdas untuk membuka potensi penuh vila Anda.",
        lead: "Tim penjualan dan pemasaran kami ahli dalam strategi online maupun offline, memberikan visibilitas maksimal dan keterlibatan tamu yang tinggi untuk properti Anda.",
        label: "Yang kami berikan",
        items: [
          "Quality control menyeluruh agar vila Anda memenuhi standar hospitality",
          "Property management software untuk operasional yang lancar dan pembaruan real-time",
          "Dynamic pricing (yield management) untuk mengoptimalkan tarif dan meningkatkan tingkat hunian",
          "Optimalisasi pendapatan dan OTA (Airbnb, Booking.com, Expedia, dan lainnya)",
          "Manajemen reputasi, termasuk penanganan ulasan tamu",
        ],
        highlight: "Yang terbaik, paket pemasaran kami bebas risiko: Anda hanya membayar ketika vila Anda berhasil tersewa.",
      },
      {
        title: "Layanan Perawatan Properti",
        lead: "Bagi pemilik yang memilih untuk tidak menyewakan vilanya, kami menjaga properti tetap aman, bersih, dan terawat, sehingga selalu siap untuk Anda tempati.",
        label: "Layanan ini mencakup",
        items: [
          "Housekeeping rutin dan pemeriksaan operasional",
          "Pengelolaan dan pencatatan pengeluaran untuk transparansi penuh",
          "Penyaluran perlengkapan dan penanganan kebutuhan properti",
          "Perawatan preventif dan berkelanjutan untuk menjaga kualitas",
        ],
        closing:
          "Nikmati ketenangan pikiran karena properti Anda dirawat secara profesional, baik saat kosong maupun sesekali Anda tempati.",
      },
    ],
  },
  cta: {
    title: "Mari kembangkan vila Anda bersama",
    sub: "Bicarakan properti Anda dengan tim kami. Konsultasi pertama gratis.",
    button: "Konsultasi gratis",
  },
  pricing: {
    eyebrow: "Harga dan nilai",
    title: "Pilih paket Anda",
    from: "Mulai",
    enquire: "Tanya",
    packages: [
      {
        name: "Exclusive Marketing",
        period: "Kontrak 6 bulan",
        fee: "10%",
        feeNote: "dari pendapatan kotor, sebelum komisi OTA",
        best: "Untuk pemilik yang fokus pada pertumbuhan pendapatan sambil mengelola operasional secara mandiri.",
      },
      {
        name: "Full Management",
        period: "Kontrak 1 tahun",
        fee: "20%",
        feeNote: "dari pendapatan kotor, sebelum komisi OTA",
        best: "Cocok untuk pemilik yang ingin perawatan vila menyeluruh tanpa repot.",
        featured: true,
      },
      {
        name: "Property Care Service",
        period: "Kontrak 6 bulan",
        feeIdr: 3000000,
        feeNote: "biaya bulanan tetap",
        best: "Ideal untuk pemilik yang menginginkan perawatan tanpa repot, dari pemeliharaan hingga pelaporan, agar properti selalu prima dan siap ditempati.",
      },
    ],
    tableTitle: "Ringkasan inklusi",
    tableHead: "Inklusi",
    rows: rows([
      "Perawatan dan pemeliharaan properti",
      "Penyiapan properti",
      "Pengawasan operasional penuh",
      "Layanan hospitality untuk tamu",
      "Manajemen SDM (rekrutmen, pelatihan, evaluasi, dan kontrak)",
      "Pemantauan dan pengelolaan ulasan",
      "Penyiapan channel manager",
      "Property management software (PMS)",
      "Guest service agent dan concierge",
      "Pengelolaan reservasi",
      "Pengelolaan dan distribusi OTA",
      "Strategi harga",
      "Strategi pemasaran digital",
      "Penyiapan Google Business",
      "Materi pemasaran (flyer, deskripsi, konten video)",
      "Distribusi pembayaran",
      "Kontrol pengeluaran dan keuangan",
      "Laporan keuangan (pengeluaran, daftar pemesanan, laba rugi)",
      "Laporan daftar pemesanan",
      "Laporan pajak daerah (berdasarkan NPWPD, bila ada)",
    ]),
    exclusion:
      "Seluruh layanan manajemen tidak termasuk gaji staf, pajak pemerintah, dan biaya operasional lainnya, yang tetap menjadi tanggung jawab pemilik vila.",
    requirements:
      "Persyaratan dasar untuk paket sewa: izin operasional vila (IMB/PBG, SLF, NIB, NPWPD, dan Pondok Wisata bila ada), fotografi yang baik, staf properti lengkap (housekeeper, kolam, dan tukang kebun), serta amenitas dan fasilitas standar.",
  },
};

export const VM_CONTENT = { en, id };
