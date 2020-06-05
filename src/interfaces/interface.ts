import React from 'react';

export interface ItemsAPI {
    id: number;
    title: string;
    image_url: string;
}

export interface UfAPI {
    id: number;
    sigla: string;
    nome: string;
}

export interface CityAPI {
    nome: string;
}

export interface ValidateData {
    name: string;
    email: string;
    whatsapp: string;
    longitude: number;
    latitude: number;
    uf: string;
    city: string;
    items: number[];
}