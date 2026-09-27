import { CategoryItem, HeroSlide, SchoolProgram, NewsArticle, SchoolInfo, SectionTexts, CalendarEvent, InstitutionalArticle, FeedbackEmailSetting, SmtpConfig } from '../types';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Эрдэм сургалтын систем',
    nameEn: 'Primary Education',
    slug: 'primary',
    iconName: 'Database',
    description: 'Сурагчдын бие даан хөгжлийг дэмжих сургалтын систем',
    url: 'https://e.eds.edu.mn',
    target: '_blank',
    badge: '',
    order: 1,
    active: true
  },
  {
    id: 'cat-1787283200505',
    name: 'Дасгалын хөтөч',
    nameEn: 'TypeWriting',
    slug: 'keyboard',
    iconName: 'Laptop',
    description: 'Сурагчийн бие даан компьютертэй ажиллах чадварыг хөгжүүлнэ.',
    url: 'https://eds.edu.mn/fasttype/',
    target: '_blank',
    badge: '',
    order: 2,
    active: true
  },
  {
    id: 'cat-1787283303585',
    name: 'Багшийн туслах',
    nameEn: 'e-school',
    slug: 'teacher-helper',
    iconName: 'Users',
    description: 'ЕБС-ын багшийн /дүн гаргах, эрэмбэлэх, холбоос авах/ гэх мэт ажлуудыг хөнгөвчлөх зорилготой юм.',
    url: 'https://eds.edu.mn/teach/',
    target: '_blank',
    badge: '',
    order: 3,
    active: true
  },
  {
    id: 'cat-1787283540569',
    name: 'EduTech систем',
    nameEn: 'EduTecg',
    slug: 'edutech',
    iconName: 'Atom',
    description: 'Ухаалаг боловсролын систем',
    url: 'https://sites.google.com/view/edutechweb/',
    target: '_blank',
    badge: '',
    order: 4,
    active: true
  }
];

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: '2026-2027 оны хичээлийн жилийн баярын мэнд хүргэе',
    subtitle: 'Эрдмийн их аянд нь сурлагын өндөр амжилт хүсье.',
    imageUrl: '/defaults/z1.jpg',
    buttonText: 'Дэлгэрэнгүй унших',
    buttonLink: '#news',
    badge: 'Баярын мэнд',
    order: 1,
    active: true
  },
  {
    id: 'slide-2',
    title: 'Элсэлтийн шалгалт-2026',
    subtitle: '2026-2027 оны хичээлийн жилийн 1-р ангийн шинэ элсэлт болон ахлах ангийн шилжин суралцах шалгалтын тов зарлагдлаа.',
    imageUrl: '/defaults/z3.jpg',
    buttonText: 'Мэдээлэл авах',
    buttonLink: '#admission',
    badge: 'Шинэ элсэлт',
    order: 2,
    active: true
  }
];

