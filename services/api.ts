import { Article, HeroSlide, Order, Reptile, Supply, Address, TeamMember, FilterGroup, CompanyInfo, ContactInfo, MediaItem, User, ShamCashConfig, PromotionalCard, PolicyDocument, Service, Preference, ApiKey, Backup, BackupSettings, ReportType } from '../types';
import { errorHandler, ApiError } from './errorHandler';

const API_URL = import.meta.env.VITE_API_URL || '';
const API_VERSION = 'v1'; // API version
const BASE_URL = API_URL.replace(/\/api$/, '');

const resolveUrl = (path: string | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/storage/')) return `${BASE_URL}${path}`;
  const cleanPath = path.replace(/^\/+/, '');
  return `${BASE_URL}/storage/${cleanPath}`;
};

// Updated API request function to include version
const getApiEndpoint = (path: string): string => {
  if (path.startsWith('/auth')) {
    return `${API_URL}/${API_VERSION}${path}`;
  }
  return `${API_URL}${path}`;
};

function getXsrfToken(): string {
  const m = /XSRF-TOKEN=([^;]+)/.exec(document.cookie);
  return m ? decodeURIComponent(m[1]) : '';
}

async function ensureCsrf(): Promise<void> {
  if (getXsrfToken()) return;
  await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
    credentials: 'include',
  });
}

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  if (!API_URL) throw new Error('API base URL is not configured');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string> | undefined)
  };

  const isFormData = options.body instanceof FormData;
  if (isFormData) {
    delete headers['Content-Type'];
  }

  const xsrf = getXsrfToken();
  if (xsrf) headers['X-XSRF-TOKEN'] = xsrf;

  const endpoint = getApiEndpoint(path);

  const res = await fetch(endpoint, {
    ...options,
    headers,
    credentials: 'include',
  });
  if (!res.ok) {
    const message = await (async () => {
      try {
        const data = await res.clone().json();
        if (typeof data?.message === 'string' && data.message.trim()) return data.message;
        const errors = data?.errors;
        if (errors && typeof errors === 'object') {
          const firstGroup = Object.values(errors)[0];
          if (Array.isArray(firstGroup) && typeof firstGroup[0] === 'string') return firstGroup[0];
        }
      } catch {
        /* fall back to text */
      }
      return res.text().catch(() => res.statusText);
    })();

    if (res.status === 401) {
      throw new Error(message || res.statusText);
    }

    const error: ApiError = {
      success: false,
      message: message || res.statusText,
      timestamp: new Date().toISOString()
    };

    errorHandler.handleApiError(error, {
      action: 'api_request',
      component: 'api_service',
      additionalData: { endpoint, method: options.method || 'GET' }
    });

    throw new Error(message || res.statusText);
  }
  if (res.status === 204) return {} as T;
  return res.json() as Promise<T>;
};

const formRequest = async <T>(path: string, form: FormData): Promise<T> => {
  if (!API_URL) throw new Error('API base URL is not configured');
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  const xsrf = getXsrfToken();
  if (xsrf) headers['X-XSRF-TOKEN'] = xsrf;

  const endpoint = getApiEndpoint(path);

  const res = await fetch(endpoint, {
    method: 'POST',
    body: form,
    headers,
    credentials: 'include',
  });
  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(message || res.statusText);
  }
  return res.json() as Promise<T>;
};

const requestBlob = async (path: string, options: RequestInit = {}): Promise<Blob> => {
  if (!API_URL) throw new Error('API base URL is not configured');

  const headers: Record<string, string> = {
    Accept: '*/*',
    ...(options.headers as Record<string, string> | undefined)
  };

  const xsrf = getXsrfToken();
  if (xsrf) headers['X-XSRF-TOKEN'] = xsrf;

  const endpoint = getApiEndpoint(path);

  const res = await fetch(endpoint, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(message || res.statusText);
  }

  return res.blob();
};

const toCompanyInfoPayload = (payload: Partial<CompanyInfo>) => ({
  name: payload.name,
  name_english: payload.nameEnglish,
  description: payload.description,
  founded_year: payload.foundedYear,
  mission: payload.mission,
  vision: payload.vision,
  story: payload.story,
  logo_url: payload.logoUrl,
  mascot_url: payload.mascotUrl,
});

const fromCompanyInfoPayload = (data: any): CompanyInfo | null => {
  if (!data) return null;
  return {
    ...data,
    nameEnglish: data.nameEnglish ?? data.name_english ?? '',
    foundedYear: data.foundedYear ?? data.founded_year ?? new Date().getFullYear(),
    logoUrl: data.logoUrl ?? data.logo_url,
    mascotUrl: data.mascotUrl ?? data.mascot_url,
  } as CompanyInfo;
};

