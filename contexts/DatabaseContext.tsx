
import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo, useCallback } from 'react';
import CryptoJS from 'crypto-js';
import { Reptile, Order, Address, User, Article, HeroSlide, Supply, FilterGroup, CompanyInfo, ContactInfo, ShamCashConfig, TeamMember, CustomCategory, CustomSpecies, Service, PromotionalCard, PolicyDocument } from '../types';
import { api } from '../services/api';

interface DatabaseContextType {
  products: Reptile[];
  orders: Order[];
  addresses: Address[];
  users: User[];
  articles: Article[];
  heroSlides: HeroSlide[];
  supplies: Supply[];
  filters: FilterGroup[];
  companyInfo: CompanyInfo | null;
  contactInfo: ContactInfo | null;
  shamCashConfig: ShamCashConfig | null;
  teamMembers: TeamMember[];
  customCategories: CustomCategory[];
  customSpecies: CustomSpecies[];
  services: Service[];
  promotions: PromotionalCard[];
  policies: PolicyDocument[];
  isLoading: boolean;
  addProduct: (product: Reptile) => Promise<void>;
  deleteProduct: (id: number) => void;
  toggleProductVisibility: (id: number) => void;
  addAddress: (address: Address) => void;
  removeAddress: (id: number) => void;
  createOrder: (order: Order) => Promise<Order>;
  updateOrder: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: Order['paymentVerificationStatus'], rejectionReason?: string) => void;
  addArticle: (article: Article) => Promise<void>;
  deleteArticle: (id: number) => void;
  toggleArticleVisibility: (id: number) => void;
  saveHeroSlide: (slide: HeroSlide) => Promise<void>;
  deleteHeroSlide: (id: string) => void;
  toggleHeroSlideVisibility: (id: string) => void;
  updateUser: (user: User) => void;
  createUser: (user: Partial<User> & { password: string }) => Promise<void>;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  addSupply: (supply: Supply) => Promise<void>;
  deleteSupply: (id: number) => void;
  toggleSupplyVisibility: (id: number) => void;
  addFilterGroup: (group: FilterGroup) => void;
  deleteFilterGroup: (id: number | string) => void;
  toggleFilterVisibility: (id: number | string) => void;
  updateCompanyInfo: (info: CompanyInfo) => Promise<void>;
  updateContactInfo: (info: ContactInfo) => void;
  updateShamCashConfig: (config: ShamCashConfig) => Promise<void>;
  addCustomCategory: (category: { value: string; label: string }) => void;
  addCustomSpecies: (species: string) => void;
  deleteCustomCategory: (id: number) => void;
  deleteCustomSpecies: (id: number) => void;
  addService: (service: Service) => void;
  deleteService: (id: number) => void;
  toggleServiceVisibility: (id: number) => void;
  addTeamMember: (member: TeamMember, imageFile?: File) => Promise<void>;
  deleteTeamMember: (id: number) => void;
  toggleTeamMemberVisibility: (id: number) => void;
  addPromotion: (promo: PromotionalCard) => Promise<void>;
  deletePromotion: (id: string | number) => void;
  togglePromotionVisibility: (id: string | number) => void;
  addPolicy: (policy: PolicyDocument) => void;
  deletePolicy: (id: string | number) => void;
  togglePolicyVisibility: (id: string | number) => void;
  loadUserData: (options?: { includeOrders?: boolean }) => Promise<void>;
  loadAdminData: () => Promise<void>;
  loadArticles: () => Promise<void>;
  loadTeamMembers: () => Promise<void>;
  refreshData: () => void;
  resolveMediaUrl: (value?: string) => string;
}

export const getApiOrigin = (): string => {
  const apiUrl = (import.meta as any).env?.VITE_API_URL as string | undefined;
  if (!apiUrl) return '';
  try {
    return new URL(apiUrl).origin;
  } catch {
    return '';
  }
};