export const INITIAL_PROGRAMS: SchoolProgram[] = [
  {
    id: 'prog-1',
    title: 'Бага боловсролын цогц хөтөлбөр',
    slug: 'primary-education',
    subtitle: '1-5-р анги • Монгол хэл, бичиг • Сэтгэн бодох математик • Англи хэл',
    categorySlug: 'primary',
    categoryName: 'Бага боловсрол',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop'
    ],
    tags: ['1-5-р анги', 'Унших бичих чадвар', 'Англи хэлний суурь', 'Бүтээлч сэтгэлгээ'],
    description: 'Бага ангийн сурагчдын сониуч зан, сурах арга барил, бие даах чадварыг хөгжүүлж, Монгол өв соёл болон орчин үеийн танин мэдэхүйн үндсийг хослуулан олгоно.',
    features: [
      'Өдөр өнжүүлэх болон нэмэлт бататгах давтлага',
      'Үдийн хоол, эрүүл зөв хооллолтын стандарт',
      'Оюуны хөгжил, шатар, уран зураг, хөгжмийн хичээл',
      'Бага насны сэтгэл зүйч багшийн дэмжлэг'
    ],
    curriculum: 'Монгол Улсын үндэсний стандарт + Сингапур математикийн арга зүй + Cambridge Primary English',
    ageRange: '6 - 11 нас',
    schedule: 'Даваа - Баасан 08:30 - 15:30',
    featured: true,
    order: 1,
    createdAt: '2025-01-10'
  },
  {
    id: 'prog-2',
    title: 'Олимпиад, уралдааны гүнзгийрүүлсэн бэлтгэл хөтөлбөр',
    slug: 'olympiad-advanced-training',
    subtitle: 'Математик • Физик • Мэдээлэл зүй • Англи хэлний олон улсын тэмцээнүүд',
    categorySlug: 'olympiad',
    categoryName: 'Олимпиад, уралдаан',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=900&auto=format&fit=crop'
    ],
    tags: ['6-12-р анги', 'Олимпиад', 'Тэмцээн', 'Гүнзгийрүүлсэн сургалт'],
    description: 'Шинжлэх ухаанч сэтгэлгээ, логик дасгалууд, олон улсын болон улсын түвшний олимпиадад өндөр амжилт гаргах арга барилд системтэй сургана.',
    features: [
      'Тэргүүлэх зэргийн олимпиадын дасгалжуулагч багш нар',
      'Шинжлэх ухааны лабораторийн практик дадлага',
      'Бүсийн болон олон улсын тэмцээний санхүүгийн дэмжлэг',
      'Интерактив цахим сорил, бодлогын сан'
    ],
    curriculum: 'Advanced Problem Solving, STEM Olympiad Curriculum, Cambridge Checkpoint',
    ageRange: '11 - 18 нас',
    schedule: 'Даваа - Баасан 08:30 - 16:30',
    featured: true,
    order: 2,
    createdAt: '2025-01-12'
  },
  {
    id: 'prog-3',
    title: 'Мэдээлэл зүй, технологи ба инновацийн хөтөлбөр',
    slug: 'tech-innovation-info',
    subtitle: 'Мэдээлэл зүй • Python кодчилол • Робот техник • 3D бүтээлч төв',
    categorySlug: 'news-info',
    categoryName: 'Мэдээ, мэдээлэл',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=900&auto=format&fit=crop'
    ],
    tags: ['Бүх нас', 'Мэдээлэл зүй', 'Технологи', 'Инноваци'],
    description: 'Орчин үеийн дижитал мэдээлэл, технологийн боловсрол, программ хангамж, вэб хөгжүүлэлтийн практик сургалтын систем.',
    features: [
      'VEX Robotics, FIRST LEGO League тэмцээний багууд',
      'MakerSpace инновацийн 3D хэвлэгчтэй лаб',
      'Хиймэл оюун ухаан, алгоритмын анхан шатны мэдлэг',
      'Мэдээллийн аюулгүй байдал, дижитал ёс зүй'
    ],
    curriculum: 'Python for Youth, Arduino Systems, Web Basics & Digital Skills',
    ageRange: '8 - 18 нас',
    schedule: 'Хуваарийн дагуу сонгон дугуйлан',
    featured: true,
    order: 3,
    createdAt: '2025-01-15'
  },
  {
    id: 'prog-4',
    title: 'Элсэлтийн шалгалт, ЭЕШ ба Их сургуулийн бэлтгэл хөтөлбөр',
    slug: 'admission-prep-highschool',
    subtitle: 'ЭЕШ 800 онооны бэлтгэл • Түвшин тогтоох шалгалт • SAT, IELTS 7.5+',
    categorySlug: 'admission-exam',
    categoryName: 'Элсэлтийн шалгалт',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=900&auto=format&fit=crop'
    ],
    tags: ['10-12-р анги', 'Элсэлтийн шалгалт', 'ЭЕШ бэлтгэл', 'IELTS & SAT'],
    description: 'Элсэлтийн шалгалтууд, их дээд сургуулийн сорилтод амжилттай оролцох, тэтгэлэгт хөтөлбөрүүдийн шалгуурыг бүрэн хангах системтэй бэлтгэл.',
    features: [
      'Элсэлтийн сорилт болон ЭЕШ-ын тогтмол туршилтын шалгалт',
      'IELTS 7.5+ болон SAT 1400+ баталгаат сургалт',
      'Их сургуулийн өргөдөл эсээний мэргэжлийн зөвлөгөө',
      'Ганцаарчилсан ментор багшийн чиглүүлэг'
    ],
    curriculum: 'National Advanced Curriculum + SAT Prep + IELTS Intensive',
    ageRange: '15 - 18 нас',
    schedule: 'Даваа - Баасан 08:30 - 17:00',
    featured: true,
    order: 4,
    createdAt: '2025-01-18'
  },
  {
    id: 'prog-5',
    title: 'Спорт, урлаг соёлын авьяас хөгжүүлэх хөтөлбөр',
    slug: 'sports-arts-culture-program',
    subtitle: 'Сагсан бөмбөг • Волейбол • Уран зураг • Төгөлдөр хуур • Үндэсний урлаг',
    categorySlug: 'sports-arts',
    categoryName: 'Спорт, урлаг соёл',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=900&auto=format&fit=crop'
    ],
    tags: ['Спорт', 'Урлаг', 'Соёл', 'Эрүүл мэнд'],
    description: 'Эрүүл чийрэг бие бялдар, гоо зүйн мэдрэмж, урлаг спортын авьяасыг тэгш хөгжүүлэх олон талт секц, клубүүдийн цогц систем.',
    features: [
      'Стандартын спорт заал, мэргэжлийн дасгалжуулагчид',
      'Төгөлдөр хуур, морин хуур, гитарын ганцаарчилсан сургалт',
      'Сурагчдын тайзны урлаг, драмын наадам',
      'Эрүүл амьдралын хэв маяг, фитнесс дасгал'
    ],
    curriculum: 'Arts & Music Appreciation, Physical Fitness & Mental Wellness',
    ageRange: 'Бүх нас',
    schedule: 'Хичээлийн дараах 15:30 - 18:00',
    featured: true,
    order: 5,
    createdAt: '2025-01-20'
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1787620384010',
    title: 'Элсэлтийн шалгалт-2026 амжиллтай оролцлоо.',
    slug: 'admission-exam-2026-success',
    categorySlug: 'admission-exam',
    categoryName: 'Элсэлтийн шалгалт',
    date: '2026/08/25',
    excerpt: '2026 оны Элсэлтийн шалгалтанд Эрдмийн далайчууд амжилт, бахархлаар дүүрэн өндөрлөлөө.',
    content: `Сурагчид дээд оноогоороо 5 судлагдахуунаар 1- р байранд, 5 судлагдахуунаар 2- р байранд эрэмбэлэгдэв. Нийт 10 сурагч 800 оноо / нийгэм, биологи, матёматик, физик, монгол англихэл/ авсан ба 46 сурагч 700- аас дээш оноо авч хэмжээст оноо 590 дундажтайгаар өмнөх жилийн амжилтаа бататгалаа. Мөн 12а ангийн сурагч Б. Бямбабаяр нь матёматик, физикийн хичээлээр Хос 800, 12г ангийн сурагч М. Азжаргал нь матёматик, англи хэлээр дүйцүүлж Хос 800 авлаа. Хүүхэд бүр зорилготойгоор суралцаж, ЭШ- ээ амжилттай өгсөн нийт төгсөгчид, шавь нараа маш сайн бэлтгэсэн оюунлаг, хичээнгүй багш нараараа, үргэлж дэмжин хамтран ажилладаг эцэг эх, асран хамгаалагчдаараа сургууль хамт олон баярлаж, бахархаж байна. Бүгдэд нь баяр хүргэе.`,
    imageUrl: '/defaults/z1.jpg',
    images: ['/defaults/z1.jpg', '/defaults/z4.jpg'],
    author: 'Сургуулийн захиргаа',
    views: 14,
    featured: true,
    createdAt: '2026-08-25'
  },
  {
    id: 'news-1787620627948',
    title: 'МУ-ын ЗӨВЛӨХ БАГШ Ц. БАЯРХҮҮ ТАНД ХАЛУУН БАЯР ХҮРГЭЕ.',
    slug: 'consultant-teacher-bayarkhuu-congratulations',
    categorySlug: 'news-info',
    categoryName: 'Мэдээ, мэдээлэл',
    date: '2026/08/25',
    excerpt: 'Боловсролын салбарт 34 жил ажиллаж ХӨДӨЛМӨРИЙН ГАВЪЯАНЫ УЛААН ТУГИЙН ОДОНГООР шагнагдсан МУ-ын ЗӨВЛӨХ БАГШ Ц. БАЯРХҮҮ ТАНД ХАЛУУН БАЯР ХҮРГЭ...',
    content: `Боловсролын салбарт 34 жил ажиллаж ХӨДӨЛМӨРИЙН ГАВЪЯАНЫ УЛААН ТУГИЙН ОДОНГООР шагнагдсан МУ-ын ЗӨВЛӨХ БАГШ Ц. БАЯРХҮҮ ТАНД ХАЛУУН БАЯР ХҮРГЭЕ.`,
    imageUrl: '/defaults/z2.jpg',
    images: ['/defaults/z2.jpg', '/defaults/z3.jpg'],
    author: 'Сургуулийн захиргаа',
    views: 5,
    featured: true,
    createdAt: '2026-08-25'
  }
];

