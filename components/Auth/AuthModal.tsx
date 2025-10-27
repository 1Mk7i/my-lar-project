// components/Auth/AuthModal.tsx
"use client";

import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialMode?: "login" | "register";
}

export function AuthModal({
    isOpen,
    onClose,
    onSuccess,
    initialMode = "login",
}: AuthModalProps) {
    const [mode, setMode] = useState<"login" | "register">(initialMode);

    if (!isOpen) return null;

    const handleSuccess = () => {
        if (onSuccess) {
            onSuccess();
        }
        onClose();
    };

    const handleSwitchToLogin = () => {
        setMode("login");
    };

    const handleSwitchToRegister = () => {
        setMode("register");
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                    ×
                </button>

                {mode === "login" ? (
                    <LoginForm
                        onSuccess={handleSuccess}
                        onClose={onClose}
                        onSwitchToRegister={handleSwitchToRegister}
                    />
                ) : (
                    <RegisterForm
                        onSuccess={handleSuccess}
                        onClose={onClose}
                        onSwitchToLogin={handleSwitchToLogin}
                    />
                )}
            </div>
        </div>
    );
}
