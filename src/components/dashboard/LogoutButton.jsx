import { LogOut } from "lucide-react";
import { API_ENDPOINTS, API_URL } from '../config/api';
import { useNavigate } from "react-router-dom";

export function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.AUTH.SIGN_OUT, {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                // Redirect to login page
                navigate("/login");
            } else {
                console.error("Logout failed");
                alert("Erro ao fazer logout. Tente novamente.");
            }
        } catch (error) {
            console.error("Logout error:", error);
            alert("Erro ao conectar com o servidor.");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-transparent hover:border-red-500/20"
        >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sair</span>
        </button>
    );
}
