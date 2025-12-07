'use client';

import React from 'react';
import { WifiOff } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm w-full">
                <div className="bg-red-100 p-4 rounded-full mb-6">
                    <WifiOff className="w-12 h-12 text-red-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">No tienes conexión</h1>
                <p className="text-gray-500 mb-8">
                    No te preocupes. Puedes seguir consultando los datos guardados anteriormente, pero algunas funciones estarán limitadas hasta que recuperes la conexión.
                </p>

                <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors mb-3"
                >
                    Reintentar
                </button>

                <Link href="/" className="text-indigo-600 font-medium hover:text-indigo-800">
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
}
