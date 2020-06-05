import React from 'react';

export interface ItemsAPI {
    id: number;
    title: string;
    image_url: string;
}

export interface ufAPI {
    id: number;
    sigla: string;
    nome: string;
}

export interface cityAPI {
    nome: string;
}