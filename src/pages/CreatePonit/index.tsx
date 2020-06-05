import React, { useState, useEffect, ChangeEvent } from 'react';
import './style.css';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';//Usado para a rota sem a necessidade de regarregamento
import { FiChevronsLeft } from 'react-icons/fi'; //Icones dos botões
import { Map, TileLayer, Marker } from 'react-leaflet'; //Criação do Mapa
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api'; //Pegar os dados da nossa API
import axios from 'axios'; //Pegar dados do IBGE
import { ItemsAPI, ufAPI, cityAPI } from '../../interfaces/interface';
// State que são ARRAY ou OBJETO, precisamos definir manualmnete o tipo da variavel
// que será armazenado lá dentro. Por isso a utilização da *interface*

const CreatePoint = () => {

    const [items, setItems] = useState<ItemsAPI[]>([]);
    const [uf, setUf] = useState<ufAPI[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCites, setSelectedCites] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;

            setInitialPosition([ latitude, longitude ]);
        });
    }, []);

    useEffect(() => {
        api.get('/items')
            .then(response => {
                setItems(response.data);
            })
            .catch(e => {
                alert('Erro ao cerregar os itens: ' + e);
            });
    }, []);

    useEffect(() => {

        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(response => {
                setUf(response.data);
            })
            .catch(e => alert('Erro ao cerregar as UF: ' + e));
    }, []);

    //Carrega sempre o usuario muda o UF
    useEffect(() => {

        if (selectedUf === '0') return;

        axios.get<cityAPI[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(item => item.nome);
                setCities(cityNames);
            })
            .catch(e => alert('Erro ao cerregar as cidades: ' + e));
    }, [selectedUf]);


    // ChangeEvent<HTMLSelectElement> o change está alterando um elemento SELECT HTML
    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUf(event.target.value);
    }

    // Pegar qual é a cidade selecionada
    function handleSelectedCities(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCites(event.target.value);
    }

    // Pegar a latitude e longitude que o usuário clicar no mapa
    function handleMapClick(event: LeafletMouseEvent) {
        const { lat, lng } = event.latlng;
        setSelectedPosition([lat, lng]);
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="ecoleta" />

                <Link to="/">
                    <span> <FiChevronsLeft /> </span>
                    Voltar para home
                </Link>
            </header>
            {/* ------------------------------------------------------------------------- */}

            <form>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name="name" id="name" />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" name="email" id="email" />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp" />
                        </div>
                    </div>

                </fieldset>
                {/* ------------------------------------------------------------------------- */}
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onclick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select
                                name="uf" id="uf"
                                value={selectedUf}
                                onChange={handleSelectedUf}
                            >
                                <option value="0">Selecione o UF</option>
                                {uf.map(item => (
                                    <option key={item.id} value={item.sigla}>{item.sigla}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCites} onChange={handleSelectedCities}>
                                <option value="0">Selecione a cidade</option>
                                {cities.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                {/* ------------------------------------------------------------------------- */}
                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map((item) => {
                            return (
                                <li key={item.id}>
                                    <img src={item.image_url} alt={item.title} />
                                    <span>{item.title}</span>
                                </li>
                            );
                        })}
                    </ul>
                </fieldset>
                {/* ------------------------------------------------------------------------- */}

                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    );
}

export default CreatePoint;