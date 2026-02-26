import { Reptile, Order, Address, User, Article, HeroSlide, Supply, ShamCashConfig, CompanyInfo, ContactInfo, TeamMember, FilterGroup } from '../types';

// Legacy local store removed in favor of API-backed MySQL.
// This stub remains to avoid runtime import errors if referenced inadvertently.

export const db = {
  getProducts: (): Reptile[] => [],
  saveProduct: (_: Reptile): Reptile[] => [],
  deleteProduct: (_: number): Reptile[] => [],

  getHeroSlides: (): HeroSlide[] => [],
  saveHeroSlide: (_: HeroSlide): HeroSlide[] => [],
  deleteHeroSlide: (_: string): HeroSlide[] => [],

  getArticles: (): Article[] => [],
  saveArticle: (_: Article): Article[] => [],
  deleteArticle: (_: number): Article[] => [],

  getUsers: (): User[] => [],
  saveUser: (_: User): User[] => [],

  getAddresses: (): Address[] => [],
  saveAddress: (_: Address): Address[] => [],
  deleteAddress: (_: number): Address[] => [],

  getOrders: (): Order[] => [],
  saveOrder: (_: Order): Order[] => [],
  updateOrderPaymentStatus: (_: string, __: Order['paymentVerificationStatus'], ___?: string) => undefined,

  getSupplies: (): Supply[] => [],
  saveSupply: (_: Supply): Supply[] => [],
  deleteSupply: (_: number): Supply[] => [],

  getShamCashConfig: (): ShamCashConfig | null => null,
  saveShamCashConfig: (_: ShamCashConfig) => undefined,

  getCustomCategories: (): { value: string; label: string }[] => [],
  saveCustomCategory: (_: { value: string; label: string }) => undefined,

  getCustomSpecies: (): string[] => [],
  saveCustomSpecies: (_: string) => undefined,

  getCompanyInfo: (): CompanyInfo | null => null,
  saveCompanyInfo: (_: CompanyInfo) => undefined,

  getContactInfo: (): ContactInfo | null => null,
  saveContactInfo: (_: ContactInfo) => undefined,

  getTeamMembers: (): TeamMember[] => [],
  saveTeamMember: (_: TeamMember) => undefined,
  deleteTeamMember: (_: string) => undefined,

  getFilterGroups: (): FilterGroup[] => [],
  saveFilterGroup: (_: FilterGroup) => undefined,
  deleteFilterGroup: (_: string) => undefined,
};
