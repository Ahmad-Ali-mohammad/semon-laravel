
import React from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { PolicyDocument } from '../types';

interface PolicyPageProps {
    title: string;
    type?: PolicyDocument['type'];
    children: React.ReactNode;
}

const PolicyPage: React.FC<PolicyPageProps> = ({ title, type, children }) => {
    const { policies } = useDatabase();

    const normalizePolicy = (p: any): PolicyDocument => ({
        id: p.id,
        type: p.type,
        title: p.title,
        content: p.content,
        lastUpdated: p.lastUpdated || p.last_updated,
        isActive: p.isActive ?? p.is_active ?? true,
        icon: p.icon || ''
    });

    const match = type
        ? policies.map(normalizePolicy).find(p => p.type === type && p.isActive)
        : undefined;
    const content = match?.content || null;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">{title}</h1>
            <div className="bg-white/5 backdrop-filter backdrop-blur-lg border border-white/20 rounded-2xl p-8 space-y-6 text-gray-300 leading-loose prose prose-invert prose-p:text-gray-300 prose-headings:text-amber-400">
                {content ? <p className="whitespace-pre-wrap">{content}</p> : children}
            </div>
        </div>
    );
};

export default PolicyPage;
