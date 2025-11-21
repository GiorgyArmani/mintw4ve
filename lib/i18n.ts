import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Language = "en" | "es"

interface LanguageState {
    language: Language
    setLanguage: (lang: Language) => void
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            language: "en",
            setLanguage: (lang) => set({ language: lang }),
        }),
        {
            name: "mintwave-language",
        },
    ),
)

// Translation dictionaries
export const translations = {
    en: {
        // Navigation
        nav: {
            home: "Home",
            listen: "Listen",
            dashboard: "Dashboard",
            upload: "Upload",
            marketplace: "Marketplace",
            docs: "Docs",
            tracks: "Tracks",
        },
        // Listen page
        listen: {
            title: "Discover Music",
            subtitle: "Stream tracks from independent artists. Support them with $WAVE tips.",
            connectWallet: "Connect your wallet to follow artists, like tracks, and send tips",
            noTracks: "No tracks found in this genre",
            playing: "Playing",
            genres: {
                all: "All",
                hiphop: "Hip-Hop",
                electronic: "Electronic",
                rock: "Rock",
                pop: "Pop",
                rnb: "R&B",
                jazz: "Jazz",
                indie: "Indie",
            },
        },
        // Social actions
        social: {
            like: "Like",
            comment: "Comment",
            share: "Share",
            tip: "Tip",
            tipArtist: "Tip Artist",
            follow: "Follow",
            following: "Following",
            followers: "Followers",
            supportArtist: "Support Artist",
        },
        // Comments
        comments: {
            addComment: "Add a comment...",
            post: "Post",
            posting: "Posting...",
            noComments: "No comments yet. Be the first!",
            loading: "Loading comments...",
            connectToComment: "Connect your wallet to comment",
        },
        // Tips
        tips: {
            sendTip: "Send $WAVE tokens to show your appreciation",
            amount: "Amount ($WAVE)",
            yourBalance: "Your balance",
            send: "Send",
            sending: "Sending...",
            cancel: "Cancel",
            success: "Sent {amount} $WAVE to {artist}!",
            error: "Failed to send tip",
            invalidAmount: "Please enter a valid amount",
            insufficientBalance: "Insufficient $WAVE balance",
        },
        // Dashboard
        dashboard: {
            title: "Dashboard",
            yourTracks: "Your Tracks",
            earnings: "Earnings",
            stats: "Stats",
            totalPlays: "Total Plays",
            totalEarnings: "Total Earnings",
        },
        // Auth
        auth: {
            login: "Login",
            signup: "Sign Up",
            signout: "Sign Out",
        },
        // Footer
        footer: {
            tagline: "Mint your art. Ride your wave.",
            description: "Decentralized music distribution on Ethereum.",
            platform: "Platform",
            resources: "Resources",
            legal: "Legal",
            howItWorks: "How It Works",
            documentation: "Documentation",
            faq: "FAQ",
            privacy: "Privacy Policy",
            terms: "Terms of Service",
            licenses: "Licenses",
            rights: "All rights reserved.",
        },
        // Home Page
        home: {
            hero: {
                title: "Mint your art.",
                subtitle: "Ride your wave.",
                description: "The decentralized music label where artists upload tracks, earn $WAVE tokens for streams, and access a global artist marketplace.",
                startMinting: "Start Minting",
                exploreMarket: "Explore Marketplace",
            },
            features: {
                title: "How MINTWAVE Works",
                subtitle: "Three simple pillars of the decentralized creative economy",
                mint: {
                    title: "Upload & Mint",
                    description: "Upload your tracks and mint them as NFTs on Ethereum. Each track becomes a unique digital asset that proves your ownership.",
                },
                stream: {
                    title: "Stream2Earn",
                    description: "Earn $WAVE tokens every time someone listens to your music. The more plays you get, the more tokens you accumulate.",
                },
                market: {
                    title: "Artist Marketplace",
                    description: "Spend your $WAVE tokens on services from other artists. Get beats, cover art, mixing, and video editing within the ecosystem.",
                },
            },
            token: {
                badge: "ERC-20 UTILITY TOKEN",
                title: "The $WAVE Token",
                description: "$WAVE is the native currency of our ecosystem. It's not just a token; it's proof of your contribution to the culture. Fully decentralized, transparent, and owned by the community.",
                earn: "Earn",
                spend: "Spend",
                earnList: ["Streams & Plays", "Collaborations", "Service Provider"],
                spendList: ["Beats & Production", "Visual Art", "Mixing & Mastering"],
            },
            cta: {
                title: "Ready to join the revolution?",
                description: "Connect your wallet and start minting your tracks today. No fees, no gatekeepers, just you and your art.",
                button: "Get Started Now",
            },
        },
    },
    es: {
        // Navegación
        nav: {
            home: "Inicio",
            listen: "Escuchar",
            dashboard: "Panel",
            upload: "Subir",
            marketplace: "Mercado",
            docs: "Docs",
            tracks: "Pistas",
        },
        // Página de escuchar
        listen: {
            title: "Descubre Música",
            subtitle: "Escucha pistas de artistas independientes. Apóyalos con propinas $WAVE.",
            connectWallet: "Conecta tu billetera para seguir artistas, dar me gusta y enviar propinas",
            noTracks: "No se encontraron pistas en este género",
            playing: "Reproduciendo",
            genres: {
                all: "Todo",
                hiphop: "Hip-Hop",
                electronic: "Electrónica",
                rock: "Rock",
                pop: "Pop",
                rnb: "R&B",
                jazz: "Jazz",
                indie: "Indie",
            },
        },
        // Acciones sociales
        social: {
            like: "Me gusta",
            comment: "Comentar",
            share: "Compartir",
            tip: "Propina",
            tipArtist: "Dar Propina",
            follow: "Seguir",
            following: "Siguiendo",
            followers: "Seguidores",
            supportArtist: "Apoyar Artista",
        },
        // Comentarios
        comments: {
            addComment: "Añade un comentario...",
            post: "Publicar",
            posting: "Publicando...",
            noComments: "No hay comentarios aún. ¡Sé el primero!",
            loading: "Cargando comentarios...",
            connectToComment: "Conecta tu billetera para comentar",
        },
        // Propinas
        tips: {
            sendTip: "Envía tokens $WAVE para mostrar tu aprecio",
            amount: "Cantidad ($WAVE)",
            yourBalance: "Tu saldo",
            send: "Enviar",
            sending: "Enviando...",
            cancel: "Cancelar",
            success: "¡Enviaste {amount} $WAVE a {artist}!",
            error: "Error al enviar propina",
            invalidAmount: "Por favor ingresa una cantidad válida",
            insufficientBalance: "Saldo $WAVE insuficiente",
        },
        // Panel
        dashboard: {
            title: "Panel",
            yourTracks: "Tus Pistas",
            earnings: "Ganancias",
            stats: "Estadísticas",
            totalPlays: "Reproducciones Totales",
            totalEarnings: "Ganancias Totales",
        },
        // Auth
        auth: {
            login: "Iniciar Sesión",
            signup: "Registrarse",
            signout: "Cerrar Sesión",
        },
        // Footer
        footer: {
            tagline: "Acuña tu arte. Monta tu ola.",
            description: "Distribución de música descentralizada en Ethereum.",
            platform: "Plataforma",
            resources: "Recursos",
            legal: "Legal",
            howItWorks: "Cómo Funciona",
            documentation: "Documentación",
            faq: "Preguntas Frecuentes",
            privacy: "Política de Privacidad",
            terms: "Términos de Servicio",
            licenses: "Licencias",
            rights: "Todos los derechos reservados.",
        },
        // Página de Inicio
        home: {
            hero: {
                title: "Acuña tu arte.",
                subtitle: "Monta tu ola.",
                description: "El sello musical descentralizado donde los artistas suben pistas, ganan tokens $WAVE por reproducciones y acceden a un mercado global de artistas.",
                startMinting: "Empezar a Acuñar",
                exploreMarket: "Explorar Mercado",
            },
            features: {
                title: "Cómo Funciona MINTWAVE",
                subtitle: "Tres pilares simples de la economía creativa descentralizada",
                mint: {
                    title: "Subir y Acuñar",
                    description: "Sube tus pistas y acúñalas como NFTs en Ethereum. Cada pista se convierte en un activo digital único que prueba tu propiedad.",
                },
                stream: {
                    title: "Stream2Earn",
                    description: "Gana tokens $WAVE cada vez que alguien escucha tu música. Cuantas más reproducciones obtengas, más tokens acumularás.",
                },
                market: {
                    title: "Mercado de Artistas",
                    description: "Gasta tus tokens $WAVE en servicios de otros artistas. Consigue beats, portadas, mezcla y edición de video dentro del ecosistema.",
                },
            },
            token: {
                badge: "TOKEN DE UTILIDAD ERC-20",
                title: "El Token $WAVE",
                description: "$WAVE es la moneda nativa de nuestro ecosistema. No es solo un token; es prueba de tu contribución a la cultura. Totalmente descentralizado, transparente y propiedad de la comunidad.",
                earn: "Ganar",
                spend: "Gastar",
                earnList: ["Reproducciones", "Colaboraciones", "Proveedor de Servicios"],
                spendList: ["Beats y Producción", "Arte Visual", "Mezcla y Masterización"],
            },
            cta: {
                title: "¿Listo para unirte a la revolución?",
                description: "Conecta tu billetera y empieza a acuñar tus pistas hoy. Sin tarifas, sin guardianes, solo tú y tu arte.",
                button: "Empezar Ahora",
            },
        },
    },
}

// Helper hook to get translations
export function useTranslation() {
    const { language } = useLanguageStore()
    return {
        t: translations[language],
        language,
    }
}
