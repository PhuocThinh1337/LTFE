import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '../data/products';

interface CompareContextType {
    compareList: Product[];
    addToCompare: (product: Product) => void;
    removeFromCompare: (productId: number) => void;
    clearCompare: () => void;
    isInCompare: (productId: number) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const useCompare = () => {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
};

interface CompareProviderProps {
    children: ReactNode;
}

export const CompareProvider: React.FC<CompareProviderProps> = ({ children }) => {
    const [compareList, setCompareList] = useState<Product[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('compareList');
        if (stored) {
            try {
                setCompareList(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse compare list from local storage");
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('compareList', JSON.stringify(compareList));
    }, [compareList]);

    const addToCompare = (product: Product) => {
        if (compareList.length >= 3) {
            alert("Bạn chỉ có thể so sánh tối đa 3 sản phẩm.");
            return;
        }
        if (!isInCompare(product.id)) {
            setCompareList([...compareList, product]);
        }
    };

    const removeFromCompare = (productId: number) => {
        setCompareList(compareList.filter(p => p.id !== productId));
    };

    const clearCompare = () => {
        setCompareList([]);
    };

    const isInCompare = (productId: number) => {
        return compareList.some(p => p.id === productId);
    };

    const value = {
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare
    };

    return (
        <CompareContext.Provider value={value}>
            {children}
        </CompareContext.Provider>
    );
};
