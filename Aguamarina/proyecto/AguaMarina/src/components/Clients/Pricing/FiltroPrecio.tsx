"use client";
import React, { useState, useEffect } from 'react';
import { InputNumber, Slider, Space } from 'antd';

interface Product {
    price: number;
}

interface PrecioProps {
    products: Product[];
    onFilterChange: (minPrice: number, maxPrice: number) => void;
}

const Precio: React.FC<PrecioProps> = ({ products, onFilterChange }) => {
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(0);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        if (products.length > 0) {
            const min = Math.min(...products.map(p => p.price));
            const max = Math.max(...products.map(p => p.price));
            setMinPrice(min);
            setMaxPrice(max);
            setPriceRange([min, max]);
        }
    }, [products]);

    const handleSliderChange = (value: [number, number]) => {
        setPriceRange(value);
        onFilterChange(value[0], value[1]);
    };

    const handleInputChange = (value: number | string, type: 'min' | 'max') => {
        if (typeof value === 'number') {
            if (type === 'min') {
                const newMinPrice = value;
                setPriceRange([newMinPrice, priceRange[1]]);
                onFilterChange(newMinPrice, priceRange[1]);
            } else {
                const newMaxPrice = value;
                setPriceRange([priceRange[0], newMaxPrice]);
                onFilterChange(priceRange[0], newMaxPrice);
            }
        }
    };

    return (
        <div className="precio-filter">
            <Slider
                range
                step={500}
                className="custom-slider"
                draggableTrack
                min={minPrice}
                max={maxPrice}
                value={priceRange}
                onChange={handleSliderChange}
                trackStyle={{ backgroundColor: '#5750f1' }} 
                handleStyle={{
                    borderColor: '#5750f1', 
                    backgroundColor: 'purple'  
                }}
            />
            <div className="price-range flex items-center space-x-2">
                <InputNumber
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(value) => handleInputChange(value, 'min')}
                />
                <div className="flex-1 flex justify-center space-x-4">
                    <span>Min</span>
                    <span>-</span>
                    <span>Max</span>
                </div>
                <InputNumber
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(value) => handleInputChange(value, 'max')}
                />
            </div>
        </div>
    );
};

export default Precio;