const toContactInfoPayload = (payload: Partial<ContactInfo>) => ({
  phone: payload.phone,
  email: payload.email,
  address: payload.address,
  city: payload.city,
  country: payload.country,
  working_hours: payload.workingHours,
  facebook: payload.socialMedia?.facebook,
  instagram: payload.socialMedia?.instagram,
  whatsapp: payload.socialMedia?.whatsapp,
  telegram: payload.socialMedia?.telegram,
  facebook_url: payload.socialMedia?.facebook,
  instagram_url: payload.socialMedia?.instagram,
  whatsapp_url: payload.socialMedia?.whatsapp,
  telegram_url: payload.socialMedia?.telegram,
  twitter_url: payload.socialMedia?.twitter,
  youtube_url: payload.socialMedia?.youtube,
});

const fromContactInfoPayload = (data: any): ContactInfo | null => {
  if (!data) return null;
  return {
    phone: data.phone ?? '',
    email: data.email ?? '',
    address: data.address ?? '',
    city: data.city ?? '',
    country: data.country ?? '',
    workingHours: data.workingHours ?? data.working_hours ?? '',
    socialMedia: {
      facebook: data.socialMedia?.facebook ?? data.facebook_url ?? data.facebook,
      instagram: data.socialMedia?.instagram ?? data.instagram_url ?? data.instagram,
      whatsapp: data.socialMedia?.whatsapp ?? data.whatsapp_url ?? data.whatsapp,
      telegram: data.socialMedia?.telegram ?? data.telegram_url ?? data.telegram,
      twitter: data.socialMedia?.twitter ?? data.twitter_url,
      youtube: data.socialMedia?.youtube ?? data.youtube_url,
    },
  };
};

const toShamCashPayload = (payload: Partial<ShamCashConfig>) => ({
  barcode_image_url: payload.barcodeImageUrl,
  account_code: payload.accountCode,
  is_active: payload.isActive,
  account_holder_name: payload.accountHolderName,
  phone_number: payload.phoneNumber,
  payment_instructions: payload.paymentInstructions,
});

const fromShamCashPayload = (data: any): ShamCashConfig | null => {
  if (!data) return null;
  return {
    barcodeImageUrl: resolveUrl(data.barcodeImageUrl ?? data.barcode_image_url),
    accountCode: data.accountCode ?? data.account_code ?? '',
    isActive: data.isActive ?? data.is_active ?? false,
    accountHolderName: data.accountHolderName ?? data.account_holder_name ?? '',
    phoneNumber: data.phoneNumber ?? data.phone_number ?? '',
    paymentInstructions: data.paymentInstructions ?? data.payment_instructions ?? '',
  };
};

const toPreferencePayload = (payload: Partial<Preference>) => ({
  theme: payload.theme,
  language: payload.language,
  notifications_enabled: payload.notifications_enabled,
  currency: payload.currency,
  tax_rate: payload.tax_rate,
  shipping_fee: payload.shipping_fee,
  free_shipping_threshold: payload.free_shipping_threshold,
  maintenance_mode: payload.maintenance_mode,
  allow_guest_checkout: payload.allow_guest_checkout,
  require_email_verification: payload.require_email_verification,
  default_user_role: payload.default_user_role,
});

const fromPreferencePayload = (data: any): Preference => ({
  id: String(data?.id ?? ''),
  theme: data?.theme ?? 'dark',
  language: data?.language ?? 'ar',
  notifications_enabled: Boolean(data?.notifications_enabled ?? true),
  currency: data?.currency ?? 'USD',
  tax_rate: Number(data?.tax_rate ?? 10),
  shipping_fee: Number(data?.shipping_fee ?? 15),
  free_shipping_threshold: Number(data?.free_shipping_threshold ?? 100),
  maintenance_mode: Boolean(data?.maintenance_mode ?? false),
  allow_guest_checkout: Boolean(data?.allow_guest_checkout ?? false),
  require_email_verification: Boolean(data?.require_email_verification ?? true),
  default_user_role: data?.default_user_role ?? 'user',
});

const toHeroSlidePayload = (payload: Partial<HeroSlide>) => ({
  image_url: (payload as any).image_url ?? payload.image,
  title: payload.title,
  subtitle: payload.subtitle,
  button_text: (payload as any).button_text ?? payload.buttonText,
  link: payload.link,
  is_active: (payload as any).is_active ?? (payload as any).active ?? payload.active,
  sort_order: (payload as any).sort_order ?? (payload as any).sortOrder,
});