export const INITIAL_SCHOOL_INFO: SchoolInfo = {
  name: 'Эрдмийн далай',
  motto: 'Эрдэм мэдлэг • Бүтээлч сэтгэлгээ • Зөв төлөвшил',
  description: 'Хөвсгөл аймгийн Ерөнхий боловсролын сургууль',
  phone: '(976) 7038-2559',
  email: 'ebs.edtss@gmail.com',
  address: 'Хөвсгөл аймаг, Мөрөн сум, 8-р баг',
  city: 'Улаанбаатар хот',
  workingHours: 'Даваа - Баасан: 08:30 - 19:10, Бямба: 09:00 - 15:00',
  logoUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhLs5nJACBuUbLHb1zyCf-MBdWKC8Yr_eHOKLeouJhWOfBZ2DA_ULXBBluxk53nTaQWs8hkFNYsMUSxkrUW6reuHOl6p0cWmVq-COjv-no0SRPscC89KbXxo8p52Gehfqaxm3xU5eDRT-DCOyFglU6GwBrIcPEAD25wzu-GoiqgkAj1NU7Sj9p2IgIOihQ/s320/Picture1.pn',
  defaultNewsImageUrl: '/defaults/z1.jpg',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  youtubeUrl: 'https://youtube.com',
  
  studentsCount: 2500,
  studentsLabel: 'Нийт суралцагч сурагчид',
  studentsDesc: '1-12-р ангийн сурагчид',
  studentsSuffix: '+',

  teachersCount: 100,
  teachersLabel: 'Багшлах бүрэлдэхүүн',
  teachersDesc: 'Бакалавр, Заах аргач, Тэргүүлэх, Зөвлөх зэрэг',
  teachersSuffix: '+',

  collegeAcceptanceRate: 590,
  collegeLabel: 'Элсэлтийн шалгалт',
  collegeDesc: '"Элсэлтийн шалгалт-2026" дундаж',
  collegeSuffix: '+',

  clubsCount: 15,
  clubsLabel: 'Хөгжлийн дугуйлан, клубүүд',
  clubsDesc: 'Урлаг, Спорт, Гадаад хэл, STEM, Илтгэл гэх мэт',
  clubsSuffix: '+'
};

export const DEFAULT_FEEDBACK_EMAIL_SETTINGS: FeedbackEmailSetting[] = [
  {
    tabKey: 'feedback',
    tabTitle: 'Санал хүсэлт',
    teacherName: 'Б. Сарантуяа',
    teacherRole: 'Сургалтын менежер / Багш',
    teacherEmail: 'feedback@erdmiin-dalai.edu.mn',
    description: 'Сургуулийн үйл ажиллагаа, орчин, сургалтын чанартай холбоотой санал хүсэлтүүд'
  },
  {
    tabKey: 'question',
    tabTitle: 'Асуулт лавлагаа',
    teacherName: 'Д. Бат-Оргил',
    teacherRole: 'Мэдээллийн ажилтан / Багш',
    teacherEmail: 'info@erdmiin-dalai.edu.mn',
    description: 'Хичээлийн хуваарь, сургалтын хөтөлбөр, өдөр тутмын үйл ажиллагааны лавлагаа'
  },
  {
    tabKey: 'bullying',
    tabTitle: 'Үе тэнгийн дээрэлхэлт',
    teacherName: 'Ц. Энхмаа',
    teacherRole: 'Нийгмийн ажилтан / Сэтгэл зүйч',
    teacherEmail: 'counselor@erdmiin-dalai.edu.mn',
    description: 'Үе тэнгийн дээрэлхэлт, дарамт шахалт, сэтгэл зүйн тусламж, сурагчийн нууц мэдээлэл хүлээн авах',
    phone: '7058-2244'
  },
  {
    tabKey: 'risk',
    tabTitle: 'Эрсдэлийн үнэлгээ',
    teacherName: 'Т. Болд',
    teacherRole: 'Аюулгүй байдал, эрсдэлийн удирдлагын менежер',
    teacherEmail: 'safety@erdmiin-dalai.edu.mn',
    description: 'Сургуулийн орчны аюулгүй байдал, болзошгүй эрсдэл, зөрчил мэдээлэх, үнэлэх',
    phone: '7058-2233'
  }
];

export const DEFAULT_SMTP_CONFIG: SmtpConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  user: '',
  pass: '',
  fromEmail: '',
  fromName: 'Эрдмийн Далай Цогцолбор Сургууль',
  enabled: false
};

