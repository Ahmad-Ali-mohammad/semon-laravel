
import React from 'react';
import { useDatabase } from '../contexts/DatabaseContext';

const SocialSection: React.FC = () => {
    const { contactInfo } = useDatabase();

    if (!contactInfo) return null;

    const socialLinks = [
        { url: contactInfo.facebook, icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
        ), name: 'Facebook' },
        { url: contactInfo.instagram, icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.795 2.013 10.148 2 12.315 2zm-1.002 8a3.315 3.315 0 100 6.63 3.315 3.315 0 000-6.63zm5.49-3.75a1.238 1.238 0 100 2.475 1.238 1.238 0 000-2.475z" clipRule="evenodd" />
                <path d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm-4.5 2.625a2.625 2.625 0 100-5.25 2.625 2.625 0 000 5.25z" />
            </svg>
        ), name: 'Instagram' },
        { url: contactInfo.whatsapp, icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.066l-.219.324-1.123 4.103 4.185-1.096.341-.215z" />
            </svg>
        ), name: 'WhatsApp' },
    ].filter(link => link.url);

    if (socialLinks.length === 0) return null;

    return (
        <section className="my-16 p-8 md:p-12 bg-white/5 backdrop-filter backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">تابعنا على وسائل التواصل الاجتماعي</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
                انضم إلى مجتمعنا من محبي الزواحف وكن أول من يعرف عن الوافدين الجدد والعروض الخاصة والنصائح المفيدة.
            </p>
            <div className="flex justify-center items-center space-x-4 space-x-reverse">
                {socialLinks.map((link, index) => (
                    <a key={index} href={link.url || '#'} target="_blank" rel="noopener noreferrer" className="bg-amber-500/20 text-amber-300 p-4 rounded-full transition-all duration-300 hover:bg-amber-500/40 hover:text-white transform hover:scale-110">
                        {link.icon}
                    </a>
                ))}
            </div>
        </section>
    );
}

export default SocialSection;