export const resolveMediaUrl = (value?: string): string => {
  if (!value) return '';
  const apiOrigin = getApiOrigin();

  if (value.startsWith('/storage/')) {
    return apiOrigin ? `${apiOrigin}${value}` : value;
  }

  try {
    const parsed = new URL(value);
    const isLocalStoragePath = parsed.pathname.startsWith('/storage/');
    const hasNoPort = !parsed.port;
    const isLocalHost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';

    if (apiOrigin && isLocalStoragePath && isLocalHost && hasNoPort) {
      return `${apiOrigin}${parsed.pathname}`;
    }

    return parsed.toString();
  } catch {
    return value;
  }
};

const AUTH_SECRET_KEY = 'your-secret-key-change-in-production';

const decryptAuthUser = (encryptedData: string): any | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, AUTH_SECRET_KEY);
    const raw = bytes.toString(CryptoJS.enc.Utf8);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const getCachedAuthUser = (): any | null => {
  const secure = globalThis.localStorage.getItem('auth_user_secure');
  if (secure) {
    const decoded = decryptAuthUser(secure);
    if (decoded) return decoded;
  }

  const plain = globalThis.localStorage.getItem('auth_user');
  if (plain) {
    try {
      return JSON.parse(plain);
    } catch {
      return null;
    }
  }

  return null;
};

const normalizeProductStatus = (status: any): Reptile['status'] => {
  const raw = String(status ?? '').toLowerCase();
  if (!status) return 'متوفر';
  if (['متوفر'].includes(status)) return status;
  if (['قيد الحجز'].includes(status)) return status;
  if (['غير متوفر'].includes(status)) return status;
  if (['available', 'active', 'in stock'].includes(raw)) return 'متوفر';
  if (['reserved', 'hold', 'on hold'].includes(raw)) return 'قيد الحجز';
  if (['unavailable', 'inactive', 'out of stock'].includes(raw)) return 'غير متوفر';
  return status as Reptile['status'];
};

const normalizeSupplyStatus = (status: any): Supply['status'] => {
  const raw = String(status ?? '').toLowerCase();
  if (!status) return 'متوفر';
  if (['متوفر', 'غير متوفر'].includes(status)) return status;
  if (['available', 'active', 'in stock'].includes(raw)) return 'متوفر';
  if (['unavailable', 'inactive', 'out of stock'].includes(raw)) return 'غير متوفر';
  return status as Supply['status'];
};

const normalizeOrderStatus = (status: any): Order['status'] => {
  const raw = String(status ?? '').toLowerCase();
  if (['قيد المعالجة', 'تم التأكيد', 'تم الشحن', 'تم التوصيل'].includes(status)) {
    return status as Order['status'];
  }
  if (['pending', 'processing'].includes(raw)) return 'قيد المعالجة';
  if (['confirmed'].includes(raw)) return 'تم التأكيد';
  if (['shipped', 'shipping'].includes(raw)) return 'تم الشحن';
  if (['delivered', 'completed'].includes(raw)) return 'تم التوصيل';
  return 'قيد المعالجة';
};

const normalizePaymentStatus = (status: any): Order['paymentVerificationStatus'] => {
  const raw = String(status ?? '').toLowerCase();
  if (['قيد المراجعة', 'مقبول', 'مرفوض'].includes(status)) {
    return status as Order['paymentVerificationStatus'];
  }
  if (['pending'].includes(raw)) return 'قيد المراجعة';
  if (['approved', 'accepted'].includes(raw)) return 'مقبول';
  if (['rejected', 'declined'].includes(raw)) return 'مرفوض';
  return 'قيد المراجعة';
};

const normalizeProduct = (p: any): Reptile => ({
  ...p,
  price: Number(p.price || 0),
  imageUrl: resolveMediaUrl(p.imageUrl ?? p.image_url),
  isAvailable: p.isAvailable ?? p.is_available ?? true,
  status: normalizeProductStatus(p.status),
  careInstructions: p.careInstructions ?? p.care_instructions,
  specifications: p.specifications ?? [],
  reviews: p.reviews ?? [],
});