export const INITIAL_INQUIRIES = [
  {
    id: 'inq-risk-1',
    name: 'О. Ганболд (Эцэг эх)',
    studentName: 'Г. Тэмүүлэн (5б анги)',
    parentName: 'О. Ганболд',
    phone: '9988-1122',
    email: 'ganbold.o@gmail.com',
    type: 'risk' as const,
    riskLevel: 'high' as const,
    riskCategory: 'Сургуулийн орчин, гадна талбай',
    location: 'Сургуулийн хойд хаалга, явган хүний гарц орчим',
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=800&auto=format&fit=crop',
    subject: 'Эрсдлийн үнэлгээ (Өндөр) - Хойд гарцын гэрэлтүүлэг, халтиргаа',
    message: 'Сургуулийн хойд гарц дээр үдэш гэрэлтүүлэг ажиллахгүй байгаагаас шалтгаалан сурагчид зам гарах үед машин харахгүй осол гарах өндөр эрсдэлтэй байна. Мөн явган хүний зам халтиргаа ихтэй болсон тул яаралтай давс цацах, гэрэлтүүлгийг засах шаардлагатай.',
    createdAt: '2025-02-20 08:45',
    status: 'new' as const,
    recipientName: 'Т. Болд',
    recipientEmail: 'safety@erdmiin-dalai.edu.mn',
    recipientRole: 'Аюулгүй байдал, эрсдэлийн удирдлагын менежер',
    emailDeliveryStatus: 'delivered' as const
  },
  {
    id: 'inq-1',
    name: 'Батбаяр (Асран хамгаалагч)',
    studentName: 'Болд-Эрдэнэ',
    parentName: 'Батбаяр',
    phone: '9911-2233',
    email: 'batbayar@gmail.com',
    type: 'admission' as const,
    subject: '1-р ангийн элсэлтийн сорилтын тухай',
    message: '2025 оны шинэ элсэлтийн бүртгэл болон туршилтын хичээлийн талаар мэдээлэл авъя.',
    gradeLevel: '1-р анги',
    programInterest: 'Бага боловсрол',
    notes: '2025 оны шинэ элсэлтийн бүртгэл болон туршилтын хичээлийн талаар мэдээлэл авъя.',
    createdAt: '2025-02-19 14:30',
    status: 'new' as const,
    recipientName: 'Г. Мөнхцэцэг',
    recipientEmail: 'admission@erdmiin-dalai.edu.mn',
    recipientRole: 'Элсэлтийн комиссын ахлах багш'
  },
  {
    id: 'inq-2',
    name: 'Цэцэгмаа',
    studentName: 'Ариунзаяа',
    parentName: 'Цэцэгмаа',
    phone: '8800-4455',
    email: 'tsetsegmaa@yahoo.com',
    type: 'feedback' as const,
    subject: 'Сургуулийн автобусны маршрутыг өргөтгөх санал',
    message: 'Хүүхдүүдийн аюулгүй байдлыг хангах үүднээс өглөөний сургуулийн автобусны чиглэлийг Зайсангийн чиглэл рүү нэмж өгөх боломжтой эсэхийг судалж өгнө үү.',
    gradeLevel: '7-р анги',
    programInterest: 'Кембрижийн олон улсын хөтөлбөр',
    notes: 'Шилжин суралцах шалгалтын хуваарийг лавлаж байна.',
    createdAt: '2025-02-18 09:15',
    status: 'contacted' as const,
    recipientName: 'Б. Сарантуяа',
    recipientEmail: 'feedback@erdmiin-dalai.edu.mn',
    recipientRole: 'Сургалтын менежер / Багш'
  }
];

