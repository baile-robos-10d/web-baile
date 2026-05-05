// src/components/musicas.jsx - VERSÃO COMPLETA (SUBSTITUIR O ARQUIVO)
import React, { useState } from 'react';
import useMQTT from '../hooks/useMQTT';

// Lista de músicas disponíveis
const musicasDisponiveis = [
    { nome: 'Billie Jean', id: 1, emoji: '🎤' },
    { nome: 'Thriller', id: 2, emoji: '🧟' },
    { nome: 'Beat It', id: 3, emoji: '🎸' },
    { nome: 'Smooth Criminal', id: 4, emoji: '🕺' }
];

function Musicas() {
    const [musicaSelecionada, setMusicaSelecionada] = useState(null);
    const [mensagem, setMensagem] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const { tocarMusica, pararMusica, isConnected } = useMQTT();

    const selecionarMusica = (musica) => {
        console.log('🎵 Selecionando música:', musica.nome, 'ID:', musica.id);
        console.log('isConnected:', isConnected);

        if (!isConnected) {
            setMensagem('⚠️ Sistema desconectado!');
            setTimeout(() => setMensagem(''), 2000);
            return;
        }

        setMusicaSelecionada(musica.id);
        setMensagem(`📀 Música selecionada: ${musica.nome}`);
        setTimeout(() => setMensagem(''), 2000);
    };

    const tocarMusicaSelecionada = () => {
        console.log('▶️ PLAY pressionado');
        console.log('isConnected:', isConnected);
        console.log('musicaSelecionada:', musicaSelecionada);
        console.log('isPlaying:', isPlaying);

        if (!isConnected) {
            setMensagem('⚠️ Sistema desconectado!');
            setTimeout(() => setMensagem(''), 2000);
            return;
        }

        if (!musicaSelecionada) {
            setMensagem('⚠️ Selecione uma música primeiro!');
            setTimeout(() => setMensagem(''), 2000);
            return;
        }

        const musica = musicasDisponiveis.find(m => m.id === musicaSelecionada);
        console.log('📤 Enviando comando para tocar música ID:', musicaSelecionada);
        tocarMusica(musicaSelecionada);
        setIsPlaying(true);
        setMensagem(`🎶 Tocando: ${musica.nome}`);
        setTimeout(() => setMensagem(''), 3000);
    };

    const pararMusicaAtual = () => {
        console.log('⏹️ STOP pressionado');
        console.log('isConnected:', isConnected);
        console.log('isPlaying:', isPlaying);

        if (!isConnected) {
            setMensagem('⚠️ Sistema desconectado!');
            setTimeout(() => setMensagem(''), 2000);
            return;
        }

        console.log('📤 Enviando comando para parar música');
        pararMusica();
        setIsPlaying(false);
        setMensagem('⏹️ Música parada');
        setTimeout(() => setMensagem(''), 2000);
    };

    return (
        <div className="flex flex-col items-center px-6 py-8 w-full font-bold bg-white border-pink-400 border-solid border-[10px] rounded-[32px] text-amber-950">
            {/* Título */}
            <section className="text-5xl max-md:text-4xl mb-2">
                Músicas
            </section>

            {/* Status de conexão */}
            <div className={`text-sm mb-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                {isConnected ? '🎧 Sistema de áudio pronto' : '⚠️ Áudio desconectado'}
            </div>

            {/* Status de execução */}
            {isPlaying && (
                <div className="text-sm text-green-500 animate-pulse mb-4">
                    🎵 Música em execução...
                </div>
            )}

            {/* Mensagem de feedback */}
            {mensagem && (
                <div className="text-sm text-pink-600 mb-4 animate-pulse">
                    {mensagem}
                </div>
            )}

            {/* Música selecionada */}
            <div className="text-sm text-gray-500 mb-6">
                {musicaSelecionada ? (
                    <span>✅ Selecionado: {musicasDisponiveis.find(m => m.id === musicaSelecionada)?.nome}</span>
                ) : (
                    <span>⚪ Nenhuma música selecionada</span>
                )}
            </div>

            {/* Botões de seleção de música (igual estilo dos LEDs) */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
                {musicasDisponiveis.map(musica => (
                    <button
                        key={musica.id}
                        onClick={() => selecionarMusica(musica)}
                        disabled={!isConnected}
                        className={`
                            flex items-center justify-center gap-3 py-4 px-3 rounded-xl
                            transition-all duration-200 transform
                            font-bold text-white text-lg
                            ${musicaSelecionada === musica.id
                                ? 'scale-105 ring-4 ring-pink-400 shadow-lg bg-orange-600'
                                : 'hover:scale-102 bg-amber-600 hover:bg-amber-700'
                            }
                            ${!isConnected ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'cursor-pointer'}
                        `}
                    >
                        <span className="text-2xl">{musica.emoji}</span>
                        <span>{musica.nome}</span>
                    </button>
                ))}
            </div>

            {/* Botões de controle PLAY e STOP */}
            <div className="flex gap-6 w-full max-w-md">
                {/* Botão PLAY */}
                <button
                    onClick={tocarMusicaSelecionada}
                    disabled={!isConnected || !musicaSelecionada || isPlaying}
                    className={`
                        flex-1 py-4 rounded-xl font-bold text-white text-xl
                        transition-all duration-200 transform
                        flex items-center justify-center gap-3
                        ${(!isConnected || !musicaSelecionada || isPlaying)
                            ? 'bg-gray-400 cursor-not-allowed opacity-50'
                            : 'bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-95'
                        }
                    `}
                >
                    <span>▶️</span> PLAY
                </button>

                {/* Botão STOP */}
                <button
                    onClick={pararMusicaAtual}
                    disabled={!isConnected || !isPlaying}
                    className={`
                        flex-1 py-4 rounded-xl font-bold text-white text-xl
                        transition-all duration-200 transform
                        flex items-center justify-center gap-3
                        ${(!isConnected || !isPlaying)
                            ? 'bg-gray-400 cursor-not-allowed opacity-50'
                            : 'bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95'
                        }
                    `}
                >
                    <span>⏹️</span> STOP
                </button>
            </div>

            {/* Dica de uso */}
            <div className="mt-6 text-xs text-gray-400 text-center">
                <p>💡 1. Selecione uma música &nbsp;&nbsp; 2. Clique em PLAY &nbsp;&nbsp; 3. Use STOP para parar</p>
            </div>
        </div>
    );
}

export default Musicas;