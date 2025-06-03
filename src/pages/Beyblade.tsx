import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

interface BeybladeGameProps {
    width?: string | number;
    height?: string | number;
    allowFullscreen?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * BeybladeGame Component
 * 
 * This component embeds the Beyblade game from itch.io directly into a React/Vite application.
 * It handles responsive sizing, loading states, and provides fallback content if embedding fails.
 * The game container automatically fills the screen space below the header with no scrolling.
 * 
 * @param {BeybladeGameProps} props - Component properties
 * @returns {JSX.Element} - The rendered component
 */
const BeybladeGame: React.FC<BeybladeGameProps> = ({
    width = '100%',
    allowFullscreen = true,
    className = '',
    style = {},
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // The direct URL to the game
    const gameUrl = 'https://html-classic.itch.zone/html/6995951/index.html';

    // Handle iframe load events
    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    // Handle iframe error events
    const handleIframeError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    // Effect to check if iframe loaded correctly
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (isLoading) {
                // If still loading after timeout, assume there might be an issue
                // but don't set error yet as it might still be loading
                console.warn('Game iframe is taking longer than expected to load');
            }
        }, 10000);

        return () => clearTimeout(timeoutId);
    }, [isLoading]);

    // Effect to adjust game container height based on viewport and header height
    useEffect(() => {
        const adjustHeight = () => {
            if (containerRef.current && headerRef.current) {
                const viewportHeight = window.innerHeight;
                const headerHeight = headerRef.current.offsetHeight;
                const newHeight = viewportHeight - headerHeight;
                
                // Set the container height to fill remaining space
                containerRef.current.style.height = `${newHeight}px`;
            }
        };

        // Initial adjustment
        adjustHeight();

        // Adjust on window resize
        window.addEventListener('resize', adjustHeight);
        return () => window.removeEventListener('resize', adjustHeight);
    }, []);

    // Container styles for responsive design
    const containerStyle: React.CSSProperties = {
        position: 'relative',
        width: typeof width === 'number' ? `${width}px` : width,
        overflow: 'hidden',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        ...style,
    };

    // Loading indicator styles
    const loadingStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        zIndex: 1,
    };

    // Error message styles
    const errorStyle: React.CSSProperties = {
        ...loadingStyle,
        flexDirection: 'column',
        textAlign: 'center',
        padding: '20px',
    };

    // Iframe styles
    const iframeStyle: React.CSSProperties = {
        border: 'none',
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
            {/* Header */}
            <header ref={headerRef} className="p-6 flex-shrink-0">
                <div className="container mx-auto grid grid-cols-3 items-center">
                    {/* Left navigation - hidden on mobile */}
                    <div className="hidden md:flex justify-start">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/')}
                            className="text-white hover:bg-white/10"
                        >
                            ← Back to Home
                        </Button>
                    </div>

                    {/* Centered title */}
                    <div className="flex justify-center">
                        <h1 className="text-2xl text-center">$beyblade | <strong>Let it rip.</strong> | BattleBlade</h1>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
                    >
                        <Menu size={24} />
                    </Button>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex justify-end gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/generator')}
                            className="text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
                        >
                            Generator
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/gallery')}
                            className="text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
                        >
                            Gallery
                        </Button>
                        <Button
                            asChild
                            variant="ghost"
                            className="text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
                        >
                            <a
                                href="https://x.com/i/communities/1928460541435273435"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2"
                            >
                                <svg width="16" height="16" viewBox="0 0 300 301" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M178.57 127.044L290.27 0H263.81L166.78 110.288L89.34 0H0L117.13 166.791L0 300H26.46L128.86 183.507L210.66 300H300M36.01 19.5237H76.66L263.79 281.435H223.13" fill="currentColor" />
                                </svg>
                                <span>Community</span>
                            </a>
                        </Button>
                    </nav>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <nav className="md:hidden mt-4 flex flex-col gap-2 animate-fade-in">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/')}
                            className="w-full text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
                        >
                            ← Back to Home
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/generator')}
                            className="w-full text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
                        >
                            Generator
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/gallery')}
                            className="text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
                        >
                            Gallery
                        </Button>
                        <Button
                            asChild
                            variant="ghost"
                            className="w-full text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
                        >
                            <a
                                href="https://x.com/i/communities/1928460541435273435"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2"
                            >
                                <svg width="16" height="16" viewBox="0 0 300 301" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M178.57 127.044L290.27 0H263.81L166.78 110.288L89.34 0H0L117.13 166.791L0 300H26.46L128.86 183.507L210.66 300H300M36.01 19.5237H76.66L263.79 281.435H223.13" fill="currentColor" />
                                </svg>
                                <span>Community</span>
                            </a>
                        </Button>
                    </nav>
                )}
            </header>
            
            {/* Game container - flex-grow-1 makes it fill all remaining space */}
            <div
                ref={containerRef}
                className={`beyblade-game-container flex-grow ${className}`}
                style={containerStyle}
                data-testid="beyblade-game-container"
            >
                {isLoading && (
                    <div style={loadingStyle}>
                        <div>
                            <div style={{ marginBottom: '20px', fontSize: '24px' }}>Loading Beyblade Game...</div>
                            <div className="loading-spinner" style={{
                                width: '40px',
                                height: '40px',
                                margin: '0 auto',
                                border: '4px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '50%',
                                borderTop: '4px solid #ffffff',
                                animation: 'spin 1s linear infinite',
                            }}></div>
                            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}</style>
                        </div>
                    </div>
                )}

                {hasError && (
                    <div style={errorStyle}>
                        <h2 style={{ color: '#ff5555', marginBottom: '15px' }}>Unable to Load Game</h2>
                        <p>
                            The Beyblade game could not be loaded. This might be due to content security policies
                            or cross-origin restrictions.
                        </p>
                        <p style={{ marginTop: '15px' }}>
                            You can try playing the game directly on{' '}
                            <a
                                href="https://vdaimo.itch.io/beyblade"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#55aaff' }}
                            >
                                itch.io
                            </a>
                        </p>
                    </div>
                )}

                <iframe
                    ref={iframeRef}
                    src={gameUrl}
                    style={iframeStyle}
                    allowFullScreen={allowFullscreen}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    title="Beyblade Game"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"
                    loading="lazy"
                />
            </div>
        </div>
    );
};

export default BeybladeGame;
