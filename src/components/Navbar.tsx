"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image src="/logo.png" alt="Playa Logo" width={40} height={40} />
          Playa
        </Link>
        <nav className={styles.navLinks}>
          <Link href="/" className={pathname === "/" ? styles.active : ""}>
            Accueil
          </Link>
          <Link href="/catalog" className={pathname === "/catalog" ? styles.active : ""}>
            Catalogue
          </Link>
        </nav>
        <div className={styles.actions}>
          {status === "loading" ? (
            <div style={{ width: "100px" }}></div>
          ) : session ? (
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              {session.user?.role === "ADMIN" && (
                <Link href="/admin" className="btn" style={{ background: "var(--primary-color)", color: "#000", border: "none" }}>
                  Admin
                </Link>
              )}
              <span style={{ fontWeight: 600 }}>Salut, {session.user?.name} !</span>
              <button onClick={() => signOut()} className="btn btn-outline">
                Déconnexion
              </button>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-outline">Connexion</Link>
              <Link href="/auth/register" className="btn btn-primary" style={{ marginLeft: "10px" }}>Inscription</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
