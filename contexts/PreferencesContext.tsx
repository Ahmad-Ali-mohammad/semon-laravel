
import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { api } from '../services/api';

interface Preferences {
  theme: 'dark' | 'light';
  language: 'ar' | 'en';
  notificationsEnabled: boolean;
  currency: string;
  taxRate: number;
  shippingFee: number;
  freeShippingThreshold: number;
  maintenanceMode: boolean;
  allowGuestCheckout: boolean;
  requireEmailVerification: boolean;
  defaultUserRole: string;
}

interface PreferencesContextType {
  prefs: Preferences;
  updatePref: (key: keyof Preferences, value: any) => void;
  updateAllPrefs: (newPrefs: Preferences) => Promise<void>;
}

const defaultPrefs: Preferences = {
  theme: 'dark',
  language: 'ar',
  notificationsEnabled: true,
  currency: 'USD',
  taxRate: 10,
  shippingFee: 15,
  freeShippingThreshold: 100,
  maintenanceMode: false,
  allowGuestCheckout: false,
  requireEmailVerification: true,
  defaultUserRole: 'user'
};

export const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const useApi = Boolean(import.meta.env.VITE_API_URL);
  const [prefs, setPrefs] = useState<Preferences>(defaultPrefs);

  useEffect(() => {
    if (useApi) {
      api.getPreferences()
        .then((data) => {
          if (!data) return;
          setPrefs({
            theme: (data.theme as any) || 'dark',
            language: (data.language as any) || 'ar',
            notificationsEnabled: data.notifications_enabled,
            currency: data.currency,
            taxRate: data.tax_rate,
            shippingFee: data.shipping_fee,
            freeShippingThreshold: data.free_shipping_threshold,
            maintenanceMode: data.maintenance_mode,
            allowGuestCheckout: data.allow_guest_checkout,
            requireEmailVerification: data.require_email_verification,
            defaultUserRole: data.default_user_role
          });
        })
        .catch(() => {
          // keep defaults on failure
        });
    }
  }, [useApi]);

  useEffect(() => {
    // Apply theme to document immediately
    if (prefs.theme === 'light') {
        document.documentElement.classList.add('light-mode');
    } else {
        document.documentElement.classList.remove('light-mode');
    }
  }, [prefs.theme]);

  const updatePref = (key: keyof Preferences, value: any) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);
    
    if (useApi && document.cookie.includes('XSRF-TOKEN')) {
      api.updatePreferences({
        theme: newPrefs.theme,
        language: newPrefs.language,
        notifications_enabled: newPrefs.notificationsEnabled,
        currency: newPrefs.currency,
        tax_rate: newPrefs.taxRate,
        shipping_fee: newPrefs.shippingFee,
        free_shipping_threshold: newPrefs.freeShippingThreshold,
        maintenance_mode: newPrefs.maintenanceMode,
        allow_guest_checkout: newPrefs.allowGuestCheckout,
        require_email_verification: newPrefs.requireEmailVerification,
        default_user_role: newPrefs.defaultUserRole
      }).catch(() => {
        // فشل الحفظ - لكن التفضيلات المحلية محدثة
      });
    }
  };

  const updateAllPrefs = async (newPrefs: Preferences) => {
      setPrefs(newPrefs);
      if (useApi) {
          await api.updatePreferences({
            theme: newPrefs.theme,
            language: newPrefs.language,
            notifications_enabled: newPrefs.notificationsEnabled,
            currency: newPrefs.currency,
            tax_rate: newPrefs.taxRate,
            shipping_fee: newPrefs.shippingFee,
            free_shipping_threshold: newPrefs.freeShippingThreshold,
            maintenance_mode: newPrefs.maintenanceMode,
            allow_guest_checkout: newPrefs.allowGuestCheckout,
            require_email_verification: newPrefs.requireEmailVerification,
            default_user_role: newPrefs.defaultUserRole
          });
      }
  }

  const value = useMemo(() => ({ 
    prefs, 
    updatePref, 
    updateAllPrefs 
  }), [prefs]);

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
    const context = React.useContext(PreferencesContext);
    if (!context) throw new Error('usePreferences must be used within a PreferencesProvider');
    return context;
};