const normalizeSupply = (s: any): Supply => ({
  ...s,
  price: Number(s.price || 0),
  imageUrl: resolveMediaUrl(s.imageUrl ?? s.image_url),
  isAvailable: s.isAvailable ?? s.is_available ?? true,
  status: normalizeSupplyStatus(s.status),
});

const normalizeArticle = (a: any): Article => ({
  id: Number(a.id || 0),
  title: a.title ?? '',
  excerpt: a.excerpt ?? '',
  content: a.content ?? '',
  category: a.category ?? 'تعليمي',
  author: a.author?.name ?? a.author ?? '',
  date: typeof (a.date ?? a.published_at ?? a.created_at) === 'string'
    ? (a.date ?? a.published_at ?? a.created_at)
    : new Date(a.published_at ?? a.created_at ?? Date.now()).toLocaleDateString('ar-SY'),
  image: resolveMediaUrl(a.image ?? a.image_url),
  isActive: a.isActive ?? a.is_active ?? true,
});

const normalizeHero = (h: any): HeroSlide => ({
  id: String(h.id ?? ''),
  image: resolveMediaUrl(h.image ?? h.image_url),
  title: h.title ?? '',
  subtitle: h.subtitle ?? '',
  buttonText: h.buttonText ?? h.button_text ?? '',
  link: h.link ?? '',
  active: h.active ?? h.is_active ?? true,
});

const normalizeAddress = (a: any): Address => ({
  ...a,
  isDefault: a.isDefault ?? a.is_default,
});

const normalizeUser = (u: any): User => ({
  ...u,
  id: String(u.id),
  role: u.role ?? 'user',
  avatarUrl: u.avatarUrl ?? u.avatar_url,
  status: u.status ?? 'active',
  createdAt: u.createdAt ?? u.created_at,
});

const normalizeOrder = (o: any): Order => ({
  ...o,
  userId: String(o.userId ?? o.user_id ?? o.user?.id ?? ''),
  date: o.date ?? o.created_at ?? '',
  status: normalizeOrderStatus(o.status),
  paymentVerificationStatus: normalizePaymentStatus(o.paymentVerificationStatus ?? o.payment_verification_status),
  paymentMethod: o.paymentMethod ?? o.payment_method,
  rejectionReason: o.rejectionReason ?? o.rejection_reason,
  items: (o.items || []).map((i: any) => ({
    ...i,
    reptileId: i.reptileId ?? i.product_id ?? i.reptile_id ?? 0,
    imageUrl: i.imageUrl ?? i.image_url,
  })),
});

