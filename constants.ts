
import { Reptile, Order, Address, NotificationSettings } from './types';

const MASCOT_IMAGE_URL = "/assets/photo_2026-02-04_07-13-35.jpg";

export const featuredReptiles: Reptile[] = [
  {
    id: 1,
    name: 'آريس',
    species: 'تنين ملتحي',
    description: 'تنين ملتحي (Bearded Dragon) يتمتع بصحة ممتازة وهدوء تام. يعشق تناول الخضروات الورقية والحشرات. مثالي للمربين الذين يبحثون عن رفيق تفاعلي.',
    price: 280,
    imageUrl: MASCOT_IMAGE_URL,
    rating: 5.0,
    isAvailable: true,
    status: 'متوفر',
    category: 'lizard',
    specifications: [
      { label: 'العمر', value: 'سنة واحدة' },
      { label: 'الطول الحالي', value: '35 سم' },
      { label: 'النظام الغذائي', value: 'حشرات وخضروات' },
      { label: 'المزاج', value: 'هادئ جداً' }
    ],
    careInstructions: 'يحتاج إلى حوض بطول 120 سم على الأقل، مع توفير نقطة تسخين تصل حرارتها إلى 40 مئوية وإضاءة UVB 10.0 فعالة.',
    reviews: [
      { user: 'خالد م.', rating: 5, comment: 'وصلني آريس وبصحة ممتازة، شكراً سيمون على الاحترافية.', date: '2024-05-10' },
      { user: 'رنا س.', rating: 5, comment: 'أجمل تنين ملتحي رأيته، تعامل راقي جداً.', date: '2024-05-15' }
    ]
  },
  {
    id: 2,
    name: 'سولار',
    species: 'أفعى الكرة (بيثون)',
    description: 'بيثون ملكي (Ball Python) بنمط لوني مذهل. هادئ جداً وسهل التعامل معه. تم تدريبه على التغذية المنتظمة وفحصه من قبل طبيب بيطري مختص.',
    price: 350,
    imageUrl: MASCOT_IMAGE_URL,
    rating: 4.9,
    isAvailable: true,
    status: 'متوفر',
    category: 'snake',
    specifications: [
      { label: 'النوع', value: 'Morph Pastel' },
      { label: 'الجنس', value: 'ذكر' },
      { label: 'التغذية', value: 'قوارض مجمدة' },
      { label: 'الطول', value: '60 سم' }
    ],
    careInstructions: 'يجب الحفاظ على رطوبة بين 60-70% ودرجة حرارة في الجانب الدافئ حوالي 32 مئوية.',
    reviews: [
      { user: 'سامر ح.', rating: 4, comment: 'الأفعى هادئة جداً وسهلة التعامل، التوصيل كان سريعاً.', date: '2024-04-20' }
    ]
  },
  {
    id: 3,
    name: 'زمرد',
    species: 'إغوانة خضراء',
    description: 'إغوانة خضراء يافعة تتمتع بألوان زاهية ونشاط كبير. تحتاج إلى مساحة واسعة وبيئة رطبة. مناسبة للمربين ذوي الخبرة.',
    price: 150,
    imageUrl: MASCOT_IMAGE_URL,
    rating: 4.7,
    isAvailable: false,
    status: 'قيد الحجز',
    category: 'lizard',
  },
  {
    id: 4,
    name: 'هرقل',
    species: 'سلحفاة السولكاتا',
    description: 'سلحفاة سولكاتا (Sulcata Tortoise) عملاقة في المستقبل. حالياً في مرحلة النمو، نشيطة جداً وتحب الاستكشاف في الحديقة الخارجية.',
    price: 420,
    imageUrl: MASCOT_IMAGE_URL,
    rating: 4.9,
    isAvailable: true,
    status: 'متوفر',
    category: 'turtle',
    specifications: [
      { label: 'العمر', value: '6 أشهر' },
      { label: 'الوزن الحالي', value: '450 جرام' },
      { label: 'الموطن', value: 'أفريقيا' }
    ],
    careInstructions: 'تحتاج لمساحة كبيرة جداً مستقبلاً، تعتمد كلياً على الأعشاب والنباتات البرية.'
  },
  {
    id: 5,
    name: 'توباز',
    species: 'أبو بريص الفهد',
    description: 'ليوبارد جيكو (Leopard Gecko) بألوان صفراء فاقعة. سهل العناية جداً ولا يحتاج لمساحات كبيرة، مما يجعله الخيار الأول للمبتدئين.',
    price: 110,
    imageUrl: MASCOT_IMAGE_URL,
    rating: 4.8,
    isAvailable: true,
    status: 'متوفر',
    category: 'lizard',
  }
];