export const INITIAL_SECTION_TEXTS: SectionTexts = {
  topAnnouncement: '2026-2027 оны хичээлийн жилийн баярын мэнд хүргэе.',
  programsTitle: 'Манай Сургуулийн Онцлох Хөтөлбөрүүд',
  programsSubtitle: 'Сурагч бүрийн оюуны чадамж, бүтээлч сэтгэлгээ, бие даах чадварыг нээн хөгжүүлж, олон улсын жишигт хүрэх чанартай боловсролын орчныг бүрдүүлж байна.',
  newsTitle: 'Сургуулийн сүүлийн үеийн мэдээ, мэдээлэл',
  newsSubtitle: 'Сургуулийн үйл ажиллагаа, сурагчдын гаргасан онцлох амжилтууд, элсэлтийн хуваарь болон эцэг эхчүүдэд зориулсан шинэ мэдээллүүдтэй танилцана уу.',
  aboutBadge: '',
  aboutTitle: 'Эрдмийн далай сургуульд тавтай морил',
  aboutDescription: 'Тус сургууль 1962-1963 оны хичээлийн жилд 22 багш, 755 сурагч, 8 ажилчинтайгаар 7 жилийн сургууль болон эрдмийн галаа бадрааж, эрдэм мэдлэгийн их далайд мянга мянган шавь нараа хөтөлсөн түүхийг туурвиж эхэлсэн түүхтэй.',
  aboutMissionQuote: 'Оюунлаг, ёс зүйтэй, дэлхийд өрсөлдөхүйц Монгол иргэнийг төлөвшүүлнэ.',
  aboutMissionSubtitle: 'Манай эрхэм зорилго',
  aboutImageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=900&auto=format&fit=crop',
  aboutStatValue: '',
  aboutStatLabel: '',
  aboutButtonText: 'Хөтөлбөрүүдтэй танилцах',
  aboutValues: [
    {
      id: 'val-1',
      iconName: 'shield',
      title: 'Аюулгүй & Тав тухтай орчин',
      description: '24/7 харуул хамгаалалт, агааржуулалтын систем, стандартын ариун цэвэр, эрүүл хооллолт.'
    },
    {
      id: 'val-2',
      iconName: 'globe',
      title: 'Олон улсын хөтөлбөр',
      description: 'Кембрижийн олон улсын сертификаттай сургалт ба Англи хэлний төрөлх орчин.'
    },
    {
      id: 'val-3',
      iconName: 'stem',
      title: 'STEM & Бүтээлч сэтгэлгээ',
      description: 'Робот техник, кодчилол, байгалийн шинжлэх ухааны лабораторийн бодит туршилтууд.'
    },
    {
      id: 'val-4',
      iconName: 'award',
      title: 'Хувь хүний манлайлал',
      description: 'Өөртөө итгэлтэй, ёс суртахуунтай, багаар ажиллах чадвартай зөв хүмүүн төлөвшил.'
    }
  ],
  footerDescription: 'Бид сурагчдынхаа ирээдүйн амжилтын бат бөх суурийг тавьж, дэлхийн иргэн болгон бэлтгэдэг.',
  admissionModalTitle: '2025-2026 Оны Хичээлийн Жилийн Элсэлтийн Бүртгэл',
  admissionModalSubtitle: 'Та доорх маягтыг үнэн зөв бөглөж илгээнэ үү. Сургуулийн элсэлтийн албанаас 24 цагийн дотор холбогдох болно.'
};

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'cal-1',
    title: '2026-2027 Хичээлийн шинэ жилийн нээлт & Эрдмийн баяр',
    month: '2026-09',
    monthName: '9-р сар',
    day: '01',
    dateRange: '2026.09.01',
    category: 'event',
    categoryName: 'Сургуулийн баяр',
    targetGroup: 'Бүх сурагчид, эцэг эхчүүд',
    description: 'Хичээлийн шинэ жилийн нээлтийн ёслолын ажиллагаа, 1-р ангийн шинэ сурагчдыг угтан авах арга хэмжээ.',
    location: 'Сургуулийн төв талбай & Театр танхим',
    isImportant: true
  },
  {
    id: 'cal-2',
    title: 'Сурагчдын суурь түвшин тогтоох оношлогоо & Сорил',
    month: '2026-09',
    monthName: '9-р сар',
    day: '10-15',
    dateRange: '2026.09.10 - 09.15',
    category: 'exam',
    categoryName: 'Оношлогооны сорил',
    targetGroup: '2-12-р анги',
    description: 'Математик, байгалийн ухаан, монгол хэл, англи хэлний суурь мэдлэг тодорхойлох түвшин тогтоох шалгалт.',
    location: 'Хичээлийн байр, танхимууд',
    isImportant: true
  },
  {
    id: 'cal-3',
    title: 'Сонгон дугуйлан, секц, клубийн нээлттэй өдөрлөг & Бүртгэл',
    month: '2026-09',
    monthName: '9-р сар',
    day: '22-26',
    dateRange: '2026.09.22 - 09.26',
    category: 'admission',
    categoryName: 'Дугуйлангийн бүртгэл',
    targetGroup: '1-12-р анги',
    description: 'Робот техник, шатар, уран зураг, сагсан бөмбөг, мэтгэлцээний клубуудын танилцуулга ба гишүүдийн бүртгэл.',
    location: 'Спортын их заал & Соёлын төв',
    isImportant: false
  },
  {
    id: 'cal-4',
    title: 'Дэлхийн Багш нарын баярын өдөр & Хүндэтгэлийн арга хэмжээ',
    month: '2026-10',
    monthName: '10-р сар',
    day: '05',
    dateRange: '2026.10.05',
    category: 'event',
    categoryName: 'Сургуулийн арга хэмжээ',
    targetGroup: 'Багш нар, сурагчид',
    description: 'Багш нарын эрдэм шинжилгээний хурал, хүндэтгэлийн тоглолт болон шилдэг багш нарыг алдаршуулах ёслол.',
    location: 'Актовый заал',
    isImportant: true
  },
  {
    id: 'cal-5',
    title: 'Кембрижийн явцын үнэлгээ & Хичээлийн 1-р улирлын сорил',
    month: '2026-10',
    monthName: '10-р сар',
    day: '15-20',
    dateRange: '2026.10.15 - 10.20',
    category: 'exam',
    categoryName: 'Улирлын шалгалт',
    targetGroup: '6-12-р анги',
    description: 'Олон улсын Кембрижийн стандартын явцын сорил шалгалт, хөтөлбөрийн ахицын үнэлгээ.',
    location: 'Шалгалтын тусгай танхимууд',
    isImportant: true
  },
  {
    id: 'cal-6',
    title: 'Эцэг эхийн нэгдсэн зөвлөгөөн & Сургалтын явцын тайлан',
    month: '2026-10',
    monthName: '10-р сар',
    day: '28',
    dateRange: '2026.10.28',
    category: 'meeting',
    categoryName: 'Эцэг эхийн хурал',
    targetGroup: 'Эцэг эхчүүд, асран хамгаалагчид',
    description: '1-р улирлын сургалтын үр дүн, сурагчдын ирц, сурлагын ахицын талаар ганцаарчилсан болон нэгдсэн уулзалтууд.',
    location: 'Анги танхимууд',
    isImportant: false
  },
  {
    id: 'cal-7',
    title: 'Шинжлэх ухаан, STEM & Робототехникийн өдөрлөг',
    month: '2026-11',
    monthName: '11-р сар',
    day: '12-14',
    dateRange: '2026.11.12 - 11.14',
    category: 'event',
    categoryName: 'STEM өдөрлөг',
    targetGroup: 'Бүх сурагчид',
    description: 'Сурагчдын бүтээсэн робот, кодчилсон төслүүд, шинжлэх ухааны интерактив туршилтуудын үзэсгэлэн.',
    location: 'STEM лаборатори & Заал',
    isImportant: true
  },
  {
    id: 'cal-8',
    title: 'Монгол бахархлын өдөр - Бүх нийтийн амралт',
    month: '2026-11',
    monthName: '11-р сар',
    day: '24',
    dateRange: '2026.11.24',
    category: 'holiday',
    categoryName: 'Бүх нийтийн амралт',
    targetGroup: 'Сургууль даяар',
    description: 'Эзэн Богд Чингис хааны мэндэлсэн өдөр, Монгол бахархлын өдрийн бүх нийтийн амралт.',
    location: 'Сургууль даяар',
    isImportant: false
  },
  {
    id: 'cal-9',
    title: '1-р улирлын нэгдсэн шалгалт & Шинэ жилийн баярын арга хэмжээ',
    month: '2026-12',
    monthName: '12-р сар',
    day: '18-25',
    dateRange: '2026.12.18 - 12.25',
    category: 'exam',
    categoryName: 'Улирлын шалгалт',
    targetGroup: '1-12-р анги',
    description: 'Хичээлийн жилийн 1-р хагас жилийн төгсгөлийн нэгдсэн үнэлгээ, шинэ жилийн баяр.',
    location: 'Сургуулийн төв байр',
    isImportant: true
  },
  {
    id: 'cal-10',
    title: 'Сурагчдын өвлийн улирлын амралт',
    month: '2026-12',
    monthName: '12-р сар',
    day: '28-31',
    dateRange: '2026.12.28 - 2027.01.25',
    category: 'holiday',
    categoryName: 'Өвлийн амралт',
    targetGroup: 'Бүх анги',
    description: 'Сурагчдын өвлийн улирлын амралт эхэлнэ.',
    location: 'Сургууль даяар',
    isImportant: true
  }
];