const fromHeroSlidePayload = (data: any): HeroSlide => ({
  id: String(data?.id ?? ''),
  image: resolveUrl(data?.image ?? data?.image_url),
  title: data?.title ?? '',
  subtitle: data?.subtitle ?? '',
  buttonText: data?.buttonText ?? data?.button_text ?? '',
  link: data?.link ?? '',
  active: Boolean(data?.active ?? data?.is_active ?? true),
});

const toFilterGroupPayload = (payload: Partial<FilterGroup>) => ({
  name: payload.name,
  type: payload.type,
  applies_to: (payload as any).applies_to ?? (payload as any).appliesTo,
  is_active: (payload as any).is_active ?? (payload as any).isActive,
  options: payload.options?.map(opt => {
    const optionId = opt.id ? Number(opt.id) : undefined;
    return {
      id: Number.isNaN(optionId as number) ? undefined : optionId,
      name: opt.name,
      value: opt.value,
      is_active: (opt as any).is_active ?? (opt as any).isActive,
      sort_order: (opt as any).sort_order ?? (opt as any).order,
    };
  }),
});

const fromFilterGroupPayload = (data: any): FilterGroup => ({
  id: String(data?.id ?? ''),
  name: data?.name ?? '',
  type: data?.type ?? 'custom',
  appliesTo: data?.appliesTo ?? data?.applies_to ?? 'both',
  isActive: Boolean(data?.isActive ?? data?.is_active ?? true),
  options: Array.isArray(data?.options)
    ? data.options.map((opt: any) => ({
        id: String(opt?.id ?? ''),
        name: opt?.name ?? '',
        value: opt?.value ?? '',
        isActive: Boolean(opt?.isActive ?? opt?.is_active ?? true),
        order: Number(opt?.order ?? opt?.sort_order ?? 0),
      }))
    : [],
});

const toServicePayload = (payload: Partial<Service>) => ({
  title: payload.title,
  description: payload.description,
  icon: payload.icon,
  price: payload.price,
  highlight: payload.highlight,
  is_active: (payload as any).is_active ?? payload.isActive,
  sort_order: (payload as any).sort_order ?? payload.sortOrder,
});

const fromServicePayload = (data: any): Service => ({
  id: Number(data?.id ?? 0),
  title: data?.title ?? '',
  description: data?.description ?? '',
  icon: data?.icon ?? undefined,
  price: data?.price ?? undefined,
  highlight: data?.highlight ?? undefined,
  isActive: Boolean(data?.isActive ?? data?.is_active ?? true),
  sortOrder: Number(data?.sortOrder ?? data?.sort_order ?? 0),
});

const toPolicyPayload = (payload: Partial<PolicyDocument>) => ({
  type: payload.type,
  title: payload.title,
  content: payload.content,
  last_updated: (payload as any).last_updated ?? payload.lastUpdated,
  is_active: (payload as any).is_active ?? payload.isActive,
  icon: payload.icon,
});

const fromPolicyPayload = (data: any): PolicyDocument => ({
  id: String(data?.id ?? ''),
  type: data?.type ?? 'custom',
  title: data?.title ?? '',
  content: data?.content ?? '',
  lastUpdated: data?.lastUpdated ?? data?.last_updated ?? '',
  isActive: Boolean(data?.isActive ?? data?.is_active ?? true),
  icon: data?.icon ?? undefined,
});

const toAddressPayload = (payload: Partial<Address>) => ({
  label: payload.label,
  street: payload.street,
  city: payload.city,
  country: payload.country,
  is_default: (payload as any).is_default ?? payload.isDefault,
});

const fromAddressPayload = (data: any): Address => ({
  id: Number(data?.id ?? 0),
  label: data?.label ?? '',
  street: data?.street ?? '',
  city: data?.city ?? '',
  country: data?.country ?? '',
  isDefault: Boolean(data?.isDefault ?? data?.is_default ?? false),
});

const toArticlePayload = (payload: Partial<Article>) => {
  const rawDate = (payload as any).published_at ?? (payload as any).publishedAt ?? (payload as any).date;
  const parsed = rawDate ? new Date(rawDate) : null;
  const publishedAt = parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : undefined;

  return {
    title: payload.title,
    excerpt: payload.excerpt,
    content: payload.content,
    category: payload.category,
    image_url: (payload as any).image_url ?? payload.image,
    published_at: publishedAt,
  };
};

