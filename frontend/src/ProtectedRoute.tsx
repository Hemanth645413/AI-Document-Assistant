import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "./services/supabase";

type Props = {
    children: ReactNode;
};

function ProtectedRoute({ children }: Props) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        setAuthenticated(!!session);
        setLoading(false);
    };

    if (loading) return <h2>Loading...</h2>;

    if (!authenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;