export const INITIAL_INSTITUTIONAL_ARTICLES: InstitutionalArticle[] = [
  // 1. Бидний тухай - Захирлын мэндчилгээ
  {
    id: 'art-greeting',
    slug: 'greeting',
    category: 'about',
    title: 'Захирлын мэндчилгээ',
    subtitle: 'Эрдмийн Далай сургуулийн захирлын мэндчилгээ ба боловсролын алсын хараа',
    iconName: 'Award',
    coverImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop',
    articleUrl: 'https://eds.edu.mn/#article/greeting',
    target: '_blank',
    badge: 'Мэндчилгээ',
    order: 1,
    author: 'Гүйцэтгэх Захирал, Доктор Б. Бат-Эрдэнэ',
    updatedAt: '2025.01.10',
    highlights: [
      'Дэлхийн түвшний хос хэлний боловсролын стандарт',
      'Сурагч бүрийн авьяас, бие даах чадварыг нээн хөгжүүлэх',
      'Ёс зүй, үндэсний өв уламжлал, технологийн төгс хослол'
    ],
    content: `Эрхэм хүндэт эцэг эхчүүд, сурган хүмүүжүүлэгч багш нар, эрмэлзэл дүүрэн эрхэм сурагчид аа!

Та бүхэнд "Эрдмийн далай" сургуулийн хамт олны өмнөөс халуун дотно мэндчилгээ дэвшүүлье. 

Хурдацтай хувьсан өөрчлөгдөж буй XXI зуунд хүүхэд багачуудад зөвхөн бэлэн мэдлэг олгох нь хангалтгүй бөгөөд асуудлыг шийдвэрлэх бүтээлч сэтгэлгээ, шүүмжлэлт хандлага, багаар ажиллах болон технологийн өндөр ур чадварыг суулгах нь бидний нэн тэргүүний зорилт юм.

Манай сургууль нь Үндэсний цөм хөтөлбөр болон Кембрижийн олон улсын стандартыг хослуулан, чанартай боловсрол, аюулгүй, тав тухтай орчныг бүрдүүлэн ажиллаж байна. Бидний хамгийн том бахархал бол сурагч нэг бүрийн өөртөө итгэх итгэл, хүсэл тэмүүлэл, амжилт юм.

Эрдмийн оргил өөд хамтдаа тэмүүлж, эх орон болон дэлхийн тавцанд үнэлэгдэх оюунлаг, хариуцлагатай иргэдийг хамтдаа бэлтгэцгээе.`
  },

  // 2. Бидний тухай - Манай хамт олон
  {
    id: 'art-team',
    slug: 'team',
    category: 'about',
    title: 'Манай хамт олон',
    subtitle: 'Мэргэшсэн, туршлагатай, олон улсын зэрэгтэй багш, сурган хүмүүжүүлэгчдийн баг',
    iconName: 'Users',
    coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
    articleUrl: 'https://eds.edu.mn/#article/team',
    target: '_blank',
    badge: 'Хамт олон',
    order: 2,
    author: 'Сургалтын алба',
    updatedAt: '2025.02.01',
    highlights: [
      '85+ мэргэшсэн үндсэн болон олон улсын зөвлөх багш нар',
      'Багш нарын 40% нь магистр, докторын зэрэгтэй',
      'Төрөлх англи хэлтэй гадаад мэргэжилтэн багш нарын баг',
      'Байнгын мэргэжил дээшлүүлэх Кембрижийн сургалтын систем'
    ],
    content: `Манай сургуулийн амжилтын гол тулгуур нь хүүхэд бүрийн төлөө сэтгэл зүрхээ зориулан ажилладаг мэргэжлийн өндөр ур чадвартай багш, ажилтнуудын баг хамт олон юм.

Манай багш нар:
- 100% мэргэжлийн бакалавр болон түүнээс дээш зэрэгтэй
- Олон улсын Кембрижийн багшлах эрхийн сертификаттай
- Улс, хотын тэргүүний болон заах аргач, тэргүүлэх зэрэгтэй шилдэг багш нар
- Сургалтын шинэлэг дижитал арга зүй, интерактив технологиудыг өдөр тутмын хичээлдээ тогтмол нэвтрүүлдэг.

Бид багш ажилтнуудынхаа тасралтгүй хөгжлийг дэмжин, Сингапур, Их Британи болон АНУ-ын боловсролын байгууллагуудтай туршлага солилцох хөтөлбөрүүдийг жил бүр тогтмол хэрэгжүүлдэг билээ.`
  },

  // 3. Бидний тухай - Түүхэн замнал
  {
    id: 'art-history',
    slug: 'history',
    category: 'about',
    title: 'Түүхэн замнал',
    subtitle: 'Сургууль үүсгэн байгуулагдсан цагаас өнөөг хүртэлх амжилт, хөгжлийн томоохон үе шатууд',
    iconName: 'Building2',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
    articleUrl: 'https://eds.edu.mn/#article/history',
    target: '_blank',
    badge: 'Түүх',
    order: 3,
    author: 'Сургуулийн архивын алба',
    updatedAt: '2025.01.15',
    highlights: [
      '2012 он: Сургууль үүсгэн байгуулагдаж, анхны 120 сурагчтайгаа хичээлээ эхлэв',
      '2016 он: Кембрижийн олон улсын эрх бүхий сургуулиар батламжлагдав',
      '2020 он: STEM ба Робот техникийн орчин үеийн төвийг нээв',
      '2024 он: Ухаалаг эко кампус болон шинэ лабораторийн цогцолбор ашиглалтад оров'
    ],
    content: `"Эрдмийн Далай" сургууль нь 2012 онд орчин үеийн стандартыг хангасан чанартай боловсролын байгууллага байгуулах эрхэм зорилготойгоор анх шаваа тавьж байв.

Түүхийн товчоон:
• 2012 он: Анхны хичээлийн жил эхэлж, бага боловсролын хөтөлбөрийг амжилттай хэрэгжүүлж эхлэв.
• 2015 он: Спортын битүү ордон болон усан бассейны цогцолбор ашиглалтад оров.
• 2016 он: Cambridge Assessment International Education албан ёсны гишүүнээр элсэв.
• 2018 он: Манай сурагчид Олон улсын математикийн олимпиадаас анхны алтан медалийг эх орондоо авчирлаа.
• 2021 он: Цахим сургалтын LMS систем болон сургуулийн нэгдсэн платформыг бүрэн нэвтрүүлэв.
• 2024-2025 он: 1,200 гаруй сурагч, 100 гаруй багш ажилтантай тэргүүлэх зэрэглэлийн цогцолбор сургууль болон өргөжлөө.`
  },

  // 4. Бидний тухай - Бидний амжилт
  {
    id: 'art-achievements',
    slug: 'achievements',
    category: 'about',
    title: 'Бидний амжилт',
    subtitle: 'Улс, олон улсын олимпиад, эрдэм шинжилгээ, спорт болон урлагийн бахархалт амжилтууд',
    iconName: 'Trophy',
    coverImage: 'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?q=80&w=1200&auto=format&fit=crop',
    articleUrl: 'https://eds.edu.mn/#article/achievements',
    target: '_blank',
    badge: 'Амжилт',
    order: 4,
    author: 'Олимпиад, хөгжлийн төв',
    updatedAt: '2025.02.10',
    highlights: [
      'Олон улсын математик, роботын тэмцээнээс 35+ алт, мөнгө, хүрэл медаль',
      'Төгсөгчдийн 98% нь дотоод, гадаадын нэр хүндтэй их дээд сургуульд тэтгэлэгтэй элссэн',
      'Улсын ЭЕШ-ын дундаж оноогоор нийслэлийн шилдэг 5 сургуулийн нэг',
      'Нийслэлийн "Эко сургууль" ногоон тугийн эзэн'
    ],
    content: `Манай сурагчид, багш нарын хамтын хичээл зүтгэлийн үр дүнд улс болон дэлхийн тавцанд жил бүр бахдам амжилтуудыг гаргасаар байна.

Онцлох ололт амжилтуудаас:
1. Олон улсын IMO, IJSO, AMC тэмцээнүүдэд жил бүр шилдэг амжилт үзүүлдэг.
2. Робот техникийн World Robot Olympiad (WRO) тэмцээнд Монгол улсаа төлөөлөн амжилттай оролцов.
3. Манай төгсөгчид Harvard, MIT, Oxford, Seoul National University, Tokyo University зэрэг дэлхийн топ их сургуулиудад амжилттай суралцаж байна.
4. Сургуулийн сагсан бөмбөг, шатрын шигшээ багууд нийслэлийн лигийн аваргын цомыг 4 жил дараалан хүртлээ.`
  },

  // 5. Бидний тухай - Лого, бэлэгдэл
  {
    id: 'art-symbolism',
    slug: 'symbolism',
    category: 'about',
    title: 'Лого, бэлэгдэл',
    subtitle: 'Сургуулийн сүлд, өнгө, бэлэгдэл, уриа дуудлага ба гүн гүнзгий утга учир',
    iconName: 'Palette',
    coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
    articleUrl: 'https://eds.edu.mn/#article/symbolism',
    target: '_blank',
    badge: 'Бэлэгдэл',
    order: 5,
    author: 'Брэнд харилцааны алба',
    updatedAt: '2025.01.05',
    highlights: [
      'Сүлд тэмдэг: Дэлгэсэн ном, бадамлан асах эрдмийн дөл ба далай тэнгисийн давалгаа',
      'Үндсэн өнгө: Оюуны гүн хөх (Navy) ба Гэгээн алтан шаргал (Amber Gold)',
      'Сургуулийн уриа: "Эрдэм төгс — Ирээдүй гэрэлт"',
      'Сургуулийн сүлд дуу: "Эрдмийн Далайн Эгшиглэн"'
    ],
    content: `"Эрдмийн Далай" сургуулийн бэлэгдэл тэмдэг нь мэдлэг оюуны хязгааргүй далай, тууштай бүтээлч тэмүүлэл, ёс зүйтэй зөв хүнийг төлөөлдөг.

Бэлэгдлийн утга учир:
- Дэлгэсэн ном: Мэдлэг, боловсрол, соён гэгээрлийн эх ундарга.
- Алтан шаргал дөл: Сурагч бүрийн дотор орших авьяас, оюуны гэрэл гэгээ.
- Хөх далайн долгион: Цаглашгүй их эрдмийн далай ба олон улсын их урсгал.
- Алтан шар өнгө нь өөдрөг үзэл, амжилт, баяр баясгаланг илэрхийлдэг бол Гүн цэнхэр өнгө нь үнэнч шударга, найдвартай байдал, гүн гүнзгий мэдлэгийг илтгэнэ.`
  },

  // 6. Сургалт - Сургалтын хөтөлбөр
  {
    id: 'art-curriculum',
    slug: 'curriculum',
    category: 'education',
    title: 'Сургалтын хөтөлбөр',
    subtitle: 'Үндэсний цөм хөтөлбөр ба Кембрижийн олон улсын хос хөтөлбөрийн бүтэц',
    iconName: 'BookOpen',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop',
    articleUrl: 'https://eds.edu.mn/#article/curriculum',
    target: '_blank',
    badge: 'Хөтөлбөр',
    order: 6,
    author: 'Сургалтын бодлогын газар',
    updatedAt: '2025.02.05',
    highlights: [
      'Бага сургууль (1-5-р анги): Cambridge Primary & Суурь чадвар',
      'Дунд сургууль (6-9-р анги): Cambridge Lower Secondary & STEM',
      'Ахлах сургууль (10-12-р анги): IGCSE, AS/A Level & ЭЕШ бэлтгэл',
      'Англи хэлний түвшин ахиулах IELTS/TOEFL академик сургалт'
    ],
    content: `Манай сургалтын хөтөлбөр нь суралцагчдад зөвхөн онолын мэдлэг олгохоос гадна бие даан судалгаа хийх, задлан шинжлэх, бүтээлчээр хэрэгжүүлэх чадварыг олгодог цогц бүтэцтэй.

Хөтөлбөрийн шатлалууд:
1. Бага боловсрол: Монгол хэл, уран зохиол, математик, Англи хэл, шинжлэх ухааны анхан шатны мэдлэгийг тоглоомын болон туршилтын аргаар олгоно.
2. Дунд боловсрол: Кембрижийн хөтөлбөрөөр байгалийн ухаан, мэдээллийн технологи, гадаад хэлийг гүнзгийрүүлэн судалж, логик сэтгэлгээг төлөвшүүлнэ.
3. Ахлах боловсрол: Мэргэжил сонголтын дагуу байгаль, нийгэм, инженерийн чиглэлээр төрөлжин, олон улсын IGCSE болон их дээд сургуулийн элсэлтийн шалгалтуудад өндөр оноотой бэлтгэнэ.`
  },

  // 7. Сургалт - Сургалтын орчин
  {
    id: 'art-environment',
    slug: 'environment',
    category: 'education',
    title: 'Сургалтын орчин',
    subtitle: 'Орчин үеийн ухаалаг анги танхим, STEM лаборатори, спорт цогцолбор',
    iconName: 'School',
    coverImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop',
    articleUrl: 'https://eds.edu.mn/#article/environment',
    target: '_blank',
    badge: 'Орчин',
    order: 7,
    author: 'Кампус удирдлагын алба',
    updatedAt: '2025.01.20',
    highlights: [
      'SmartBoard ухаалаг дэлгэц, эргономик сурагчийн ширээ сандал',
      'Физик, Хими, Биологийн бүрэн тоноглогдсон туршилтын лаб',
      '25 метрийн стандартын усан бассейн, битүү спортын ордон',
      '50,000+ номын фондтой цахим болон уламжлалт номын сан'
    ],
    content: `Хүүхэд сурч боловсроход тав тухтай, аюулгүй, эрүүл орчин нэн чухал. "Эрдмийн Далай" сургуулийн кампус нь олон улсын боловсролын барилга байгууламжийн стандартыг бүрэн хангасан.

Кампусын давуу талууд:
- HEPA шүүлтүүртэй агааржуулалтын систем бүхий анги танхимууд
- Сурагчдын эрүүл зөв хооллолтыг хангасан 400 хүний багтаамжтай ресторан
- 3D принтер, лазер зүсэгч, микроконтроллер бүхий STEM Инноваци төв
- Тайзны гэрэл, дуугаралт бүхий 350 хүний Актовый театр заал
- 24/7 цагийн хяналтын камер болон мэргэжлийн харуул хамгаалалтын систем.`
  },

  // 8. Сургалт - Дүрэм журам
  {
    id: 'art-rules',
    slug: 'rules',
    category: 'education',
    title: 'Дүрэм журам',
    subtitle: 'Сургуулийн дотоод журам, суралцагчийн ёс зүйн хэм хэмжээ, аюулгүй байдлын дүрэм',
    iconName: 'FileText',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop',
    articleUrl: 'https://eds.edu.mn/#article/rules',
    target: '_blank',
    badge: 'Журам',
    order: 8,
    author: 'Ёс зүйн зөвлөл',
    updatedAt: '2025.01.08',
    highlights: [
      'Сурагчийн ёс зүй ба сургуулийн нэгдсэн дүрэмт хувцасны журам',
      'Ухаалаг утас, дижитал төхөөрөмжийн зохистой хэрэглээний дүрэм',
      'Ирц, чөлөө олголт ба үнэлгээний журам',
      'Үе тэнгийн дээрэлхэлтийн эсрэг "Safe School" бодлого'
    ],
    content: `Сургуулийн дүрэм журам нь сурагч бүрийн эрхийг хамгаалах, сурч боловсрох таатай нөхцөлийг бүрдүүлэх, хариуцлагатай иргэн болгон төлөвшүүлэхэд чиглэгддэг.

Үндсэн дүрэм журмууд:
1. Цаг баримтлал ба Ирц: Хичээл өглөө 08:00 цагт эхлэх ба хоцролтгүй, идэвхтэй оролцоно.
2. Дүрэмт хувцас: Сургуулийн батлагдсан стандартын цэвэр үзэмжтэй формыг өмсөж хэвшинэ.
3. Ухаалаг төхөөрөмж: Хичээлийн цагаар гар утсыг зориулалтын хайрцагт байрлуулж, хичээлд анхаарлаа бүрэн хандуулна.
4. Хүндэтгэл ба Хамтын ажиллагаа: Багш, найз нөхөд, ажилтнуудтай хүндэтгэлтэй, найрсаг харилцаж, бие биедээ тусална.`
  },

  // 9. Сургалт - Секц, дугуйлан
  {
    id: 'art-clubs',
    slug: 'clubs',
    category: 'education',
    title: 'Секц, дугуйлан',
    subtitle: 'Сурагчдын авьяас, бие бялдар, сонирхлыг хөгжүүлэх 30 гаруй төрлийн хөгжүүлэх дугуйлан',
    iconName: 'Sparkles',
    coverImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop',
    articleUrl: 'https://eds.edu.mn/#article/clubs',
    target: '_blank',
    badge: 'Дугуйлан',
    order: 9,
    author: 'Сурагчдын хөгжлийн алба',
    updatedAt: '2025.02.12',
    highlights: [
      'Спорт секцүүд: Сагсан бөмбөг, Усан сэлэлт, Волейбол, Шатар, Таеквондо',
      'Технологи, Шинжлэх ухаан: Робот техник, Python/Web кодчилол, 3D Моделчлол',
      'Урлаг, Соёл: Төгөлдөр хуур, Морин хуур, Уран зураг, Драм театр, Бүжиг',
      'Манлайлал, Нийгэм: Model United Nations (MUN), Илтгэх урлаг, Эко клуб'
    ],
    content: `Хичээлээс гадуурх үйл ажиллагаа нь сурагчдын сонирхол, бүтээлч авьяасыг нээн хөгжүүлэх, найз нөхдийн хүрээгээ тэлэх онцгой боломжийг олгодог.

Секц дугуйлангийн зохион байгуулалт:
- Долоо хоногт 2-3 удаа хичээлийн дараах цагаар мэргэжлийн дасгалжуулагч, багш нар удирдан явуулна.
- Бүх сурагч жилд дор хаяж 1 спорт болон 1 урлаг/оюуны дугуйланд хамрагдахыг зөвлөдөг.
- Дугуйлангийн сурагчид улирал тутам бүтээлийн үзэсгэлэн, тайлан тоглолт, нөхөрсөг тэмцээнүүдийг зохион байгуулж, өөрийн амжилтаа бататгадаг.`
  }
];