const fromArticlePayload = (data: any): Article => ({
  id: Number(data?.id ?? 0),
  title: data?.title ?? '',
  excerpt: data?.excerpt ?? '',
  content: data?.content ?? '',
  category: data?.category ?? 'تعليمي',
  date: new Date(data?.published_at ?? data?.created_at ?? Date.now()).toLocaleDateString('ar-SY'),
  author: data?.author?.name ?? data?.author ?? '',
  image: resolveUrl(data?.image ?? data?.image_url),
  isActive: Boolean(data?.isActive ?? data?.is_active ?? true),
});

const fromTeamMemberPayload = (data: any): TeamMember => ({
  id: String(data?.id ?? ''),
  name: data?.name ?? '',
  role: data?.role ?? '',
  imageUrl: resolveUrl(data?.imageUrl ?? data?.image_url),
  bio: data?.bio ?? undefined,
  isActive: Boolean(data?.isActive ?? data?.is_active ?? true),
});

const fromPromotionPayload = (data: any): PromotionalCard => ({
  id: data?.id ?? '',
  title: data?.title ?? '',
  description: data?.description ?? '',
  imageUrl: resolveUrl(data?.imageUrl ?? data?.image_url),
  discountPercentage: data?.discountPercentage ?? data?.discount_percentage ?? undefined,
  startDate: data?.startDate ?? data?.start_date ?? '',
  endDate: data?.endDate ?? data?.end_date ?? '',
  startTime: data?.startTime ?? data?.start_time ?? undefined,
  endTime: data?.endTime ?? data?.end_time ?? undefined,
  isActive: Boolean(data?.isActive ?? data?.is_active ?? true),
  targetCategory: data?.targetCategory ?? data?.target_category ?? undefined,
  buttonText: data?.buttonText ?? data?.button_text ?? undefined,
  buttonLink: data?.buttonLink ?? data?.button_link ?? undefined,
});

const toSupplyPayload = (payload: Partial<Supply>) => ({
  name: payload.name,
  category: payload.category,
  description: payload.description,
  price: payload.price,
  image_url: payload.imageUrl,
  rating: payload.rating,
  is_available: payload.isAvailable,
  status: payload.status,
});

const toPromotionPayload = (payload: Partial<PromotionalCard>) => ({
  title: payload.title,
  description: payload.description,
  image_url: payload.imageUrl,
  discount_percentage: payload.discountPercentage,
  start_date: payload.startDate,
  end_date: payload.endDate,
  start_time: payload.startTime,
  end_time: payload.endTime,
  is_active: payload.isActive,
  target_category: payload.targetCategory,
  button_text: payload.buttonText,
  button_link: payload.buttonLink,
});

const toUserPayload = (payload: Partial<User>) => ({
  name: payload.name,
  email: payload.email,
  password: (payload as any).password,
  role: payload.role,
  avatar_url: payload.avatarUrl,
  status: payload.status,
});

const fromUserPayload = (data: any): User => ({
  id: String(data?.id ?? ''),
  name: data?.name ?? '',
  email: data?.email ?? '',
  role: data?.role ?? 'user',
  avatarUrl: data?.avatarUrl ?? data?.avatar_url,
  status: (data?.status ?? 'active') as User['status'],
  createdAt: data?.createdAt ?? data?.created_at,
});

const fromUsersCollection = (data: any): User[] => {
  if (Array.isArray(data)) return data.map(fromUserPayload);
  if (Array.isArray(data?.data)) return data.data.map(fromUserPayload);
  return [];
};

const fromApiKeyPayload = (data: any): ApiKey => ({
  id: String(data?.id ?? ''),
  name: data?.name ?? '',
  key: data?.key ?? undefined,
  keyMasked: data?.key_masked ?? data?.keyMasked ?? undefined,
  permissions: Array.isArray(data?.permissions) ? data.permissions : [],
  createdAt: data?.created_at ?? data?.createdAt ?? '',
  lastUsed: data?.last_used_at ?? data?.lastUsed ?? undefined,
  usageCount: Number(data?.usage_count ?? data?.usageCount ?? 0),
  isActive: Boolean(data?.is_active ?? data?.isActive ?? true),
  expiresAt: data?.expires_at ?? data?.expiresAt ?? undefined,
});

const fromBackupPayload = (data: any): Backup => ({
  id: String(data?.id ?? ''),
  name: data?.name ?? '',
  size: data?.size ?? '',
  date: data?.date ?? data?.created_at ?? '',
  type: (data?.type ?? 'full') as Backup['type'],
  status: (data?.status ?? 'pending') as Backup['status'],
  description: data?.description ?? undefined,
  restoredAt: data?.restored_at ?? data?.restoredAt ?? undefined,
});

