import { useAppDispatch } from "@/app/hooks";
import { fetchUser, setUser } from "@/features/auth/userSlice";
import { supabase } from "@/utils/supabase";
import { LayoutFooter, LayoutHeader } from "@/widgets";
import React, { FC } from "react";
import { Outlet } from "react-router-dom";

const Layout: FC = () => {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    dispatch(fetchUser());

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        dispatch(fetchUser());
      } else if (event === "SIGNED_OUT") {
        dispatch(setUser(null));
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);
  return (
    <div className="h-screen overflow-x-hidden">
      <LayoutHeader />
      <main>
        <Outlet />
      </main>
      <LayoutFooter />
    </div>
  );
};

export default Layout;
