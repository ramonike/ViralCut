import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../api/admin';
import { User, Search, Mail, CheckCircle2, XCircle, Calendar, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const pageSize = 20;

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchUsers(page, pageSize, search);
            setUsers(data.users);
            setTotalPages(data.totalPages);
            setTotal(data.total);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [page, search]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on search
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen w-full bg-slate-900 text-slate-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="glass-panel rounded-2xl p-6 border border-surface-700/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <User className="w-8 h-8 text-primary" />
                                </div>
                                Painel de Administração
                            </h1>
                            <p className="text-slate-400 mt-2">Gerencie todos os usuários cadastrados</p>
                        </div>
                        <Button
                            onClick={loadUsers}
                            variant="outline"
                            className="border-surface-600 bg-surface-800 text-slate-200 hover:bg-surface-700"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Atualizar
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <User className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs uppercase font-bold">Total de Usuários</p>
                                <p className="text-2xl font-black text-white">{total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 rounded-xl">
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs uppercase font-bold">Email Verificado</p>
                                <p className="text-2xl font-black text-white">
                                    {users.filter(u => u.emailVerified).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-500/10 rounded-xl">
                                <XCircle className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs uppercase font-bold">Pendente</p>
                                <p className="text-2xl font-black text-white">
                                    {users.filter(u => !u.emailVerified).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="glass-panel rounded-xl p-4 border border-surface-700/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Buscar por nome ou email..."
                            value={search}
                            onChange={handleSearchChange}
                            className="pl-10 bg-surface-800 border-surface-600 text-white"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="glass-panel rounded-xl overflow-hidden border border-surface-700/50">
                    {loading ? (
                        <div className="p-12 text-center">
                            <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                            <p className="text-slate-400">Carregando usuários...</p>
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center">
                            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                            <p className="text-red-400">{error}</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-12 text-center">
                            <User className="w-8 h-8 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400">Nenhum usuário encontrado</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-surface-800/50 border-b border-surface-700">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                Usuário
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                Cadastro
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-700">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-surface-800/30 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-white">{user.name}</p>
                                                            <p className="text-xs text-slate-500">{user.id.substring(0, 8)}...</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-slate-300">
                                                        <Mail className="w-4 h-4 text-slate-500" />
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.emailVerified ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Verificado
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                            <XCircle className="w-3 h-3" />
                                                            Pendente
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(user.createdAt)}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 bg-surface-800/30 border-t border-surface-700 flex items-center justify-between">
                                    <p className="text-sm text-slate-400">
                                        Página {page} de {totalPages} • {total} usuários no total
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            variant="outline"
                                            size="sm"
                                            className="border-surface-600 bg-surface-800 text-slate-200 hover:bg-surface-700 disabled:opacity-50"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            variant="outline"
                                            size="sm"
                                            className="border-surface-600 bg-surface-800 text-slate-200 hover:bg-surface-700 disabled:opacity-50"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