const fromBackupSettings = (data: any): BackupSettings => ({
  enabled: Boolean(data?.enabled ?? true),
  frequency: (data?.frequency ?? 'daily') as BackupSettings['frequency'],
  time: data?.time ?? '03:00',
  retention: Number(data?.retention ?? 30),
});

const toOrderPayload = (payload: Partial<Order>) => ({
  total: payload.total,
  payment_method: payload.paymentMethod,
  customer_name: payload.customerName,
  phone: payload.phone,
  city: payload.city,
  address: payload.address,
  notes: payload.notes,
  items: payload.items?.map(item => ({
    product_id: item.reptileId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    image_url: item.imageUrl
  }))
});

const toApiOrderStatus = (status: Order['status'] | string): string => {
  if (status === 'قيد المعالجة') return 'processing';
  if (status === 'تم التأكيد') return 'confirmed';
  if (status === 'تم الشحن') return 'shipped';
  if (status === 'تم التوصيل') return 'delivered';
  return String(status);
};

const toApiPaymentStatus = (status: Order['paymentVerificationStatus'] | string): string => {
  if (status === 'قيد المراجعة') return 'pending';
  if (status === 'مقبول') return 'approved';
  if (status === 'مرفوض') return 'rejected';
  return String(status);
};

export const api = {
  // Auth
  async login(email: string, password: string) {
    await ensureCsrf();
    const data = await request<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    return data.user;
  },
  async register(name: string, email: string, password: string) {
    await ensureCsrf();
    const data = await request<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    return data.user;
  },
  async me() {
    // ensure CSRF cookie is present before checking authenticated user
    await ensureCsrf();
    return request<User>('/auth/me');
  },
  logout() {
    return request('/auth/logout', { method: 'POST' }).catch(() => undefined);
  },
  async forgotPassword(email: string) {
    await ensureCsrf();
    return request<{ message: string }>('/auth/password/forgot', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },
  async resetPassword(payload: { token: string; email: string; password: string; password_confirmation: string }) {
    await ensureCsrf();
    return request<{ message: string }>('/auth/password/reset', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Public fetchers
  getProducts: () => request<{ data: Reptile[] }>('/products').then(r => r.data ?? r),
  getSupplies: () => request<{ data: Supply[] }>('/supplies').then(r => r.data ?? r),
  getHeroSlides: () => request<any[]>('/hero-slides').then(r => (Array.isArray(r) ? r.map(fromHeroSlidePayload) : [])),
  getArticles: () =>
    request<{ data: any[] }>('/articles').then(r => {
      const list = Array.isArray(r) ? r : r.data ?? [];
      return list.map(fromArticlePayload);
    }),
  getCompanyInfo: () => request<any>('/company-info').then(fromCompanyInfoPayload),
  updateCompanyInfo: (payload: Partial<CompanyInfo>) =>
    request<any>('/admin/company-info', { method: 'PUT', body: JSON.stringify(toCompanyInfoPayload(payload)) }).then(fromCompanyInfoPayload),
  getContactInfo: () => request<any>('/contact-info').then(fromContactInfoPayload),
  updateContactInfo: (payload: Partial<ContactInfo>) =>
    request<any>('/admin/contact-info', { method: 'PUT', body: JSON.stringify(toContactInfoPayload(payload)) }).then(fromContactInfoPayload),

  getTeam: () => request<any[]>('/team').then(r => (Array.isArray(r) ? r.map(fromTeamMemberPayload) : [])),
  getFilters: () => request<any[]>('/filters').then(r => (Array.isArray(r) ? r.map(fromFilterGroupPayload) : [])),
  getShamcashConfig: () => request<any>('/shamcash-config').then(fromShamCashPayload),
  updateShamcashConfig: (payload: Partial<ShamCashConfig>) =>
    request<any>('/admin/shamcash-config', { method: 'PUT', body: JSON.stringify(toShamCashPayload(payload)) }).then(fromShamCashPayload),
  getPromotions: () => request<any[]>('/promotions').then(r => (Array.isArray(r) ? r.map(fromPromotionPayload) : [])),
  createPromotion: (payload: Partial<PromotionalCard>) =>
    request<any>('/admin/promotions', { method: 'POST', body: JSON.stringify(toPromotionPayload(payload)) }).then(fromPromotionPayload),
  updatePromotion: (id: string | number, payload: Partial<PromotionalCard>) =>
    request<any>(`/admin/promotions/${id}`, { method: 'PUT', body: JSON.stringify(toPromotionPayload(payload)) }).then(fromPromotionPayload),
  deletePromotion: (id: string | number) => request(`/admin/promotions/${id}`, { method: 'DELETE' }),
  togglePromotionVisibility: (id: string | number) =>
    request<any>(`/admin/promotions/${id}/toggle-visibility`, { method: 'PATCH' }).then(fromPromotionPayload),
  getPolicies: () => request<any[]>('/policies').then(r => (Array.isArray(r) ? r.map(fromPolicyPayload) : [])),
  createPolicy: (payload: Partial<PolicyDocument>) =>
    request<any>('/admin/policies', { method: 'POST', body: JSON.stringify(toPolicyPayload(payload)) }).then(fromPolicyPayload),
  updatePolicy: (id: string | number, payload: Partial<PolicyDocument>) =>
    request<any>(`/admin/policies/${id}`, { method: 'PUT', body: JSON.stringify(toPolicyPayload(payload)) }).then(fromPolicyPayload),
  deletePolicy: (id: string | number) => request(`/admin/policies/${id}`, { method: 'DELETE' }),
  togglePolicyVisibility: (id: string | number) =>
    request<any>(`/admin/policies/${id}/toggle-visibility`, { method: 'PATCH' }).then(fromPolicyPayload),
  getCustomCategories: () => request<{ id: number; value: string; label: string }[]>('/custom-categories'),
  createCustomCategory: (payload: { value: string; label: string }) =>
    request('/admin/custom-categories', { method: 'POST', body: JSON.stringify(payload) }),
  updateCustomCategory: (id: number, payload: { value?: string; label?: string }) =>
    request(`/admin/custom-categories/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteCustomCategory: (id: number) => request(`/admin/custom-categories/${id}`, { method: 'DELETE' }),
  getCustomSpecies: () => request<{ id: number; name: string }[]>('/custom-species'),
  createCustomSpecies: (payload: { name: string }) =>
    request('/admin/custom-species', { method: 'POST', body: JSON.stringify(payload) }),
  updateCustomSpecies: (id: number, payload: { name?: string }) =>
    request(`/admin/custom-species/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteCustomSpecies: (id: number) => request(`/admin/custom-species/${id}`, { method: 'DELETE' }),

  // Services
  getServices: () => request<any[]>('/services').then(r => (Array.isArray(r) ? r.map(fromServicePayload) : [])),
  createService: (payload: Partial<Service>) =>
    request<any>('/admin/services', { method: 'POST', body: JSON.stringify(toServicePayload(payload)) }).then(fromServicePayload),
  updateService: (id: number, payload: Partial<Service>) =>
    request<any>(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(toServicePayload(payload)) }).then(fromServicePayload),
  deleteService: (id: number) => request(`/admin/services/${id}`, { method: 'DELETE' }),
  toggleServiceVisibility: (id: number) =>
    request<any>(`/admin/services/${id}/toggle-visibility`, { method: 'PATCH' }).then(fromServicePayload),

  getPreferences: () => request<any>('/preferences').then(fromPreferencePayload),
  updatePreferences: (payload: Partial<Preference>) =>
    request<any>('/admin/preferences', { method: 'PUT', body: JSON.stringify(toPreferencePayload(payload)) }).then(fromPreferencePayload),

  // API Keys (admin)
  getApiKeys: () => request<any[]>('/admin/api-keys').then(r => (Array.isArray(r) ? r.map(fromApiKeyPayload) : [])),
  createApiKey: (payload: { name: string; permissions: string[]; expiresAt?: string }) =>
    request<any>('/admin/api-keys', {
      method: 'POST',
      body: JSON.stringify({
        name: payload.name,
        permissions: payload.permissions,
        expires_at: payload.expiresAt || null,
      })
    }).then(fromApiKeyPayload),
  updateApiKey: (id: string, payload: Partial<ApiKey>) =>
    request<any>(`/admin/api-keys/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: payload.name,
        permissions: payload.permissions,
        expires_at: payload.expiresAt,
        is_active: payload.isActive,
      })
    }).then(fromApiKeyPayload),
  regenerateApiKey: (id: string) =>
    request<any>(`/admin/api-keys/${id}/regenerate`, { method: 'POST' }).then(fromApiKeyPayload),
  deleteApiKey: (id: string) => request(`/admin/api-keys/${id}`, { method: 'DELETE' }),

  // Backups (admin)
  getBackups: () =>
    request<any>('/admin/backups').then(r => ({
      data: Array.isArray(r?.data) ? r.data.map(fromBackupPayload) : [],
      settings: r?.settings ? fromBackupSettings(r.settings) : null,
      storage: r?.storage ?? null,
    })),
  createBackup: (type: Backup['type']) =>
    request<any>('/admin/backups', { method: 'POST', body: JSON.stringify({ type }) }).then(fromBackupPayload),
  restoreBackup: (id: string) =>
    request<any>(`/admin/backups/${id}/restore`, { method: 'POST' }),
  deleteBackup: (id: string) => request(`/admin/backups/${id}`, { method: 'DELETE' }),
  updateBackupSettings: (payload: Partial<BackupSettings>) =>
    request<any>('/admin/backups/settings', {
      method: 'PUT',
      body: JSON.stringify({
        enabled: payload.enabled,
        frequency: payload.frequency,
        time: payload.time,
        retention: payload.retention,
      })
    }).then(fromBackupSettings),
  downloadBackup: (id: string) => requestBlob(`/admin/backups/${id}/download`),

  // Reports (admin)
  getReport: (type: ReportType, start?: string, end?: string) => {
    const params = new URLSearchParams();
    params.set('type', type);
    if (start) params.set('start', start);
    if (end) params.set('end', end);
    const query = params.toString();
    return request<any>(`/admin/reports${query ? `?${query}` : ''}`);
  },

  // Addresses (auth)
  getAddresses: () => request<any[]>('/addresses').then(r => (Array.isArray(r) ? r.map(fromAddressPayload) : [])),
  createAddress: (payload: Omit<Address, 'id' | 'isDefault'> & { isDefault?: boolean }) =>
    request<any>('/addresses', { method: 'POST', body: JSON.stringify(toAddressPayload(payload)) }).then(fromAddressPayload),
  updateAddress: (id: number, payload: Partial<Address>) =>
    request<any>(`/addresses/${id}`, { method: 'PUT', body: JSON.stringify(toAddressPayload(payload)) }).then(fromAddressPayload),
  deleteAddress: (id: number) => request(`/addresses/${id}`, { method: 'DELETE' }),

  // Orders (auth)
  getOrders: () => request<{ data: Order[] }>('/orders').then(r => r.data ?? r),
  getAdminOrders: () => request<{ data: Order[] }>('/admin/orders').then(r => r.data ?? r),
  createOrder: (payload: Partial<Order>) =>
    request<Order>('/orders', { method: 'POST', body: JSON.stringify(toOrderPayload(payload)) }),
  updateOrderStatus: (id: string, status: Order['status']) =>
    request<Order>(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: toApiOrderStatus(status) }) }),
  updatePaymentStatus: (id: string, payment_verification_status: Order['paymentVerificationStatus'], rejection_reason?: string) =>
    request<Order>(`/admin/orders/${id}/payment-status`, {
      method: 'PATCH',
      body: JSON.stringify({ payment_verification_status: toApiPaymentStatus(payment_verification_status), rejection_reason })
    }),
  addPaymentProof: (orderId: string, image_url: string) =>
    request(`/orders/${orderId}/payment-proof`, { method: 'POST', body: JSON.stringify({ image_url }) }),
  deleteOrder: (id: string) => request(`/admin/orders/${id}`, { method: 'DELETE' }),

  // Cart (auth)
  getCart: () => request<any[]>('/cart'),
  addToCart: (product_id: number, quantity: number = 1) =>
    request<any>('/cart', { method: 'POST', body: JSON.stringify({ product_id, quantity }) }),
  updateCartItem: (id: number, quantity: number) =>
    request<any>(`/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  removeCartItem: (id: number) => request(`/cart/${id}`, { method: 'DELETE' }),
  clearCart: () => request('/cart/clear', { method: 'DELETE' }),

  // Wishlist (auth)
  getWishlist: () => request<number[]>('/wishlist'),
  toggleWishlist: (product_id: number) =>
    request<{ action: string; product_id: number }>('/wishlist/toggle', {
      method: 'POST', body: JSON.stringify({ product_id })
    }),
  removeWishlistItem: (productId: number) =>
    request(`/wishlist/${productId}`, { method: 'DELETE' }),

  // Recent Views (auth)
  getRecentViews: () => request<number[]>('/recent-views'),
  recordView: (product_id: number) =>
    request('/recent-views', { method: 'POST', body: JSON.stringify({ product_id }) }),

  // Media (admin)
  uploadMedia: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return formRequest<MediaItem>('/admin/media', form);
  },
  getMedia: () => request<{ data: MediaItem[] }>('/admin/media').then(r => r.data ?? r),
  deleteMedia: (id: string) => request(`/admin/media/${id}`, { method: 'DELETE' }),

  // Admin CRUD (lightweight)
  createProduct: (payload: Partial<Reptile>) =>
    request<Reptile>('/admin/products', { method: 'POST', body: JSON.stringify(payload) }),
  updateProduct: (id: number, payload: Partial<Reptile>) =>
    request<Reptile>(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteProduct: (id: number) => request(`/admin/products/${id}`, { method: 'DELETE' }),
  toggleProductVisibility: (id: number) =>
    request<Reptile>(`/admin/products/${id}/toggle-visibility`, { method: 'PATCH' }),

  createSupply: (payload: Partial<Supply>) =>
    request<Supply>('/admin/supplies', { method: 'POST', body: JSON.stringify(toSupplyPayload(payload)) }),
  updateSupply: (id: number, payload: Partial<Supply>) =>
    request<Supply>(`/admin/supplies/${id}`, { method: 'PUT', body: JSON.stringify(toSupplyPayload(payload)) }),
  deleteSupply: (id: number) => request(`/admin/supplies/${id}`, { method: 'DELETE' }),
  toggleSupplyVisibility: (id: number) =>
    request<Supply>(`/admin/supplies/${id}/toggle-visibility`, { method: 'PATCH' }),

  createArticle: (payload: Partial<Article>) =>
    request<any>('/admin/articles', { method: 'POST', body: JSON.stringify(toArticlePayload(payload)) }).then(fromArticlePayload),
  updateArticle: (id: number, payload: Partial<Article>) =>
    request<any>(`/admin/articles/${id}`, { method: 'PUT', body: JSON.stringify(toArticlePayload(payload)) }).then(fromArticlePayload),
  deleteArticle: (id: number) => request(`/admin/articles/${id}`, { method: 'DELETE' }),
  toggleArticleVisibility: (id: number) =>
    request<any>(`/admin/articles/${id}/toggle-visibility`, { method: 'PATCH' }).then(fromArticlePayload),

  createHeroSlide: (payload: Partial<HeroSlide>) =>
    request<any>('/admin/hero-slides', { method: 'POST', body: JSON.stringify(toHeroSlidePayload(payload)) }).then(fromHeroSlidePayload),
  updateHeroSlide: (id: string, payload: Partial<HeroSlide>) =>
    request<any>(`/admin/hero-slides/${id}`, { method: 'PUT', body: JSON.stringify(toHeroSlidePayload(payload)) }).then(fromHeroSlidePayload),
  deleteHeroSlide: (id: string) => request(`/admin/hero-slides/${id}`, { method: 'DELETE' }),
  toggleHeroSlideVisibility: (id: string) =>
    request<any>(`/admin/hero-slides/${id}/toggle-visibility`, { method: 'PATCH' }).then(fromHeroSlidePayload),

  // Users (admin)
  getUsers: () => request<any>('/admin/users').then(fromUsersCollection),
  createUser: (payload: Partial<User>) =>
    request<any>('/admin/users', { method: 'POST', body: JSON.stringify(toUserPayload(payload)) }).then(fromUserPayload),
  updateUser: (id: string, payload: Partial<User>) =>
    request<any>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(toUserPayload(payload)) }).then(fromUserPayload),
  deleteUser: (id: string) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  toggleUserStatus: (id: string) =>
    request<any>(`/admin/users/${id}/toggle-status`, { method: 'PATCH' }).then(fromUserPayload),

  // Filters (admin)
  createFilter: (payload: Partial<FilterGroup>) =>
    request<any>('/admin/filters', { method: 'POST', body: JSON.stringify(toFilterGroupPayload(payload)) }).then(fromFilterGroupPayload),
  updateFilter: (id: number, payload: Partial<FilterGroup>) =>
    request<any>(`/admin/filters/${id}`, { method: 'PUT', body: JSON.stringify(toFilterGroupPayload(payload)) }).then(fromFilterGroupPayload),
  deleteFilter: (id: number) => request(`/admin/filters/${id}`, { method: 'DELETE' }),
  toggleFilterVisibility: (id: number) =>
    request<any>(`/admin/filters/${id}/toggle-visibility`, { method: 'PATCH' }).then(fromFilterGroupPayload),

  // Team (admin)
  createTeamMember: (payload: FormData) =>
    request<any>('/admin/team', { method: 'POST', body: payload }).then(fromTeamMemberPayload),
  updateTeamMember: (id: number, payload: FormData) =>
    request<any>(`/admin/team/${id}`, { method: 'POST', body: payload, headers: { 'X-HTTP-Method-Override': 'PUT' } }).then(fromTeamMemberPayload),
  deleteTeamMember: (id: number) => request(`/admin/team/${id}`, { method: 'DELETE' }),
  toggleTeamMemberVisibility: (id: number) =>
    request<any>(`/admin/team/${id}/toggle-visibility`, { method: 'PATCH' }).then(fromTeamMemberPayload),
};