const toApiProductPayload = (product: Partial<Reptile>) => ({
  name: product.name,
  species: product.species,
  description: product.description,
  price: product.price,
  image_url: product.imageUrl ?? (product as any).image_url,
  rating: product.rating,
  is_available: product.isAvailable ?? (product as any).is_available,
  status: product.status,
  category: product.category,
  care_instructions: product.careInstructions ?? (product as any).care_instructions,
  specifications: product.specifications ?? [],
  reviews: product.reviews ?? [],
});

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Reptile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [filters, setFilters] = useState<FilterGroup[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [shamCashConfig, setShamCashConfig] = useState<ShamCashConfig | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [customSpecies, setCustomSpecies] = useState<CustomSpecies[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [promotions, setPromotions] = useState<PromotionalCard[]>([]);
  const [policies, setPolicies] = useState<PolicyDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const userDataLoadedRef = React.useRef(false);
  const [adminDataLoaded, setAdminDataLoaded] = useState(false);
  const adminDataLoadedRef = React.useRef(false);
  const [articlesLoaded, setArticlesLoaded] = useState(false);
  const [teamLoaded, setTeamLoaded] = useState(false);

  // simple in-memory cache for static data to avoid refetching during a session
  const cache = React.useRef<Record<string, any>>({});

  const handleError = (error: unknown) => {
    console.error(error);
  };

  const refreshData = useCallback(async () => {
    setIsLoading(true);

    // clear any cached values so loaders will refetch when called
    cache.current = {};
    setArticlesLoaded(false);
    setTeamLoaded(false);
    userDataLoadedRef.current = false;
    setUserDataLoaded(false);
    adminDataLoadedRef.current = false;
    setAdminDataLoaded(false);

    try {
      // Phase 1: Load CRITICAL data first (what users see immediately)
      const [company, contact, p, h, svcs, promos, pols] = await Promise.all([
        api.getCompanyInfo().catch(() => null),
        api.getContactInfo().catch(() => null),
        api.getProducts().catch(() => [] as Reptile[]),
        api.getHeroSlides().catch(() => [] as HeroSlide[]),
        api.getServices().catch(() => [] as Service[]),
        api.getPromotions().catch(() => [] as PromotionalCard[]),
        api.getPolicies().catch(() => [] as PolicyDocument[]),
      ]);

      // Set critical data immediately for fast UI render
      const normProducts = (Array.isArray(p) ? p : (p as any).data || []).map(normalizeProduct);
      const normHeroes = (h || []).map(normalizeHero);
      setCompanyInfo(company);
      setContactInfo(contact);
      setProducts(normProducts);
      setHeroSlides(normHeroes);
      setServices(svcs || []);
      setPromotions(promos || []);
      setPolicies(pols || []);

    } finally {
      setIsLoading(false);
    }

    // Phase 2: Load SECONDARY data in background (do not block first paint)
    void (async () => {
      const userRole = getCachedAuthUser()?.role as string | undefined;
      const shouldLoadAdminOnly = userRole === 'admin' || userRole === 'manager';

      const [s, f, shamCash, categories, species] = await Promise.all([
        api.getSupplies().catch(() => [] as Supply[]),
        api.getFilters().catch(() => [] as FilterGroup[]),
        api.getShamcashConfig().catch(() => null),
        shouldLoadAdminOnly
          ? api.getCustomCategories().catch(() => [] as CustomCategory[])
          : Promise.resolve([] as CustomCategory[]),
        api.getCustomSpecies().catch(() => [] as CustomSpecies[]),
      ]);

      const normSupplies = (Array.isArray(s) ? s : (s as any).data || []).map(normalizeSupply);
      setSupplies(normSupplies);
      setFilters(f || []);
      setShamCashConfig(shamCash);
      setCustomCategories(categories || []);
      setCustomSpecies(species || []);
    })();
  }, []);

  const loadArticles = useCallback(async (force = false) => {
    if (!force && articlesLoaded) return;
    if (!force && cache.current.articles) {
      setArticles(cache.current.articles);
      setArticlesLoaded(true);
      return;
    }
    try {
      const result = await api.getArticles().catch(() => [] as Article[]);
      const normArticles = (Array.isArray(result) ? result : (result as any).data || []).map(normalizeArticle);
      setArticles(normArticles);
      cache.current.articles = normArticles;
      setArticlesLoaded(true);
    } catch {
      /* no-op */
    }
  }, [articlesLoaded]);

  const loadTeamMembers = useCallback(async (force = false) => {
    if (!force && teamLoaded) return;
    if (!force && cache.current.team) {
      setTeamMembers(cache.current.team);
      setTeamLoaded(true);
      return;
    }
    try {
      const result = await api.getTeam().catch(() => [] as TeamMember[]);
      setTeamMembers(result || []);
      cache.current.team = result || [];
      setTeamLoaded(true);
    } catch {
      /* no-op */
    }
  }, [teamLoaded]);

  const loadUserData = useCallback(async (options?: { includeOrders?: boolean; userRole?: string }) => {
    // تخطي تحميل بيانات العميل الشخصية للمشرفين والمديرين
    if (options?.userRole === 'admin' || options?.userRole === 'manager') {
      setUserDataLoaded(true);
      userDataLoadedRef.current = true;
      setAddresses([]); // تأكد من تفريغ العناوين للمدير
      return;
    }

    if (userDataLoadedRef.current && options?.includeOrders !== true) return;
    try {
      const addressesReq = api.getAddresses().then(a => setAddresses((a || []).map(normalizeAddress))).catch(handleError);
      const shouldIncludeOrders = options?.includeOrders ?? true;
      const ordersReq = shouldIncludeOrders
        ? api.getOrders().then(o => {
            const list = Array.isArray(o) ? o : (o as any).data || [];
            setOrders(list.map(normalizeOrder));
          }).catch(handleError)
        : Promise.resolve();
      await Promise.all([addressesReq, ordersReq]);
      setUserDataLoaded(true);
      userDataLoadedRef.current = true;
    } catch {
      /* no-op */
    }
  }, []);

  const loadAdminData = useCallback(async () => {
    // التحقق من وجود مستخدم وصلاحياته قبل الطلب لتجنب أخطاء 401
    const authUser = getCachedAuthUser();
    
    if (!authUser || (authUser.role !== 'admin' && authUser.role !== 'manager')) return;

    if (adminDataLoadedRef.current) return;
    try {
      const [ordersRes, usersRes] = await Promise.all([
        api.getAdminOrders().catch(() => [] as any),
        api.getUsers().catch(() => [] as any),
      ]);

      const orderList = Array.isArray(ordersRes) ? ordersRes : (ordersRes as any).data || [];
      setOrders(orderList.map(normalizeOrder));
      setUsers(Array.isArray(usersRes) ? usersRes.map(normalizeUser) : []);
      setAdminDataLoaded(true);
      adminDataLoadedRef.current = true;
    } catch {
      /* no-op */
    }
  }, []);

  // دالة لتفريغ بيانات الإدارة والمستخدم عند تسجيل الخروج لضمان نظافة الحساب
  const clearAdminAndUserData = useCallback(() => {
    setOrders([]);
    setUsers([]);
    setAddresses([]);
    setAdminDataLoaded(false);
    adminDataLoadedRef.current = false;
    setUserDataLoaded(false);
    userDataLoadedRef.current = false;
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addOrUpdateItem = <T extends { id: any }>(prev: T[], updated: any, normalize: (p: any) => T) => {
    const norm = normalize(updated);
    const index = prev.findIndex(item => item.id === norm.id);
    if (index > -1) {
      const copy = [...prev];
      copy[index] = norm;
      return copy;
    }
    return [norm, ...prev];
  };

  const updateProductsState = (updated: any) => {
    setProducts(prev => addOrUpdateItem(prev, updated, normalizeProduct));
  };

  const deleteProductState = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addProduct = async (product: Reptile): Promise<void> => {
    const payload = toApiProductPayload(product);
    const action = (product.id && product.id > 0)
      ? api.updateProduct(product.id, payload as any)
      : api.createProduct(payload as any);
    try {
      const saved = await action;
      updateProductsState(saved);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const deleteProduct = (id: number) => {
    api.deleteProduct(id).then(() => deleteProductState(id)).catch(handleError);
  };

  const toggleProductVisibility = (id: number) => {
    api.toggleProductVisibility(id).then(updateProductsState).catch(handleError);
  };

  const addAddressState = (newAddress: Address) => {
    setAddresses(prev => [normalizeAddress(newAddress), ...prev]);
  };

  const deleteAddressState = (id: number) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const addAddress = (address: Address) => {
    api.createAddress(address).then(addAddressState).catch(handleError);
  };

  const removeAddress = (id: number) => {
    api.deleteAddress(id).then(() => deleteAddressState(id)).catch(handleError);
  };

  const updateArticlesState = (updated: any) => {
    setArticles(prev => addOrUpdateItem(prev, updated, normalizeArticle));
  };

  const deleteArticleState = (id: number) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const addArticle = async (article: Article) => {
    const action = (article.id && article.id > 0)
      ? api.updateArticle(article.id, article)
      : api.createArticle(article);
    try {
      const saved = await action;
      updateArticlesState(saved);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const deleteArticle = (id: number) => {
    api.deleteArticle(id).then(() => deleteArticleState(id)).catch(handleError);
  };

  const toggleArticleVisibility = (id: number) => {
    api.toggleArticleVisibility(id).then(updateArticlesState).catch(handleError);
  };

  const updateHeroSlidesState = (updated: any) => {
    setHeroSlides(prev => addOrUpdateItem(prev, updated, normalizeHero));
  };

  const deleteHeroSlideState = (id: string) => {
    setHeroSlides(prev => prev.filter(h => h.id !== id));
  };

  const saveHeroSlide = async (slide: HeroSlide) => {
    const action = slide.id ? api.updateHeroSlide(slide.id, slide) : api.createHeroSlide(slide);
    try {
      const saved = await action;
      updateHeroSlidesState(saved);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const deleteHeroSlide = (id: string) => {
    api.deleteHeroSlide(id).then(() => deleteHeroSlideState(id)).catch(handleError);
  };

  const toggleHeroSlideVisibility = (id: string) => {
    api.toggleHeroSlideVisibility(id).then(updateHeroSlidesState).catch(handleError);
  };

  const createOrder = async (order: Order): Promise<Order> => {
    try {
      const saved = await api.createOrder(order);
      await refreshData();
      return normalizeOrder(saved);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const updateOrder = (id: string, status: Order['status']) => {
    api.updateOrderStatus(id, status).then(() => refreshData()).catch(handleError);
  };

  const deleteOrder = async (id: string) => {
    try {
      await api.deleteOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      handleError(err);
    }
  };

  const updateOrderPaymentStatus = (orderId: string, paymentStatus: Order['paymentVerificationStatus'], rejectionReason?: string) => {
    api.updatePaymentStatus(orderId, paymentStatus, rejectionReason).then(() => refreshData()).catch(handleError);
  };

  const updateUsersState = (updated: User) => {
    const normalized = normalizeUser(updated);
    setUsers(prev => prev.map(u => u.id === normalized.id ? normalized : u));
  };

  const deleteUserState = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const updateUser = (user: User) => {
    if (!user.id) return;
    api.updateUser(user.id, user).then(updateUsersState).catch(handleError);
  };

  const createUser = async (user: Partial<User> & { password: string }): Promise<void> => {
    try {
      const created = await api.createUser(user as any);
      setUsers(prev => [normalizeUser(created), ...prev]);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const deleteUser = (id: string) => {
    api.deleteUser(id).then(() => deleteUserState(id)).catch(handleError);
  };

  const toggleUserStatus = (id: string) => {
    api.toggleUserStatus(id).then(updateUsersState).catch(handleError);
  };

  const updateSuppliesState = (updated: any) => {
    setSupplies(prev => addOrUpdateItem(prev, updated, normalizeSupply));
  };

  const deleteSupplyState = (id: number) => {
    setSupplies(prev => prev.filter(s => s.id !== id));
  };

  const addSupply = async (supply: Supply): Promise<void> => {
    const action = (supply.id && supply.id > 0)
      ? api.updateSupply(supply.id, supply)
      : api.createSupply(supply);
    try {
      const updated = await action;
      updateSuppliesState(updated);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const deleteSupply = (id: number) => {
    api.deleteSupply(id).then(() => deleteSupplyState(id)).catch(handleError);
  };

  const toggleSupplyVisibility = (id: number) => {
    api.toggleSupplyVisibility(id).then(updateSuppliesState).catch(handleError);
  };

  const addFilterGroup = (group: FilterGroup) => {
    const idStr = group.id;
    const id = idStr.includes('-') ? Number.parseInt(idStr.split('-')[1]) : Number.parseInt(idStr);
    const action = (id && id > 0)
      ? api.updateFilter(id, group)
      : api.createFilter(group);
    action.then(() => refreshData()).catch(handleError);
  };

  const deleteFilterGroup = (id: number | string) => {
    const idStr = id.toString();
    const numericId = idStr.includes('-') ? Number.parseInt(idStr.split('-')[1]) : Number.parseInt(idStr);
    if (numericId) {
      api.deleteFilter(numericId).then(() => refreshData()).catch(handleError);
    }
  };

  const toggleFilterVisibility = (id: number | string) => {
    const idStr = id.toString();
    const numericId = idStr.includes('-') ? Number.parseInt(idStr.split('-')[1]) : Number.parseInt(idStr);
    if (numericId) {
      api.toggleFilterVisibility(numericId).then(() => refreshData()).catch(handleError);
    }
  };

  const updateCompanyInfo = async (info: CompanyInfo): Promise<void> => {
    try {
      const updated = await api.updateCompanyInfo(info);
      setCompanyInfo(updated);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const updateContactInfo = (info: ContactInfo) => {
    api.updateContactInfo(info).then(updated => setContactInfo(updated)).catch(handleError);
  };

  const updateShamCashConfig = async (config: ShamCashConfig): Promise<void> => {
    try {
      const updated = await api.updateShamcashConfig(config);
      setShamCashConfig(updated);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const addCustomCategory = (cat: { value: string; label: string }) => {
    api.createCustomCategory(cat).then(() => refreshData()).catch(handleError);
  };
  const addCustomSpecies = (spec: string) => {
    api.createCustomSpecies({ name: spec }).then(() => refreshData()).catch(handleError);
  };
  const deleteCustomCategory = (id: number) => {
    api.deleteCustomCategory(id).then(() => refreshData()).catch(handleError);
  };
  const deleteCustomSpecies = (id: number) => {
    api.deleteCustomSpecies(id).then(() => refreshData()).catch(handleError);
  };

  const updateServicesStateAdd = useCallback((svc: Service) => {
    setServices(prev => {
      const index = prev.findIndex(item => item.id === svc.id);
      if (index > -1) {
        const copy = [...prev];
        copy[index] = svc;
        return copy;
      }
      return [svc, ...prev];
    });
  }, []);

  const addService = useCallback((service: Service) => {
    if (service.id) {
      api.updateService(service.id, service).then(updateServicesStateAdd).catch(handleError);
    } else {
      api.createService(service).then(updateServicesStateAdd).catch(handleError);
    }
  }, [updateServicesStateAdd]);

  const deleteServiceState = useCallback((id: number) => {
    setServices(prev => prev.filter(s => s.id !== id));
  }, []);

  const deleteService = useCallback((id: number) => {
    api.deleteService(id).then(() => deleteServiceState(id)).catch(handleError);
  }, [deleteServiceState]);

  const toggleServiceVisibility = useCallback((id: number) => {
    api.toggleServiceVisibility(id).then(updateServicesStateAdd).catch(handleError);
  }, [updateServicesStateAdd]);

  // Team Members CRUD
  const addTeamMember = async (member: TeamMember, imageFile?: File): Promise<void> => {
    const formData = new FormData();
    if (member.name) formData.append('name', member.name);
    if (member.role) formData.append('role', member.role);
    if (member.bio) formData.append('bio', member.bio);
    if (member.isActive !== undefined) formData.append('is_active', member.isActive ? '1' : '0');
    const sortOrder = (member as any).sortOrder ?? (member as any).sort_order;
    if (sortOrder !== undefined && sortOrder !== null) formData.append('sort_order', String(sortOrder));

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (member.imageUrl) {
      formData.append('image_url', member.imageUrl);
    }

    try {
      const id = Number(member.id);
      if (id && id > 0) {
        await api.updateTeamMember(id, formData);
      } else {
        await api.createTeamMember(formData);
      }
      await refreshData();
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const deleteTeamMember = async (id: number) => {
    try {
      await api.deleteTeamMember(id);
      setTeamMembers(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      handleError(err);
    }
  };

  const toggleTeamMemberVisibility = async (id: number) => {
    try {
      await api.toggleTeamMemberVisibility(id);
      await refreshData();
    } catch (err) {
      handleError(err);
    }
  };

  // Promotions CRUD
  const addPromotion = async (promo: PromotionalCard): Promise<void> => {
    try {
      if (promo.id) {
        await api.updatePromotion(promo.id, promo);
      } else {
        await api.createPromotion(promo);
      }
      await refreshData();
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const deletePromotion = async (id: string | number) => {
    try {
      await api.deletePromotion(id);
      setPromotions(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      handleError(err);
    }
  };

  const togglePromotionVisibility = async (id: string | number) => {
    try {
      await api.togglePromotionVisibility(id);
      await refreshData();
    } catch (err) {
      handleError(err);
    }
  };

  // Policies CRUD
  const addPolicy = async (policy: PolicyDocument) => {
    try {
      if (policy.id) {
        await api.updatePolicy(policy.id, policy);
      } else {
        await api.createPolicy(policy);
      }
      await refreshData();
    } catch (err) {
      handleError(err);
    }
  };

  const deletePolicy = async (id: string | number) => {
    try {
      await api.deletePolicy(id);
      setPolicies(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      handleError(err);
    }
  };

  const togglePolicyVisibility = async (id: string | number) => {
    try {
      await api.togglePolicyVisibility(id);
      await refreshData();
    } catch (err) {
      handleError(err);
    }
  };

  const contextValue = useMemo(() => ({
    products,
    orders,
    addresses,
    users,
    articles,
    heroSlides,
    supplies,
    filters,
    companyInfo,
    contactInfo,
    shamCashConfig,
    teamMembers,
    customCategories,
    customSpecies,
    services,
    promotions,
    policies,
    isLoading,
    addProduct,
    deleteProduct,
    toggleProductVisibility,
    addAddress,
    removeAddress,
    createOrder,
    updateOrder,
    deleteOrder,
    updateOrderPaymentStatus,
    addArticle,
    deleteArticle,
    toggleArticleVisibility,
    saveHeroSlide,
    deleteHeroSlide,
    toggleHeroSlideVisibility,
    updateUser,
    createUser,
    deleteUser,
    toggleUserStatus,
    addSupply,
    deleteSupply,
    toggleSupplyVisibility,
    addFilterGroup,
    deleteFilterGroup,
    toggleFilterVisibility,
    updateCompanyInfo,
    updateContactInfo,
    updateShamCashConfig,
    addCustomCategory,
    addCustomSpecies,
    deleteCustomCategory,
    deleteCustomSpecies,
    addService,
    deleteService,
    toggleServiceVisibility,
    addTeamMember,
    deleteTeamMember,
    toggleTeamMemberVisibility,
    addPromotion,
    deletePromotion,
    togglePromotionVisibility,
    addPolicy,
    deletePolicy,
    togglePolicyVisibility,
    loadUserData,
    loadAdminData,
    loadArticles,
    loadTeamMembers,
    clearAdminAndUserData,
    refreshData,
    resolveMediaUrl
  }), [
    products, orders, addresses, users, articles, heroSlides, supplies, filters,
    companyInfo, contactInfo, shamCashConfig, teamMembers, customCategories, customSpecies,
    services, promotions, policies, isLoading, refreshData,
    addService, deleteService, toggleServiceVisibility,
    loadUserData, loadAdminData, loadArticles, loadTeamMembers
  ]);

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error('useDatabase must be used within a DatabaseProvider');
  return context;
};