export const defaultSpecies = [
  'تنين ملتحي', 'أفعى الكرة (بيثون)', 'إغوانة خضراء', 'سلحفاة السولكاتا',
  'أبو بريص الفهد', 'حرباء محجبة', 'ثعبان الذرة', 'سلحفاة حمراء الأذنين',
  'ثعبان الشجر الأخضر', 'سكينك أزرق اللسان', 'أبو بريص المتوج', 'ثعبان الحليب',
  'بيثون مشبك', 'أبو بريص توكاي', 'سلحفاة روسية', 'تنين الماء الصيني',
  'سكينك جيجي', 'بوا قوس قزح', 'السحلية المزركشة', 'سلحفاة الصندوق'
];

export const defaultCategories = [
  { value: 'snake', label: 'ثعابين' },
  { value: 'lizard', label: 'سحالي' },
  { value: 'turtle', label: 'سلاحف' },
  { value: 'amphibian', label: 'برمائيات' },
  { value: 'invertebrate', label: 'لافقاريات' }
];

export const mockOrders: Order[] = [
  {
    id: 'RH-9821',
    date: '2024-05-15',
    status: 'تم التوصيل',
    total: 390,
    items: [
      { reptileId: 2, name: 'سولار - أفعى الكرة', quantity: 1, price: 350, imageUrl: MASCOT_IMAGE_URL },
      { reptileId: 8, name: 'بانزر - سلحفاة مائية', quantity: 1, price: 40, imageUrl: MASCOT_IMAGE_URL },
    ],
    paymentVerificationStatus: 'مقبول',
  },
];

export const mockAddresses: Address[] = [
  {
    id: 1,
    label: 'المنزل',
    street: 'شارع المالكي، بناء النور',
    city: 'دمشق',
    country: 'سوريا',
    isDefault: true,
  }
];

export const mockNotificationSettings: NotificationSettings = {
  orders: true,
  promotions: true,
  system: false,
  messages: true,
};

// هيكل هرمي للأنواع
export interface SpeciesHierarchy {
  mainCategory: string;
  mainCategoryArabic: string;
  categoryValue: 'snake' | 'lizard' | 'turtle';
  subspecies: string[];
}

export const hierarchicalSpecies: SpeciesHierarchy[] = [
  {
    mainCategory: 'Snakes',
    mainCategoryArabic: 'الأفاعي',
    categoryValue: 'snake',
    subspecies: [
      'Ball python',
      'Colubreds',
      'Boa constrictor',
      'Burmese python',
      'أفعى الكرة (بيثون)',
      'ثعبان الذرة',
      'ثعبان الشجر الأخضر',
      'ثعبان الحليب',
      'بيثون مشبك',
      'بوا قوس قزح'
    ]
  },
  {
    mainCategory: 'Lizards',
    mainCategoryArabic: 'سحالي',
    categoryValue: 'lizard',
    subspecies: [
      'Bearded dragon',
      'Iguana',
      'Leopard Geckos',
      'Crested Geckos',
      'تنين ملتحي',
      'إغوانة خضراء',
      'أبو بريص الفهد',
      'حرباء محجبة',
      'سكينك أزرق اللسان',
      'أبو بريص المتوج',
      'أبو بريص توكاي',
      'تنين الماء الصيني',
      'سكينك جيجي',
      'السحلية المزركشة'
    ]
  },
  {
    mainCategory: 'Turtles',
    mainCategoryArabic: 'السلاحف',
    categoryValue: 'turtle',
    subspecies: [
      'سلحفاة السولكاتا',
      'سلحفاة حمراء الأذنين',
      'سلحفاة روسية',
      'سلحفاة الصندوق'
    ]
  }
];
